import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import NewsSection from '@/components/NewsSection';
import { getAllArticles } from '@/lib/articles';
import { fetchTrendingNews, setNewsCache } from '@/lib/news';

// Force fresh news fetch on every request (no caching)
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function Home() {
  const articles = getAllArticles();
  // Always fetch fresh news from API
  const trendingNews = await fetchTrendingNews();
  
  // Cache news for detail page access
  setNewsCache(trendingNews);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <div className="mb-6">
            <span className="text-6xl font-bold">🦅</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
            Moi l'aigle
          </h1>
          <div className="w-24 h-1 bg-primary-600 mx-auto mb-6"></div>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
            Your trusted source for curated articles and breaking news. 
            Stay informed with quality content that matters.
          </p>
        </section>

        {/* News Section */}
        <section id="news" className="mb-16">
          <NewsSection trendingNews={trendingNews} />
        </section>

        {/* Articles Section - Only show a preview */}
        {articles.length > 0 && (
          <section id="articles" className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-4xl font-bold text-gray-900">Latest Articles</h2>
              <Link 
                href="/articles"
                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.slice(0, 3).map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
            {articles.length > 3 && (
              <div className="text-center mt-8">
                <Link
                  href="/articles"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold"
                >
                  View all {articles.length} articles
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

