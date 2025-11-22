'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EnhancedArticleForm from '@/components/EnhancedArticleForm';
import ArticleList from '@/components/ArticleList';
import { Article } from '@/lib/articles';

export default function AdminPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchArticles();
  }, [router]);

  const fetchArticles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/articles', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleArticleSaved = () => {
    setEditingArticle(null);
    fetchArticles();
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchArticles();
      } else {
        alert('Failed to delete article');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('An error occurred');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-5xl font-bold text-gray-900 mb-2">Article Dashboard</h1>
                <p className="text-gray-600">Create and manage your articles with rich content editing</p>
              </div>
              <div className="hidden md:flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-600">{articles.length}</p>
                  <p className="text-sm text-gray-600">Total Articles</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Article Form Section - Now on the left with more space */}
            <div className="xl:col-span-2 order-1">
              <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    {editingArticle ? (
                      <>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Article
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create New Article
                      </>
                    )}
                  </h2>
                </div>
                <div className="p-6">
                  <EnhancedArticleForm
                    article={editingArticle}
                    onSave={handleArticleSaved}
                    onCancel={() => setEditingArticle(null)}
                  />
                </div>
              </div>
            </div>
            
            {/* Article List Section - Now on the right with less space */}
            <div className="xl:col-span-1 order-2">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-8">
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
                  <h2 className="text-2xl font-bold text-white">Your Articles</h2>
                </div>
                <div className="p-6">
                  <ArticleList
                    articles={articles}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

