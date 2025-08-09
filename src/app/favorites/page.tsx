'use client';

import { useState, useEffect } from 'react';
import { Recipe } from '@/lib/supabase';
import { RecipeAPI } from '@/lib/api';
import RecipeCard from '@/components/RecipeCard';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

export default function FavoritesPage() {
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchFavoriteRecipes = async () => {
      try {
        const allRecipes = await RecipeAPI.getRecipes();
        const favorites = allRecipes.filter((recipe: Recipe) => recipe.is_favorite);
        setFavoriteRecipes(favorites);
        setFilteredRecipes(favorites);
      } catch (error) {
        console.error('Error fetching favorite recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteRecipes();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredRecipes(favoriteRecipes);
    } else {
      const filtered = favoriteRecipes.filter((recipe: Recipe) =>
        recipe.title.toLowerCase().includes(query.toLowerCase()) ||
        recipe.ingredients.some((ingredient: string) =>
          ingredient.toLowerCase().includes(query.toLowerCase())
        )
      );
      setFilteredRecipes(filtered);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100">
        <Sidebar />
        <div className="ml-64 flex flex-col">
          <Navbar onSearch={handleSearch} />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center py-12">
                <div className="text-sage-500 text-lg">Loading favorite recipes...</div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const displayRecipes = searchQuery ? filteredRecipes : favoriteRecipes;

  return (
    <div className="min-h-screen bg-cream-100">
      <Sidebar />
      <div className="ml-64 flex flex-col">
        <Navbar onSearch={handleSearch} />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-sage-900 mb-2">Favorite Recipes</h1>
              <p className="text-sage-600">Your saved favorite recipes</p>
            </div>

            {searchQuery && filteredRecipes.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-sage-500 text-lg mb-4">No favorite recipes found</div>
                <p className="text-sage-400">Try searching with different keywords.</p>
              </div>
            ) : displayRecipes.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-sage-500 text-lg mb-4">No favorite recipes yet</div>
                <p className="text-sage-400">
                  Click the heart icon on any recipe card to add it to your favorites.
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-sage-900">
                    Favorites ({displayRecipes.length})
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
