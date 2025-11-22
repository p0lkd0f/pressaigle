import axios from 'axios';
import crypto from 'crypto';

export interface NewsArticle {
  id?: string;
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source: string;
  content?: string;
  htmlContent?: string;
  isHtml?: boolean;
}

// Generate a stable ID from news article data
function generateNewsId(title: string, source: string, publishedAt: string): string {
  const hash = crypto
    .createHash('md5')
    .update(`${title}-${source}-${publishedAt}`)
    .digest('hex')
    .substring(0, 12);
  return `news-${hash}`;
}

// Get NewsAPI key from environment variables
const NEWS_API_KEY = process.env.NEWS_API_KEY || process.env.NEXT_PUBLIC_NEWS_API_KEY;

// Fetch trending news articles
export async function fetchTrendingNews(): Promise<NewsArticle[]> {
  try {
    if (!NEWS_API_KEY || NEWS_API_KEY === 'demo') {
      console.warn('News API key not configured. Using fallback data.');
      const fallback = getFallbackNews();
      return fallback;
    }

    // Try to get more content using the 'everything' endpoint with popular topics
    // This sometimes provides more detailed content
    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        country: 'us',
        language: 'en',
        pageSize: 6,
        apiKey: NEWS_API_KEY,
      },
    });
    
    if (response.data.articles && response.data.articles.length > 0) {
      // First, map articles to get basic structure
      const articles = response.data.articles
        .filter((article: any) => article.title && article.description)
        .slice(0, 6)
        .map((article: any) => {
          const publishedAt = article.publishedAt || new Date().toISOString();
          const title = article.title || 'News Article';
          const source = article.source?.name || 'News Source';
          
          // Get initial content from NewsAPI
          let content = '';
          
          // Use NewsAPI's content field if available and substantial
          if (article.content && article.content.length > 100) {
            // Remove truncation markers
            content = article.content
              .replace(/\[.*?\]/g, '') // Remove [123 chars] markers
              .replace(/…/g, '')
              .replace(/\.\.\./g, '')
              .trim();
            
            // If content is still substantial, use it
            if (content.length > 200) {
              // Prepend description as intro if different
              if (article.description && content !== article.description && !content.includes(article.description)) {
                content = `${article.description}\n\n${content}`;
              }
            } else {
              // Content too short, will fetch from URL
              content = article.description || '';
            }
          } else {
            // No content field or too short, use description
            content = article.description || '';
          }
          
          // Check if content contains HTML tags
          const isHtml = /<[a-z][\s\S]*>/i.test(content);
          
          return {
            id: generateNewsId(title, source, publishedAt),
            title,
            description: article.description || 'Read the full article for more details.',
            url: article.url || '#',
            urlToImage: article.urlToImage,
            publishedAt,
            source,
            content: content,
            htmlContent: isHtml ? content : undefined,
            isHtml: isHtml,
          };
        });

      // Now fetch full content for ALL articles in parallel
      const articlesWithFullContent = await Promise.all(
        articles.map(async (article: NewsArticle) => {
          // If content is short or just description, fetch full content
          if (article.url && article.url !== '#' && (!article.content || article.content.length < 1000 || article.content === article.description)) {
            try {
              const fullContent = await fetchFullArticleContent(article.url);
              if (fullContent && fullContent.length > 200) {
                // Prepend description if we have full content
                if (article.description && !fullContent.includes(article.description)) {
                  article.content = `${article.description}\n\n${fullContent}`;
                } else {
                  article.content = fullContent;
                }
                article.isHtml = false; // Full content is cleaned text, not HTML
              }
            } catch (error) {
              // If fetching fails, keep the original content
              console.debug(`Failed to fetch full content for ${article.title}`);
            }
          }
          return article;
        })
      );

      return articlesWithFullContent;
    }
  } catch (error: any) {
    console.error('Error fetching trending news:', error.response?.data || error.message);
  }
  
  return getFallbackNews();
}

