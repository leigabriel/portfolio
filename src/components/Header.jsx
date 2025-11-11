import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [isWorksDropdownOpen, setIsWorksDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#212631]/30 backdrop-blur-sm">
      <nav className="container mx-auto max-w-7xl px-4 sm:px-6 py-4 sm:py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-base sm:text-lg font-bold hover:opacity-80 transition-opacity">
          <span className="text-white">Lei Gabriel</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors ${
              isActive('/') 
                ? 'text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            HOME
          </Link>
          
          {/* Works Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsWorksDropdownOpen(!isWorksDropdownOpen)}
              className={`text-sm font-medium transition-colors flex items-center space-x-1 ${
                isActive('/projects') || isActive('/graphic-design')
                  ? 'text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>WORKS</span>
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${isWorksDropdownOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isWorksDropdownOpen && (
              <div className="absolute top-full mt-2 bg-[#2a3142] border border-gray-700/50 rounded-lg shadow-xl min-w-[180px] overflow-hidden">
                <Link 
                  to="/projects" 
                  onClick={() => setIsWorksDropdownOpen(false)}
                  className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors border-b border-gray-700/50"
                >
                  Projects
                </Link>
                <Link 
                  to="/graphic-design"
                  onClick={() => setIsWorksDropdownOpen(false)}
                  className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Graphic Design
                </Link>
              </div>
            )}
          </div>
          
          {/* About Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsAboutDropdownOpen(!isAboutDropdownOpen)}
              className={`text-sm font-medium transition-colors flex items-center space-x-1 ${
                isActive('/about') || isActive('/services') || isActive('/contact')
                  ? 'text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>ABOUT</span>
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${isAboutDropdownOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isAboutDropdownOpen && (
              <div className="absolute top-full mt-2 bg-[#2a3142] border border-gray-700/50 rounded-lg shadow-xl min-w-[180px] overflow-hidden">
                <Link 
                  to="/about" 
                  onClick={() => setIsAboutDropdownOpen(false)}
                  className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors border-b border-gray-700/50"
                >
                  About Me
                </Link>
                <Link 
                  to="/services"
                  onClick={() => setIsAboutDropdownOpen(false)}
                  className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors border-b border-gray-700/50"
                >
                  Services
                </Link>
                <Link 
                  to="/contact"
                  onClick={() => setIsAboutDropdownOpen(false)}
                  className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Contact
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-white hover:bg-white/5 rounded-md transition-colors focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#2a3142]/95 backdrop-blur-md border-t border-gray-700/50">
          <div className="container mx-auto max-w-7xl px-4 py-4 space-y-1">
            <Link 
              to="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              HOME
            </Link>
            
            <div className="pt-2 pb-1">
              <div className="text-xs text-gray-500 uppercase tracking-wider px-4 py-2">Works</div>
              <Link 
                to="/projects" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 pl-8 rounded-md text-sm text-gray-400 hover:text-white transition-colors"
              >
                Projects
              </Link>
              <Link 
                to="/graphic-design"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 pl-8 rounded-md text-sm text-gray-400 hover:text-white transition-colors"
              >
                Graphic Design
              </Link>
            </div>
            
            <div className="pt-2 pb-1">
              <div className="text-xs text-gray-500 uppercase tracking-wider px-4 py-2">About</div>
              <Link 
                to="/about" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 pl-8 rounded-md text-sm text-gray-400 hover:text-white transition-colors"
              >
                About Me
              </Link>
              <Link 
                to="/services"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 pl-8 rounded-md text-sm text-gray-400 hover:text-white transition-colors"
              >
                Services
              </Link>
              <Link 
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 pl-8 rounded-md text-sm text-gray-400 hover:text-white transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}