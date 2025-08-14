# Headless WordPress + Next.js Blog MVP

A minimal blog application using WordPress as a headless CMS and Next.js 14+ as the frontend with TypeScript, Tailwind CSS, and ISR (Incremental Static Regeneration).

## Architecture

- **Backend**: WordPress Studio (localhost:8884)
- **Frontend**: Next.js 14+ with App Router, TypeScript, and Tailwind CSS
- **API**: WordPress REST API with CORS enabled
- **Rendering**: ISR with 60-second revalidation
- **SEO**: Dynamic metadata generation from WordPress posts

## Quick Start

### 1. WordPress Setup

1. **Start WordPress Studio** and ensure it's running on `http://localhost:8884`

2. **Set Permalinks**: Go to Settings > Permalinks and set to "Post name"

3. **Install CORS Plugin**:
   - Copy `wp-setup/allow-cors.php` to `wp-content/mu-plugins/allow-cors.php` in your WordPress installation
   - This enables CORS for `http://localhost:3000`

4. **Create Sample Posts**: Add at least 3 blog posts in WordPress admin

### 2. Next.js Setup

```bash
cd headless-wp-blog
npm install
npm run dev
```

The application will be available at `http://localhost:3000`

### 3. Environment Configuration

The `.env.local` file is already configured:

```bash
NEXT_PUBLIC_WP_API_BASE=http://localhost:8884
```

## API Endpoints Used

- **Posts List**: `/wp-json/wp/v2/posts?_fields=id,slug,title,excerpt,content,date&per_page=10`
- **Single Post**: `/wp-json/wp/v2/posts?slug={slug}&_fields=id,slug,title,excerpt,content,date`

## File Structure

```
headless-wp-blog/
├── app/
│   ├── blog/
│   │   ├── [slug]/
│   │   │   ├── page.tsx          # Single post page with SEO
│   │   │   ├── loading.tsx       # Single post loading state
│   │   │   └── not-found.tsx     # Post not found page
│   │   ├── page.tsx              # Blog listing page
│   │   └── loading.tsx           # Blog listing loading state
│   ├── layout.tsx                # Root layout with SEO defaults
│   ├── page.tsx                  # Home page (redirects to /blog)
│   └── globals.css               # Global styles
├── lib/
│   └── wp.ts                     # WordPress API utilities
├── wp-setup/
│   └── allow-cors.php            # CORS plugin for WordPress
├── .env.local                    # Environment variables
└── README.md                     # This file
```

## Features

### Frontend Features
- ✅ Post listing with excerpts and pagination info
- ✅ Single post pages with full content
- ✅ ISR with 60-second revalidation
- ✅ TypeScript for type safety
- ✅ Responsive design with Tailwind CSS
- ✅ Loading states and error handling
- ✅ SEO optimization with dynamic metadata

### SEO Features
- ✅ Dynamic `<title>` and meta descriptions from post content
- ✅ Open Graph tags for social media
- ✅ Twitter Card metadata
- ✅ Structured data ready for implementation
- ✅ Semantic HTML structure

### WordPress Integration
- ✅ CORS headers for cross-origin requests
- ✅ REST API field filtering for performance
- ✅ Safe HTML rendering with XSS protection awareness
- ✅ Error handling for WordPress connection issues

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## Testing the Setup

1. **Start WordPress Studio** on port 8884
2. **Start Next.js development server**: `npm run dev`
3. **Visit** `http://localhost:3000` - should redirect to `/blog`
4. **Check blog listing**: Should show your WordPress posts
5. **Click on a post**: Should show full post content
6. **Verify SEO**: Check page source for meta tags
7. **Test error handling**: Stop WordPress and refresh to see error states

## Production Deployment

### 1. Update Environment Variables

For production, update `.env.local` (or use `.env.production`):

```bash
NEXT_PUBLIC_WP_API_BASE=https://api.yoursite.com
```

### 2. Update CORS Settings

Modify the CORS plugin to include your production domain:

```php
$allowed_origins = [
    'http://localhost:3000',
    'https://localhost:3000',
    'https://yourdomain.com'  // Add your production domain
];
```

### 3. Deploy

The app is ready for deployment on:
- Vercel (recommended for Next.js)
- Netlify
- Railway
- Or any Node.js hosting platform

### 4. Optimization for Production

Consider adding:
- CDN for WordPress media files
- Redis/Memcached for WordPress
- Image optimization for post featured images
- Additional caching layers

## Security Notes

- WordPress content is rendered using `dangerouslySetInnerHTML`
- Ensure WordPress users can only publish trusted content
- Consider content sanitization for production use
- The CORS plugin allows specific origins only

## Troubleshooting

### WordPress Connection Issues
- Verify WordPress Studio is running on port 8884
- Check CORS plugin is active in `mu-plugins`
- Ensure WordPress permalinks are set to "Post name"

### Build Issues
- Run `npm run type-check` for TypeScript errors
- Check all dependencies are installed with `npm install`

### SEO Issues
- Verify posts have titles and excerpts in WordPress
- Check meta tags in browser dev tools

## Next Steps

1. **Add featured images** support from WordPress media
2. **Implement pagination** for blog listing
3. **Add categories and tags** filtering
4. **Set up caching** with Redis or similar
5. **Add search functionality**
6. **Implement user authentication** if needed
7. **Add analytics** integration
8. **Optimize images** with Next.js Image component

## License

MIT License - feel free to use this as a starting point for your headless WordPress projects.
