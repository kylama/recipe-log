'use client'

import { useState, useEffect } from 'react'
import RecipeForm from '@/components/RecipeForm'
import RecipeList from '@/components/RecipeList'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'

export default function Home() {
  const [showForm, setShowForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  // Check if we're coming from a recipe operation
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const refreshParam = urlParams.get('refresh')
    const operation = urlParams.get('operation')
    
    if (refreshParam || operation) {
      console.log('Detected recipe operation, triggering refresh...')
      setRefreshKey(prev => prev + 1)
      
      // Clean up the URL
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)
    }
  }, [])

  const handleRecipeAdded = () => {
    // Force refresh of recipe list and close form
    console.log('Recipe added, refreshing list...')
    setRefreshKey(prev => prev + 1)
    setShowForm(false)
  }

  const handleCloseForm = () => {
    setShowForm(false)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  // Function to trigger refresh from other components
  const triggerRefresh = () => {
    console.log('Triggering refresh from home page...')
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-cream-100 flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar onSearch={handleSearch} />
        
        {/* Page Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <RecipeList key={refreshKey} searchQuery={searchQuery} refreshTrigger={refreshKey} />
          </div>

          {/* Floating Add Button */}
          <button
            onClick={() => setShowForm(true)}
            className="fixed bottom-6 right-6 bg-sage-600 hover:bg-sage-700 text-white w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50"
            aria-label="Add new recipe"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>

          {/* Modal Form */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-sage-200">
                  <h2 className="text-2xl font-bold text-sage-800">Add New Recipe</h2>
                  <button
                    onClick={handleCloseForm}
                    className="text-sage-600 hover:text-sage-800 transition-colors"
                    aria-label="Close form"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-6">
                  <RecipeForm onRecipeAdded={handleRecipeAdded} />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
