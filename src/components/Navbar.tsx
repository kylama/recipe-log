'use client'

import { useState } from 'react'

interface NavbarProps {
  onSearch: (query: string) => void
}

export default function Navbar({ onSearch }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    // Real-time search as user types
    onSearch(query)
  }

  return (
    <nav className="bg-white border-b border-sage-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-sage-900">My Recipes</h1>
        </div>

        <div className="flex-1 max-w-md mx-8">
          <form onSubmit={handleSearch} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-sage-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              className="block w-full pl-10 pr-3 py-2 border border-sage-300 rounded-md leading-5 bg-white placeholder-sage-500 focus:outline-none focus:placeholder-sage-400 focus:ring-1 focus:ring-sage-500 focus:border-sage-500 text-gray-900"
              placeholder="Search recipes..."
            />
          </form>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-lg hover:bg-sage-100 text-sage-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5V3h0z" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}
