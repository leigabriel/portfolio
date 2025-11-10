export default function ContactForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted');
  };

  return (
    <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-8 sm:mb-12">
          Get in touch
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <input
                type="text"
                placeholder="Name"
                required
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                required
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors"
              />
            </div>
          </div>
          
          <div>
            <textarea
              placeholder="Message"
              rows="6"
              required
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors resize-none"
            ></textarea>
          </div>
          
          <div className="text-center">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-white text-[#212631] text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              send message
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
