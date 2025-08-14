<?php
/**
 * Plugin Name: Allow CORS for Headless WordPress
 * Plugin URI: https://github.com/your-username/headless-wp-nextjs
 * Description: Enables CORS for WordPress REST API to work with frontend on localhost:3000. Must be placed in mu-plugins directory for automatic activation.
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: https://yourwebsite.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Network: false
 * Requires at least: 5.0
 * Tested up to: 6.3
 * Requires PHP: 7.4
 * Text Domain: allow-cors-headless
 * Domain Path: /languages
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit('Direct access not allowed.');
}

// Prevent function redeclaration
if (!function_exists('add_cors_http_header')) {
    function add_cors_http_header() {
        // Allow requests from Next.js development server
        $allowed_origins = [
            'http://localhost:3000',
            'https://localhost:3000'
        ];
        
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        
        if (in_array($origin, $allowed_origins)) {
            header("Access-Control-Allow-Origin: $origin");
        }
        
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
        header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control");
        header("Access-Control-Allow-Credentials: true");
    }
    
    add_action('init', 'add_cors_http_header');
}

// Handle preflight OPTIONS requests
if (!function_exists('handle_preflight_requests')) {
    function handle_preflight_requests() {
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            add_cors_http_header();
            exit();
        }
    }
    
    add_action('init', 'handle_preflight_requests');
}

// Add CORS headers to REST API responses
if (!function_exists('add_cors_to_rest_api')) {
    function add_cors_to_rest_api($response) {
        add_cors_http_header();
        return $response;
    }
    
    add_filter('rest_pre_serve_request', 'add_cors_to_rest_api');
}
