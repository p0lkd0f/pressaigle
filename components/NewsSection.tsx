'use client';

import Link from 'next/link';
import { NewsArticle } from '@/lib/news';
import { format } from 'date-fns';
import ImageWithFallback from './ImageWithFallback';

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
        <h2 className="text-4xl font-bold text-gray-900">Trending News</h2>
        <span className="text-sm text-gray-500">Stay updated with the latest</span>
      </div>

      {/* Featured News */}
      {featuredNews && featuredNews.id && (
        <Link href={`/news/${featuredNews.id}`}>
          <div className="mb-8 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer">
            <div className="md:flex">
              {featuredNews.urlToImage && (
                <div className="md:w-1/2 h-64 md:h-auto bg-gray-200 overflow-hidden relative">
                  <ImageWithFallback
                    src={featuredNews.urlToImage}
                    alt={featuredNews.title}
                    fill
                    className="hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className={`p-8 ${featuredNews.urlToImage ? 'md:w-1/2' : 'w-full'}`}>
                <div className="flex items-center mb-3">
                  <span className="bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full mr-3">
                    FEATURED
                  </span>
                  <span className="text-sm text-gray-600">{featuredNews.source}</span>
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
                  <span className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold transition-colors">
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

      {/* Other News Grid */}
      {otherNews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherNews.map((news, index) => (
            news.id ? (
              <Link key={news.id} href={`/news/${news.id}`}>
                <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full flex flex-col">
                  {news.urlToImage && (
                    <div className="h-48 bg-gray-200 overflow-hidden relative">
                      <ImageWithFallback
                        src={news.urlToImage}
                        alt={news.title}
                        fill
                        className="hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex items-center mb-3">
                      <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">
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
            ) : null
          ))}
        </div>
      )}
    </div>
  );
}

