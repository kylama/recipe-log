"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Category } from "@/lib/supabase";
import { CategoryAPI } from "@/lib/categoryApi";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const fetchedCategories = await CategoryAPI.getCategories();
      // Sort categories alphabetically by name
      const sortedCategories = [...fetchedCategories].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
      );
      setCategories(sortedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const newCategory = await CategoryAPI.createCategory(
        newCategoryName.trim()
      );
      // Add new category and sort the array
      const updatedCategories = [...categories, newCategory].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
      );
      setCategories(updatedCategories);
      setNewCategoryName("");
      setIsAddingCategory(false);
    } catch (error) {
      console.error("Error adding category:", error);
      alert(error instanceof Error ? error.message : "Failed to add category");
    }
  };

  const handleEditCategory = async (id: string) => {
    if (!editingCategoryName.trim()) return;

    try {
      const updatedCategory = await CategoryAPI.updateCategory(
        id,
        editingCategoryName.trim()
      );
      // Update category and sort the array
      const updatedCategories = categories
        .map((cat) => (cat.id === id ? updatedCategory : cat))
        .sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
        );

      setCategories(updatedCategories);
      setEditingCategoryId(null);
      setEditingCategoryName("");
    } catch (error) {
      console.error("Error updating category:", error);
      alert(
        error instanceof Error ? error.message : "Failed to update category"
      );
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await CategoryAPI.deleteCategory(id);
      setCategories(categories.filter((cat) => cat.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
      alert(
        error instanceof Error ? error.message : "Failed to delete category"
      );
    }
  };

  const startEditingCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
  };

  const cancelEditing = () => {
    setEditingCategoryId(null);
    setEditingCategoryName("");
  };

  const navigationItems = [
    {
      name: "All Recipes",
      href: "/",
      icon: (
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
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
    },
    {
      name: "Favorites",
      href: "/favorites",
      icon: (
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
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div
      className={`bg-sage-100 fixed left-0 top-0 h-full min-h-screen transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } border-r border-sage-200 flex flex-col z-10`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          {!isCollapsed && (
            <h2 className="text-xl font-bold text-sage-900">Recipe Log</h2>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-sage-200 text-sage-700 transition-colors"
          >
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        <nav className="space-y-2">
          {/* Regular navigation items */}
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-sage-600 text-white"
                    : "text-sage-700 hover:bg-sage-200"
                }`}
              >
                {item.icon}
                {!isCollapsed && (
                  <span className="font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}

          {/* Expandable Categories Section */}
          <div>
            <button
              onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                pathname.startsWith("/category")
                  ? "bg-sage-600 text-white"
                  : "text-sage-700 hover:bg-sage-200"
              }`}
            >
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
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              {!isCollapsed && (
                <>
                  <span className="font-medium flex-1 text-left">
                    Categories
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      isCategoriesExpanded ? "rotate-90" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </>
              )}
            </button>

            {/* Category Options */}
            {isCategoriesExpanded && !isCollapsed && (
              <div className="ml-8 mt-1 space-y-1">
                {loading ? (
                  <div className="px-3 py-1 text-sm text-sage-500">
                    Loading categories...
                  </div>
                ) : (
                  <>
                    {categories.map((category) => {
                      const categoryPath = `/category/${encodeURIComponent(
                        category.name
                      )}`;
                      const isActive = pathname === categoryPath;
                      const isEditing = editingCategoryId === category.id;

                      return (
                        <div key={category.id} className="group relative">
                          {isEditing ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={editingCategoryName}
                                onChange={(e) =>
                                  setEditingCategoryName(e.target.value)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter")
                                    handleEditCategory(category.id);
                                  if (e.key === "Escape") cancelEditing();
                                }}
                                className="flex-1 px-2 py-1 text-xs border border-sage-300 rounded focus:outline-none focus:ring-1 focus:ring-sage-500 text-gray-900 bg-white"
                                autoFocus
                              />
                              <button
                                onClick={() => handleEditCategory(category.id)}
                                className="p-1 text-green-600 hover:text-green-800"
                                title="Save"
                              >
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="p-1 text-red-600 hover:text-red-800"
                                title="Cancel"
                              >
                                <svg
                                  className="w-3 h-3"
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
                          ) : (
                            <div className="flex items-center justify-between">
                              <Link
                                href={categoryPath}
                                className={`flex-1 block px-3 py-1 rounded-md text-sm transition-colors ${
                                  isActive
                                    ? "bg-sage-500 text-white"
                                    : "text-sage-600 hover:bg-sage-200"
                                }`}
                              >
                                {category.name.charAt(0).toUpperCase() +
                                  category.name.slice(1)}
                              </Link>
                              <div className="opacity-0 group-hover:opacity-100 flex gap-1 ml-2">
                                <button
                                  onClick={() => startEditingCategory(category)}
                                  className="p-1 text-sage-500 hover:text-sage-700"
                                  title="Edit category"
                                >
                                  <svg
                                    className="w-3 h-3"
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
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteCategory(category.id)
                                  }
                                  className="p-1 text-red-500 hover:text-red-700"
                                  title="Delete category"
                                >
                                  <svg
                                    className="w-3 h-3"
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
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Add Category Section */}
                    <div className="border-t border-sage-300 pt-2 mt-2">
                      {isAddingCategory ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleAddCategory();
                              if (e.key === "Escape") {
                                setIsAddingCategory(false);
                                setNewCategoryName("");
                              }
                            }}
                            placeholder="Category name"
                            className="flex-1 px-2 py-1 text-xs border border-sage-300 rounded focus:outline-none focus:ring-1 focus:ring-sage-500 text-gray-900 bg-white"
                            autoFocus
                          />
                          <button
                            onClick={handleAddCategory}
                            className="p-1 text-green-600 hover:text-green-800"
                            title="Add"
                          >
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              setIsAddingCategory(false);
                              setNewCategoryName("");
                            }}
                            className="p-1 text-red-600 hover:text-red-800"
                            title="Cancel"
                          >
                            <svg
                              className="w-3 h-3"
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
                      ) : (
                        <button
                          onClick={() => setIsAddingCategory(true)}
                          className="w-full px-3 py-1 text-sm text-sage-600 hover:bg-sage-200 rounded-md transition-colors text-left flex items-center gap-2"
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
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                          Add a category
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
