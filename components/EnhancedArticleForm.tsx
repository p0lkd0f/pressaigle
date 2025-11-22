'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import dynamic from 'next/dynamic';
import { Article } from '@/lib/articles';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const articleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  category: z.string().optional(),
});

type ArticleFormData = z.infer<typeof articleSchema>;

interface EnhancedArticleFormProps {
  article?: Article | null;
  onSave: () => void;
  onCancel?: () => void;
}

export default function EnhancedArticleForm({ article, onSave, onCancel }: EnhancedArticleFormProps) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [editorMode, setEditorMode] = useState<'rich' | 'markdown' | 'html'>('rich');
  const [markdownContent, setMarkdownContent] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors }, reset, control, setValue, watch } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: article?.title || '',
      content: article?.content || '',
      imageUrl: article?.imageUrl || '',
      category: article?.category || '',
    },
  });

  const contentValue = watch('content');
  const turndownServiceRef = useRef<any>(null);

  // Initialize turndown for HTML to Markdown conversion (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined' && !turndownServiceRef.current) {
      import('turndown').then((TurndownModule) => {
        import('turndown-plugin-gfm').then((gfmModule) => {
          const TurndownService = TurndownModule.default;
          const { gfm } = gfmModule;
          
          const service = new TurndownService({
            headingStyle: 'atx',
            codeBlockStyle: 'fenced',
          });
          service.use(gfm);
          turndownServiceRef.current = service;
        });
      });
    }
  }, []);

  const getTurndownService = () => {
    return turndownServiceRef.current;
  };

  useEffect(() => {
    if (article) {
      reset({
        title: article.title,
        content: article.content,
        imageUrl: article.imageUrl || '',
        category: article.category || '',
      });
      setHtmlContent(article.content);
      // Try to convert HTML to markdown
      try {
        if (article.content && article.content.includes('<')) {
          const turndownService = getTurndownService();
          if (turndownService) {
            setMarkdownContent(turndownService.turndown(article.content));
          } else {
            setMarkdownContent(article.content);
          }
        } else {
          setMarkdownContent(article.content);
        }
      } catch (e) {
        setMarkdownContent(article.content);
      }
    } else {
      reset({
        title: '',
        content: '',
        imageUrl: '',
        category: '',
      });
      setHtmlContent('');
      setMarkdownContent('');
    }
  }, [article, reset]);

  // React Quill modules configuration
  const quillModules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'direction': 'rtl' }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['link', 'image', 'video', 'code-block'],
        ['clean']
      ],
      handlers: {
        image: imageHandler,
      }
    },
  };

  const quillRef = useRef<any>(null);

  function imageHandler() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        // Convert to base64 for embedding
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          // Find quill editor in the DOM
          const quillEditor = document.querySelector('.ql-editor') as any;
          if (quillEditor && quillEditor.__quill) {
            const quill = quillEditor.__quill;
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, 'image', base64);
            quill.setSelection(range.index + 1);
          }
          // Also add to attachments list
          setAttachments(prev => [...prev, base64]);
          // Update form value
          const currentContent = watch('content');
          const imgTag = `<img src="${base64}" alt="${file.name}" />`;
          setValue('content', currentContent + imgTag);
        };
        reader.readAsDataURL(file);
      }
    };
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          setAttachments(prev => [...prev, base64]);
          // If it's an image, add to content
          if (file.type.startsWith('image/')) {
            const currentContent = watch('content');
            const imgTag = `<img src="${base64}" alt="${file.name}" />`;
            setValue('content', currentContent + '\n' + imgTag);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleContentChange = (value: string) => {
    setValue('content', value);
    setHtmlContent(value);
    // Convert HTML to markdown for markdown view
    try {
      const turndownService = getTurndownService();
      if (turndownService) {
        setMarkdownContent(turndownService.turndown(value));
      }
    } catch (e) {
      // If conversion fails, keep markdown as is
    }
  };

  const handleMarkdownChange = (value: string) => {
    setMarkdownContent(value);
    // Convert markdown to HTML
    // Simple markdown to HTML conversion (you might want to use a proper library)
    const html = convertMarkdownToHTML(value);
    setValue('content', html);
    setHtmlContent(html);
  };

  const handleHtmlChange = (value: string) => {
    setHtmlContent(value);
    setValue('content', value);
    try {
      const turndownService = getTurndownService();
      if (turndownService) {
        setMarkdownContent(turndownService.turndown(value));
      } else {
        setMarkdownContent(value);
      }
    } catch (e) {
      setMarkdownContent(value);
    }
  };

  // Simple markdown to HTML converter (basic implementation)
  const convertMarkdownToHTML = (markdown: string): string => {
    let html = markdown
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')
      // Images
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" />')
      // Code blocks
      .replace(/```([^`]+)```/gim, '<pre><code>$1</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/gim, '<code>$1</code>')
      // Line breaks
      .replace(/\n/gim, '<br />');
    
    // Wrap paragraphs
    html = html.split('<br /><br />').map(p => p.trim() ? `<p>${p}</p>` : '').join('');
    
    return html;
  };

  const onSubmit = async (data: ArticleFormData) => {
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const url = article ? `/api/articles/${article.id}` : '/api/articles';
      const method = article ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: data.title,
          content: data.content,
          imageUrl: data.imageUrl || undefined,
          category: data.category || undefined,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        onSave();
        if (!article) {
          reset();
          setHtmlContent('');
          setMarkdownContent('');
          setAttachments([]);
        }
      } else {
        setError(result.error || 'Failed to save article');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          {...register('title')}
          type="text"
          id="title"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          placeholder="Enter article title..."
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Category and Image URL Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
            Category
          </label>
          <input
            {...register('category')}
            type="text"
            id="category"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            placeholder="e.g., Technology, News"
          />
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-semibold text-gray-700 mb-2">
            Featured Image URL
          </label>
          <input
            {...register('imageUrl')}
            type="url"
            id="imageUrl"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            placeholder="https://example.com/image.jpg"
          />
          {errors.imageUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>
          )}
        </div>
      </div>

      {/* Editor Mode Toggle */}
      <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
        <span className="text-sm font-medium text-gray-700">Editor Mode:</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setEditorMode('rich')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              editorMode === 'rich'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Rich Text
          </button>
          <button
            type="button"
            onClick={() => setEditorMode('markdown')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              editorMode === 'markdown'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Markdown
          </button>
          <button
            type="button"
            onClick={() => setEditorMode('html')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              editorMode === 'html'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            HTML
          </button>
        </div>
      </div>

      {/* Content Editor */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="content" className="block text-sm font-semibold text-gray-700">
            Content <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            📎 Attach Files
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,application/pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {editorMode === 'rich' && (
          <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <ReactQuill
                  theme="snow"
                  modules={quillModules}
                  value={field.value || ''}
                  onChange={(value) => {
                    field.onChange(value);
                    handleContentChange(value);
                  }}
                  placeholder="Start writing your article..."
                  style={{ minHeight: '400px' }}
                />
              )}
            />
          </div>
        )}

        {editorMode === 'markdown' && (
          <textarea
            value={markdownContent}
            onChange={(e) => handleMarkdownChange(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
            rows={20}
            placeholder="# Your Article Title&#10;&#10;Start writing in Markdown...&#10;&#10;## Subheading&#10;&#10;Use **bold**, *italic*, and [links](url)"
          />
        )}

        {editorMode === 'html' && (
          <textarea
            value={htmlContent}
            onChange={(e) => handleHtmlChange(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
            rows={20}
            placeholder="<h1>Your Article Title</h1>&#10;&#10;<p>Start writing in HTML...</p>"
          />
        )}

        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}

        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Attachments ({attachments.length}):</p>
            <div className="flex flex-wrap gap-2">
              {attachments.map((att, idx) => (
                <div key={idx} className="relative">
                  {att.startsWith('data:image/') ? (
                    <img src={att} alt={`Attachment ${idx + 1}`} className="h-20 w-20 object-cover rounded border" />
                  ) : (
                    <div className="h-20 w-20 bg-gray-200 rounded border flex items-center justify-center">
                      <span className="text-xs">File {idx + 1}</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : (
            article ? 'Update Article' : 'Publish Article'
          )}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

