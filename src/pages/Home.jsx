import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import Footer from '../components/Footer';

export default function Home() {
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      id: 1,
      date: 'October 18, 2025',
      author: 'Lei Gabriel',
      title: 'Dental Care System',
      excerpt: 'A comprehensive dental care management system designed to streamline patient records, appointment scheduling, and treatment plans for dental clinics.',
      description: 'This full-featured dental management system helps clinics manage their day-to-day operations efficiently. Built with modern web technologies, it includes patient management, appointment scheduling, treatment tracking, and billing features.',
      image: '/img/dentalcare.png',
      technologies: ['LavaLust', 'Mysql', 'Tailwind CSS'],
      liveUrl: 'https://dentalcare-health.onrender.com',
      githubUrl: 'https://github.com/leigabriel/dental-booking-appointment-system',
      featured: true,
      status: <span className="text-green-400">Completed</span>
    },
    {
      id: 2,
      date: 'October 18, 2025',
      author: 'Lei Gabriel',
      title: 'Dental Care System',
      excerpt: 'A comprehensive dental care management system designed to streamline patient records, appointment scheduling, and treatment plans for dental clinics.',
      description: 'This full-featured dental management system helps clinics manage their day-to-day operations efficiently. Built with modern web technologies, it includes patient management, appointment scheduling, treatment tracking, and billing features.',
      image: '/img/dentalcare.png',
      technologies: ['LavaLust', 'Mysql', 'Tailwind CSS'],
      liveUrl: 'https://dentalcare-health.onrender.com',
      githubUrl: 'https://github.com/leigabriel/dental-booking-appointment-system',
      featured: true,
      status: <span className="text-green-400">Completed</span>
    },
    {
      id: 3,
      date: 'October 18, 2025',
      author: 'Lei Gabriel',
      title: 'Your Daily Boost',
      excerpt: 'Daily reminder for you',
      description: 'Always smile, theres a good in good day.',
      image: '/img/boost.png',
      technologies: ['LavaLust', 'Mysql', 'Tailwind CSS'],
      liveUrl: 'https://yourdailymotivation.netlify.app/',
      githubUrl: 'https://github.com/leigabriel/dental-booking-appointment-system',
      featured: false,
      status: <span className="text-green-400">Completed</span>
    }
  ];

  const featuredProject = projects[0];
  const regularProjects = projects.slice(1);

  return (
    <div className="min-h-screen bg-[#212631] text-white">
      <Header />
      
      <main>
        <Hero />
        
        <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="max-w-2xl">
            <h1 className="text-lg sm:text-2xl md:text-2xl lg:text-2xl font-bold text-white mb-8 sm:mb-10 leading-tight">
              Featured Project
           </h1>
            <ProjectCard 
              {...featuredProject} 
              onClick={() => setSelectedProject(featuredProject)}
            />
          </div>
          
          <div className="mt-12 sm:mt-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Latest Projects</h2>
            <div className="h-1 w-16 sm:w-20 bg-white mb-8 sm:mb-12"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-12 md:gap-y-16">
              {regularProjects.map(project => (
                <ProjectCard 
                  key={project.id} 
                  {...project}
                  onClick={() => setSelectedProject(project)}
                />
              ))}
            </div>
            
            <div className="mt-8 sm:mt-12 text-center">
              <Link to="/projects">
                <button className="w-full sm:w-auto px-6 py-3 border border-gray-600 text-white text-sm font-medium hover:border-gray-400 hover:bg-gray-800 transition-colors">
                  view all projects
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </div>
  );
}
