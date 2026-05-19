import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="fixed w-full z-50 bg-white/70 backdrop-blur-md border-b border-gray-200/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:scale-105 transition-transform">
                Okarea
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-text-muted hover:text-primary font-medium transition-colors">Home</Link>
              <Link to="/about" className="text-text-muted hover:text-primary font-medium transition-colors">About</Link>
              <Link to="/services" className="text-text-muted hover:text-primary font-medium transition-colors">Services</Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block">
                <button className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-full font-medium transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5">
                  Get Started
                </button>
              </div>

              {/* Hamburger button for mobile */}
              <button 
                className="md:hidden p-2 rounded-md text-text-muted hover:text-text-main hover:bg-surface transition-colors focus:outline-none"
                onClick={() => setIsOpen(true)}
                aria-label="Open menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Sidebar Panel */}
      <div 
        className={`fixed inset-y-0 right-0 w-64 bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Menu
          </span>
          <button 
            className="p-2 text-text-muted hover:text-text-main hover:bg-surface rounded-full transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex flex-col p-4 space-y-4">
          <Link to="/" onClick={() => setIsOpen(false)} className="text-text-muted hover:text-primary font-medium transition-colors p-2 hover:bg-primary/10 rounded-lg">Home</Link>
          <Link to="/about" onClick={() => setIsOpen(false)} className="text-text-muted hover:text-primary font-medium transition-colors p-2 hover:bg-primary/10 rounded-lg">About</Link>
          <Link to="/services" onClick={() => setIsOpen(false)} className="text-text-muted hover:text-primary font-medium transition-colors p-2 hover:bg-primary/10 rounded-lg">Services</Link>
        </div>

        <div className="mt-auto p-4 border-t border-gray-100">
          <button className="w-full bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-full font-medium transition-all shadow-md">
            Get Started
          </button>
        </div>
      </div>
    </>
  );
}
