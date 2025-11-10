import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#212631]/40 backdrop-blur-sm">
      <nav className="container mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-xs sm:text-lg hover:opacity-80 transition-opacity">
          <span className="text-white">Lei Gabriel</span>
        </Link>
        
        <div className="flex items-center space-x-4 sm:space-x-8 text-xs sm:text-lg">
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
        </div>
      </nav>
    </header>
  );
}