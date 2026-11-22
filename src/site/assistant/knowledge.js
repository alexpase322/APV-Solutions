/**
 * Offline knowledge base for the APV assistant: intents (keywords → bilingual reply), a keyword
 * classifier and an EN/ES language guesser. Nothing leaves the browser.
 */
import { NFC_ORDER_HREF, SITE } from '../lib/site';

const whatsappWith = (t) => `${SITE.whatsappHref}?text=${encodeURIComponent(t)}`;
const ACTIONS = {
  contactForm: {
    en: {
      label: `Open the contact form`,
      to: `/#contact`,
      primary: true,
    },
    es: {
      label: `Ir al formulario`,
      to: `/#contact`,
      primary: true,
    },
  },
  whatsapp: {
    en: {
      label: `Chat on WhatsApp`,
      href: SITE.whatsappHref,
    },
    es: {
      label: `Escribir por WhatsApp`,
      href: SITE.whatsappHref,
    },
  },
  services: {
    en: {
      label: `Explore services`,
      to: `/services`,
    },
    es: {
      label: `Ver servicios`,
      to: `/services`,
    },
  },
  portfolio: {
    en: {
      label: `See the portfolio`,
      to: `/portfolio`,
    },
    es: {
      label: `Ver portafolio`,
      to: `/portfolio`,
    },
  },
  nfc: {
    en: {
      label: `See NFC cards`,
      to: `/nfc`,
    },
    es: {
      label: `Ver tarjetas NFC`,
      to: `/nfc`,
    },
  },
  about: {
    en: {
      label: `About us`,
      to: `/about`,
    },
    es: {
      label: `Sobre nosotros`,
      to: `/about`,
    },
  },
  email: {
    en: {
      label: `Email us`,
      href: `mailto:${SITE.email}`,
    },
    es: {
      label: `Enviar correo`,
      href: `mailto:${SITE.email}`,
    },
  },
  call: {
    en: {
      label: `Call ${SITE.phoneDisplay}`,
      href: SITE.phoneHref,
    },
    es: {
      label: `Llamar ${SITE.phoneDisplay}`,
      href: SITE.phoneHref,
    },
  },
};
export const CHIPS = {
  services: {
    intent: `services`,
    label: {
      en: `What services do you offer?`,
      es: `¿Qué servicios ofrecen?`,
    },
  },
  pricing: {
    intent: `pricing`,
    label: {
      en: `How much does a website cost?`,
      es: `¿Cuánto cuesta una web?`,
    },
  },
  booking: {
    intent: `booking`,
    label: {
      en: `Book a consultation`,
      es: `Agendar consultoría`,
    },
  },
  nfc: {
    intent: `nfc`,
    label: {
      en: `How do NFC cards work?`,
      es: `¿Cómo funcionan las tarjetas NFC?`,
    },
  },
  timeline: {
    intent: `timeline`,
    label: {
      en: `How long does a project take?`,
      es: `¿Cuánto tarda un proyecto?`,
    },
  },
  portfolio: {
    intent: `portfolio`,
    label: {
      en: `What have you built?`,
      es: `¿Qué han construido?`,
    },
  },
  automation: {
    intent: `automation`,
    label: {
      en: `Can you automate my workflows?`,
      es: `¿Pueden automatizar mis procesos?`,
    },
  },
  bi: {
    intent: `bi`,
    label: {
      en: `Power BI dashboards`,
      es: `Dashboards en Power BI`,
    },
  },
  software: {
    intent: `software`,
    label: {
      en: `Custom web & mobile apps`,
      es: `Apps web y móviles a medida`,
    },
  },
  ai: {
    intent: `ai`,
    label: {
      en: `How do you use AI?`,
      es: `¿Cómo usan la IA?`,
    },
  },
  contact: {
    intent: `contact`,
    label: {
      en: `Talk to a person`,
      es: `Hablar con una persona`,
    },
  },
  tech: {
    intent: `tech`,
    label: {
      en: `Which technologies do you use?`,
      es: `¿Qué tecnologías usan?`,
    },
  },
  support: {
    intent: `support`,
    label: {
      en: `Do you offer support?`,
      es: `¿Ofrecen soporte?`,
    },
  },
  team: {
    intent: `team`,
    label: {
      en: `Who is behind APV?`,
      es: `¿Quién está detrás de APV?`,
    },
  },
  results: {
    intent: `results`,
    label: {
      en: `What results do you deliver?`,
      es: `¿Qué resultados logran?`,
    },
  },
};
export const DEFAULT_CHIPS = [`services`, `pricing`, `booking`, `nfc`];
const PRICE_WORDS =
  `precio*.cuesta*.cost.costs.costo*.costing.costly.price*.pricing.quote*.cotiza*.presupuesto*.budget*.tarifa*.how much for.how much does.how much is.how much are.cuanto cobran.cuanto cobra.cuanto vale.cuanto sale.cuanto me sale.cuanto cuesta.charge*.cobran.cobra`.split(
    `.`,
  );
