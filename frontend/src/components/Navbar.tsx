import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Show category destination links only when the user is on a fashion-related page
  const fashionPaths = ['/bolsos', '/calzado', '/ropa', '/accesorios', '/articulos', '/producto', '/product-info'];
  const isFashionPage = fashionPaths.some(path => location.pathname.startsWith(path));

  return (
    <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-[#FEEBE7] text-[#faa18f] font-fraunces">
      <div className="w-full px-6 md:px-12 h-20 grid grid-cols-3 items-center">

        {/* Left Column: OKAREA Logo on Desktop, Hamburger Button on Mobile */}
        <div className="flex justify-start items-center">
          {/* Desktop Logo */}
          <Link
            to="/"
            className="hidden md:flex items-center text-2xl md:text-3xl font-semibold tracking-widest text-[#faa18f] uppercase transition-opacity duration-300 hover:opacity-80 leading-none"
          >
            <div className="flex flex-col justify-center items-center text-center">
              <span>OK</span>
              <span className="-mt-1">AREA</span>
            </div>
          </Link>

          {/* Mobile Hamburger Button (Only on Fashion Pages) */}
          {isFashionPage ? (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 -ml-2 text-[#faa18f] transition-transform active:scale-95 cursor-pointer focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                // X (close) icon
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                // Hamburger menu icon
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
            </button>
          ) : (
            <Link
              to="/"
              className="md:hidden flex items-center text-xl font-semibold tracking-widest text-[#faa18f] uppercase transition-opacity duration-300 hover:opacity-80 leading-none"
            >
              OKAREA
            </Link>
          )}
        </div>

        {/* Center Column: Mobile OKAREA Logo, Desktop Centered Links */}
        <div className="flex justify-center items-center">
          {/* Mobile Logo (On Fashion Pages) */}
          {isFashionPage && (
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden text-xl font-semibold tracking-widest text-[#faa18f] uppercase transition-opacity duration-300 hover:opacity-80"
            >
              OKAREA
            </Link>
          )}

          {/* Desktop Centered Links (Only on Fashion Pages) */}
          {isFashionPage && (
            <div className="hidden md:flex justify-center space-x-6 sm:space-x-8 md:space-x-12 font-medium">
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
          )}
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
        </div>

      </div>

      {/* Mobile Dropdown Menu Drawer (Only on Fashion Pages) */}
      {isFashionPage && (
        <div
          className={`md:hidden absolute top-20 left-0 w-full bg-[#FEEBE7] border-t border-[#feebe7]/10 py-6 px-8 flex flex-col space-y-5 font-medium shadow-lg transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
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
