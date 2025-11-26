import React from 'react';
import { Target, Users, Zap, Award, Check } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-20 bg-[#263646] text-white relative overflow-hidden">
      
      {/* Círculos decorativos de fondo (Efecto sutil) */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#94A378] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#E4B34C] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* COLUMNA IZQUIERDA: Texto e Historia */}
          <div className="w-full lg:w-1/2">
            <span className="text-[#E4B34C] font-bold tracking-wider uppercase text-xs mb-2 block">
              Who We Are
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              More Than Just Developers, <br />
              <span className="text-[#94A378]">We Are Your Strategic Partners</span>
            </h2>
            <p className="text-gray-300 mb-6 text-lg leading-relaxed">
              At APV Business Solutions, we understand that technology is not just about writing code—it's about solving real business problems. 
            </p>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Founded with a vision to bridge the gap between complex technology and business efficiency, we specialize in creating custom ecosystems where software, automation, and data work together seamlessly.
            </p>

            {/* Lista de Beneficios */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {[
                "Client-Centric Approach",
                "Scalable Architecture",
                "Data-Driven Decisions",
                "Agile Methodology"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="bg-[#94A378]/20 p-1 rounded-full text-[#94A378]">
                    <Check size={16} strokeWidth={3} />
                  </div>
                  <span className="text-sm font-medium text-gray-200">{item}</span>
                </div>
              ))}
            </div>

            <button className="bg-[#E4B34C] text-[#263646] px-8 py-3 rounded-lg font-bold hover:bg-white transition-colors duration-300">
              Meet the Team
            </button>
          </div>

          {/* COLUMNA DERECHA: Estadísticas y Tarjetas Flotantes */}
          <div className="w-full lg:w-1/2 relative">
            {/* Grid Decorativo */}
            <div className="grid grid-cols-2 gap-6">
              
              {/* Card 1 */}
              <div className="bg-[#1e2b38] p-6 rounded-2xl border border-gray-700 hover:border-[#94A378] transition-colors">
                <Target className="text-[#E4B34C] mb-4" size={32} />
                <h4 className="text-3xl font-bold mb-1">100%</h4>
                <p className="text-sm text-gray-400">Project Commitment</p>
              </div>

              {/* Card 2 (Desplazada hacia abajo) */}
              <div className="bg-[#1e2b38] p-6 rounded-2xl border border-gray-700 hover:border-[#94A378] transition-colors translate-y-8">
                <Users className="text-[#94A378] mb-4" size={32} />
                <h4 className="text-3xl font-bold mb-1">50+</h4>
                <p className="text-sm text-gray-400">Happy Clients</p>
              </div>

              {/* Card 3 */}
              <div className="bg-[#1e2b38] p-6 rounded-2xl border border-gray-700 hover:border-[#94A378] transition-colors">
                <Zap className="text-[#94A378] mb-4" size={32} />
                <h4 className="text-3xl font-bold mb-1">10x</h4>
                <p className="text-sm text-gray-400">Efficiency Boost</p>
              </div>

              {/* Card 4 (Desplazada hacia abajo) */}
              <div className="bg-[#1e2b38] p-6 rounded-2xl border border-gray-700 hover:border-[#94A378] transition-colors translate-y-8">
                <Award className="text-[#E4B34C] mb-4" size={32} />
                <h4 className="text-3xl font-bold mb-1">24/7</h4>
                <p className="text-sm text-gray-400">Support & Maintenace</p>
              </div>
            </div>
          </div>

        </div>

        {/* TECH STACK STRIP (Barra de tecnologías) */}
        <div className="mt-24 pt-8 border-t border-gray-700">
          <p className="text-center text-gray-500 text-sm mb-6 uppercase tracking-widest">Powered by modern technologies</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Como no tenemos imágenes SVG, usamos texto estilizado que queda muy elegante */}
            <span className="text-xl font-bold text-white">React</span>
            <span className="text-xl font-bold text-white">TailwindCSS</span>
            <span className="text-xl font-bold text-white">Python</span>
            <span className="text-xl font-bold text-white">Node.js</span>
            <span className="text-xl font-bold text-white">n8n</span>
            <span className="text-xl font-bold text-white">Java</span>
            <span className="text-xl font-bold text-white">Angular</span>
            <span className="text-xl font-bold text-white">Power BI</span>
            <span className="text-xl font-bold text-white">Glide</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;