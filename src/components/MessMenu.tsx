import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Coffee,
  Heart,
  Info,
  Scale,
  Sparkles,
  Utensils,
  UtensilsCrossed
} from 'lucide-react';
import {
  CHIEF_WARDEN_NAME,
  FULL_WEEK_MENU,
  MESS_HALL_NAME,
  MESS_INSTRUCTIONS
} from '../data/mockMenu';
import { FoodSegment, MealSchedule, MealType, MenuItem } from '../types/messq';
import { iotService } from '../services/iotService';

export const MessMenu: React.FC = () => {
  // Determine current meal by local hour matching exact student mess timings:
  // Breakfast: 7:00 AM to 9:00 AM (7.0 - 9.0)
  // Lunch: 12:30 PM to 2:00 PM (12.5 - 14.0)
  // Snacks: 4:45 PM to 6:15 PM (16.75 - 18.25)
  // Dinner: 7:15 PM to 9:00 PM (19.25 - 21.0)
  const getActiveMealId = (): MealType => {
    const hour = new Date().getHours() + new Date().getMinutes() / 60;
    if (hour >= 7.0 && hour < 9.0) return 'BREAKFAST';
    if (hour >= 12.5 && hour < 14.0) return 'LUNCH';
    if (hour >= 16.75 && hour < 18.25) return 'SNACKS';
    if (hour >= 19.25 && hour < 21.0) return 'DINNER';

    // Upcoming meal prediction for off-hours
    if (hour < 7.0) return 'BREAKFAST';
    if (hour < 12.5) return 'LUNCH';
    if (hour < 16.75) return 'SNACKS';
    if (hour < 19.25) return 'DINNER';
    return 'BREAKFAST';
  };

  const [selectedDay, setSelectedDay] = useState<string>('thursday'); // Thursday is today (Sep 17)
  const [selectedMealId, setSelectedMealId] = useState<MealType>(getActiveMealId());
  const [selectedSegment, setSelectedSegment] = useState<'ALL' | FoodSegment>('ALL');
  const [showGuidelines, setShowGuidelines] = useState(false);

  // Student favorites saved in localStorage with student friendly defaults
  const [favoriteNames, setFavoriteNames] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('messq_favorite_dish_names');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read favorite dish names', e);
    }
    return [
      'Hot Aloo Samosa (Crispy)',
      'Chicken 65 (with bone)',
      'Paneer Bhurji (Special)',
      'Mysore Paak (Ghee Sweet)'
    ];
  });

  const daySchedule = FULL_WEEK_MENU[selectedDay] || FULL_WEEK_MENU.thursday;
  const activeMeal = daySchedule.meals.find((m) => m.id === selectedMealId) || daySchedule.meals[0];
  const currentlyServingMealId = getActiveMealId();

  // Find all favorite items that appear in today's menu across all 4 meals
  const todaysSchedule = FULL_WEEK_MENU.thursday;
  const favoritesInToday = todaysSchedule.meals.flatMap((meal) =>
    meal.items
      .filter((item) => favoriteNames.includes(item.name))
      .map((item) => ({ item, meal }))
  );

  // Sync favorites to localStorage & trigger student notifications when user favorites items
  const toggleFavorite = (itemName: string) => {
    let next: string[];
    const isFav = favoriteNames.includes(itemName);
    if (isFav) {
      next = favoriteNames.filter((name) => name !== itemName);
    } else {
      next = [...favoriteNames, itemName];

      // Check if this newly favorited item is in today's menu (any of the 4 meals)
      for (const meal of todaysSchedule.meals) {
        const found = meal.items.find((i) => i.name === itemName);
        if (found) {
          iotService.addNotification(
            `⭐ Favorite in Today's ${meal.title}!`,
            `"${itemName}" is being served today in ${meal.title} (${meal.timing}) at ${MESS_HALL_NAME}!`,
            'SUCCESS'
          );
          break;
        }
      }
    }
    setFavoriteNames(next);
    try {
      localStorage.setItem('messq_favorite_dish_names', JSON.stringify(next));
    } catch (e) {
      console.warn('Could not save favorite dish names', e);
    }
  };

  // On initial mount, push a notification for favorite dishes in today's menu if not already notified
  useEffect(() => {
    if (favoritesInToday.length > 0) {
      const topFav = favoritesInToday[0];
      const hasNotified = sessionStorage.getItem('messq_fav_notified_today');
      if (!hasNotified) {
        sessionStorage.setItem('messq_fav_notified_today', 'true');
        iotService.addNotification(
          `🎉 Favorite on Today's Menu: ${topFav.item.name}!`,
          `Your favorite dish "${topFav.item.name}" is scheduled for ${topFav.meal.title} (${topFav.meal.timing}) at ${MESS_HALL_NAME}!`,
          'SUCCESS'
        );
      }
    }
  }, []);

  const isSnacks = activeMeal.id === 'SNACKS';

  // Filter items by segment: Veg, Non-Veg, Special (Note: Snacks is same for all)
  const filteredItems = activeMeal.items.filter((item) => {
    if (isSnacks) return true; // Snacks is same for all!
    if (selectedSegment === 'ALL') return true;
    return item.segment === selectedSegment;
  });

  const vegCount = activeMeal.items.filter((i) => i.segment === 'VEG').length;
  const nonVegCount = activeMeal.items.filter((i) => i.segment === 'NON_VEG').length;
  const specialCount = activeMeal.items.filter((i) => i.segment === 'SPECIAL').length;

  return (
    <section
      id="mess-menu-section"
      className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 mb-6 shadow-md transition-all"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800/80 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-semibold flex items-center gap-1.5">
              <UtensilsCrossed className="w-3.5 h-3.5" />
              {MESS_HALL_NAME} Daily Menu
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
              Chief Warden: <strong className="text-slate-200">{CHIEF_WARDEN_NAME}</strong>
            </span>
          </div>

          <h2 className="text-lg sm:text-2xl font-bold text-white font-mono">
            Today's Dining Menu
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Veg, Non-Veg & Special meal schedule for September 2026
          </p>
        </div>

        {/* Portion Guidelines toggle */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          <button
            onClick={() => setShowGuidelines(!showGuidelines)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs transition-colors"
          >
            <Scale className="w-3.5 h-3.5 text-cyan-400" />
            <span>Portion Rules</span>
            {showGuidelines ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expandable Official Mess Service Guidelines */}
      {showGuidelines && (
        <div className="mb-5 p-4 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs font-mono animate-in fade-in duration-150">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
            <span className="font-bold text-cyan-300 uppercase tracking-wide flex items-center gap-1.5">
              <Info className="w-4 h-4 text-cyan-400" />
              Official Mess Service Guidelines ({CHIEF_WARDEN_NAME})
            </span>
            <span className="text-[10px] text-slate-500">{MESS_HALL_NAME}</span>
          </div>
          <ul className="space-y-1.5 text-slate-300">
            {MESS_INSTRUCTIONS.map((rule, idx) => (
              <li key={idx} className="text-[11px] leading-relaxed">
                {rule}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Favorite Dishes in Today's Menu Highlight Bar */}
      {favoritesInToday.length > 0 && (
        <div className="mb-4 p-3 bg-gradient-to-r from-amber-950/40 via-slate-950 to-slate-950 border border-amber-500/30 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 rounded-full bg-amber-500/20 text-amber-300 items-center justify-center">
              ⭐
            </span>
            <span className="text-slate-200">
              <strong className="text-amber-300">{favoritesInToday.length} of your favorite dishes</strong> are served today in {MESS_HALL_NAME}!
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {favoritesInToday.slice(0, 3).map(({ item, meal }) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedDay('thursday');
                  setSelectedMealId(meal.id);
                }}
                className="px-2 py-0.5 rounded-md bg-slate-900 hover:bg-slate-800 text-[11px] text-amber-200 border border-amber-500/40 transition-colors"
              >
                {item.name} ({meal.title})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Day Selector (Mobile Horizontal Scroll / Flex) */}
      <div className="mb-4">
        <div className="text-[11px] font-mono text-slate-400 mb-2 uppercase tracking-wider flex items-center justify-between">
          <span>Select Day:</span>
          <span className="text-cyan-400 font-semibold">{daySchedule.dayName} ({daySchedule.datesText})</span>
        </div>
        <div className="flex overflow-x-auto pb-1.5 gap-1.5 no-scrollbar">
          {Object.entries(FULL_WEEK_MENU).map(([key, day]) => {
            const isSelected = selectedDay === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedDay(key)}
                className={`px-3 py-2 rounded-xl text-xs font-mono font-medium whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-500/60 shadow-sm'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {day.dayName}
                {key === 'thursday' && (
                  <span className="ml-1 text-[9px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300">
                    Today
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 Meal Timing Cards: Breakfast (7-9 AM), Lunch (12:30-2 PM), Snacks (4:45-6:15 PM), Dinner (7:15-9 PM) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4">
        {daySchedule.meals.map((meal) => {
          const isSelected = selectedMealId === meal.id;
          const isNowServing = currentlyServingMealId === meal.id;

          return (
            <button
              key={meal.id}
              id={`meal-tab-${meal.id.toLowerCase()}`}
              onClick={() => setSelectedMealId(meal.id)}
              className={`p-3 rounded-xl border text-left transition-all relative ${
                isSelected
                  ? 'bg-slate-950 border-cyan-500/60 shadow-sm'
                  : 'bg-slate-950/40 border-slate-800 hover:bg-slate-950 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-xs font-mono font-bold uppercase tracking-wider ${
                    isSelected ? 'text-cyan-300' : 'text-slate-300'
                  }`}
                >
                  {meal.title}
                </span>

                {isNowServing && (
                  <span className="px-1.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-700 rounded text-[9px] font-mono font-bold animate-pulse">
                    NOW
                  </span>
                )}
              </div>

              <div className="flex items-center text-[11px] text-slate-400 font-mono">
                <Clock className="w-3 h-3 mr-1 text-slate-500 shrink-0" />
                <span className="truncate">{meal.timing}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Snacks Notice OR 3 SEGMENTS SELECTOR (Veg, Non-Veg, Special) */}
      {isSnacks ? (
        <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3.5 mb-4 text-xs font-mono flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Coffee className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-emerald-200">
              <strong>Evening Snacks (4:45 PM – 6:15 PM):</strong> Same common snack menu for all students across Veg, Non-Veg & Special dining.
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 bg-emerald-950 border border-emerald-700/50 px-2 py-0.5 rounded shrink-0">
            Universal Snack
          </span>
        </div>
      ) : (
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 sm:p-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <span className="text-xs font-mono uppercase text-slate-400 font-semibold">
              Filter by Segment:
            </span>
            <div className="text-[11px] font-mono text-slate-400">
              Viewing: <strong className="text-white">{activeMeal.title}</strong> ({activeMeal.timing})
            </div>
          </div>

          {/* 3 Segment Action Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* 1. All Items */}
            <button
              onClick={() => setSelectedSegment('ALL')}
              className={`py-2 px-3 rounded-lg border text-xs font-mono font-medium flex items-center justify-between transition-all ${
                selectedSegment === 'ALL'
                  ? 'bg-slate-800 text-white border-slate-600 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <span>All Items</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-950 text-[10px] text-slate-400">
                {activeMeal.items.length}
              </span>
            </button>

            {/* 2. Veg Segment */}
            <button
              onClick={() => setSelectedSegment('VEG')}
              className={`py-2 px-3 rounded-lg border text-xs font-mono font-medium flex items-center justify-between transition-all ${
                selectedSegment === 'VEG'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/70 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-emerald-300'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Veg
              </span>
              <span className="px-1.5 py-0.2 rounded bg-slate-950 text-[10px] text-emerald-400">
                {vegCount}
              </span>
            </button>

            {/* 3. Non-Veg Segment */}
            <button
              onClick={() => setSelectedSegment('NON_VEG')}
              className={`py-2 px-3 rounded-lg border text-xs font-mono font-medium flex items-center justify-between transition-all ${
                selectedSegment === 'NON_VEG'
                  ? 'bg-rose-950 text-rose-300 border-rose-500/70 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-rose-300'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Non-Veg
              </span>
              <span className="px-1.5 py-0.2 rounded bg-slate-950 text-[10px] text-rose-400">
                {nonVegCount}
              </span>
            </button>

            {/* 4. Special Segment */}
            <button
              onClick={() => setSelectedSegment('SPECIAL')}
              className={`py-2 px-3 rounded-lg border text-xs font-mono font-medium flex items-center justify-between transition-all ${
                selectedSegment === 'SPECIAL'
                  ? 'bg-amber-950 text-amber-300 border-amber-500/70 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-amber-300'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Special
              </span>
              <span className="px-1.5 py-0.2 rounded bg-slate-950 text-[10px] text-amber-400">
                {specialCount}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Menu Items Grid */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-800/60 gap-2">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm sm:text-base font-bold font-mono text-white">
              {activeMeal.title} Menu Items
            </h3>
            <span className="text-xs text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {activeMeal.timing}
            </span>
          </div>

          <span className="text-xs text-slate-400 font-mono">
            {filteredItems.length} items listed
            {!isSnacks && selectedSegment !== 'ALL' && ` in ${selectedSegment.replace('_', ' ')}`}
          </span>
        </div>

        {filteredItems.length === 0 ? (
          <div className="py-8 text-center text-slate-500 font-mono text-xs">
            No items in this segment for {activeMeal.title}. Try switching to "All Items" or choose another meal.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredItems.map((item) => {
              const isFav = favoriteNames.includes(item.name);

              return (
                <div
                  key={item.id}
                  className={`bg-slate-900/80 border rounded-xl p-3.5 flex items-start justify-between transition-colors shadow-sm ${
                    isFav ? 'border-amber-500/50 bg-slate-900/95' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1.5 pr-2 flex-1">
                    <div className="flex items-center space-x-2">
                      {/* Dietary Symbol: Green for Veg, Red for Non-Veg */}
                      {item.isVeg ? (
                        <span
                          className="w-3.5 h-3.5 border border-emerald-500 rounded-sm flex items-center justify-center p-0.5 shrink-0"
                          title="100% Vegetarian"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        </span>
                      ) : (
                        <span
                          className="w-3.5 h-3.5 border border-rose-500 rounded-sm flex items-center justify-center p-0.5 shrink-0"
                          title="Non-Vegetarian"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        </span>
                      )}

                      <h4 className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                        <span>{item.name}</span>
                        {isFav && <span className="text-amber-400 text-xs">★</span>}
                      </h4>
                    </div>

                    {/* Segment Badge + Category */}
                    <div className="flex flex-wrap items-center gap-1.5 pl-5 text-[11px] font-mono">
                      {isSnacks ? (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-[10px]">
                          Common Snack
                        </span>
                      ) : (
                        <>
                          {item.segment === 'VEG' && (
                            <span className="px-1.5 py-0.2 rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-[10px]">
                              Veg
                            </span>
                          )}
                          {item.segment === 'NON_VEG' && (
                            <span className="px-1.5 py-0.2 rounded bg-rose-950/60 border border-rose-800/40 text-rose-400 text-[10px]">
                              Non-Veg
                            </span>
                          )}
                          {item.segment === 'SPECIAL' && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-950/60 border border-amber-800/40 text-amber-300 text-[10px] flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" />
                              Special
                            </span>
                          )}
                        </>
                      )}

                      <span className="text-slate-400 capitalize">• {item.category}</span>

                      {item.calories && (
                        <span className="text-slate-400">• ~{item.calories} kcal</span>
                      )}
                    </div>

                    {/* Portion Note (weighing machine compliance: Chicken 150g/180g, Paneer 75g) */}
                    {item.portionNote && (
                      <div className="pl-5 pt-0.5">
                        <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/50 border border-cyan-800/40 px-1.5 py-0.5 rounded inline-flex items-center gap-1">
                          <Scale className="w-2.5 h-2.5 text-cyan-400" />
                          Portion: {item.portionNote}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Favorite Toggle Button */}
                  <button
                    onClick={() => toggleFavorite(item.name)}
                    title={isFav ? 'Favorited dish (Tap to unfavorite)' : 'Tap heart to get alert when served'}
                    className={`p-1.5 rounded-lg border transition-colors shrink-0 ${
                      isFav
                        ? 'bg-amber-950/60 border-amber-500/60 text-amber-400 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer info strip */}
        <div className="mt-5 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2 font-mono">
          <div className="flex items-center space-x-2">
            <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>
              Tap the heart on any dish to receive a notification alert whenever it is in today's menu.
            </span>
          </div>
          <span className="text-[11px] text-slate-300 shrink-0 font-semibold">
            Chief Warden: {CHIEF_WARDEN_NAME}
          </span>
        </div>
      </div>
    </section>
  );
};
