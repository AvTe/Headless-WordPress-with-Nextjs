import { 
  getPosts, getPages, getMedia, getCategories, getTags, getUsers, 
  getComments, getTaxonomies, getPostTypes, searchContent, getSettings,
  getMultipleContent 
} from '@/lib/wp'
import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'

// Loading components
const LoadingCard = () => (
  <div className="bg-white p-4 rounded-lg shadow border animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
  </div>
)

const LoadingGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <LoadingCard key={i} />
    ))}
  </div>
)

// Posts Section
async function PostsSection() {
  const posts = await getPosts({ perPage: 6 })
  
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 text-blue-600">📝 Posts API</h2>
      <p className="text-gray-600 mb-4">Latest blog posts from /wp/v2/posts</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <div className="bg-white p-4 rounded-lg shadow border hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2" 
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
              <div className="text-sm text-gray-500 mb-2">
                ID: {post.id} • {new Date(post.date).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-600 line-clamp-3" 
                   dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
            </div>
          </Link>
        ))}
      </div>
      
      <div className="flex gap-2">
        <Link href="/api-demo/posts" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          View All Posts
        </Link>
        <Link href="/api-demo/posts/search" className="bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200">
          Search Posts
        </Link>
      </div>
    </section>
  )
}

// Pages Section
async function PagesSection() {
  const pages = await getPages({ perPage: 6 })
  
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 text-green-600">📄 Pages API</h2>
      <p className="text-gray-600 mb-4">Site pages from /wp/v2/pages</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {pages.map((page) => (
          <Link key={page.id} href={`/pages/${page.slug}`}>
            <div className="bg-white p-4 rounded-lg shadow border hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-900 mb-2" 
                  dangerouslySetInnerHTML={{ __html: page.title.rendered }} />
              <div className="text-sm text-gray-500 mb-2">
                ID: {page.id} • Menu Order: {page.menu_order}
              </div>
              <div className="text-sm text-gray-600 line-clamp-3" 
                   dangerouslySetInnerHTML={{ __html: page.excerpt.rendered }} />
            </div>
          </Link>
        ))}
      </div>
      
      <Link href="/api-demo/pages" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        View All Pages
      </Link>
    </section>
  )
}

// Categories Section
async function CategoriesSection() {
  const categories = await getCategories({ perPage: 10, hide_empty: false })
  
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 text-purple-600">🗂️ Categories API</h2>
      <p className="text-gray-600 mb-4">Content categories from /wp/v2/categories</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {categories.map((category) => (
          <Link key={category.id} href={`/category/${category.slug}`}>
            <div className="bg-white p-3 rounded-lg shadow border hover:shadow-md transition-shadow text-center">
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{category.name}</h3>
              <div className="text-xs text-gray-500">{category.count} posts</div>
            </div>
          </Link>
        ))}
      </div>
      
      <Link href="/api-demo/categories" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
        View All Categories
      </Link>
    </section>
  )
}

// Tags Section
async function TagsSection() {
  const tags = await getTags({ perPage: 15, hide_empty: false })
  
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 text-orange-600">🏷️ Tags API</h2>
      <p className="text-gray-600 mb-4">Content tags from /wp/v2/tags</p>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((tag) => (
          <Link key={tag.id} href={`/tag/${tag.slug}`}>
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm hover:bg-orange-200 transition-colors">
              {tag.name} ({tag.count})
            </span>
          </Link>
        ))}
      </div>
      
      <Link href="/api-demo/tags" className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
        View All Tags
      </Link>
    </section>
  )
}

// Media Section
async function MediaSection() {
  const media = await getMedia({ perPage: 8, media_type: 'image' })
  
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 text-pink-600">🖼️ Media API</h2>
      <p className="text-gray-600 mb-4">Media library from /wp/v2/media</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {media.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow border overflow-hidden">
            <div className="aspect-square relative">
              <Image
                src={item.media_details?.sizes?.medium?.source_url || item.source_url}
                alt={item.alt_text || item.title.rendered}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">
                {item.title.rendered}
              </h3>
              <div className="text-xs text-gray-500 mt-1">
                {item.media_details.width} × {item.media_details.height}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <Link href="/api-demo/media" className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700">
        View All Media
      </Link>
    </section>
  )
}

