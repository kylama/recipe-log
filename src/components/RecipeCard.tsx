import { Recipe } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Link href={`/recipe/${recipe.id}`} className="block">
      <div className="bg-sage-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer">
        {/* Image Section - Main focus */}
        <div className="relative h-48 bg-sage-100">
          {recipe.image_url ? (
            <Image
              src={recipe.image_url}
              alt={recipe.title}
              className="w-full h-full object-cover"
              fill
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-sage-100">
              <svg
                className="w-16 h-16 text-sage-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Brief Info Section */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-sage-900 mb-2 line-clamp-2">
            {recipe.title}
          </h3>

          <div className="flex items-center justify-between text-sm text-sage-700 mb-2">
            <div className="flex items-center gap-3">
              {recipe.cook_time && (
                <span className="flex items-center gap-1">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {recipe.cook_time}m
                </span>
              )}

              {recipe.servings && (
                <span className="flex items-center gap-1">
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {recipe.servings}
                </span>
              )}
            </div>
          </div>

          <div className="text-xs text-sage-600">
            Added {formatDate(recipe.created_at)}
          </div>
        </div>
      </div>
    </Link>
  );
}
