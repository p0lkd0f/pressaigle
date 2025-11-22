import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContentRenderer from '@/components/ContentRenderer';
import { getArticleById } from '@/lib/articles';
import { format } from 'date-fns';
import Link from 'next/link';

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = getArticleById(id);

  if (!article) {
    notFound();
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
          {article.imageUrl && (
            <div className="w-full h-96 bg-gray-200 overflow-hidden">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-8 md:p-12">
            {article.category && (
              <span className="inline-block bg-primary-100 text-primary-700 text-xs font-bold px-3 py-1 rounded-full mb-6 uppercase tracking-wide">
                {article.category}
              </span>
            )}
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>
            
            <div className="flex items-center text-gray-600 mb-8 pb-8 border-b border-gray-200">
              <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">{format(new Date(article.createdAt), 'MMMM dd, yyyy')}</span>
              {article.updatedAt !== article.createdAt && (
                <>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-sm text-gray-500">
                    Updated: {format(new Date(article.updatedAt), 'MMMM dd, yyyy')}
                  </span>
                </>
              )}
            </div>
            
            <ContentRenderer
              content={article.content}
              className="text-gray-700"
            />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}

