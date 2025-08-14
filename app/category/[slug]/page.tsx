import { getCategories, getPosts, getMedia } from '@/lib/wp'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

// Post Card Component
async function PostCard({ post, category }: { post: any, category: any }) {
  // Get featured image for the post
  let featuredImage = null
  if (post.featured_media) {
    try {
      const media = await getMedia({ include: [post.featured_media] })
      featuredImage = media[0]
    } catch (error) {
      console.error('Error fetching featured image:', error)
    }
  }

  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="bg-white rounded-lg shadow border hover:shadow-lg transition-all duration-300">
        {featuredImage && (
          <div className="aspect-video relative rounded-t-lg overflow-hidden">
            <Image
              src={featuredImage.media_details?.sizes?.medium_large?.source_url || featuredImage.source_url}
              alt={featuredImage.alt_text || post.title.rendered}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2" 
              dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          
          <div className="text-gray-600 text-sm mb-4 line-clamp-3" 
               dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{new Date(post.date).toLocaleDateString()}</span>
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
              {category.name}
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  
  try {
    // Get category by slug
    const categories = await getCategories({ slug: [slug] })
    const category = categories[0]
    if (!category) {
      notFound()
    }

    // Get posts in this category
    const posts = await getPosts({ categories: [category.id], perPage: 12 })

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-12">
            <nav className="text-sm text-gray-500 mb-4">
              <Link href="/" className="hover:text-gray-700">Home</Link>
              <span className="mx-2">›</span>
              <Link href="/api-showcase" className="hover:text-gray-700">API Showcase</Link>
              <span className="mx-2">›</span>
              <span>Categories</span>
              <span className="mx-2">›</span>
              <span className="text-gray-900">{category.name}</span>
            </nav>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-purple-100 text-purple-800 p-3 rounded-full">
                🗂️
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  {category.name}
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                  {posts.length} {posts.length === 1 ? 'post' : 'posts'} in this category
                </p>
              </div>
            </div>

            {category.description && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 max-w-3xl">
                <div 
                  className="text-purple-800 prose prose-sm"
                  dangerouslySetInnerHTML={{ __html: category.description }}
                />
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-100 p-3 rounded">
                <span className="font-medium text-gray-600">Category ID:</span>
                <span className="ml-2 text-gray-900">{category.id}</span>
              </div>
              <div className="bg-gray-100 p-3 rounded">
                <span className="font-medium text-gray-600">Slug:</span>
                <span className="ml-2 text-gray-900">{category.slug}</span>
              </div>
              <div className="bg-gray-100 p-3 rounded">
                <span className="font-medium text-gray-600">Total Posts:</span>
                <span className="ml-2 text-gray-900">{category.count}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post: any) => (
                <PostCard key={post.id} post={post} category={category} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
              <p className="text-gray-600">This category doesn't have any posts yet.</p>
            </div>
          )}

          {/* API Information */}
          <div className="mt-12 bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🔧 Category API Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Endpoints Used:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• <code>/wp/v2/categories?slug={slug}</code></li>
                  <li>• <code>/wp/v2/posts?categories={category.id}</code></li>
                  <li>• <code>/wp/v2/media?include=[id]</code> (for images)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Features Demonstrated:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Category metadata and description</li>
                  <li>• Posts filtered by category</li>
                  <li>• Featured image loading</li>
                  <li>• SEO-friendly URLs</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 text-center">
            <Link 
              href="/api-showcase" 
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              ← Back to API Showcase
            </Link>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading category:', error)
    notFound()
  }
}
