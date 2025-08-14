'use client';

import { useEffect, useState } from 'react';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateProgress = () => {
      const article = document.querySelector('article');
      if (!article) return;

      const scrollTop = window.scrollY;
      const docHeight = article.offsetHeight;
      const winHeight = window.innerHeight;
      const articleTop = article.offsetTop;
      
      // Calculate progress based on article position
      const scrollStart = articleTop;
      const scrollEnd = articleTop + docHeight - winHeight;
      
      if (scrollTop <= scrollStart) {
        setProgress(0);
        setIsVisible(false);
      } else if (scrollTop >= scrollEnd) {
        setProgress(100);
        setIsVisible(true);
      } else {
        const scrolled = scrollTop - scrollStart;
        const total = scrollEnd - scrollStart;
        const percentage = Math.min(Math.max((scrolled / total) * 100, 0), 100);
        setProgress(percentage);
        setIsVisible(true);
      }
    };

    // Update on scroll with throttling
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    updateProgress(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Fixed Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200 dark:bg-gray-700">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Floating Progress Indicator */}
      <div className="fixed bottom-8 right-8 z-40">
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              className="stroke-gray-200 dark:stroke-gray-700"
              strokeWidth="2"
            />
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              className="stroke-blue-500"
              strokeWidth="2"
              strokeDasharray={`${progress * 100.53 / 100} 100.53`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              {Math.round(progress)}%
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button (appears when progress > 20%) */}
      {progress > 20 && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-28 right-8 z-40 w-12 h-12 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-xl transition-all duration-200 flex items-center justify-center"
          title="Scroll to top"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
          </svg>
        </button>
      )}
    </>
  );
}
