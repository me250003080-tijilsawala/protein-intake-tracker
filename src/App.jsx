import { useEffect, useMemo, useState } from 'react';
import './App.css';

const STORAGE_KEY = 'protein-plus-data-v2';

const FOOD_DATABASE = [
  { name: 'Eggs', protein: 6.3, serving: '1 large egg', unit: 'eggs', emoji: '🥚' },
  { name: 'Paneer', protein: 18, serving: '100 g', unit: 'g', emoji: '🧀' },
  { name: 'Milk', protein: 3.3, serving: '100 ml', unit: 'ml', emoji: '🥛' },
  { name: 'Chicken breast', protein: 31, serving: '100 g cooked', unit: 'g', emoji: '🍗' },
  { name: 'Dal', protein: 9, serving: '100 g cooked', unit: 'g', emoji: '🍲' },
  { name: 'Greek yogurt', protein: 10, serving: '100 g', unit: 'g', emoji: '🥣' },
  { name: 'Tofu', protein: 12, serving: '100 g', unit: 'g', emoji: '◻️' },
  { name: 'Peanuts', protein: 25.8, serving: '100 g', unit: 'g', emoji: '🥜' },
  { name: 'Oats', protein: 13.2, serving: '100 g dry', unit: 'g', emoji: '🌾' },
  { name: 'Almonds', protein: 21.2, serving: '100 g', unit: 'g', emoji: '🌰' },
  { name: 'Banana', protein: 1.1, serving: '100 g edible portion', unit: 'g', emoji: '🍌' },
  { name: 'Cooked rice', protein: 2.7, serving: '100 g cooked', unit: 'g', emoji: '🍚' },
  { name: 'Soy chunks', protein: 52, serving: '100 g dry', unit: 'g', emoji: '🌱' },
  { name: 'Chickpeas', protein: 8.9, serving: '100 g cooked', unit: 'g', emoji: '🫘' },
  { name: 'Whole wheat roti', protein: 3, serving: '1 medium roti', unit: 'rotis', emoji: '🫓' },
  { name: 'Whey protein', protein: 24, serving: '1 scoop (30 g)', unit: 'scoops', emoji: '🥤' },
  { name: 'Bread', protein: 3.5, serving: '1 slice', unit: 'slices', emoji: '🍞' },
  { name: 'Peanut butter', protein: 25, serving: '100 g', unit: 'g', emoji: '🥜' },
];

