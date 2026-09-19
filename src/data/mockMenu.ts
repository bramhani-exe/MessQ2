import { DayMenuSchedule, MealSchedule, MealType, MenuItem } from '../types/messq';

export const CHIEF_WARDEN_NAME = 'Dr. GDV Santhosh';
export const MESS_HALL_NAME = 'LH2 Mess';

export const MESS_INSTRUCTIONS = [
  '1. Thick curd must be served as per the menu, either during lunch or dinner.',
  '2. Fresh salad must be served every day as per the menu.',
  '3. The toaster should be kept functional every day.',
  '4. A weighing machine must be used while serving Chicken and Paneer and it must be functionally available in the mess area everyday.',
  '5. Chicken should weigh 150 g (and 180 g on Sundays) after cooking, i.e., before serving (excluding bowl weight and gravy).',
  '6. Paneer should be soft and must weigh 75 g after cooking, i.e., before serving (excluding bowl weight and gravy).',
  '7. Roti/Phulka/Chapathi should be prepared using 100% good-quality Atta.',
  '8. White Rice (Sona Masuri) must be cooked properly every day — neither undercooked nor overcooked.',
  '9. Evening snacks (4:45 PM to 6:15 PM) are served identically to all residents across Veg, Non-Veg & Special dining.'
];

