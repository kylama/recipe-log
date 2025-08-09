'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { RECIPE_CATEGORIES } from '@/lib/supabase'

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false)
  const pathname = usePathname()

  const navigationItems = [
    {
      name: 'All Recipes',
      href: '/',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      name: 'Favorites',
      href: '/favorites',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    }
  ]

  return (
    <div className={`bg-sage-100 h-screen transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} border-r border-sage-200`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          {!isCollapsed && (
            <h2 className="text-xl font-bold text-sage-900">Recipe Log</h2>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-sage-200 text-sage-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <nav className="space-y-2">
          {/* Regular navigation items */}
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-sage-600 text-white'
                    : 'text-sage-700 hover:bg-sage-200'
                }`}
              >
                {item.icon}
                {!isCollapsed && <span className="font-medium">{item.name}</span>}
              </Link>
            )
          })}
          
          {/* Expandable Categories Section */}
          <div>
            <button
              onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                pathname.startsWith('/category')
                  ? 'bg-sage-600 text-white'
                  : 'text-sage-700 hover:bg-sage-200'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              {!isCollapsed && (
                <>
                  <span className="font-medium flex-1 text-left">Categories</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      isCategoriesExpanded ? 'rotate-90' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
            
            {/* Category Options */}
            {isCategoriesExpanded && !isCollapsed && (
              <div className="ml-8 mt-1 space-y-1">
                {RECIPE_CATEGORIES.map((category) => {
                  const categoryPath = `/category/${encodeURIComponent(category)}`
                  const isActive = pathname === categoryPath
                  return (
                    <Link
                      key={category}
                      href={categoryPath}
                      className={`block px-3 py-1 rounded-md text-sm transition-colors ${
                        isActive
                          ? 'bg-sage-500 text-white'
                          : 'text-sage-600 hover:bg-sage-200'
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  )
}
