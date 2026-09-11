/**
 * content.ts — estructura tipo CMS.
 * Migrable 1:1 a Webflow CMS / Sanity / Contentful.
 */

export type Service = {
  slug: string;
  index: string;
  title: string;
  short: string;
  description: string;
  bullets: string[];
  image: string;
  category: "Taller" | "Interiorismo" | "Contract";
};

export type Article = {
  slug: string;
  title: string;
  category: string;
  date: string;
  read: string;
  excerpt: string;
  image: string;
  featured?: boolean;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  topic: string;
};

export type Office = {
  city: string;
  country: string;
  role: string;
  lat: number;
  lon: number;
  highlight?: boolean;
};

export const IMG = {
  heroLiving:
    "https://images.pexels.com/photos/8135496/pexels-photo-8135496.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1920",
  livingDark:
    "https://images.pexels.com/photos/6970061/pexels-photo-6970061.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1600",
  livingLight:
    "https://images.pexels.com/photos/34538288/pexels-photo-34538288.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1600",
  openPlan:
    "https://images.pexels.com/photos/8089172/pexels-photo-8089172.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=1800",
  kitchenWood:
    "https://images.pexels.com/photos/35021550/pexels-photo-35021550.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1600",
  kitchenMarble:
    "https://images.pexels.com/photos/36777559/pexels-photo-36777559.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1600",
  kitchenLight:
    "https://images.pexels.com/photos/6587896/pexels-photo-6587896.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1600",
  sofa:
    "https://images.pexels.com/photos/6970049/pexels-photo-6970049.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1600",
  sofaLuxe:
    "https://images.pexels.com/photos/7546323/pexels-photo-7546323.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1600",
  chaise:
    "https://images.pexels.com/photos/9207416/pexels-photo-9207416.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1600",
  workshopChisel:
    "https://images.pexels.com/photos/5974285/pexels-photo-5974285.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1600",
  workshopPolish:
    "https://images.pexels.com/photos/5711885/pexels-photo-5711885.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1600",
  workshopSaw:
    "https://images.pexels.com/photos/32357250/pexels-photo-32357250.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1600",
  workshopPlane:
    "https://images.pexels.com/photos/30907892/pexels-photo-30907892.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1600",
  workshopHand:
    "https://images.pexels.com/photos/37358117/pexels-photo-37358117.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1600",
  stair:
    "https://images.pexels.com/photos/18785353/pexels-photo-18785353.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1600",
  library:
    "https://images.pexels.com/photos/38545698/pexels-photo-38545698.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1600",
  samples:
    "https://images.pexels.com/photos/6583344/pexels-photo-6583344.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1400&w=1000",
  samplesWide:
    "https://images.pexels.com/photos/6583344/pexels-photo-6583344.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1600",
  fabrics:
    "https://images.pexels.com/photos/6580568/pexels-photo-6580568.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1400&w=1000",
  swatch:
    "https://images.pexels.com/photos/6580010/pexels-photo-6580010.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1400&w=1000",
  dining:
    "https://images.pexels.com/photos/27945011/pexels-photo-27945011.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1600",
  kitchenDining:
    "https://images.pexels.com/photos/7031911/pexels-photo-7031911.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1600",
  minimalSofa:
    "https://images.pexels.com/photos/34549302/pexels-photo-34549302.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1600",
  blueLiving:
    "https://images.pexels.com/photos/8082242/pexels-photo-8082242.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1600",
  atelierDesk:
    "https://images.pexels.com/photos/7147552/pexels-photo-7147552.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1400&w=1000",
  palette:
    "https://images.pexels.com/photos/6579994/pexels-photo-6579994.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1400&w=1000",
  bandsaw:
    "https://images.pexels.com/photos/5711226/pexels-photo-5711226.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1600",
  planeHand:
    "https://images.pexels.com/photos/5974248/pexels-photo-5974248.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1600",
};

export type NavItem = {
  label: string;
  href: string;
  route: "nosotros" | "servicios" | "insights" | "faq" | "contacto";
};

