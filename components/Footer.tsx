export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center">
              <span className="mr-2 text-3xl">🦅</span>
              Moi l'aigle
            </h3>
            <p className="text-gray-400 leading-relaxed mb-4">
              Your trusted source for curated articles and breaking news. 
              Stay informed with quality content that matters.
            </p>
            <p className="text-sm text-gray-500">
              Independent Press & News Platform
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a href="/" className="hover:text-white transition-colors inline-flex items-center">
                  Home
                </a>
              </li>
              <li>
                <a href="/#articles" className="hover:text-white transition-colors inline-flex items-center">
                  Articles
                </a>
              </li>
              <li>
                <a href="/#news" className="hover:text-white transition-colors inline-flex items-center">
                  News
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">About</h4>
            <p className="text-gray-400 leading-relaxed">
              A modern blog platform where you can read articles and stay updated 
              with the latest news from around the world.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} Moi l'aigle. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

