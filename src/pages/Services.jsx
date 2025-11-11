import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Services() {
  const services = [
    {
      title: 'Graphic Design',
      description: 'Creating visual concepts to communicate ideas that inspire and inform.',
      icon: 'https://media.licdn.com/dms/image/v2/D4E0BAQFklLEE6EKzsA/company-logo_200_200/B4EZo2FJptJgAI-/0/1761843911640/affinity_canva_logo?e=2147483647&v=beta&t=z4E-AA77FfzhjeF-Wro1_oitkSVqmyebEtsITE0iJCU'
    },
    {
      title: 'UI Design',
      description: 'Designing intuitive and engaging user interfaces for web applications.',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg'
    },
    {
      title: 'Frontend Development',
      description: 'Building responsive and interactive web applications with modern technologies.',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg'
    }
  ];

  const technologies = [
    { name: 'Affinity', icon: 'https://media.licdn.com/dms/image/v2/D4E0BAQFklLEE6EKzsA/company-logo_200_200/B4EZo2FJptJgAI-/0/1761843911640/affinity_canva_logo?e=2147483647&v=beta&t=z4E-AA77FfzhjeF-Wro1_oitkSVqmyebEtsITE0iJCU' },
    { name: 'VS Code', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg' },
    { name: 'HTML', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg' },
    { name: 'CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg' },
    { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' },
    { name: 'React.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' }
  ];

  return (
    <div className="min-h-screen bg-[#212631] text-white">
      <Header />
      
      <main className="pt-20 sm:pt-24">
        <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-4">
              Services
            </h1>
            <p className="text-gray-400 text-center mb-12 sm:mb-16">
              What I can do for you
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {services.map((service, index) => (
                <div 
                  key={index}
                  className="bg-gray-800/30 border border-gray-700 p-8 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105"
                >
                  <div className="w-16 h-16 mb-4 flex items-center justify-center">
                    <img 
                      src={service.icon} 
                      alt={service.title}
                      className="w-full h-full object-contain filter brightness-110"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>

            {/* Technologies */}
            <div className="bg-gray-800/20 border border-gray-700 p-8 sm:p-12">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">
                Technologies I Use
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
                {technologies.map((tech, index) => (
                  <div 
                    key={index}
                    className="flex flex-col items-center justify-center p-4 bg-gray-800/50 border border-gray-700 hover:border-gray-600 transition-colors group"
                  >
                    <div className="w-12 h-12 mb-2 flex items-center justify-center">
                      <img 
                        src={tech.icon} 
                        alt={tech.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform filter brightness-110"
                      />
                    </div>
                    <span className="text-xs text-gray-300 text-center">{tech.name}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-400 text-center italic">
                🌱 Currently learning and improving my skills in all these technologies
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
