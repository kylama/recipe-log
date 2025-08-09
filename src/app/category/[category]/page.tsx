"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Recipe, RECIPE_CATEGORIES, RecipeCategory } from "@/lib/supabase";
import { RecipeAPI } from "@/lib/api";
import RecipeCard from "@/components/RecipeCard";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function CategoryPage() {
  const params = useParams();
  const category = decodeURIComponent(
    params.category as string
  ) as RecipeCategory;

  const [categoryRecipes, setCategoryRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Validate category
  const isValidCategory = RECIPE_CATEGORIES.includes(category);

  useEffect(() => {
    if (!isValidCategory) {
      setLoading(false);
      return;
    }

    const fetchCategoryRecipes = async () => {
      try {
        const allRecipes = await RecipeAPI.getRecipes();
        const recipes = allRecipes.filter(
          (recipe: Recipe) => recipe.category === category
        );
        setCategoryRecipes(recipes);
        setFilteredRecipes(recipes);
      } catch (error) {
        console.error("Error fetching category recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryRecipes();
  }, [category, isValidCategory]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredRecipes(categoryRecipes);
    } else {
      const filtered = categoryRecipes.filter(
        (recipe: Recipe) =>
          recipe.title.toLowerCase().includes(query.toLowerCase()) ||
          recipe.ingredients.some((ingredient: string) =>
            ingredient.toLowerCase().includes(query.toLowerCase())
          )
      );
      setFilteredRecipes(filtered);
    }
  };

  if (!isValidCategory) {
    return (
      <div className="min-h-screen bg-cream-100">
        <Sidebar />
        <div className="ml-64 flex flex-col">
          <Navbar onSearch={handleSearch} />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center py-12">
                <div className="text-sage-500 text-lg mb-4">
                  Invalid Category
                </div>
                <p className="text-sage-400">
                  The category &quot;{category}&quot; does not exist.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100">
        <Sidebar />
        <div className="ml-64 flex flex-col">
          <Navbar onSearch={handleSearch} />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center py-12">
                <div className="text-sage-500 text-lg">
                  Loading {category} recipes...
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const displayRecipes = searchQuery ? filteredRecipes : categoryRecipes;
  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="min-h-screen bg-cream-100">
      <Sidebar />
      <div className="ml-64 flex flex-col">
        <Navbar onSearch={handleSearch} />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-sage-900 mb-2">
                {categoryTitle} Recipes
              </h1>
              <p className="text-sage-600">
                Recipes in the {category} category
              </p>
            </div>

            {searchQuery && filteredRecipes.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-sage-500 text-lg mb-4">
                  No {category} recipes found
                </div>
                <p className="text-sage-400">
                  Try searching with different keywords.
                </p>
              </div>
            ) : displayRecipes.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-sage-500 text-lg mb-4">
                  No {category} recipes yet
                </div>
                <p className="text-sage-400">
                  Add some recipes in the {category} category to see them here.
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-sage-900">
                    {categoryTitle} ({displayRecipes.length})
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {displayRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
