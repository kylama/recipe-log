'use client'

import { useState, useEffect } from 'react'
import { Recipe } from '@/lib/supabase'
import { RecipeAPI } from '@/lib/api'
import RecipeCard from './RecipeCard'

interface RecipeListProps {
  searchQuery?: string
  refreshTrigger?: number // Add this to trigger refreshes
}

export default function RecipeList({ searchQuery = '', refreshTrigger = 0 }: RecipeListProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRecipes = async () => {
    console.log('Fetching recipes...')
    try {
      setLoading(true)
      setError(null)
      
      const recipes = await RecipeAPI.getRecipes()
      console.log('Fetched recipes:', recipes)
      setRecipes(recipes || [])
    } catch (error) {
      console.error('Error fetching recipes:', error)
      setError('Failed to load recipes. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecipes()
  }, [refreshTrigger]) // Add refreshTrigger to dependencies

  useEffect(() => {
    // Filter recipes based on search query
    if (!searchQuery.trim()) {
      setFilteredRecipes(recipes)
    } else {
      const filtered = recipes.filter((recipe: Recipe) =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.some((ingredient: string) => 
          ingredient.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        recipe.directions.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredRecipes(filtered)
    }
  }, [recipes, searchQuery])



  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg mb-4">Error</div>
        <p className="text-sage-400">{error}</p>
      </div>
    )
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-sage-500 text-lg mb-4">No recipes yet!</div>
        <p className="text-sage-400">Add your first recipe using the add button.</p>
      </div>
    )
  }

  if (searchQuery && filteredRecipes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-sage-500 text-lg mb-4">No recipes found</div>
        <p className="text-sage-400">Try searching with different keywords.</p>
      </div>
    )
  }

  const displayRecipes = searchQuery ? filteredRecipes : recipes

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-sage-900">Recipes ({displayRecipes.length})</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  )
}

export { type Recipe }
