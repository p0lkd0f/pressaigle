import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContentRenderer from '@/components/ContentRenderer';
import ImageWithFallback from '@/components/ImageWithFallback';
import { getNewsById, fetchTrendingNews, setNewsCache, fetchFullArticleContent, NewsArticle } from '@/lib/news';
import { format } from 'date-fns';
import Link from 'next/link';

// Always fetch fresh news data
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function NewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Always fetch fresh news to ensure we have the latest data
  const trendingNews = await fetchTrendingNews();
  setNewsCache(trendingNews);
  
  // Get the specific news article
  let news: NewsArticle | null = getNewsById(id);
  
  // If still not found, try searching in the fresh data
  if (!news) {
    news = trendingNews.find(n => n.id === id) || null;
  }

  if (!news) {
    notFound();
  }

  // Use the content that was already fetched when news was loaded
  // If it's still short, try fetching again (fallback)
  let fullContent = news.content || news.description;
  
  // Only fetch if content is still very short (fallback case)
  if (news.url && news.url !== '#' && (!fullContent || fullContent.length < 300)) {
    try {
      const fetchedContent = await fetchFullArticleContent(news.url);
      if (fetchedContent && fetchedContent.length > 200) {
        fullContent = fetchedContent;
      }
    } catch (error) {
      // If fetching fails, use existing content
      console.debug('Failed to fetch additional content');
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12 max-w-5xl">
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-8 transition-colors"
        >
          <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {news.urlToImage && (
            <div className="w-full h-96 bg-gray-200 overflow-hidden relative">
              <ImageWithFallback
                src={news.urlToImage}
                alt={news.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          
          <div className="p-8 md:p-12">
            <div className="flex items-center mb-6 pb-6 border-b border-gray-200">
              <div className="flex-1">
                <span className="inline-block bg-primary-100 text-primary-700 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
                  {news.source}
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  {news.title}
                </h1>
                <div className="flex items-center text-gray-600 text-sm">
                  <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{format(new Date(news.publishedAt), 'MMMM dd, yyyy')}</span>
                </div>
              </div>
            </div>
            
            <div className="text-gray-700 leading-relaxed">
              {/* Show description as a lead/intro if we have full content */}
              {news.description && fullContent && fullContent.length > 500 && fullContent !== news.description && (
                <div className="mb-8 p-6 bg-primary-50 rounded-lg border-l-4 border-primary-600">
                  <p className="text-xl font-semibold text-gray-800 leading-relaxed">
                    {news.description}
                  </p>
                </div>
              )}
              
              {/* Render full article content */}
              {fullContent && fullContent.length > 200 ? (
                <ContentRenderer
                  content={fullContent}
                  isHtml={false}
                  className="text-gray-700 text-base leading-7"
                />
              ) : (
                <div className="space-y-4">
                  {news.description && (
                    <p className="text-lg leading-relaxed">
                      {news.description}
                    </p>
                  )}
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-gray-700 text-sm">
                      <strong>Note:</strong> Full article content could not be extracted. Please visit the original source for the complete story.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {news.url && news.url !== '#' && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">Original Source:</p>
                <a
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  Read full article on {news.source}
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}

