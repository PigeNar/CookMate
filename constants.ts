import { Recipe } from "./types";

export const INITIAL_FILTERS = [
  "Vegetarian", "Vegan", "Gluten-Free", "Keto", 
  "Under 30 mins", "Dairy-Free", "High Protein", "Kid Friendly"
];

export const CUISINES = [
  "Italian", "Mexican", "Indian", "Japanese", "Thai", "Mediterranean", "American"
];

// Fallback data so the app isn't empty on load
export const MOCK_RECIPES: Recipe[] = [
  {
    id: "mock-1",
    title: "Rustic Tomato Basil Soup",
    description: "A heartwarming soup straight from the garden, perfect for a rainy day. Served with charred sourdough.",
    chefName: "Grandma Rose",
    prepTime: "15 mins",
    cookTime: "40 mins",
    calories: 320,
    difficulty: "Easy",
    cuisine: "Italian",
    tags: ["Vegetarian", "Comfort Food", "Under 1 hr"],
    ingredients: [
        { item: "Roma Tomatoes", amount: "2 kg" },
        { item: "Fresh Basil", amount: "1 bunch" },
        { item: "Heavy Cream", amount: "1/2 cup" },
        { item: "Garlic", amount: "4 cloves" }
    ],
    instructions: ["Roast tomatoes and garlic.", "Blend with basil.", "Simmer with cream.", "Serve hot."],
    imageSeed: 101
  },
  {
    id: "mock-2",
    title: "Truffle Mushroom Risotto",
    description: "Creamy arborio rice cooked slowly with white wine, parmesan, and earthy wild mushrooms finished with truffle oil.",
    chefName: "Chef Alessandro",
    prepTime: "20 mins",
    cookTime: "45 mins",
    calories: 580,
    difficulty: "Hard",
    cuisine: "Italian",
    tags: ["Vegetarian", "Gourmet", "Dinner"],
    ingredients: [
        { item: "Arborio Rice", amount: "2 cups" },
        { item: "Wild Mushrooms", amount: "300g" },
        { item: "White Wine", amount: "1/2 cup" },
        { item: "Parmesan Cheese", amount: "1/2 cup" }
    ],
    instructions: ["Sauté mushrooms.", "Toast rice.", "Add broth gradually.", "Finish with cheese and truffle oil."],
    imageSeed: 204
  },
  {
    id: "mock-3",
    title: "Spicy Honey Glazed Salmon",
    description: "Pan-seared salmon fillets glazed with a sticky, spicy honey garlic sauce. Quick, healthy, and packed with flavor.",
    chefName: "Chef Mei",
    prepTime: "5 mins",
    cookTime: "10 mins",
    calories: 450,
    difficulty: "Medium",
    cuisine: "Fusion",
    tags: ["High Protein", "Gluten-Free", "Under 30 mins"],
    ingredients: [
        { item: "Salmon Fillet", amount: "2" },
        { item: "Honey", amount: "2 tbsp" },
        { item: "Soy Sauce (Tamari)", amount: "1 tbsp" },
        { item: "Chili Flakes", amount: "1 tsp" }
    ],
    instructions: ["Mix glaze ingredients.", "Sear salmon skin-down.", "Pour glaze over and simmer.", "Garnish with scallions."],
    imageSeed: 305
  },
];