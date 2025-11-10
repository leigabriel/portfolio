import { useState, useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';

export default function ContactForm() {
  const form = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // EmailJS configuration from environment variables
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(publicKey);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');

    emailjs
      .sendForm(serviceId, templateId, form.current)
      .then(
        (result) => {
          console.log('SUCCESS!', result.text);
          setSubmitStatus('success');
          setIsSubmitting(false);
          form.current.reset();
        },
        (error) => {
          console.log('FAILED...', error);
          console.log('Error text:', error.text);
          console.log('Error status:', error.status);
          setSubmitStatus('error');
          
          // Provide user-friendly error messages
          if (error.status === 412) {
            setErrorMessage('Email service authentication issue. Please try again later or contact me directly.');
          } else {
            setErrorMessage(error.text || 'Failed to send message. Please try again later.');
          }
          
          setIsSubmitting(false);
        }
      );
  };

  return (
    <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-8 sm:mb-12">
          Get in touch
        </h2>
        
        <form ref={form} onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Name"
                required
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors"
              />
            </div>
            <div>
              <input
                type="email"
                name="user_email"
                placeholder="Email"
                required
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors"
              />
            </div>
          </div>
          
          <div>
            <textarea
              name="message"
              placeholder="Message"
              rows="6"
              required
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors resize-none"
            ></textarea>
          </div>
          
          {submitStatus === 'success' && (
            <div className="text-green-400 text-center text-sm">
              Message sent successfully! I'll get back to you soon.
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="text-red-400 text-center text-sm">
              {errorMessage || 'Failed to send message. Please try again later.'}
            </div>
          )}
          
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 bg-white text-[#212631] text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'sending...' : 'send message'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
