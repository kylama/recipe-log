'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface RecipeFormProps {
  onRecipeAdded: () => void
}

export default function RecipeForm({ onRecipeAdded }: RecipeFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    ingredients: '',
    directions: '',
    image_url: '',
    cook_time: '',
    servings: ''
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const ingredientsArray = formData.ingredients
        .split('\n')
        .map(ingredient => ingredient.trim())
        .filter(ingredient => ingredient.length > 0)

      // Use the image preview (data URL) if an image was uploaded
      const imageUrl = imagePreview || formData.image_url || null

      const { error } = await supabase
        .from('recipes')
        .insert([
          {
            title: formData.title,
            ingredients: ingredientsArray,
            directions: formData.directions,
            image_url: imageUrl,
            cook_time: formData.cook_time ? parseInt(formData.cook_time) : null,
            servings: formData.servings ? parseInt(formData.servings) : null
          }
        ])

      if (error) throw error

      // Reset form
      setFormData({
        title: '',
        ingredients: '',
        directions: '',
        image_url: '',
        cook_time: '',
        servings: ''
      })
      setImageFile(null)
      setImagePreview('')

      onRecipeAdded()
      alert('Recipe added successfully!')
    } catch (error) {
      console.error('Error adding recipe:', error)
      alert('Error adding recipe. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview('')
    setFormData({ ...formData, image_url: '' })
  }

  return (
    <div>
      {/* Title is now handled by the modal header */}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-sage-900 mb-1">
            Recipe Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-sage-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white text-gray-900"
            placeholder="Enter recipe title"
          />
        </div>

        <div>
          <label htmlFor="ingredients" className="block text-sm font-medium text-sage-900 mb-1">
            Ingredients * (one per line)
          </label>
          <textarea
            id="ingredients"
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-3 py-2 border border-sage-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white text-gray-900"
            placeholder="1 cup flour&#10;2 eggs&#10;1/2 cup milk"
          />
        </div>

        <div>
          <label htmlFor="directions" className="block text-sm font-medium text-sage-900 mb-1">
            Directions *
          </label>
          <textarea
            id="directions"
            name="directions"
            value={formData.directions}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-3 py-2 border border-sage-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white text-gray-900"
            placeholder="Step-by-step cooking instructions"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-sage-900 mb-1">
            Recipe Image (optional)
          </label>
          
          {/* Image Preview */}
          {imagePreview && (
            <div className="mb-3 relative">
              <img
                src={imagePreview}
                alt="Recipe preview"
                className="w-full h-32 object-cover rounded-md border border-sage-300"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          )}
          
          {/* File Upload */}
          <div className="border-2 border-dashed border-sage-300 rounded-md p-4 text-center hover:border-sage-400 transition-colors">
            <input
              type="file"
              id="image_upload"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="image_upload" className="cursor-pointer">
              <div className="flex flex-col items-center">
                <svg className="w-8 h-8 text-sage-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm text-sage-600">Click to upload an image</span>
                <span className="text-xs text-sage-400 mt-1">PNG, JPG, GIF up to 10MB</span>
              </div>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="cook_time" className="block text-sm font-medium text-sage-900 mb-1">
              Cook Time (minutes)
            </label>
            <input
              type="number"
              id="cook_time"
              name="cook_time"
              value={formData.cook_time}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-sage-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white text-gray-900"
              placeholder="30"
            />
          </div>

          <div>
            <label htmlFor="servings" className="block text-sm font-medium text-sage-900 mb-1">
              Servings
            </label>
            <input
              type="number"
              id="servings"
              name="servings"
              value={formData.servings}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-sage-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white text-gray-900"
              placeholder="4"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-sage-600 text-white py-2 px-4 rounded-md hover:bg-sage-700 focus:outline-none focus:ring-2 focus:ring-sage-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Adding Recipe...' : 'Add Recipe'}
        </button>
      </form>
    </div>
  )
}
