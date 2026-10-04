// Structured legal content for APV Business Solutions LLC.
// Each document = { title, meta, sections: [{ level, title, paragraphs: [string] }] }
// Source: APV_Terms_of_Service_EN.docx, APV_Privacy_Policy_EN.docx,
//         APV_Terminos_de_Servicio_ES.docx, APV_Politica_de_Privacidad_ES.docx
// Effective Date: May 1, 2026.

const META_EN = {
  effectiveDate: 'May 1, 2026',
  lastUpdated: 'May 1, 2026',
  company: 'APV Business Solutions LLC, a Florida limited liability company (EIN: 39-3906018)',
  contact: 'info@apvsolutions.tech',
};

const META_ES = {
  effectiveDate: '1 de mayo de 2026',
  lastUpdated: '1 de mayo de 2026',
  company: 'APV Business Solutions LLC, sociedad de responsabilidad limitada de Florida (EIN: 39-3906018)',
  contact: 'info@apvsolutions.tech',
};

// ============================ TERMS OF SERVICE — EN ============================
const TERMS_EN = {
  title: 'Terms of Service',
  subtitle: 'APV Business Solutions LLC',
  meta: META_EN,
  sections: [
    {
      level: 1,
      title: '1. Acceptance of Terms',
      paragraphs: [
        'Welcome to APV Business Solutions ("APV," "we," "us," or "our"). These Terms of Service ("Terms") govern your access to and use of the websites, software, applications, products, and services (collectively, the "Services") provided by APV Business Solutions LLC, a limited liability company organized under the laws of the State of Florida, United States, with principal place of business in Tampa, Florida.',
        'By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, do not access or use the Services.',
      ],
    },
    {
      level: 1,
      title: '2. Description of Services',
      paragraphs: [
        'APV Business Solutions provides an integrated ecosystem of business technology services including, without limitation:',
        '• Business Solutions: tax preparation, accounting, payroll, immigration services, and interpreter services.',
        '• Smart Solutions: custom software development, no-code applications, mobile apps, business intelligence dashboards, and process automation.',
        '• Education for Work: practical professional courses.',
        '• Proprietary Products: Jornixs, APV Nexus CRM, APV Nexus Inmigración, and APV ListingAI (also branded APV Realtor Tampa).',
        '• Social Media Publishing Tools: features that allow authenticated users to publish content to their connected social media accounts, including TikTok, Instagram, and Facebook.',
      ],
    },
    {
      level: 1,
      title: '3. Eligibility and Account Registration',
      paragraphs: [
        'To use the Services, you must be at least 18 years old and capable of forming a legally binding contract. By creating an account, you represent and warrant that all information you provide is accurate, current, and complete.',
        'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.',
      ],
    },
    {
      level: 1,
      title: '4. Third-Party Integrations and Social Media Publishing',
      paragraphs: [],
    },
    {
      level: 2,
      title: '4.1 General',
      paragraphs: [
        'The Services may include integrations with third-party platforms, including but not limited to TikTok, Instagram (Meta Platforms, Inc.), Facebook (Meta Platforms, Inc.), OpenAI, ElevenLabs, Google services, and others (collectively, "Third-Party Services").',
        'Your use of Third-Party Services is subject to the respective terms and privacy policies of those services. APV is not responsible for the availability, accuracy, content, or practices of Third-Party Services.',
      ],
    },
    {
      level: 2,
      title: '4.2 TikTok Content Posting Integration',
      paragraphs: [
        'Important — TikTok Integration: If you choose to connect your TikTok account, you authorize APV Business Solutions to upload and publish video content on your behalf, exclusively in the manner you direct.',
        'By connecting your TikTok account through our official OAuth integration, you specifically agree that:',
        '• You are the rightful owner of the connected TikTok account or have explicit authorization from the account owner.',
        '• You will only publish content that you have created or for which you have all necessary rights, licenses, and permissions.',
        '• Each video publication requires your explicit confirmation within APV Business Solutions; we do not auto-publish content without your direct instruction.',
        '• You will comply with TikTok\'s Community Guidelines, Terms of Service, and all applicable laws.',
        '• You can disconnect your TikTok account at any time through the Settings page, which immediately revokes our stored access tokens.',
        'APV Business Solutions does not store your TikTok password. We use OAuth 2.0 access tokens issued by TikTok, which are encrypted at rest and used solely to perform the actions you authorize.',
      ],
    },
    {
      level: 2,
      title: '4.3 Other Social Media Integrations',
      paragraphs: [
        'The same principles set forth in Section 4.2 apply to integrations with Instagram, Facebook, and any other social media platform we may integrate in the future.',
      ],
    },
    {
      level: 1,
      title: '5. User Content and Intellectual Property',
      paragraphs: [],
    },
    {
      level: 2,
      title: '5.1 Your Content',
      paragraphs: [
        'You retain all ownership rights to the content you create, upload, or publish through the Services ("User Content"). By using the Services, you grant APV a limited, non-exclusive, worldwide, royalty-free license to host, store, transmit, and display your User Content solely for the purpose of providing the Services to you.',
      ],
    },
    {
      level: 2,
      title: '5.2 AI-Generated Content',
      paragraphs: [
        'Some of our features use third-party artificial intelligence models (e.g., OpenAI, ElevenLabs) to generate text, images, audio, or video based on your inputs. You acknowledge that:',
        '• AI-generated outputs may not always be accurate, original, or suitable for your purpose.',
        '• You are solely responsible for reviewing, editing, and approving AI-generated content before publication.',
        '• You must comply with the terms of the underlying AI service providers regarding the use and ownership of generated outputs.',
      ],
    },
    {
      level: 2,
      title: '5.3 Our Intellectual Property',
      paragraphs: [
        'All Services, including software, designs, trademarks, logos, and proprietary methodologies, are owned by APV Business Solutions LLC or its licensors and are protected by intellectual property laws. You may not copy, modify, reverse engineer, or create derivative works of the Services without our prior written consent.',
      ],
    },
    {
      level: 1,
      title: '6. Prohibited Conduct',
      paragraphs: [
        'You agree not to use the Services to:',
        '• Violate any applicable law, regulation, or third-party rights.',
        '• Publish content that is defamatory, obscene, harassing, hateful, or that promotes violence, discrimination, or illegal activity.',
        '• Infringe upon any intellectual property, privacy, publicity, or other rights of any party.',
        '• Distribute spam, malware, or any malicious code.',
        '• Attempt to gain unauthorized access to the Services, other accounts, or our infrastructure.',
        '• Use the Services to engage in fraudulent, deceptive, or misleading practices.',
        '• Reverse engineer, decompile, or attempt to extract the source code of the Services.',
        '• Bypass content moderation systems or attempt to publish prohibited content.',
      ],
    },
    {
      level: 1,
      title: '7. Fees and Payment',
      paragraphs: [
        'Some Services are offered on a paid subscription basis. Fees, billing terms, and refund policies will be disclosed at the time of purchase. You are responsible for all applicable taxes. Subscription fees are non-refundable except where required by law or as expressly stated in our refund policy.',
      ],
    },
    {
      level: 1,
      title: '8. Termination',
      paragraphs: [
        'We may suspend or terminate your access to the Services at any time, with or without cause and with or without notice, including if we believe you have violated these Terms. You may terminate your account at any time by contacting us at info@apvsolutions.tech.',
        'Upon termination, your right to use the Services ceases immediately, and we will delete or anonymize your data within 30 days, except where retention is required by law or for legitimate business purposes.',
      ],
    },
    {
      level: 1,
      title: '9. Disclaimers',
      paragraphs: [
        'THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR ACCURACY.',
        'APV does not warrant that the Services will be uninterrupted, error-free, or secure. You use the Services at your own risk.',
      ],
    },
    {
      level: 1,
      title: '10. Limitation of Liability',
      paragraphs: [
        'TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL APV BUSINESS SOLUTIONS LLC, ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION LOSS OF PROFITS, DATA, USE, OR GOODWILL, ARISING OUT OF OR IN CONNECTION WITH THESE TERMS OR THE SERVICES.',
        'Our total cumulative liability shall not exceed the greater of (a) the amount you paid to APV in the twelve (12) months preceding the claim, or (b) one hundred U.S. dollars ($100).',
      ],
    },
    {
      level: 1,
      title: '11. Indemnification',
      paragraphs: [
        'You agree to indemnify, defend, and hold harmless APV Business Solutions LLC, its affiliates, and their respective officers, directors, employees, and agents from and against any claims, damages, liabilities, costs, and expenses (including reasonable attorneys\' fees) arising out of or related to: (a) your use of the Services; (b) your User Content; (c) your violation of these Terms; or (d) your violation of any third-party rights or applicable law.',
      ],
    },
    {
      level: 1,
      title: '12. Governing Law and Dispute Resolution',
      paragraphs: [
        'These Terms shall be governed by and construed in accordance with the laws of the State of Florida, United States, without regard to conflict-of-law principles.',
        'Any dispute arising out of or relating to these Terms or the Services shall be resolved exclusively in the state or federal courts located in Hillsborough County, Florida. You consent to the personal jurisdiction of such courts and waive any objection based on inconvenient forum.',
      ],
    },
    {
      level: 1,
      title: '13. Changes to These Terms',
      paragraphs: [
        'We may update these Terms from time to time. The updated Terms will be posted on our website with a revised "Last Updated" date. Your continued use of the Services after such changes constitutes acceptance of the updated Terms.',
      ],
    },
    {
      level: 1,
      title: '14. Contact Information',
      paragraphs: [
        'If you have any questions about these Terms, please contact us:',
        'APV Business Solutions LLC',
        'Tampa, Florida, United States',
        'Email: info@apvsolutions.tech',
        'Website: apvsolutions.tech',
      ],
    },
  ],
};