/*
  Each plan represents a possible meal or snack.
  Quantities are expressed using the units in FOOD_DATABASE.
*/
const MEAL_PLANS = {
  breakfast: [
    {
      id: 'b1',
      title: 'Yogurt & oats bowl',
      description: 'A breakfast built around yogurt, oats and nuts.',
      items: [
        { name: 'Greek yogurt', quantity: 150 },
        { name: 'Oats', quantity: 40 },
        { name: 'Almonds', quantity: 10 },
      ],
    },
    {
      id: 'b2',
      title: 'Eggs & toast',
      description: 'A simple egg-and-bread breakfast.',
      items: [
        { name: 'Eggs', quantity: 2 },
        { name: 'Bread', quantity: 2 },
      ],
    },
    {
      id: 'b3',
      title: 'Whey with milk',
      description: 'A convenient drink when time is limited.',
      items: [
        { name: 'Whey protein', quantity: 1 },
        { name: 'Milk', quantity: 200 },
      ],
    },
    {
      id: 'b4',
      title: 'Paneer toast',
      description: 'Paneer with whole-wheat or regular bread.',
      items: [
        { name: 'Paneer', quantity: 75 },
        { name: 'Bread', quantity: 2 },
      ],
    },
    {
      id: 'b5',
      title: 'Peanut butter toast',
      description: 'Toast with peanut butter and a glass of milk.',
      items: [
        { name: 'Bread', quantity: 2 },
        { name: 'Peanut butter', quantity: 20 },
        { name: 'Milk', quantity: 200 },
      ],
    },
    {
      id: 'b6',
      title: 'Tofu toast',
      description: 'A plant-based breakfast option.',
      items: [
        { name: 'Tofu', quantity: 100 },
        { name: 'Bread', quantity: 2 },
      ],
    },
    {
      id: 'b7',
      title: 'Banana oat bowl',
      description: 'Oats, banana and peanut butter.',
      items: [
        { name: 'Oats', quantity: 40 },
        { name: 'Banana', quantity: 100 },
        { name: 'Peanut butter', quantity: 15 },
      ],
    },
    {
      id: 'b8',
      title: 'Greek yogurt & almonds',
      description: 'A simple, quick breakfast.',
      items: [
        { name: 'Greek yogurt', quantity: 200 },
        { name: 'Almonds', quantity: 10 },
      ],
    },
  ],

  lunch: [
    {
      id: 'l1',
      title: 'Chicken, rice & yogurt',
      description: 'A substantial lunch with a clear protein source.',
      items: [
        { name: 'Chicken breast', quantity: 100 },
        { name: 'Cooked rice', quantity: 150 },
        { name: 'Greek yogurt', quantity: 100 },
      ],
    },
    {
      id: 'l2',
      title: 'Paneer, dal & roti',
      description: 'A vegetarian meal with several protein sources.',
      items: [
        { name: 'Paneer', quantity: 75 },
        { name: 'Dal', quantity: 100 },
        { name: 'Whole wheat roti', quantity: 2 },
      ],
    },
    {
      id: 'l3',
      title: 'Tofu rice bowl',
      description: 'A plant-based lunch with tofu, rice and dal.',
      items: [
        { name: 'Tofu', quantity: 150 },
        { name: 'Cooked rice', quantity: 150 },
        { name: 'Dal', quantity: 100 },
      ],
    },
    {
      id: 'l4',
      title: 'Chickpea roti plate',
      description: 'Chickpeas, roti and yogurt.',
      items: [
        { name: 'Chickpeas', quantity: 150 },
        { name: 'Whole wheat roti', quantity: 2 },
        { name: 'Greek yogurt', quantity: 100 },
      ],
    },
    {
      id: 'l5',
      title: 'Soy chunks rice bowl',
      description: 'Soy chunks with rice and yogurt.',
      items: [
        { name: 'Soy chunks', quantity: 30 },
        { name: 'Cooked rice', quantity: 150 },
        { name: 'Greek yogurt', quantity: 100 },
      ],
    },
    {
      id: 'l6',
      title: 'Paneer & rice',
      description: 'Paneer with cooked rice.',
      items: [
        { name: 'Paneer', quantity: 100 },
        { name: 'Cooked rice', quantity: 150 },
      ],
    },
    {
      id: 'l7',
      title: 'Dal, roti & yogurt',
      description: 'A familiar meal with dal, roti and yogurt.',
      items: [
        { name: 'Dal', quantity: 200 },
        { name: 'Whole wheat roti', quantity: 2 },
        { name: 'Greek yogurt', quantity: 100 },
      ],
    },
    {
      id: 'l8',
      title: 'Eggs, dal & roti',
      description: 'Eggs with dal and roti.',
      items: [
        { name: 'Eggs', quantity: 2 },
        { name: 'Dal', quantity: 100 },
        { name: 'Whole wheat roti', quantity: 1 },
      ],
    },
  ],

  snack: [
    {
      id: 's1',
      title: 'Whey with milk',
      description: 'A convenient snack or post-workout option.',
      items: [
        { name: 'Whey protein', quantity: 1 },
        { name: 'Milk', quantity: 200 },
      ],
    },
    {
      id: 's2',
      title: 'Yogurt & almonds',
      description: 'A quick yogurt bowl with almonds.',
      items: [
        { name: 'Greek yogurt', quantity: 150 },
        { name: 'Almonds', quantity: 15 },
      ],
    },
    {
      id: 's3',
      title: 'Eggs & toast',
      description: 'A simple snack with eggs and bread.',
      items: [
        { name: 'Eggs', quantity: 2 },
        { name: 'Bread', quantity: 2 },
      ],
    },
    {
      id: 's4',
      title: 'Peanuts & banana',
      description: 'A quick snack with nuts and fruit.',
      items: [
        { name: 'Peanuts', quantity: 25 },
        { name: 'Banana', quantity: 120 },
      ],
    },
    {
      id: 's5',
      title: 'Peanut butter toast',
      description: 'Bread with peanut butter.',
      items: [
        { name: 'Bread', quantity: 2 },
        { name: 'Peanut butter', quantity: 20 },
      ],
    },
    {
      id: 's6',
      title: 'Tofu toast',
      description: 'A plant-based snack.',
      items: [
        { name: 'Tofu', quantity: 100 },
        { name: 'Bread', quantity: 1 },
      ],
    },
    {
      id: 's7',
      title: 'Milk & almonds',
      description: 'A quick drink and a small portion of nuts.',
      items: [
        { name: 'Milk', quantity: 250 },
        { name: 'Almonds', quantity: 10 },
      ],
    },
    {
      id: 's8',
      title: 'Yogurt & banana',
      description: 'Yogurt with a banana.',
      items: [
        { name: 'Greek yogurt', quantity: 150 },
        { name: 'Banana', quantity: 120 },
      ],
    },
    {
      id: 's9',
      title: 'Roasted chickpeas',
      description: 'A plant-based snack.',
      items: [
        { name: 'Chickpeas', quantity: 100 },
      ],
    },
  ],

  dinner: [
    {
      id: 'd1',
      title: 'Chicken, rice & dal',
      description: 'A protein-rich dinner with rice and dal.',
      items: [
        { name: 'Chicken breast', quantity: 100 },
        { name: 'Cooked rice', quantity: 100 },
        { name: 'Dal', quantity: 100 },
      ],
    },
    {
      id: 'd2',
      title: 'Paneer, roti & dal',
      description: 'A vegetarian dinner.',
      items: [
        { name: 'Paneer', quantity: 100 },
        { name: 'Whole wheat roti', quantity: 2 },
        { name: 'Dal', quantity: 100 },
      ],
    },
    {
      id: 'd3',
      title: 'Tofu rice bowl',
      description: 'Tofu, rice and dal.',
      items: [
        { name: 'Tofu', quantity: 150 },
        { name: 'Cooked rice', quantity: 100 },
        { name: 'Dal', quantity: 100 },
      ],
    },
    {
      id: 'd4',
      title: 'Soy chunks & roti',
      description: 'Soy chunks with roti and yogurt.',
      items: [
        { name: 'Soy chunks', quantity: 30 },
        { name: 'Whole wheat roti', quantity: 2 },
        { name: 'Greek yogurt', quantity: 100 },
      ],
    },
    {
      id: 'd5',
      title: 'Chickpeas & rice',
      description: 'Chickpeas with rice and yogurt.',
      items: [
        { name: 'Chickpeas', quantity: 150 },
        { name: 'Cooked rice', quantity: 100 },
        { name: 'Greek yogurt', quantity: 100 },
      ],
    },
    {
      id: 'd6',
      title: 'Paneer & dal',
      description: 'Paneer with dal and roti.',
      items: [
        { name: 'Paneer', quantity: 75 },
        { name: 'Dal', quantity: 150 },
        { name: 'Whole wheat roti', quantity: 2 },
      ],
    },
    {
      id: 'd7',
      title: 'Chicken & roti',
      description: 'Chicken with roti and yogurt.',
      items: [
        { name: 'Chicken breast', quantity: 75 },
        { name: 'Whole wheat roti', quantity: 2 },
        { name: 'Greek yogurt', quantity: 100 },
      ],
    },
    {
      id: 'd8',
      title: 'Tofu & chickpeas',
      description: 'A plant-based protein combination.',
      items: [
        { name: 'Tofu', quantity: 100 },
        { name: 'Chickpeas', quantity: 100 },
      ],
    },
  ],

  late: [
    {
      id: 'n1',
      title: 'A glass of milk',
      description: 'A simple, lighter option.',
      items: [{ name: 'Milk', quantity: 250 }],
    },
    {
      id: 'n2',
      title: 'Greek yogurt',
      description: 'A quick option requiring little preparation.',
      items: [{ name: 'Greek yogurt', quantity: 150 }],
    },
    {
      id: 'n3',
      title: 'Whey with water',
      description: 'A compact protein serving, if it suits your routine.',
      items: [{ name: 'Whey protein', quantity: 1 }],
    },
    {
      id: 'n4',
      title: 'Milk & yogurt',
      description: 'A small combination of dairy foods.',
      items: [
        { name: 'Milk', quantity: 200 },
        { name: 'Greek yogurt', quantity: 100 },
      ],
    },
    {
      id: 'n5',
      title: 'Banana & peanut butter',
      description: 'A small snack with fruit and nuts.',
      items: [
        { name: 'Banana', quantity: 100 },
        { name: 'Peanut butter', quantity: 15 },
      ],
    },
    {
      id: 'n6',
      title: 'Almonds & milk',
      description: 'A small portion of almonds with milk.',
      items: [
        { name: 'Almonds', quantity: 15 },
        { name: 'Milk', quantity: 200 },
      ],
    },
    {
      id: 'n7',
      title: 'Banana & peanuts',
      description: 'A simple plant-based snack.',
      items: [
        { name: 'Banana', quantity: 100 },
        { name: 'Peanuts', quantity: 15 },
      ],
    },
    {
      id: 'n8',
      title: 'Peanut butter toast',
      description: 'A small serving of bread and peanut butter.',
      items: [
        { name: 'Bread', quantity: 1 },
        { name: 'Peanut butter', quantity: 10 },
      ],
    },
  ],
};

/* Date helpers */

function todayKey() {
  const date = new Date();

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function dateKey(date) {
  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function initialDay() {
  return { goal: 120, foods: [] };
}

function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved && typeof saved === 'object' ? saved : {};
  } catch {
    return {};
  }
}

/* Protein calculations */

function getProteinForQuantity(food, amount) {
  const divisor =
    food.unit === 'g' || food.unit === 'ml' ? 100 : 1;

  return Math.round((food.protein * amount / divisor) * 10) / 10;
}

function formatQuantity(food, quantity) {
  let unit = food.unit;

  if (unit === 'eggs') unit = quantity === 1 ? 'egg' : 'eggs';
  if (unit === 'rotis') unit = quantity === 1 ? 'roti' : 'rotis';
  if (unit === 'scoops') unit = quantity === 1 ? 'scoop' : 'scoops';
  if (unit === 'slices') unit = quantity === 1 ? 'slice' : 'slices';

  const amount = Number.isInteger(quantity)
    ? String(quantity)
    : String(Number(quantity.toFixed(1)));

  return `${amount} ${unit}`;
}

/*
  Local-time meal windows.
  The browser's local clock is used; nothing is sent to a server.
*/
function getMealWindow(date = new Date()) {
  const minutes = date.getHours() * 60 + date.getMinutes();

  if (minutes >= 300 && minutes < 660) {
    return {
      key: 'breakfast',
      label: 'Breakfast',
      advice: 'A balanced breakfast or morning meal fits this time.',
    };
  }

  if (minutes >= 660 && minutes < 900) {
    return {
      key: 'lunch',
      label: 'Lunch',
      advice: 'Prioritise a satisfying meal with a clear protein source.',
    };
  }

  if (minutes >= 900 && minutes < 1080) {
    return {
      key: 'snack',
      label: 'Afternoon snack',
      advice: 'A convenient snack or post-workout option fits this window.',
    };
  }

  if (minutes >= 1080 && minutes < 1320) {
    return {
      key: 'dinner',
      label: 'Dinner',
      advice: 'Choose a balanced dinner that fits your remaining needs.',
    };
  }

  return {
    key: 'late',
    label: 'Late evening',
    advice: 'Consider a simple, lighter option rather than forcing a large meal.',
  };
}

