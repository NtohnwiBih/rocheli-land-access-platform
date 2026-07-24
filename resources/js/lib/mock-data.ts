export type Property = {
  [x: string]: ReactI18NextChildren | Iterable<ReactI18NextChildren>;
  id: string;
  title: string;
  location: string;
  price: string;
  priceValue: number;
  size: string;
  status: "Available" | "Fast Selling" | "Sold Out" | "New Launch";
  type: "Residential" | "Commercial" | "Beachfront" | "Mixed-Use";
  installment: boolean;
  image: string;
  gallery: string[];
  features: string[];
  titleDeed: string;
  utilities: string[];
  coordinates: string;
  description: string;
};

export const properties: Property[] = [
  {
    id: "kribi-emerald-coast",
    title: "Emerald Coast Estate",
    location: "Kribi, South Region",
    price: "FCFA 18.5M",
    priceValue: 18500000,
    size: "500 m²",
    status: "Fast Selling",
    type: "Beachfront",
    installment: true,
    image: "/property-3.jpg",
    gallery: ["/property-3.jpg", "/property-1.jpg", "/property-2.jpg", "/property-4.jpg"],
    features: ["Ocean View", "Paved Access", "24/7 Security", "Water & Power"],
    titleDeed: "Registered Land Title",
    utilities: ["Electricity", "Borehole Water", "Fibre Internet"],
    coordinates: "2.9404° N, 9.9098° E",
    description:
      "A limited-release beachfront community minutes from Kribi's protected coastline. Fully surveyed, fenced, and ready to build.",
  },
  {
    id: "douala-palm-heights",
    title: "Palm Heights Residences",
    location: "Douala V, Littoral",
    price: "FCFA 24.9M",
    priceValue: 24900000,
    size: "400 m²",
    status: "New Launch",
    type: "Residential",
    installment: true,
    image: "/property-1.jpg",
    gallery: ["/property-1.jpg", "/property-4.jpg", "/property-2.jpg", "/property-3.jpg"],
    features: ["Gated Community", "Clubhouse", "Green Belt", "CCTV"],
    titleDeed: "Global Land Title",
    utilities: ["ENEO Grid", "CAMWATER", "Optical Fibre"],
    coordinates: "4.0511° N, 9.7679° E",
    description:
      "Move-in-ready serviced plots inside a master-planned neighborhood with schools, a wellness center, and retail promenade.",
  },
  {
    id: "yaounde-summit-hills",
    title: "Summit Hills",
    location: "Yaoundé, Nkolbisson",
    price: "FCFA 9.8M",
    priceValue: 9800000,
    size: "600 m²",
    status: "Available",
    type: "Residential",
    installment: true,
    image: "/property-2.jpg",
    gallery: ["/property-2.jpg", "/property-4.jpg", "/property-1.jpg", "/property-3.jpg"],
    features: ["Panoramic Views", "Elevated Terrain", "Tarred Road", "Zoning Certificate"],
    titleDeed: "Land Certificate",
    utilities: ["Electricity", "Water", "Waste Management"],
    coordinates: "3.8480° N, 11.4515° E",
    description:
      "Elevated hillside plots overlooking Yaoundé's western skyline. Ideal for private villas and family estates.",
  },
  {
    id: "buea-mountain-view",
    title: "Mountain View Enclave",
    location: "Buea, South-West",
    price: "FCFA 12.2M",
    priceValue: 12200000,
    size: "550 m²",
    status: "Available",
    type: "Mixed-Use",
    installment: true,
    image: "/property-4.jpg",
    gallery: ["/property-4.jpg", "/property-2.jpg", "/property-1.jpg", "/property-3.jpg"],
    features: ["Mount Cameroon View", "Cool Climate", "Fibre Ready", "Perimeter Wall"],
    titleDeed: "Registered Land Title",
    utilities: ["Solar-ready Grid", "Spring Water", "Internet"],
    coordinates: "4.1560° N, 9.2626° E",
    description:
      "A boutique enclave at the foot of Mount Cameroon offering cool weather, clean air, and proximity to the university district.",
  },
  {
    id: "bafoussam-vineyard",
    title: "Vineyard Ridge",
    location: "Bafoussam, West",
    price: "FCFA 7.4M",
    priceValue: 7400000,
    size: "700 m²",
    status: "Available",
    type: "Residential",
    installment: true,
    image: "/property-2.jpg",
    gallery: ["/property-2.jpg", "/property-4.jpg", "/property-1.jpg", "/property-3.jpg"],
    features: ["Fertile Soil", "Rolling Hills", "Farm-Ready", "Access Road"],
    titleDeed: "Land Certificate",
    utilities: ["Electricity", "Water", "Community Center"],
    coordinates: "5.4737° N, 10.4176° E",
    description:
      "Peaceful highland plots surrounded by coffee estates, perfect for weekend homes and agri-lifestyle projects.",
  },
  {
    id: "limbe-atlantic-bay",
    title: "Atlantic Bay Villas",
    location: "Limbe, South-West",
    price: "FCFA 21.6M",
    priceValue: 21600000,
    size: "450 m²",
    status: "Fast Selling",
    type: "Beachfront",
    installment: true,
    image: "/property-3.jpg",
    gallery: ["/property-3.jpg", "/property-1.jpg", "/property-4.jpg", "/property-2.jpg"],
    features: ["Black Sand Beach", "Marina Access", "Tourism Zone", "Concierge"],
    titleDeed: "Registered Land Title",
    utilities: ["ENEO Grid", "Desalinated Water", "Fibre"],
    coordinates: "4.0186° N, 9.2085° E",
    description:
      "A boutique beachfront address between the botanical gardens and the marina. Limited plots per phase.",
  },
];

