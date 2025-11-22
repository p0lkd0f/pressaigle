import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import NewsSection from '@/components/NewsSection';
import LoadMoreArticles from '@/components/LoadMoreArticles';
import EagleLogo from '@/components/EagleLogo';
import { getAllArticles } from '@/lib/articles';
import { fetchTrendingNews, setNewsCache } from '@/lib/news';

// Force fresh news fetch on every request (no caching)
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function Home() {
  const articles = getAllArticles();
  // Always fetch fresh news from API - fetch first page with more articles for pagination
  const allTrendingNews = await fetchTrendingNews(1, 20);
  
  // Show first 6 articles initially, rest will be loaded via Load More
  const initialNews = allTrendingNews.slice(0, 6);
  const remainingNews = allTrendingNews.slice(6);
  
  // Cache all news for detail page access
  setNewsCache(allTrendingNews);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <EagleLogo size={96} color="#7a5d91" className="drop-shadow-lg" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-primary-800 mb-6 leading-tight tracking-tight">
            Moi l'aigle
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
            Your trusted source for curated articles and breaking news. 
            Stay informed with quality content that matters.
          </p>
        </section>

        {/* News Section */}
        <section id="news" className="mb-16">
          <NewsSection trendingNews={initialNews} allNews={allTrendingNews} />
        </section>

        {/* Articles Section */}
        {articles.length > 0 && (
          <section id="articles" className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-4xl font-bold text-gray-900">Latest Articles</h2>
            </div>
            <LoadMoreArticles initialArticles={articles.slice(0, 3)} />
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