const INTENTS = [
  {
    id: `pricing`,
    priority: 100,
    keywords: [
      ...PRICE_WORDS,
      `cuanto`,
      `rate`,
      `rates`,
      `hourly`,
      `fee`,
      `fees`,
      `how much`,
      `valor`,
      `pago`,
      `pagar`,
      `inversion`,
      `barato`,
      `cheap`,
      `expensive`,
      `caro`,
      `package*`,
      `paquete*`,
      `planes`,
      `pricing plan*`,
      `your plans`,
    ],
    strong: [...PRICE_WORDS, `package*`, `paquete*`, `planes`, `your plans`, `hourly`],
    followups: [`booking`, `timeline`, `services`],
    reply: {
      en: {
        text: [
          `Every project is scoped individually, so we don't publish fixed prices — a dashboard, an automation and a full platform are very different builds.`,
          `Tell us what you need and the team will reply with a clear proposal. No hidden fees.`,
        ],
        actions: [
          {
            label: `Request a quote`,
            to: `/#contact`,
            primary: true,
          },
          {
            label: `Ask on WhatsApp`,
            href: whatsappWith(`Hi! I'd like a quote for a project with APV.`),
          },
        ],
      },
      es: {
        text: [
          `Cada proyecto se cotiza a medida, por eso no publicamos precios fijos: un dashboard, una automatización y una plataforma completa son trabajos muy distintos.`,
          `Cuéntanos qué necesitas y el equipo te responde con una propuesta clara. Sin costos ocultos.`,
        ],
        actions: [
          {
            label: `Pedir cotización`,
            to: `/#contact`,
            primary: true,
          },
          {
            label: `Preguntar por WhatsApp`,
            href: whatsappWith(`¡Hola! Quisiera una cotización para un proyecto con APV.`),
          },
        ],
      },
    },
  },
  {
    id: `pricing_nfc`,
    priority: 99,
    keywords: [],
    followups: [`nfc`, `contact`],
    reply: {
      en: {
        text: [
          `For current NFC card pricing and team orders, message us on WhatsApp — the team will reply with the details for your case.`,
        ],
        actions: [
          {
            label: `Ask on WhatsApp`,
            href: whatsappWith(`Hi! I'd like to know the price of APV NFC business cards.`),
            primary: true,
          },
          {
            label: `See NFC cards`,
            to: `/nfc`,
          },
        ],
      },
      es: {
        text: [
          `Para conocer el precio actual de las tarjetas NFC y los pedidos para equipos, escríbenos por WhatsApp y el equipo te responde con los detalles para tu caso.`,
        ],
        actions: [
          {
            label: `Preguntar por WhatsApp`,
            href: whatsappWith(`¡Hola! Quisiera saber el precio de las tarjetas NFC de APV.`),
            primary: true,
          },
          {
            label: `Ver tarjetas NFC`,
            to: `/nfc`,
          },
        ],
      },
    },
  },
  {
    id: `timeline`,
    priority: 95,
    keywords:
      `tiempo*.tarda*.demora*.plazo*.timeline*.how long.how much time.how fast.how quickly.how soon.turnaround.deliver*.cuanto tiempo.entrega*.deadline*.duration.duracion.semana*.week*.mes.meses.month*.rapido.quickly.urgente.urgent.your process.the process work.how do you work.como trabajan.metodologia*.methodolog*`.split(
        `.`,
      ),
    strong: [
      `tarda*`,
      `demora*`,
      `plazo*`,
      `timeline*`,
      `how long`,
      `how much time`,
      `how fast`,
      `how quickly`,
      `how soon`,
      `turnaround`,
      `cuanto tiempo`,
      `deadline*`,
      `your process`,
      `the process work`,
      `how do you work`,
      `como trabajan`,
      `metodologia*`,
      `methodolog*`,
    ],
    followups: [`pricing`, `booking`, `automation`],
    reply: {
      en: {
        text: [
          `It depends on scope. Automations built with n8n or Zapier are deployed in days, not months. For custom software and dashboards, we share a timeline once we have analyzed your requirements.`,
        ],
        bullets: [
          `1 · Analyze — we map your process and bottlenecks`,
          `2 · Design — scope, architecture and UX`,
          `3 · Build & integrate — with your tools and data`,
          `4 · Support — 24/7 support & maintenance`,
        ],
        actions: [
          {
            label: `Tell us about your project`,
            to: `/#contact`,
            primary: true,
          },
        ],
      },
      es: {
        text: [
          `Depende del alcance. Las automatizaciones con n8n o Zapier se implementan en días, no en meses. Para software a medida y dashboards, te compartimos un cronograma después de analizar tus requisitos.`,
        ],
        bullets: [
          `1 · Analizar — mapeamos tu proceso y sus cuellos de botella`,
          `2 · Diseñar — alcance, arquitectura y UX`,
          `3 · Construir e integrar — con tus herramientas y datos`,
          `4 · Soporte — soporte y mantenimiento 24/7`,
        ],
        actions: [
          {
            label: `Cuéntanos tu proyecto`,
            to: `/#contact`,
            primary: true,
          },
        ],
      },
    },
  },
  {
    id: `booking`,
    priority: 92,
    keywords: [
      `agenda*`,
      `cita*`,
      `reunion*`,
      `consultoria*`,
      `consulta`,
      `consultation*`,
      `consult`,
      `meeting*`,
      `demo`,
      `book`,
      `booking`,
      `schedule*`,
      `llamada*`,
      `videollamada`,
      `zoom`,
      `meet`,
      `appointment*`,
    ],
    strong: [`agenda*`, `cita*`, `reunion*`, `consultoria*`, `consultation*`, `meeting*`, `book`, `schedule*`, `appointment*`],
    followups: [`pricing`, `services`, `contact`],
    reply: {
      en: {
        text: [
          `Happy to set up a consultation. Send a few details about your project through the contact form or WhatsApp and we'll coordinate a time with you.`,
        ],
        actions: [
          {
            label: `Open the contact form`,
            to: `/#contact`,
            primary: true,
          },
          {
            label: `Book via WhatsApp`,
            href: whatsappWith(`Hi! I'd like to schedule a consultation with APV.`),
          },
          ACTIONS.call.en,
        ],
      },
      es: {
        text: [
          `Con gusto agendamos una consultoría. Envíanos algunos detalles de tu proyecto por el formulario o por WhatsApp y coordinamos un horario contigo.`,
        ],
        actions: [
          {
            label: `Ir al formulario`,
            to: `/#contact`,
            primary: true,
          },
          {
            label: `Agendar por WhatsApp`,
            href: whatsappWith(`¡Hola! Quisiera agendar una consultoría con APV.`),
          },
          ACTIONS.call.es,
        ],
      },
    },
  },
  {
    id: `jornixs`,
    priority: 90,
    keywords: [
      `jornix*`,
      `payroll`,
      `nomina*`,
      `timesheet*`,
      `time tracking`,
      `clock in`,
      `1099`,
      `contractor*`,
      `contratista*`,
      `control de asistencia`,
      `horas extra`,
      `overtime`,
      `control de horas`,
      `horas trabajadas`,
      `horas de mis empleados`,
      `employee hours`,
      `track hours`,
    ],
    strong: [
      `jornix*`,
      `payroll`,
      `nomina*`,
      `timesheet*`,
      `control de horas`,
      `horas trabajadas`,
      `employee hours`,
      `track hours`,
    ],
    followups: [`portfolio`, `software`, `pricing`],
    reply: {
      en: {
        text: [
          `Jornixs is our live time-tracking and payroll platform for 1099-NEC independent contractors and the businesses that employ them in the US. It replaces paper timesheets with geolocation-validated clock-ins and automated payroll reports.`,
        ],
        bullets: [
          `Geolocation-validated clock in/out with lunch tracking`,
          `Automatic weekly overtime calculation (1.5x)`,
          `Timesheet approval workflow for managers`,
          `Payroll reports in PDF / Excel`,
        ],
        actions: [
          {
            label: `Visit jornixs.com`,
            href: `https://jornixs.com/`,
            primary: true,
          },
          ACTIONS.portfolio.en,
        ],
      },
      es: {
        text: [
          `Jornixs es nuestra plataforma en producción de control de horas y nómina para contratistas independientes 1099-NEC y las empresas que los contratan en EE. UU. Reemplaza las hojas de horas en papel por marcaciones validadas con geolocalización y reportes de nómina automáticos.`,
        ],
        bullets: [
          `Entrada/salida validada con geolocalización y control de almuerzo`,
          `Cálculo automático de horas extra semanales (1.5x)`,
          `Flujo de aprobación de horas para supervisores`,
          `Reportes de nómina en PDF / Excel`,
        ],
        actions: [
          {
            label: `Visitar jornixs.com`,
            href: `https://jornixs.com/`,
            primary: true,
          },
          ACTIONS.portfolio.es,
        ],
      },
    },
  },
  {
    id: `listingai`,
    priority: 89,
    keywords: [
      `listingai`,
      `listing*`,
      `real estate`,
      `inmobiliari*`,
      `bienes raices`,
      `propiedad*`,
      `propert*`,
      `realtor*`,
      `agente inmobiliario`,
      `rental*`,
      `alquiler*`,
    ],
    strong: [`listingai`, `listing*`, `inmobiliari*`, `real estate`, `bienes raices`],
    followups: [`portfolio`, `ai`, `contact`],
    reply: {
      en: {
        text: [
          `APV ListingAI is coming soon: an AI-powered listing platform for real estate agencies. It turns a few photos and basic property data into complete, polished listings for rentals and sales — ready to publish across portals and social media.`,
        ],
        bullets: [
          `AI-generated property descriptions (rent & sale)`,
          `Automatic highlight extraction from photos`,
          `Multi-channel publishing for real estate portals`,
          `Agency branding and multi-agent workspace`,
        ],
        actions: [
          {
            label: `Ask about ListingAI`,
            to: `/#contact`,
            primary: true,
          },
          ACTIONS.portfolio.en,
        ],
      },
      es: {
        text: [
          `APV ListingAI llega pronto: una plataforma con IA para agencias inmobiliarias. Convierte unas cuantas fotos y datos básicos del inmueble en anuncios completos y pulidos, de alquiler o venta, listos para publicar en portales y redes sociales.`,
        ],
        bullets: [
          `Descripciones generadas con IA (alquiler y venta)`,
          `Extracción automática de atributos desde las fotos`,
          `Publicación multicanal en portales inmobiliarios`,
          `Marca de la agencia y espacio para varios agentes`,
        ],
        actions: [
          {
            label: `Preguntar por ListingAI`,
            to: `/#contact`,
            primary: true,
          },
          ACTIONS.portfolio.es,
        ],
      },
    },
  },
  {
    id: `nexus`,
    priority: 88,
    keywords: [`nexus`, `apvnexus`, `crm`, `pipeline*`, `ventas`, `sales team*`, `tickets`, `leads`, `lead`],
    strong: [`nexus`, `apvnexus`],
    followups: [`portfolio`, `ai`, `automation`],
    reply: {
      en: {
        text: [
          `APVNexus is our live CRM with native AI, built for sales and support teams. It manages deals, contacts and tickets in one place while AI drafts replies, scores leads and summarizes conversations.`,
          `Need CRM automation for the tools you already use? We do that too.`,
        ],
        bullets: [
          `Deal & pipeline management`,
          `Ticket and support workflows`,
          `AI-assisted replies, summaries and lead scoring`,
          `Contact and company 360° view`,
        ],
        actions: [
          {
            label: `Visit apvnexus.com`,
            href: `https://apvnexus.com/`,
            primary: true,
          },
          ACTIONS.portfolio.en,
        ],
      },
      es: {
        text: [
          `APVNexus es nuestro CRM en producción con IA nativa, pensado para equipos de ventas y soporte. Gestiona oportunidades, contactos y tickets en un solo lugar mientras la IA redacta respuestas, califica leads y resume conversaciones.`,
          `¿Necesitas automatizar el CRM que ya usas? También lo hacemos.`,
        ],
        bullets: [
          `Gestión de oportunidades y pipeline`,
          `Flujos de tickets y soporte`,
          `Respuestas, resúmenes y calificación de leads con IA`,
          `Vista 360° de contactos y empresas`,
        ],
        actions: [
          {
            label: `Visitar apvnexus.com`,
            href: `https://apvnexus.com/`,
            primary: true,
          },
          ACTIONS.portfolio.es,
        ],
      },
    },
  },
  {
    id: `nfc`,
    priority: 87,
    keywords: [
      `nfc`,
      `tarjeta*`,
      `card`,
      `cards`,
      `business card*`,
      `tarjeta de presentacion`,
      `qr`,
      `tap`,
      `contactless`,
      `perfil digital`,
      `digital profile`,
      `iphone`,
      `android`,
      `install`,
      `instalar`,
      `install an app`,
      `instalar una app`,
      `descargar una app`,
      `download an app`,
    ],
    strong: [`nfc`, `tarjeta*`, `business card*`, `install an app`, `instalar una app`, `descargar una app`, `download an app`],
    followups: [`pricing`, `contact`, `services`],
    reply: {
      en: {
        text: [
          `APV NFC cards share your contact info, social media and links the moment someone taps the card with their phone — no app, no paper, always up to date.`,
        ],
        bullets: [
          `Get your card — we create your account and program the card for you`,
          `Build your profile — activate it by email and add your photo, contact info and links`,
          `Tap & share — they save your contact in one tap`,
          `Works with iPhone XS and newer and most Android phones; the QR code covers older phones`,
          `Profile analytics and team orders available`,
        ],
        actions: [
          {
            label: `Order on WhatsApp`,
            href: NFC_ORDER_HREF,
            primary: true,
          },
          ACTIONS.nfc.en,
        ],
      },
      es: {
        text: [
          `Las tarjetas NFC de APV comparten tu contacto, redes sociales y enlaces en el momento en que alguien acerca su teléfono a la tarjeta: sin apps, sin papel y siempre actualizadas.`,
        ],
        bullets: [
          `Recibe tu tarjeta — creamos tu cuenta y la programamos por ti`,
          `Arma tu perfil — actívalo por correo y añade foto, contacto y enlaces`,
          `Acerca y comparte — guardan tu contacto con un toque`,
          `Funciona con iPhone XS o más reciente y la mayoría de Android; el código QR cubre teléfonos más antiguos`,
          `Incluye analíticas del perfil y pedidos para equipos`,
        ],
        actions: [
          {
            label: `Pedir por WhatsApp`,
            href: whatsappWith(`¡Hola! Quisiera pedir una tarjeta NFC de APV.`),
            primary: true,
          },
          ACTIONS.nfc.es,
        ],
      },
    },
  },
  {
    id: `ai`,
    priority: 86,
    keywords: [
      `ia`,
      `ai`,
      `inteligencia artificial`,
      `artificial intelligence`,
      `gpt`,
      `chatgpt`,
      `openai`,
      `llm`,
      `machine learning`,
      `chatbot*`,
      `bot`,
      `bots`,
      `agent*`,
      `asistente*`,
      `assistant*`,
    ],
    strong: [`ia`, `ai`, `inteligencia artificial`, `artificial intelligence`, `chatgpt`, `openai`, `chatbot*`, `bot`, `bots`],
    followups: [`automation`, `portfolio`, `contact`],
    reply: {
      en: {
        text: [`We put AI to work where it actually saves time:`],
        bullets: [
          `APVNexus — our CRM drafts replies, scores leads and summarizes conversations with AI`,
          `APV ListingAI (coming soon) — turns photos and property data into complete listings`,
          `Chatbots and AI-assisted automations for your own workflows, built with the OpenAI API, n8n and Zapier`,
        ],
        actions: [
          {
            label: `Discuss an AI project`,
            to: `/#contact`,
            primary: true,
          },
          ACTIONS.portfolio.en,
        ],
      },
      es: {
        text: [`Usamos la IA donde de verdad ahorra tiempo:`],
        bullets: [
          `APVNexus — nuestro CRM redacta respuestas, califica leads y resume conversaciones con IA`,
          `APV ListingAI (muy pronto) — convierte fotos y datos del inmueble en anuncios completos`,
          `Chatbots y automatizaciones con IA para tus propios procesos, con la API de OpenAI, n8n y Zapier`,
        ],
        actions: [
          {
            label: `Hablar de un proyecto con IA`,
            to: `/#contact`,
            primary: true,
          },
          ACTIONS.portfolio.es,
        ],
      },
    },
  },
  {
    id: `bi`,
    priority: 80,
    keywords: [
      `dashboard*`,
      `power bi`,
      `powerbi`,
      `bi`,
      `kpi*`,
      `report*`,
      `informe*`,
      `data`,
      `datos`,
      `analytic*`,
      `analitic*`,
      `looker`,
      `tableau`,
      `metric*`,
      `visualiza*`,
      `business intelligence`,
      `inteligencia de negocios`,
      `tablero*`,
      `excel`,
    ],
    strong: [
      `dashboard*`,
      `power bi`,
      `powerbi`,
      `kpi*`,
      `business intelligence`,
      `inteligencia de negocios`,
      `tablero*`,
      `report*`,
    ],
    followups: [`pricing`, `booking`, `team`],
    reply: {
      en: {
        text: [`We design interactive dashboards that centralize your KPIs, so you decide with real-time facts, not guesses.`],
        bullets: [
          `Power BI, Looker Studio, Tableau and custom React charts`,
          `Real-time reporting, data visualization and predictive analytics`,
          `Our co-founder Alexander Pastrana Villamil is a Power BI specialist`,
        ],
        actions: [
          {
            label: `BI & data services`,
            to: `/services#bi`,
            primary: true,
          },
          ACTIONS.contactForm.en,
        ],
      },
      es: {
        text: [
          `Diseñamos dashboards interactivos que centralizan tus KPI, para que decidas con datos en tiempo real y no con suposiciones.`,
        ],
        bullets: [
          `Power BI, Looker Studio, Tableau y gráficos a medida en React`,
          `Reportes en tiempo real, visualización de datos y análisis predictivo`,
          `Nuestro cofundador Alexander Pastrana Villamil es especialista en Power BI`,
        ],
        actions: [
          {
            label: `Servicios de BI y datos`,
            to: `/services#bi`,
            primary: true,
          },
          ACTIONS.contactForm.es,
        ],
      },
    },
  },
  {
    id: `automation`,
    priority: 78,
    keywords: [
      `automat*`,
      `n8n`,
      `zapier`,
      `workflow*`,
      `flujo*`,
      `proceso*`,
      `process*`,
      `repetitiv*`,
      `integra*`,
      `twilio`,
      `hubspot`,
      `whatsapp business`,
      `no code`,
      `no-code`,
      `nocode`,
      `sin codigo`,
      `manual`,
      `tareas`,
      `tasks`,
      `data entry`,
      `captura de datos`,
    ],
    strong: [
      `automat*`,
      `n8n`,
      `zapier`,
      `workflow*`,
      `no code`,
      `no-code`,
      `nocode`,
      `sin codigo`,
      `integra*`,
      `data entry`,
      `captura de datos`,
    ],
    followups: [`timeline`, `pricing`, `ai`],
    reply: {
      en: {
        text: [
          `We automate repetitive work so your team can focus on what matters. With n8n and Zapier we connect your apps — CRM, email, sheets, WhatsApp — and deploy solutions in days, not months.`,
        ],
        bullets: [
          `Workflow analysis to find your bottlenecks`,
          `Integrations via APIs like Twilio and HubSpot`,
          `CRM automation and chatbot implementation`,
          `Example: new form entry → WhatsApp message → CRM update`,
        ],
        actions: [
          {
            label: `Automation services`,
            to: `/services#automation`,
            primary: true,
          },
          {
            label: `See examples`,
            to: `/portfolio`,
          },
        ],
      },
      es: {
        text: [
          `Automatizamos el trabajo repetitivo para que tu equipo se enfoque en lo importante. Con n8n y Zapier conectamos tus apps (CRM, correo, hojas de cálculo, WhatsApp) y desplegamos soluciones en días, no en meses.`,
        ],
        bullets: [
          `Análisis de flujos para encontrar cuellos de botella`,
          `Integraciones vía API como Twilio y HubSpot`,
          `Automatización de CRM e implementación de chatbots`,
          `Ejemplo: nuevo formulario → mensaje de WhatsApp → actualización del CRM`,
        ],
        actions: [
          {
            label: `Servicios de automatización`,
            to: `/services#automation`,
            primary: true,
          },
          {
            label: `Ver ejemplos`,
            to: `/portfolio`,
          },
        ],
      },
    },
  },
  {
    id: `software`,
    priority: 76,
    keywords:
      `software.app.apps.ios.aplicacion*.web.website*.webs.pagina*.sitio*.site.landing.ecommerce.e commerce.online store.tienda online.tienda.shopify.woocommerce.wordpress.mobile.movil*.desarroll*.develop*.program*.api.apis.legacy.sistema*.system*.plataforma*.platform*.saas.migra*.moderniz*.booking app.booking system.appointment app.app de citas.sistema de citas.app de reservas.sistema de reservas.sistema de agenda`.split(
        `.`,
      ),
    strong: [
      `software`,
      `aplicacion*`,
      `desarroll*`,
      `develop*`,
      `website*`,
      `pagina*`,
      `plataforma*`,
      `platform*`,
      `online store`,
      `tienda online`,
      `shopify`,
      `woocommerce`,
      `ecommerce`,
      `e commerce`,
      `booking app`,
      `booking system`,
      `appointment app`,
      `app de citas`,
      `sistema de citas`,
      `app de reservas`,
      `sistema de reservas`,
      `sistema de agenda`,
    ],
    followups: [`pricing`, `timeline`, `portfolio`],
    reply: {
      en: {
        text: [
          `We build scalable, secure web and mobile applications tailored to how your business actually works — from websites and internal tools to full SaaS platforms.`,
        ],
        bullets: [
          `Frontend in React & Tailwind`,
          `Backends in Java Spring Boot and Python`,
          `Cloud integration with AWS and Google Cloud`,
          `API development, integrations and legacy system migration`,
        ],
        actions: [
          {
            label: `Custom software`,
            to: `/services#software`,
            primary: true,
          },
          {
            label: `Start a project`,
            to: `/#contact`,
          },
        ],
      },
      es: {
        text: [
          `Desarrollamos aplicaciones web y móviles escalables y seguras, adaptadas a cómo trabaja tu negocio: desde sitios web y herramientas internas hasta plataformas SaaS completas.`,
        ],
        bullets: [
          `Frontend en React y Tailwind`,
          `Backends en Java Spring Boot y Python`,
          `Integración en la nube con AWS y Google Cloud`,
          `Desarrollo de APIs, integraciones y migración de sistemas heredados`,
        ],
        actions: [
          {
            label: `Software a medida`,
            to: `/services#software`,
            primary: true,
          },
          {
            label: `Iniciar un proyecto`,
            to: `/#contact`,
          },
        ],
      },
    },
  },
  {
    id: `portfolio`,
    priority: 74,
    keywords: [
      `portafolio`,
      `portfolio*`,
      `proyecto*`,
      `project*`,
      `ejemplo*`,
      `example*`,
      `producto*`,
      `product*`,
      `trabajo*`,
      `your work`,
      `casos`,
      `case stud*`,
      `built`,
      `construido*`,
      `hecho`,
    ],
    strong: [`portafolio`, `portfolio*`, `ejemplo*`, `example*`, `producto*`, `product*`, `case stud*`],
    followups: [`software`, `ai`, `pricing`],
    reply: {
      en: {
        text: [`Here are platforms we've built and shipped:`],
        bullets: [
          `Jornixs (live) — time-tracking and payroll for 1099 contractors in the US`,
          `APVNexus (live) — a CRM with native AI for sales and support teams`,
          `APV ListingAI (coming soon) — AI-written property listings for real estate agencies`,
        ],
        actions: [
          {
            label: `See the portfolio`,
            to: `/portfolio`,
            primary: true,
          },
          {
            label: `jornixs.com`,
            href: `https://jornixs.com/`,
          },
          {
            label: `apvnexus.com`,
            href: `https://apvnexus.com/`,
          },
        ],
      },
      es: {
        text: [`Estas son plataformas que hemos construido y lanzado:`],
        bullets: [
          `Jornixs (en producción) — control de horas y nómina para contratistas 1099 en EE. UU.`,
          `APVNexus (en producción) — un CRM con IA nativa para equipos de ventas y soporte`,
          `APV ListingAI (muy pronto) — anuncios inmobiliarios redactados con IA para agencias`,
        ],
        actions: [
          {
            label: `Ver portafolio`,
            to: `/portfolio`,
            primary: true,
          },
          {
            label: `jornixs.com`,
            href: `https://jornixs.com/`,
          },
          {
            label: `apvnexus.com`,
            href: `https://apvnexus.com/`,
          },
        ],
      },
    },
  },
  {
    id: `tech`,
    priority: 70,
    keywords: [
      `tecnologia*`,
      `technolog*`,
      `stack`,
      `herramienta*`,
      `tool*`,
      `lenguaje*`,
      `programming language*`,
      `framework*`,
      `react`,
      `angular`,
      `node`,
      `nodejs`,
      `python`,
      `java`,
      `spring`,
      `fastapi`,
      `postgres*`,
      `aws`,
      `google cloud`,
      `gcp`,
      `cloud`,
      `nube`,
      `glide`,
      `tailwind`,
    ],
    strong: [`tecnologia*`, `technolog*`, `stack`, `herramienta*`, `framework*`, `lenguaje*`, `programming language*`],
    followups: [`software`, `automation`, `bi`],
    reply: {
      en: {
        text: [`Our stack, picked for each project:`],
        bullets: [
          `Frontend: React, Tailwind CSS, Angular`,
          `Backend: Node.js, Python (FastAPI), Java (Spring Boot)`,
          `Data & BI: PostgreSQL, Power BI, Looker Studio, Tableau`,
          `Automation: n8n, Zapier, Twilio, HubSpot`,
          `Cloud & AI: AWS, Google Cloud, OpenAI API · No-code apps: Glide`,
        ],
        actions: [
          {
            label: `Explore services`,
            to: `/services`,
            primary: true,
          },
        ],
      },
      es: {
        text: [`Nuestro stack, elegido para cada proyecto:`],
        bullets: [
          `Frontend: React, Tailwind CSS, Angular`,
          `Backend: Node.js, Python (FastAPI), Java (Spring Boot)`,
          `Datos y BI: PostgreSQL, Power BI, Looker Studio, Tableau`,
          `Automatización: n8n, Zapier, Twilio, HubSpot`,
          `Nube e IA: AWS, Google Cloud, API de OpenAI · Apps no-code: Glide`,
        ],
        actions: [
          {
            label: `Ver servicios`,
            to: `/services`,
            primary: true,
          },
        ],
      },
    },
  },
  {
    id: `legal`,
    priority: 69,
    keywords: [
      `privacidad`,
      `privacy`,
      `terminos`,
      `terms`,
      `terms of service`,
      `legal`,
      `condiciones`,
      `conditions`,
      `datos personales`,
      `personal data`,
      `gdpr`,
      `ccpa`,
      `cookies`,
      `politica*`,
      `policy`,
      `intellectual property`,
      `propiedad intelectual`,
      `source code`,
      `codigo fuente`,
    ],
    strong: [
      `privacidad`,
      `privacy`,
      `terminos`,
      `terms`,
      `terms of service`,
      `legal`,
      `policy`,
      `politica*`,
      `intellectual property`,
      `propiedad intelectual`,
      `source code`,
      `codigo fuente`,
      `personal data`,
      `datos personales`,
    ],
    followups: [`contact`],
    reply: {
      en: {
        text: [
          `Our Terms of Service and Privacy Policy are available in English and Spanish. For legal questions, write to ` +
            SITE.legalEmail +
            `.`,
        ],
        actions: [
          {
            label: `Terms of Service`,
            to: `/legal?doc=terms&lang=en`,
            primary: true,
          },
          {
            label: `Privacy Policy`,
            to: `/legal?doc=privacy&lang=en`,
          },
        ],
      },
      es: {
        text: [
          `Nuestros Términos de Servicio y Política de Privacidad están disponibles en inglés y español. Para consultas legales, escribe a ` +
            SITE.legalEmail +
            `.`,
        ],
        actions: [
          {
            label: `Términos de Servicio`,
            to: `/legal?doc=terms&lang=es`,
            primary: true,
          },
          {
            label: `Política de Privacidad`,
            to: `/legal?doc=privacy&lang=es`,
          },
        ],
      },
    },
  },
  {
    id: `services`,
    priority: 68,
    keywords: [
      `servicio*`,
      `service*`,
      `ofrec*`,
      `offer*`,
      `hacen`,
      `que hacen`,
      `what do you`,
      `what you do`,
      `help with`,
      `ayudar`,
      `ayuda`,
      `solucion*`,
      `solution*`,
      `consulting`,
      `dedican`,
      `need help`,
    ],
    strong: [`servicio*`, `service*`, `what do you`, `dedican`],
    followups: [`pricing`, `timeline`, `portfolio`],
    reply: {
      en: {
        text: [`We work across three practices, plus our NFC digital business cards:`],
        bullets: [
          `Custom software — web & mobile apps, API integration, legacy modernization`,
          `No-code automation — workflows, CRM automation and chatbots with n8n and Zapier`,
          `BI & dashboards — real-time reporting in Power BI, Looker Studio and Tableau`,
          `NFC cards — one tap shares your whole professional profile`,
        ],
        actions: [
          {
            ...ACTIONS.services.en,
            primary: true,
          },
          {
            label: `Start a project`,
            to: `/#contact`,
          },
        ],
      },
      es: {
        text: [`Trabajamos en tres áreas, además de nuestras tarjetas de presentación NFC:`],
        bullets: [
          `Software a medida — apps web y móviles, integración de APIs, modernización de sistemas`,
          `Automatización no-code — flujos, automatización de CRM y chatbots con n8n y Zapier`,
          `BI y dashboards — reportes en tiempo real con Power BI, Looker Studio y Tableau`,
          `Tarjetas NFC — un toque comparte todo tu perfil profesional`,
        ],
        actions: [
          {
            ...ACTIONS.services.es,
            primary: true,
          },
          {
            label: `Iniciar un proyecto`,
            to: `/#contact`,
          },
        ],
      },
    },
  },
  {
    id: `support`,
    priority: 66,
    keywords: [
      `soporte`,
      `support`,
      `mantenimiento`,
      `maintenance`,
      `24/7`,
      `24 7`,
      `after launch`,
      `asistencia tecnica`,
      `soporte tecnico`,
      `technical support`,
    ],
    strong: [`soporte`, `support`, `mantenimiento`, `maintenance`, `asistencia tecnica`, `soporte tecnico`, `technical support`],
    followups: [`services`, `pricing`, `contact`],
    reply: {
      en: {
        text: [
          `We offer 24/7 support & maintenance, and we stay with you after launch — we're an extension of your team, not just a vendor.`,
        ],
        actions: [ACTIONS.contactForm.en, ACTIONS.whatsapp.en],
      },
      es: {
        text: [
          `Ofrecemos soporte y mantenimiento 24/7 y te acompañamos después del lanzamiento: somos una extensión de tu equipo, no solo un proveedor.`,
        ],
        actions: [ACTIONS.contactForm.es, ACTIONS.whatsapp.es],
      },
    },
  },
  {
    id: `results`,
    priority: 64,
    keywords: [
      `client*`,
      `result*`,
      `referencia*`,
      `reference*`,
      `confiable`,
      `trust*`,
      `how many clients`,
      `cuantos clientes`,
      `happy clients`,
      `clientes satisfechos`,
      `your clients`,
      `sus clientes`,
    ],
    strong: [
      `result*`,
      `how many clients`,
      `cuantos clientes`,
      `happy clients`,
      `clientes satisfechos`,
      `your clients`,
      `sus clientes`,
    ],
    followups: [`portfolio`, `team`, `booking`],
    reply: {
      en: {
        text: [
          `A few numbers from our work: 50+ happy clients, a 10x efficiency boost, 100% project commitment and 24/7 support & maintenance.`,
        ],
        actions: [
          {
            ...ACTIONS.portfolio.en,
            primary: true,
          },
          ACTIONS.about.en,
        ],
      },
      es: {
        text: [
          `Algunas cifras de nuestro trabajo: más de 50 clientes satisfechos, 10x de mejora en eficiencia, 100% de compromiso con cada proyecto y soporte y mantenimiento 24/7.`,
        ],
        actions: [
          {
            ...ACTIONS.portfolio.es,
            primary: true,
          },
          ACTIONS.about.es,
        ],
      },
    },
  },
  {
    id: `team`,
    priority: 62,
    keywords: [
      `equipo`,
      `team`,
      `quien*`,
      `fundador*`,
      `founder*`,
      `cofundador*`,
      `nosotros`,
      `about`,
      `empresa`,
      `company`,
      `historia`,
      `story`,
      `mision`,
      `mission`,
      `vision`,
      `valores`,
      `values`,
      `pastrana`,
      `your team`,
      `su equipo`,
      `who is behind`,
      `quien esta detras`,
      `quienes son`,
      `who are you`,
    ],
    strong: [
      `fundador*`,
      `founder*`,
      `cofundador*`,
      `your team`,
      `su equipo`,
      `who is behind`,
      `quien esta detras`,
      `quienes son`,
      `who are you`,
    ],
    followups: [`services`, `results`, `booking`],
    reply: {
      en: {
        text: [
          `APV was founded with a simple mission: make enterprise-level digital transformation accessible, understandable and profitable for businesses of all sizes.`,
        ],
        bullets: [
          `Alexander Pastrana Serrato — Co-founder & Lead Developer`,
          `Alexander Pastrana Villamil — Co-founder & CFAO, Power BI specialist`,
        ],
        actions: [
          {
            ...ACTIONS.about.en,
            primary: true,
          },
          {
            label: `Meet the team`,
            to: `/#team`,
          },
        ],
      },
      es: {
        text: [
          `APV nació con una misión sencilla: que la transformación digital de nivel empresarial sea accesible, comprensible y rentable para negocios de cualquier tamaño.`,
        ],
        bullets: [
          `Alexander Pastrana Serrato — Cofundador y Lead Developer`,
          `Alexander Pastrana Villamil — Cofundador y CFAO, especialista en Power BI`,
        ],
        actions: [
          {
            ...ACTIONS.about.es,
            primary: true,
          },
          {
            label: `Conocer al equipo`,
            to: `/#team`,
          },
        ],
      },
    },
  },
  {
    id: `location`,
    priority: 60,
    keywords:
      `donde.ubicacion.ubicad*.location.where.located.oficina*.office*.pais*.countr*.latam.latinoamerica.usa.eeuu.estados unidos.united states.tampa.florida.remot*.mexico.colombia.venezuela.peru.chile.argentina.espana.costa rica.puerto rico.panama.ecuador.guatemala.honduras.el salvador.republica dominicana.bolivia.uruguay.paraguay.based in.where are you.donde estan.de donde son.donde se ubican`.split(
        `.`,
      ),
    strong:
      `ubicacion.ubicad*.location.located.oficina*.office*.based in.where are you.donde estan.de donde son.donde se ubican.countr*.pais*.latam.latinoamerica.usa.eeuu.estados unidos.united states.mexico.colombia.venezuela.peru.chile.argentina.espana.costa rica.puerto rico.remot*`.split(
        `.`,
      ),
    followups: [`contact`, `booking`, `services`],
    reply: {
      en: {
        text: [`We're a remote team based in ${SITE.hq}, offering remote / global services with a focus on the ${SITE.region}.`],
        actions: [ACTIONS.contactForm.en, ACTIONS.whatsapp.en],
      },
      es: {
        text: [
          `Somos un equipo remoto con base en Tampa, Florida. Ofrecemos servicios remotos y globales, con foco en EE. UU. y Latinoamérica.`,
        ],
        actions: [ACTIONS.contactForm.es, ACTIONS.whatsapp.es],
      },
    },
  },
  {
    id: `login`,
    priority: 59,
    keywords: [
      `login`,
      `log in`,
      `sign in`,
      `signin`,
      `iniciar sesion`,
      `inicio sesion`,
      `inicia sesion`,
      `ingresar`,
      `entrar`,
      `cuenta`,
      `account`,
      `mi perfil`,
      `my profile`,
      `editar perfil`,
      `edit profile`,
      `password`,
      `contrasena`,
      `clave`,
      `acceso`,
      `access`,
      `my login`,
      `my account`,
      `mi cuenta`,
    ],
    strong: [
      `login`,
      `log in`,
      `sign in`,
      `signin`,
      `iniciar sesion`,
      `inicio sesion`,
      `inicia sesion`,
      `password`,
      `contrasena`,
      `mi perfil`,
      `my profile`,
      `my login`,
      `my account`,
      `mi cuenta`,
    ],
    followups: [`nfc`, `contact`],
    reply: {
      en: {
        text: [
          `Already have an APV NFC card? Log in to edit your profile — changes go live instantly and your card keeps working with the same link.`,
        ],
        actions: [
          {
            label: `Log in`,
            href: `/login`,
            primary: true,
          },
          ACTIONS.contactForm.en,
        ],
      },
      es: {
        text: [
          `¿Ya tienes una tarjeta NFC de APV? Inicia sesión para editar tu perfil: los cambios se publican al instante y tu tarjeta sigue funcionando con el mismo enlace.`,
        ],
        actions: [
          {
            label: `Iniciar sesión`,
            href: `/login`,
            primary: true,
          },
          ACTIONS.contactForm.es,
        ],
      },
    },
  },
  {
    id: `contact`,
    priority: 58,
    keywords: [
      `contact*`,
      `email`,
      `e-mail`,
      `correo`,
      `mail`,
      `telefono`,
      `phone`,
      `llamar`,
      `call`,
      `whatsapp`,
      `hablar`,
      `talk`,
      `humano`,
      `human`,
      `persona`,
      `person`,
      `asesor*`,
      `advisor`,
      `representative`,
      `escribir`,
      `write`,
      `your number`,
      `su numero`,
      `tu numero`,
    ],
    strong: [
      `contact*`,
      `humano`,
      `human`,
      `persona`,
      `person`,
      `asesor*`,
      `whatsapp`,
      `telefono`,
      `phone`,
      `email`,
      `correo`,
      `your number`,
      `su numero`,
      `tu numero`,
    ],
    followups: [`booking`, `pricing`, `services`],
    reply: {
      en: {
        text: [`You can reach the team directly:`],
        bullets: [`Email: ${SITE.email}`, `Phone & WhatsApp: ${SITE.phoneDisplay}`, `${SITE.location} · ${SITE.region}`],
        actions: [ACTIONS.whatsapp.en, ACTIONS.email.en, ACTIONS.call.en, ACTIONS.contactForm.en],
      },
      es: {
        text: [`Puedes contactar al equipo directamente:`],
        bullets: [
          `Correo: ${SITE.email}`,
          `Teléfono y WhatsApp: ${SITE.phoneDisplay}`,
          `Servicio remoto y global · EE. UU. y Latinoamérica`,
        ],
        actions: [ACTIONS.whatsapp.es, ACTIONS.email.es, ACTIONS.call.es, ACTIONS.contactForm.es],
      },
    },
  },
  {
    id: `terms`,
    priority: 50,
    keywords: [
      `free`,
      `gratis`,
      `gratuit*`,
      `included`,
      `include`,
      `includes`,
      `incluid*`,
      `incluye*`,
      `warranty`,
      `warranties`,
      `garantia*`,
      `guarantee*`,
      `garantiz*`,
      `discount*`,
      `descuento*`,
    ],
    strong: [
      `free`,
      `gratis`,
      `gratuit*`,
      `included`,
      `incluid*`,
      `incluye*`,
      `warranty`,
      `garantia*`,
      `guarantee*`,
      `garantiz*`,
      `discount*`,
      `descuento*`,
    ],
    followups: [`pricing`, `booking`, `contact`],
    reply: {
      en: {
        text: [
          `What's included — maintenance, updates, warranty terms or discounts — depends on each project and is set out in our proposal.`,
          `Tell us what you need and the team will answer with the specifics for your case.`,
        ],
        actions: [ACTIONS.contactForm.en, ACTIONS.whatsapp.en],
      },
      es: {
        text: [
          `Lo que incluye cada proyecto (mantenimiento, actualizaciones, condiciones de garantía o descuentos) depende del alcance y queda detallado en nuestra propuesta.`,
          `Cuéntanos qué necesitas y el equipo te responde con los detalles para tu caso.`,
        ],
        actions: [ACTIONS.contactForm.es, ACTIONS.whatsapp.es],
      },
    },
  },
  {
    id: `thanks`,
    priority: 40,
    keywords: [
      `gracias`,
      `thanks`,
      `thank you`,
      `thx`,
      `genial`,
      `perfecto`,
      `excelente`,
      `great`,
      `awesome`,
      `perfect`,
      `ok`,
      `okay`,
      `vale`,
      `listo`,
    ],
    strong: [`gracias`, `thanks`, `thank you`],
    followups: [`booking`, `services`, `contact`],
    reply: {
      en: {
        text: [`You're welcome. Anything else I can help you with?`],
      },
      es: {
        text: [`Con gusto. ¿Te ayudo con algo más?`],
      },
    },
  },
  {
    id: `bye`,
    priority: 38,
    keywords: [`adios`, `chao`, `chau`, `bye`, `goodbye`, `hasta luego`, `nos vemos`, `see you`],
    strong: [`adios`, `bye`, `goodbye`, `hasta luego`],
    followups: [`contact`],
    reply: {
      en: {
        text: [`Thanks for stopping by. Whenever you are ready, the team is one message away.`],
        actions: [ACTIONS.contactForm.en],
      },
      es: {
        text: [`Gracias por tu visita. Cuando quieras, el equipo está a un mensaje de distancia.`],
        actions: [ACTIONS.contactForm.es],
      },
    },
  },
  {
    id: `greeting`,
    priority: 30,
    keywords: [
      `hola`,
      `hi`,
      `hello`,
      `hey`,
      `buenas`,
      `buenos dias`,
      `buenas tardes`,
      `buenas noches`,
      `good morning`,
      `good afternoon`,
      `good evening`,
      `saludos`,
      `que tal`,
    ],
    strong: [`hola`, `hello`],
    followups: [`services`, `pricing`, `booking`, `nfc`],
    reply: {
      en: {
        text: [
          `Hi. I'm the APV assistant — ask me about custom software, automation, BI dashboards, NFC cards, pricing or timelines.`,
        ],
      },
      es: {
        text: [
          `Hola. Soy el asistente de APV: pregúntame por software a medida, automatización, dashboards de BI, tarjetas NFC, precios o tiempos.`,
        ],
      },
    },
  },
];
const FALLBACK = {
  followups: [`services`, `pricing`, `contact`],
  reply: {
    en: {
      text: [
        `I didn't quite get that. I can help with services, pricing, timelines, NFC cards, our products or contacting the team — or you can write to a person directly.`,
      ],
      actions: [ACTIONS.whatsapp.en, ACTIONS.contactForm.en],
    },
    es: {
      text: [
        `No entendí bien tu pregunta. Puedo ayudarte con servicios, precios, tiempos, tarjetas NFC, nuestros productos o con el contacto del equipo; también puedes escribirle directamente a una persona.`,
      ],
      actions: [ACTIONS.whatsapp.es, ACTIONS.contactForm.es],
    },
  },
};
export const WELCOME = {
  en: {
    text: [
      `Hi, I'm the APV assistant.`,
      `Ask me about custom software, automation, BI dashboards or NFC cards — or tap a suggestion below.`,
    ],
  },
  es: {
    text: [
      `Hola, soy el asistente de APV.`,
      `Pregúntame por software a medida, automatización, dashboards de BI o tarjetas NFC, o toca una sugerencia.`,
    ],
  },
};

