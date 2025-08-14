import { getPosts, getFeaturedImageUrl, getFeaturedImageAlt, hasFeaturedImage } from '@/lib/wp'
import Image from 'next/image'

export default async function DebugPage() {
  console.log('=== DEBUG PAGE: Fetching posts ===')
  
  try {
    const posts = await getPosts()
    console.log('=== DEBUG: Posts fetched:', posts.length)
    
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Debug: Featured Images</h1>
        
        {posts.map((post, index) => {
          const featuredImageUrl = getFeaturedImageUrl(post, 'medium')
          const featuredImageAlt = getFeaturedImageAlt(post)
          const hasImage = hasFeaturedImage(post)
          
          console.log(`=== DEBUG: Post ${index + 1}:`, {
            title: post.title.rendered,
            featured_media: post.featured_media,
            featuredImageUrl,
            hasImage,
            _embedded: post._embedded ? Object.keys(post._embedded) : 'no _embedded'
          })
          
          return (
            <div key={post.id} className="mb-8 p-4 border rounded">
              <h2 className="text-xl font-bold mb-2">{post.title.rendered}</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Raw Data:</h3>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                    {JSON.stringify({
                      featured_media: post.featured_media,
                      featuredImageUrl,
                      hasImage,
                      _embedded: post._embedded ? Object.keys(post._embedded) : null
                    }, null, 2)}
                  </pre>
                </div>
                
                <div>
                  <h3 className="font-semibold">Image Test:</h3>
                  {featuredImageUrl ? (
                    <div className="space-y-2">
                      <p className="text-sm text-green-600">✓ Featured image found</p>
                      <p className="text-xs">URL: {featuredImageUrl}</p>
                      <Image
                        src={featuredImageUrl}
                        alt={featuredImageAlt}
                        width={200}
                        height={120}
                        className="rounded"
                        onError={(e) => {
                          console.error('Image load error:', e)
                        }}
                        onLoad={() => {
                          console.log('Image loaded successfully:', featuredImageUrl)
                        }}
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-red-600">✗ No featured image</p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  } catch (error) {
    console.error('=== DEBUG: Error fetching posts:', error)
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-red-600">Debug: Error</h1>
        <pre className="bg-red-100 p-4 rounded">
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    )
  }
}
