import { NextRequest, NextResponse } from 'next/server';
import { getAllArticles } from '@/lib/articles';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '3');

  try {
    const articles = getAllArticles();
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedArticles = articles.slice(startIndex, endIndex);

    return NextResponse.json({
      articles: paginatedArticles,
      total: articles.length,
      page,
      limit,
      hasMore: endIndex < articles.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch articles', details: error.message },
      { status: 500 }
    );
  }
}

