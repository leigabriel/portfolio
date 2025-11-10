import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="container mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-16 sm:pb-24">
      <div className="max-w-3xl">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 sm:mb-10 leading-tight">
        👋 Hi there!
        </h1>
        
        <p className="text-base sm:text-lg text-gray-300 mb-1 leading-relaxed">
          My name is <span className="text-white font-semibold">Lei Gabriel</span> and I'm a{' '}
          <span className="text-white font-semibold">Graphic Designer</span> with a passion for{' '}
          <span className="text-white font-semibold">Affinity</span>,{' '}
          <span className="text-white font-semibold">UI/UX</span>,{' '}
          <span className="text-white font-semibold">Design Systems</span> and{' '}
          <span className="text-white font-semibold">Web Development.</span> 
        </p>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-8 sm:mt-10">
          <Link
            to="/about"
            className="w-full sm:w-auto px-6 py-3 bg-white text-[#212631] text-sm font-medium hover:bg-gray-200 transition-colors text-center"
          >
            read more
          </Link>
          <Link
            to="/projects"
            className="w-full sm:w-auto px-6 py-3 border border-gray-600 text-white text-sm font-medium hover:border-gray-400 hover:bg-gray-800 transition-colors text-center"
          >
            view projects
          </Link>
        </div>
      </div>
    </section>
  );
}