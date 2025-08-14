import { getPosts, formatDate, WPPost, getFeaturedImageUrlAsync, getFeaturedImageAlt, hasFeaturedImage } from '@/lib/wp';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog Posts',
  description: 'All blog posts from our WordPress headless CMS',
};

async function FeaturedPostCard({ post }: { post: WPPost }) {
  const featuredImageUrl = await getFeaturedImageUrlAsync(post, 'large');
  const featuredImageAlt = getFeaturedImageAlt(post);
  
  return (
    <article className="relative overflow-hidden rounded-2xl shadow-xl group cursor-pointer">
      <Link href={`/blog/${post.slug}`}>
        <div className="aspect-[16/10] relative">
          {featuredImageUrl ? (
            <Image
              src={featuredImageUrl}
              alt={featuredImageAlt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 80vw"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="mb-3">
              <span className="inline-block px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                Featured
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
              <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
            </h1>
            <div className="text-gray-200 mb-4 line-clamp-2">
              <div dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <time>{formatDate(post.date)}</time>
              <span className="mx-2">•</span>
              <span>5 min read</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

async function RegularPostCard({ post, index }: { post: WPPost; index: number }) {
  const featuredImageUrl = await getFeaturedImageUrlAsync(post, 'medium');
  const featuredImageAlt = getFeaturedImageAlt(post);
  
  return (
    <article className="group cursor-pointer">
      <Link href={`/blog/${post.slug}`}>
        <div className="flex gap-4 mb-6">
          {/* Image */}
          <div className="flex-shrink-0">
            <div className="relative overflow-hidden rounded-xl w-24 h-24 md:w-32 md:h-32">
              {featuredImageUrl ? (
                <Image
                  src={featuredImageUrl}
                  alt={featuredImageAlt}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 768px) 96px, 128px"
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
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 mb-2 text-lg md:text-xl line-clamp-2 group-hover:text-blue-600 transition-colors">
              <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
            </h3>
            <div className="text-gray-600 mb-3 line-clamp-2 text-sm md:text-base">
              <div dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
            </div>
            <div className="flex items-center text-xs md:text-sm text-gray-500">
              <time>{formatDate(post.date)}</time>
              <span className="mx-2">•</span>
              <span>3 min read</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

async function GridPostCard({ post }: { post: WPPost }) {
  const featuredImageUrl = await getFeaturedImageUrlAsync(post, 'medium');
  const featuredImageAlt = getFeaturedImageAlt(post);
  
  return (
    <article className="group cursor-pointer">
      <Link href={`/blog/${post.slug}`}>
        <div className="space-y-4">
          {/* Image */}
          <div className="relative overflow-hidden rounded-xl aspect-[4/3]">
            {featuredImageUrl ? (
              <Image
                src={featuredImageUrl}
                alt={featuredImageAlt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17l2.5-3.17L14.5 17H9zm6.5-5.5L12 8.5l-3.5 3L6 8v9h12l-2.5-5.5z"/>
                </svg>
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="space-y-3">
            <h3 className="font-bold text-gray-900 text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
              <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
            </h3>
            <div className="text-gray-600 line-clamp-3 text-sm">
              <div dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <time>{formatDate(post.date)}</time>
              <span className="mx-2">•</span>
              <span>4 min read</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default async function BlogPage() {
  let posts: WPPost[] = [];
  let error = null;

  try {
    posts = await getPosts(10);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load posts';
    posts = [];
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Connection Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-sm text-gray-500">
            Make sure WordPress Studio is running on http://localhost:8884
          </p>
        </div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Posts Found</h1>
          <p className="text-gray-600">
            No blog posts are available yet. Create some posts in your WordPress admin.
          </p>
        </div>
      </div>
    );
  }

  const [featuredPost, ...otherPosts] = posts;
  const [listPosts, gridPosts] = otherPosts.reduce<[WPPost[], WPPost[]]>(
    ([list, grid], post, index) => {
      if (index < 4) {
        return [[...list, post], grid];
      }
      return [list, [...grid, post]];
    },
    [[], []]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Blog
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover insights, tutorials, and stories from our team
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Featured Post */}
            {featuredPost && (
              <div>
                <FeaturedPostCard post={featuredPost} />
              </div>
            )}

            {/* Recent Posts List */}
            {listPosts.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Posts</h2>
                <div className="space-y-6">
                  {listPosts.map((post, index) => (
                    <div key={post.id} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                      <RegularPostCard post={post} index={index} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Search */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Search</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search posts..."
                  className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
              <p className="text-blue-100 mb-4 text-sm">
                Get the latest posts delivered right to your inbox.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-3 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:ring-opacity-50"
                />
                <button className="w-full bg-white text-blue-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Popular Posts */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Posts</h3>
              <div className="space-y-4">
                {posts.slice(0, 3).map((post, index) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                    <div className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                          <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(post.date)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Grid Posts */}
        {gridPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">More Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gridPosts.map((post) => (
                <GridPostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* Load More */}
        <div className="mt-12 text-center">
          <button className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
            Load More Posts
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
