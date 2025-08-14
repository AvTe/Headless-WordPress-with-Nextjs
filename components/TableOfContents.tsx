'use client';

import { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  title: string;
  level: number;
  element: HTMLElement;
}

export default function TableOfContents() {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Generate table of contents from article headings
    const article = document.querySelector('article');
    if (!article) return;

    const headings = article.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const items: TocItem[] = [];

    headings.forEach((heading, index) => {
      const element = heading as HTMLElement;
      const level = parseInt(element.tagName.charAt(1));
      const title = element.textContent || '';
      
      // Generate ID if it doesn't exist
      let id = element.id;
      if (!id) {
        id = title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/--+/g, '-')
          .trim();
        
        // Ensure unique ID
        const existingIds = items.map(item => item.id);
        let counter = 1;
        let uniqueId = id;
        while (existingIds.includes(uniqueId)) {
          uniqueId = `${id}-${counter}`;
          counter++;
        }
        
        element.id = uniqueId;
        id = uniqueId;
      }

      items.push({
        id,
        title,
        level,
        element
      });
    });

    setTocItems(items);
  }, []);

  useEffect(() => {
    if (tocItems.length === 0) return;

    // Intersection Observer for active heading detection
    const observerOptions: IntersectionObserverInit = {
      rootMargin: '-20% 0% -35% 0%',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      const visibleEntries = entries.filter(entry => entry.isIntersecting);
      
      if (visibleEntries.length > 0) {
        // Get the first visible heading
        const closestEntry = visibleEntries.reduce((closest, entry) => {
          return entry.intersectionRatio > closest.intersectionRatio ? entry : closest;
        });
        
        setActiveId(closestEntry.target.id);
      }
    }, observerOptions);

    // Observe all headings
    tocItems.forEach(item => {
      observer.observe(item.element);
    });

    return () => observer.disconnect();
  }, [tocItems]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for fixed header
      const elementPosition = element.offsetTop - offset;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
    setIsOpen(false);
  };

  if (tocItems.length === 0) return null;

  return (
    <>
      {/* Desktop TOC - Sticky Sidebar */}
      <div className="hidden xl:block">
        <div className="fixed right-8 top-1/2 transform -translate-y-1/2 w-64">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-h-96 overflow-y-auto">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Table of Contents
            </h3>
            
            <nav className="space-y-1">
              {tocItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleClick(item.id)}
                  className={`block w-full text-left px-2 py-1 text-xs rounded transition-colors ${
                    activeId === item.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  style={{ 
                    paddingLeft: `${(item.level - 1) * 8 + 8}px`,
                    fontSize: `${Math.max(0.7, 0.8 - (item.level - 2) * 0.05)}rem`
                  }}
                  title={item.title}
                >
                  <span className="line-clamp-2">
                    {item.title}
                  </span>
                </button>
              ))}
            </nav>

            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
              {tocItems.length} section{tocItems.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile TOC - Toggle Button */}
      <div className="xl:hidden fixed bottom-8 left-8 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-xl transition-all duration-200 flex items-center justify-center"
          title="Table of contents"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </button>

        {/* Mobile TOC Modal */}
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" onClick={() => setIsOpen(false)} />
              
              <div className="inline-block transform overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white dark:bg-gray-800 px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6 sm:align-middle">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Table of Contents
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <nav className="space-y-1 max-h-96 overflow-y-auto">
                  {tocItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleClick(item.id)}
                      className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                        activeId === item.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                      style={{ paddingLeft: `${(item.level - 1) * 12 + 12}px` }}
                    >
                      {item.title}
                    </button>
                  ))}
                </nav>

                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 text-center">
                  {tocItems.length} section{tocItems.length !== 1 ? 's' : ''} • Click to navigate
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
