import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services'; // El resumen de servicios
import About from '../components/About';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import WhatsAppBtn from '../components/WhatsAppBtn';
import useSeo from '../hooks/useSeo';

const Home = () => {
  useSeo({
    title: 'Custom Software, Automation & BI for Growing Businesses',
    description: 'APV Business Solutions designs and ships custom software, no-code automations and Power BI dashboards that drive measurable growth for SMBs in the US and LATAM.',
    path: '/',
  });

  // Efecto para que al cargar la página empiece desde arriba
  useEffect(() => {
    // Si la URL tiene un #hash (ej: #contact), no hacemos scroll al top para dejar que el navegador baje
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <About />
        <Contact />
      </main>
      <Footer />
      <WhatsAppBtn />
    </>
  );
};

export default Home;