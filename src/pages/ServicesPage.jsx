import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppBtn from '../components/WhatsAppBtn';
import { Code2, Workflow, BarChart3, CheckCircle2, ArrowRight, Database, Cloud, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServicesPage = () => {
  // Hacer scroll al inicio al cargar la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      <div className="pt-20 bg-white min-h-screen">
        
        {/* HEADER DE LA PÁGINA */}
        <div className="bg-[#263646] text-white py-20 px-4 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 relative z-10">Our Services</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto relative z-10">
            End-to-end digital solutions designed to scale with your business.
          </p>
        </div>

        {/* --- SERVICIO 1: SOFTWARE DEVELOPMENT --- */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2">
              <div className="w-16 h-16 bg-[#263646] rounded-2xl flex items-center justify-center text-[#E4B34C] mb-6">
                <Code2 size={32} />
              </div>
              <h2 className="text-3xl font-bold text-[#263646] mb-4">Custom Software Development</h2>
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                Off-the-shelf software rarely fits perfectly. We engineer custom web and mobile applications tailored exactly to your operational workflows. We focus on scalability, security, and performance.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-[#F8F9FA] p-4 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-[#263646] flex items-center gap-2 mb-2"><Database size={16} className="text-[#94A378]" /> Backend Robustness</h4>
                  <p className="text-sm text-gray-500">Java SpringBoot & Python architectures.</p>
                </div>
                <div className="bg-[#F8F9FA] p-4 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-[#263646] flex items-center gap-2 mb-2"><Cloud size={16} className="text-[#94A378]" /> Cloud Native</h4>
                  <p className="text-sm text-gray-500">AWS & Google Cloud integration.</p>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {['React & Tailwind Frontend', 'API Development & Integration', 'Legacy System Migration'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-600">
                    <CheckCircle2 size={18} className="text-[#94A378]" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Visual (Abstracto) */}
            <div className="w-full lg:w-1/2 bg-[#F8F9FA] rounded-3xl p-8 border border-gray-200 min-h-[400px] flex items-center justify-center relative">
               {/* Simulación de Código */}
               <div className="w-full bg-[#1e2b38] rounded-xl p-6 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="flex gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="space-y-2 font-mono text-xs">
                    <p className="text-purple-400">const <span className="text-yellow-400">APV_Solution</span> = async () ={'>'} {'{'}</p>
                    <p className="text-gray-300 pl-4">await <span className="text-blue-400">analyzeRequirements</span>();</p>
                    <p className="text-gray-300 pl-4">return <span className="text-green-400">"Success"</span>;</p>
                    <p className="text-purple-400">{'}'}</p>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* --- SERVICIO 2: AUTOMATION (Fondo Gris) --- */}
        <section className="py-20 bg-[#F8F9FA]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
              <div className="w-full lg:w-1/2">
                <div className="w-16 h-16 bg-[#94A378] rounded-2xl flex items-center justify-center text-white mb-6">
                  <Workflow size={32} />
                </div>
                <h2 className="text-3xl font-bold text-[#263646] mb-4">No-Code & Process Automation</h2>
                <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                  Stop wasting talent on repetitive tasks. We build intelligent bots and workflows that connect your apps (CRM, Email, Sheets) automatically. We use tools like n8n and Zapier to deploy solutions in days, not months.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm text-2xl font-bold text-gray-400">1</div>
                    <div>
                      <h4 className="font-bold text-[#263646]">Workflow Analysis</h4>
                      <p className="text-sm text-gray-500">We identify bottlenecks in your daily operations.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm text-2xl font-bold text-gray-400">2</div>
                    <div>
                      <h4 className="font-bold text-[#263646]">Integration</h4>
                      <p className="text-sm text-gray-500">Connecting APIs without complex coding (Twilio, HubSpot, etc).</p>
                    </div>
                  </div>
                </div>

                <Link to="/" className="text-[#94A378] font-bold flex items-center gap-2 hover:gap-4 transition-all">
                  See automation examples <ArrowRight size={18} />
                </Link>
              </div>

              {/* Visual Automation */}
              <div className="w-full lg:w-1/2 relative">
                 <div className="absolute inset-0 bg-[#94A378]/10 rounded-full blur-3xl"></div>
                 <div className="relative bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                       <span className="text-xs font-bold text-gray-400 uppercase">Workflow Active</span>
                       <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Running</span>
                    </div>
                    <div className="space-y-4">
                       <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs">F</div>
                          <span className="text-sm font-medium">New Form Entry</span>
                       </div>
                       <div className="flex justify-center"><ArrowRight className="rotate-90 text-gray-300" /></div>
                       <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white text-xs">W</div>
                          <span className="text-sm font-medium">Send WhatsApp</span>
                       </div>
                       <div className="flex justify-center"><ArrowRight className="rotate-90 text-gray-300" /></div>
                       <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-white text-xs">C</div>
                          <span className="text-sm font-medium">Update CRM</span>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- SERVICIO 3: BI & ANALYTICS --- */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2">
              <div className="w-16 h-16 bg-[#E4B34C] rounded-2xl flex items-center justify-center text-white mb-6">
                <BarChart3 size={32} />
              </div>
              <h2 className="text-3xl font-bold text-[#263646] mb-4">BI & Data Intelligence</h2>
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                Data is your most valuable asset, but only if you can understand it. We design interactive dashboards that centralize your KPIs, allowing you to make decisions based on real-time facts, not guesses.
              </p>
              
              <div className="bg-[#263646] text-white p-6 rounded-2xl mb-8">
                <h4 className="font-bold text-[#E4B34C] mb-2">Tools we use</h4>
                <div className="flex gap-4 flex-wrap">
                   <span className="bg-white/10 px-3 py-1 rounded-full text-sm">Power BI</span>
                   <span className="bg-white/10 px-3 py-1 rounded-full text-sm">Looker Studio</span>
                   <span className="bg-white/10 px-3 py-1 rounded-full text-sm">Tableau</span>
                   <span className="bg-white/10 px-3 py-1 rounded-full text-sm">Custom React Charts</span>
                </div>
              </div>
            </div>

            {/* Visual BI */}
            <div className="w-full lg:w-1/2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 shadow-lg rounded-xl border border-gray-100 col-span-2">
                     <div className="h-32 bg-gradient-to-t from-[#94A378]/50 to-transparent w-full rounded-lg flex items-end px-2 gap-2">
                        <div className="w-full bg-[#94A378] h-[40%] rounded-t"></div>
                        <div className="w-full bg-[#94A378] h-[60%] rounded-t"></div>
                        <div className="w-full bg-[#94A378] h-[30%] rounded-t"></div>
                        <div className="w-full bg-[#263646] h-[85%] rounded-t relative"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-[#263646]">+85%</span></div>
                        <div className="w-full bg-[#94A378] h-[50%] rounded-t"></div>
                     </div>
                     <p className="text-center mt-2 font-bold text-gray-500 text-sm">Revenue Growth</p>
                  </div>
                  <div className="bg-white p-4 shadow-lg rounded-xl border border-gray-100">
                     <div className="w-20 h-20 rounded-full border-4 border-[#E4B34C] mx-auto flex items-center justify-center">
                        <span className="font-bold text-[#263646]">85%</span>
                     </div>
                     <p className="text-center mt-2 text-xs text-gray-400">Efficiency</p>
                  </div>
                  <div className="bg-white p-4 shadow-lg rounded-xl border border-gray-100 flex flex-col justify-center">
                     <h4 className="text-2xl font-bold text-[#263646]">1,240</h4>
                     <p className="text-xs text-gray-400">Active Users</p>
                  </div>
                </div>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="bg-[#263646] py-16 text-center px-4">
          <h2 className="text-3xl text-white font-bold mb-6">Need a custom solution?</h2>
          <div className="flex justify-center gap-4">
            <Link to="/" className="bg-[#E4B34C] text-[#263646] px-8 py-3 rounded-lg font-bold hover:bg-white transition-colors">
              Contact Us Now
            </Link>
          </div>
        </section>

      </div>
      <Footer />
      <WhatsAppBtn />
    </>
  );
};

export default ServicesPage;