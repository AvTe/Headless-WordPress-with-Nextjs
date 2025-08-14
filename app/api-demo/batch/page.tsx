'use client'

import { useState } from 'react'
import { getMultipleContent } from '@/lib/wp'
import Link from 'next/link'
import Image from 'next/image'

interface BatchResult {
  posts: any[]
  pages: any[]
  categories: any[]
  tags: any[]
  media: any[]
  users: any[]
}

export default function BatchOperationsPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<BatchResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const runBatchOperation = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const batchData = await getMultipleContent({
        posts: { perPage: 5 },
        pages: { perPage: 3 },
        categories: { perPage: 8, hide_empty: false },
        tags: { perPage: 10, hide_empty: false },
        media: { perPage: 4, media_type: 'image' },
        users: { perPage: 5 }
      })
      
      setResults(batchData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ⚡ Batch Operations
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Demonstrate efficient batch loading of multiple WordPress content types in a single operation.
            This showcases the <code className="bg-gray-100 px-2 py-1 rounded">getMultipleContent</code> utility
            function that fetches posts, pages, categories, tags, media, and users simultaneously.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Control Panel */}
        <div className="bg-white p-6 rounded-lg shadow border mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Batch Operation Control</h2>
          <p className="text-gray-600 mb-6">
            Click the button below to fetch multiple content types simultaneously using Promise.all().
            This demonstrates efficient API usage by making parallel requests instead of sequential ones.
          </p>
          
          <button
            onClick={runBatchOperation}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-b-transparent"></div>
                Loading All Content...
              </>
            ) : (
              <>
                ⚡ Run Batch Operation
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-red-800 font-medium">Error:</div>
              <div className="text-red-700">{error}</div>
            </div>
          )}
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-8">
            {/* Posts */}
            <section className="bg-white p-6 rounded-lg shadow border">
              <h2 className="text-xl font-semibold text-blue-600 mb-4">
                📝 Posts ({results.posts.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.posts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2" 
                          dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                      <div className="text-sm text-gray-500">
                        {new Date(post.date).toLocaleDateString()} • ID: {post.id}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Pages */}
            <section className="bg-white p-6 rounded-lg shadow border">
              <h2 className="text-xl font-semibold text-green-600 mb-4">
                📄 Pages ({results.pages.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.pages.map((page) => (
                  <Link key={page.id} href={`/pages/${page.slug}`}>
                    <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <h3 className="font-medium text-gray-900 mb-2" 
                          dangerouslySetInnerHTML={{ __html: page.title.rendered }} />
                      <div className="text-sm text-gray-500">ID: {page.id}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Categories */}
            <section className="bg-white p-6 rounded-lg shadow border">
              <h2 className="text-xl font-semibold text-purple-600 mb-4">
                🗂️ Categories ({results.categories.length})
              </h2>
              <div className="flex flex-wrap gap-2">
                {results.categories.map((category) => (
                  <Link key={category.id} href={`/category/${category.slug}`}>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm hover:bg-purple-200 transition-colors">
                      {category.name} ({category.count})
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {/* Tags */}
            <section className="bg-white p-6 rounded-lg shadow border">
              <h2 className="text-xl font-semibold text-orange-600 mb-4">
                🏷️ Tags ({results.tags.length})
              </h2>
              <div className="flex flex-wrap gap-2">
                {results.tags.map((tag) => (
                  <Link key={tag.id} href={`/tag/${tag.slug}`}>
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm hover:bg-orange-200 transition-colors">
                      {tag.name} ({tag.count})
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {/* Media */}
            <section className="bg-white p-6 rounded-lg shadow border">
              <h2 className="text-xl font-semibold text-pink-600 mb-4">
                🖼️ Media ({results.media.length})
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {results.media.map((item) => (
                  <div key={item.id} className="border rounded-lg overflow-hidden">
                    <div className="aspect-square relative">
                      <Image
                        src={item.media_details?.sizes?.medium?.source_url || item.source_url}
                        alt={item.alt_text || item.title.rendered}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                    <div className="p-2">
                      <div className="text-xs text-gray-500">ID: {item.id}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Users */}
            <section className="bg-white p-6 rounded-lg shadow border">
              <h2 className="text-xl font-semibold text-indigo-600 mb-4">
                👥 Users ({results.users.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {results.users.map((user) => (
                  <div key={user.id} className="text-center p-4 border rounded-lg">
                    <Image
                      src={user.avatar_urls['48']}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="rounded-full mx-auto mb-2"
                    />
                    <h3 className="font-medium text-gray-900 text-sm">{user.name}</h3>
                    <div className="text-xs text-gray-500">@{user.slug}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Performance Info */}
            <section className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-green-800 mb-4">
                ⚡ Performance Benefits
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-green-800 mb-2">Parallel Execution</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• All 6 API calls executed simultaneously</li>
                    <li>• Uses Promise.all() for concurrent requests</li>
                    <li>• Dramatically reduces total loading time</li>
                    <li>• Better user experience with faster data loading</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-green-800 mb-2">Single Function Call</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• One utility function handles all content types</li>
                    <li>• Consistent error handling across all requests</li>
                    <li>• Type-safe results with full TypeScript support</li>
                    <li>• Configurable parameters for each content type</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-white rounded border">
                <h4 className="font-medium text-green-800 mb-2">Code Example:</h4>
                <pre className="text-sm text-gray-800 overflow-x-auto">
{`const batchData = await getMultipleContent({
  posts: { perPage: 5 },
  pages: { perPage: 3 },
  categories: { perPage: 8, hide_empty: false },
  tags: { perPage: 10, hide_empty: false },
  media: { perPage: 4, media_type: 'image' },
  users: { perPage: 5 }
})`}
                </pre>
              </div>
            </section>
          </div>
        )}

        {/* Initial State */}
        {!results && !loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-blue-900 mb-2">
              Ready for Batch Operation
            </h3>
            <p className="text-blue-700 mb-4">
              Click the button above to demonstrate fetching multiple content types simultaneously.
              This will showcase the efficiency of parallel API calls vs sequential requests.
            </p>
            <div className="text-sm text-blue-600">
              Content types to fetch: Posts, Pages, Categories, Tags, Media, Users
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
