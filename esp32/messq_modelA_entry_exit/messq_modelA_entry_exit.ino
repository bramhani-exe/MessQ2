/*
 * MessQ Model A — Separate ENTRY / EXIT gates
 * Board: ESP32 Dev Module | Arduino framework
 * Required libraries (Arduino Library Manager): ArduinoJson@7
 * Built-in: WiFi.h, HTTPClient.h, WebServer.h
 *
 * Wiring:
 *  IR Sensor 1 (ENTRY) DO -> GPIO 34, VCC -> 5V (or 3.3V per module), GND -> GND
 *  IR Sensor 2 (EXIT)  DO -> GPIO 35, VCC -> 5V, GND -> GND
 *  GPIO 34/35 are input-only, no internal pull-up. The IR module's DO
 *  already drives HIGH/LOW. If floating, add 10k pull-up to 3.3V.
 *
 * Logic (Model A):
 *  ENTRY falling edge (HIGH->LOW) = +1, EXIT falling edge = -1
 *  queue_count = clamp(entries - exits, 0, MAX_CAPACITY)
 *  Debounce 120ms + per-sensor cooldown 1800ms to avoid double count.
 *  Typical IR obstacle module: HIGH = clear, LOW = person detected.
 *  If yours is inverted, set TRIGGER_LEVEL to HIGH below.
 *
 * Data flow (production):
 *  ESP32 keeps authoritative count, POSTs JSON to Vercel /api/queue
 *  on every change + heartbeat every 15s. Also hosts GET /status
 *  for direct same-WiFi testing by the MessQ frontend.
 *  Local Node server/server.js remains as optional offline fallback.
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <WebServer.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>

// ---------- USER CONFIG (placeholders only — set real values on your own copy, never commit them) ----------
const char* WIFI_SSID = "YOUR_HOTSPOT_SSID_2_4GHZ";
const char* WIFI_PASS = "YOUR_HOTSPOT_PASSWORD";

// Production (Vercel): "https://<your-app>.vercel.app/api/queue"
// Offline fallback (laptop): "http://10.243.117.122:3001/api/queue"
const char* SERVER_URL = "http://10.123.253.122:3001/api/queue";
const char* API_KEY = "PASTE_MESSQ_API_KEY_HERE";  // must match MESSQ_API_KEY env (server/Vercel). Never commit the real key.

// ---------- PINS ----------
const int PIN_ENTRY = 34;  // IR Sensor 1
const int PIN_EXIT  = 35;  // IR Sensor 2
const int TRIGGER_LEVEL = LOW;  // LOW = person detected (flip to HIGH if inverted)

// ---------- TUNING ----------
const unsigned long DEBOUNCE_MS = 120;
const unsigned long COOLDOWN_MS = 1800;   // min gap between two counts on same sensor
const unsigned long HEARTBEAT_MS = 15000; // resend even with no motion
const int MAX_CAPACITY = 45;

// ---------- STATE ----------
long entries = 0;
long exits = 0;
int queueCount = 0;
int lastEntryLevel = HIGH;
int lastExitLevel = HIGH;
unsigned long lastEntryEdgeMs = 0;
unsigned long lastExitEdgeMs = 0;
unsigned long lastEntryCountMs = 0;
unsigned long lastExitCountMs = 0;
unsigned long lastPostMs = 0;
unsigned long bootMs = 0;

WebServer web(80);

int currentLevel(int pin) { return digitalRead(pin); }

void recomputeQueue() {
  long q = entries - exits;
  if (q < 0) q = 0;
  if (q > MAX_CAPACITY) q = MAX_CAPACITY;
  queueCount = (int)q;
}

bool sendToServer(const char* reason) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[POST] skipped, WiFi down");
    return false;
  }
  String url = String(SERVER_URL);
  bool isHttps = url.startsWith("https");
  WiFiClientSecure secure;
  if (isHttps) secure.setInsecure();  // prototype: skip CA verify; use cert bundle for hardened setup

  HTTPClient http;
  if (isHttps) http.begin(secure, SERVER_URL);
  else http.begin(SERVER_URL);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("x-api-key", API_KEY);
  http.setTimeout(6000);

  JsonDocument doc;
  doc["device_id"] = "ESP32_MESS_Q01";
  doc["queue_count"] = queueCount;
  doc["entries"] = entries;
  doc["exits"] = exits;
  doc["ir1_state"] = digitalRead(PIN_ENTRY);
  doc["ir2_state"] = digitalRead(PIN_EXIT);
  doc["reason"] = reason;
  doc["rssi"] = WiFi.RSSI();
  doc["uptime_sec"] = (millis() - bootMs) / 1000;

  String body;
  serializeJson(doc, body);
  int code = http.POST(body);
  Serial.printf("[POST] %s -> HTTP %d | %s\n", reason, code, body.c_str());
  http.end();
  return (code >= 200 && code < 300);
}

void handleStatus() {
  JsonDocument doc;
  doc["device_id"] = "ESP32_MESS_Q01";
  doc["queue_count"] = queueCount;
  doc["entries"] = entries;
  doc["exits"] = exits;
  doc["ir1_state"] = digitalRead(PIN_ENTRY);
  doc["ir2_state"] = digitalRead(PIN_EXIT);
  doc["rssi"] = (WiFi.status() == WL_CONNECTED) ? WiFi.RSSI() : 0;
  doc["uptime_sec"] = (millis() - bootMs) / 1000;
  doc["wifi"] = (WiFi.status() == WL_CONNECTED) ? "CONNECTED" : "DISCONNECTED";
  doc["ip"] = WiFi.localIP().toString();
  String out;
  serializeJson(doc, out);
  web.sendHeader("Access-Control-Allow-Origin", "*");
  web.send(200, "application/json", out);
}

void handleReset() {
  // GET /reset?key=YOUR_API_KEY — zero counters at mess closing time
  if (!web.hasArg("key") || String(web.arg("key")) != String(API_KEY)) {
    web.send(403, "text/plain", "forbidden");
    return;
  }
  entries = 0; exits = 0; recomputeQueue();
  sendToServer("manual_reset");
  web.send(200, "text/plain", "counters reset");
}

void setup() {
  Serial.begin(115200);
  delay(300);
  bootMs = millis();
  pinMode(PIN_ENTRY, INPUT);
  pinMode(PIN_EXIT, INPUT);
  lastEntryLevel = digitalRead(PIN_ENTRY);
  lastExitLevel = digitalRead(PIN_EXIT);

  Serial.println("\n=== MessQ Model A (ENTRY GPIO34 / EXIT GPIO35) ===");
  Serial.printf("TRIGGER_LEVEL=%s\n", TRIGGER_LEVEL == LOW ? "LOW" : "HIGH");

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("WiFi connecting");
  unsigned long t0 = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - t0 < 20000) {
    delay(400); Serial.print(".");
  }
  Serial.println();
  if (WiFi.status() == WL_CONNECTED) {
    Serial.print("WiFi OK, IP: "); Serial.println(WiFi.localIP());
  } else {
    Serial.println("WiFi FAILED — will keep counting offline, retry in loop");
  }

  web.on("/status", handleStatus);
  web.on("/reset", handleReset);
  web.begin();
  Serial.println("HTTP /status on port 80");
  recomputeQueue();
  sendToServer("boot");
  lastPostMs = millis();
}

void ensureWiFi() {
  static unsigned long lastRetry = 0;
  if (WiFi.status() == WL_CONNECTED) return;
  if (millis() - lastRetry < 10000) return;
  lastRetry = millis();
  Serial.println("[WiFi] reconnecting...");
  WiFi.disconnect();
  WiFi.reconnect();
}

void pollSensor(int pin, int &lastLevel, unsigned long &lastEdgeMs,
                unsigned long &lastCountMs, bool isEntry) {
  int lvl = digitalRead(pin);
  unsigned long now = millis();
  // falling edge into TRIGGER_LEVEL with debounce
  if (lvl == TRIGGER_LEVEL && lastLevel != TRIGGER_LEVEL &&
      (now - lastEdgeMs) > DEBOUNCE_MS) {
    lastEdgeMs = now;
    if ((now - lastCountMs) > COOLDOWN_MS) {
      lastCountMs = now;
      if (isEntry) {
        entries++; recomputeQueue();
        Serial.printf("[ENTRY] person in -> entries=%ld queue=%d\n", entries, queueCount);
        sendToServer("entry");
      } else {
        exits++; recomputeQueue();
        Serial.printf("[EXIT] person out -> exits=%ld queue=%d\n", exits, queueCount);
        sendToServer("exit");
      }
      lastPostMs = now;
    } else {
      Serial.println("[IGN] cooldown, possible linger/double-trigger");
    }
  }
  lastLevel = lvl;
}

void loop() {
  web.handleClient();
  ensureWiFi();
  pollSensor(PIN_ENTRY, lastEntryLevel, lastEntryEdgeMs, lastEntryCountMs, true);
  pollSensor(PIN_EXIT, lastExitLevel, lastExitEdgeMs, lastExitCountMs, false);
  if (millis() - lastPostMs > HEARTBEAT_MS) {
    lastPostMs = millis();
    sendToServer("heartbeat");
  }
  delay(10);
}
