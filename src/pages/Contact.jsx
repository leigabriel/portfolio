import Header from '../components/Header';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';

export default function Contact() {
  const socialLinks = [
    { 
      name: 'Facebook', 
      icon: 'https://cdn.simpleicons.org/facebook/1877F2', 
      url: 'https://facebook.com/malibiranlei',
      color: '#1877F2'
    },
    { 
      name: 'Instagram', 
      icon: 'https://cdn.simpleicons.org/instagram/E4405F', 
      url: 'https://instagram.com/leigxbriel',
      color: '#E4405F'
    },
    { 
      name: 'TikTok', 
      icon: 'https://cdn.simpleicons.org/tiktok/000000', 
      url: 'https://tiktok.com/@leigxbriel',
      color: '#000000'
    },
    { 
      name: 'Pinterest', 
      icon: 'https://cdn.simpleicons.org/pinterest/E60023', 
      url: 'https://pinterest.com/leigxbriel',
      color: '#E60023'
    },
    { 
      name: 'GitHub', 
      icon: 'https://cdn.simpleicons.org/github/181717', 
      url: 'https://github.com/leigabriel',
      color: '#181717'
    }
  ];

  return (
    <div className="min-h-screen bg-[#212631] text-white">
      <Header />
      
      <main className="pt-20 sm:pt-24">
        {/* Social Media Section */}
        <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-4">
              Connect With Me
            </h2>
            <p className="text-gray-400 text-center mb-8">
              Follow me on social media for updates and more
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-12">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center justify-center p-6 bg-gray-800/30 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105"
                >
                  <div className="w-12 h-12 mb-3 flex items-center justify-center">
                    <img 
                      src={social.icon} 
                      alt={social.name}
                      className="w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `<div class="text-3xl">${social.name[0]}</div>`;
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 group-hover:text-white transition-colors">
                    {social.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <ContactForm />
      </main>
      
      <Footer />
    </div>
  );
}
