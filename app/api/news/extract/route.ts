import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || url === '#') {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Fetch the article HTML
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': 'https://www.google.com/',
      },
      timeout: 15000,
      maxRedirects: 5,
      validateStatus: (status) => status < 500,
    });

    if (!response.data) {
      return NextResponse.json(
        { error: 'Failed to fetch article' },
        { status: 500 }
      );
    }

    const html = response.data.toString();

    // Extract article content using improved parsing
    // Try to find main content in common article containers
    const contentSelectors = [
      /<article[^>]*>([\s\S]*?)<\/article>/i,
      /<main[^>]*>([\s\S]*?)<\/main>/i,
      /<div[^>]*class="[^"]*article[^"]*body[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
      /<div[^>]*class="[^"]*post-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
      /<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
      /<div[^>]*class="[^"]*story-body[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
      /<div[^>]*id="[^"]*article[^"]*body[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
      /<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    ];

    let articleContent = '';
    for (const selector of contentSelectors) {
      const match = html.match(selector);
      if (match && match[1]) {
        articleContent = match[1];
        break;
      }
    }

    // If no specific article container found, use the whole body but clean it
    if (!articleContent) {
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      articleContent = bodyMatch ? bodyMatch[1] : html;
    }

    // Clean the content
    let cleaned = articleContent
      // Remove scripts, styles, and other unwanted elements
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
      .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '')
      .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '')
      .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
      .replace(/<form[^>]*>[\s\S]*?<\/form>/gi, '')
      .replace(/<button[^>]*>[\s\S]*?<\/button>/gi, '')
      // Remove social sharing buttons and related content
      .replace(/<div[^>]*class="[^"]*(share|social|subscribe|newsletter|ad|advertisement|promo)[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
      // Convert HTML to readable text
      .replace(/<h[1-6][^>]*>/gi, '\n\n### ')
      .replace(/<\/h[1-6]>/gi, '\n\n')
      .replace(/<p[^>]*>/gi, '\n\n')
      .replace(/<\/p>/gi, '')
      .replace(/<br[^>]*>/gi, '\n')
      .replace(/<div[^>]*>/gi, '\n')
      .replace(/<\/div>/gi, '')
      .replace(/<li[^>]*>/gi, '\n• ')
      .replace(/<\/li>/gi, '')
      .replace(/<strong[^>]*>/gi, '**')
      .replace(/<\/strong>/gi, '**')
      .replace(/<em[^>]*>/gi, '*')
      .replace(/<\/em>/gi, '*')
      .replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '$2 ($1)')
      .replace(/<img[^>]*alt="([^"]*)"[^>]*>/gi, '\n[Image: $1]\n')
      .replace(/<[^>]+>/g, ' ')
      // Clean up whitespace
      .replace(/\n\s*\n\s*\n+/g, '\n\n')
      .replace(/[ \t]+/g, ' ')
      .trim();

    // Remove common unwanted patterns
    cleaned = cleaned
      .replace(/Enable JavaScript and cookies to continue/gi, '')
      .replace(/Please enable JavaScript/gi, '')
      .replace(/Cookie settings/gi, '')
      .replace(/Accept cookies/gi, '')
      .replace(/Subscribe to.*?newsletter/gi, '')
      .replace(/Sign up for.*?newsletter/gi, '');

    // Limit length but keep it substantial
    if (cleaned.length > 30000) {
      cleaned = cleaned.substring(0, 30000) + '...';
    }

    // Only return if we have substantial content
    if (cleaned.length < 200) {
      return NextResponse.json(
        { error: 'Could not extract sufficient content' },
        { status: 404 }
      );
    }

    return NextResponse.json({ content: cleaned });
  } catch (error: any) {
    console.error('Error extracting article content:', error.message);
    return NextResponse.json(
      { error: 'Failed to extract article content' },
      { status: 500 }
    );
  }
}