const ACCENTS = /[\u0300-\u036f]/g;

/** Lowercase, accent-free, punctuation → spaces. */
export function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(ACCENTS, '')
    .replace(/[^a-z0-9/\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Keyword forms: "word" exact token, "pre*" token prefix, "two words" phrase, "two wor*" phrase prefix.
 * `padded` is the normalized message wrapped in spaces so phrases match on word boundaries.
 */
function matchesKeyword(keyword, tokens, padded) {
  if (keyword.includes(' ')) {
    return keyword.endsWith('*') ? padded.includes(` ${keyword.slice(0, -1)}`) : padded.includes(` ${keyword} `);
  }
  if (keyword.endsWith('*')) {
    const prefix = keyword.slice(0, -1);
    return tokens.some((token) => token.startsWith(prefix));
  }
  return tokens.includes(keyword);
}

function scoreIntent(intent, tokens, padded) {
  let score = 0;
  for (const keyword of intent.keywords) {
    if (matchesKeyword(keyword, tokens, padded)) score += intent.strong?.includes(keyword) ? 2 : 1;
  }
  return score;
}

const SMALL_TALK = new Set(['greeting', 'thanks', 'bye']);
/** Topics that become a pricing answer when the message also asks about price. */
const PRICING_TOPICS = new Set([
  'software',
  'automation',
  'bi',
  'ai',
  'services',
  'portfolio',
  'tech',
  'nexus',
  'jornixs',
  'listingai',
  'team',
  'results',
  'location',
  'contact',
]);
/** Topics that defer to the terms answer when the message mentions terms/contracts. */
const TERMS_TOPICS = new Set(['support', 'results', 'booking', 'pricing', 'services', 'timeline']);

/** Best-matching intent id for a free-text message ("fallback" when nothing matches). */
export function classify(message) {
  const text = normalize(message);
  if (!text) return 'fallback';

  // "e-commerce" also counts as "ecommerce", "e" and "commerce"
  const tokens = text
    .split(' ')
    .flatMap((token) =>
      /[-/]/.test(token) ? [token, token.replace(/[-/]/g, ''), ...token.split(/[-/]/).filter(Boolean)] : [token],
    );
  const padded = ` ${text} ${text.replace(/[-/]/g, ' ')} `;

  const scores = new Map();
  let best = null;
  let bestScore = 0;
  for (const intent of INTENTS) {
    let score = scoreIntent(intent, tokens, padded);
    // "card" in "credit card" is not about NFC cards
    if (intent.id === 'nfc' && !tokens.includes('nfc') && /\b(credit|debit|credito|debito|pay|pagar|pago)\b/.test(text))
      score = 0;
    // small talk only wins when nothing substantive matched
    if (SMALL_TALK.has(intent.id)) {
      const substantive = Math.max(0, ...[...scores].filter(([id]) => !SMALL_TALK.has(id)).map(([, s]) => s));
      if (substantive >= (intent.id === 'greeting' ? 1 : 2)) score = 0;
    }
    scores.set(intent.id, score);
    if (score > bestScore || (score === bestScore && score > 0 && best && intent.priority > best.priority)) {
      best = intent;
      bestScore = score;
    }
  }
  if (!best) return 'fallback';

  const scoreOf = (id) => scores.get(id) ?? 0;
  if (best.id === 'pricing' && padded.includes(' how much time ')) return 'timeline';
  if ((best.id === 'pricing' || best.id === 'nfc') && scoreOf('pricing') > 0 && scoreOf('nfc') > 0) return 'pricing_nfc';
  if (scoreOf('terms') > 0 && TERMS_TOPICS.has(best.id)) return 'terms';
  if (scoreOf('pricing') >= 2 && PRICING_TOPICS.has(best.id)) return 'pricing';
  if (best.id === 'booking' && scoreOf('software') >= 3) return 'software';
  if (
    best.id === 'nfc' &&
    /\b(edit\w*|update|actualiz\w*|change|cambi\w*|modific\w*)\b/.test(text) &&
    /\b(my|mi|mis)\b/.test(text)
  ) {
    return 'login';
  }
  return best.id;
}

const SPANISH_WORDS =
  /\b(hola|que|como|cuanto|cuanta|cuesta|precio|precios|servicios?|ofrecen|quiero|necesito|tienen|hacen|gracias|tarjetas?|pagina|agendar|cita|donde|cuando|tiempo|ustedes|buenas|ayuda|puedo|empresa|equipo|una|para|con|los|las|por|mi|mis|es|esta|hay|tarda|cotizacion|de|del|el|la|en|un|y|lo|se|su|sus|tu|al|si|sobre|tengo|pueden|puede|quisiera|necesitamos|trabajan|usan|hablar|hasta|luego|chao|perfecto|listo|buen|dia|informacion|costo|cual|ayudan|manejan|voy)\b/gi;
const ENGLISH_WORDS =
  /\b(what|how|much|price|prices|cost|costs|services?|offer|need|want|do|does|you|thanks|cards?|website|book|where|when|time|hello|hi|help|can|company|team|the|is|are|my|for|with|an|long|take|i|im|to|of|and|in|it|your|our|about|tell|from|here|own|based|live|bye|hey|good|morning|great|please|pls)\b/gi;

/** 'es', 'en', or null when the message is too ambiguous to tell. */
export function detectLang(message) {
  const plain = message.normalize('NFD').replace(ACCENTS, '');
  const spanish = (plain.match(SPANISH_WORDS)?.length ?? 0) + (/[¿¡ñáéíóú]/i.test(message) ? 1 : 0);
  const english = plain.match(ENGLISH_WORDS)?.length ?? 0;
  if (spanish === english) return null;
  return spanish > english ? 'es' : 'en';
}

/** Reply + follow-up chips for an intent id in a language. */
export function answer(intentId, lang) {
  const intent = INTENTS.find((i) => i.id === intentId);
  return intent
    ? { reply: intent.reply[lang], followups: intent.followups }
    : { reply: FALLBACK.reply[lang], followups: FALLBACK.followups };
}