export const NAV: NavItem[] = [
  { label: "Nosotros", href: "#/nosotros", route: "nosotros" },
  { label: "Servicios", href: "#/servicios", route: "servicios" },
  { label: "Insights", href: "#/insights", route: "insights" },
  { label: "FAQ", href: "#/faq", route: "faq" },
  { label: "Contacto", href: "#/contacto", route: "contacto" },
];

/** Ciudades de Colombia — cobertura nacional (marquees del preloader y del hero). */
export const COLOMBIA_CITIES = [
  "Sogamoso",
  "Tunja",
  "Duitama",
  "Paipa",
  "Chiquinquirá",
  "Villa de Leyva",
  "Puerto Boyacá",
  "Bogotá",
  "Medellín",
  "Cali",
  "Barranquilla",
  "Cartagena",
  "Bucaramanga",
  "Cúcuta",
  "Pereira",
  "Manizales",
  "Armenia",
  "Ibagué",
  "Neiva",
  "Pasto",
  "Popayán",
  "Santa Marta",
  "Valledupar",
  "Montería",
  "Sincelejo",
  "Riohacha",
  "Villavicencio",
  "Yopal",
  "Arauca",
  "Florencia",
  "Mocoa",
  "Quibdó",
  "Leticia",
  "San Andrés",
  "Puerto Carreño",
  "Inírida",
  "Mitú",
  "San José del Guaviare",
  "Chía",
  "Zipaquirá",
  "Soacha",
  "Facatativá",
  "Fusagasugá",
  "Girardot",
  "Palmira",
  "Buenaventura",
  "Tuluá",
  "Buga",
  "Cartago",
  "Bello",
  "Envigado",
  "Itagüí",
  "Sabaneta",
  "Rionegro",
  "Apartadó",
  "Turbo",
  "Barrancabermeja",
  "Floridablanca",
  "Piedecuesta",
  "Girón",
  "Ocaña",
  "Pamplona",
  "Soledad",
  "Malambo",
  "Sabanalarga",
  "Magangué",
  "Mompox",
  "Maicao",
  "Ciénaga",
  "Fundación",
  "El Banco",
  "Plato",
  "Aguachica",
  "Ipiales",
  "Tumaco",
  "Dosquebradas",
  "La Dorada",
  "Honda",
  "Melgar",
  "Espinal",
  "Garzón",
  "Pitalito",
  "Sahagún",
  "Lorica",
  "Cereté",
];

export const TICKER_SERVICES = [
  "Carpintería a medida",
  "Cocinas de autor",
  "Remodelaciones integrales",
  "Sofás & tapicería",
  "Diseño de interiores",
  "Contract & Hospitality",
];

