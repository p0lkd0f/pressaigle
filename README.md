# Moi l'aigle - Blog Platform

A modern, full-featured blog platform built with Next.js 14, TypeScript, and Tailwind CSS. A clean and elegant articles + news blogspot-like web application.

## Features

- 🔐 **Authentication System**: Secure login and registration with JWT tokens
- ✍️ **Article Management**: Create, read, update, and delete articles
- 📰 **News Integration**: Automatic fetching of trending news from NewsAPI
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS
- 🦅 **Custom Branding**: "Moi l'aigle" theme with elegant header and footer
- 📱 **Responsive Design**: Works beautifully on all devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: JWT with bcryptjs
- **Forms**: React Hook Form with Zod validation
- **Date Formatting**: date-fns

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Copy `.env.example` to `.env` (if it exists) or create a new `.env` file
   - Add your NewsAPI key:
   ```
   NEWS_API_KEY=your_news_api_key_here
   ```
   - Get a free API key from [NewsAPI](https://newsapi.org/) (free tier available)

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Authentication

1. Register a new account at `/login` (click "Register")
2. Login with your credentials
3. Access the admin dashboard at `/admin` to manage articles

### Creating Articles

1. After logging in, go to the Admin Dashboard
2. Fill in the article form:
   - Title (required)
   - Content (required, minimum 10 characters)
   - Category (optional)
   - Image URL (optional)
3. Click "Create Article" to publish

### Editing Articles

1. In the Admin Dashboard, find the article you want to edit
2. Click "Edit" on the article card
3. Modify the form fields
4. Click "Update Article" to save changes

### Deleting Articles

1. In the Admin Dashboard, click "Delete" on any article
2. Confirm the deletion

## News Integration

The blog automatically fetches trending news articles from NewsAPI. The news section displays:
- **Featured News**: A prominent featured article with image
- **Trending Articles**: Grid of latest news articles from various sources

### Setting up NewsAPI

1. Visit [NewsAPI](https://newsapi.org/) and sign up for a free account
2. Get your API key from the dashboard
3. Add it to your `.env` file as `NEWS_API_KEY`
4. The app will automatically use the API key to fetch real news

**Note**: If no API key is provided, the app will use fallback news data to ensure it always works.

## Project Structure

```
├── app/
│   ├── api/          # API routes (auth, articles)
│   ├── admin/        # Admin dashboard
│   ├── articles/     # Article detail pages
│   ├── login/        # Authentication page
│   └── page.tsx      # Home page
├── components/       # React components
├── lib/              # Utility functions (auth, articles, news)
└── public/           # Static assets
```

## Security Notes

⚠️ **Important**: This is a demo application. For production use:

1. Replace in-memory storage with a proper database (PostgreSQL, MongoDB, etc.)
2. Use environment variables for JWT_SECRET
3. Implement proper session management
4. Add rate limiting and CSRF protection
5. Use HTTPS in production
6. Implement proper error handling and logging

## License

MIT

# pressaigle