// Fetch news by category
export async function fetchNewsByCategory(category: string = 'technology', pageSize: number = 3): Promise<NewsArticle[]> {
  try {
    if (!NEWS_API_KEY || NEWS_API_KEY === 'demo') {
      console.warn('News API key not configured. Using fallback data.');
      return getFallbackNewsByCategory(category);
    }

    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        category: category,
        country: 'us',
        language: 'en',
        pageSize: pageSize,
        apiKey: NEWS_API_KEY,
      },
    });
    
    if (response.data.articles && response.data.articles.length > 0) {
      // First, map articles to get basic structure
      const articles = response.data.articles
        .filter((article: any) => article.title && article.description)
        .slice(0, pageSize)
        .map((article: any) => {
          const publishedAt = article.publishedAt || new Date().toISOString();
          const title = article.title || 'News Article';
          const source = article.source?.name || 'News Source';
          
          // Get initial content from NewsAPI
          let content = '';
          
          // Use NewsAPI's content field if available and substantial
          if (article.content && article.content.length > 100) {
            // Remove truncation markers
            content = article.content
              .replace(/\[.*?\]/g, '') // Remove [123 chars] markers
              .replace(/…/g, '')
              .replace(/\.\.\./g, '')
              .trim();
            
            // If content is still substantial, use it
            if (content.length > 200) {
              // Prepend description as intro if different
              if (article.description && content !== article.description && !content.includes(article.description)) {
                content = `${article.description}\n\n${content}`;
              }
            } else {
              // Content too short, will fetch from URL
              content = article.description || '';
            }
          } else {
            // No content field or too short, use description
            content = article.description || '';
          }
          
          // Check if content contains HTML tags
          const isHtml = /<[a-z][\s\S]*>/i.test(content);
          
          return {
            id: generateNewsId(title, source, publishedAt),
            title,
            description: article.description || 'Read the full article for more details.',
            url: article.url || '#',
            urlToImage: article.urlToImage,
            publishedAt,
            source,
            content: content,
            htmlContent: isHtml ? content : undefined,
            isHtml: isHtml,
          };
        });

      // Now fetch full content for ALL articles in parallel
      const articlesWithFullContent = await Promise.all(
        articles.map(async (article: NewsArticle) => {
          // If content is short or just description, fetch full content
          if (article.url && article.url !== '#' && (!article.content || article.content.length < 1000 || article.content === article.description)) {
            try {
              const fullContent = await fetchFullArticleContent(article.url);
              if (fullContent && fullContent.length > 200) {
                // Prepend description if we have full content
                if (article.description && !fullContent.includes(article.description)) {
                  article.content = `${article.description}\n\n${fullContent}`;
                } else {
                  article.content = fullContent;
                }
                article.isHtml = false; // Full content is cleaned text, not HTML
              }
            } catch (error) {
              // If fetching fails, keep the original content
              console.debug(`Failed to fetch full content for ${article.title}`);
            }
          }
          return article;
        })
      );

      return articlesWithFullContent;
    }
  } catch (error: any) {
    console.error(`Error fetching ${category} news:`, error.response?.data || error.message);
  }
  
  return getFallbackNewsByCategory(category);
}

// Fallback news data
function getFallbackNews(): NewsArticle[] {
  const fallback1 = {
    title: 'Technology Continues to Shape Our Future',
    description: 'Innovation in technology is transforming industries and creating new opportunities for growth and development across the globe.',
    url: '#',
    publishedAt: new Date().toISOString(),
    source: 'Tech News',
    content: 'Innovation in technology is transforming industries and creating new opportunities for growth and development across the globe. From artificial intelligence to renewable energy, technological advancements are reshaping how we live, work, and interact with the world around us.',
  };
  
  const fallback2 = {
    title: 'Latest Developments in Science and Research',
    description: 'Scientists and researchers are making groundbreaking discoveries that promise to improve our understanding of the world.',
    url: '#',
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    source: 'Science Daily',
    content: 'Scientists and researchers are making groundbreaking discoveries that promise to improve our understanding of the world. These developments span multiple fields including medicine, physics, and environmental science, offering new solutions to global challenges.',
  };
  
  const fallback3 = {
    title: 'Business and Economy Updates',
    description: 'Stay informed about the latest trends in business, finance, and the global economy.',
    url: '#',
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    source: 'Business News',
    content: 'Stay informed about the latest trends in business, finance, and the global economy. Market analysts continue to monitor economic indicators and provide insights into emerging opportunities and challenges in the business world.',
  };

  return [
    { id: generateNewsId(fallback1.title, fallback1.source, fallback1.publishedAt), ...fallback1 },
    { id: generateNewsId(fallback2.title, fallback2.source, fallback2.publishedAt), ...fallback2 },
    { id: generateNewsId(fallback3.title, fallback3.source, fallback3.publishedAt), ...fallback3 },
  ];
}