// ============================ PRIVACY POLICY — EN ============================
const PRIVACY_EN = {
  title: 'Privacy Policy',
  subtitle: 'APV Business Solutions LLC',
  meta: META_EN,
  sections: [
    {
      level: 1,
      title: '1. Introduction',
      paragraphs: [
        'APV Business Solutions LLC ("APV," "we," "us," or "our") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our websites, applications, products, and services (collectively, the "Services").',
        'This Privacy Policy applies to all users of the Services and complies with applicable data protection laws, including the California Consumer Privacy Act (CCPA), the General Data Protection Regulation (GDPR) where applicable, and TikTok\'s Developer Privacy Requirements.',
      ],
    },
    {
      level: 1,
      title: '2. Information We Collect',
      paragraphs: [],
    },
    {
      level: 2,
      title: '2.1 Information You Provide',
      paragraphs: [
        '• Account Information: Name, email address, phone number, business name, business address, and password.',
        '• Billing Information: Payment card details (processed securely by third-party payment processors), billing address, and tax identification numbers when applicable.',
        '• Service-Specific Data: Tax documents, immigration documents, real estate property data, business records, and other information you upload to use specific Services.',
        '• Content: Text, images, videos, audio, and other media you create or upload through the Services.',
        '• Communications: Messages you send to us through email, chat, or support tickets.',
      ],
    },
    {
      level: 2,
      title: '2.2 Information from Third-Party Integrations',
      paragraphs: [
        'When you connect your social media or other accounts to APV, we collect information that those platforms provide to us with your authorization. This includes:',
        'TikTok Integration: When you connect your TikTok account, we collect:',
        '• Your TikTok username, user ID, display name, and avatar (via the user.info.basic scope).',
        '• An OAuth 2.0 access token and refresh token issued by TikTok (encrypted at rest).',
        '• Metadata about videos you publish through APV (publication ID, timestamp, status).',
        'We do not collect your TikTok password, your private messages, your followers list, your browsing history on TikTok, or any data not strictly necessary to perform the publishing actions you authorize.',
        'Similar data is collected from Instagram, Facebook, and other social media integrations you choose to enable.',
      ],
    },
    {
      level: 2,
      title: '2.3 Automatically Collected Information',
      paragraphs: [
        '• Usage Data: Pages visited, features used, clicks, session duration, and interaction patterns.',
        '• Device Information: IP address, browser type, operating system, device identifiers, and language preferences.',
        '• Cookies and Similar Technologies: Used to maintain your session, remember your preferences, and analyze usage. See Section 7 below.',
      ],
    },
    {
      level: 1,
      title: '3. How We Use Your Information',
      paragraphs: [
        'We use your information for the following purposes:',
        '• Service Delivery: Authenticate your account, process tax filings, generate AI content, publish to your social media accounts upon your instruction.',
        '• Customer Support: Respond to your inquiries, resolve technical issues, and provide assistance.',
        '• Service Improvement: Analyze usage patterns, fix bugs, develop new features, and enhance security.',
        '• Communication: Send you service updates, security alerts, billing notifications, and (with your consent) marketing messages.',
        '• Legal Compliance: Comply with applicable laws, respond to legal requests, and enforce our Terms of Service.',
        '• Fraud Prevention: Detect and prevent fraudulent activity, abuse, and security incidents.',
        'We do not sell your personal information, and we do not use your TikTok, Instagram, or Facebook data to train AI models.',
      ],
    },
    {
      level: 1,
      title: '4. How We Share Your Information',
      paragraphs: [
        'We share your information only in the following limited circumstances:',
        '• With your consent: When you explicitly direct us to share information (e.g., publishing a video to your TikTok account).',
        '• Service Providers: With trusted third-party vendors who help us operate the Services (e.g., cloud hosting, payment processing, customer support tools), bound by confidentiality and data protection obligations.',
        '• Third-Party Integrations: With platforms you connect (TikTok, Instagram, Facebook, OpenAI, ElevenLabs, Google), only to the extent necessary to perform the actions you request.',
        '• Legal Requirements: When required by law, court order, or to protect the rights, property, or safety of APV, our users, or others.',
        '• Business Transfers: In connection with a merger, acquisition, or sale of assets, with notice to affected users.',
      ],
    },
    {
      level: 1,
      title: '5. Data Retention',
      paragraphs: [
        'We retain your personal information only as long as necessary to fulfill the purposes described in this Privacy Policy, comply with legal obligations, resolve disputes, and enforce our agreements.',
        '• Account data: Retained for the duration of your account plus 30 days after termination.',
        '• OAuth access tokens (TikTok, etc.): Retained until you disconnect the integration or your account is terminated, whichever comes first. Upon disconnection, tokens are revoked and deleted within 24 hours.',
        '• Billing records: Retained for 7 years to comply with U.S. tax and accounting regulations.',
        '• Tax and immigration documents: Retained per applicable IRS, USCIS, and Colombian DIAN requirements.',
      ],
    },
    {
      level: 1,
      title: '6. Data Security',
      paragraphs: [
        'We implement industry-standard technical and organizational measures to protect your information, including:',
        '• Encryption of data in transit (TLS 1.2+) and at rest (AES-256).',
        '• Access controls and role-based permissions.',
        '• Regular security audits and vulnerability assessments.',
        '• Multi-factor authentication for administrative access.',
        '• Secure storage of OAuth tokens with restricted access.',
        'Despite our safeguards, no method of transmission or storage is 100% secure. If we become aware of a data breach affecting your information, we will notify you and the relevant authorities as required by law.',
      ],
    },
    {
      level: 1,
      title: '7. Cookies and Tracking Technologies',
      paragraphs: [
        'We use cookies and similar technologies to:',
        '• Maintain your authenticated session.',
        '• Remember your preferences and settings.',
        '• Analyze usage patterns and Service performance.',
        '• Detect and prevent fraud.',
        'You can control cookies through your browser settings. Disabling cookies may limit your ability to use certain Service features.',
      ],
    },
    {
      level: 1,
      title: '8. Your Rights and Choices',
      paragraphs: [
        'Depending on your jurisdiction, you may have the following rights:',
        '• Access: Request a copy of the personal information we hold about you.',
        '• Correction: Request correction of inaccurate or incomplete data.',
        '• Deletion: Request deletion of your personal information, subject to legal retention requirements.',
        '• Portability: Receive your data in a structured, machine-readable format.',
        '• Withdrawal of Consent: Disconnect third-party integrations or withdraw marketing consent at any time.',
        '• Objection: Object to certain processing activities, including marketing.',
        '• Non-Discrimination (CCPA): We will not discriminate against you for exercising your privacy rights.',
        'To exercise these rights, email us at info@apvsolutions.tech. We will respond within 30 days.',
      ],
    },
    {
      level: 2,
      title: '8.1 Disconnecting Social Media Integrations',
      paragraphs: [
        'You can disconnect any third-party integration at any time through the Settings page in APV Business Solutions. Disconnection immediately:',
        '• Revokes the OAuth access token from our systems.',
        '• Stops any pending or scheduled actions on that platform.',
        '• Removes stored profile information from the connected account within 24 hours.',
        'You can also revoke access directly from the third-party platform:',
        '• TikTok: TikTok app → Settings and Privacy → Security → Manage app permissions → APV Business Solutions → Remove.',
        '• Instagram/Facebook: Meta Business Suite → Settings → Apps and Websites → Remove APV Business Solutions.',
      ],
    },
    {
      level: 1,
      title: '9. International Data Transfers',
      paragraphs: [
        'APV is headquartered in the United States. If you access the Services from outside the U.S., your information will be transferred to and processed in the United States, where data protection laws may differ from those of your country. By using the Services, you consent to this transfer.',
        'For users in the European Economic Area (EEA), United Kingdom, or Switzerland, we use Standard Contractual Clauses or other appropriate safeguards as required by GDPR.',
      ],
    },
    {
      level: 1,
      title: '10. Children\'s Privacy',
      paragraphs: [
        'The Services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us at info@apvsolutions.tech and we will promptly delete it.',
      ],
    },
    {
      level: 1,
      title: '11. California Privacy Rights (CCPA)',
      paragraphs: [
        'California residents have specific rights under the California Consumer Privacy Act, including the right to know, delete, and opt out of the "sale" of personal information. APV does not sell personal information as defined by the CCPA. To exercise your CCPA rights, email info@apvsolutions.tech.',
      ],
    },
    {
      level: 1,
      title: '12. Third-Party Platform Privacy Policies',
      paragraphs: [
        'When you use third-party integrations, your data is also subject to the privacy policies of those platforms:',
        '• TikTok: https://www.tiktok.com/legal/privacy-policy',
        '• Meta (Facebook/Instagram): https://www.facebook.com/privacy/policy',
        '• OpenAI: https://openai.com/policies/privacy-policy',
        '• ElevenLabs: https://elevenlabs.io/privacy',
        '• Google: https://policies.google.com/privacy',
      ],
    },
    {
      level: 1,
      title: '13. Changes to This Privacy Policy',
      paragraphs: [
        'We may update this Privacy Policy periodically. The updated version will be posted on our website with a revised "Last Updated" date. For material changes, we will provide additional notice via email or in-app notification.',
      ],
    },
    {
      level: 1,
      title: '14. Contact Us',
      paragraphs: [
        'If you have questions about this Privacy Policy or our data practices, please contact us:',
        'APV Business Solutions LLC',
        'Privacy Officer',
        'Tampa, Florida, United States',
        'Email: info@apvsolutions.tech',
        'Website: apvsolutions.tech',
      ],
    },
  ],
};

