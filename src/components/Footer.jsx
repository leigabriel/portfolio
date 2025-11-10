import { Link, useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  
  return (
    <footer className="border-t border-gray-800 mt-20">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0 mb-8 sm:mb-12">
          <nav className="flex items-center space-x-4 sm:space-x-8 text-xs sm:text-sm">
          <Link 
            to="/" 
            className={`transition-colors ${
              isActive('/') ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            HOME
          </Link>
          <Link 
            to="/projects" 
            className={`transition-colors ${
              isActive('/projects') ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            PROJECTS
          </Link>
          <Link 
            to="/about" 
            className={`transition-colors ${
              isActive('/about') ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            ABOUT
          </Link>
          </nav>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0 text-xs sm:text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-white">Lei Gabriel</span>
            <span className="text-gray-500">/</span>
            <span className="text-gray-400">Portfolio</span>
          </div>
          
          <div className="text-gray-400">
            <p className="mb-2"></p>
            <p className="text-xs">
              <a href="#" className="hover:text-white transition-colors">
                © copyright reserved @2025
              </a>
            </p>
          </div>
        </div>
        
        <div className="mt-6 sm:mt-8 text-right">
          <Link to="/about" className="w-full sm:w-auto px-4 py-2 border border-gray-600 text-white text-xs sm:text-sm hover:border-gray-400 hover:bg-gray-800 transition-colors">
            get in touch
          </Link>
        </div>
      </div>
    </footer>
  );
}
