import EagleLogo from './EagleLogo';

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center">
              <div className="mr-3">
                <EagleLogo size={40} color="#e8e2f0" />
              </div>
              Moi l'aigle
            </h3>
            <p className="text-primary-200 leading-relaxed mb-4">
              Your trusted source for curated articles and breaking news. 
              Stay informed with quality content that matters.
            </p>
            <p className="text-sm text-primary-300">
              Independent Press & News Platform
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3 text-primary-200">
              <li>
                <a href="/" className="hover:text-primary-50 transition-colors inline-flex items-center">
                  Home
                </a>
              </li>
              <li>
                <a href="/#articles" className="hover:text-primary-50 transition-colors inline-flex items-center">
                  Articles
                </a>
              </li>
              <li>
                <a href="/#news" className="hover:text-primary-50 transition-colors inline-flex items-center">
                  News
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">About</h4>
            <p className="text-primary-200 leading-relaxed">
              A modern blog platform where you can read articles and stay updated 
              with the latest news from around the world.
            </p>
          </div>
        </div>
        
        <div className="border-t border-primary-700 pt-8 text-center">
          <p className="text-primary-200">
            &copy; {new Date().getFullYear()} Moi l'aigle. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

