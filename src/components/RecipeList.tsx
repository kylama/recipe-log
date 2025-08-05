'use client'

import { useState, useEffect } from 'react'
import { supabase, Recipe } from '@/lib/supabase'
import RecipeCard from './RecipeCard'

interface RecipeListProps {
  searchQuery?: string
}

export default function RecipeList({ searchQuery = '' }: RecipeListProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setRecipes(data || [])
    } catch (error) {
      console.error('Error fetching recipes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecipes()
  }, [])

  useEffect(() => {
    // Filter recipes based on search query
    if (!searchQuery.trim()) {
      setFilteredRecipes(recipes)
    } else {
      const filtered = recipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        recipe.directions.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredRecipes(filtered)
    }
  }, [recipes, searchQuery])

  const refreshRecipes = () => {
    fetchRecipes()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600"></div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  )
}

export { type Recipe }
