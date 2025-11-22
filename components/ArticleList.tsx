'use client';

import { Article } from '@/lib/articles';
import { format } from 'date-fns';

interface ArticleListProps {
  articles: Article[];
  onEdit: (article: Article) => void;
  onDelete: (id: string) => void;
}

export default function ArticleList({ articles, onEdit, onDelete }: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-600 text-lg">No articles yet. Create your first article!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Articles</h2>
      {articles.map((article) => (
        <div key={article.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {article.category && (
                <span className="inline-block bg-primary-100 text-primary-800 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                  {article.category}
                </span>
              )}
              <h3 className="text-xl font-bold text-gray-900 mb-2">{article.title}</h3>
              <p className="text-gray-600 mb-3 line-clamp-2">{article.excerpt}</p>
              <div className="flex items-center text-sm text-gray-500">
                <span>Created: {format(new Date(article.createdAt), 'MMM dd, yyyy')}</span>
                {article.updatedAt !== article.createdAt && (
                  <span className="ml-4">
                    Updated: {format(new Date(article.updatedAt), 'MMM dd, yyyy')}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 flex space-x-3">
            <button
              onClick={() => onEdit(article)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(article.id)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

