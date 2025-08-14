// WordPress REST API Client - Complete Implementation
// Based on official WordPress REST API documentation: https://developer.wordpress.org/rest-api/

export interface WPMediaDetails {
  width: number;
  height: number;
  file: string;
  sizes: {
    thumbnail?: { source_url: string; width: number; height: number };
    medium?: { source_url: string; width: number; height: number };
    medium_large?: { source_url: string; width: number; height: number };
    large?: { source_url: string; width: number; height: number };
    full?: { source_url: string; width: number; height: number };
    [key: string]: { source_url: string; width: number; height: number } | undefined;
  };
}

export interface WPMedia {
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: { rendered: string };
  author: number;
  comment_status: string;
  ping_status: string;
  template: string;
  meta: Record<string, any>;
  description: { rendered: string };
  caption: { rendered: string };
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: WPMediaDetails;
  post: number;
  source_url: string;
  _links?: Record<string, any>;
}

export interface WPCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: Record<string, any>;
  _links?: Record<string, any>;
}

export interface WPTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  meta: Record<string, any>;
  _links?: Record<string, any>;
}

export interface WPUser {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: {
    24: string;
    48: string;
    96: string;
  };
  meta: Record<string, any>;
  _links?: Record<string, any>;
}

export interface WPComment {
  id: number;
  post: number;
  parent: number;
  author: number;
  author_name: string;
  author_url: string;
  date: string;
  date_gmt: string;
  content: { rendered: string };
  link: string;
  status: string;
  type: string;
  author_avatar_urls: {
    24: string;
    48: string;
    96: string;
  };
  meta: Record<string, any>;
  _links?: Record<string, any>;
}

export interface WPPage {
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string; protected: boolean };
  excerpt: { rendered: string; protected: boolean };
  author: number;
  featured_media: number;
  parent: number;
  menu_order: number;
  comment_status: string;
  ping_status: string;
  template: string;
  meta: Record<string, any>;
  _embedded?: {
    'wp:featuredmedia'?: WPMedia[];
    author?: WPUser[];
    'wp:term'?: WPCategory[][];
  };
  _links?: Record<string, any>;
}

export interface WPPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string; protected: boolean };
  excerpt: { rendered: string; protected: boolean };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: Record<string, any>;
  categories: number[];
  tags: number[];
  _embedded?: {
    'wp:featuredmedia'?: WPMedia[];
    author?: WPUser[];
    'wp:term'?: (WPCategory | WPTag)[][];
  };
  _links?: Record<string, any>;
}

export interface WPTaxonomy {
  name: string;
  slug: string;
  description: string;
  types: string[];
  hierarchical: boolean;
  rest_base: string;
  rest_namespace: string;
  _links?: Record<string, any>;
}

export interface WPPostType {
  description: string;
  hierarchical: boolean;
  name: string;
  slug: string;
  taxonomies: string[];
  rest_base: string;
  rest_namespace: string;
  _links?: Record<string, any>;
}

export interface WPSettings {
  title: string;
  description: string;
  url: string;
  email: string;
  timezone: string;
  date_format: string;
  time_format: string;
  start_of_week: number;
  language: string;
  use_smilies: boolean;
  default_category: number;
  default_post_format: string;
  posts_per_page: number;
  discussion_settings: Record<string, any>;
}

export interface WPSearchResult {
  id: number;
  title: string;
  url: string;
  type: string;
  subtype: string;
  _links?: Record<string, any>;
}

// Response types
export type WPPostsResponse = WPPost[];
export type WPPagesResponse = WPPage[];
export type WPMediaResponse = WPMedia[];
export type WPCategoriesResponse = WPCategory[];
export type WPTagsResponse = WPTag[];
export type WPUsersResponse = WPUser[];
export type WPCommentsResponse = WPComment[];
export type WPTaxonomiesResponse = Record<string, WPTaxonomy>;
export type WPPostTypesResponse = Record<string, WPPostType>;
export type WPSearchResponse = WPSearchResult[];

const WP_API_BASE = process.env.NEXT_PUBLIC_WP_API_BASE || 'http://localhost:8884';

/**
 * Generic fetch function with error handling and caching
 */
async function wpFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${WP_API_BASE}/wp-json/wp/v2/${endpoint}`;
  
  console.log('Fetching:', url);
  
  try {
    const response = await fetch(url, {
      ...options,
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      console.error('WordPress API Error:', response.status, response.statusText);
      throw new Error(`WordPress API Error: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      console.error('Invalid content type:', contentType);
      throw new Error('WordPress API returned non-JSON response');
    }

    const data = await response.json();
    console.log('API Response:', data);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// =============================================================================