// ============================ TÉRMINOS DE SERVICIO — ES ============================
const TERMS_ES = {
  title: 'Términos de Servicio',
  subtitle: 'APV Business Solutions LLC',
  meta: META_ES,
  sections: [
    {
      level: 1,
      title: '1. Aceptación de los Términos',
      paragraphs: [
        'Bienvenido a APV Business Solutions ("APV", "nosotros" o "nuestro"). Estos Términos de Servicio ("Términos") rigen su acceso y uso de los sitios web, software, aplicaciones, productos y servicios (colectivamente, los "Servicios") proporcionados por APV Business Solutions LLC, sociedad de responsabilidad limitada constituida bajo las leyes del Estado de Florida, Estados Unidos, con sede en Tampa, Florida.',
        'Al acceder o utilizar nuestros Servicios, usted acepta estar sujeto a estos Términos. Si no está de acuerdo con estos Términos, no acceda ni utilice los Servicios.',
      ],
    },
    {
      level: 1,
      title: '2. Descripción de los Servicios',
      paragraphs: [
        'APV Business Solutions ofrece un ecosistema integrado de servicios tecnológicos empresariales que incluye, sin limitación:',
        '• Business Solutions: preparación de impuestos, contabilidad, nómina, servicios de inmigración y servicios de intérprete.',
        '• Smart Solutions: desarrollo de software a medida, aplicaciones no-code, apps móviles, dashboards de inteligencia de negocios y automatización de procesos.',
        '• Education for Work: cursos profesionales prácticos.',
        '• Productos Propios: Jornixs, APV Nexus CRM, APV Nexus Inmigración, y APV ListingAI (también conocido como APV Realtor Tampa).',
        '• Herramientas de Publicación en Redes Sociales: funciones que permiten a los usuarios autenticados publicar contenido en sus cuentas conectadas de redes sociales, incluyendo TikTok, Instagram y Facebook.',
      ],
    },
    {
      level: 1,
      title: '3. Elegibilidad y Registro de Cuenta',
      paragraphs: [
        'Para utilizar los Servicios, debe ser mayor de 18 años y tener capacidad para celebrar un contrato legalmente vinculante. Al crear una cuenta, declara y garantiza que toda la información proporcionada es precisa, actualizada y completa.',
        'Usted es responsable de mantener la confidencialidad de las credenciales de su cuenta y de todas las actividades que ocurran bajo su cuenta. Debe notificarnos inmediatamente cualquier uso no autorizado.',
      ],
    },
    {
      level: 1,
      title: '4. Integraciones de Terceros y Publicación en Redes Sociales',
      paragraphs: [],
    },
    {
      level: 2,
      title: '4.1 General',
      paragraphs: [
        'Los Servicios pueden incluir integraciones con plataformas de terceros, incluyendo, entre otras, TikTok, Instagram (Meta Platforms, Inc.), Facebook (Meta Platforms, Inc.), OpenAI, ElevenLabs, servicios de Google, y otros (colectivamente, "Servicios de Terceros").',
        'Su uso de los Servicios de Terceros está sujeto a los términos y políticas de privacidad respectivos de esos servicios. APV no es responsable de la disponibilidad, exactitud, contenido o prácticas de los Servicios de Terceros.',
      ],
    },
    {
      level: 2,
      title: '4.2 Integración con TikTok Content Posting',
      paragraphs: [
        'Importante — Integración con TikTok: Si decide conectar su cuenta de TikTok, autoriza a APV Business Solutions a subir y publicar contenido de video en su nombre, exclusivamente de la manera que usted indique.',
        'Al conectar su cuenta de TikTok mediante nuestra integración OAuth oficial, acepta específicamente que:',
        '• Es el propietario legítimo de la cuenta de TikTok conectada o cuenta con autorización explícita del propietario.',
        '• Solo publicará contenido que haya creado o sobre el cual posea todos los derechos, licencias y permisos necesarios.',
        '• Cada publicación de video requiere su confirmación explícita dentro de APV Business Solutions; no publicamos contenido automáticamente sin su instrucción directa.',
        '• Cumplirá con las Normas de la Comunidad, los Términos de Servicio de TikTok y todas las leyes aplicables.',
        '• Puede desconectar su cuenta de TikTok en cualquier momento desde la página de Configuración, lo que revoca inmediatamente nuestros tokens de acceso.',
        'APV Business Solutions no almacena su contraseña de TikTok. Utilizamos tokens de acceso OAuth 2.0 emitidos por TikTok, encriptados en reposo y usados únicamente para realizar las acciones que usted autorice.',
      ],
    },
    {
      level: 2,
      title: '4.3 Otras Integraciones de Redes Sociales',
      paragraphs: [
        'Los mismos principios establecidos en la Sección 4.2 aplican a las integraciones con Instagram, Facebook, y cualquier otra plataforma de redes sociales que integremos en el futuro.',
      ],
    },
    {
      level: 1,
      title: '5. Contenido del Usuario y Propiedad Intelectual',
      paragraphs: [],
    },
    {
      level: 2,
      title: '5.1 Su Contenido',
      paragraphs: [
        'Usted conserva todos los derechos de propiedad sobre el contenido que cree, suba o publique a través de los Servicios ("Contenido del Usuario"). Al utilizar los Servicios, otorga a APV una licencia limitada, no exclusiva, mundial y libre de regalías para alojar, almacenar, transmitir y mostrar su Contenido del Usuario únicamente con el propósito de proporcionarle los Servicios.',
      ],
    },
    {
      level: 2,
      title: '5.2 Contenido Generado por IA',
      paragraphs: [
        'Algunas funciones utilizan modelos de inteligencia artificial de terceros (ej. OpenAI, ElevenLabs) para generar texto, imágenes, audio o video basados en sus entradas. Usted reconoce que:',
        '• Las salidas generadas por IA pueden no ser siempre precisas, originales o adecuadas para su propósito.',
        '• Es su responsabilidad exclusiva revisar, editar y aprobar el contenido generado por IA antes de su publicación.',
        '• Debe cumplir con los términos de los proveedores de servicios de IA subyacentes respecto al uso y propiedad de las salidas generadas.',
      ],
    },
    {
      level: 2,
      title: '5.3 Nuestra Propiedad Intelectual',
      paragraphs: [
        'Todos los Servicios, incluyendo software, diseños, marcas comerciales, logos y metodologías propietarias, son propiedad de APV Business Solutions LLC o sus licenciantes, y están protegidos por leyes de propiedad intelectual. No puede copiar, modificar, realizar ingeniería inversa o crear obras derivadas de los Servicios sin nuestro consentimiento previo por escrito.',
      ],
    },
    {
      level: 1,
      title: '6. Conducta Prohibida',
      paragraphs: [
        'Usted acepta no utilizar los Servicios para:',
        '• Violar cualquier ley aplicable, regulación o derecho de terceros.',
        '• Publicar contenido difamatorio, obsceno, acosador, de odio o que promueva la violencia, discriminación o actividad ilegal.',
        '• Infringir cualquier propiedad intelectual, privacidad, publicidad u otros derechos de cualquier parte.',
        '• Distribuir spam, malware o cualquier código malicioso.',
        '• Intentar obtener acceso no autorizado a los Servicios, otras cuentas o nuestra infraestructura.',
        '• Utilizar los Servicios para realizar prácticas fraudulentas, engañosas o tendenciosas.',
        '• Realizar ingeniería inversa, descompilar o intentar extraer el código fuente de los Servicios.',
        '• Eludir los sistemas de moderación de contenido o intentar publicar contenido prohibido.',
      ],
    },
    {
      level: 1,
      title: '7. Tarifas y Pago',
      paragraphs: [
        'Algunos Servicios se ofrecen mediante suscripción de pago. Las tarifas, condiciones de facturación y políticas de reembolso se divulgarán en el momento de la compra. Usted es responsable de todos los impuestos aplicables. Las tarifas de suscripción no son reembolsables salvo que la ley lo exija o que se establezca expresamente en nuestra política de reembolso.',
      ],
    },
    {
      level: 1,
      title: '8. Terminación',
      paragraphs: [
        'Podemos suspender o terminar su acceso a los Servicios en cualquier momento, con o sin causa y con o sin previo aviso, incluido el caso en que consideremos que ha violado estos Términos. Usted puede terminar su cuenta en cualquier momento contactándonos a info@apvsolutions.tech.',
        'Tras la terminación, su derecho a usar los Servicios cesa inmediatamente, y eliminaremos o anonimizaremos sus datos dentro de 30 días, salvo cuando la retención sea requerida por ley o para fines legítimos del negocio.',
      ],
    },
    {
      level: 1,
      title: '9. Descargos de Responsabilidad',
      paragraphs: [
        'LOS SERVICIOS SE PROPORCIONAN "TAL CUAL" Y "SEGÚN DISPONIBILIDAD" SIN GARANTÍAS DE NINGÚN TIPO, EXPRESAS O IMPLÍCITAS, INCLUYENDO SIN LIMITACIÓN GARANTÍAS DE COMERCIABILIDAD, IDONEIDAD PARA UN PROPÓSITO PARTICULAR, NO INFRACCIÓN O EXACTITUD.',
        'APV no garantiza que los Servicios sean ininterrumpidos, libres de errores o seguros. Usted utiliza los Servicios bajo su propio riesgo.',
      ],
    },
    {
      level: 1,
      title: '10. Limitación de Responsabilidad',
      paragraphs: [
        'EN LA MÁXIMA MEDIDA PERMITIDA POR LA LEY APLICABLE, EN NINGÚN CASO APV BUSINESS SOLUTIONS LLC, SUS AFILIADAS, FUNCIONARIOS, DIRECTORES, EMPLEADOS O AGENTES SERÁN RESPONSABLES POR DAÑOS INDIRECTOS, INCIDENTALES, ESPECIALES, CONSECUENTES O PUNITIVOS, INCLUYENDO SIN LIMITACIÓN PÉRDIDA DE GANANCIAS, DATOS, USO O PRESTIGIO, QUE SURJAN DE O EN RELACIÓN CON ESTOS TÉRMINOS O LOS SERVICIOS.',
        'Nuestra responsabilidad acumulativa total no excederá la mayor de (a) la cantidad que pagó a APV en los doce (12) meses anteriores al reclamo, o (b) cien dólares estadounidenses ($100).',
      ],
    },
    {
      level: 1,
      title: '11. Indemnización',
      paragraphs: [
        'Usted acepta indemnizar, defender y eximir de responsabilidad a APV Business Solutions LLC, sus afiliadas y sus respectivos funcionarios, directores, empleados y agentes, de cualquier reclamo, daño, responsabilidad, costo y gasto (incluyendo honorarios razonables de abogados) que surjan de o estén relacionados con: (a) su uso de los Servicios; (b) su Contenido del Usuario; (c) su violación de estos Términos; o (d) su violación de derechos de terceros o leyes aplicables.',
      ],
    },
    {
      level: 1,
      title: '12. Ley Aplicable y Resolución de Disputas',
      paragraphs: [
        'Estos Términos se regirán e interpretarán de conformidad con las leyes del Estado de Florida, Estados Unidos, sin tener en cuenta los principios de conflicto de leyes.',
        'Cualquier disputa que surja de o se relacione con estos Términos o los Servicios se resolverá exclusivamente en los tribunales estatales o federales ubicados en el Condado de Hillsborough, Florida. Usted consiente la jurisdicción personal de tales tribunales y renuncia a cualquier objeción basada en foro no conveniente.',
      ],
    },
    {
      level: 1,
      title: '13. Cambios en estos Términos',
      paragraphs: [
        'Podemos actualizar estos Términos de vez en cuando. Los Términos actualizados se publicarán en nuestro sitio web con una fecha de "Última Actualización" revisada. Su uso continuado de los Servicios tras dichos cambios constituye la aceptación de los Términos actualizados.',
      ],
    },
    {
      level: 1,
      title: '14. Información de Contacto',
      paragraphs: [
        'Si tiene preguntas sobre estos Términos, contáctenos:',
        'APV Business Solutions LLC',
        'Tampa, Florida, Estados Unidos',
        'Email: info@apvsolutions.tech',
        'Sitio web: apvsolutions.tech',
      ],
    },
  ],
};

