"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Recipe } from "@/lib/supabase";
import { RecipeAPI } from "@/lib/api";
import RecipeForm from "@/components/RecipeForm";

export default function RecipePage() {
  const params = useParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchRecipe = useCallback(
    async (id: string) => {
      try {
        const recipe = await RecipeAPI.getRecipe(id);
        setRecipe(recipe);
      } catch (error) {
        console.error("Error fetching recipe:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  useEffect(() => {
    if (params.id) {
      fetchRecipe(params.id as string);
    }
  }, [params.id]);

  const handleDelete = async () => {
    if (!recipe) {
      console.error("No recipe to delete");
      return;
    }

    console.log("Attempting to delete recipe:", recipe.id);
    setIsDeleting(true);

    try {
      await RecipeAPI.deleteRecipe(recipe.id);
      console.log("Recipe deleted successfully");
      alert("Recipe deleted successfully!");

      // Redirect to home page after successful deletion
      router.push("/");
    } catch (error: any) {
      console.error("Error deleting recipe:", error);
      alert(`Error deleting recipe: ${error?.message || "Please try again."}`);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleRecipeUpdated = async () => {
    // Refresh the recipe data after update
    if (recipe) {
      await fetchRecipe(recipe.id);
    }
    setShowEditForm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-sage-900 mb-4">
            Recipe not found
          </h1>
          <button
            onClick={() => router.push("/")}
            className="bg-sage-600 text-white px-4 py-2 rounded-lg hover:bg-sage-700 transition-colors"
          >
            Back to Recipes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-sage-700 hover:text-sage-900 mb-6 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Recipes
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Recipe Image */}
          {recipe.image_url && (
            <div className="h-64 md:h-80">
              <Image
                src={recipe.image_url}
                alt={recipe.title}
                width={800}
                height={320}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {/* Recipe Header */}
            <div className="mb-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-sage-900">
                  {recipe.title}
                </h1>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowEditForm(true)}
                    className="bg-sage-600 text-white px-4 py-2 rounded-lg hover:bg-sage-700 transition-colors flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </button>

                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sage-700 mb-4">
                {recipe.cook_time && (
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-medium">
                      {recipe.cook_time} minutes
                    </span>
                  </div>
                )}

                {recipe.servings && (
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span className="font-medium">
                      {recipe.servings} servings
                    </span>
                  </div>
                )}
              </div>

              <div className="text-sm text-sage-600">
                Added on {formatDate(recipe.created_at)}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Ingredients */}
              <div>
                <h2 className="text-2xl font-bold text-sage-900 mb-4">
                  Ingredients
                </h2>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-sage-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Directions */}
              <div>
                <h2 className="text-2xl font-bold text-sage-900 mb-4">
                  Directions
                </h2>
                <div className="prose prose-sage max-w-none">
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {recipe.directions}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-sage-900 mb-4">
                Delete Recipe
              </h3>
              <p className="text-sage-700 mb-6">
                Are you sure you want to delete "{recipe.title}"? This action
                cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Form Modal */}
        {showEditForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b border-sage-200">
                <h2 className="text-2xl font-bold text-sage-800">
                  Edit Recipe
                </h2>
                <button
                  onClick={() => setShowEditForm(false)}
                  className="text-sage-600 hover:text-sage-800 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <RecipeForm
                  recipe={recipe}
                  isEditMode={true}
                  onRecipeUpdated={handleRecipeUpdated}
                  onCancel={() => setShowEditForm(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