// Users Section
async function UsersSection() {
  const users = await getUsers({ perPage: 8 })
  
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 text-indigo-600">👥 Users API</h2>
      <p className="text-gray-600 mb-4">Site authors from /wp/v2/users</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {users.map((user) => (
          <div key={user.id} className="bg-white p-4 rounded-lg shadow border text-center">
            <Image
              src={user.avatar_urls['96']}
              alt={user.name}
              width={48}
              height={48}
              className="rounded-full mx-auto mb-3"
            />
            <h3 className="font-semibold text-gray-900">{user.name}</h3>
            <div className="text-sm text-gray-500">@{user.slug}</div>
            {user.description && (
              <p className="text-xs text-gray-600 mt-2 line-clamp-2">{user.description}</p>
            )}
          </div>
        ))}
      </div>
      
      <Link href="/api-demo/users" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
        View All Users
      </Link>
    </section>
  )
}

// Comments Section
async function CommentsSection() {
  const comments = await getComments({ perPage: 5, status: 'approve' })
  
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 text-teal-600">💬 Comments API</h2>
      <p className="text-gray-600 mb-4">Recent comments from /wp/v2/comments</p>
      
      <div className="space-y-4 mb-6">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-start gap-3">
              <Image
                src={comment.author_avatar_urls['48']}
                alt={comment.author_name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900">{comment.author_name}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-gray-700 text-sm" 
                     dangerouslySetInnerHTML={{ __html: comment.content.rendered }} />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <Link href="/api-demo/comments" className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
        View All Comments
      </Link>
    </section>
  )
}

// API Info Section
async function APIInfoSection() {
  const [taxonomies, postTypes] = await Promise.all([
    getTaxonomies(),
    getPostTypes()
  ])
  
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 text-gray-700">⚙️ API Information</h2>
      <p className="text-gray-600 mb-4">WordPress REST API structure and settings</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="font-semibold text-lg mb-3">📋 Post Types</h3>
          <div className="space-y-2">
            {Object.entries(postTypes).map(([key, type]) => (
              <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium">{type.name}</span>
                <span className="text-sm text-gray-500">/{type.rest_base}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="font-semibold text-lg mb-3">🗂️ Taxonomies</h3>
          <div className="space-y-2">
            {Object.entries(taxonomies).map(([key, taxonomy]) => (
              <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium">{taxonomy.name}</span>
                <span className="text-sm text-gray-500">/{taxonomy.rest_base}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex gap-2">
        <Link href="/api-demo/search" className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
          Search API
        </Link>
        <Link href="/api-demo/batch" className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200">
          Batch Operations
        </Link>
      </div>
    </section>
  )
}

export default async function APIShowcasePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            WordPress REST API Showcase
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Complete implementation of WordPress REST API endpoints based on the official 
            <a href="https://developer.wordpress.org/rest-api/" target="_blank" rel="noopener" 
               className="text-blue-600 hover:underline"> WordPress REST API documentation</a>.
            This showcase demonstrates all major endpoints with live data from your WordPress installation.
          </p>
          
          <div className="mt-6 flex gap-2 flex-wrap">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Posts</span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Pages</span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Categories</span>
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">Tags</span>
            <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm">Media</span>
            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">Users</span>
            <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm">Comments</span>
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">Search</span>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-12">
          <Suspense fallback={<LoadingGrid />}>
            <PostsSection />
          </Suspense>
          
          <Suspense fallback={<LoadingGrid />}>
            <PagesSection />
          </Suspense>
          
          <Suspense fallback={<LoadingGrid />}>
            <CategoriesSection />
          </Suspense>
          
          <Suspense fallback={<LoadingGrid />}>
            <TagsSection />
          </Suspense>
          
          <Suspense fallback={<LoadingGrid />}>
            <MediaSection />
          </Suspense>
          
          <Suspense fallback={<LoadingGrid />}>
            <UsersSection />
          </Suspense>
          
          <Suspense fallback={<LoadingGrid />}>
            <CommentsSection />
          </Suspense>
          
          <Suspense fallback={<LoadingCard />}>
            <APIInfoSection />
          </Suspense>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-600">
            <p>WordPress REST API Client • Built with Next.js 14+ and TypeScript</p>
            <p className="text-sm mt-2">
              API Base: <code className="bg-gray-100 px-2 py-1 rounded">{process.env.NEXT_PUBLIC_WP_API_BASE || 'http://localhost:8884'}</code>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
