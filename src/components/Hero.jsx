import React from 'react';
import { ArrowRight, BarChart2, Code2, Zap } from 'lucide-react';

const Hero = () => {
  return (
    <div id="home" className="relative bg-[#F8F9FA] overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* TEXTO DE LA IZQUIERDA */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#94A378]/10 text-[#94A378] text-sm font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#94A378] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#94A378]"></span>
              </span>
              Innovation for Growth
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#263646] leading-tight mb-6">
              Transform Your Business with <span className="text-[#94A378]">Intelligent Solutions</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              We specialize in <span className="font-semibold text-[#263646]">Custom Software</span>, <span className="font-semibold text-[#263646]">No-Code Automation</span>, and <span className="font-semibold text-[#263646]">Business Intelligence</span> dashboards designed to elevate your efficiency.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a 
                href="#contact" 
                className="px-8 py-4 bg-[#263646] text-white rounded-lg font-semibold hover:bg-[#1a2530] transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Start Your Project <ArrowRight size={20} />
              </a>
              <a 
                href="#services" 
                className="px-8 py-4 bg-white text-[#263646] border border-gray-200 rounded-lg font-semibold hover:border-[#94A378] hover:text-[#94A378] transition-all flex items-center justify-center"
              >
                View Our Services
              </a>
            </div>
          </div>

          {/* ILUSTRACIÓN / VISUAL DE LA DERECHA */}
          <div className="w-full lg:w-1/2 relative">
            {/* Círculo decorativo detrás */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#E4B34C]/10 rounded-full blur-3xl -z-10"></div>
            
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
              {/* Header de la "App" simulada */}
              <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-xs text-gray-400 font-mono">APV_Dashboard_v2.0</div>
              </div>

              {/* Contenido Grid Simulado */}
              <div className="grid grid-cols-2 gap-4">
                {/* Card 1: Growth */}
                <div className="col-span-2 bg-[#F8F9FA] p-4 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-[#263646] rounded-lg text-white">
                      <BarChart2 size={20} />
                    </div>
                    <span className="text-[#94A378] font-bold text-sm">+24.5%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full mt-2">
                    <div className="h-2 bg-[#263646] rounded-full w-3/4"></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Monthly Revenue Growth</p>
                </div>

                {/* Card 2: Automation */}
                <div className="bg-[#F8F9FA] p-4 rounded-xl border border-gray-100">
                  <div className="p-2 bg-[#94A378] w-fit rounded-lg text-white mb-3">
                    <Zap size={20} />
                  </div>
                  <h3 className="font-bold text-[#263646]">Automation</h3>
                  <p className="text-xs text-gray-500">20hrs saved/week</p>
                </div>

                {/* Card 3: Code */}
                <div className="bg-[#F8F9FA] p-4 rounded-xl border border-gray-100">
                  <div className="p-2 bg-[#E4B34C] w-fit rounded-lg text-white mb-3">
                    <Code2 size={20} />
                  </div>
                  <h3 className="font-bold text-[#263646]">Custom Dev</h3>
                  <p className="text-xs text-gray-500">React & Python</p>
                </div>
              </div>
            </div>
            
            {/* Tarjeta flotante decorativa */}
            <div className="absolute -bottom-6 -left-6 bg-[#263646] text-white p-4 rounded-xl shadow-lg hidden md:block">
              <div className="flex items-center gap-3">
                <div className="text-[#E4B34C]">★★★★★</div>
                <span className="text-sm font-medium">Trusted Partner</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;