// ============================ POLÍTICA DE PRIVACIDAD — ES ============================
const PRIVACY_ES = {
  title: 'Política de Privacidad',
  subtitle: 'APV Business Solutions LLC',
  meta: META_ES,
  sections: [
    {
      level: 1,
      title: '1. Introducción',
      paragraphs: [
        'APV Business Solutions LLC ("APV", "nosotros" o "nuestro") respeta su privacidad y se compromete a proteger sus datos personales. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y protegemos su información cuando utiliza nuestros sitios web, aplicaciones, productos y servicios (colectivamente, los "Servicios").',
        'Esta Política aplica a todos los usuarios de los Servicios y cumple con las leyes de protección de datos aplicables, incluyendo la Ley de Privacidad del Consumidor de California (CCPA), el Reglamento General de Protección de Datos (GDPR) cuando aplique, y los Requisitos de Privacidad de Desarrolladores de TikTok.',
      ],
    },
    {
      level: 1,
      title: '2. Información que Recopilamos',
      paragraphs: [],
    },
    {
      level: 2,
      title: '2.1 Información que Usted Proporciona',
      paragraphs: [
        '• Información de Cuenta: Nombre, correo electrónico, número de teléfono, nombre del negocio, dirección comercial y contraseña.',
        '• Información de Facturación: Datos de tarjeta de pago (procesados de forma segura por procesadores de pago externos), dirección de facturación e identificación tributaria cuando aplique.',
        '• Datos Específicos del Servicio: Documentos fiscales, documentos de inmigración, datos de propiedades inmobiliarias, registros del negocio y otra información que cargue para usar Servicios específicos.',
        '• Contenido: Texto, imágenes, videos, audio y otros archivos que cree o suba a los Servicios.',
        '• Comunicaciones: Mensajes que nos envíe por correo electrónico, chat o tickets de soporte.',
      ],
    },
    {
      level: 2,
      title: '2.2 Información de Integraciones de Terceros',
      paragraphs: [
        'Cuando conecta sus cuentas de redes sociales u otras a APV, recopilamos la información que esas plataformas nos proporcionan con su autorización, incluyendo:',
        'Integración con TikTok: Cuando conecta su cuenta de TikTok, recopilamos:',
        '• Su nombre de usuario de TikTok, ID de usuario, nombre de visualización y avatar (mediante el scope user.info.basic).',
        '• Un token de acceso OAuth 2.0 y un refresh token emitidos por TikTok (encriptados en reposo).',
        '• Metadatos sobre los videos que publica a través de APV (ID de publicación, marca de tiempo, estado).',
        'No recopilamos su contraseña de TikTok, sus mensajes privados, lista de seguidores, historial de navegación en TikTok ni datos no estrictamente necesarios para realizar las acciones de publicación que usted autorice.',
        'Datos similares se recopilan de Instagram, Facebook y otras integraciones de redes sociales que decida habilitar.',
      ],
    },
    {
      level: 2,
      title: '2.3 Información Recopilada Automáticamente',
      paragraphs: [
        '• Datos de Uso: Páginas visitadas, funciones utilizadas, clics, duración de la sesión y patrones de interacción.',
        '• Información del Dispositivo: Dirección IP, tipo de navegador, sistema operativo, identificadores del dispositivo y preferencias de idioma.',
        '• Cookies y Tecnologías Similares: Usadas para mantener su sesión, recordar sus preferencias y analizar el uso. Vea la Sección 7.',
      ],
    },
    {
      level: 1,
      title: '3. Cómo Usamos su Información',
      paragraphs: [
        'Utilizamos su información para los siguientes propósitos:',
        '• Prestación del Servicio: Autenticar su cuenta, procesar declaraciones de impuestos, generar contenido por IA, publicar en sus cuentas de redes sociales bajo su instrucción.',
        '• Atención al Cliente: Responder a sus consultas, resolver problemas técnicos y brindar asistencia.',
        '• Mejora del Servicio: Analizar patrones de uso, corregir errores, desarrollar nuevas funciones y mejorar la seguridad.',
        '• Comunicación: Enviarle actualizaciones del servicio, alertas de seguridad, notificaciones de facturación y (con su consentimiento) mensajes de marketing.',
        '• Cumplimiento Legal: Cumplir con leyes aplicables, responder a solicitudes legales y hacer cumplir nuestros Términos de Servicio.',
        '• Prevención de Fraude: Detectar y prevenir actividades fraudulentas, abuso e incidentes de seguridad.',
        'No vendemos su información personal y no usamos sus datos de TikTok, Instagram o Facebook para entrenar modelos de IA.',
      ],
    },
    {
      level: 1,
      title: '4. Cómo Compartimos su Información',
      paragraphs: [
        'Compartimos su información solo en las siguientes circunstancias limitadas:',
        '• Con su consentimiento: Cuando usted nos indica explícitamente que compartamos información (ej. publicar un video en su cuenta de TikTok).',
        '• Proveedores de Servicios: Con proveedores externos confiables que nos ayudan a operar los Servicios (ej. hosting en la nube, procesamiento de pagos, herramientas de soporte), sujetos a obligaciones de confidencialidad y protección de datos.',
        '• Integraciones de Terceros: Con plataformas que conecte (TikTok, Instagram, Facebook, OpenAI, ElevenLabs, Google), solo en la medida necesaria para realizar las acciones que usted solicite.',
        '• Requerimientos Legales: Cuando lo exija la ley, una orden judicial o para proteger los derechos, propiedad o seguridad de APV, nuestros usuarios u otros.',
        '• Transferencias del Negocio: En conexión con una fusión, adquisición o venta de activos, con notificación a los usuarios afectados.',
      ],
    },
    {
      level: 1,
      title: '5. Retención de Datos',
      paragraphs: [
        'Conservamos su información personal solo por el tiempo necesario para cumplir los propósitos descritos en esta Política, cumplir obligaciones legales, resolver disputas y hacer cumplir nuestros acuerdos.',
        '• Datos de cuenta: Conservados durante la vigencia de su cuenta más 30 días después de la terminación.',
        '• Tokens de acceso OAuth (TikTok, etc.): Conservados hasta que desconecte la integración o se termine su cuenta, lo que ocurra primero. Al desconectar, los tokens son revocados y eliminados en 24 horas.',
        '• Registros de facturación: Conservados por 7 años para cumplir con regulaciones tributarias y contables de EE.UU.',
        '• Documentos fiscales y de inmigración: Conservados según los requisitos del IRS, USCIS y DIAN colombiana.',
      ],
    },
    {
      level: 1,
      title: '6. Seguridad de los Datos',
      paragraphs: [
        'Implementamos medidas técnicas y organizativas estándar de la industria para proteger su información, incluyendo:',
        '• Encriptación de datos en tránsito (TLS 1.2+) y en reposo (AES-256).',
        '• Controles de acceso y permisos basados en roles.',
        '• Auditorías de seguridad periódicas y evaluaciones de vulnerabilidades.',
        '• Autenticación multifactor para acceso administrativo.',
        '• Almacenamiento seguro de tokens OAuth con acceso restringido.',
        'A pesar de nuestras medidas, ningún método de transmisión o almacenamiento es 100% seguro. Si tomamos conocimiento de una violación de datos que afecte su información, le notificaremos a usted y a las autoridades correspondientes según lo exija la ley.',
      ],
    },
    {
      level: 1,
      title: '7. Cookies y Tecnologías de Seguimiento',
      paragraphs: [
        'Utilizamos cookies y tecnologías similares para:',
        '• Mantener su sesión autenticada.',
        '• Recordar sus preferencias y configuraciones.',
        '• Analizar patrones de uso y rendimiento del Servicio.',
        '• Detectar y prevenir fraude.',
        'Puede controlar las cookies a través de la configuración de su navegador. Deshabilitarlas puede limitar el uso de ciertas funciones.',
      ],
    },
    {
      level: 1,
      title: '8. Sus Derechos y Opciones',
      paragraphs: [
        'Dependiendo de su jurisdicción, puede tener los siguientes derechos:',
        '• Acceso: Solicitar una copia de la información personal que tenemos sobre usted.',
        '• Corrección: Solicitar la corrección de datos inexactos o incompletos.',
        '• Eliminación: Solicitar la eliminación de su información personal, sujeto a requerimientos legales de retención.',
        '• Portabilidad: Recibir sus datos en un formato estructurado y legible por máquina.',
        '• Retiro de Consentimiento: Desconectar integraciones de terceros o retirar el consentimiento de marketing en cualquier momento.',
        '• Oposición: Oponerse a ciertas actividades de procesamiento, incluyendo marketing.',
        '• No Discriminación (CCPA): No le discriminaremos por ejercer sus derechos de privacidad.',
        'Para ejercer estos derechos, escríbanos a info@apvsolutions.tech. Responderemos dentro de 30 días.',
      ],
    },
    {
      level: 2,
      title: '8.1 Desconectar Integraciones de Redes Sociales',
      paragraphs: [
        'Puede desconectar cualquier integración de terceros en cualquier momento desde la página de Configuración en APV Business Solutions. La desconexión inmediatamente:',
        '• Revoca el token de acceso OAuth de nuestros sistemas.',
        '• Detiene cualquier acción pendiente o programada en esa plataforma.',
        '• Elimina la información de perfil almacenada de la cuenta conectada en 24 horas.',
        'También puede revocar el acceso directamente desde la plataforma de terceros:',
        '• TikTok: App de TikTok → Configuración y privacidad → Seguridad → Administrar permisos de aplicaciones → APV Business Solutions → Eliminar.',
        '• Instagram/Facebook: Meta Business Suite → Configuración → Aplicaciones y sitios web → Eliminar APV Business Solutions.',
      ],
    },
    {
      level: 1,
      title: '9. Transferencias Internacionales de Datos',
      paragraphs: [
        'APV tiene su sede en Estados Unidos. Si accede a los Servicios desde fuera de EE.UU., su información será transferida y procesada en Estados Unidos, donde las leyes de protección de datos pueden diferir de las de su país. Al usar los Servicios, consiente esta transferencia.',
        'Para usuarios en el Espacio Económico Europeo (EEE), Reino Unido o Suiza, utilizamos Cláusulas Contractuales Estándar u otras salvaguardas apropiadas según lo requiere el GDPR.',
      ],
    },
    {
      level: 1,
      title: '10. Privacidad de Niños',
      paragraphs: [
        'Los Servicios no están dirigidos a personas menores de 18 años. No recopilamos a sabiendas información personal de niños. Si cree que hemos recopilado inadvertidamente información de un menor, contáctenos a info@apvsolutions.tech y la eliminaremos prontamente.',
      ],
    },
    {
      level: 1,
      title: '11. Derechos de Privacidad de California (CCPA)',
      paragraphs: [
        'Los residentes de California tienen derechos específicos bajo la Ley de Privacidad del Consumidor de California, incluyendo el derecho a saber, eliminar y optar por no participar en la "venta" de información personal. APV no vende información personal según la definición del CCPA. Para ejercer sus derechos CCPA, escriba a info@apvsolutions.tech.',
      ],
    },
    {
      level: 1,
      title: '12. Políticas de Privacidad de Plataformas de Terceros',
      paragraphs: [
        'Cuando utiliza integraciones de terceros, sus datos también están sujetos a las políticas de privacidad de esas plataformas:',
        '• TikTok: https://www.tiktok.com/legal/privacy-policy',
        '• Meta (Facebook/Instagram): https://www.facebook.com/privacy/policy',
        '• OpenAI: https://openai.com/policies/privacy-policy',
        '• ElevenLabs: https://elevenlabs.io/privacy',
        '• Google: https://policies.google.com/privacy',
      ],
    },
    {
      level: 1,
      title: '13. Cambios en esta Política de Privacidad',
      paragraphs: [
        'Podemos actualizar esta Política periódicamente. La versión actualizada se publicará en nuestro sitio web con una fecha de "Última Actualización" revisada. Para cambios materiales, proporcionaremos aviso adicional por email o notificación en la app.',
      ],
    },
    {
      level: 1,
      title: '14. Contáctenos',
      paragraphs: [
        'Si tiene preguntas sobre esta Política de Privacidad o nuestras prácticas de datos, contáctenos:',
        'APV Business Solutions LLC',
        'Oficina de Privacidad',
        'Tampa, Florida, Estados Unidos',
        'Email: info@apvsolutions.tech',
        'Sitio web: apvsolutions.tech',
      ],
    },
  ],
};

export const LEGAL_DOCS = {
  terms: {
    en: TERMS_EN,
    es: TERMS_ES,
  },
  privacy: {
    en: PRIVACY_EN,
    es: PRIVACY_ES,
  },
};

export const LABELS = {
  en: {
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
    effectiveDate: 'Effective Date',
    lastUpdated: 'Last Updated',
    company: 'Company',
    contact: 'Contact',
    close: 'Close',
    language: 'Language',
    document: 'Document',
  },
  es: {
    terms: 'Términos de Servicio',
    privacy: 'Política de Privacidad',
    effectiveDate: 'Fecha de Vigencia',
    lastUpdated: 'Última Actualización',
    company: 'Empresa',
    contact: 'Contacto',
    close: 'Cerrar',
    language: 'Idioma',
    document: 'Documento',
  },
};
