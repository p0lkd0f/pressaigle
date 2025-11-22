export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  category?: string;
}

// In-memory article store (replace with database in production)
let articles: Article[] = [];

export function getAllArticles(): Article[] {
  return articles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getArticleById(id: string): Article | null {
  return articles.find(a => a.id === id) || null;
}

export function createArticle(
  title: string,
  content: string,
  authorId: string,
  imageUrl?: string,
  category?: string
): Article {
  const article: Article = {
    id: Date.now().toString(),
    title,
    content,
    excerpt: content.substring(0, 200) + '...',
    authorId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    imageUrl,
    category,
  };
  articles.push(article);
  return article;
}

export function updateArticle(
  id: string,
  title: string,
  content: string,
  authorId: string,
  imageUrl?: string,
  category?: string
): Article | null {
  const article = articles.find(a => a.id === id);
  if (!article || article.authorId !== authorId) {
    return null;
  }
  article.title = title;
  article.content = content;
  article.excerpt = content.substring(0, 200) + '...';
  article.updatedAt = new Date().toISOString();
  if (imageUrl !== undefined) article.imageUrl = imageUrl;
  if (category !== undefined) article.category = category;
  return article;
}

export function deleteArticle(id: string, authorId: string): boolean {
  const index = articles.findIndex(a => a.id === id);
  if (index === -1 || articles[index].authorId !== authorId) {
    return false;
  }
  articles.splice(index, 1);
  return true;
}

export function getArticlesByAuthor(authorId: string): Article[] {
  return articles.filter(a => a.authorId === authorId);
}