export const SERVICES: Service[] = [
  {
    slug: "carpinteria-a-medida",
    index: "01",
    title: "Carpintería a medida",
    short: "Mueble único, milímetro exacto",
    description:
      "Talleres propios con CNC de cinco ejes y acabado manual. Armarios, librerías, puertas, escaleras y piezas singulares fabricadas para un espacio concreto, no para un catálogo.",
    bullets: ["Roble, nogal, fresno y lacas mate", "Tolerancia ±0,02 mm", "Montaje en obra con equipo propio"],
    image: IMG.workshopChisel,
    category: "Taller",
  },
  {
    slug: "cocinas-de-autor",
    index: "02",
    title: "Cocinas de autor",
    short: "El corazón técnico de la casa",
    description:
      "Diseñamos la cocina como una máquina precisa: distribución de trabajo, almacenaje oculto, piedra natural y carpintería a medida con herrajes de cierre silencioso.",
    bullets: ["Piedra natural y porcelánico sinterizado", "Iluminación integrada en mueble alto", "Cocinas en 8 semanas"],
    image: IMG.kitchenWood,
    category: "Interiorismo",
  },
  {
    slug: "remodelaciones-integrales",
    index: "03",
    title: "Remodelaciones integrales",
    short: "Un solo equipo, todo el proceso",
    description:
      "Dirección de obra, instalaciones, albañilería, carpintería y acabado final bajo un único contrato y un único responsable. Cronograma con hitos semanales y precio cerrado.",
    bullets: ["Proyecto ejecutivo y licencias", "Equipos internos, sin subcontratas ocultas", "Garantía de 10 años"],
    image: IMG.workshopPlane,
    category: "Taller",
  },
  {
    slug: "sofas-tapiceria",
    index: "04",
    title: "Sofás & tapicería",
    short: "Confort con estructura de hardwood",
    description:
      "Estructuras de haya secada al horno, suspensiones de cinturón elástico y plumón envuelto. Cada sofá se tapiza a mano con tejidos naturales de proveedores europeos.",
    bullets: ["Más de 400 tejidos certificados", "Asientos de espuma fría de doble densidad", "Muestras físicas en 72 h"],
    image: IMG.sofa,
    category: "Taller",
  },
  {
    slug: "diseno-de-interiores",
    index: "05",
    title: "Diseño de interiores",
    short: "Dirección de arte del espacio",
    description:
      "Concepto, materialidad, iluminación y mobiliario. Trabajamos en planos, renders fotorrealistas y muestras físicas hasta que el proyecto se puede tocar.",
    bullets: ["Anteproyecto en 15 días", "Book de materiales físico", "Coordinación con arquitecto"],
    image: IMG.samples,
    category: "Interiorismo",
  },
  {
    slug: "contract-hospitality",
    index: "06",
    title: "Contract & Hospitality",
    short: "Series largas, plazos cortos",
    description:
      "Producción serializada para hoteles, restaurantes y oficinas: 400 habitaciones o 12.000 m² de coworking con control de calidad por lote y entrega escalonada.",
    bullets: ["Prototipo firmado antes de producción", "Control de calidad lote a lote", "Instalación nocturna"],
    image: IMG.dining,
    category: "Contract",
  },
];

export const ARTICLES: Article[] = [
  {
    slug: "roble-termotratado",
    title: "Roble termotratado: la madera que envejece mejor",
    category: "Materiales",
    date: "12 Feb 2026",
    read: "6 min",
    excerpt:
      "Cocido a 210 °C sin productos químicos, el roble termotratado gana estabilidad dimensional y un color caramelo permanente. Analizamos cuándo merece la pena.",
    image: IMG.workshopHand,
    featured: true,
  },
  {
    slug: "cocina-en-ocho-semanas",
    title: "Cómo entregamos una cocina completa en ocho semanas",
    category: "Proceso",
    date: "28 Ene 2026",
    read: "8 min",
    excerpt:
      "Del levantamiento láser a la última bisagra: nuestra secuencia real de fabricación con ventanas de producción paralelizadas.",
    image: IMG.kitchenMarble,
  },
  {
    slug: "tapiceria-natural",
    title: "Lino, lana y bouclé: guía honesta de tapicería natural",
    category: "Tapicería",
    date: "14 Ene 2026",
    read: "5 min",
    excerpt:
      "Qué tejidos aguantan una casa con niños, cuáles se manchan fácil y cuáles merecen un sofá de uso ocasional. Sin marketing.",
    image: IMG.swatch,
  },
  {
    slug: "iluminacion-mueble",
    title: "Iluminar el mueble: la capa invisible del interiorismo",
    category: "Interiorismo",
    date: "03 Ene 2026",
    read: "7 min",
    excerpt:
      "Temperatura de color, ángulo de corte y perfil empotrado. Tres decisiones que separan un mueble bueno de uno memorable.",
    image: IMG.livingDark,
  },
  {
    slug: "remodelar-sin-mudarse",
    title: "Remodelar sin mudarse: logística de obra en casa habitada",
    category: "Proceso",
    date: "18 Dic 2025",
    read: "9 min",
    excerpt:
      "Fases, protecciones, presión negativa y horarios. Cómo ejecutamos 180 m² en uso con una familia dentro.",
    image: IMG.workshopSaw,
  },
  {
    slug: "piedra-natural",
    title: "Mármol, cuarcita o porcelánico: elegir superficie de trabajo",
    category: "Materiales",
    date: "02 Dic 2025",
    read: "6 min",
    excerpt:
      "Dureza, porosidad y comportamiento ante el ácido del limón. Una comparativa técnica de las siete superficies que instalamos.",
    image: IMG.kitchenLight,
  },
  {
    slug: "sofa-medida",
    title: "Anatomía de un sofá que dura veinte años",
    category: "Taller",
    date: "21 Nov 2025",
    read: "7 min",
    excerpt:
      "Estructura, suspensión, núcleo y funda: desmontamos uno de nuestros sofás pieza a pieza para enseñar qué se paga de verdad.",
    image: IMG.sofaLuxe,
  },
  {
    slug: "contract-hoteles",
    title: "420 habitaciones en 90 días: contrato hotelero real",
    category: "Contract",
    date: "07 Nov 2025",
    read: "10 min",
    excerpt:
      "Producción por lotes, control de calidad in situ y instalación nocturna por plantas. Caso práctico en Lisboa.",
    image: IMG.minimalSofa,
  },
  {
    slug: "color-2026",
    title: "Paleta 2026: tierra cruda, humo y un azul eléctrico",
    category: "Interiorismo",
    date: "24 Oct 2025",
    read: "4 min",
    excerpt:
      "Nuestro estudio de color para el próximo ejercicio, con combinaciones probadas en obra real.",
    image: IMG.palette,
  },
];