// POSTS API - /wp/v2/posts
// =============================================================================

/**
 * Fetch posts from WordPress REST API with comprehensive filtering options
 */
export async function getPosts(options: {
  perPage?: number;
  page?: number;
  search?: string;
  author?: number;
  categories?: number[];
  tags?: number[];
  status?: string;
  orderby?: string;
  order?: 'asc' | 'desc';
  before?: string;
  after?: string;
  include?: number[];
  exclude?: number[];
  sticky?: boolean;
} = {}): Promise<WPPost[]> {
  try {
    const params = new URLSearchParams();
    
    // Basic parameters
    params.append('_fields', 'id,slug,title,excerpt,content,date,author,featured_media,categories,tags,sticky,format');
    params.append('_embed', 'wp:featuredmedia,author,wp:term');
    params.append('status', options.status || 'publish');
    
    // Pagination
    if (options.perPage) params.append('per_page', options.perPage.toString());
    if (options.page) params.append('page', options.page.toString());
    
    // Search and filtering
    if (options.search) params.append('search', options.search);
    if (options.author) params.append('author', options.author.toString());
    if (options.categories?.length) params.append('categories', options.categories.join(','));
    if (options.tags?.length) params.append('tags', options.tags.join(','));
    if (options.include?.length) params.append('include', options.include.join(','));
    if (options.exclude?.length) params.append('exclude', options.exclude.join(','));
    
    // Ordering
    if (options.orderby) params.append('orderby', options.orderby);
    if (options.order) params.append('order', options.order);
    if (options.before) params.append('before', options.before);
    if (options.after) params.append('after', options.after);
    
    // Sticky posts
    if (typeof options.sticky === 'boolean') params.append('sticky', options.sticky.toString());
    
    const posts = await wpFetch(`posts?${params.toString()}`);
    return posts || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

/**
 * Fetch a single post by ID
 */
export async function getPostById(id: number): Promise<WPPost | null> {
  try {
    const params = new URLSearchParams();
    params.append('_fields', 'id,slug,title,excerpt,content,date,author,featured_media,categories,tags,sticky,format');
    params.append('_embed', 'wp:featuredmedia,author,wp:term');
    
    const post = await wpFetch(`posts/${id}?${params.toString()}`);
    return post || null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

/**
 * Fetch a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  try {
    const params = new URLSearchParams();
    params.append('slug', slug);
    params.append('_fields', 'id,slug,title,excerpt,content,date,author,featured_media,categories,tags,sticky,format');
    params.append('_embed', 'wp:featuredmedia,author,wp:term');
    params.append('status', 'publish');
    
    const posts = await wpFetch(`posts?${params.toString()}`);
    return posts?.[0] || null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

// =============================================================================
// PAGES API - /wp/v2/pages
// =============================================================================

/**
 * Fetch pages from WordPress REST API
 */
export async function getPages(options: {
  perPage?: number;
  page?: number;
  search?: string;
  author?: number;
  parent?: number;
  status?: string;
  orderby?: string;
  order?: 'asc' | 'desc';
  include?: number[];
  exclude?: number[];
} = {}): Promise<WPPage[]> {
  try {
    const params = new URLSearchParams();
    
    params.append('_fields', 'id,slug,title,excerpt,content,date,author,featured_media,parent,menu_order');
    params.append('_embed', 'wp:featuredmedia,author');
    params.append('status', options.status || 'publish');
    
    if (options.perPage) params.append('per_page', options.perPage.toString());
    if (options.page) params.append('page', options.page.toString());
    if (options.search) params.append('search', options.search);
    if (options.author) params.append('author', options.author.toString());
    if (options.parent !== undefined) params.append('parent', options.parent.toString());
    if (options.include?.length) params.append('include', options.include.join(','));
    if (options.exclude?.length) params.append('exclude', options.exclude.join(','));
    if (options.orderby) params.append('orderby', options.orderby);
    if (options.order) params.append('order', options.order);
    
    const pages = await wpFetch(`pages?${params.toString()}`);
    return pages || [];
  } catch (error) {
    console.error('Error fetching pages:', error);
    return [];
  }
}

/**
 * Fetch a single page by ID
 */
export async function getPageById(id: number): Promise<WPPage | null> {
  try {
    const params = new URLSearchParams();
    params.append('_fields', 'id,slug,title,excerpt,content,date,author,featured_media,parent,menu_order');
    params.append('_embed', 'wp:featuredmedia,author');
    
    const page = await wpFetch(`pages/${id}?${params.toString()}`);
    return page || null;
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
}

/**
 * Fetch a single page by slug
 */
export async function getPageBySlug(slug: string): Promise<WPPage | null> {
  try {
    const params = new URLSearchParams();
    params.append('slug', slug);
    params.append('_fields', 'id,slug,title,excerpt,content,date,author,featured_media,parent,menu_order');
    params.append('_embed', 'wp:featuredmedia,author');
    params.append('status', 'publish');
    
    const pages = await wpFetch(`pages?${params.toString()}`);
    return pages?.[0] || null;
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
}

// =============================================================================
// MEDIA API - /wp/v2/media
// =============================================================================

/**
 * Fetch media from WordPress REST API
 */
export async function getMedia(options: {
  perPage?: number;
  page?: number;
  search?: string;
  author?: number;
  parent?: number;
  media_type?: string;
  mime_type?: string;
  orderby?: string;
  order?: 'asc' | 'desc';
  include?: number[];
  exclude?: number[];
} = {}): Promise<WPMedia[]> {
  try {
    const params = new URLSearchParams();
    
    if (options.perPage) params.append('per_page', options.perPage.toString());
    if (options.page) params.append('page', options.page.toString());
    if (options.search) params.append('search', options.search);
    if (options.author) params.append('author', options.author.toString());
    if (options.parent !== undefined) params.append('parent', options.parent.toString());
    if (options.media_type) params.append('media_type', options.media_type);
    if (options.mime_type) params.append('mime_type', options.mime_type);
    if (options.include?.length) params.append('include', options.include.join(','));
    if (options.exclude?.length) params.append('exclude', options.exclude.join(','));
    if (options.orderby) params.append('orderby', options.orderby);
    if (options.order) params.append('order', options.order);
    
    const media = await wpFetch(`media?${params.toString()}`);
    return media || [];
  } catch (error) {
    console.error('Error fetching media:', error);
    return [];
  }
}

/**
 * Fetch media by ID directly (fallback when embed doesn't work)
 */
export async function getMediaById(mediaId: number): Promise<WPMedia | null> {
  if (!mediaId || mediaId === 0) return null;
  
  try {
    const media = await wpFetch(`media/${mediaId}`);
    return media || null;
  } catch (error) {
    console.error('Error fetching media:', error);
    return null;
  }
}

// =============================================================================
// CATEGORIES API - /wp/v2/categories
// =============================================================================

/**
 * Fetch categories from WordPress REST API
 */
export async function getCategories(options: {
  perPage?: number;
  page?: number;
  search?: string;
  parent?: number;
  orderby?: string;
  order?: 'asc' | 'desc';
  hide_empty?: boolean;
  include?: number[];
  exclude?: number[];
  slug?: string[];
} = {}): Promise<WPCategory[]> {
  try {
    const params = new URLSearchParams();
    
    if (options.perPage) params.append('per_page', options.perPage.toString());
    if (options.page) params.append('page', options.page.toString());
    if (options.search) params.append('search', options.search);
    if (options.parent !== undefined) params.append('parent', options.parent.toString());
    if (options.orderby) params.append('orderby', options.orderby);
    if (options.order) params.append('order', options.order);
    if (typeof options.hide_empty === 'boolean') params.append('hide_empty', options.hide_empty.toString());
    if (options.include?.length) params.append('include', options.include.join(','));
    if (options.exclude?.length) params.append('exclude', options.exclude.join(','));
    if (options.slug?.length) params.append('slug', options.slug.join(','));
    
    const categories = await wpFetch(`categories?${params.toString()}`);
    return categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Fetch a single category by ID
 */
export async function getCategoryById(id: number): Promise<WPCategory | null> {
  try {
    const category = await wpFetch(`categories/${id}`);
    return category || null;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

// =============================================================================
// TAGS API - /wp/v2/tags  
// =============================================================================

/**
 * Fetch tags from WordPress REST API
 */
export async function getTags(options: {
  perPage?: number;
  page?: number;
  search?: string;
  orderby?: string;
  order?: 'asc' | 'desc';
  hide_empty?: boolean;
  include?: number[];
  exclude?: number[];
  slug?: string[];
} = {}): Promise<WPTag[]> {
  try {
    const params = new URLSearchParams();
    
    if (options.perPage) params.append('per_page', options.perPage.toString());
    if (options.page) params.append('page', options.page.toString());
    if (options.search) params.append('search', options.search);
    if (options.orderby) params.append('orderby', options.orderby);
    if (options.order) params.append('order', options.order);
    if (typeof options.hide_empty === 'boolean') params.append('hide_empty', options.hide_empty.toString());
    if (options.include?.length) params.append('include', options.include.join(','));
    if (options.exclude?.length) params.append('exclude', options.exclude.join(','));
    if (options.slug?.length) params.append('slug', options.slug.join(','));
    
    const tags = await wpFetch(`tags?${params.toString()}`);
    return tags || [];
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

/**
 * Fetch a single tag by ID
 */
export async function getTagById(id: number): Promise<WPTag | null> {
  try {
    const tag = await wpFetch(`tags/${id}`);
    return tag || null;
  } catch (error) {
    console.error('Error fetching tag:', error);
    return null;
  }
}

// =============================================================================
// USERS API - /wp/v2/users
// =============================================================================

/**
 * Fetch users from WordPress REST API
 */
export async function getUsers(options: {
  perPage?: number;
  page?: number;
  search?: string;
  roles?: string[];
  orderby?: string;
  order?: 'asc' | 'desc';
  include?: number[];
  exclude?: number[];
  slug?: string[];
} = {}): Promise<WPUser[]> {
  try {
    const params = new URLSearchParams();
    
    if (options.perPage) params.append('per_page', options.perPage.toString());
    if (options.page) params.append('page', options.page.toString());
    if (options.search) params.append('search', options.search);
    if (options.roles?.length) params.append('roles', options.roles.join(','));
    if (options.orderby) params.append('orderby', options.orderby);
    if (options.order) params.append('order', options.order);
    if (options.include?.length) params.append('include', options.include.join(','));
    if (options.exclude?.length) params.append('exclude', options.exclude.join(','));
    if (options.slug?.length) params.append('slug', options.slug.join(','));
    
    const users = await wpFetch(`users?${params.toString()}`);
    return users || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

/**
 * Fetch a single user by ID
 */
export async function getUserById(id: number): Promise<WPUser | null> {
  try {
    const user = await wpFetch(`users/${id}`);
    return user || null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

// =============================================================================
// COMMENTS API - /wp/v2/comments
// =============================================================================

/**
 * Fetch comments from WordPress REST API
 */
export async function getComments(options: {
  perPage?: number;
  page?: number;
  search?: string;
  author?: number;
  post?: number;
  parent?: number;
  status?: string;
  type?: string;
  orderby?: string;
  order?: 'asc' | 'desc';
  include?: number[];
  exclude?: number[];
} = {}): Promise<WPComment[]> {
  try {
    const params = new URLSearchParams();
    
    if (options.perPage) params.append('per_page', options.perPage.toString());
    if (options.page) params.append('page', options.page.toString());
    if (options.search) params.append('search', options.search);
    if (options.author) params.append('author', options.author.toString());
    if (options.post) params.append('post', options.post.toString());
    if (options.parent !== undefined) params.append('parent', options.parent.toString());
    if (options.status) params.append('status', options.status);
    if (options.type) params.append('type', options.type);
    if (options.orderby) params.append('orderby', options.orderby);
    if (options.order) params.append('order', options.order);
    if (options.include?.length) params.append('include', options.include.join(','));
    if (options.exclude?.length) params.append('exclude', options.exclude.join(','));
    
    const comments = await wpFetch(`comments?${params.toString()}`);
    return comments || [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

/**
 * Fetch a single comment by ID
 */
export async function getCommentById(id: number): Promise<WPComment | null> {
  try {
    const comment = await wpFetch(`comments/${id}`);
    return comment || null;
  } catch (error) {
    console.error('Error fetching comment:', error);
    return null;
  }
}

// =============================================================================
// TAXONOMIES API - /wp/v2/taxonomies
// =============================================================================

/**
 * Fetch taxonomies from WordPress REST API
 */
export async function getTaxonomies(options: {
  type?: string;
} = {}): Promise<WPTaxonomiesResponse> {
  try {
    const params = new URLSearchParams();
    if (options.type) params.append('type', options.type);
    
    const taxonomies = await wpFetch(`taxonomies?${params.toString()}`);
    return taxonomies || {};
  } catch (error) {
    console.error('Error fetching taxonomies:', error);
    return {};
  }
}

// =============================================================================
// POST TYPES API - /wp/v2/types
// =============================================================================

/**
 * Fetch post types from WordPress REST API
 */
export async function getPostTypes(): Promise<WPPostTypesResponse> {
  try {
    const postTypes = await wpFetch('types');
    return postTypes || {};
  } catch (error) {
    console.error('Error fetching post types:', error);
    return {};
  }
}

// =============================================================================
// SEARCH API - /wp/v2/search
// =============================================================================

/**
 * Search across WordPress content
 */
export async function searchContent(options: {
  search: string;
  type?: string;
  subtype?: string;
  perPage?: number;
  page?: number;
} = { search: '' }): Promise<WPSearchResult[]> {
  try {
    const params = new URLSearchParams();
    params.append('search', options.search);
    
    if (options.type) params.append('type', options.type);
    if (options.subtype) params.append('subtype', options.subtype);
    if (options.perPage) params.append('per_page', options.perPage.toString());
    if (options.page) params.append('page', options.page.toString());
    
    const results = await wpFetch(`search?${params.toString()}`);
    return results || [];
  } catch (error) {
    console.error('Error searching content:', error);
    return [];
  }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get featured image URL from post/page data with fallback logic
 */
export function getFeaturedImageUrl(
  post: WPPost | WPPage, 
  size: 'thumbnail' | 'medium' | 'medium_large' | 'large' | 'full' = 'medium'
): string | null {
  // Check if we have embedded media
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  
  if (!media) {
    console.log('No featured media found for post:', post.id);
    console.log('Featured media ID:', post.featured_media);
    console.log('Embedded data:', post._embedded);
    return null;
  }

  console.log('Featured media found:', media);

  // Try to get the requested size
  const sizeData = media.media_details?.sizes?.[size];
  if (sizeData?.source_url) {
    console.log('Using size', size, ':', sizeData.source_url);
    return sizeData.source_url;
  }

  // Fallback to other sizes
  const fallbackSizes = ['medium', 'large', 'medium_large', 'thumbnail', 'full'];
  for (const fallbackSize of fallbackSizes) {
    const fallbackData = media.media_details?.sizes?.[fallbackSize];
    if (fallbackData?.source_url) {
      console.log('Using fallback size', fallbackSize, ':', fallbackData.source_url);
      return fallbackData.source_url;
    }
  }

  // Final fallback to source_url
  if (media.source_url) {
    console.log('Using source_url:', media.source_url);
    return media.source_url;
  }

  console.log('No image URL found');
  return null;
}

/**
 * Get featured image URL with fallback to direct media fetch
 */
export async function getFeaturedImageUrlAsync(
  post: WPPost | WPPage, 
  size: 'thumbnail' | 'medium' | 'medium_large' | 'large' | 'full' = 'medium'
): Promise<string | null> {
  // First try the embedded approach
  const embeddedUrl = getFeaturedImageUrl(post, size);
  if (embeddedUrl) return embeddedUrl;
  
  // If no embedded media but we have a featured_media ID, try direct fetch
  if (post.featured_media && post.featured_media > 0) {
    console.log('Attempting direct media fetch for ID:', post.featured_media);
    const media = await getMediaById(post.featured_media);
    
    if (media) {
      // Try to get the requested size
      const sizeData = media.media_details?.sizes?.[size];
      if (sizeData?.source_url) {
        console.log('Direct fetch - using size', size, ':', sizeData.source_url);
        return sizeData.source_url;
      }
      
      // Fallback to source_url
      if (media.source_url) {
        console.log('Direct fetch - using source_url:', media.source_url);
        return media.source_url;
      }
    }
  }
  
  return null;
}

/**
 * Get featured image alt text from post/page data
 */
export function getFeaturedImageAlt(post: WPPost | WPPage): string {
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  
  if (!media) {
    return stripHtml(post.title.rendered);
  }

  return media.alt_text || media.title?.rendered || stripHtml(post.title.rendered);
}

/**
 * Check if post/page has featured image
 */
export function hasFeaturedImage(post: WPPost | WPPage): boolean {
  return !!(post.featured_media && post._embedded?.['wp:featuredmedia']?.[0]);
}

/**
 * Get author name from embedded data or fallback
 */
export function getAuthorName(post: WPPost | WPPage): string {
  const author = post._embedded?.author?.[0];
  return author?.name || 'Unknown Author';
}

/**
 * Get categories from embedded data
 */
export function getPostCategories(post: WPPost): WPCategory[] {
  const terms = post._embedded?.['wp:term'];
  if (!terms || !Array.isArray(terms)) return [];
  
  // Categories are typically the first term array, filter for categories
  const categoryTerms = terms[0] || [];
  return categoryTerms.filter((term): term is WPCategory => 
    'parent' in term && term.taxonomy === 'category'
  );
}

/**
 * Get tags from embedded data
 */
export function getPostTags(post: WPPost): WPTag[] {
  const terms = post._embedded?.['wp:term'];
  if (!terms || !Array.isArray(terms)) return [];
  
  // Tags are typically the second term array, or find tags in all terms
  const allTerms = terms.flat();
  return allTerms.filter((term): term is WPTag => 
    !('parent' in term) && term.taxonomy === 'post_tag'
  );
}

/**
 * Strip HTML tags for safe display in meta tags
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date and time for display
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, length: number = 150): string {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + '...';
}

/**
 * Convert WordPress excerpt to plain text
 */
export function getExcerptText(excerpt: string, length?: number): string {
  const plainText = stripHtml(excerpt);
  return length ? truncateText(plainText, length) : plainText;
}

/**
 * Generate a slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Check if a post is sticky
 */
export function isSticky(post: WPPost): boolean {
  return post.sticky || false;
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
}

/**
 * Check if content has specific format
 */
export function hasPostFormat(post: WPPost, format: string): boolean {
  return post.format === format;
}

/**
 * Get WordPress site URL
 */
export function getSiteUrl(): string {
  return WP_API_BASE;
}

/**
 * Get WordPress API URL
 */
export function getAPIUrl(): string {
  return `${WP_API_BASE}/wp-json/wp/v2`;
}

// =============================================================================
// BATCH OPERATIONS
// =============================================================================

/**
 * Fetch multiple post types in parallel
 */
export async function getMultipleContent(options: {
  posts?: { perPage?: number; categories?: number[] };
  pages?: { perPage?: number };
  categories?: { perPage?: number };
  tags?: { perPage?: number };
  media?: { perPage?: number };
  users?: { perPage?: number };
}) {
  const requests: Promise<any>[] = [];
  const results: any = {};
  
  if (options.posts) {
    requests.push(
      getPosts(options.posts).then(data => ({ key: 'posts', data }))
    );
  }
  
  if (options.pages) {
    requests.push(
      getPages(options.pages).then(data => ({ key: 'pages', data }))
    );
  }
  
  if (options.categories) {
    requests.push(
      getCategories(options.categories).then(data => ({ key: 'categories', data }))
    );
  }
  
  if (options.tags) {
    requests.push(
      getTags(options.tags).then(data => ({ key: 'tags', data }))
    );
  }
  
  if (options.media) {
    requests.push(
      getMedia(options.media).then(data => ({ key: 'media', data }))
    );
  }
  
  if (options.users) {
    requests.push(
      getUsers(options.users).then(data => ({ key: 'users', data }))
    );
  }
  
  try {
    const responses = await Promise.allSettled(requests);
    
    responses.forEach((response) => {
      if (response.status === 'fulfilled') {
        results[response.value.key] = response.value.data;
      } else {
        console.error('Batch request failed:', response.reason);
      }
    });
    
    return results;
  } catch (error) {
    console.error('Error in batch operations:', error);
    return results;
  }
}

/**
 * Get site settings
 */
export async function getSettings() {
  try {
    const response = await fetch(`${WP_API_BASE}/wp-json/wp/v2/settings`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching settings:', error);
    return {};
  }
}

/**
 * Get full post data with all related content
 */
export async function getFullPostData(postId: number) {
  try {
    const post = await getPostById(postId);
    if (!post) return null;
    
    const [categories, tags, author, comments] = await Promise.allSettled([
      post.categories.length ? Promise.all(post.categories.map(id => getCategoryById(id))) : Promise.resolve([]),
      post.tags.length ? Promise.all(post.tags.map(id => getTagById(id))) : Promise.resolve([]),
      getUserById(post.author),
      getComments({ post: postId, status: 'approve' })
    ]);
    
    return {
      post,
      categories: categories.status === 'fulfilled' ? categories.value.filter(Boolean) : [],
      tags: tags.status === 'fulfilled' ? tags.value.filter(Boolean) : [],
      author: author.status === 'fulfilled' ? author.value : null,
      comments: comments.status === 'fulfilled' ? comments.value : []
    };
  } catch (error) {
    console.error('Error fetching full post data:', error);
    return null;
  }
}