export const FULL_WEEK_MENU: Record<string, DayMenuSchedule> = {
  thursday: {
    dayName: 'Thursday',
    datesText: 'Dates: 3, 17 (Today)',
    meals: [
      {
        id: 'BREAKFAST',
        title: 'Breakfast',
        timing: '7:00 AM – 9:00 AM',
        startTimeHour: 7.0,
        endTimeHour: 9.0,
        items: [
          // VEG
          { id: 'thu-b-v1', name: 'Poori (3 pcs Big)', category: 'bread', segment: 'VEG', isVeg: true, calories: 240 },
          { id: 'thu-b-v2', name: 'Aloo Subji', category: 'curry', segment: 'VEG', isVeg: true, calories: 130 },
          { id: 'thu-b-v3', name: 'Sabudana Kichidi', category: 'staple', segment: 'VEG', isVeg: true, calories: 180 },
          { id: 'thu-b-v4', name: 'Coconut Chutney', category: 'sides', segment: 'VEG', isVeg: true, calories: 75 },
          { id: 'thu-b-v5', name: 'Brown Bread + Butter + Jam', category: 'bread', segment: 'VEG', isVeg: true, calories: 150 },
          { id: 'thu-b-v6', name: 'Sprouts (with onion and tomato)', category: 'sides', segment: 'VEG', isVeg: true, calories: 60 },
          { id: 'thu-b-v7', name: 'Milk, Tea, Coffee Powder', category: 'beverage', segment: 'VEG', isVeg: true, calories: 85 },
          // NON-VEG
          { id: 'thu-b-nv1', name: 'Boiled Farm Egg', category: 'sides', segment: 'NON_VEG', isVeg: false, portionNote: '1 Whole Egg', calories: 78 },
          // SPECIAL
          { id: 'thu-b-sp1', name: 'Paneer Bhurji (Special)', category: 'curry', segment: 'SPECIAL', isVeg: true, isSpecial: true, portionNote: '75g soft paneer', calories: 190 },
          { id: 'thu-b-sp2', name: 'Grapes Fresh Juice', category: 'beverage', segment: 'SPECIAL', isVeg: true, isSpecial: true, calories: 110 },
          { id: 'thu-b-sp3', name: 'Chocos with Warm Milk', category: 'staple', segment: 'SPECIAL', isVeg: true, isSpecial: true, calories: 160 }
        ]
      },
      {
        id: 'LUNCH',
        title: 'Lunch',
        timing: '12:30 PM – 2:00 PM',
        startTimeHour: 12.5,
        endTimeHour: 14.0,
        items: [
          // VEG
          { id: 'thu-l-v1', name: 'Hot Roti (100% Atta)', category: 'bread', segment: 'VEG', isVeg: true, calories: 120 },
          { id: 'thu-l-v2', name: 'Lemon Rice', category: 'staple', segment: 'VEG', isVeg: true, calories: 210 },
          { id: 'thu-l-v3', name: 'White Rice (Sona Masuri)', category: 'staple', segment: 'VEG', isVeg: true, calories: 190 },
          { id: 'thu-l-v4', name: 'Boiled Chana with Onion & Tomato', category: 'salad', segment: 'VEG', isVeg: true, calories: 95 },
          { id: 'thu-l-v5', name: 'Aloo Mutter Coconut Poriyal', category: 'curry', segment: 'VEG', isVeg: true, calories: 130 },
          { id: 'thu-l-v6', name: 'Ladies Finger Curry (Bhindi)', category: 'curry', segment: 'VEG', isVeg: true, calories: 110 },
          { id: 'thu-l-v7', name: 'Rajma Masala Gravy', category: 'curry', segment: 'VEG', isVeg: true, calories: 160 },
          { id: 'thu-l-v8', name: 'Pachi Pulusu', category: 'curry', segment: 'VEG', isVeg: true, calories: 70 },
          { id: 'thu-l-v9', name: 'Chilled Lassi & Fryums', category: 'beverage', segment: 'VEG', isVeg: true, calories: 130 },
          { id: 'thu-l-v10', name: 'Tomato Chutney, Ghee + Podi', category: 'sides', segment: 'VEG', isVeg: true, calories: 90 },
          // NON-VEG
          { id: 'thu-l-nv1', name: 'Egg Masala Curry (Special NV)', category: 'curry', segment: 'NON_VEG', isVeg: false, portionNote: '2 Eggs in Rich Gravy', calories: 210 },
          // SPECIAL
          { id: 'thu-l-sp1', name: 'Mysore Paak (Ghee Sweet)', category: 'dessert', segment: 'SPECIAL', isVeg: true, isSpecial: true, calories: 220 },
          { id: 'thu-l-sp2', name: 'Paneer Do Pyaza (Special Mess)', category: 'curry', segment: 'SPECIAL', isVeg: true, isSpecial: true, portionNote: '75g paneer serving', calories: 240 }
        ]
      },
      {
        id: 'SNACKS',
        title: 'Evening Snacks',
        timing: '4:45 PM – 6:15 PM',
        startTimeHour: 16.75,
        endTimeHour: 18.25,
        items: [
          // Common Snacks for all students (Veg, Non-Veg & Special)
          { id: 'thu-s-v1', name: 'Hot Aloo Samosa (Crispy)', category: 'snack', segment: 'VEG', isVeg: true, calories: 180 },
          { id: 'thu-s-v2', name: 'Mint & Green Chutney', category: 'sides', segment: 'VEG', isVeg: true, calories: 30 },
          { id: 'thu-s-v3', name: 'Masala Tea / Ginger Chai', category: 'beverage', segment: 'VEG', isVeg: true, calories: 80 },
          { id: 'thu-s-v4', name: 'Hot Milk & Fresh Coffee Powder', category: 'beverage', segment: 'VEG', isVeg: true, calories: 85 }
        ]
      },
      {
        id: 'DINNER',
        title: 'Dinner',
        timing: '7:15 PM – 9:00 PM',
        startTimeHour: 19.25,
        endTimeHour: 21.0,
        items: [
          // VEG
          { id: 'thu-d-v1', name: 'Ajwain Chapathi', category: 'bread', segment: 'VEG', isVeg: true, calories: 125 },
          { id: 'thu-d-v2', name: 'Carrot, Beetroot & Cucumber Salad', category: 'salad', segment: 'VEG', isVeg: true, calories: 40 },
          { id: 'thu-d-v3', name: 'Plain Dosa with Groundnut Chutney', category: 'staple', segment: 'VEG', isVeg: true, calories: 190 },
          { id: 'thu-d-v4', name: 'White Rice (Sona Masuri)', category: 'staple', segment: 'VEG', isVeg: true, calories: 190 },
          { id: 'thu-d-v5', name: 'Authentic Sambhar', category: 'curry', segment: 'VEG', isVeg: true, calories: 95 },
          { id: 'thu-d-v6', name: 'Dal Makhani (Slow-Cooked)', category: 'curry', segment: 'VEG', isVeg: true, calories: 170 },
          { id: 'thu-d-v7', name: 'Curd Rice & Gongura Pickle', category: 'staple', segment: 'VEG', isVeg: true, calories: 140 },
          { id: 'thu-d-v8', name: 'Fresh Banana Fruit', category: 'dessert', segment: 'VEG', isVeg: true, calories: 90 },
          { id: 'thu-d-v9', name: 'Milk & Coffee Powder', category: 'beverage', segment: 'VEG', isVeg: true, calories: 80 },
          // NON-VEG
          { id: 'thu-d-nv1', name: 'Egg Bhurji (Spicy Onion Masala)', category: 'curry', segment: 'NON_VEG', isVeg: false, portionNote: '2 Eggs fresh prepared', calories: 180 },
          // SPECIAL
          { id: 'thu-d-sp1', name: 'Hot Drumstick Soup (Special Mess)', category: 'soup', segment: 'SPECIAL', isVeg: true, isSpecial: true, calories: 65 },
          { id: 'thu-d-sp2', name: 'Paneer Makhani Gravy', category: 'curry', segment: 'SPECIAL', isVeg: true, isSpecial: true, portionNote: '75g soft paneer', calories: 230 }
        ]
      }
    ]
  },
  friday: {
    dayName: 'Friday',
    datesText: 'Dates: 4, 18',
    meals: [
      {
        id: 'BREAKFAST',
        title: 'Breakfast',
        timing: '7:00 AM – 9:00 AM',
        startTimeHour: 7.0,
        endTimeHour: 9.0,
        items: [
          // VEG
          { id: 'fri-b-v1', name: 'Methu Vada (3 pcs Standard Size)', category: 'sides', segment: 'VEG', isVeg: true, calories: 210 },
          { id: 'fri-b-v2', name: 'South Indian Ven Pongal', category: 'staple', segment: 'VEG', isVeg: true, calories: 195 },
          { id: 'fri-b-v3', name: 'Fresh Coconut Chutney & Sambar', category: 'sides', segment: 'VEG', isVeg: true, calories: 110 },
          { id: 'fri-b-v4', name: 'Brown Bread + Butter + Jam', category: 'bread', segment: 'VEG', isVeg: true, calories: 150 },
          { id: 'fri-b-v5', name: 'Milk, Tea, Coffee Powder', category: 'beverage', segment: 'VEG', isVeg: true, calories: 85 },
          { id: 'fri-b-v6', name: 'Fresh Sprouts (One Cup)', category: 'sides', segment: 'VEG', isVeg: true, calories: 60 },
          // NON-VEG
          { id: 'fri-b-nv1', name: 'Masala Scrambled Egg', category: 'sides', segment: 'NON_VEG', isVeg: false, portionNote: 'Fresh 2 Eggs', calories: 175 },
          // SPECIAL
          { id: 'fri-b-sp1', name: 'Peanut Sundal (Veg)', category: 'sides', segment: 'SPECIAL', isVeg: true, isSpecial: true, calories: 130 },
          { id: 'fri-b-sp2', name: 'Fresh Chickoo Juice', category: 'beverage', segment: 'SPECIAL', isVeg: true, isSpecial: true, calories: 120 }
        ]
      },
      {
        id: 'LUNCH',
        title: 'Lunch',
        timing: '12:30 PM – 2:00 PM',
        startTimeHour: 12.5,
        endTimeHour: 14.0,
        items: [
          // VEG
          { id: 'fri-l-v1', name: 'Hot Pulka', category: 'bread', segment: 'VEG', isVeg: true, calories: 110 },
          { id: 'fri-l-v2', name: 'Tomato Rice', category: 'staple', segment: 'VEG', isVeg: true, calories: 205 },
          { id: 'fri-l-v3', name: 'White Rice (Sona Masuri)', category: 'staple', segment: 'VEG', isVeg: true, calories: 190 },
          { id: 'fri-l-v4', name: 'Crispy Aloo 65', category: 'sides', segment: 'VEG', isVeg: true, calories: 165 },
          { id: 'fri-l-v5', name: 'Vankaya Tomato Greenpeas Curry', category: 'curry', segment: 'VEG', isVeg: true, calories: 130 },
          { id: 'fri-l-v6', name: 'Sambar & Dosakaya Chutney', category: 'curry', segment: 'VEG', isVeg: true, calories: 115 },
          { id: 'fri-l-v7', name: 'Lemon Water with Sabja Seeds', category: 'beverage', segment: 'VEG', isVeg: true, calories: 45 },
          { id: 'fri-l-v8', name: 'Semiya Payasam & Fryums', category: 'dessert', segment: 'VEG', isVeg: true, calories: 180 },
          // NON-VEG
          { id: 'fri-l-nv1', name: 'Chicken Curry / Fry', category: 'curry', segment: 'NON_VEG', isVeg: false, portionNote: '150g weighted chicken', calories: 270 },
          // SPECIAL
          { id: 'fri-l-sp1', name: 'Paneer 65 (Special Mess)', category: 'sides', segment: 'SPECIAL', isVeg: true, isSpecial: true, portionNote: '75g soft paneer', calories: 240 }
        ]
      },
      {
        id: 'SNACKS',
        title: 'Evening Snacks',
        timing: '4:45 PM – 6:15 PM',
        startTimeHour: 16.75,
        endTimeHour: 18.25,
        items: [
          // Common Snacks for all students (Veg, Non-Veg & Special)
          { id: 'fri-s-v1', name: 'Dry Masala Maggi', category: 'snack', segment: 'VEG', isVeg: true, calories: 190 },
          { id: 'fri-s-v2', name: 'Hot Ginger Tea', category: 'beverage', segment: 'VEG', isVeg: true, calories: 75 },
          { id: 'fri-s-v3', name: 'Milk & Coffee Powder', category: 'beverage', segment: 'VEG', isVeg: true, calories: 85 }
        ]
      },
      {
        id: 'DINNER',
        title: 'Dinner',
        timing: '7:15 PM – 9:00 PM',
        startTimeHour: 19.25,
        endTimeHour: 21.0,
        items: [
          // VEG
          { id: 'fri-d-v1', name: 'Masala Lacha Paratha', category: 'bread', segment: 'VEG', isVeg: true, calories: 170 },
          { id: 'fri-d-v2', name: 'Carrots, Onions & Lemon Salad', category: 'salad', segment: 'VEG', isVeg: true, calories: 35 },
          { id: 'fri-d-v3', name: 'White Rice (Sona Masuri)', category: 'staple', segment: 'VEG', isVeg: true, calories: 190 },
          { id: 'fri-d-v4', name: 'Tomato Rasam & Thick Curd', category: 'curry', segment: 'VEG', isVeg: true, calories: 120 },
          { id: 'fri-d-v5', name: 'Fresh Fruit Custard', category: 'dessert', segment: 'VEG', isVeg: true, calories: 160 },
          { id: 'fri-d-v6', name: 'Milk & Coffee Powder', category: 'beverage', segment: 'VEG', isVeg: true, calories: 80 },
          // NON-VEG
          { id: 'fri-d-nv1', name: 'Butter Garlic Chicken (NV Special)', category: 'curry', segment: 'NON_VEG', isVeg: false, portionNote: '150g weighted chicken', calories: 290 },
          // SPECIAL
          { id: 'fri-d-sp1', name: 'Paneer Kolhapuri Curry (Special)', category: 'curry', segment: 'SPECIAL', isVeg: true, isSpecial: true, portionNote: '75g soft paneer', calories: 240 },
          { id: 'fri-d-sp2', name: 'Cream of Broccoli Soup', category: 'soup', segment: 'SPECIAL', isVeg: true, isSpecial: true, calories: 75 }
        ]
      }
    ]
  },
  saturday: {
    dayName: 'Saturday',
    datesText: 'Dates: 5, 19',
    meals: [
      {
        id: 'BREAKFAST',
        title: 'Breakfast',
        timing: '7:00 AM – 9:00 AM',
        startTimeHour: 7.0,
        endTimeHour: 9.0,
        items: [
          // VEG
          { id: 'sat-b-v1', name: 'Mysore Bonda (Crispy golden)', category: 'sides', segment: 'VEG', isVeg: true, calories: 210 },
          { id: 'sat-b-v2', name: 'Aloo Poha with roasted peanuts', category: 'staple', segment: 'VEG', isVeg: true, calories: 175 },
          { id: 'sat-b-v3', name: 'Groundnut Chutney', category: 'sides', segment: 'VEG', isVeg: true, calories: 80 },
          { id: 'sat-b-v4', name: 'Milk Bread + Butter + Jam', category: 'bread', segment: 'VEG', isVeg: true, calories: 150 },
          { id: 'sat-b-v5', name: 'Milk, Tea, Coffee Powder', category: 'beverage', segment: 'VEG', isVeg: true, calories: 85 },
          { id: 'sat-b-v6', name: 'Healthy Ragi Malt (salt)', category: 'beverage', segment: 'VEG', isVeg: true, calories: 70 },
          // NON-VEG
          { id: 'sat-b-nv1', name: 'Spicy Egg Bhurji', category: 'sides', segment: 'NON_VEG', isVeg: false, portionNote: '2 Farm Eggs', calories: 170 },
          // SPECIAL
          { id: 'sat-b-sp1', name: 'Boiled Paneer Cubes (VEG)', category: 'sides', segment: 'SPECIAL', isVeg: true, isSpecial: true, portionNote: '75g fresh paneer', calories: 160 },
          { id: 'sat-b-sp2', name: 'Muskmelon Fresh Juice', category: 'beverage', segment: 'SPECIAL', isVeg: true, isSpecial: true, calories: 95 }
        ]
      },
      {
        id: 'LUNCH',
        title: 'Lunch',
        timing: '12:30 PM – 2:00 PM',
        startTimeHour: 12.5,
        endTimeHour: 14.0,
        items: [
          // VEG
          { id: 'sat-l-v1', name: 'Hot Roti / Pulka', category: 'bread', segment: 'VEG', isVeg: true, calories: 110 },
          { id: 'sat-l-v2', name: 'Tangy Pulihora (Tamarind Rice)', category: 'staple', segment: 'VEG', isVeg: true, calories: 220 },
          { id: 'sat-l-v3', name: 'White Rice (Sona Masuri)', category: 'staple', segment: 'VEG', isVeg: true, calories: 190 },
          { id: 'sat-l-v4', name: 'Chola Curry (Chole Masala)', category: 'curry', segment: 'VEG', isVeg: true, calories: 165 },
          { id: 'sat-l-v5', name: 'Andhra Style Muddha Pappu + Avakaya', category: 'curry', segment: 'VEG', isVeg: true, calories: 175 },
          { id: 'sat-l-v6', name: 'Tendly Coconut Fry & Bachala Kura', category: 'curry', segment: 'VEG', isVeg: true, calories: 120 },
          { id: 'sat-l-v7', name: 'Ghee + Podi, Papad & Butter Milk', category: 'sides', segment: 'VEG', isVeg: true, calories: 110 },
          // NON-VEG
          { id: 'sat-l-nv1', name: 'Egg Curry (Andhra Style NV)', category: 'curry', segment: 'NON_VEG', isVeg: false, portionNote: '2 Boiled Eggs in Gravy', calories: 220 },
          // SPECIAL
          { id: 'sat-l-sp1', name: 'Shahi Ka Tukda (Royal Dessert)', category: 'dessert', segment: 'SPECIAL', isVeg: true, isSpecial: true, calories: 250 }
        ]
      },
      {
        id: 'SNACKS',
        title: 'Evening Snacks',
        timing: '4:45 PM – 6:15 PM',
        startTimeHour: 16.75,
        endTimeHour: 18.25,
        items: [
          // Common Snacks for all students (Veg, Non-Veg & Special)
          { id: 'sat-s-v1', name: 'Masala Pesara Vada (2 pcs)', category: 'snack', segment: 'VEG', isVeg: true, calories: 180 },
          { id: 'sat-s-v2', name: 'Coconut Chutney + Chopped Onions', category: 'sides', segment: 'VEG', isVeg: true, calories: 70 },
          { id: 'sat-s-v3', name: 'Masala Tea, Coffee Powder, Milk', category: 'beverage', segment: 'VEG', isVeg: true, calories: 85 }
        ]
      },
      {
        id: 'DINNER',
        title: 'Dinner',
        timing: '7:15 PM – 9:00 PM',
        startTimeHour: 19.25,
        endTimeHour: 21.0,
        items: [
          // VEG
          { id: 'sat-d-v1', name: 'Ghee Phulka', category: 'bread', segment: 'VEG', isVeg: true, calories: 130 },
          { id: 'sat-d-v2', name: 'Chili Garlic Veg Soft Noodles', category: 'staple', segment: 'VEG', isVeg: true, calories: 230 },
          { id: 'sat-d-v3', name: 'White Rice (Sona Masuri)', category: 'staple', segment: 'VEG', isVeg: true, calories: 190 },
          { id: 'sat-d-v4', name: 'Drumstick Kara Kulambu & Rasam', category: 'curry', segment: 'VEG', isVeg: true, calories: 140 },
          { id: 'sat-d-v5', name: 'Thick Curd & Mango Pickle', category: 'sides', segment: 'VEG', isVeg: true, calories: 85 },
          { id: 'sat-d-v6', name: 'Fresh Muskmelon Fruit', category: 'dessert', segment: 'VEG', isVeg: true, calories: 65 },
          { id: 'sat-d-v7', name: 'Milk & Coffee Powder', category: 'beverage', segment: 'VEG', isVeg: true, calories: 80 },
          // NON-VEG
          { id: 'sat-d-nv1', name: 'Chicken Soft Noodles (NV)', category: 'staple', segment: 'NON_VEG', isVeg: false, portionNote: '150g chicken pieces', calories: 310 },
          // SPECIAL
          { id: 'sat-d-sp1', name: 'Authentic Minestrone Soup', category: 'soup', segment: 'SPECIAL', isVeg: true, isSpecial: true, calories: 85 }
        ]
      }
    ]
  },
  sunday: {
    dayName: 'Sunday',
    datesText: 'Dates: 6, 20',
    meals: [
      {
        id: 'BREAKFAST',
        title: 'Breakfast',
        timing: '7:00 AM – 9:00 AM',
        startTimeHour: 7.0,
        endTimeHour: 9.0,
        items: [
          // VEG
          { id: 'sun-b-v1', name: 'Aloo Paratha (2 pcs) with Butter', category: 'bread', segment: 'VEG', isVeg: true, calories: 280 },
          { id: 'sun-b-v2', name: 'Pav Bhaji (Spicy Veg Gravy & Pav)', category: 'staple', segment: 'VEG', isVeg: true, calories: 250 },
          { id: 'sun-b-v3', name: 'Thick Curd & Mango Pickle', category: 'sides', segment: 'VEG', isVeg: true, calories: 85 },
          { id: 'sun-b-v4', name: 'Brown Bread + Butter + Jam', category: 'bread', segment: 'VEG', isVeg: true, calories: 150 },
          { id: 'sun-b-v5', name: 'Sprouts (One Cup)', category: 'sides', segment: 'VEG', isVeg: true, calories: 60 },
          { id: 'sun-b-v6', name: 'Milk, Tea, Coffee Powder', category: 'beverage', segment: 'VEG', isVeg: true, calories: 85 },
          // NON-VEG
          { id: 'sun-b-nv1', name: 'Boiled Farm Eggs (2 pcs)', category: 'sides', segment: 'NON_VEG', isVeg: false, portionNote: '2 Whole Eggs', calories: 155 },
          // SPECIAL
          { id: 'sun-b-sp1', name: 'Boiled Chick Peas (VEG)', category: 'sides', segment: 'SPECIAL', isVeg: true, isSpecial: true, calories: 120 },
          { id: 'sun-b-sp2', name: 'Pineapple Fresh Juice', category: 'beverage', segment: 'SPECIAL', isVeg: true, isSpecial: true, calories: 105 }
        ]
      },
      {
        id: 'LUNCH',
        title: 'Lunch',
        timing: '12:30 PM – 2:00 PM',
        startTimeHour: 12.5,
        endTimeHour: 14.0,
        items: [
          // VEG
          { id: 'sun-l-v1', name: 'Paneer Dum Vegetable Biryani (VEG)', category: 'staple', segment: 'VEG', isVeg: true, portionNote: '75g Paneer', calories: 340 },
          { id: 'sun-l-v2', name: 'Hyderabadi Mirchi Ka Salan (VEG)', category: 'curry', segment: 'VEG', isVeg: true, calories: 140 },
          { id: 'sun-l-v3', name: 'White Rice & Punjabi Dal Fry', category: 'staple', segment: 'VEG', isVeg: true, calories: 210 },
          { id: 'sun-l-v4', name: 'Onion Raitha & Fresh Salad', category: 'salad', segment: 'VEG', isVeg: true, calories: 60 },
          { id: 'sun-l-v5', name: 'Lemon Water with Sabja Seeds', category: 'beverage', segment: 'VEG', isVeg: true, calories: 45 },
          { id: 'sun-l-v6', name: 'Gongura Fresh Chutney', category: 'sides', segment: 'VEG', isVeg: true, calories: 50 },
          { id: 'sun-l-v7', name: 'Chocobar / Kulfi Ice Cream', category: 'dessert', segment: 'VEG', isVeg: true, calories: 190 },
          // NON-VEG
          { id: 'sun-l-nv1', name: 'Chicken Dum Biryani (NV Sunday Special)', category: 'staple', segment: 'NON_VEG', isVeg: false, portionNote: '180g weighted chicken', calories: 480 },
          { id: 'sun-l-nv2', name: 'Chicken Gravy (NV)', category: 'curry', segment: 'NON_VEG', isVeg: false, calories: 160 },
          // SPECIAL
          { id: 'sun-l-sp1', name: 'Special Cashew Paneer Biryani', category: 'staple', segment: 'SPECIAL', isVeg: true, isSpecial: true, portionNote: '75g soft paneer', calories: 380 }
        ]
      },
      {
        id: 'SNACKS',
        title: 'Evening Snacks',
        timing: '4:45 PM – 6:15 PM',
        startTimeHour: 16.75,
        endTimeHour: 18.25,
        items: [
          // Common Snacks for all students (Veg, Non-Veg & Special)
          { id: 'sun-s-v1', name: 'Muntha Masala (Puffed Rice Chaat)', category: 'snack', segment: 'VEG', isVeg: true, calories: 150 },
          { id: 'sun-s-v2', name: 'Hot Ginger Tea', category: 'beverage', segment: 'VEG', isVeg: true, calories: 75 },
          { id: 'sun-s-v3', name: 'Coffee Powder & Fresh Milk', category: 'beverage', segment: 'VEG', isVeg: true, calories: 85 }
        ]
      },
      {
        id: 'DINNER',
        title: 'Dinner',
        timing: '7:15 PM – 9:00 PM',
        startTimeHour: 19.25,
        endTimeHour: 21.0,
        items: [
          // VEG
          { id: 'sun-d-v1', name: 'Hot Roti & Pulka', category: 'bread', segment: 'VEG', isVeg: true, calories: 115 },
          { id: 'sun-d-v2', name: 'Carrot, Beetroot & Cucumber Salad', category: 'salad', segment: 'VEG', isVeg: true, calories: 40 },
          { id: 'sun-d-v3', name: 'Soft Idly with Groundnut Chutney', category: 'staple', segment: 'VEG', isVeg: true, calories: 170 },
          { id: 'sun-d-v4', name: 'White Rice (Sona Masuri)', category: 'staple', segment: 'VEG', isVeg: true, calories: 190 },
          { id: 'sun-d-v5', name: 'Bottle Gourd Poriyal & Sambar', category: 'curry', segment: 'VEG', isVeg: true, calories: 145 },
          { id: 'sun-d-v6', name: 'Thick Curd & Gongura Pickle', category: 'sides', segment: 'VEG', isVeg: true, calories: 85 },
          { id: 'sun-d-v7', name: 'Sweet Watermelon Fruit', category: 'dessert', segment: 'VEG', isVeg: true, calories: 70 },
          { id: 'sun-d-v8', name: 'Milk & Coffee Powder', category: 'beverage', segment: 'VEG', isVeg: true, calories: 80 },
          // NON-VEG
          { id: 'sun-d-nv1', name: 'Chicken Pepper Fry (NV Special)', category: 'curry', segment: 'NON_VEG', isVeg: false, portionNote: '150g weighted chicken', calories: 280 },
          // SPECIAL
          { id: 'sun-d-sp1', name: 'Lemon Coriander Warm Soup', category: 'soup', segment: 'SPECIAL', isVeg: true, isSpecial: true, calories: 60 }
        ]
      }
    ]
  },
  monday: {
    dayName: 'Monday',
    datesText: 'Dates: 7, 21',
    meals: [
      {
        id: 'BREAKFAST',
        title: 'Breakfast',
        timing: '7:00 AM – 9:00 AM',
        startTimeHour: 7.0,
        endTimeHour: 9.0,
        items: [
          // VEG
          { id: 'mon-b-v1', name: 'Karam Dosa (2 pcs Standard size)', category: 'staple', segment: 'VEG', isVeg: true, calories: 230 },
          { id: 'mon-b-v2', name: 'Rayalaseema Uggani', category: 'staple', segment: 'VEG', isVeg: true, calories: 180 },
          { id: 'mon-b-v3', name: 'Coconut Chutney', category: 'sides', segment: 'VEG', isVeg: true, calories: 75 },
          { id: 'mon-b-v4', name: 'Milk Bread + Butter + Jam', category: 'bread', segment: 'VEG', isVeg: true, calories: 150 },
          { id: 'mon-b-v5', name: 'Healthy Ragi Malt (salt)', category: 'beverage', segment: 'VEG', isVeg: true, calories: 70 },
          { id: 'mon-b-v6', name: 'Milk, Tea, Coffee Powder', category: 'beverage', segment: 'VEG', isVeg: true, calories: 85 },
          { id: 'mon-b-v7', name: 'Sprouts (with onion and tomato)', category: 'sides', segment: 'VEG', isVeg: true, calories: 60 },
          // NON-VEG
          { id: 'mon-b-nv1', name: 'Egg Bhurji (Masala Scrambled)', category: 'sides', segment: 'NON_VEG', isVeg: false, portionNote: '2 Farm Eggs', calories: 175 },
          // SPECIAL
          { id: 'mon-b-sp1', name: 'Paneer Bhurji (VEG)', category: 'curry', segment: 'SPECIAL', isVeg: true, isSpecial: true, portionNote: '75g soft paneer', calories: 190 },
          { id: 'mon-b-sp2', name: 'Fresh Banana Juice', category: 'beverage', segment: 'SPECIAL', isVeg: true, isSpecial: true, calories: 110 }
        ]
      },
      {
        id: 'LUNCH',
        title: 'Lunch',
        timing: '12:30 PM – 2:00 PM',
        startTimeHour: 12.5,
        endTimeHour: 14.0,
        items: [
          // VEG
          { id: 'mon-l-v1', name: 'Hot Pulka', category: 'bread', segment: 'VEG', isVeg: true, calories: 110 },
          { id: 'mon-l-v2', name: 'Vangi Bath (Brinjal Rice)', category: 'staple', segment: 'VEG', isVeg: true, calories: 215 },
          { id: 'mon-l-v3', name: 'White Rice (Sona Masuri)', category: 'staple', segment: 'VEG', isVeg: true, calories: 190 },
          { id: 'mon-l-v4', name: 'Gobi Greenpeas Poriyal', category: 'curry', segment: 'VEG', isVeg: true, calories: 120 },
          { id: 'mon-l-v5', name: 'Soya Capsicum Curry & Sambar', category: 'curry', segment: 'VEG', isVeg: true, calories: 160 },
          { id: 'mon-l-v6', name: 'Refreshing Sweet Lassi', category: 'beverage', segment: 'VEG', isVeg: true, calories: 125 },
          { id: 'mon-l-v7', name: 'Gulab Jamun (2 pcs)', category: 'dessert', segment: 'VEG', isVeg: true, calories: 220 },
          // NON-VEG
          { id: 'mon-l-nv1', name: 'Egg Curry / Roast (NV)', category: 'curry', segment: 'NON_VEG', isVeg: false, portionNote: '2 Eggs', calories: 210 },
          // SPECIAL
          { id: 'mon-l-sp1', name: 'Special Gulab Jamun & Thick Lassi', category: 'dessert', segment: 'SPECIAL', isVeg: true, isSpecial: true, calories: 240 }
        ]
      },
      {
        id: 'SNACKS',
        title: 'Evening Snacks',
        timing: '4:45 PM – 6:15 PM',
        startTimeHour: 16.75,
        endTimeHour: 18.25,
        items: [
          // Common Snacks for all students (Veg, Non-Veg & Special)
          { id: 'mon-s-v1', name: 'Masala Sweet Corn Vada', category: 'snack', segment: 'VEG', isVeg: true, calories: 170 },
          { id: 'mon-s-v2', name: 'Masala Tea', category: 'beverage', segment: 'VEG', isVeg: true, calories: 75 },
          { id: 'mon-s-v3', name: 'Coffee Powder & Fresh Milk', category: 'beverage', segment: 'VEG', isVeg: true, calories: 85 }
        ]
      },
      {
        id: 'DINNER',
        title: 'Dinner',
        timing: '7:15 PM – 9:00 PM',
        startTimeHour: 19.25,
        endTimeHour: 21.0,
        items: [
          // VEG
          { id: 'mon-d-v1', name: 'Palak Roti', category: 'bread', segment: 'VEG', isVeg: true, calories: 125 },
          { id: 'mon-d-v2', name: 'Bhagara Rice & White Rice', category: 'staple', segment: 'VEG', isVeg: true, calories: 220 },
          { id: 'mon-d-v3', name: 'Paneer Butter Masala (VEG)', category: 'curry', segment: 'VEG', isVeg: true, portionNote: '75g soft paneer', calories: 240 },
          { id: 'mon-d-v4', name: 'Leafy Dal & Tomato Rasam', category: 'curry', segment: 'VEG', isVeg: true, calories: 130 },
          { id: 'mon-d-v5', name: 'Thick Curd & Tomato Pickle', category: 'sides', segment: 'VEG', isVeg: true, calories: 85 },
          { id: 'mon-d-v6', name: 'Fresh Banana Fruit', category: 'dessert', segment: 'VEG', isVeg: true, calories: 90 },
          { id: 'mon-d-v7', name: 'Milk & Coffee Powder', category: 'beverage', segment: 'VEG', isVeg: true, calories: 80 },
          // NON-VEG
          { id: 'mon-d-nv1', name: 'Andhra Style Chicken (semi fry)', category: 'curry', segment: 'NON_VEG', isVeg: false, portionNote: '150g weighted chicken', calories: 310 },
          // SPECIAL
          { id: 'mon-d-sp1', name: 'Mix Veg Raagi Warm Soup', category: 'soup', segment: 'SPECIAL', isVeg: true, isSpecial: true, calories: 65 }
        ]
      }
    ]
  },
  tuesday: {
    dayName: 'Tuesday',
    datesText: 'Dates: 1, 15, 29',
    meals: [
      {
        id: 'BREAKFAST',
        title: 'Breakfast',
        timing: '7:00 AM – 9:00 AM',
        startTimeHour: 7.0,
        endTimeHour: 9.0,
        items: [
          // VEG
          { id: 'tue-b-v1', name: 'Chole Bhature (2 pcs Medium Size)', category: 'bread', segment: 'VEG', isVeg: true, calories: 310 },
          { id: 'tue-b-v2', name: 'Vegetable Dalia', category: 'staple', segment: 'VEG', isVeg: true, calories: 150 },
          { id: 'tue-b-v3', name: 'Coconut Chutney', category: 'sides', segment: 'VEG', isVeg: true, calories: 75 },
          { id: 'tue-b-v4', name: 'Brown Bread + Butter + Jam', category: 'bread', segment: 'VEG', isVeg: true, calories: 150 },
          { id: 'tue-b-v5', name: 'Milk, Tea, Coffee Powder', category: 'beverage', segment: 'VEG', isVeg: true, calories: 85 },
          { id: 'tue-b-v6', name: 'Sprouts (with onion and tomato)', category: 'sides', segment: 'VEG', isVeg: true, calories: 60 },
          // NON-VEG
          { id: 'tue-b-nv1', name: 'Egg Bhurji (NV)', category: 'sides', segment: 'NON_VEG', isVeg: false, portionNote: '2 Eggs', calories: 170 },
          // SPECIAL
          { id: 'tue-b-sp1', name: 'Boiled Paneer Cubes (VEG)', category: 'sides', segment: 'SPECIAL', isVeg: true, isSpecial: true, portionNote: '75g fresh paneer', calories: 160 },
          { id: 'tue-b-sp2', name: 'Pomegranate Fresh Juice', category: 'beverage', segment: 'SPECIAL', isVeg: true, isSpecial: true, calories: 115 }
        ]
      },
      {
        id: 'LUNCH',
        title: 'Lunch',
        timing: '12:30 PM – 2:00 PM',
        startTimeHour: 12.5,
        endTimeHour: 14.0,
        items: [
          // VEG
          { id: 'tue-l-v1', name: 'Hot Roti', category: 'bread', segment: 'VEG', isVeg: true, calories: 110 },
          { id: 'tue-l-v2', name: 'Coconut Rice & White Rice', category: 'staple', segment: 'VEG', isVeg: true, calories: 220 },
          { id: 'tue-l-v3', name: 'Carrot Beans Poriyal', category: 'curry', segment: 'VEG', isVeg: true, calories: 110 },
          { id: 'tue-l-v4', name: 'Tomato Pappu & Rasam', category: 'curry', segment: 'VEG', isVeg: true, calories: 135 },
          { id: 'tue-l-v5', name: 'Aloo Peas Korma', category: 'curry', segment: 'VEG', isVeg: true, calories: 145 },
          { id: 'tue-l-v6', name: 'Curd Rice & Lemon Water with Sabja', category: 'staple', segment: 'VEG', isVeg: true, calories: 140 },
          { id: 'tue-l-v7', name: 'Dosakaya Chutney, Ghee + Podi, Fryums', category: 'sides', segment: 'VEG', isVeg: true, calories: 95 },
          // NON-VEG
          { id: 'tue-l-nv1', name: 'Soya Keema Gravy / NV Option', category: 'curry', segment: 'NON_VEG', isVeg: false, calories: 190 },
          // SPECIAL
          { id: 'tue-l-sp1', name: 'Eggless Chocolate Cake Slice', category: 'dessert', segment: 'SPECIAL', isVeg: true, isSpecial: true, calories: 230 }
        ]
      },
      {
        id: 'SNACKS',
        title: 'Evening Snacks',
        timing: '4:45 PM – 6:15 PM',
        startTimeHour: 16.75,
        endTimeHour: 18.25,
        items: [
          // Common Snacks for all students (Veg, Non-Veg & Special)
          { id: 'tue-s-v1', name: 'Khasta Kachori + Green Chutney', category: 'snack', segment: 'VEG', isVeg: true, calories: 190 },
          { id: 'tue-s-v2', name: 'Masala Tea, Coffee Powder, Milk', category: 'beverage', segment: 'VEG', isVeg: true, calories: 85 }
        ]
      },
      {
        id: 'DINNER',
        title: 'Dinner',
        timing: '7:15 PM – 9:00 PM',
        startTimeHour: 19.25,
        endTimeHour: 21.0,
        items: [
          // VEG
          { id: 'tue-d-v1', name: 'Methi Roti', category: 'bread', segment: 'VEG', isVeg: true, calories: 120 },
          { id: 'tue-d-v2', name: 'Carrot, Beetroot & Cucumber Salad', category: 'salad', segment: 'VEG', isVeg: true, calories: 40 },
          { id: 'tue-d-v3', name: 'Macaroni Pasta with White Sauce', category: 'staple', segment: 'VEG', isVeg: true, calories: 230 },
          { id: 'tue-d-v4', name: 'White Rice & Tomato Rasam', category: 'staple', segment: 'VEG', isVeg: true, calories: 180 },
          { id: 'tue-d-v5', name: 'Thick Curd & Red Chilli Pickle', category: 'sides', segment: 'VEG', isVeg: true, calories: 85 },
          { id: 'tue-d-v6', name: 'Fresh Watermelon Fruit', category: 'dessert', segment: 'VEG', isVeg: true, calories: 65 },
          { id: 'tue-d-v7', name: 'Milk & Coffee Powder', category: 'beverage', segment: 'VEG', isVeg: true, calories: 80 },
          // NON-VEG
          { id: 'tue-d-nv1', name: 'Soya Keema Curry, Egg Bhurji (NV)', category: 'curry', segment: 'NON_VEG', isVeg: false, portionNote: '2 Eggs + Soya Keema', calories: 260 },
          // SPECIAL
          { id: 'tue-d-sp1', name: 'Warm Sweet Corn Soup', category: 'soup', segment: 'SPECIAL', isVeg: true, isSpecial: true, calories: 75 }
        ]
      }
    ]
  },
  wednesday: {
    dayName: 'Wednesday',
    datesText: 'Dates: 2, 16, 30',
    meals: [
      {
        id: 'BREAKFAST',
        title: 'Breakfast',
        timing: '7:00 AM – 9:00 AM',
        startTimeHour: 7.0,
        endTimeHour: 9.0,
        items: [
          // VEG
          { id: 'wed-b-v1', name: 'Carrot Idly / Veg Rava Idly', category: 'staple', segment: 'VEG', isVeg: true, calories: 170 },
          { id: 'wed-b-v2', name: 'Karnataka Shavige Bath', category: 'staple', segment: 'VEG', isVeg: true, calories: 180 },
          { id: 'wed-b-v3', name: 'Groundnut Chutney', category: 'sides', segment: 'VEG', isVeg: true, calories: 80 },
          { id: 'wed-b-v4', name: 'Brown Bread + Butter + Jam', category: 'bread', segment: 'VEG', isVeg: true, calories: 150 },
          { id: 'wed-b-v5', name: 'Sprouts (One Cup)', category: 'sides', segment: 'VEG', isVeg: true, calories: 60 },
          { id: 'wed-b-v6', name: 'Milk, Tea, Coffee Powder', category: 'beverage', segment: 'VEG', isVeg: true, calories: 85 },
          // NON-VEG
          { id: 'wed-b-nv1', name: 'Spicy Masala Omelette', category: 'sides', segment: 'NON_VEG', isVeg: false, portionNote: '2 Farm Eggs with Veggies', calories: 190 },
          // SPECIAL
          { id: 'wed-b-sp1', name: 'Boiled Chick Peas (VEG)', category: 'sides', segment: 'SPECIAL', isVeg: true, isSpecial: true, calories: 120 },
          { id: 'wed-b-sp2', name: 'Fresh Apple Juice', category: 'beverage', segment: 'SPECIAL', isVeg: true, isSpecial: true, calories: 110 }
        ]
      },
      {
        id: 'LUNCH',
        title: 'Lunch',
        timing: '12:30 PM – 2:00 PM',
        startTimeHour: 12.5,
        endTimeHour: 14.0,
        items: [
          // VEG
          { id: 'wed-l-v1', name: 'Hot Pulka', category: 'bread', segment: 'VEG', isVeg: true, calories: 110 },
          { id: 'wed-l-v2', name: 'Fragrant Jeera Rice & White Rice', category: 'staple', segment: 'VEG', isVeg: true, calories: 210 },
          { id: 'wed-l-v3', name: 'Crispy Paneer 65 (VEG)', category: 'curry', segment: 'VEG', isVeg: true, portionNote: '75g soft paneer', calories: 240 },
          { id: 'wed-l-v4', name: 'Cabbage Beans Poriyal & Rasam', category: 'curry', segment: 'VEG', isVeg: true, calories: 140 },
          { id: 'wed-l-v5', name: 'Lemon Water with Sabja Seeds', category: 'beverage', segment: 'VEG', isVeg: true, calories: 45 },
          { id: 'wed-l-v6', name: 'Sweet Boondi & Fryums', category: 'dessert', segment: 'VEG', isVeg: true, calories: 190 },
          // NON-VEG
          { id: 'wed-l-nv1', name: 'Chicken 65 (with bone)', category: 'curry', segment: 'NON_VEG', isVeg: false, portionNote: '150g weighted chicken', calories: 330 },
          // SPECIAL
          { id: 'wed-l-sp1', name: 'Eggless Chocolate CupCake (2 pieces)', category: 'dessert', segment: 'SPECIAL', isVeg: true, isSpecial: true, calories: 240 }
        ]
      },
      {
        id: 'SNACKS',
        title: 'Evening Snacks',
        timing: '4:45 PM – 6:15 PM',
        startTimeHour: 16.75,
        endTimeHour: 18.25,
        items: [
          // Common Snacks for all students (Veg, Non-Veg & Special)
          { id: 'wed-s-v1', name: 'Eggless Chocolate CupCake (2 pcs)', category: 'snack', segment: 'VEG', isVeg: true, calories: 210 },
          { id: 'wed-s-v2', name: 'Ginger Tea & Coffee Powder', category: 'beverage', segment: 'VEG', isVeg: true, calories: 80 },
          { id: 'wed-s-v3', name: 'Fresh Milk', category: 'beverage', segment: 'VEG', isVeg: true, calories: 85 }
        ]
      },
      {
        id: 'DINNER',
        title: 'Dinner',
        timing: '7:15 PM – 9:00 PM',
        startTimeHour: 19.25,
        endTimeHour: 21.0,
        items: [
          // VEG
          { id: 'wed-d-v1', name: 'Butter Roti', category: 'bread', segment: 'VEG', isVeg: true, calories: 130 },
          { id: 'wed-d-v2', name: 'Carrot, Beetroot & Cucumber Salad', category: 'salad', segment: 'VEG', isVeg: true, calories: 40 },
          { id: 'wed-d-v3', name: 'Mixed Veg Upma with Coconut Chutney', category: 'staple', segment: 'VEG', isVeg: true, calories: 200 },
          { id: 'wed-d-v4', name: 'White Rice (Sona Masuri)', category: 'staple', segment: 'VEG', isVeg: true, calories: 190 },
          { id: 'wed-d-v5', name: 'Bhindi DoPyaza & Thick Curd', category: 'curry', segment: 'VEG', isVeg: true, calories: 155 },
          { id: 'wed-d-v6', name: 'Sweet Papaya Fruit & Mango Pickle', category: 'dessert', segment: 'VEG', isVeg: true, calories: 75 },
          { id: 'wed-d-v7', name: 'Milk & Coffee Powder', category: 'beverage', segment: 'VEG', isVeg: true, calories: 80 },
          // NON-VEG
          { id: 'wed-d-nv1', name: 'Chicken Keema Masala (NV)', category: 'curry', segment: 'NON_VEG', isVeg: false, portionNote: '150g serving', calories: 290 },
          // SPECIAL
          { id: 'wed-d-sp1', name: 'Cream of Mushroom Warm Soup', category: 'soup', segment: 'SPECIAL', isVeg: true, isSpecial: true, calories: 80 }
        ]
      }
    ]
  }
};

export const WEEKLY_MENU: MealSchedule[] = FULL_WEEK_MENU.thursday.meals;
