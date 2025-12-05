import React from 'react';
import { Code2, Workflow, BarChart3, ArrowRight, CheckCircle2 } from 'lucide-react';

// 1. Datos de los servicios (Separados de la vista para mantener el orden)
const servicesData = [
  {
    id: 1,
    icon: <Code2 size={32} />,
    title: "Custom Software Development",
    description: "We build scalable, robust, and secure web and mobile applications tailored specifically to your business needs using modern technologies like React and Python.",
    features: ["Web & Mobile Apps", "API Integration", "Legacy System Modernization"]
  },
  {
    id: 2,
    icon: <Workflow size={32} />,
    title: "No-Code Process Automation",
    description: "Eliminate repetitive tasks and human error. We design automated workflows that connect your favorite tools, saving you hundreds of hours per month.",
    features: ["Workflow Optimization", "CRM Automation", "Chatbot Implementation"]
  },
  {
    id: 3,
    icon: <BarChart3 size={32} />,
    title: "BI & Data Dashboards",
    description: "Turn your data into actionable insights. We create interactive dashboards that give you real-time visibility into your KPIs and business performance.",
    features: ["Real-time Reporting", "Data Visualization", "Predictive Analytics"]
  }
];

// 2. Sub-componente para la Tarjeta de Servicio
const ServiceCard = ({ icon, title, description, features }) => (
  <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
    <div className="w-14 h-14 bg-[#F8F9FA] rounded-xl flex items-center justify-center text-[#263646] group-hover:bg-[#263646] group-hover:text-[#E4B34C] transition-colors mb-6">
      {icon}
    </div>
    
    <h3 className="text-xl font-bold text-[#263646] mb-3 group-hover:text-[#94A378] transition-colors">
      {title}
    </h3>
    
    <p className="text-gray-600 mb-6 leading-relaxed text-sm">
      {description}
    </p>

    <div className="space-y-2 mb-6 border-t border-gray-50 pt-4">
      {features.map((feature, index) => (
        <div key={index} className="flex items-center gap-2 text-sm text-gray-500">
          <CheckCircle2 size={14} className="text-[#94A378]" />
          <span>{feature}</span>
        </div>
      ))}
    </div>

    <a href="/services" className="flex items-center gap-2 text-[#263646] font-semibold text-sm group-hover:gap-3 transition-all">
      Learn more <ArrowRight size={16} className="text-[#94A378]" />
    </a>
  </div>
);

// 3. Componente Principal
const Services = () => {
  return (
    <section id="services" className="py-20 bg-white relative">
      {/* Elemento decorativo de fondo */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#F8F9FA] -z-10 rounded-l-[50px] hidden lg:block"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header de la sección */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#94A378] font-bold tracking-wider uppercase text-xs">Our Expertise</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#263646] mt-3 mb-4">
            Comprehensive Solutions for <br />
            <span className="relative z-10">
              Modern Businesses
              <span className="absolute bottom-1 left-0 w-full h-3 bg-[#E4B34C]/20 -z-10"></span>
            </span>
          </h2>
          <p className="text-gray-600 text-lg">
            We combine technical expertise with strategic thinking to deliver solutions that drive real growth.
          </p>
        </div>

        {/* Grid de Servicios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service) => (
            <ServiceCard 
              key={service.id}
              {...service}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Services;