import Link from 'next/link';
import { format } from 'date-fns';
import { Article } from '@/lib/articles';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/articles/${article.id}`}>
      <article className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col hover:-translate-y-1">
        {article.imageUrl && (
          <div className="h-56 bg-gray-200 overflow-hidden">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-6 flex-grow flex flex-col">
          {article.category && (
            <span className="inline-block bg-primary-100 text-primary-700 text-xs font-bold px-3 py-1 rounded-full mb-3 self-start uppercase tracking-wide">
              {article.category}
            </span>
          )}
          <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-primary-600 transition-colors line-clamp-2 leading-tight">
            {article.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed flex-grow">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between text-sm pt-4 border-t border-gray-100">
            <span className="text-gray-500">
              {format(new Date(article.createdAt), 'MMM dd, yyyy')}
            </span>
            <span className="inline-flex items-center text-primary-600 font-semibold group">
              Read more
              <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

