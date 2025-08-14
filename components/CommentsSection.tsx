'use client';

import { useState, useEffect } from 'react';
import { WPPost } from '@/lib/wp';

interface Comment {
  id: number;
  author_name: string;
  author_email: string;
  author_url?: string;
  date: string;
  content: {
    rendered: string;
  };
  parent: number;
  post: number;
  status: string;
  author_avatar_urls?: {
    '24': string;
    '48': string;
    '96': string;
  };
}

interface CommentFormData {
  author: string;
  email: string;
  url?: string;
  content: string;
  parent?: number;
}

interface CommentsSectionProps {
  post: WPPost;
}

export default function CommentsSection({ post }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [formData, setFormData] = useState<CommentFormData>({
    author: '',
    email: '',
    url: '',
    content: ''
  });
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Load comments
  useEffect(() => {
    loadComments();
  }, [post.id]);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      console.log('Loading comments for post:', post.id);
      
      const response = await fetch(`http://localhost:8884/wp-json/wp/v2/comments?post=${post.id}&per_page=100&order=asc&status=approve`);
      console.log('Comments response status:', response.status);
      
      if (response.ok) {
        const commentsData = await response.json();
        console.log('Loaded comments:', commentsData);
        setComments(commentsData);
      } else {
        console.error('Failed to load comments:', response.status);
        setComments([]);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.author.trim() || !formData.email.trim() || !formData.content.trim()) {
      setSubmitStatus({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const commentData = {
        post: post.id,
        author_name: formData.author,
        author_email: formData.email,
        author_url: formData.url || '',
        content: formData.content,
        parent: replyingTo || 0,
        status: 'hold', // Submit as pending approval
      };

      console.log('Submitting comment:', commentData);

      const response = await fetch('http://localhost:8884/wp-json/wp/v2/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        setSubmitStatus({ 
          type: 'success', 
          message: 'Your comment has been submitted successfully! It may take a moment to appear.' 
        });
        setFormData({ author: '', email: '', url: '', content: '' });
        setReplyingTo(null);
        setShowCommentForm(false);
        // Reload comments after a delay
        setTimeout(loadComments, 2000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        setSubmitStatus({ 
          type: 'error', 
          message: errorData.message || `Failed to submit comment (${response.status}). Comments may be disabled or require approval.` 
        });
      }
    } catch (error) {
      console.error('Network error:', error);
      setSubmitStatus({ 
        type: 'error', 
        message: 'Network error. Please check your connection and try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const renderComments = (parentId = 0, level = 0) => {
    const levelComments = comments.filter(comment => comment.parent === parentId);
    if (levelComments.length === 0) return null;

    return (
      <div className={level > 0 ? 'ml-8 border-l-2 border-gray-100 dark:border-gray-700 pl-6' : ''}>
        {levelComments.map((comment) => (
          <div key={comment.id} className="mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              {/* Comment Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {comment.author_avatar_urls ? (
                      <img
                        src={comment.author_avatar_urls['48']}
                        alt={comment.author_name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      getInitials(comment.author_name)
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {comment.author_name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(comment.date)}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setReplyingTo(comment.id);
                    setShowCommentForm(true);
                  }}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                  Reply
                </button>
              </div>

              {/* Comment Content */}
              <div 
                className="text-gray-700 dark:text-gray-300 prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: comment.content.rendered }}
              />
            </div>

            {/* Nested Replies */}
            {level < 3 && renderComments(comment.id, level + 1)}
          </div>
        ))}
      </div>
    );
  };

  const rootComments = comments.filter(comment => comment.parent === 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
      {/* Comments Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          Comments ({comments.length})
        </h3>
        <button
          onClick={() => {
            setShowCommentForm(!showCommentForm);
            setReplyingTo(null);
          }}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Comment
        </button>
      </div>

      {/* Submit Status */}
      {submitStatus.type && (
        <div className={`mb-6 p-4 rounded-xl ${
          submitStatus.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {submitStatus.type === 'success' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              )}
            </svg>
            {submitStatus.message}
          </div>
        </div>
      )}

      {/* Comment Form */}
      {showCommentForm && (
        <form onSubmit={handleSubmitComment} className="mb-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
          {replyingTo && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                  Replying to comment
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setReplyingTo(null);
                    setShowCommentForm(false);
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name *
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Website (optional)
            </label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="https://yourwebsite.com"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Comment *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-vertical"
              placeholder="Share your thoughts..."
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your comment will be reviewed before being published.
            </p>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowCommentForm(false);
                  setReplyingTo(null);
                  setFormData({ author: '', email: '', url: '', content: '' });
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Post Comment'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center space-x-2 text-gray-500 dark:text-gray-400">
            <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a7.646 7.646 0 100 15.292V12" />
            </svg>
            <span>Loading comments...</span>
          </div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No comments yet</h4>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Be the first to share your thoughts!</p>
          <button
            onClick={() => setShowCommentForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Start the conversation
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {renderComments()}
        </div>
      )}
    </div>
  );
}
