import { Link, useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  
  const socialLinks = [
    { name: 'Facebook', icon: 'https://cdn.simpleicons.org/facebook/1877F2', url: 'https://facebook.com/yourusername' },
    { name: 'Instagram', icon: 'https://cdn.simpleicons.org/instagram/E4405F', url: 'https://instagram.com/yourusername' },
    { name: 'TikTok', icon: 'https://cdn.simpleicons.org/tiktok/000000', url: 'https://tiktok.com/@yourusername' },
    { name: 'Pinterest', icon: 'https://cdn.simpleicons.org/pinterest/E60023', url: 'https://pinterest.com/yourusername' },
    { name: 'GitHub', icon: 'https://cdn.simpleicons.org/github/181717', url: 'https://github.com/leigabriel' }
  ];
  
  return (
    <footer className="border-t border-gray-800 mt-20">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Navigation Links */}
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
              to="/services" 
              className={`transition-colors ${
                isActive('/services') ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              SERVICES
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
          
          {/* Social Media Icons */}
          <div className="flex items-center space-x-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
                aria-label={social.name}
              >
                <div className="w-8 h-8 flex items-center justify-center bg-gray-800/50 border border-gray-700 rounded-full hover:border-gray-500 hover:bg-gray-700/50 transition-all">
                  <img 
                    src={social.icon} 
                    alt={social.name}
                    className="w-4 h-4 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `<span class="text-xs text-gray-400">${social.name[0]}</span>`;
                    }}
                  />
                </div>
              </a>
            ))}
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0 text-xs sm:text-sm border-t border-gray-800 pt-6">
          <div className="flex items-center space-x-2">
            <span className="text-white font-medium">Lei Gabriel</span>
            <span className="text-gray-500">/</span>
            <span className="text-gray-400">Portfolio</span>
          </div>
          
          <div className="text-gray-400 text-center md:text-right">
            <p className="text-xs">
              © {new Date().getFullYear()} Lei Gabriel. All rights reserved.
            </p>
          </div>
          
          <Link 
            to="/contact" 
            className="inline-block px-6 py-2 border border-gray-600 text-white text-xs sm:text-sm hover:border-gray-400 hover:bg-gray-800 transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </footer>
  );
}
