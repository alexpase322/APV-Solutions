import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppBtn = () => {
  return (
    <a 
      href="https://wa.me/+18634411687" // <--- CAMBIA ESTO POR TU NÚMERO REAL
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#20bd5a] transition-all z-50 hover:scale-110 flex items-center justify-center animate-bounce-slow"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={32} fill="white" />
    </a>
  );
};

export default WhatsAppBtn;