// Client-side API service for recipe operations
import { Recipe } from './supabase'

const API_BASE = '/api'

export class RecipeAPI {
  // Fetch all recipes
  static async getRecipes(): Promise<Recipe[]> {
    const response = await fetch(`${API_BASE}/recipes`)
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch recipes')
    }
    
    const data = await response.json()
    return data.recipes
  }

  // Fetch a single recipe by ID
  static async getRecipe(id: string): Promise<Recipe> {
    const response = await fetch(`${API_BASE}/recipes/${id}`)
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch recipe')
    }
    
    const data = await response.json()
    return data.recipe
  }

  // Create a new recipe
  static async createRecipe(recipeData: {
    title: string
    ingredients: string[]
    directions: string
    image_url?: string
    cook_time?: number
    servings?: number
    category?: string
  }): Promise<Recipe> {
    const response = await fetch(`${API_BASE}/recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipeData),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create recipe')
    }
    
    const data = await response.json()
    return data.recipe
  }

  // Update an existing recipe
  static async updateRecipe(id: string, recipeData: {
    title: string
    ingredients: string[]
    directions: string
    image_url?: string
    cook_time?: number
    servings?: number
    category?: string
  }): Promise<Recipe> {
    const response = await fetch(`${API_BASE}/recipes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipeData),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update recipe')
    }
    
    const data = await response.json()
    return data.recipe
  }

  // Delete a recipe
  static async deleteRecipe(id: string): Promise<void> {
    const response = await fetch(`/api/recipes/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete recipe');
    }
  }

  static async updateFavorite(id: string, is_favorite: boolean): Promise<Recipe> {
    const response = await fetch(`/api/recipes/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_favorite }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update favorite status');
    }

    return response.json();
  }
}
