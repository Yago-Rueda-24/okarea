export const SERVICES_MOCK = [
  {
    id: 'auditoria',
    title: 'Auditoría & Limpieza de Armario Digital',
    duration: '90 min',
    icon: 'inventory_2',
    description:
      'Clasificación metódica de su guardarropa actual. Descarte consciente, detección de vacíos de archivo y revitalización de piezas olvidadas.',
    bullets: [
      'Depuración de hasta 60 prendas',
      'Matriz de conservación de tejidos',
    ],
    price: 185,
    isHighlight: false,
    isMonthly: false,
  },
  {
    id: 'colorimetria',
    title: 'Estudio de Colorimetría & Morfología',
    duration: '60 min',
    icon: 'palette',
    description:
      'Identificación de su estación cromática estacional y arquitectura corporal con métricas de corte, solapas, largos y contrastes armónicos.',
    bullets: [
      'Paleta digital de 36 tonos exactos',
      'Guía de siluetas y patronaje',
    ],
    price: 140,
    isHighlight: true,
    isMonthly: false,
  },
  {
    id: 'capsula',
    title: 'Creación de Cápsula o Evento',
    duration: '45 min',
    icon: 'auto_awesome',
    description:
      'Composición impecable para semanas de la moda, viajes estratégicos, galas de beneficencia o transiciones clave de temporada.',
    bullets: [
      '5 looks integrales de alta costura',
      'Accesorios, joyería y calzado',
    ],
    price: 120,
    isHighlight: false,
    isMonthly: false,
  },
  {
    id: 'suscripcion',
    title: 'Suscripción Stylist Mensual',
    duration: 'Recurrente',
    icon: 'all_inclusive',
    description:
      'Dirección creativa continua. Asignación perpetua de su archivista de cabecera con consultoría vía mensajería prioritaria directa.',
    bullets: [
      '2 sesiones mensuales de 45 min',
      'Revisión previa de compras de lujo',
    ],
    price: 240,
    isHighlight: false,
    isMonthly: true,
  },
];

export const STYLISTS_MOCK = [
  {
    id: 'clara-vidal',
    name: 'Clara Vidal Royo',
    location: 'París / Madrid',
    specialty: 'Sastrería & Alta Costura',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDFIcotMQjRsoE7l7JFlwdvPTXZCKI7hYWY1tZKCw4rty0T7KUqUZr2jIj4Eu9rtazr1nKf2G1ZbVIZXaVwwnw7T-6Gx4QCuhSxvba27lciisWwCworRQmNXpG3cgK-xpPB7es6st_AWckXCgo97TuPF4iAwygThs3sLdnBW2uTsGF-Cy_BV0mptZQx_wmpVF__t-MFH-dQ_Bh7dyamSOZ-vrAOcgKWD88ZUor09ws',
  },
  {
    id: 'julian-bernard',
    name: 'Julián Bernard',
    location: 'Milán / Barcelona',
    specialty: 'Minimalismo & Siluetas Arquitectónicas',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBTQXl1V8FQXf4N3Xq8f3oyQXqSnzvVOH4zorOPkULdHs5Ovt-pkco8oLttC-4BmXP-EEQN4o2OE3OJ22RILD_XH7liEE24XEMwJ8yiK1DRTJzTNQIPjVhLwF31_yHiQns4KJbK6IQG1d69L7UzGd9RXSyBNLiH6hTtXLRjOBOefC8noADO1CeBLoNiWc7v9PaT21VFE_U56Mfq1kmiZRWc2GQuedYbOD-pS6cB8Mo',
  },
  {
    id: 'sofia-altamira',
    name: 'Sofía Altamira',
    location: 'Londres / Madrid',
    specialty: 'Colorimetría & Armarios Cápsula',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA4UIqodpmeeIGlSdKMIhlXaB5qiUP-jcz2jhfWAszco0Knt402YFHjhqgiM9qU7niadUqxUkqgGxqpeWYIo21ilPw19YFA3ApgnUC_FltDbJh-rq_rFi25aVXGr-5_pL-TXDcnx24Gb9iP_aTN5NNh1BBS4KlYU9y0FmnDu0EcG4ORRDChD1Di9DJ7wH_sODOhc8HaJJM2aPzwd4THPL2sNqJrpEsHJNiNLqcC7hU',
  },
];

export const DAYS_MOCK = [
  { id: 'd-14', label: 'LUN', date: '14', fullDate: 'Lun 14 Oct', slots: '2 slots' },
  { id: 'd-15', label: 'MAR', date: '15', fullDate: 'Mar 15 Oct', slots: '4 slots' },
  { id: 'd-16', label: 'MIÉ', date: '16', fullDate: 'Mié 16 Oct', slots: '3 slots' },
  { id: 'd-17', label: 'JUE', date: '17', fullDate: 'Jue 17 Oct', slots: '5 slots' },
  { id: 'd-18', label: 'VIE', date: '18', fullDate: 'Vie 18 Oct', slots: '1 slot' },
];

export const TIME_SLOTS_MOCK = [
  '10:30 - 12:00',
  '12:30 - 14:00',
  '16:00 - 17:30',
  '18:00 - 19:30',
];

export const DELIVERABLES_MOCK = [
  { icon: 'videocam', label: 'Videollamada 1 a 1 de alta fidelidad' },
  { icon: 'menu_book', label: 'Dossier Editorial PDF (20+ páginas)' },
  { icon: 'shopping_bag', label: 'Lista de adquisiciones priorizadas' },
  { icon: 'chat', label: '15 días de soporte concierge privado' },
];

export const FAQ_ITEMS_MOCK = [
  {
    id: 'faq-1',
    question: '¿Cómo debo preparar mis prendas antes de la videollamada?',
    answer:
      "Recomendamos tener sincronizadas las prendas en la sección 'Prendas' de Vestiaire Studio. Para piezas que aún no haya digitalizado, manténgalas a mano sobre una superficie iluminada o perchas neutras para evaluarlas en vivo mediante su cámara.",
  },
  {
    id: 'faq-2',
    question: '¿Qué ocurre si necesito reprogramar mi sesión VIP?',
    answer:
      'Puede modificar la fecha y la hora directamente desde el panel de usuario o comunicándose con el Concierge hasta 24 horas antes sin ningún recargo. Las cancelaciones posteriores retienen un 30% en concepto de bloqueo de agenda de nuestro estilista.',
  },
  {
    id: 'faq-3',
    question: '¿En qué formato recibiré mi Dossier Editorial tras la consulta?',
    answer:
      'En un plazo máximo de 48 horas laborales tras su llamada, se alojará en su perfil un documento PDF en alta resolución con maquetación editorial. Incluye diagramas morfológicos, paleta cromática pantone interactiva y enlaces directos a posibles adquisiciones de sastrería recomendadas.',
  },
  {
    id: 'faq-4',
    question: '¿Puedo cambiar de estilista residencial si adquiero la suscripción mensual?',
    answer:
      'Absolutamente. La suscripción le brinda la flexibilidad de rotar de profesional cada mes si desea abordar un reto específico, como transicionar de un enfoque minimalista hacia indumentaria de alta etiqueta para galas.',
  },
];
