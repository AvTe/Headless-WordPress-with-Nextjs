<?php
/**
 * Plugin Name: WordPress API Diagnostic
 * Description: Simple diagnostic tool accessible at yourdomain.com/?wp_api_diagnostic=1
 * Version: 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit('Direct access not allowed.');
}

// Add diagnostic endpoint
add_action('init', 'wp_api_diagnostic_check');

function wp_api_diagnostic_check() {
    if (isset($_GET['wp_api_diagnostic']) && $_GET['wp_api_diagnostic'] == '1') {
        // Set content type to HTML
        header('Content-Type: text/html; charset=utf-8');
        
        echo '<!DOCTYPE html><html><head><title>WordPress API Diagnostic</title>';
        echo '<style>body{font-family:Arial,sans-serif;margin:40px;} .good{color:green;} .bad{color:red;} pre{background:#f5f5f5;padding:10px;overflow:auto;}</style>';
        echo '</head><body>';
        echo '<h1>WordPress API Diagnostic Report</h1>';
        
        // Check REST API
        echo '<h2>REST API Status</h2>';
        $rest_enabled = function_exists('rest_url');
        echo $rest_enabled ? '<p class="good">✅ REST API is enabled</p>' : '<p class="bad">❌ REST API is disabled</p>';
        
        if ($rest_enabled) {
            echo '<p>REST URL: <a href="' . rest_url() . '" target="_blank">' . rest_url() . '</a></p>';
        }
        
        // Check permalink structure
        echo '<h2>Permalink Structure</h2>';
        $permalink_structure = get_option('permalink_structure');
        if ($permalink_structure) {
            echo '<p class="good">✅ Custom permalinks: <code>' . esc_html($permalink_structure) . '</code></p>';
        } else {
            echo '<p class="bad">❌ Using default permalinks - Need to change to "Post name"</p>';
            echo '<p>Go to WordPress Admin → Settings → Permalinks → Select "Post name"</p>';
        }
        
        // Check published posts
        echo '<h2>Published Posts</h2>';
        $posts_count = wp_count_posts()->publish;
        if ($posts_count > 0) {
            echo '<p class="good">✅ Found ' . $posts_count . ' published post(s)</p>';
        } else {
            echo '<p class="bad">❌ No published posts found</p>';
            echo '<p>Create at least one post and publish it in WordPress Admin</p>';
        }
        
        // Test API endpoints with media
        echo '<h2>API Endpoints to Test</h2>';
        if ($rest_enabled) {
            $endpoints = [
                'Basic Posts' => rest_url('wp/v2/posts'),
                'Posts with fields' => rest_url('wp/v2/posts') . '?_fields=id,slug,title,excerpt,content,date,featured_media',
                'Posts with embedded media' => rest_url('wp/v2/posts') . '?_fields=id,slug,title,excerpt,content,date,featured_media&_embed=wp:featuredmedia',
                'Media endpoint' => rest_url('wp/v2/media')
            ];
            
            echo '<ul>';
            foreach ($endpoints as $name => $url) {
                echo '<li><strong>' . $name . ':</strong> <a href="' . $url . '" target="_blank">' . $url . '</a></li>';
            }
            echo '</ul>';
        }
        
        // Check CORS function
        echo '<h2>CORS Plugin Status</h2>';
        if (function_exists('add_cors_http_header')) {
            echo '<p class="good">✅ CORS function exists and loaded</p>';
        } else {
            echo '<p class="bad">❌ CORS function not found</p>';
        }
        
        // Show recent posts with media info
        if ($posts_count > 0) {
            echo '<h2>Recent Posts (with Media Info)</h2>';
            $recent_posts = get_posts([
                'numberposts' => 3,
                'post_status' => 'publish'
            ]);
            
            $posts_data = [];
            foreach ($recent_posts as $post) {
                $featured_media_id = get_post_thumbnail_id($post->ID);
                $featured_media_url = '';
                $featured_media_alt = '';
                
                if ($featured_media_id) {
                    $featured_media_url = wp_get_attachment_image_src($featured_media_id, 'medium')[0];
                    $featured_media_alt = get_post_meta($featured_media_id, '_wp_attachment_image_alt', true);
                }
                
                $posts_data[] = [
                    'id' => $post->ID,
                    'slug' => $post->post_name,
                    'title' => $post->post_title,
                    'excerpt' => wp_trim_words($post->post_excerpt ?: $post->post_content, 20),
                    'date' => $post->post_date,
                    'featured_media' => $featured_media_id,
                    'featured_media_url' => $featured_media_url,
                    'featured_media_alt' => $featured_media_alt
                ];
            }
            
            echo '<pre>' . json_encode($posts_data, JSON_PRETTY_PRINT) . '</pre>';
            
            // Test the actual REST API call
            echo '<h2>Live REST API Test</h2>';
            $api_url = home_url('/wp-json/wp/v2/posts?_fields=id,slug,title,excerpt,content,date,featured_media&_embed=wp:featuredmedia&per_page=3');
            echo '<p><strong>Testing:</strong> <a href="' . $api_url . '" target="_blank">' . $api_url . '</a></p>';
            
            $response = wp_remote_get($api_url);
            if (!is_wp_error($response)) {
                $body = wp_remote_retrieve_body($response);
                echo '<p><strong>Response:</strong></p>';
                echo '<pre style="max-height: 300px; overflow: auto;">' . esc_html($body) . '</pre>';
            } else {
                echo '<p><strong>Error:</strong> ' . $response->get_error_message() . '</p>';
            }
        }
        
        echo '</body></html>';
        exit;
    }
}
