import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

console.log("Supabase configuration:", {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : "missing",
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

if (supabase) {
  console.log("Supabase client created successfully");
} else {
  console.error(
    "Failed to create Supabase client - missing environment variables"
  );
}

// Test function to verify database connection
export const testDatabaseConnection = async () => {
  if (!supabase) {
    console.error("Supabase client is not available");
    return false;
  }

  try {
    console.log("Testing database connection...");

    // Test read operation
    const { data: readData, error: readError } = await supabase
      .from("recipes")
      .select("count")
      .limit(1);

    if (readError) {
      console.error("Database read test failed:", readError);
      return false;
    }

    console.log("Database read test successful");

    // Test if we can get the actual count
    const { count, error: countError } = await supabase
      .from("recipes")
      .select("*", { count: "exact", head: true });

    if (countError) {
      console.error("Database count test failed:", countError);
    } else {
      console.log("Total recipes in database:", count);
    }

    return true;
  } catch (error) {
    console.error("Database connection test error:", error);
    return false;
  }
};

export const RECIPE_CATEGORIES = [
  'cakes',
  'cookies', 
  'pastries',
  'other desserts',
  'breakfast',
  'lunch',
  'dinner',
  'drinks',
  'other'
] as const;

export type RecipeCategory = typeof RECIPE_CATEGORIES[number];

export type Recipe = {
  id: string;
  title: string;
  ingredients: string[];
  directions: string;
  image_url?: string;
  cook_time: number;
  servings: number;
  category: RecipeCategory;
  is_favorite?: boolean;
  created_at: string;
};
