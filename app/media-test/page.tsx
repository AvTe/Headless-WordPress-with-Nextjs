import { getPosts, getMediaById, getFeaturedImageUrlAsync } from '@/lib/wp'
import Image from 'next/image'

export default async function MediaTestPage() {
  console.log('=== MEDIA TEST: Starting diagnostic ===')
  
  try {
    const posts = await getPosts(5)
    console.log('=== MEDIA TEST: Posts fetched:', posts.length)
    
    const postsWithMedia = posts.filter(post => post.featured_media > 0)
    console.log('=== MEDIA TEST: Posts with featured_media > 0:', postsWithMedia.length)
    
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">WordPress Media Diagnostic</h1>
        
        <div className="space-y-8">
          {posts.map(async (post, index) => {
            const mediaId = post.featured_media
            const hasEmbedded = !!(post._embedded && post._embedded['wp:featuredmedia']?.length)
            
            let directMedia = null
            let asyncImageUrl = null
            
            if (mediaId > 0) {
              try {
                directMedia = await getMediaById(mediaId)
                asyncImageUrl = await getFeaturedImageUrlAsync(post, 'medium')
              } catch (error) {
                console.error('Error fetching direct media:', error)
              }
            }
            
            return (
              <div key={post.id} className="bg-white p-6 rounded-lg shadow border">
                <h2 className="text-xl font-bold mb-4">{post.title.rendered}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Post Info */}
                  <div>
                    <h3 className="font-semibold text-green-600 mb-2">Post Data</h3>
                    <div className="text-sm space-y-1">
                      <div><strong>ID:</strong> {post.id}</div>
                      <div><strong>featured_media:</strong> {mediaId || 'none'}</div>
                      <div><strong>Has embedded:</strong> {hasEmbedded ? 'Yes' : 'No'}</div>
                      {hasEmbedded && (
                        <div><strong>Embedded count:</strong> {post._embedded?.['wp:featuredmedia']?.length}</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Direct Media Test */}
                  <div>
                    <h3 className="font-semibold text-blue-600 mb-2">Direct Media Fetch</h3>
                    {mediaId > 0 ? (
                      <div className="text-sm space-y-1">
                        {directMedia ? (
                          <div>
                            <div className="text-green-600">✓ Media found</div>
                            <div><strong>Source:</strong> {directMedia.source_url}</div>
                            <div><strong>Alt:</strong> {directMedia.alt_text}</div>
                            <div><strong>Sizes:</strong> {Object.keys(directMedia.media_details?.sizes || {}).join(', ')}</div>
                          </div>
                        ) : (
                          <div className="text-red-600">✗ Media not found</div>
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-500">No media ID</div>
                    )}
                  </div>
                  
                  {/* Image Test */}
                  <div>
                    <h3 className="font-semibold text-purple-600 mb-2">Image Display</h3>
                    {asyncImageUrl ? (
                      <div>
                        <div className="text-green-600 text-sm mb-2">✓ Image URL found</div>
                        <div className="text-xs mb-2 break-all">{asyncImageUrl}</div>
                        <Image
                          src={asyncImageUrl}
                          alt={post.title.rendered}
                          width={150}
                          height={90}
                          className="rounded border"
                          onError={() => console.error('Image failed to load:', asyncImageUrl)}
                          onLoad={() => console.log('Image loaded successfully:', asyncImageUrl)}
                        />
                      </div>
                    ) : (
                      <div className="text-gray-500">No image available</div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="mt-8 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">WordPress API Endpoints to Test:</h3>
          <ul className="text-sm space-y-1">
            <li><a href="http://localhost:8884/wp-json/wp/v2/posts?_embed=wp:featuredmedia" className="text-blue-600 hover:underline" target="_blank" rel="noopener">Posts with embed</a></li>
            <li><a href="http://localhost:8884/wp-json/wp/v2/media" className="text-blue-600 hover:underline" target="_blank" rel="noopener">All media</a></li>
            <li><a href="http://localhost:8884/wp-json/wp/v2/media/9" className="text-blue-600 hover:underline" target="_blank" rel="noopener">Media ID 9</a></li>
          </ul>
        </div>
      </div>
    )
  } catch (error) {
    console.error('=== MEDIA TEST: Error:', error)
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-red-600">Media Test Error</h1>
        <pre className="bg-red-100 p-4 rounded overflow-auto">
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    )
  }
}
