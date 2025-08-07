'use client'

import { useState } from 'react'
import { supabase, testDatabaseConnection } from '@/lib/supabase'

export default function TestPage() {
  const [testResults, setTestResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const runTests = async () => {
    setLoading(true)
    setTestResults([])
    
    try {
      addResult('Starting database tests...')
      
      // Test 1: Check Supabase client
      if (!supabase) {
        addResult('❌ Supabase client is not available')
        return
      }
      addResult('✅ Supabase client is available')
      
      // Test 2: Test database connection
      const connectionTest = await testDatabaseConnection()
      if (connectionTest) {
        addResult('✅ Database connection test passed')
      } else {
        addResult('❌ Database connection test failed')
      }
      
      // Test 3: Try to fetch recipes
      try {
        const { data, error } = await supabase
          .from('recipes')
          .select('*')
          .limit(5)
        
        if (error) {
          addResult(`❌ Error fetching recipes: ${error.message}`)
        } else {
          addResult(`✅ Successfully fetched ${data?.length || 0} recipes`)
          if (data && data.length > 0) {
            addResult(`📝 Sample recipe: ${data[0].title}`)
          }
        }
      } catch (error) {
        addResult(`❌ Exception fetching recipes: ${error}`)
      }
      
      // Test 4: Try to insert a test recipe
      try {
        const testRecipe = {
          title: 'Test Recipe ' + Date.now(),
          ingredients: ['Test ingredient 1', 'Test ingredient 2'],
          directions: 'Test directions',
          image_url: null,
          cook_time: 30,
          servings: 2
        }
        
        const { data, error } = await supabase
          .from('recipes')
          .insert([testRecipe])
          .select()
        
        if (error) {
          addResult(`❌ Error inserting test recipe: ${error.message}`)
        } else {
          addResult(`✅ Successfully inserted test recipe: ${data?.[0]?.title}`)
          
          // Test 5: Try to update the test recipe
          const updateData = {
            title: 'Updated Test Recipe ' + Date.now()
          }
          
          const { error: updateError } = await supabase
            .from('recipes')
            .update(updateData)
            .eq('id', data[0].id)
          
          if (updateError) {
            addResult(`❌ Error updating test recipe: ${updateError.message}`)
          } else {
            addResult(`✅ Successfully updated test recipe`)
          }
          
          // Test 6: Try to delete the test recipe
          const { error: deleteError } = await supabase
            .from('recipes')
            .delete()
            .eq('id', data[0].id)
          
          if (deleteError) {
            addResult(`❌ Error deleting test recipe: ${deleteError.message}`)
          } else {
            addResult(`✅ Successfully deleted test recipe`)
          }
        }
      } catch (error) {
        addResult(`❌ Exception with test recipe operations: ${error}`)
      }
      
    } catch (error) {
      addResult(`❌ General error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-sage-900 mb-6">Database Test Page</h1>
        
        <button
          onClick={runTests}
          disabled={loading}
          className="bg-sage-600 text-white px-6 py-3 rounded-lg hover:bg-sage-700 transition-colors disabled:opacity-50 mb-6"
        >
          {loading ? 'Running Tests...' : 'Run Database Tests'}
        </button>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-sage-900 mb-4">Test Results:</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-sage-600">Click "Run Database Tests" to start testing...</p>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="text-sm font-mono bg-gray-50 p-2 rounded">
                  {result}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