/* Diet preferences for recommendations */

function isFoodAllowed(name, preference) {
  const normalized = name.toLowerCase();

  const meatAndEggs = new Set([
    'chicken breast',
    'eggs',
  ]);

  const animalProducts = new Set([
    'chicken breast',
    'eggs',
    'milk',
    'paneer',
    'greek yogurt',
    'whey protein',
  ]);

  if (preference === 'vegetarian' && meatAndEggs.has(normalized)) {
    return false;
  }

  if (preference === 'vegan' && animalProducts.has(normalized)) {
    return false;
  }

  return true;
}

/* ==========================================
   FLEXED-PHYSIQUE ILLUSTRATION
   The coach does not depend on this artwork.
========================================== */

function ArmIllustration() {
  return (
    <svg
      className="arm-svg physique-svg"
      viewBox="0 0 420 370"
      role="img"
      aria-label="Stylized muscular upper body"
    >
      <defs>
        <linearGradient id="bodySkin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0ffd0" />
          <stop offset="28%" stopColor="#baff83" />
          <stop offset="65%" stopColor="#59d99b" />
          <stop offset="100%" stopColor="#176b55" />
        </linearGradient>

        <linearGradient id="muscleLight" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#eaffc7" />
          <stop offset="55%" stopColor="#b3ff7c" />
          <stop offset="100%" stopColor="#63dca0" />
        </linearGradient>

        <linearGradient id="muscleShadow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#174b3f" />
          <stop offset="100%" stopColor="#328b6c" />
        </linearGradient>

        <radialGradient id="bodyAura">
          <stop offset="0%" stopColor="#7bffae" stopOpacity=".34" />
          <stop offset="55%" stopColor="#40edb4" stopOpacity=".12" />
          <stop offset="100%" stopColor="#40edb4" stopOpacity="0" />
        </radialGradient>

        <filter id="physiqueGlow" x="-45%" y="-35%" width="190%" height="180%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <ellipse
        cx="210"
        cy="190"
        rx="185"
        ry="175"
        fill="url(#bodyAura)"
      />

      <g className="physique-arms" filter="url(#physiqueGlow)">
        <g className="physique-arm-left">
          <path
            d="M151 108 C133 90 117 78 97 74 C81 71 68 82 69 99 C69 116 82 127 100 127 C118 126 137 116 155 117 Z"
            fill="url(#bodySkin)"
            stroke="#dfffba"
            strokeWidth="2"
          />

          <path
            d="M96 89 C84 84 74 91 74 101 C74 113 85 121 98 119 C109 117 120 111 128 105 C117 100 106 92 96 89 Z"
            fill="url(#muscleLight)"
          />

          <path
            d="M100 78 C94 67 87 57 84 46 C82 38 88 31 96 34 C103 37 109 48 115 52 L130 63 C142 70 152 83 158 99 L148 113 C135 103 124 96 112 92 Z"
            fill="url(#bodySkin)"
            stroke="#dfffba"
            strokeWidth="2"
          />

          <path
            d="M81 50 C73 45 71 35 78 29 C83 25 89 29 93 35 L99 43 C103 35 111 36 115 42 C119 47 115 54 110 59 L103 68 L91 64 Z"
            fill="url(#muscleLight)"
            stroke="#e8ffd0"
            strokeWidth="2"
          />

          <path
            d="M80 37 L91 48 M94 35 L102 45 M105 42 L112 49"
            fill="none"
            stroke="#388861"
            strokeWidth="2"
            strokeLinecap="round"
          />

          <path
            d="M80 95 C84 86 94 82 103 86 M108 78 C124 84 138 91 146 103"
            fill="none"
            stroke="#efffd4"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>

        <g transform="translate(420 0) scale(-1 1)">
          <path
            d="M151 108 C133 90 117 78 97 74 C81 71 68 82 69 99 C69 116 82 127 100 127 C118 126 137 116 155 117 Z"
            fill="url(#bodySkin)"
            stroke="#dfffba"
            strokeWidth="2"
          />

          <path
            d="M96 89 C84 84 74 91 74 101 C74 113 85 121 98 119 C109 117 120 111 128 105 C117 100 106 92 96 89 Z"
            fill="url(#muscleLight)"
          />

          <path
            d="M100 78 C94 67 87 57 84 46 C82 38 88 31 96 34 C103 37 109 48 115 52 L130 63 C142 70 152 83 158 99 L148 113 C135 103 124 96 112 92 Z"
            fill="url(#bodySkin)"
            stroke="#dfffba"
            strokeWidth="2"
          />

          <path
            d="M81 50 C73 45 71 35 78 29 C83 25 89 29 93 35 L99 43 C103 35 111 36 115 42 C119 47 115 54 110 59 L103 68 L91 64 Z"
            fill="url(#muscleLight)"
            stroke="#e8ffd0"
            strokeWidth="2"
          />

          <path
            d="M80 37 L91 48 M94 35 L102 45 M105 42 L112 49"
            fill="none"
            stroke="#388861"
            strokeWidth="2"
            strokeLinecap="round"
          />

          <path
            d="M80 95 C84 86 94 82 103 86 M108 78 C124 84 138 91 146 103"
            fill="none"
            stroke="#efffd4"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      </g>

      <g className="physique-torso" filter="url(#physiqueGlow)">
        <path
          d="M178 65 L178 83 C161 82 143 89 129 101 C118 111 121 126 132 139 C142 151 146 162 142 178 L131 221 C126 242 137 261 153 272 L164 333 L256 333 L267 272 C283 261 294 242 289 221 L278 178 C274 162 278 151 288 139 C299 126 302 111 291 101 C277 89 259 82 242 83 L242 65 L222 65 C219 79 214 87 210 89 C206 87 201 79 198 65 Z"
          fill="url(#bodySkin)"
          stroke="#dfffbb"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />

        <path
          d="M177 67 C180 83 191 92 210 96 C229 92 240 83 243 67"
          fill="none"
          stroke="#3b986b"
          strokeWidth="3"
          strokeLinecap="round"
        />

        <path
          d="M145 108 C158 96 180 98 205 109 L205 145 C189 155 168 151 155 139 C147 132 143 120 145 108 Z"
          fill="url(#muscleLight)"
          stroke="#e8ffd0"
          strokeWidth="1.5"
        />

        <path
          d="M275 108 C262 96 240 98 215 109 L215 145 C231 155 252 151 265 139 C273 132 277 120 275 108 Z"
          fill="url(#muscleLight)"
          stroke="#e8ffd0"
          strokeWidth="1.5"
        />

        <path
          d="M151 112 C165 106 184 111 198 121 M269 112 C255 106 236 111 222 121 M210 111 L210 147"
          fill="none"
          stroke="#397f5e"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        <path
          d="M171 157 C182 152 198 154 204 159 L203 181 C193 187 180 186 171 181 Z"
          fill="url(#muscleLight)"
          stroke="#e6ffd0"
          strokeWidth="1.2"
        />

        <path
          d="M249 157 C238 152 222 154 216 159 L217 181 C227 187 240 186 249 181 Z"
          fill="url(#muscleLight)"
          stroke="#e6ffd0"
          strokeWidth="1.2"
        />

        <path
          d="M169 190 C180 186 195 188 202 192 L201 214 C191 220 177 219 168 213 Z"
          fill="url(#muscleLight)"
          stroke="#e6ffd0"
          strokeWidth="1.2"
        />

        <path
          d="M251 190 C240 186 225 188 218 192 L219 214 C229 220 243 219 252 213 Z"
          fill="url(#muscleLight)"
          stroke="#e6ffd0"
          strokeWidth="1.2"
        />

        <path
          d="M167 223 C178 219 193 222 200 226 L199 247 C190 253 176 252 165 246 Z"
          fill="url(#muscleLight)"
          stroke="#e6ffd0"
          strokeWidth="1.2"
        />

        <path
          d="M253 223 C242 219 227 222 220 226 L221 247 C230 253 244 252 255 246 Z"
          fill="url(#muscleLight)"
          stroke="#e6ffd0"
          strokeWidth="1.2"
        />

        <path
          d="M148 164 C157 180 158 203 149 225 M272 164 C263 180 262 203 271 225 M210 153 L210 267"
          fill="none"
          stroke="#267e5a"
          strokeWidth="3"
          strokeLinecap="round"
        />

        <path
          d="M164 268 C182 277 198 278 210 278 C222 278 238 277 256 268"
          fill="none"
          stroke="#dcffb9"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      <path
        className="physique-energy"
        d="M53 113 C34 71 58 35 94 19 M327 113 C346 71 322 35 286 19"
        fill="none"
        stroke="#c8ff65"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="5 9"
      />

      <circle cx="52" cy="127" r="4" fill="#c8ff65" />
      <circle cx="368" cy="127" r="4" fill="#c8ff65" />
    </svg>
  );
}

