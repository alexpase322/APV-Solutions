import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppBtn from '../components/WhatsAppBtn';
import { Target, Lightbulb, Users, Heart, ShieldCheck, Rocket, Linkedin, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      <div className="pt-20 bg-white min-h-screen">
        
        {/* HEADER HERO */}
        <div className="bg-[#263646] text-white py-24 px-4 text-center relative overflow-hidden">
          {/* Fondo decorativo abstracto */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#94A378] rounded-full mix-blend-multiply filter blur-3xl opacity-10 translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E4B34C] rounded-full mix-blend-multiply filter blur-3xl opacity-10 -translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="text-[#E4B34C] font-bold tracking-widest uppercase text-sm mb-4 block">Our Story</span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Bridging the Gap Between <br /> <span className="text-[#94A378]">Business & Technology</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              We started APV Business Solutions with a simple mission: to make enterprise-level digital transformation accessible, understandable, and profitable for businesses of all sizes.
            </p>
          </div>
        </div>

        {/* MISION & VISION */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Mission Card */}
            <div className="bg-[#F8F9FA] p-10 rounded-3xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-[#263646] rounded-xl flex items-center justify-center text-white mb-6">
                <Target size={28} />
              </div>
              <h3 className="text-2xl font-bold text-[#263646] mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To empower organizations by automating the mundane, visualizing the complex, and building the future. We believe that software shouldn't just exist; it should solve problems and drive tangible growth.
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-[#F8F9FA] p-10 rounded-3xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-[#E4B34C] rounded-xl flex items-center justify-center text-white mb-6">
                <Lightbulb size={28} />
              </div>
              <h3 className="text-2xl font-bold text-[#263646] mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To be the leading strategic partner for businesses in LATAM and the US looking to modernize their operations without losing their human touch. We envision a world where technology works for people, not the other way around.
              </p>
            </div>
          </div>
        </section>

        {/* CORE VALUES */}
        <section className="py-20 bg-[#263646] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">Our Core Values</h2>
              <p className="text-gray-400 mt-4">The principles that guide every line of code we write.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { icon: <ShieldCheck />, title: "Integrity", desc: "Transparent communication. No hidden fees, no tech jargon designed to confuse." },
                { icon: <Rocket />, title: "Innovation", desc: "We don't just follow trends; we find the best tools (AI, No-Code) to solve your specific needs." },
                { icon: <Heart />, title: "Empathy", desc: "We build for humans. User experience (UX) is at the heart of our development process." },
                { icon: <Users />, title: "Collaboration", desc: "We are not just vendors; we are an extension of your team." }
              ].map((val, idx) => (
                <div key={idx} className="text-center p-6 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="inline-flex p-4 bg-white/10 rounded-full text-[#E4B34C] mb-4">
                    {val.icon}
                  </div>
                  <h4 className="text-xl font-bold mb-2">{val.title}</h4>
                  <p className="text-sm text-gray-400">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TEAM SECTION */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#94A378] font-bold tracking-widest uppercase text-xs">The Minds Behind APV</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#263646] mt-2">Meet the Team</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Member 1 */}
            <div className="group text-center">
              <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-[#F8F9FA] shadow-xl group-hover:border-[#E4B34C] transition-all">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="CEO" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold text-[#263646]">Alex P.</h3>
              <p className="text-[#94A378] font-medium mb-3">CEO & Founder</p>
              <p className="text-gray-500 text-sm px-4 mb-4">Visionary leader with 10+ years in software architecture and business strategy.</p>
              <div className="flex justify-center gap-3">
                <Linkedin className="text-gray-400 hover:text-[#0077b5] cursor-pointer" size={20} />
                <Github className="text-gray-400 hover:text-black cursor-pointer" size={20} />
              </div>
            </div>

            {/* Member 2 */}
            <div className="group text-center">
              <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-[#F8F9FA] shadow-xl group-hover:border-[#94A378] transition-all">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="CTO" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold text-[#263646]">Sarah M.</h3>
              <p className="text-[#94A378] font-medium mb-3">Head of Automation</p>
              <p className="text-gray-500 text-sm px-4 mb-4">Expert in n8n, Zapier and Python scripting. She makes workflows flow.</p>
              <div className="flex justify-center gap-3">
                 <Linkedin className="text-gray-400 hover:text-[#0077b5] cursor-pointer" size={20} />
              </div>
            </div>

            {/* Member 3 */}
            <div className="group text-center">
              <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-[#F8F9FA] shadow-xl group-hover:border-[#263646] transition-all">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=David" alt="Design" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold text-[#263646]">David L.</h3>
              <p className="text-[#94A378] font-medium mb-3">Lead Product Designer</p>
              <p className="text-gray-500 text-sm px-4 mb-4">Turning complex data into beautiful, intuitive dashboards is his superpower.</p>
              <div className="flex justify-center gap-3">
                 <Linkedin className="text-gray-400 hover:text-[#0077b5] cursor-pointer" size={20} />
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#F8F9FA] py-20 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-[#263646] mb-6">Ready to work with us?</h2>
            <p className="text-gray-600 mb-8 text-lg">We are currently accepting new projects for the upcoming quarter.</p>
            <Link to="/" className="inline-block bg-[#263646] text-white px-10 py-4 rounded-xl font-bold hover:bg-[#94A378] transition-colors shadow-lg">
              Get in Touch
            </Link>
          </div>
        </section>

      </div>
      <Footer />
      <WhatsAppBtn />
    </>
  );
};

export default AboutPage;