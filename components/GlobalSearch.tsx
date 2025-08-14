'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getPosts, WPPost, stripHtml } from '@/lib/wp';

interface SearchResult {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  type: 'post' | 'page';
}

// Simple debounce function
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Close search on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Open search with Ctrl+K or Cmd+K
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      
      // Close search with Escape
      if (event.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Debounced search function
  const debouncedSearch = useRef(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        const posts = await getPosts({ search: searchQuery, perPage: 8 });
        const searchResults: SearchResult[] = posts.map((post: WPPost) => ({
          id: post.id,
          title: stripHtml(post.title.rendered),
          excerpt: stripHtml(post.excerpt.rendered).substring(0, 100) + '...',
          slug: post.slug,
          date: post.date,
          type: 'post' as const
        }));
        
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300)
  ).current;

  // Handle search input
  const handleSearch = (value: string) => {
    setQuery(value);
    setLoading(value.length >= 2);
    debouncedSearch(value);
  };

  // Save search to recent searches
  const saveRecentSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query.trim());
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery('');
    }
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    saveRecentSearch(query);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <>
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden md:block">Search</span>
        <span className="hidden lg:block text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">⌘K</span>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-start justify-center px-4 pt-16 pb-20">
            <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            
            <div ref={searchRef} className="relative w-full max-w-2xl transform">
              <div className="overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl ring-1 ring-black/5 dark:ring-white/5">
                {/* Search Input */}
                <form onSubmit={handleSubmit} className="relative">
                  <svg
                    className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-gray-400 dark:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search posts, pages, and more..."
                    className="h-14 w-full border-0 bg-transparent pl-12 pr-4 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-0 text-lg"
                    autoComplete="off"
                    autoFocus
                  />
                  {loading && (
                    <div className="absolute right-4 top-4">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-b-transparent"></div>
                    </div>
                  )}
                </form>

                {/* Search Results */}
                <div className="max-h-96 overflow-y-auto border-t border-gray-100 dark:border-gray-700">
                  {query.length >= 2 && results.length > 0 && (
                    <div className="p-2">
                      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3 py-2">
                        Search Results
                      </div>
                      {results.map((result) => (
                        <Link
                          key={result.id}
                          href={`/blog/${result.slug}`}
                          onClick={() => handleResultClick(result)}
                          className="flex items-start space-x-3 rounded-lg px-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                              {result.title}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                              {result.excerpt}
                            </div>
                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              {new Date(result.date).toLocaleDateString()}
                            </div>
                          </div>
                        </Link>
                      ))}
                      
                      {/* View All Results Link */}
                      <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                        <button
                          onClick={() => {
                            saveRecentSearch(query);
                            router.push(`/search?q=${encodeURIComponent(query)}`);
                            setIsOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          View all results for "{query}"
                        </button>
                      </div>
                    </div>
                  )}

                  {query.length >= 2 && results.length === 0 && !loading && (
                    <div className="p-6 text-center">
                      <div className="text-gray-400 dark:text-gray-500 text-sm">
                        No results found for "{query}"
                      </div>
                      <button
                        onClick={() => {
                          router.push(`/search?q=${encodeURIComponent(query)}`);
                          setIsOpen(false);
                        }}
                        className="mt-2 text-blue-600 dark:text-blue-400 text-sm hover:underline"
                      >
                        Search all content
                      </button>
                    </div>
                  )}

                  {/* Recent Searches */}
                  {query.length < 2 && recentSearches.length > 0 && (
                    <div className="p-2">
                      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3 py-2">
                        Recent Searches
                      </div>
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setQuery(search);
                            handleSearch(search);
                          }}
                          className="flex items-center space-x-3 w-full text-left rounded-lg px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm text-gray-700 dark:text-gray-300">{search}</span>
                        </button>
                      ))}
                      
                      <button
                        onClick={() => {
                          setRecentSearches([]);
                          localStorage.removeItem('recentSearches');
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                      >
                        Clear recent searches
                      </button>
                    </div>
                  )}

                  {/* Quick Tips */}
                  {query.length < 2 && recentSearches.length === 0 && (
                    <div className="p-6 text-center space-y-3">
                      <div className="text-gray-400 dark:text-gray-500 text-sm">
                        Start typing to search posts and pages
                      </div>
                      <div className="flex justify-center space-x-4 text-xs text-gray-400 dark:text-gray-500">
                        <span>Press ↵ to search</span>
                        <span>Press ⌘K to open</span>
                        <span>Press ⎋ to close</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
