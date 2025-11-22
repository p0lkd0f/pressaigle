'use client';

import Link from 'next/link';
import { NewsArticle } from '@/lib/news';
import { format } from 'date-fns';
import ImageWithFallback from './ImageWithFallback';
import LoadMoreNews from './LoadMoreNews';

interface NewsSectionProps {
  trendingNews: NewsArticle[];
}

export default function NewsSection({ trendingNews }: NewsSectionProps) {
  if (trendingNews.length === 0) {
    return null;
  }

  const featuredNews = trendingNews[0];
  const otherNews = trendingNews.slice(1);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <h2 className="text-4xl font-bold text-gray-900">Trending News</h2>
          <div className="relative">
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11.3 1.046a1 1 0 01.14 1.052L8.267 8l3.173 5.902a1 1 0 01-.14 1.052 1 1 0 01-1.051.14L2.267 9.5a1 1 0 010-1L10.25 1.106a1 1 0 011.05-.06z" />
            </svg>
          </div>
        </div>
        <span className="text-sm text-gray-500">Stay updated with the latest and</span>
      </div>

      {/* Featured News */}
      {featuredNews && featuredNews.id && (
        <Link href={`/news/${featuredNews.id}`}>
          <div className="mb-8 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 border-primary-500 relative">
            {/* Lightning effect overlay */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-300/20 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary-200/30 via-transparent to-transparent pointer-events-none"></div>
            
            <div className="md:flex relative z-10">
              {featuredNews.urlToImage && (
                <div className="md:w-1/2 h-64 md:h-auto bg-gray-200 overflow-hidden relative">
                  <ImageWithFallback
                    key={`featured-${featuredNews.id}-${featuredNews.urlToImage}`}
                    src={featuredNews.urlToImage}
                    alt={featuredNews.title}
                    fill
                    className="hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className={`p-8 ${featuredNews.urlToImage ? 'md:w-1/2' : 'w-full'}`}>
                <div className="flex items-center mb-3">
                  <span className="bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 text-white text-xs font-bold px-4 py-1.5 rounded-full mr-3 shadow-lg relative overflow-hidden">
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></span>
                    <span className="relative flex items-center">
                      <svg className="w-3 h-3 mr-1 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M11.3 1.046a1 1 0 01.14 1.052L8.267 8l3.173 5.902a1 1 0 01-.14 1.052 1 1 0 01-1.051.14L2.267 9.5a1 1 0 010-1L10.25 1.106a1 1 0 011.05-.06z" />
                      </svg>
                      FEATURED
                    </span>
                  </span>
                  <span className="text-sm text-gray-600 font-medium">{featuredNews.source}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight hover:text-primary-600 transition-colors">
                  {featuredNews.title}
                </h3>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed line-clamp-3">
                  {featuredNews.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {format(new Date(featuredNews.publishedAt), 'MMMM dd, yyyy')}
                  </span>
                  <span className="inline-flex items-center text-primary-600 hover:text-primary-500 font-semibold transition-colors">
                    Read article
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Other News Grid with Load More */}
      {otherNews.length > 0 && (
        <LoadMoreNews initialNews={otherNews} />
      )}
    </div>
  );
}

