'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';

interface ContentRendererProps {
  content: string;
  isHtml?: boolean;
  className?: string;
}

export default function ContentRenderer({ content, isHtml, className = '' }: ContentRendererProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!content) return null;

  // If content is HTML, sanitize and render it
  if (isHtml && isClient) {
    const sanitized = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'div', 'span'],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id'],
      ALLOW_DATA_ATTR: false,
    });

    return (
      <div
        className={`prose prose-lg max-w-none ${className}`}
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    );
  }

  // Check if content looks like markdown
  const isMarkdown = /^#{1,6}\s|^\*\s|^-\s|^\d+\.\s|^>\s|`|\[.*\]\(.*\)/m.test(content);

  if (isMarkdown) {
    return (
      <div className={`prose prose-lg max-w-none ${className}`}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
    );
  }

  // Plain text - render with line breaks
  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      {content.split('\n\n').map((paragraph, index) => (
        paragraph.trim() && (
          <p key={index} className="mb-4 leading-relaxed">
            {paragraph}
          </p>
        )
      ))}
    </div>
  );
}

