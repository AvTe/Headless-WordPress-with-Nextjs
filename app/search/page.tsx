import { getPosts, WPPost, stripHtml, getFeaturedImageUrlAsync, getFeaturedImageAlt } from '@/lib/wp';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}

async function SearchResultCard({ post }: { post: WPPost }) {
  const featuredImageUrl = await getFeaturedImageUrlAsync(post, 'medium');
  const featuredImageAlt = getFeaturedImageAlt(post);

  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-gray-300 transition-all duration-200">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3">
            <div className="aspect-video md:aspect-square relative overflow-hidden">
              {featuredImageUrl ? (
                <Image
                  src={featuredImageUrl}
                  alt={featuredImageAlt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17l2.5-3.17L14.5 17H9zm6.5-5.5L12 8.5l-3.5 3L6 8v9h12l-2.5-5.5z"/>
                  </svg>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1 p-6">
            <h2 
              className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />
            
            <div 
              className="text-gray-600 mb-4 line-clamp-3"
              dangerouslySetInnerHTML={{ 
                __html: stripHtml(post.excerpt.rendered).substring(0, 200) + '...'
              }}
            />
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>5 min read</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

// Generate metadata for search page
export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q || '';
  
  return {
    title: query ? `Search results for "${query}"` : 'Search',
    description: query ? `Search results for "${query}" on our blog` : 'Search our blog posts and pages',
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, page } = await searchParams;
  const query = q || '';
  const currentPage = parseInt(page || '1');
  const postsPerPage = 10;

  let posts: WPPost[] = [];
  let totalResults = 0;
  let error = null;

  if (query) {
    try {
      posts = await getPosts({ 
        search: query, 
        perPage: postsPerPage,
        page: currentPage 
      });
      totalResults = posts.length; // Note: WordPress API doesn't return total count easily
    } catch (err) {
      error = err instanceof Error ? err.message : 'Search failed';
      console.error('Search error:', error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {query ? `Search Results` : 'Search'}
            </h1>
            {query && (
              <div className="text-lg text-gray-600 mb-6">
                {posts.length > 0 ? (
                  <span>
                    Found <span className="font-semibold text-gray-900">{posts.length}</span> result{posts.length !== 1 ? 's' : ''} for{' '}
                    <span className="font-semibold text-gray-900">"{query}"</span>
                  </span>
                ) : (
                  <span>
                    No results found for <span className="font-semibold text-gray-900">"{query}"</span>
                  </span>
                )}
              </div>
            )}

            {/* Search Form */}
            <div className="max-w-2xl mx-auto">
              <form method="GET" className="relative">
                <input
                  type="search"
                  name="q"
                  defaultValue={query}
                  placeholder="Search posts, pages, and more..."
                  className="w-full px-6 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h3 className="text-lg font-medium text-red-800">Search Error</h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        {query && posts.length > 0 && (
          <div className="space-y-8">
            <div className="grid gap-8">
              {posts.map((post) => (
                <SearchResultCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination would go here if needed */}
            {posts.length === postsPerPage && (
              <div className="text-center pt-8">
                <Link
                  href={`/search?q=${encodeURIComponent(query)}&page=${currentPage + 1}`}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Load More Results
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* No Results */}
        {query && posts.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No results found
            </h2>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto">
              We couldn't find any posts matching "{query}". Try adjusting your search terms or browse our recent posts below.
            </p>
            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-700">Suggestions:</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Check your spelling</li>
                <li>• Try broader search terms</li>
                <li>• Use fewer keywords</li>
                <li>• Browse our categories</li>
              </ul>
            </div>
            
            <div className="mt-8">
              <Link 
                href="/blog"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
              >
                Browse All Posts
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        )}

        {/* Initial Search State */}
        {!query && (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Discover Amazing Content
            </h2>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto">
              Search through our collection of posts and pages to find exactly what you're looking for.
            </p>
            
            {/* Quick Search Suggestions */}
            <div className="max-w-md mx-auto">
              <p className="text-sm font-medium text-gray-700 mb-4">Popular searches:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['React', 'WordPress', 'Headless CMS', 'Next.js', 'JavaScript'].map((term) => (
                  <Link
                    key={term}
                    href={`/search?q=${encodeURIComponent(term)}`}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
