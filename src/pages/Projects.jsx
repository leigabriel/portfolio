import { useState } from 'react';
import Header from '../components/Header';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import Footer from '../components/Footer';

export default function Projects() {
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
      title: 'Your Daily Boost',
      excerpt: 'Daily reminder for you',
      description: 'Always smile, theres a good in good day.',
      image: '/img/boost.png',
      technologies: ['HTML', 'CSS', 'JS'],
      liveUrl: 'https://yourdailymotivation.netlify.app/',
      githubUrl: 'https://github.com/leigabriel/your-daily-motivation',
      featured: false,
      status: <span className="text-green-400">Completed</span>
    }
  ];

  return (
    <div className="min-h-screen bg-[#212631] text-white">
      <Header />
      
      <main className="container mx-auto max-w-7xl px-4 sm:px-6 pt-24 sm:pt-32 pb-12 sm:pb-20">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 sm:mb-8 leading-tight">
            Projects
          </h1>
          
          <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
            Here are some of the projects I've worked on. Click on any project to learn more about it.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-12 md:gap-y-16">
          {projects.map(project => (
            <ProjectCard 
              key={project.id} 
              {...project}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>
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