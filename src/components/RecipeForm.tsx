"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Recipe, RECIPE_CATEGORIES, RecipeCategory } from "@/lib/supabase";
import { RecipeAPI } from "@/lib/api";

interface RecipeFormProps {
  onRecipeAdded?: () => void;
  onRecipeUpdated?: () => void;
  onCancel?: () => void;
  recipe?: Recipe; // For editing mode
  isEditMode?: boolean;
}

export default function RecipeForm({
  onRecipeAdded,
  onRecipeUpdated,
  onCancel,
  recipe,
  isEditMode = false,
}: RecipeFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    ingredients: "",
    directions: "",
    image_url: "",
    cook_time: "",
    servings: "",
    category: "other" as RecipeCategory,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when editing
  useEffect(() => {
    if (recipe && isEditMode) {
      setFormData({
        title: recipe.title,
        ingredients: recipe.ingredients.join("\n"),
        directions: recipe.directions,
        image_url: recipe.image_url || "",
        cook_time: recipe.cook_time?.toString() || "",
        servings: recipe.servings?.toString() || "",
        category: recipe.category || "other",
      });
      // Set image preview if recipe has an image
      if (recipe.image_url) {
        setImagePreview(recipe.image_url);
      }
    }
  }, [recipe, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();



    setIsSubmitting(true);

    try {
      const ingredientsArray = formData.ingredients
        .split("\n")
        .map((ingredient) => ingredient.trim())
        .filter((ingredient) => ingredient.length > 0);

      // Use the image preview (data URL) if an image was uploaded
      const imageUrl = imagePreview || formData.image_url || null;

      if (isEditMode && recipe) {
        // Update existing recipe
        console.log("Attempting to update recipe:", recipe.id, {
          formData,
          imageUrl,
        });

        const updatedRecipe = await RecipeAPI.updateRecipe(recipe.id, {
          title: formData.title,
          ingredients: ingredientsArray,
          directions: formData.directions,
          image_url: imageUrl || undefined,
          cook_time: formData.cook_time ? parseInt(formData.cook_time) : undefined,
          servings: formData.servings ? parseInt(formData.servings) : undefined,
          category: formData.category,
        });

        console.log("Recipe updated successfully:", updatedRecipe);
        onRecipeUpdated?.();
        alert("Recipe updated successfully!");
      } else {
        // Add new recipe
        console.log("Attempting to add new recipe:", { formData, imageUrl });
        const newRecipe = await RecipeAPI.createRecipe({
          title: formData.title,
          ingredients: ingredientsArray,
          directions: formData.directions,
          image_url: imageUrl || undefined,
          cook_time: formData.cook_time ? parseInt(formData.cook_time) : undefined,
          servings: formData.servings ? parseInt(formData.servings) : undefined,
          category: formData.category,
        });

        console.log("Recipe added successfully:", newRecipe);

        // Reset form only for new recipes
        setFormData({
          title: "",
          ingredients: "",
          directions: "",
          image_url: "",
          cook_time: "",
          servings: "",
          category: "other" as RecipeCategory,
        });
        setImageFile(null);
        setImagePreview("");

        onRecipeAdded?.();
        alert("Recipe added successfully!");
      }
    } catch (error: any) {
      console.error("Error saving recipe:", error);
      alert(
        `Error ${isEditMode ? "updating" : "adding"} recipe: ${error?.message || 'Please try again.'}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData({ ...formData, image_url: "" });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-sage-900 mb-1"
          >
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
          <label
            htmlFor="ingredients"
            className="block text-sm font-medium text-sage-900 mb-1"
          >
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
          <label
            htmlFor="directions"
            className="block text-sm font-medium text-sage-900 mb-1"
          >
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
            <div className="mb-3 relative flex justify-center">
              <Image
                src={imagePreview}
                alt="Recipe preview"
                width={400}
                height={300}
                className="max-w-full h-auto object-contain rounded-md border border-sage-300"
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
                <svg
                  className="w-8 h-8 text-sage-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span className="text-sm text-sage-600">
                  Click to upload an image
                </span>
                <span className="text-xs text-sage-400 mt-1">
                  PNG, JPG, GIF up to 10MB
                </span>
              </div>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="cook_time"
              className="block text-sm font-medium text-sage-900 mb-1"
            >
              Cook Time (minutes) *
            </label>
            <input
              type="number"
              id="cook_time"
              name="cook_time"
              value={formData.cook_time}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-sage-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white text-gray-900"
              placeholder="30"
            />
          </div>

          <div>
            <label
              htmlFor="servings"
              className="block text-sm font-medium text-sage-900 mb-1"
            >
              Servings *
            </label>
            <input
              type="number"
              id="servings"
              name="servings"
              value={formData.servings}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-sage-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white text-gray-900"
              placeholder="4"
            />
          </div>
        </div>

        {/* Category Selection */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-sage-900 mb-1"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-sage-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white text-gray-900"
          >
            {RECIPE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Button layout for edit mode vs add mode */}
        {isEditMode ? (
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-sage-600 text-white px-4 py-2 rounded-md hover:bg-sage-700 focus:outline-none focus:ring-2 focus:ring-sage-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-sage-600 text-white py-2 px-4 rounded-md hover:bg-sage-700 focus:outline-none focus:ring-2 focus:ring-sage-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Adding Recipe..." : "Add Recipe"}
          </button>
        )}
      </form>
    </div>
  );
}
