import React, { useState, useEffect } from 'react';
import { Menu, X, BarChart3, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Detectar scroll para añadir sombra
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Función para cerrar el menú móvil al hacer clic
  const closeMenu = () => setIsOpen(false);

  // Helper para saber si un link está activo
  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled || location.pathname !== '/' ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* --- LOGO --- */}
          <Link to="/" onClick={closeMenu} className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
            <div className="relative w-10 h-10 bg-[#263646] rounded-tr-xl rounded-bl-xl flex items-center justify-center transition-transform group-hover:scale-105">
              <BarChart3 className="text-[#E4B34C] w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-[#263646] leading-none">APV</span>
              <span className="text-[0.65rem] tracking-widest text-[#94A378] font-bold">BUSINESS SOLUTIONS</span>
            </div>
          </Link>

          {/* --- DESKTOP MENU --- */}
          <div className="hidden md:flex space-x-8 items-center">
            
            <Link 
              to="/" 
              className={`font-medium transition-colors ${isActive('/') ? 'text-[#94A378] font-bold' : 'text-[#4B5563] hover:text-[#94A378]'}`}
            >
              Home
            </Link>

            <Link 
              to="/services" 
              className={`font-medium transition-colors ${isActive('/services') ? 'text-[#94A378] font-bold' : 'text-[#4B5563] hover:text-[#94A378]'}`}
            >
              Services
            </Link>

            <Link 
              to="/about" 
              className={`font-medium transition-colors ${isActive('/about') ? 'text-[#94A378] font-bold' : 'text-[#4B5563] hover:text-[#94A378]'}`}
            >
              About Us
            </Link>

            {/* Botón CTA - Usa ancla con lógica */}
            <a 
              href={location.pathname === '/' ? '#contact' : '/#contact'} 
              className="bg-[#263646] text-white px-5 py-2 rounded-lg font-medium hover:bg-[#94A378] transition-colors flex items-center gap-2 text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Get Started <ChevronRight size={16} />
            </a>
          </div>

          {/* --- MOBILE TOGGLE BUTTON --- */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-[#263646] p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU DROPDOWN --- */}
      {/* Fondo oscuro semitransparente para el overlay */}
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={closeMenu}></div>
          <div className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl z-50 animate-in slide-in-from-top-2">
             <div className="px-4 py-6 space-y-3 flex flex-col">
                
                <Link 
                  to="/" 
                  onClick={closeMenu} 
                  className={`block px-4 py-3 rounded-lg text-base font-medium ${isActive('/') ? 'bg-[#94A378]/10 text-[#94A378]' : 'text-[#4B5563] hover:bg-gray-50'}`}
                >
                  Home
                </Link>

                <Link 
                  to="/services" 
                  onClick={closeMenu} 
                  className={`block px-4 py-3 rounded-lg text-base font-medium ${isActive('/services') ? 'bg-[#94A378]/10 text-[#94A378]' : 'text-[#4B5563] hover:bg-gray-50'}`}
                >
                  Services
                </Link>

                <Link 
                  to="/about" 
                  onClick={closeMenu} 
                  className={`block px-4 py-3 rounded-lg text-base font-medium ${isActive('/about') ? 'bg-[#94A378]/10 text-[#94A378]' : 'text-[#4B5563] hover:bg-gray-50'}`}
                >
                  About Us
                </Link>

                <div className="border-t border-gray-100 my-2 pt-2">
                  <a 
                    href={location.pathname === '/' ? '#contact' : '/#contact'}
                    onClick={closeMenu}
                    className="w-full flex justify-center items-center gap-2 bg-[#263646] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#94A378] transition-colors"
                  >
                    Get Started <ChevronRight size={16} />
                  </a>
                </div>
             </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;