/* ==========================================
   MAIN APP
========================================== */

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [introLeaving, setIntroLeaving] = useState(false);
  const [introReady, setIntroReady] = useState(false);

  const [showGoalEditor, setShowGoalEditor] = useState(false);

  const [data, setData] = useState(loadData);
  const [selectedDate, setSelectedDate] = useState(todayKey());

  const [search, setSearch] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState('1');

  const [customName, setCustomName] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customQuantity, setCustomQuantity] = useState('1');

  const [editingId, setEditingId] = useState(null);
  const [showCustom, setShowCustom] = useState(false);

  // The coach does nothing until the button is pressed.
  const [coachResult, setCoachResult] = useState(null);
  const [coachPreference, setCoachPreference] = useState('all');

  // Opening animation: only the ENTER button transitions to the dashboard.
  useEffect(() => {
    if (!showIntro) return undefined;

    const timer = window.setTimeout(() => {
      setIntroReady(true);
    }, 2400);

    return () => window.clearTimeout(timer);
  }, [showIntro]);

  // Persist diary data in this browser.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // The app remains usable if browser storage is unavailable.
    }
  }, [data]);

  function finishIntro() {
    if (!introReady || introLeaving) return;

    setIntroLeaving(true);

    window.setTimeout(() => {
      setShowIntro(false);
    }, 550);
  }

  const day = data[selectedDate] || initialDay();
  const foods = day.foods || [];
  const goal = Number(day.goal) || 120;

  const totalProtein = foods.reduce(
    (sum, food) => sum + Number(food.protein || 0),
    0
  );

  const progress = Math.min((totalProtein / goal) * 100, 100);
  const remaining = Math.max(goal - totalProtein, 0);

  function updateDay(updater) {
    // Existing suggestions are invalid after the diary or target changes.
    setCoachResult(null);

    setData(previous => {
      const current = previous[selectedDate] || initialDay();

      return {
        ...previous,
        [selectedDate]: updater(current),
      };
    });
  }

  function resetForm() {
    setSelectedFood(null);
    setQuantity('1');
    setCustomName('');
    setCustomProtein('');
    setCustomQuantity('1');
    setEditingId(null);
    setShowCustom(false);
  }

  function addSelectedFood(event) {
    event.preventDefault();

    const amount = Number(quantity);

    if (!selectedFood || !Number.isFinite(amount) || amount <= 0) {
      window.alert('Choose a food and enter a quantity greater than zero.');
      return;
    }

    const existing = editingId
      ? foods.find(food => food.id === editingId)
      : null;

    const now = new Date();

    const entry = {
      id: editingId ?? `${Date.now()}-${Math.random()}`,
      name: selectedFood.name,
      quantity: amount,
      unit: selectedFood.unit,
      serving: selectedFood.serving,
      proteinPerServing: selectedFood.protein,
      protein: getProteinForQuantity(selectedFood, amount),
      emoji: selectedFood.emoji || '🍽️',
      loggedAt: existing?.loggedAt || now.toISOString(),
      mealWindow: existing?.mealWindow || getMealWindow(now).key,
    };

    updateDay(current => ({
      ...current,
      foods: editingId
        ? current.foods.map(food =>
            food.id === editingId ? entry : food
          )
        : [...current.foods, entry],
    }));

    resetForm();
  }

  function addCustomFood(event) {
    event.preventDefault();

    const name = customName.trim();
    const protein = Number(customProtein);
    const amount = Number(customQuantity);

    if (
      !name ||
      customProtein === '' ||
      !Number.isFinite(protein) ||
      protein < 0 ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      window.alert(
        'Enter a food name, valid protein content, and quantity greater than zero.'
      );
      return;
    }

    const existing = editingId
      ? foods.find(food => food.id === editingId)
      : null;

    const now = new Date();

    const entry = {
      id: editingId ?? `${Date.now()}-${Math.random()}`,
      name,
      quantity: amount,
      unit: 'servings',
      serving: 'custom serving',
      proteinPerServing: protein,
      protein: Math.round(protein * amount * 10) / 10,
      emoji: '🍽️',
      loggedAt: existing?.loggedAt || now.toISOString(),
      mealWindow: existing?.mealWindow || getMealWindow(now).key,
    };

    updateDay(current => ({
      ...current,
      foods: editingId
        ? current.foods.map(food =>
            food.id === editingId ? entry : food
          )
        : [...current.foods, entry],
    }));

    resetForm();
  }

  function editFood(food) {
    setEditingId(food.id);

    if (food.unit === 'servings' || food.unit === 'serving(s)') {
      setShowCustom(true);
      setCustomName(food.name);
      setCustomProtein(String(food.proteinPerServing));
      setCustomQuantity(String(food.quantity));
      setSelectedFood(null);
    } else {
      const match = FOOD_DATABASE.find(
        item => item.name === food.name
      );

      setSelectedFood(
        match || {
          name: food.name,
          protein: food.proteinPerServing,
          serving: food.serving,
          unit: food.unit,
          emoji: food.emoji || '🍽️',
        }
      );

      setQuantity(String(food.quantity));
      setShowCustom(false);
    }

    document.getElementById('food-picker')?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }

  function deleteFood(id) {
    updateDay(current => ({
      ...current,
      foods: current.foods.filter(food => food.id !== id),
    }));

    if (editingId === id) resetForm();
  }

  function saveGoal(event) {
    event.preventDefault();

    const value = Number(event.currentTarget.elements.goal.value);

    if (!Number.isFinite(value) || value < 1 || value > 1000) {
      window.alert('Enter a daily target between 1 and 1000 grams.');
      return;
    }

    updateDay(current => ({
      ...current,
      goal: value,
    }));

    setShowGoalEditor(false);
  }

  function pickFood(food) {
    setSelectedFood(food);
    setQuantity('1');
    setEditingId(null);
    setShowCustom(false);

    document.getElementById('food-picker')?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }

  const filteredFoods = useMemo(
    () =>
      FOOD_DATABASE.filter(food =>
        food.name.toLowerCase().includes(search.toLowerCase().trim())
      ),
    [search]
  );

  const weekData = useMemo(() => {
    const result = [];

    for (let offset = 6; offset >= 0; offset -= 1) {
      const date = new Date(`${selectedDate}T12:00:00`);
      date.setDate(date.getDate() - offset);

      const key = dateKey(date);
      const entry = data[key] || initialDay();

      const total = (entry.foods || []).reduce(
        (sum, food) => sum + Number(food.protein || 0),
        0
      );

      result.push({
        key,
        label: date.toLocaleDateString('en-IN', {
          weekday: 'short',
        }),
        dateLabel: date.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
        }),
        total,
        goal: Number(entry.goal) || 120,
      });
    }

    return result;
  }, [data, selectedDate]);

  const chartMax = Math.max(
    120,
    ...weekData.map(item => item.total),
    ...weekData.map(item => item.goal)
  );

  /*
    Generate recommendations only after an explicit button click.
  */
  function askProteinCoach() {
    const now = new Date();

    setCoachResult(null);

    // An old diary date cannot accurately use today's current time.
    if (selectedDate !== todayKey()) {
      setCoachResult({
        kind: 'wrong-date',
        title: 'Select today first',
        message:
          'For time-aware suggestions, open today in the date selector. The coach needs today’s diary and the current local time.',
      });

      return;
    }

    const currentDay = data[selectedDate] || initialDay();
    const todayFoods = currentDay.foods || [];

    const consumed = todayFoods.reduce(
      (sum, food) => sum + Number(food.protein || 0),
      0
    );

    const dailyGoal = Number(currentDay.goal) || 120;
    const gap = Math.max(dailyGoal - consumed, 0);
    const mealWindow = getMealWindow(now);

    const loggedNames = new Set(
      todayFoods.map(food => food.name.trim().toLowerCase())
    );

    const uniqueLoggedNames = [
      ...new Set(todayFoods.map(food => food.name)),
    ];

    const time = now.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });

    // Stop immediately if the daily target has been reached.
    if (gap <= 0) {
      setCoachResult({
        kind: 'complete',
        title: 'Your daily target is already reached',
        message:
          'Your logged intake meets or exceeds your target. The coach will not recommend more food just to fill the screen.',
        phase: mealWindow,
        time,
        consumed,
        goal: dailyGoal,
        gap,
        loggedCount: todayFoods.length,
        loggedNames: uniqueLoggedNames,
      });

      return;
    }

    const availablePlans = (MEAL_PLANS[mealWindow.key] || [])
      .map(plan => {
        const items = plan.items.map(part => {
          const food = FOOD_DATABASE.find(
            item => item.name === part.name
          );

          if (!food) return null;

          const protein = getProteinForQuantity(
            food,
            part.quantity
          );

          return {
            food,
            quantity: part.quantity,
            protein,
            portion: formatQuantity(food, part.quantity),
          };
        });

        if (items.some(item => item === null)) return null;

        // Respect the selected food preference.
        if (
          !items.every(item =>
            isFoodAllowed(item.food.name, coachPreference)
          )
        ) {
          return null;
        }

        const planProtein =
          Math.round(
            items.reduce((sum, item) => sum + item.protein, 0) * 10
          ) / 10;

        const overshoot = Math.max(planProtein - gap, 0);

        // Prefer a plan that fits the remaining protein target.
        const score =
          Math.abs(planProtein - gap) + overshoot * 1.2;

        return {
          ...plan,
          items,
          protein: planProtein,
          score,
        };
      })
      .filter(Boolean);

    // When possible, remove foods already logged earlier today.
    const plansWithoutRepeatedFoods = availablePlans.filter(plan =>
      plan.items.every(
        item => !loggedNames.has(item.food.name.toLowerCase())
      )
    );

    const canAvoidRepeats = plansWithoutRepeatedFoods.length > 0;

    // Reuse previously eaten foods only if all suitable alternatives
    // have been exhausted by the selected preference and meal window.
    const candidatePlans = canAvoidRepeats
      ? plansWithoutRepeatedFoods
      : availablePlans;

    if (candidatePlans.length === 0) {
      setCoachResult({
        kind: 'no-options',
        title: 'No suitable plan found',
        message:
          'There are no matching plans for this time window and food preference. Try a different food preference, then ask the coach again.',
        phase: mealWindow,
        time,
        consumed,
        goal: dailyGoal,
        gap,
        loggedCount: todayFoods.length,
        loggedNames: uniqueLoggedNames,
      });

      return;
    }

    /*
      Rank plans by how well they fit the remaining target.
      Then favour alternatives that do not repeat the same ingredients
      across all three suggestions.
    */
    const rankedPlans = [];
    const remainingPlans = [...candidatePlans];

    while (rankedPlans.length < 3 && remainingPlans.length > 0) {
      let bestIndex = 0;
      let bestScore = Infinity;

      remainingPlans.forEach((plan, index) => {
        const planNames = plan.items.map(item =>
          item.food.name.toLowerCase()
        );

        const overlapPenalty = rankedPlans.reduce(
          (sum, chosen) => {
            const chosenNames = new Set(
              chosen.items.map(item =>
                item.food.name.toLowerCase()
              )
            );

            const overlap = planNames.filter(name =>
              chosenNames.has(name)
            ).length;

            return sum + overlap * 5;
          },
          0
        );

        const adjustedScore = plan.score + overlapPenalty;

        if (adjustedScore < bestScore) {
          bestScore = adjustedScore;
          bestIndex = index;
        }
      });

      rankedPlans.push(remainingPlans.splice(bestIndex, 1)[0]);
    }

    let note;

    if (todayFoods.length === 0) {
      note =
        'Nothing has been logged today yet. These are options suited to the current time of day.';
    } else if (canAvoidRepeats) {
      const displayedFoods = uniqueLoggedNames.slice(0, 5).join(', ');
      const extra =
        uniqueLoggedNames.length > 5
          ? `, and ${uniqueLoggedNames.length - 5} more`
          : '';

      note =
        `You have logged ${todayFoods.length} entries so far` +
        ` (${displayedFoods}${extra}). ` +
        'I excluded those foods from the recommendations where alternatives were available.';
    } else {
      note =
        'You have already logged the available foods for this time window. ' +
        'The suggestions may repeat ingredients because no suitable non-repeating plan remains.';
    }

    setCoachResult({
      kind: 'suggestions',
      phase: mealWindow,
      time,
      consumed,
      goal: dailyGoal,
      gap,
      loggedCount: todayFoods.length,
      loggedNames: uniqueLoggedNames,
      note,
      plans: rankedPlans,
      preference: coachPreference,
      repeatedFoodsFallback: !canAvoidRepeats,
    });
  }

  /*
    Add all foods from one selected recommendation.
    The suggestion is logged as a group, and the dashboard recalculates.
  */
  function addPlanToDiary(plan) {
    if (selectedDate !== todayKey()) {
      window.alert('Select today before adding a coach recommendation.');
      return;
    }

    const now = new Date();
    const mealWindow = getMealWindow(now).key;

    const entries = plan.items.map(item => ({
      id: `${Date.now()}-${Math.random()}`,
      name: item.food.name,
      quantity: item.quantity,
      unit: item.food.unit,
      serving: item.food.serving,
      proteinPerServing: item.food.protein,
      protein: item.protein,
      emoji: item.food.emoji,
      loggedAt: now.toISOString(),
      mealWindow,
      source: 'coach',
    }));

    updateDay(current => ({
      ...current,
      foods: [...current.foods, ...entries],
    }));

    window.setTimeout(() => {
      document.getElementById('food-diary')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 80);
  }

  return (
    <>
      {/* OPENING SCREEN */}

      {showIntro && (
        <section
          className={`power-intro${introLeaving ? ' power-intro--leaving' : ''}`}
          aria-label="PROTEIN+ opening screen"
        >
          <div className="intro-grid" aria-hidden="true" />
          <div className="intro-scanline" aria-hidden="true" />
          <div className="intro-vignette" aria-hidden="true" />

          <div className="intro-content intro-content-clean">
            <div className="intro-brand-lockup">
              <span className="intro-brand-mark">
                P<span>+</span>
              </span>

              <span className="intro-brand-name">
                PROTEIN<span>+</span>
                <small>NUTRITION TRACKER</small>
              </span>
            </div>

            <div className="intro-emblem" aria-hidden="true">
              <div className="intro-burst-ring" />
              <div className="intro-orbit intro-orbit-one" />
              <div className="intro-orbit intro-orbit-two" />

              <div className="intro-arm">
                <ArmIllustration />
              </div>
            </div>

            <p className="intro-kicker">YOUR DAILY PROTEIN TRACKER</p>

            <h1 className="intro-title">
              FUEL. TRACK.
              <br />
              <span>BUILD. REPEAT.</span>
            </h1>

            <button
              className="intro-enter"
              type="button"
              onClick={finishIntro}
              disabled={!introReady || introLeaving}
            >
              <span className="intro-enter-icon">P<span>+</span></span>
              <span className="intro-enter-label">ENTER THE LAB</span>
              <span className="intro-enter-arrow">→</span>
            </button>
          </div>
        </section>
      )}

      {/* MAIN DASHBOARD */}

      <div className="app-shell">
        <aside className="sidebar">
          <a className="brand" href="#overview">
            <span className="brand-mark">
              P<span>+</span>
            </span>

            <span>
              PROTEIN<span className="brand-plus">+</span>
              <small>NUTRITION TRACKER</small>
            </span>
          </a>

          <p className="side-caption">WORKSPACE / 01</p>

          <nav className="side-nav" aria-label="Main navigation">
            <a className="side-link active" href="#overview">
              <span>⌘</span> Overview
            </a>

            <a className="side-link" href="#protein-coach">
              <span>✦</span> Protein coach
            </a>

            <a className="side-link" href="#food-diary">
              <span>◷</span> Food diary
            </a>

            <a className="side-link" href="#weekly">
              <span>▥</span> Weekly analytics
            </a>

            <a className="side-link" href="#library">
              <span>◇</span> Food library
            </a>
          </nav>

          <div className="sidebar-bottom">
            <div className="sidebar-tip-icon">✳</div>
            <p className="sidebar-tip-title">Consistency compounds.</p>
            <p className="sidebar-tip-text">
              Small choices, repeated daily. Track the work. Trust the process.
            </p>
            <span className="sidebar-tag"><i /> SYSTEM OPTIMIZED</span>
          </div>

          <div className="sidebar-footer">
            PROTEIN+ <span>•</span> NUTRITION OS 1.0
          </div>
        </aside>

        <main className="main-area" id="overview">
          <header className="top-header">
            <div>
              <p className="overline">
                <span className="overline-mark" />
                PERSONAL NUTRITION DASHBOARD
              </p>

              <h1>
                Good food. <span>Great progress.</span>
              </h1>

              <p className="header-subtitle">
                Make every meal count towards your goals.
              </p>
            </div>

            <label className="date-control">
              <span>DAY SELECT</span>

              <input
                type="date"
                value={selectedDate}
                max={todayKey()}
                onChange={event => {
                  setSelectedDate(event.target.value);
                  setCoachResult(null);
                  setShowGoalEditor(false);
                }}
                aria-label="Select date"
              />
            </label>
          </header>

          <section className="hero-card">
            <div className="hero-glow" />

            <div className="hero-copy">
              <p className="hero-label">
                <span /> DAILY NUTRITION CHECK-IN
              </p>

              <h2>
                Built by habits.
                <br />
                <em>Powered by protein.</em>
              </h2>

              <p>
                Know your numbers, stay consistent, and keep moving forward
                — one meal at a time.
              </p>

              <a href="#food-picker" className="hero-button">
                LOG A MEAL <span>↗</span>
              </a>
            </div>

            <div className="hero-art" aria-hidden="true">
              <div className="hero-ring ring-one" />
              <div className="hero-ring ring-two" />
              <div className="hero-ring ring-three" />
              <div className="hero-orbit">✳</div>

              <div className="hero-badge">
                <span>DAILY FOCUS</span>
                <strong>PROTEIN<span>+</span></strong>
                <small>POWER YOUR DAY</small>
              </div>

              <div className="hero-data hero-data-one">
                BIO / 01 <b>+12.8%</b>
              </div>

              <div className="hero-data hero-data-two">
                CONSISTENCY <b>ACTIVE</b>
              </div>

              <div className="hero-leaf leaf-one">✦</div>
              <div className="hero-leaf leaf-two">✧</div>
            </div>

            <div className="hero-index">
              P+ <span>///</span> PERFORMANCE SERIES
            </div>
          </section>

          {/* DAILY SUMMARY */}

          <section className="summary-grid" aria-label="Daily protein summary">
            <article className="summary-card consumed-card">
              <div className="summary-top">
                <span>PROTEIN CONSUMED</span>
                <span className="summary-icon">↗</span>
              </div>

              <div className="summary-value">
                {totalProtein.toFixed(1)}<small>g</small>
              </div>

              <p>
                <span className="status-dot" />
                Logged for{' '}
                {new Date(`${selectedDate}T12:00:00`).toLocaleDateString(
                  'en-IN',
                  { day: 'numeric', month: 'short' }
                )}
              </p>

              <div className="mini-track">
                <span style={{ width: `${progress}%` }} />
              </div>
            </article>

            <article className="summary-card target-card">
              <div className="summary-top">
                <span>DAILY TARGET</span>
                <span className="summary-icon pale">◎</span>
              </div>

              <div className="summary-value">
                {goal}<small>g</small>
              </div>

              <div className="goal-summary-row">
                <p>Daily protein goal</p>

                <button
                  className="goal-edit-trigger"
                  type="button"
                  aria-expanded={showGoalEditor}
                  onClick={() => setShowGoalEditor(value => !value)}
                >
                  <span aria-hidden="true">✎</span>
                  {showGoalEditor ? 'CLOSE' : 'EDIT'}
                </button>
              </div>

              {showGoalEditor && (
                <form
                  className="inline-goal goal-editor-form"
                  onSubmit={saveGoal}
                >
                  <label htmlFor="daily-goal-input">
                    New target (grams)
                  </label>

                  <div className="goal-editor-controls">
                    <input
                      key={`${selectedDate}-${goal}`}
                      id="daily-goal-input"
                      name="goal"
                      type="number"
                      min="1"
                      max="1000"
                      step="1"
                      defaultValue={goal}
                      required
                    />

                    <button type="submit">SAVE</button>

                    <button
                      className="goal-cancel"
                      type="button"
                      onClick={() => setShowGoalEditor(false)}
                    >
                      CANCEL
                    </button>
                  </div>
                </form>
              )}
            </article>

            <article className="summary-card">
              <div className="summary-top">
                <span>STILL TO GO</span>
                <span className="summary-icon pale">◷</span>
              </div>

              <div className="summary-value">
                {remaining.toFixed(1)}<small>g</small>
              </div>

              <p>
                {remaining === 0
                  ? 'Target reached. Great work.'
                  : `${Math.round(progress)}% of your daily target complete`}
              </p>

              <div className="mini-track">
                <span style={{ width: `${progress}%` }} />
              </div>
            </article>
          </section>

          {/* ==========================================
              SMART PROTEIN COACH
              Nothing is generated until the user asks.
          ========================================== */}

          <section className="content-card coach-card" id="protein-coach">
            <div className="section-heading coach-heading">
              <div>
                <p className="overline">ON-DEMAND GUIDANCE</p>
                <h2>Smart Protein Coach</h2>

                <p className="coach-subtitle">
                  Personalised suggestions based on today's diary and the
                  current time.
                </p>
              </div>

              <span className="coach-badge">
                <span className="coach-status-dot" />
                {coachResult ? 'RESULT READY' : 'WAITING FOR YOU'}
              </span>
            </div>

            <div className="coach-control-row">
              <label className="coach-preference">
                <span>FOOD PREFERENCE</span>

                <select
                  value={coachPreference}
                  onChange={event => {
                    setCoachPreference(event.target.value);
                    setCoachResult(null);
                  }}
                >
                  <option value="all">No restrictions</option>
                  <option value="vegetarian">Vegetarian · no eggs or meat</option>
                  <option value="vegan">Vegan · plant-based</option>
                </select>
              </label>

              <button
                className="coach-ask-button"
                type="button"
                onClick={askProteinCoach}
              >
                <span>✦</span>
                {coachResult ? 'REFRESH SUGGESTIONS' : 'ASK PROTEIN COACH'}
                <span className="coach-button-arrow">→</span>
              </button>
            </div>

            {!coachResult && (
              <div className="coach-idle">
                <span className="coach-idle-icon">✳</span>

                <div>
                  <strong>Ready when you are.</strong>

                  <p>
                    The coach won't generate suggestions until you press the
                    button. It checks the selected day's food log, the current
                    local time, and your remaining protein target.
                  </p>
                </div>
              </div>
            )}

            {coachResult && (
              <div className="coach-results" aria-live="polite">
                {coachResult.kind === 'wrong-date' && (
                  <div className="coach-message coach-message-warning">
                    <strong>{coachResult.title}</strong>
                    <p>{coachResult.message}</p>
                  </div>
                )}

                {coachResult.kind === 'complete' && (
                  <>
                    <div className="coach-result-stats">
                      <div>
                        <span>LOCAL TIME</span>
                        <strong>{coachResult.time}</strong>
                      </div>

                      <div>
                        <span>LOGGED TODAY</span>
                        <strong>{coachResult.consumed.toFixed(1)} g</strong>
                      </div>

                      <div>
                        <span>DAILY TARGET</span>
                        <strong>{coachResult.goal} g</strong>
                      </div>
                    </div>

                    <div className="coach-message coach-message-success">
                      <strong>{coachResult.title}</strong>
                      <p>{coachResult.message}</p>
                    </div>
                  </>
                )}

                {coachResult.kind === 'no-options' && (
                  <div className="coach-message coach-message-warning">
                    <strong>{coachResult.title}</strong>
                    <p>{coachResult.message}</p>
                  </div>
                )}

                {coachResult.kind === 'suggestions' && (
                  <>
                    <div className="coach-result-stats">
                      <div>
                        <span>CURRENT TIME</span>
                        <strong>{coachResult.time}</strong>
                      </div>

                      <div>
                        <span>MEAL WINDOW</span>
                        <strong>{coachResult.phase.label}</strong>
                      </div>

                      <div>
                        <span>STILL TO GO</span>
                        <strong>{coachResult.gap.toFixed(1)} g</strong>
                      </div>
                    </div>

                    <div className="coach-context">
                      <span className="coach-context-icon">↳</span>

                      <div>
                        <strong>
                          I checked your earlier food entries.
                        </strong>

                        <p>{coachResult.note}</p>

                        <p className="coach-context-advice">
                          {coachResult.phase.advice}
                        </p>
                      </div>
                    </div>

                    <div className="coach-plans-heading">
                      <h3>Choose your next meal</h3>

                      <span>
                        {coachResult.plans.length} OPTIONS
                      </span>
                    </div>

                    <div className="coach-plans-grid">
                      {coachResult.plans.map((plan, index) => (
                        <article className="coach-plan" key={plan.id}>
                          <div className="coach-plan-top">
                            <span className="coach-plan-number">
                              0{index + 1}
                            </span>

                            <span className="coach-plan-tag">
                              {index === 0 ? 'BEST FIT' : 'ALTERNATIVE'}
                            </span>
                          </div>

                          <h4>{plan.title}</h4>
                          <p className="coach-plan-description">
                            {plan.description}
                          </p>

                          <div className="coach-plan-items">
                            {plan.items.map(item => (
                              <div
                                className="coach-plan-item"
                                key={`${plan.id}-${item.food.name}`}
                              >
                                <span className="coach-plan-food">
                                  <span>{item.food.emoji}</span>
                                  <span>{item.food.name}</span>
                                </span>

                                <span className="coach-plan-portion">
                                  {item.portion}
                                </span>

                                <strong>
                                  {item.protein.toFixed(1)} g
                                </strong>
                              </div>
                            ))}
                          </div>

                          <div className="coach-plan-total">
                            <span>ESTIMATED PROTEIN</span>
                            <strong>{plan.protein.toFixed(1)} g</strong>
                          </div>

                          <p className="coach-plan-fit">
                            {plan.protein > coachResult.gap
                              ? `${(plan.protein - coachResult.gap).toFixed(1)} g above your remaining target`
                              : `${(coachResult.gap - plan.protein).toFixed(1)} g still remaining after this plan`}
                          </p>

                          <button
                            className="coach-add-button"
                            type="button"
                            onClick={() => addPlanToDiary(plan)}
                          >
                            ADD TO DIARY <span>+</span>
                          </button>
                        </article>
                      ))}
                    </div>

                    <p className="coach-disclaimer">
                      Protein values are estimates from the built-in food
                      library. Portions and actual nutrition can vary. Each
                      card is an alternative meal suggestion, not an instruction
                      to eat all three. Check your actual portion sizes before
                      logging.
                    </p>
                  </>
                )}
              </div>
            )}
          </section>

          {/* PROGRESS AND WEEKLY CHART */}

          <div className="content-grid">
            <section className="content-card progress-card">
              <div className="section-heading">
                <div>
                  <p className="overline">YOUR DAILY BREAKDOWN</p>
                  <h2>Protein progress</h2>
                </div>

                <span className="soft-tag">
                  {new Date(`${selectedDate}T12:00:00`).toLocaleDateString(
                    'en-IN',
                    { day: '2-digit', month: 'short' }
                  )}
                </span>
              </div>

              <div className="progress-layout">
                <div
                  className="donut"
                  style={{ '--progress': `${progress}%` }}
                >
                  <div className="donut-center">
                    <strong>{Math.round(progress)}<span>%</span></strong>
                    <small>COMPLETE</small>
                  </div>
                </div>

                <div className="progress-details">
                  <div className="legend-row">
                    <span className="legend-dot green" />

                    <div>
                      <strong>Consumed</strong>
                      <small>Protein logged today</small>
                    </div>

                    <b>{totalProtein.toFixed(1)} g</b>
                  </div>

                  <div className="legend-row">
                    <span className="legend-dot gray" />

                    <div>
                      <strong>Remaining</strong>
                      <small>To reach your target</small>
                    </div>

                    <b>{remaining.toFixed(1)} g</b>
                  </div>

                  <div className="motivation-box">
                    <span>✦</span>

                    <p>
                      {remaining === 0
                        ? 'Target achieved. Keep building healthy habits.'
                        : `You're ${Math.round(progress)}% there. Every meal is another opportunity.`}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="content-card weekly-card" id="weekly">
              <div className="section-heading">
                <div>
                  <p className="overline">THE BIGGER PICTURE</p>
                  <h2>Weekly intake</h2>
                </div>

                <span className="chart-badge">LAST 7 DAYS</span>
              </div>

              <p className="chart-subtitle">
                Protein consumed per day <span>/ grams</span>
              </p>

              <div
                className="bar-chart"
                role="img"
                aria-label="Protein consumed over the previous seven days"
              >
                {weekData.map(item => {
                  const height =
                    item.total > 0
                      ? Math.max(3, (item.total / chartMax) * 100)
                      : 2;

                  const goalHeight = Math.min(
                    100,
                    (item.goal / chartMax) * 100
                  );

                  return (
                    <div
                      className={`bar-column${
                        item.key === selectedDate
                          ? ' bar-column-today'
                          : ''
                      }`}
                      key={item.key}
                    >
                      <span className="bar-value">
                        {item.total.toFixed(0)}g
                      </span>

                      <div className="bar-track">
                        <span
                          className="goal-line"
                          style={{ bottom: `${goalHeight}%` }}
                        />

                        <span
                          className={`bar-fill${
                            item.key === selectedDate ? ' bar-today' : ''
                          }`}
                          style={{ height: `${height}%` }}
                        />
                      </div>

                      <span className="bar-label">
                        {item.label}
                        <small>{item.dateLabel}</small>
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="chart-footnote">
                <span className="legend-dot green" />
                Protein logged
                <span className="goal-key" />
                Daily target marker
                <span className="chart-footnote-note">
                  Past 7 days
                </span>
              </div>
            </section>
          </div>

          {/* FOOD DIARY */}

          <section className="content-card diary-card" id="food-diary">
            <div className="section-heading">
              <div>
                <p className="overline">WHAT YOU'VE EATEN</p>
                <h2>Your food diary</h2>
              </div>

              <span className="soft-tag">
                {foods.length} {foods.length === 1 ? 'ENTRY' : 'ENTRIES'}
              </span>
            </div>

            <div className="food-table-head">
              <span>FOOD / SERVING</span>
              <span>QUANTITY</span>
              <span>PROTEIN</span>
              <span>ACTIONS</span>
            </div>

            {foods.length === 0 ? (
              <div className="diary-empty">
                <div className="empty-illustration">🥗</div>
                <h3>Your diary starts here.</h3>

                <p>
                  No foods logged for this date yet. Add your first meal below.
                </p>

                <a href="#library">+ Explore the food library</a>
              </div>
            ) : (
              foods.map(food => (
                <div className="food-row" key={food.id}>
                  <div className="food-row-name">
                    <span className="food-emoji">
                      {food.emoji || '🍽️'}
                    </span>

                    <div>
                      <strong>{food.name}</strong>
                      <small>{food.serving || 'Custom serving'}</small>
                    </div>
                  </div>

                  <span className="food-quantity">
                    {food.quantity}{' '}
                    {food.unit === 'servings'
                      ? Number(food.quantity) === 1
                        ? 'serving'
                        : 'servings'
                      : food.unit}
                  </span>

                  <strong className="food-protein">
                    {Number(food.protein).toFixed(1)} <small>g</small>
                  </strong>

                  <div className="row-actions">
                    <button type="button" onClick={() => editFood(food)}>
                      EDIT
                    </button>

                    <button
                      type="button"
                      className="remove-button"
                      onClick={() => deleteFood(food.id)}
                      aria-label={`Delete ${food.name}`}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            )}

            <div className="diary-total">
              <span>TOTAL PROTEIN LOGGED</span>

              <strong>
                {totalProtein.toFixed(1)} <small>g</small>
              </strong>
            </div>
          </section>

          {/* FOOD LIBRARY */}

          <section className="content-card library-card" id="library">
            <div className="section-heading library-heading">
              <div>
                <p className="overline">KNOW YOUR FOOD</p>
                <h2>Food library</h2>

                <p className="library-intro">
                  Reference values with clearly defined serving sizes.
                </p>
              </div>

              <label className="food-search">
                <span>⌕</span>

                <input
                  value={search}
                  onChange={event => setSearch(event.target.value)}
                  placeholder="Search foods..."
                  aria-label="Search foods"
                />
              </label>
            </div>

            <div className="library-grid">
              {filteredFoods.map(food => (
                <button
                  className={`library-food${
                    selectedFood?.name === food.name
                      ? ' library-selected'
                      : ''
                  }`}
                  type="button"
                  key={food.name}
                  onClick={() => pickFood(food)}
                >
                  <span className="library-food-icon">{food.emoji}</span>
                  <span className="library-food-name">{food.name}</span>

                  <strong className="library-protein">
                    {food.protein}<small> g protein</small>
                  </strong>

                  <span className="library-serving">
                    per {food.serving}
                  </span>

                  <span className="library-add">
                    {selectedFood?.name === food.name
                      ? '✓ SELECTED'
                      : '+ SELECT FOOD'}
                  </span>
                </button>
              ))}

              {filteredFoods.length === 0 && (
                <p className="no-results">
                  No foods found. Use “Add a custom food” below to log it
                  yourself.
                </p>
              )}
            </div>

            <p className="nutrition-disclaimer">
              Nutrition values are estimates and vary by variety, brand,
              serving size, and cooking method. Dry and cooked weights are
              not interchangeable. Check product labels for the most accurate
              values.
            </p>
          </section>

          {/* ADD FOOD */}

          <section className="content-card add-food-card" id="food-picker">
            <div className="section-heading">
              <div>
                <p className="overline">TRACK YOUR INTAKE</p>
                <h2>{editingId ? 'Edit food entry' : 'Add to your diary'}</h2>
              </div>

              <span className="soft-tag">
                {editingId ? 'EDIT MODE' : 'QUANTITY / SERVING'}
              </span>
            </div>

            {!showCustom ? (
              <form className="add-food-form" onSubmit={addSelectedFood}>
                <div className="selected-food-box">
                  <span className="selected-food-emoji">
                    {selectedFood?.emoji || '🍽️'}
                  </span>

                  <div>
                    <small>SELECTED FOOD</small>

                    <strong>
                      {selectedFood?.name || 'Choose a food above'}
                    </strong>

                    <span>
                      {selectedFood
                        ? `${selectedFood.protein} g protein · ${selectedFood.serving}`
                        : 'Select a food from the library to continue.'}
                    </span>
                  </div>
                </div>

                <div className="quantity-field">
                  <label htmlFor="quantity">
                    Quantity ({selectedFood?.unit || 'units'})
                  </label>

                  <input
                    id="quantity"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={quantity}
                    onChange={event => setQuantity(event.target.value)}
                    disabled={!selectedFood}
                  />
                </div>

                <div className="calculated-field">
                  <small>ESTIMATED PROTEIN</small>

                  <strong>
                    {selectedFood && Number(quantity) > 0
                      ? getProteinForQuantity(
                          selectedFood,
                          Number(quantity)
                        ).toFixed(1)
                      : '0.0'}{' '}
                    <span>g</span>
                  </strong>
                </div>

                <button
                  className="add-submit"
                  type="submit"
                  disabled={!selectedFood}
                >
                  {editingId ? 'SAVE CHANGES' : '+ ADD FOOD'}
                </button>

                {editingId && (
                  <button
                    className="cancel-edit"
                    type="button"
                    onClick={resetForm}
                  >
                    CANCEL
                  </button>
                )}
              </form>
            ) : (
              <form
                className="add-food-form custom-form"
                onSubmit={addCustomFood}
              >
                <div className="quantity-field">
                  <label htmlFor="customName">Food name</label>

                  <input
                    id="customName"
                    value={customName}
                    onChange={event => setCustomName(event.target.value)}
                    placeholder="e.g. Homemade smoothie"
                    required
                  />
                </div>

                <div className="quantity-field">
                  <label htmlFor="customProtein">
                    Protein per serving (g)
                  </label>

                  <input
                    id="customProtein"
                    type="number"
                    min="0"
                    step="0.1"
                    value={customProtein}
                    onChange={event => setCustomProtein(event.target.value)}
                    placeholder="e.g. 18"
                    required
                  />
                </div>

                <div className="quantity-field">
                  <label htmlFor="customQuantity">
                    Number of servings
                  </label>

                  <input
                    id="customQuantity"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={customQuantity}
                    onChange={event => setCustomQuantity(event.target.value)}
                    required
                  />
                </div>

                <button className="add-submit" type="submit">
                  {editingId ? 'SAVE CHANGES' : '+ ADD CUSTOM FOOD'}
                </button>

                <button
                  className="cancel-edit"
                  type="button"
                  onClick={resetForm}
                >
                  CANCEL
                </button>
              </form>
            )}

            {!editingId && (
              <button
                className="custom-food-link"
                type="button"
                onClick={() => {
                  setShowCustom(value => !value);
                  setSelectedFood(null);
                }}
              >
                {showCustom
                  ? '← Choose from food library'
                  : '+ Add a custom food not listed above'}
              </button>
            )}
          </section>

          <footer className="main-footer">
            <span>PROTEIN+ © {new Date().getFullYear()}</span>

            <span>
              Build habits, not restrictions. <b>✦</b>
            </span>
          </footer>
        </main>
      </div>
    </>
  );
}

export default App;