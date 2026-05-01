import React from 'react';
import { BarChart3, Linkedin, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#263646] text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="text-[#E4B34C] w-5 h-5" aria-hidden="true" />
              </div>
              <span className="font-bold text-xl tracking-tight">APV Business Solutions</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Empowering businesses through custom software, intelligent automation, and data-driven insights.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-[#94A378] transition-colors">Home</Link></li>
              <li><Link to="/services" className="hover:text-[#94A378] transition-colors">Services</Link></li>
              <li><Link to="/portfolio" className="hover:text-[#94A378] transition-colors">Portfolio</Link></li>
              <li><Link to="/about" className="hover:text-[#94A378] transition-colors">About Us</Link></li>
              <li><Link to="/#contact" className="hover:text-[#94A378] transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-white mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/services" className="hover:text-[#94A378] transition-colors">Custom Development</Link></li>
              <li><Link to="/services" className="hover:text-[#94A378] transition-colors">Process Automation</Link></li>
              <li><Link to="/services" className="hover:text-[#94A378] transition-colors">Business Intelligence</Link></li>
              <li><Link to="/services" className="hover:text-[#94A378] transition-colors">Consulting</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} APV Business Solutions LLC. All rights reserved.
          </p>

          <div className="flex gap-4">
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="APV Business Solutions on LinkedIn"
              className="text-gray-400 hover:text-[#E4B34C] transition-colors"
            >
              <Linkedin size={20} aria-hidden="true" />
            </a>
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="APV Business Solutions on Twitter"
              className="text-gray-400 hover:text-[#E4B34C] transition-colors"
            >
              <Twitter size={20} aria-hidden="true" />
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="APV Business Solutions on Instagram"
              className="text-gray-400 hover:text-[#E4B34C] transition-colors"
            >
              <Instagram size={20} aria-hidden="true" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
