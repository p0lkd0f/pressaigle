import { NextRequest, NextResponse } from 'next/server';
import { fetchTrendingNews } from '@/lib/news';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '6');

  try {
    // Fetch articles from NewsAPI with pagination
    // NewsAPI supports pagination via the 'page' parameter
    // Fetch the requested page directly from NewsAPI
    const news = await fetchTrendingNews(page, limit);
    
    // Check if we got articles
    if (news && news.length > 0) {
      // Calculate if there are more pages
      // NewsAPI free tier typically returns up to 100 results total
      // If we got the full limit, there might be more
      const hasMore = news.length >= limit;
      
      return NextResponse.json({
        news: news,
        total: news.length,
        page,
        limit,
        hasMore: hasMore,
      });
    } else {
      // No more articles
      return NextResponse.json({
        news: [],
        total: 0,
        page,
        limit,
        hasMore: false,
      });
    }
  } catch (error: any) {
    console.error('News API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news', details: error.message },
      { status: 500 }
    );
  }
}