export const FAQS: Faq[] = [
  {
    id: "faq-1",
    topic: "Fabricación",
    question: "¿Fabrican ustedes los muebles o solo diseñan?",
    answer:
      "Las dos cosas. Iraka opera talleres propios de carpintería, ebanistería y tapicería: diseñamos, fabricamos e instalamos con equipos internos. No tercerizamos la producción, así que respondemos del resultado de principio a fin.",
  },
  {
    id: "faq-2",
    topic: "Plazos",
    question: "¿Cuánto tarda una remodelación integral?",
    answer:
      "Una vivienda completa se ejecuta entre 10 y 20 semanas según la superficie, el patrimonio y el nivel de detalle. Antes de firmar te entregamos un cronograma con hitos semanales y una penalización si el retraso es responsabilidad nuestra.",
  },
  {
    id: "faq-3",
    topic: "Presupuesto",
    question: "¿Trabajan con presupuesto cerrado?",
    answer:
      "Sí. Después del anteproyecto fijamos un precio cerrado con el costo desglosado por capítulos. El total solo cambia si tú agregas alcance: cada cambio se aprueba por escrito antes de ejecutarse.",
  },
  {
    id: "faq-4",
    topic: "Geografía",
    question: "¿Trabajan fuera de Boyacá y de Colombia?",
    answer:
      "Sí. Nuestra sede y taller principal están en Sogamoso (Boyacá), con showroom en Bogotá y equipos en Medellín y Cali. Además operamos en 9 países: la producción internacional se coordina desde Sogamoso con talleres asociados en Miami, Ciudad de México, Madrid y Milán, y los equipos de instalación viajan con la obra.",
  },
  {
    id: "faq-5",
    topic: "Materiales",
    question: "¿Puedo elegir madera, piedra y tejido yo mismo?",
    answer:
      "Por supuesto. Recibirás un book físico con muestras reales de maderas, piedras, lacas y más de 400 tejidos certificados. Si lo prefieres, nuestro estudio de materiales te propone tres combinaciones cerradas.",
  },
  {
    id: "faq-6",
    topic: "Mantenimiento",
    question: "¿Qué mantenimiento necesita un mueble de madera maciza?",
    answer:
      "Poca cosa: aceitado anual en encimeras y tratamiento de cera cada dos años en piezas lacadas. Entregamos un manual de cuidado por pieza y disponemos de servicio de restauración de por vida.",
  },
  {
    id: "faq-7",
    topic: "Garantía",
    question: "¿Qué garantía tienen las piezas y la obra?",
    answer:
      "10 años en estructura y carpintería, 5 años en herrajes y mecanismos, y 2 años en tapicería. La garantía es directamente nuestra, no de un fabricante intermediario.",
  },
  {
    id: "faq-8",
    topic: "Proceso",
    question: "¿Cómo empiezo un proyecto con Iraka?",
    answer:
      "Escribes por el formulario o al correo del estudio. Hacemos una llamada de 30 minutos, visitamos el espacio, entregamos anteproyecto en 15 días y presupuesto cerrado en 21. Sin coste hasta la firma del anteproyecto.",
  },
];