export const testimonials = [
  {
    name: "Amina Nkeng",
    role: "Growth Plan Member",
    property: "Palm Heights, Douala",
    quote:
      "I started with FCFA 50,000 monthly. Two years later I received my land title. Rocheli made ownership feel almost effortless.",
    initials: "AN",
  },
  {
    name: "Jean-Pierre Mballa",
    role: "Prime Plan Member",
    property: "Emerald Coast, Kribi",
    quote:
      "The team walked me through every step — verification, legal, allocation. This is the future of real estate in Cameroon.",
    initials: "JM",
  },
  {
    name: "Clarisse Fomba",
    role: "Starter Plan Member",
    property: "Summit Hills, Yaoundé",
    quote:
      "For the first time I saw a savings plan that actually gives me something I can touch — a plot in my name.",
    initials: "CF",
  },
  {
    name: "Etienne Ndongo",
    role: "Advance Plan Member",
    property: "Mountain View, Buea",
    quote:
      "Transparent, professional and structured. I recommend Rocheli to every young professional building wealth.",
    initials: "EN",
  },
];

export const articles = [
  {
    id: "why-land-cameroon",
    title: "Why land remains Cameroon's most resilient asset",
    category: "Investment",
    readTime: "6 min read",
    author: "Rocheli Research",
    date: "March 2025",
    image: "/property-2.jpg",
  },
  {
    id: "verify-land-title",
    title: "The 7 checks every buyer must run before signing",
    category: "Guides",
    readTime: "8 min read",
    author: "Legal Desk",
    date: "February 2025",
    image: "/property-4.jpg",
  },
  {
    id: "structured-savings",
    title: "Structured savings vs. traditional plots: what the numbers say",
    category: "Wealth",
    readTime: "5 min read",
    author: "Rocheli Studio",
    date: "January 2025",
    image: "/property-1.jpg",
  },
];

export const team = [
  { name: "Roger Ateba", role: "Founder & Chief Executive", initials: "RA" },
  { name: "Chelsea Mengue", role: "Chief Operations Officer", initials: "CM" },
  { name: "Ibrahim Sadou", role: "Head of Legal & Land Titles", initials: "IS" },
  { name: "Nadège Fotso", role: "Director, Member Experience", initials: "NF" },
  { name: "Blaise Kamdem", role: "Head of Property Development", initials: "BK" },
  { name: "Estelle Njoya", role: "Head of Finance & Compliance", initials: "EN" },
];


export const plans = [
  {
    name: "Starter",
    tagline: "Begin your ownership journey",
    total: "2M",
    currency: "FCFA",
    daily: "2,500 F",
    weekly: "15,000 F",
    monthly: "65,000 F",
    horizon: "36 months",
    features: [
      "Access to peripheral plots",
      "Quarterly member reports",
      "Digital title tracking",
      "1 property reservation slot",
    ],
    highlight: false,
  },
  {
    name: "Growth",
    tagline: "For steady wealth builders",
    total: "3M",
    currency: "FCFA",
    daily: "5,000 F",
    weekly: "25,000 F",
    monthly: "100,000 F",
    horizon: "30 months",
    features: [
      "Access to urban serviced plots",
      "Priority allocation window",
      "Free legal verification",
      "2 property reservation slots",
    ],
    highlight: false,
  },
  {
    name: "Advance",
    tagline: "Accelerated acquisition path",
    total: "5M",
    currency: "FCFA",
    daily: "10,000 F",
    weekly: "50,000 F",
    monthly: "175,000 F",
    horizon: "24 months",
    features: [
      "Access to premium developments",
      "Dedicated relationship manager",
      "Free titling & registration",
      "3 property reservation slots",
      "Resale marketplace priority",
    ],
    highlight: true,
  },
  {
    name: "Prime",
    tagline: "Concierge ownership for principals",
    total: "10M",
    currency: "FCFA",
    daily: "10,000+ F",
    weekly: "75,000+ F",
    monthly: "300,000+ F",
    horizon: "18 months",
    features: [
      "Beachfront & flagship inventory",
      "White-glove concierge team",
      "Full legal & tax structuring",
      "Unlimited reservations",
      "Guaranteed buy-back option",
      "Private investor briefings",
    ],
    highlight: false,
  },
];

export const stats = [
  { value: 5000, suffix: "+", label: "Active members" },
  { value: 2000, suffix: "+", label: "Properties allocated" },
  { value: 15000, suffix: "", label: "Acres under management" },
  { value: 2.5, suffix: "B", prefix: "FCFA ", label: "Member contributions" },
];
