import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b-2 border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <span className="text-4xl font-bold group-hover:scale-110 transition-transform">🦅</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Moi l'aigle</h1>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Press & News</p>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors border-b-2 border-transparent hover:border-primary-600 pb-1"
            >
              Home
            </Link>
            <Link 
              href="/articles" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors border-b-2 border-transparent hover:border-primary-600 pb-1"
            >
              Articles
            </Link>
            <Link 
              href="/#news" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors border-b-2 border-transparent hover:border-primary-600 pb-1"
            >
              News
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