/** El primer elemento es la SEDE CENTRAL. `highlight` marca el punto rojo en mapa y globo. */
export const OFFICES: Office[] = [
  {
    city: "Sogamoso",
    country: "Boyacá, Colombia",
    role: "Sede central & taller principal",
    lat: 5.71,
    lon: -72.93,
    highlight: true,
  },
  { city: "Bogotá", country: "Colombia", role: "Showroom & estudio", lat: 4.71, lon: -74.07 },
  { city: "Medellín", country: "Colombia", role: "Taller contract", lat: 6.25, lon: -75.56 },
  { city: "Cali", country: "Colombia", role: "Instalaciones & obra", lat: 3.45, lon: -76.53 },
  { city: "Miami", country: "Estados Unidos", role: "Hub Norteamérica", lat: 25.76, lon: -80.19 },
  { city: "Ciudad de México", country: "México", role: "Showroom & obra", lat: 19.43, lon: -99.13 },
  { city: "Madrid", country: "España", role: "Oficina Europa", lat: 40.42, lon: -3.7 },
  { city: "Milán", country: "Italia", role: "Estudio de diseño", lat: 45.46, lon: 9.19 },
  { city: "Lisboa", country: "Portugal", role: "Taller contract", lat: 38.72, lon: -9.14 },
  { city: "Berlín", country: "Alemania", role: "Taller ebanistería", lat: 52.52, lon: 13.4 },
  { city: "Dubái", country: "Emiratos Árabes", role: "Proyectos Oriente Medio", lat: 25.2, lon: 55.27 },
  { city: "São Paulo", country: "Brasil", role: "Fábrica de series", lat: -23.55, lon: -46.63 },
];

/** Datos de la sede — un solo lugar para dirección, teléfono y horario. */
export const HQ = {
  city: "Sogamoso",
  region: "Boyacá",
  country: "Colombia",
  street: "Carrera 11 № 14-25, Centro",
  postal: "152210",
  phone: "+57 608 770 0000",
  phoneHref: "tel:+576087700000",
  mobile: "+57 322 252 3331",
  email: "hola@iraka.co",
  hours: "Lunes a viernes, 08:00 — 18:00 (COT)",
};

export const STATS = [
  { value: 2500, suffix: "+", label: "Piezas fabricadas al mes", decimals: 0 },
  { value: 98.2, suffix: "%", label: "Entregas en fecha", decimals: 1 },
  { value: 8, suffix: "+", label: "Años de taller", decimals: 0 },
  { value: 120, suffix: "", label: "Artesanos en plantilla", decimals: 0 },
];

export const PROCESS = [
  {
    n: "01",
    title: "Escucha",
    text: "Llamada de 30 minutos y visita al espacio. Medimos con láser y entendemos cómo vives, no solo cómo es la planta.",
  },
  {
    n: "02",
    title: "Concepto",
    text: "Anteproyecto en 15 días: plantas, materialidad y tres direcciones estéticas con book físico de muestras.",
  },
  {
    n: "03",
    title: "Fabricación",
    text: "Producción en taller propio con control dimensional por pieza. Fotografías de avance cada semana.",
  },
  {
    n: "04",
    title: "Instalación",
    text: "Montaje con equipo interno, ajuste in situ y pulido final. Entrega con manual de cuidado y garantía firmada.",
  },
];

export const VALUES = [
  {
    title: "Precisión obsesiva",
    text: "Tolerancias de ±0,02 mm en carpintería y juntas a 45° sin marco visible. Lo medimos todo; lo que no se mide, se improvisa.",
  },
  {
    title: "Materia honesta",
    text: "Madera maciza de origen certificado FSC, piedra natural y tejidos libres de retardantes innecesarios. Nada que finja ser otra cosa.",
  },
  {
    title: "Un solo responsable",
    text: "Contrato único, interlocutor único. Cuando el equipo es interno, no hay nadie a quien echar la culpa: solo nosotros.",
  },
];
