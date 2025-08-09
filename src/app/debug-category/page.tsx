'use client';

import { useState } from 'react';
import { RecipeAPI } from '@/lib/api';

export default function DebugCategoryPage() {
  const [recipeId, setRecipeId] = useState('');
  const [newCategory, setNewCategory] = useState('breakfast');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testCategoryUpdate = async () => {
    if (!recipeId.trim()) {
      setResult('Please enter a recipe ID');
      return;
    }

    setLoading(true);
    setResult('Testing category update...');

    try {
      // First, get the current recipe
      const currentRecipe = await RecipeAPI.getRecipe(recipeId);
      setResult(prev => prev + `\n\nCurrent recipe data:\n${JSON.stringify(currentRecipe, null, 2)}`);

      // Try to update the category
      const updatedRecipe = await RecipeAPI.updateRecipe(recipeId, {
        title: currentRecipe.title,
        ingredients: currentRecipe.ingredients,
        directions: currentRecipe.directions,
        image_url: currentRecipe.image_url,
        cook_time: currentRecipe.cook_time,
        servings: currentRecipe.servings,
        category: newCategory,
      });

      setResult(prev => prev + `\n\nUpdate API response:\n${JSON.stringify(updatedRecipe, null, 2)}`);

      // Fetch the recipe again to see if it actually changed
      const refetchedRecipe = await RecipeAPI.getRecipe(recipeId);
      setResult(prev => prev + `\n\nRefetched recipe data:\n${JSON.stringify(refetchedRecipe, null, 2)}`);

      // Compare categories
      if (refetchedRecipe.category === newCategory) {
        setResult(prev => prev + `\n\n✅ SUCCESS: Category was updated from "${currentRecipe.category}" to "${refetchedRecipe.category}"`);
      } else {
        setResult(prev => prev + `\n\n❌ FAILED: Category should be "${newCategory}" but is still "${refetchedRecipe.category}"`);
        setResult(prev => prev + `\n\nThis indicates a Supabase RLS (Row Level Security) policy is blocking the update.`);
      }

    } catch (error: any) {
      setResult(prev => prev + `\n\nError: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-sage-900 mb-8">Debug Category Update</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-sage-900 mb-2">
                Recipe ID to test:
              </label>
              <input
                type="text"
                value={recipeId}
                onChange={(e) => setRecipeId(e.target.value)}
                className="w-full px-3 py-2 border border-sage-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-500"
                placeholder="Enter a recipe ID"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-sage-900 mb-2">
                New category to set:
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 border border-sage-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-500"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="cakes">Cakes</option>
                <option value="cookies">Cookies</option>
                <option value="pastries">Pastries</option>
                <option value="other desserts">Other Desserts</option>
                <option value="drinks">Drinks</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <button
              onClick={testCategoryUpdate}
              disabled={loading}
              className="bg-sage-600 text-white px-6 py-2 rounded-md hover:bg-sage-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Category Update'}
            </button>
          </div>
        </div>
        
        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-sage-900 mb-4">Test Results:</h2>
            <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto whitespace-pre-wrap">
              {result}
            </pre>
          </div>
        )}
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
          <h3 className="font-bold text-yellow-800 mb-2">Expected Issue:</h3>
          <p className="text-yellow-700">
            If the category update fails, it's likely due to Supabase RLS policies blocking the update operation.
            You'll need to add or update RLS policies in your Supabase dashboard to allow updates to the recipes table.
          </p>
        </div>
      </div>
    </div>
  );
}
