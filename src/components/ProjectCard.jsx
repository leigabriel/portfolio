export default function ProjectCard({ date, author, title, excerpt, image, status, featured = false, onClick }) {
  return (
    <article 
      className={`group cursor-pointer ${featured ? 'mb-8 sm:mb-12' : ''}`}
      onClick={onClick}
    >
      <div className="relative overflow-hidden bg-gray-800 mb-4">
        <img 
          src={image} 
          alt={title}
          className="w-full h-48 sm:h-56 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300 border-2 border-gray-600"
        />
      </div>
      
      <div className="flex items-center flex-wrap gap-2 sm:gap-3 text-xs text-gray-400 mb-3">
        <span>{date}</span>
        <span>/</span>
        <span>{author}</span>
        <span>/</span>
        <span>Status:  <span>{status}</span></span>
        
        {featured && (
          <>
            <span>/</span>
            <span className="px-2 py-1 bg-gray-700 text-white">FEATURED</span>
          </>
        )}
      </div>
      
      <h3 className="text-xl sm:text-2xl text-white font-semibold mb-3 leading-tight hover:text-blue-400 hover:underline transition-colors">
        {title}
      </h3>
      
      <p className="text-sm sm:text-base text-gray-400 leading-relaxed mb-4">
        {excerpt}
      </p>
      
      <div className="flex items-center text-white">
        <span className="text-xl sm:text-2xl">→</span>
      </div>
    </article>
  );
}