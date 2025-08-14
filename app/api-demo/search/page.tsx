'use client'

import { useState, useEffect, useMemo } from 'react'
import { searchContent, SearchResult } from '@/lib/wp'
import Link from 'next/link'
import Image from 'next/image'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searchType, setSearchType] = useState<'all' | 'post' | 'page'>('all')
  const [subtype, setSubtype] = useState('')

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const searchResults = await searchContent(query, {
          type: searchType === 'all' ? undefined : searchType,
          subtype: subtype || undefined,
          perPage: 20
        })
        setResults(searchResults)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query, searchType, subtype])

  // Group results by type
  const groupedResults = useMemo(() => {
    const groups: { [key: string]: SearchResult[] } = {}
    results.forEach(result => {
      const type = result.type || 'unknown'
      if (!groups[type]) groups[type] = []
      groups[type].push(result)
    })
    return groups
  }, [results])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'post': return '📝'
      case 'page': return '📄'
      case 'attachment': return '🖼️'
      default: return '📄'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'post': return 'bg-blue-100 text-blue-800'
      case 'page': return 'bg-green-100 text-green-800'
      case 'attachment': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔍 WordPress Search API
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Real-time search across all WordPress content using the /wp/v2/search endpoint.
            Search posts, pages, and media with live results and filtering options.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Form */}
        <div className="bg-white p-6 rounded-lg shadow border mb-8">
          <div className="space-y-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Query
              </label>
              <input
                id="search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search posts, pages, media..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Content Type
                </label>
                <select
                  id="type"
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value as 'all' | 'post' | 'page')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Content</option>
                  <option value="post">Posts Only</option>
                  <option value="page">Pages Only</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="subtype" className="block text-sm font-medium text-gray-700 mb-2">
                  Subtype (Optional)
                </label>
                <input
                  id="subtype"
                  type="text"
                  value={subtype}
                  onChange={(e) => setSubtype(e.target.value)}
                  placeholder="e.g., attachment"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {query && (
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  {loading ? 'Searching...' : `${results.length} results found`}
                </span>
                <div className="flex items-center gap-2">
                  <span>Powered by</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">/wp/v2/search</code>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Results */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Searching...</span>
          </div>
        )}

        {!loading && query && results.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters</p>
          </div>
        )}

        {!loading && Object.keys(groupedResults).map(type => (
          <div key={type} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{getTypeIcon(type)}</span>
              <h2 className="text-xl font-semibold text-gray-900 capitalize">
                {type}s ({groupedResults[type].length})
              </h2>
            </div>
            
            <div className="grid gap-4">
              {groupedResults[type].map(result => (
                <div key={result.id} className="bg-white p-6 rounded-lg shadow border hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(result.type || 'unknown')}`}>
                        {result.type}
                      </span>
                      <span className="text-sm text-gray-500">ID: {result.id}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(result.date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    <Link 
                      href={result.url} 
                      className="hover:text-blue-600 transition-colors"
                      dangerouslySetInnerHTML={{ __html: result.title }}
                    />
                  </h3>
                  
                  {result.excerpt && (
                    <div 
                      className="text-gray-600 mb-3 line-clamp-3" 
                      dangerouslySetInnerHTML={{ __html: result.excerpt }} 
                    />
                  )}
                  
                  <div className="flex items-center justify-between">
                    <Link 
                      href={result.url}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Content →
                    </Link>
                    <div className="text-xs text-gray-500">
                      <code>{result.url}</code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* API Info */}
        {!query && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              WordPress Search API Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Search Capabilities:</h4>
                <ul className="space-y-1 text-blue-700">
                  <li>• Full-text search across content</li>
                  <li>• Search by content type (post, page)</li>
                  <li>• Subtype filtering</li>
                  <li>• Pagination support</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Response Data:</h4>
                <ul className="space-y-1 text-blue-700">
                  <li>• Title and excerpt with highlights</li>
                  <li>• Content URL and date</li>
                  <li>• Content type and subtype</li>
                  <li>• Unique content ID</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white rounded border">
              <code className="text-sm text-gray-800">
                GET /wp/v2/search?search={'{query}'}&type={'{type}'}&subtype={'{subtype}'}
              </code>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
