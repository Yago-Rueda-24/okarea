import { useState } from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  transparent?: boolean;
}

export default function Navbar({ transparent = true }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (transparent) {
    return (
      <nav className="fixed top-0 inset-x-0 z-50 transition-all duration-300 bg-transparent text-[#FEEBE7]">
        
        {/* Desktop Layout: left-aligned links, right-aligned social icons */}
        <div className="hidden md:flex w-full px-6 md:px-12 h-20 justify-between items-center font-bold">
          {/* Left Side: Navigation Links */}
          <div className="flex items-center space-x-6 sm:space-x-8 md:space-x-12">
            <Link 
              to="/bolsos" 
              className="relative py-2 text-lg md:text-xl uppercase tracking-widest transition-all duration-300 hover:opacity-80 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-current hover:after:w-full after:transition-all after:duration-300"
            >
              Bolsos
            </Link>
            <Link 
              to="/calzado" 
              className="relative py-2 text-lg md:text-xl uppercase tracking-widest transition-all duration-300 hover:opacity-80 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-current hover:after:w-full after:transition-all after:duration-300"
            >
              Calzado
            </Link>
            <Link 
              to="/ropa" 
              className="relative py-2 text-lg md:text-xl uppercase tracking-widest transition-all duration-300 hover:opacity-80 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-current hover:after:w-full after:transition-all after:duration-300"
            >
              Ropa
            </Link>
            <Link 
              to="/accesorios" 
              className="relative py-2 text-lg md:text-xl uppercase tracking-widest transition-all duration-300 hover:opacity-80 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-current hover:after:w-full after:transition-all after:duration-300"
            >
              Accesorios
            </Link>
          </div>

          {/* Right Side: Social Icon Links */}
          <div className="flex justify-end items-center space-x-3 md:space-x-4">
            <a 
              href="https://www.instagram.com/inspo_area/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 transition-transform duration-300 hover:scale-110 text-current hover:opacity-80"
              aria-label="Instagram"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="22" 
                height="22" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-5 h-5 md:w-6 md:h-6"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a 
              href="https://vinted.es" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 transition-transform duration-300 hover:scale-110 text-current hover:opacity-80"
              aria-label="Vinted"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="22" 
                height="22" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-5 h-5 md:w-6 md:h-6"
              >
                <path d="M11.028 6c0 7.695 -.292 11.728 0 12c2.046 -5 4.246 -12.642 5.252 -14.099c.343 -.497 .768 -.93 1.257 -1.277c.603 -.39 1.292 -.76 1.463 -.575c-.07 2.319 -4.023 15.822 -4.209 16.314a6.135 6.135 0 0 1 -3.465 3.386c-3.213 .78 -3.429 -.446 -3.836 -1.134c-.95 -2.103 -1.682 -14.26 -1.445 -15.615c.05 -.523 .143 -1.851 2.491 -2c2.359 -.354 2.547 1.404 2.492 3z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Mobile Layout: 2-column bar with hamburger on the left, social icons on the right */}
        <div className="md:hidden w-full px-6 h-20 flex justify-between items-center">
          {/* Left Side: Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 -ml-2 text-current transition-transform active:scale-95 cursor-pointer focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
 
          {/* Right Side: Social Icons */}
          <div className="flex justify-end items-center space-x-3">
            <a 
              href="https://www.instagram.com/inspo_area/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 transition-transform duration-300 hover:scale-110 text-current hover:opacity-80"
              aria-label="Instagram"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="22" 
                height="22" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-5 h-5"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a 
              href="https://vinted.es" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 transition-transform duration-300 hover:scale-110 text-current hover:opacity-80"
              aria-label="Vinted"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="22" 
                height="22" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-5 h-5"
              >
                <path d="M11.028 6c0 7.695 -.292 11.728 0 12c2.046 -5 4.246 -12.642 5.252 -14.099c.343 -.497 .768 -.93 1.257 -1.277c.603 -.39 1.292 -.76 1.463 -.575c-.07 2.319 -4.023 15.822 -4.209 16.314a6.135 6.135 0 0 1 -3.465 3.386c-3.213 .78 -3.429 -.446 -3.836 -1.134c-.95 -2.103 -1.682 -14.26 -1.445 -15.615c.05 -.523 .143 -1.851 2.491 -2c2.359 -.354 2.547 1.404 2.492 3z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Mobile Dropdown Drawer for transparent state */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-[#faa18f]/95 border-t border-[#FEEBE7]/15 py-6 px-8 flex flex-col space-y-5 font-bold shadow-lg transition-all duration-300 animate-slideDown">
            <Link 
              to="/bolsos" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xl uppercase tracking-widest text-[#FEEBE7] hover:opacity-80 py-1 transition-all"
            >
              Bolsos
            </Link>
            <Link 
              to="/calzado" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xl uppercase tracking-widest text-[#FEEBE7] hover:opacity-80 py-1 transition-all"
            >
              Calzado
            </Link>
            <Link 
              to="/ropa" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xl uppercase tracking-widest text-[#FEEBE7] hover:opacity-80 py-1 transition-all"
            >
              Ropa
            </Link>
            <Link 
              to="/accesorios" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xl uppercase tracking-widest text-[#FEEBE7] hover:opacity-80 py-1 transition-all"
            >
              Accesorios
            </Link>
          </div>
        )}

      </nav>
    );
  }

  // Non-transparent (transparent === false)
  return (
    <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-[#FEEBE7] text-[#faa18f]">
      <div className="w-full px-6 md:px-12 h-20 grid grid-cols-3 items-center">
        
        {/* Left Column: Hamburger Button on Mobile, OKAREA Logo on Desktop */}
        <div className="flex justify-start items-center">
          {/* Desktop Logo */}
          <Link 
            to="/" 
            className="hidden md:flex items-center text-2xl md:text-3xl font-extrabold tracking-widest text-[#faa18f] uppercase transition-opacity duration-300 hover:opacity-80 leading-none"
          >
            <div className="flex flex-col justify-center items-center text-center">
              <span>OK</span>
              <span className="-mt-1">AREA</span>
            </div>
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 -ml-2 text-[#faa18f] transition-transform active:scale-95 cursor-pointer focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              // X (close) icon
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              // Hamburger menu icon
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>

        {/* Center Column: Mobile OKAREA Logo, Desktop Centered Links */}
        <div className="flex justify-center items-center">
          {/* Mobile Logo */}
          <Link 
            to="/" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden text-xl font-extrabold tracking-widest text-[#faa18f] uppercase transition-opacity duration-300 hover:opacity-80"
          >
            OKAREA
          </Link>

          

          {/* Desktop Links */}
          <div className="hidden md:flex justify-center space-x-6 sm:space-x-8 md:space-x-12 font-black">
            <Link 
              to="/bolsos" 
              className="relative py-2 text-lg md:text-xl uppercase tracking-widest transition-all duration-300 hover:opacity-80 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-current hover:after:w-full after:transition-all after:duration-300"
            >
              Bolsos
            </Link>
            <Link 
              to="/calzado" 
              className="relative py-2 text-lg md:text-xl uppercase tracking-widest transition-all duration-300 hover:opacity-80 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-current hover:after:w-full after:transition-all after:duration-300"
            >
              Calzado
            </Link>
            <Link 
              to="/ropa" 
              className="relative py-2 text-lg md:text-xl uppercase tracking-widest transition-all duration-300 hover:opacity-80 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-current hover:after:w-full after:transition-all after:duration-300"
            >
              Ropa
            </Link>
            <Link 
              to="/accesorios" 
              className="relative py-2 text-lg md:text-xl uppercase tracking-widest transition-all duration-300 hover:opacity-80 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-current hover:after:w-full after:transition-all after:duration-300"
            >
              Accesorios
            </Link>
          </div>
        </div>

        {/* Right Column: Social Icon Links */}
        <div className="flex justify-end items-center space-x-3 md:space-x-4">
          <a 
            href="https://www.instagram.com/inspo_area/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-2 transition-transform duration-300 hover:scale-110 text-current hover:opacity-80"
            aria-label="Instagram"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="22" 
              height="22" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-5 h-5 md:w-6 md:h-6"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <a 
            href="https://vinted.es" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-2 transition-transform duration-300 hover:scale-110 text-current hover:opacity-80"
            aria-label="Vinted"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="22" 
              height="22" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-5 h-5 md:w-6 md:h-6"
            >
              <path d="M11.028 6c0 7.695 -.292 11.728 0 12c2.046 -5 4.246 -12.642 5.252 -14.099c.343 -.497 .768 -.93 1.257 -1.277c.603 -.39 1.292 -.76 1.463 -.575c-.07 2.319 -4.023 15.822 -4.209 16.314a6.135 6.135 0 0 1 -3.465 3.386c-3.213 .78 -3.429 -.446 -3.836 -1.134c-.95 -2.103 -1.682 -14.26 -1.445 -15.615c.05 -.523 .143 -1.851 2.491 -2c2.359 -.354 2.547 1.404 2.492 3z" />
            </svg>
          </a>
        </div>

      </div>

      {/* Mobile Dropdown Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-[#FEEBE7] border-t border-[#feebe7]/10 py-6 px-8 flex flex-col space-y-5 font-bold shadow-lg transition-all duration-300 animate-slideDown">
          <Link 
            to="/bolsos" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-xl uppercase tracking-widest text-[#faa18f] hover:opacity-80 py-1 transition-all"
          >
            Bolsos
          </Link>
          <Link 
            to="/calzado" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-xl uppercase tracking-widest text-[#faa18f] hover:opacity-80 py-1 transition-all"
          >
            Calzado
          </Link>
          <Link 
            to="/ropa" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-xl uppercase tracking-widest text-[#faa18f] hover:opacity-80 py-1 transition-all"
          >
            Ropa
          </Link>
          <Link 
            to="/accesorios" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-xl uppercase tracking-widest text-[#faa18f] hover:opacity-80 py-1 transition-all"
          >
            Accesorios
          </Link>
        </div>
      )}
    </nav>
  );
}
