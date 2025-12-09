import { GoogleGenAI, Type } from "@google/genai";
import { Recipe } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    recipes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          chefName: { type: Type.STRING },
          prepTime: { type: Type.STRING },
          cookTime: { type: Type.STRING },
          calories: { type: Type.NUMBER },
          difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
          cuisine: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          ingredients: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                item: { type: Type.STRING },
                amount: { type: Type.STRING }
              }
            }
          },
          instructions: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  }
};

export const generateRecipes = async (promptContext: string, count: number = 4): Promise<Recipe[]> => {
  try {
    const prompt = `Generate ${count} distinct, realistic, and delicious recipes for: ${promptContext}. 
    Ensure a mix of flavors. 
    For 'Mom's Kitchen' types, use comforting, homestyle descriptions and chef names like 'Grandma Rose' or 'Auntie Marie'. 
    For 'Top Chef', use sophisticated techniques and names.
    Return strictly JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) return [];

    const data = JSON.parse(text);
    const recipes: Recipe[] = data.recipes || [];

    // Add random seeds for images client-side since AI doesn't generate images here
    // Also sanitize arrays to ensure they exist (prevents undefined errors)
    return recipes.map(r => ({
      ...r,
      tags: Array.isArray(r.tags) ? r.tags : [],
      ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
      instructions: Array.isArray(r.instructions) ? r.instructions : [],
      imageSeed: Math.floor(Math.random() * 1000)
    }));

  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
};

export const searchRecipesByIngredientsOrDiet = async (query: string, diets: string[]): Promise<Recipe[]> => {
    const dietString = diets.length > 0 ? `Dietary restrictions: ${diets.join(", ")}.` : "";
    const prompt = `Search/Generate 6 recipes matching this query: "${query}". ${dietString}`;
    return generateRecipes(prompt, 6);
}