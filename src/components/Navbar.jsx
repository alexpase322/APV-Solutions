import React, { useState, useEffect } from 'react';
import { Menu, X, BarChart3, ChevronRight } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* --- COMPONENTE LOGO --- */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
            <div className="relative w-10 h-10 bg-[#263646] rounded-tr-xl rounded-bl-xl flex items-center justify-center transition-transform group-hover:scale-105">
              <BarChart3 className="text-[#E4B34C] w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-[#263646] leading-none">APV</span>
              <span className="text-[0.65rem] tracking-widest text-[#94A378] font-bold">BUSINESS SOLUTIONS</span>
            </div>
          </div>

          {/* --- DESKTOP MENU --- */}
          <div className="hidden md:flex space-x-8 items-center">
            <NavLink href="#services">Services</NavLink>
            <NavLink href="#about">About Us</NavLink>
            <NavLink href="#contact">Contact</NavLink>
            <button className="bg-[#263646] text-white px-5 py-2 rounded-lg font-medium hover:bg-[#94A378] transition-colors flex items-center gap-2 text-sm shadow-lg hover:shadow-xl">
              Get Started <ChevronRight size={16} />
            </button>
          </div>

          {/* --- MOBILE TOGGLE --- */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-[#263646] hover:text-[#94A378] transition-colors p-2"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU OVERLAY --- */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl animate-in slide-in-from-top-5">
          <div className="px-4 py-6 space-y-3 flex flex-col">
            <MobileNavLink href="#services" onClick={() => setIsOpen(false)}>Services</MobileNavLink>
            <MobileNavLink href="#solutions" onClick={() => setIsOpen(false)}>Solutions</MobileNavLink>
            <MobileNavLink href="#about" onClick={() => setIsOpen(false)}>About Us</MobileNavLink>
            <button className="w-full mt-4 bg-[#263646] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#94A378] transition-colors flex justify-center items-center gap-2">
              Get Started <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};


const NavLink = ({ href, children }) => (
  <a 
    href={href} 
    className="text-[#4B5563] hover:text-[#94A378] font-medium text-sm transition-colors relative group"
  >
    {children}
    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#94A378] transition-all group-hover:w-full"></span>
  </a>
);

const MobileNavLink = ({ href, onClick, children }) => (
  <a 
    href={href} 
    onClick={onClick}
    className="block px-4 py-3 text-base font-medium text-[#4B5563] hover:text-[#263646] hover:bg-[#F8F9FA] rounded-lg transition-colors"
  >
    {children}
  </a>
);

export default Navbar;