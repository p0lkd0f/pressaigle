import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-white border-b-2 border-primary-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 group-hover:scale-110 transition-transform">
              <Image
                src="https://dynamic.design.com/asset/logo/f68772ce-9b9b-4105-bf43-73a47ca59d93/logo-search-grid-2x"
                alt="Moi l'aigle Logo"
                fill
                className="object-contain"
                priority
                unoptimized
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary-800 tracking-tight">Moi l'aigle</h1>
              <p className="text-xs text-primary-500 uppercase tracking-wider">Press & News</p>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-primary-700 hover:text-primary-600 font-medium transition-colors border-b-2 border-transparent hover:border-primary-500 pb-1"
            >
              Home
            </Link>
            <Link 
              href="/articles" 
              className="text-primary-700 hover:text-primary-600 font-medium transition-colors border-b-2 border-transparent hover:border-primary-500 pb-1"
            >
              Articles
            </Link>
            <Link 
              href="/#news" 
              className="text-primary-700 hover:text-primary-600 font-medium transition-colors border-b-2 border-transparent hover:border-primary-500 pb-1"
            >
              News
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

