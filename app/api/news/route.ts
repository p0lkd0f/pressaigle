import { NextRequest, NextResponse } from 'next/server';
import { fetchTrendingNews } from '@/lib/news';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '6');

  try {
    const news = await fetchTrendingNews();
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedNews = news.slice(startIndex, endIndex);

    return NextResponse.json({
      news: paginatedNews,
      total: news.length,
      page,
      limit,
      hasMore: endIndex < news.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch news', details: error.message },
      { status: 500 }
    );
  }
}

