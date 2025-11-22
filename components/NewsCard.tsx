'use client';

import Link from 'next/link';
import { NewsArticle } from '@/lib/news';
import { format } from 'date-fns';
import ImageWithFallback from './ImageWithFallback';

interface NewsCardProps {
  news: NewsArticle;
}

export default function NewsCard({ news }: NewsCardProps) {
  if (!news.id) return null;

  return (
    <Link href={`/news/${news.id}`}>
      <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full flex flex-col border-l-4 border-transparent hover:border-primary-500">
        {news.urlToImage && (
          <div className="h-48 bg-gray-200 overflow-hidden relative">
            <ImageWithFallback
              key={`${news.id}-${news.urlToImage?.substring(0, 50)}`}
              src={news.urlToImage}
              alt={news.title}
              fill
              className="hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-6 flex-grow flex flex-col">
          <div className="flex items-center mb-3">
            <span className="text-xs font-semibold text-primary-500 uppercase tracking-wide">
              {news.source}
            </span>
            <span className="mx-2 text-gray-300">•</span>
            <span className="text-xs text-gray-500">
              {format(new Date(news.publishedAt), 'MMM dd')}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight hover:text-primary-600 transition-colors">
            {news.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed flex-grow">
            {news.description}
          </p>
          <span className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors">
            Read more
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </article>
    </Link>
  );
}

