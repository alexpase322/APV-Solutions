import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

const Contact = () => {
  const [result, setResult] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.append("access_key", "89a663b2-90c1-4785-a363-9b66025dcaba");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    setResult(data.success ? "Success!" : "Error");
  };
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* INFORMACIÓN DE CONTACTO (Izquierda) */}
          <div className="w-full lg:w-1/3">
            <span className="text-[#94A378] font-bold tracking-wider uppercase text-xs">Get in Touch</span>
            <h2 className="text-3xl font-bold text-[#263646] mt-2 mb-6">
              Ready to Start Your Digital Transformation?
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Whether you need a custom dashboard, a complex automation, or a full software solution, we are here to help.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-[#F8F9FA] p-3 rounded-lg text-[#263646]">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-[#263646] text-sm">Email Us</h4>
                  <p className="text-gray-500 text-sm">contact@jornixs.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-[#F8F9FA] p-3 rounded-lg text-[#263646]">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-[#263646] text-sm">Call Us</h4>
                  <p className="text-gray-500 text-sm">+1 (863) 441-1687</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-[#F8F9FA] p-3 rounded-lg text-[#263646]">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-[#263646] text-sm">Location</h4>
                  <p className="text-gray-500 text-sm">Remote / Global Services</p>
                </div>
              </div>
            </div>
          </div>

          {/* FORMULARIO (Derecha) */}
          <div className="w-full lg:w-2/3 bg-[#F8F9FA] p-8 md:p-10 rounded-3xl border border-gray-100">
            <form className="space-y-6" onSubmit={onSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#263646]">First Name</label>
                  <input type="text" name='name' placeholder="John" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#94A378] focus:ring-2 focus:ring-[#94A378]/20 outline-none transition-all bg-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#263646]">Last Name</label>
                  <input type="text" name='last name' placeholder="Doe" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#94A378] focus:ring-2 focus:ring-[#94A378]/20 outline-none transition-all bg-white" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#263646]">Email Address</label>
                <input type="email" name='email' placeholder="john@company.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#94A378] focus:ring-2 focus:ring-[#94A378]/20 outline-none transition-all bg-white" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#263646]">Message</label>
                <textarea name='message' rows="4" placeholder="Tell us about your project..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#94A378] focus:ring-2 focus:ring-[#94A378]/20 outline-none transition-all bg-white resize-none"></textarea>
              </div>

              <button type="submit" className="w-full bg-[#263646] text-white font-bold py-4 rounded-xl hover:bg-[#94A378] transition-colors flex justify-center items-center gap-2">
                Send Message <Send size={18} />
              </button>
              <p>{result}</p>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;