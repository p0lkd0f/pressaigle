import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import NewsSection from '@/components/NewsSection';
import { getAllArticles } from '@/lib/articles';
import { fetchTrendingNews, setNewsCache } from '@/lib/news';

export default async function Home() {
  const articles = getAllArticles();
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

        {/* Articles Section */}
        <section id="articles" className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-bold text-gray-900">Latest Articles</h2>
            {articles.length > 0 && (
              <span className="text-sm text-gray-500">
                {articles.length} {articles.length === 1 ? 'article' : 'articles'}
              </span>
            )}
          </div>
          {articles.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-200">
              <div className="max-w-md mx-auto">
                <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-600 text-lg mb-2">No articles yet</p>
                <p className="text-gray-500 text-sm">Check back soon for new content!</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

