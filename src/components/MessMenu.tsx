import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Info,
  Scale,
  Star,
  UtensilsCrossed
} from 'lucide-react';
import {
  CHIEF_WARDEN_NAME,
  FULL_WEEK_MENU,
  MESS_HALL_NAME,
  MESS_INSTRUCTIONS
} from '../data/mockMenu';
import { FoodSegment, MealType, MenuItem } from '../types/messq';
import { iotService } from '../services/iotService';

export const MessMenu: React.FC = () => {
  // Official dining timings:
  // Breakfast: 7:00 AM – 9:00 AM
  // Lunch: 12:30 PM – 2:00 PM
  // Snacks: 4:45 PM – 6:15 PM (identical for Veg, Non-Veg, and Special)
  // Dinner: 7:15 PM – 9:00 PM
  const getActiveMealId = (): MealType => {
    const hour = new Date().getHours() + new Date().getMinutes() / 60;
    if (hour >= 7.0 && hour < 9.0) return 'BREAKFAST';
    if (hour >= 12.5 && hour < 14.0) return 'LUNCH';
    if (hour >= 16.75 && hour < 18.25) return 'SNACKS';
    if (hour >= 19.25 && hour < 21.0) return 'DINNER';

    if (hour < 7.0) return 'BREAKFAST';
    if (hour < 12.5) return 'LUNCH';
    if (hour < 16.75) return 'SNACKS';
    if (hour < 19.25) return 'DINNER';
    return 'BREAKFAST';
  };

  const [selectedDay, setSelectedDay] = useState<string>('thursday');
  const [selectedMealId, setSelectedMealId] = useState<MealType>(getActiveMealId());
  const [selectedSegment, setSelectedSegment] = useState<'ALL' | FoodSegment>('ALL');
  const [showGuidelines, setShowGuidelines] = useState(false);

  // Student favorite dishes persisted in localStorage
  const [favoriteNames, setFavoriteNames] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('messq_favorite_dish_names');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
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

  const toggleFavorite = (itemName: string) => {
    let next: string[];
    const isFav = favoriteNames.includes(itemName);
    if (isFav) {
      next = favoriteNames.filter((name) => name !== itemName);
    } else {
      next = [...favoriteNames, itemName];

      // Check if newly favorited item is in today's menu
      for (const meal of todaysSchedule.meals) {
        const found = meal.items.find((i) => i.name === itemName);
        if (found) {
          iotService.addNotification(
            `Favorite Dish in Today's ${meal.title}`,
            `"${itemName}" is scheduled for today's ${meal.title} (${meal.timing}) in ${MESS_HALL_NAME}.`,
            'SUCCESS'
          );
          break;
        }
      }
    }
    setFavoriteNames(next);
    try {
      localStorage.setItem('messq_favorite_dish_names', JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (favoritesInToday.length > 0) {
      const topFav = favoritesInToday[0];
      const hasNotified = sessionStorage.getItem('messq_fav_notified_today');
      if (!hasNotified) {
        sessionStorage.setItem('messq_fav_notified_today', 'true');
        iotService.addNotification(
          `Favorite Dish on Today's Menu: ${topFav.item.name}`,
          `Your favorited dish "${topFav.item.name}" is scheduled for ${topFav.meal.title} (${topFav.meal.timing}) in ${MESS_HALL_NAME}.`,
          'SUCCESS'
        );
      }
    }
  }, []);

  const isSnacks = activeMeal.id === 'SNACKS';

  // Filter items by segment. Snacks is common to all.
  const filteredItems = activeMeal.items.filter((item) => {
    if (isSnacks) return true;
    if (selectedSegment === 'ALL') return true;
    return item.segment === selectedSegment;
  });

  const vegCount = activeMeal.items.filter((i) => i.segment === 'VEG').length;
  const nonVegCount = activeMeal.items.filter((i) => i.segment === 'NON_VEG').length;
  const specialCount = activeMeal.items.filter((i) => i.segment === 'SPECIAL').length;

  return (
    <section
      id="mess-menu-section"
      className="bg-white border border-[#e5dac6] rounded-lg p-5 sm:p-6 mb-6 shadow-xs"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#f0e7d7] gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#c53727] font-semibold flex items-center gap-1.5">
              <UtensilsCrossed className="w-3.5 h-3.5" />
              {MESS_HALL_NAME} Daily Menu
            </span>
            <span className="text-[#ded2be] hidden sm:inline">|</span>
            <span className="text-[11px] font-mono text-[#6b7267] hidden sm:inline">
              Chief Warden: <strong className="text-[#1e231d]">{CHIEF_WARDEN_NAME}</strong>
            </span>
          </div>

          <h2 className="font-heading text-lg sm:text-xl font-bold text-[#1e231d]">
            Hostel Dining Schedule
          </h2>
          <p className="text-xs text-[#6b7267] mt-0.5">
            Vegetarian, Non-Vegetarian &amp; Special meal plan (LH2 Mess)
          </p>
        </div>

        {/* Portion Guidelines toggle */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          <button
            onClick={() => setShowGuidelines(!showGuidelines)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-[#faf7f0] border border-[#e5dac6] hover:bg-[#f5efe3] text-[#4d534b] text-xs transition-colors"
          >
            <Scale className="w-3.5 h-3.5 text-[#236b3d]" />
            <span>Portion Regulations</span>
            {showGuidelines ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expandable Official Mess Guidelines */}
      {showGuidelines && (
        <div className="mb-4 p-4 rounded-md bg-[#faf7f0] border border-[#e5dac6] text-xs font-mono">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#ebdcc7]">
            <span className="font-bold text-[#1e231d] uppercase tracking-wide flex items-center gap-1.5">
              <Info className="w-4 h-4 text-[#c53727]" />
              Official Service Regulations ({CHIEF_WARDEN_NAME})
            </span>
            <span className="text-[10px] text-[#7a8077]">{MESS_HALL_NAME}</span>
          </div>
          <ul className="space-y-1.5 text-[#4d534b] text-[11px] leading-relaxed">
            {MESS_INSTRUCTIONS.map((rule, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-[#c53727] font-bold">&bull;</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Starred Favorite Dish Notification Banner (if any favorited dish is served today) */}
      {favoritesInToday.length > 0 && (
        <div className="mb-4 p-3 rounded-md bg-[#fffbf2] border border-[#ebd4b2] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-[#855314]">
            <Star className="w-4 h-4 text-[#c53727] fill-[#c53727] shrink-0" />
            <span className="font-medium">
              Starred Dishes on Today&apos;s Menu:
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
                className="px-2 py-0.5 rounded-md bg-white text-[11px] text-[#8c2210] border border-[#ebd4b2] hover:bg-[#fbf1ea] transition-colors"
              >
                {item.name} ({meal.title})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Day Selector */}
      <div className="mb-4">
        <div className="text-[11px] font-mono text-[#6b7267] mb-2 uppercase tracking-wider flex items-center justify-between">
          <span>Day Schedule:</span>
          <span className="text-[#c53727] font-semibold">{daySchedule.dayName} ({daySchedule.datesText})</span>
        </div>
        <div className="flex overflow-x-auto pb-1 gap-1.5 no-scrollbar">
          {Object.entries(FULL_WEEK_MENU).map(([key, day]) => {
            const isSelected = selectedDay === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedDay(key)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium whitespace-nowrap transition-colors border ${
                  isSelected
                    ? 'bg-[#c53727] text-white border-[#c53727] shadow-xs'
                    : 'bg-[#faf7f0] text-[#4d534b] border-[#e5dac6] hover:bg-[#f5efe3]'
                }`}
              >
                {day.dayName}
                {key === 'thursday' && (
                  <span className={`ml-1.5 text-[10px] px-1 py-0.2 rounded font-bold ${isSelected ? 'bg-[#a82a1b] text-white' : 'bg-[#e5dac6] text-[#4d534b]'}`}>
                    Today
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 Meal Timing Cards: Breakfast, Lunch, Snacks (4:45-6:15 PM), Dinner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mb-4">
        {daySchedule.meals.map((meal) => {
          const isSelected = selectedMealId === meal.id;
          const isCurrentActive = currentlyServingMealId === meal.id && selectedDay === 'thursday';

          return (
            <button
              key={meal.id}
              onClick={() => setSelectedMealId(meal.id)}
              className={`p-3 rounded-md text-left transition-all border ${
                isSelected
                  ? 'bg-[#faf7f0] border-[#c53727] ring-1 ring-[#c53727]/30'
                  : 'bg-white border-[#e5dac6] hover:bg-[#faf7f0]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold font-mono text-[#1e231d]">
                  {meal.title}
                </span>
                {isCurrentActive && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md font-bold bg-[#ebf5ee] text-[#1b5e35]">
                    Active
                  </span>
                )}
              </div>
              <div className="text-[11px] font-mono text-[#7a8077] flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#8b9187]" />
                <span>{meal.timing}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Segment Filter (Veg, Non-Veg, Special): Hidden during Snacks as Snacks is Common */}
      {isSnacks ? (
        <div className="mb-4 p-2.5 rounded-md bg-[#ebf5ee] border border-[#b7dfc4] text-xs font-mono text-[#1b5e35] flex items-center justify-between">
          <span>
            <strong>Evening Snacks Note:</strong> 4:45 PM to 6:15 PM service is identical for all Veg, Non-Veg &amp; Special dining.
          </span>
          <span className="text-[11px] font-bold text-[#1b5e35]">Common Menu</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 mb-4 text-xs font-mono">
          <span className="text-[#7a8077] mr-1">Filter:</span>
          <button
            onClick={() => setSelectedSegment('ALL')}
            className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
              selectedSegment === 'ALL'
                ? 'bg-[#1e231d] text-white font-semibold'
                : 'bg-[#faf7f0] border border-[#e5dac6] text-[#4d534b] hover:bg-[#f5efe3]'
            }`}
          >
            All Items ({activeMeal.items.length})
          </button>
          <button
            onClick={() => setSelectedSegment('VEG')}
            className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
              selectedSegment === 'VEG'
                ? 'bg-[#236b3d] text-white font-semibold'
                : 'bg-[#ebf5ee] text-[#1b5e35] hover:bg-[#def0e3] border border-[#b7dfc4]'
            }`}
          >
            Vegetarian ({vegCount})
          </button>
          {nonVegCount > 0 && (
            <button
              onClick={() => setSelectedSegment('NON_VEG')}
              className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                selectedSegment === 'NON_VEG'
                  ? 'bg-[#855314] text-white font-semibold'
                  : 'bg-[#fcf5e8] text-[#855314] hover:bg-[#f7ebd3] border border-[#ebd4b2]'
              }`}
            >
              Non-Veg ({nonVegCount})
            </button>
          )}
          {specialCount > 0 && (
            <button
              onClick={() => setSelectedSegment('SPECIAL')}
              className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                selectedSegment === 'SPECIAL'
                  ? 'bg-[#c53727] text-white font-semibold'
                  : 'bg-[#fdf2f0] text-[#a82a1b] hover:bg-[#fae2de] border border-[#f5c7c1]'
              }`}
            >
              Special ({specialCount})
            </button>
          )}
        </div>
      )}

      {/* Menu Item Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredItems.map((item) => {
          const isStarred = favoriteNames.includes(item.name);
          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-md border transition-all text-xs flex flex-col justify-between ${
                isStarred
                  ? 'bg-[#fffbf2] border-[#ebd4b2]'
                  : 'bg-white border-[#e5dac6] hover:bg-[#faf7f0]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-1.5">
                    {/* Veg/Non-Veg Indicator */}
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-xs border ${
                        item.isVeg
                          ? 'border-[#236b3d] bg-[#236b3d]'
                          : 'border-[#855314] bg-[#855314]'
                      }`}
                    />
                    <span className="font-semibold text-[#1e231d] leading-tight">
                      {item.name}
                    </span>
                  </div>

                  {/* Favorite / Star Button */}
                  <button
                    onClick={() => toggleFavorite(item.name)}
                    title={isStarred ? 'Remove from favorites' : 'Mark as favorite dish'}
                    className="p-1 text-[#8b9187] hover:text-[#c53727] transition-colors"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        isStarred ? 'text-[#c53727] fill-[#c53727]' : ''
                      }`}
                    />
                  </button>
                </div>

                {item.portionNote && (
                  <p className="text-[11px] font-mono text-[#7a8077] mt-1">
                    Portion: {item.portionNote}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-[#f0e7d7] font-mono text-[11px] text-[#7a8077]">
                <span className="uppercase text-[10px] tracking-wider text-[#4d534b]">
                  {item.category}
                </span>
                {item.calories && (
                  <span>~{item.calories} kcal</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