function getFallbackNewsByCategory(category: string): NewsArticle[] {
  const techNews = {
    title: 'AI and Machine Learning Breakthroughs',
    description: 'Artificial intelligence continues to evolve with new applications and capabilities being developed every day.',
    url: '#',
    publishedAt: new Date().toISOString(),
    source: 'Tech News',
    content: 'Artificial intelligence continues to evolve with new applications and capabilities being developed every day. Machine learning algorithms are becoming more sophisticated, enabling breakthroughs in healthcare, autonomous vehicles, and natural language processing.',
  };
  
  const businessNews = {
    title: 'Market Trends and Economic Insights',
    description: 'Understanding the latest trends in business and finance to make informed decisions.',
    url: '#',
    publishedAt: new Date().toISOString(),
    source: 'Business News',
    content: 'Understanding the latest trends in business and finance to make informed decisions. Economic analysts are closely watching market indicators and providing valuable insights for investors and business leaders.',
  };
  
  const scienceNews = {
    title: 'Scientific Discoveries and Research',
    description: 'Latest findings from the world of science that are shaping our understanding of the universe.',
    url: '#',
    publishedAt: new Date().toISOString(),
    source: 'Science Daily',
    content: 'Latest findings from the world of science that are shaping our understanding of the universe. Researchers across various disciplines are making significant contributions to our knowledge base.',
  };

  const fallbackData: Record<string, NewsArticle[]> = {
    technology: [{ id: generateNewsId(techNews.title, techNews.source, techNews.publishedAt), ...techNews }],
    business: [{ id: generateNewsId(businessNews.title, businessNews.source, businessNews.publishedAt), ...businessNews }],
    science: [{ id: generateNewsId(scienceNews.title, scienceNews.source, scienceNews.publishedAt), ...scienceNews }],
  };

  return fallbackData[category] || getFallbackNews();
}

// Store news articles in memory for detail page access
let newsCache: NewsArticle[] = [];

export function setNewsCache(news: NewsArticle[]) {
  newsCache = news;
}

export function getNewsById(id: string): NewsArticle | null {
  return newsCache.find(n => n.id === id) || null;
}

// Fetch full article content from URL using our API route
export async function fetchFullArticleContent(url: string): Promise<string | null> {
  try {
    if (!url || url === '#') return null;
    
    // In server-side Next.js, we can call the API route directly
    // For server components, we'll extract content directly here
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.google.com/',
      },
      timeout: 20000,
      maxRedirects: 5,
      validateStatus: (status) => status < 500,
    });

    if (!response.data) return null;

    const html = response.data.toString();

    // Extract article content using improved parsing
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

    if (!articleContent) {
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      articleContent = bodyMatch ? bodyMatch[1] : html;
    }

    // Clean the content
    let cleaned = articleContent
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
      .replace(/<div[^>]*class="[^"]*(share|social|subscribe|newsletter|ad|advertisement|promo)[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
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

    if (cleaned.length > 30000) {
      cleaned = cleaned.substring(0, 30000) + '...';
    }

    if (cleaned.length < 200) {
      return null;
    }

    return cleaned;
  } catch (error: any) {
    console.debug('Could not fetch full article content:', error.message);
    return null;
  }
}

// Legacy functions for backward compatibility
export async function fetchBitcoinNews(): Promise<NewsArticle[]> {
  return fetchNewsByCategory('technology', 1);
}

export async function fetchTechNews(): Promise<NewsArticle[]> {
  return fetchNewsByCategory('technology', 1);
}

