import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GraphicDesignModal from '../components/GraphicDesignModal';

export default function GraphicDesign() {
  const [selectedDesign, setSelectedDesign] = useState(null);

  const graphicDesigns = [
    {
      id: 1,
      title: 'Brand Identity Design',
      image: '/img/design1.png',
      category: 'Branding',
      description: 'A complete brand identity package including logo, color palette, and brand guidelines for a modern tech startup.',
      tools: ['Affinity Designer', 'Canva'],
      date: 'October 2024'
    },
    {
      id: 2,
      title: 'Social Media Graphics',
      image: '/img/design2.png',
      category: 'Social Media',
      description: 'Eye-catching social media templates designed for Instagram, Facebook, and Twitter campaigns.',
      tools: ['Canva', 'Photoshop'],
      date: 'September 2024'
    },
    {
      id: 3,
      title: 'Web UI Design',
      image: '/img/design3.png',
      category: 'UI/UX',
      description: 'Modern and clean UI design for a web application with focus on user experience and accessibility.',
      tools: ['Figma', 'Affinity Designer'],
      date: 'August 2024'
    },
    {
      id: 4,
      title: 'Logo Design',
      image: '/img/design4.png',
      category: 'Branding',
      description: 'Minimalist logo design with multiple variations for different use cases and platforms.',
      tools: ['Affinity Designer'],
      date: 'July 2024'
    },
    {
      id: 5,
      title: 'Marketing Materials',
      image: '/img/design5.png',
      category: 'Print',
      description: 'Professional marketing materials including brochures, flyers, and business cards.',
      tools: ['Canva', 'Affinity Publisher'],
      date: 'June 2024'
    },
    {
      id: 6,
      title: 'Illustration',
      image: '/img/design6.png',
      category: 'Digital Art',
      description: 'Custom digital illustrations for web and print with vibrant colors and modern style.',
      tools: ['Affinity Designer', 'Procreate'],
      date: 'May 2024'
    }
  ];

  return (
    <div className="min-h-screen bg-[#212631] text-white">
      <Header />
      
      <main className="pt-20 sm:pt-24">
        <section className="container mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-20">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-4">
              Graphic Design Showcase
            </h1>
            <p className="text-gray-400 text-center mb-12 sm:mb-16">
              A collection of my design work
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {graphicDesigns.map((design) => (
                <div 
                  key={design.id}
                  onClick={() => setSelectedDesign(design)}
                  className="group relative overflow-hidden bg-gray-800/30 border border-gray-700 hover:border-gray-600 transition-all duration-300 cursor-pointer"
                >
                  <div className="aspect-w-16 aspect-h-9 bg-gray-800">
                    <img 
                      src={design.image} 
                      alt={design.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23333" width="400" height="300"/%3E%3Ctext fill="%23666" font-family="sans-serif" font-size="20" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EDesign Preview%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">{design.category}</span>
                    <h3 className="text-lg font-bold text-white mt-2 group-hover:text-gray-300 transition-colors">
                      {design.title}
                    </h3>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">View Details</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />

      {/* Graphic Design Modal */}
      {selectedDesign && (
        <GraphicDesignModal 
          design={selectedDesign} 
          onClose={() => setSelectedDesign(null)} 
        />
      )}
    </div>
  );
}
