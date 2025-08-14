import { getPostBySlug, formatDate, stripHtml, WPPost, getFeaturedImageUrlAsync, getFeaturedImageAlt, getPosts } from '@/lib/wp';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import ShareButtons from '@/components/ShareButtons';
import './post-content.css';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const title = stripHtml(post.title.rendered);
  const description = stripHtml(post.excerpt.rendered).substring(0, 160);
  const featuredImageUrl = await getFeaturedImageUrlAsync(post, 'large');
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.date,
      images: featuredImageUrl ? [
        {
          url: featuredImageUrl,
          alt: getFeaturedImageAlt(post),
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: featuredImageUrl ? [featuredImageUrl] : undefined,
    },
  };
}

async function RelatedPostCard({ post }: { post: WPPost }) {
  const featuredImageUrl = await getFeaturedImageUrlAsync(post, 'medium');
  const featuredImageAlt = getFeaturedImageAlt(post);

  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <div className="space-y-3">
        <div className="relative overflow-hidden rounded-xl aspect-[4/3]">
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
        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
        </h3>
        <p className="text-sm text-gray-500">{formatDate(post.date)}</p>
      </div>
    </Link>
  );
}

// Reading time calculator
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = stripHtml(content).split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  let post: WPPost | null = null;
  let relatedPosts: WPPost[] = [];
  let error = null;

  try {
    post = await getPostBySlug(slug);
    if (post) {
      // Get other posts for related section
      relatedPosts = await getPosts({ perPage: 4 });
      relatedPosts = relatedPosts.filter(p => p.id !== post!.id).slice(0, 3);
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load post';
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Post</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link 
            href="/blog"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  const featuredImageUrl = await getFeaturedImageUrlAsync(post, 'large');
  const featuredImageAlt = getFeaturedImageAlt(post);
  const readingTime = calculateReadingTime(post.content.rendered);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Featured Image */}
      <div className="relative h-[60vh] overflow-hidden">
        {featuredImageUrl ? (
          <Image
            src={featuredImageUrl}
            alt={featuredImageAlt}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900"></div>
        )}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Navigation */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link 
                href="/blog"
                className="inline-flex items-center text-white hover:text-gray-200 font-medium transition-colors"
              >
                <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Blog
              </Link>
              
              <div className="flex items-center space-x-4">
                <button className="p-2 text-white hover:text-gray-200 hover:bg-white/10 rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </button>
                <button className="p-2 text-white hover:text-gray-200 hover:bg-white/10 rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Article Header Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 -mb-6">
              <div className="flex items-center space-x-2 text-sm text-blue-600 font-medium mb-4">
                <span className="bg-blue-100 px-3 py-1 rounded-full">Article</span>
                <span>•</span>
                <span>{readingTime} min read</span>
              </div>
              <h1 
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight"
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">A</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Admin</p>
                      <p className="text-gray-500">{formatDate(post.date)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Article Content */}
            <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 mb-8">
              <div 
                className="post-content prose prose-xl max-w-none 
                prose-headings:font-bold prose-headings:text-black prose-headings:mb-6 prose-headings:mt-8
                prose-h1:text-4xl prose-h1:leading-tight prose-h1:mb-8 prose-h1:mt-0 prose-h1:font-black prose-h1:text-black
                prose-h2:text-3xl prose-h2:leading-tight prose-h2:mb-6 prose-h2:mt-12 prose-h2:font-bold prose-h2:text-black
                prose-h3:text-2xl prose-h3:leading-snug prose-h3:mb-5 prose-h3:mt-10 prose-h3:font-bold prose-h3:text-black
                prose-h4:text-xl prose-h4:leading-snug prose-h4:mb-4 prose-h4:mt-8 prose-h4:font-bold prose-h4:text-black
                prose-h5:text-lg prose-h5:leading-snug prose-h5:mb-4 prose-h5:mt-6 prose-h5:font-bold prose-h5:text-black
                prose-h6:text-base prose-h6:leading-snug prose-h6:mb-3 prose-h6:mt-6 prose-h6:font-bold prose-h6:text-black
                prose-p:text-black prose-p:leading-relaxed prose-p:mb-6 prose-p:text-lg prose-p:font-normal
                prose-a:text-blue-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline 
                prose-strong:text-black prose-strong:font-bold
                prose-em:text-black prose-em:italic
                prose-blockquote:border-l-4 prose-blockquote:border-blue-400 prose-blockquote:bg-blue-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-blue-900 prose-blockquote:font-medium
                prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-gray-800 prose-code:font-mono prose-code:text-sm
                prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:p-6 prose-pre:overflow-x-auto
                prose-ul:space-y-3 prose-ul:mb-6 prose-li:text-black prose-li:text-lg prose-li:leading-relaxed
                prose-ol:space-y-3 prose-ol:mb-6 prose-ol:list-decimal
                prose-img:rounded-xl prose-img:shadow-lg prose-img:mb-8 prose-img:border prose-img:border-gray-200
                prose-table:border-collapse prose-table:border prose-table:border-gray-300
                prose-th:bg-gray-100 prose-th:font-semibold prose-th:text-gray-900 prose-th:border prose-th:border-gray-300 prose-th:px-4 prose-th:py-2
                prose-td:border prose-td:border-gray-300 prose-td:px-4 prose-td:py-2
                prose-hr:border-gray-300 prose-hr:my-12"
                dangerouslySetInnerHTML={{ __html: post.content.rendered }}
              />
            </article>

            {/* Share Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Share this article</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Suspense fallback={<div>Loading share buttons...</div>}>
                  <ShareButtons post={post} featuredImageUrl={featuredImageUrl || undefined} />
                </Suspense>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Author Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-600 font-bold text-xl">A</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Admin</h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    Content creator and WordPress expert sharing insights about headless CMS solutions and modern web development.
                  </p>
                  <button className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors">
                    Follow
                  </button>
                </div>
              </div>

              {/* Table of Contents (if needed) */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    <span className="text-gray-700 font-medium">Save Article</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="text-gray-700 font-medium">Reading List</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span className="text-gray-700 font-medium">Take Notes</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 mb-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Related Articles</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover more insights and stories that complement what you just read
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <RelatedPostCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Want to read more articles like this?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and get the latest insights on headless CMS, React, and modern web development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
            />
            <button className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
