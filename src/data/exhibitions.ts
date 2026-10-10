export type ExhibitionType =
  | "individual"
  | "colectiva"
  | "premio"
  | "prensa"
  | "biografía";

export type Exhibition = {
  year: string;
  title: string;
  venue: string;
  city: string;
  country: string;
  type: ExhibitionType;
  url?: string;
};

export type CareerPanel = {
  id: "biografia" | "individuales" | "colectivas" | "premios" | "prensa";
  label: string;
  labelEn: string;
  eyebrow: string;
  color: string;
  summary: string;
  summaryEn: string;
  items: Exhibition[];
};

export type EssentialHighlight = {
  id: string;
  title: string;
  titleEn: string;
  eyebrow: string;
  year: string;
  venue: string;
  city: string;
  country: string;
  summary: string;
  summaryEn: string;
  image: string;
  color: string;
  url?: string;
};

export type CareerStage = {
  year: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
};

// Dato pendiente de confirmar con Sandra: se muestra como "—".
const pending = "";

export const essentialHighlights: EssentialHighlight[] = [
  {
    id: "aglutinador",
    title: "Espacio Aglutinador",
    titleEn: "Espacio Aglutinador",
    eyebrow: "Obra / Archivo",
    year: "1994",
    venue: "Espacio Aglutinador",
    city: "La Habana",
    country: "Cuba",
    summary:
      "Aglutinador forma parte central de su obra: práctica curatorial, archivo vivo y primer espacio independiente sostenido en Cuba.",
    summaryEn:
      "Aglutinador is central to her work: curatorial practice, living archive and the first sustained independent art space in Cuba.",
    image: "/_career/aglutinador",
    color: "#cf5d47",
    url: "https://www.espacioaglutinador.com/"
  },
  {
    id: "documenta",
    title: "documenta fifteen",
    titleEn: "documenta fifteen",
    eyebrow: "Reconocimiento",
    year: "2022",
    venue: "documenta Halle",
    city: "Kassel",
    country: "Alemania",
    summary:
      "INSTAR presentó eventos dedicados a Aglutinador y a prácticas autónomas, con Sandra Ceballos como invitada.",
    summaryEn:
      "INSTAR presented events around Aglutinador and autonomous practices, with Sandra Ceballos as invited guest.",
    image: "/_career/documenta",
    color: "#cf5d47",
    url: "https://documenta-fifteen.de/en/calendar/27-anos-de-espacio-aglutinador/"
  },
  {
    id: "reina-sofia",
    title: "Museo Reina Sofía",
    titleEn: "Reina Sofía Museum",
    eyebrow: "Museo",
    year: pending,
    venue: "Museo Nacional Centro de Arte Reina Sofía",
    city: "Madrid",
    country: "España",
    summary:
      "Su obra figura en perfiles públicos como presentada en una de las instituciones clave del arte contemporáneo en España.",
    summaryEn:
      "Public profiles list her work as shown at one of Spain's key contemporary art institutions.",
    image: "/_career/reina-sofia",
    color: "#cf5d47"
  },
  {
    id: "museo-barrio",
    title: "El Museo del Barrio",
    titleEn: "El Museo del Barrio",
    eyebrow: "Museo",
    year: pending,
    venue: "El Museo del Barrio",
    city: "Nueva York",
    country: "Estados Unidos",
    summary:
      "Institución esencial para arte latino, latinoamericano y caribeño en Nueva York; aparece entre sus hitos expositivos.",
    summaryEn:
      "A key New York institution for Latinx, Latin American and Caribbean art, listed among her exhibition milestones.",
    image: "/_career/museo-barrio",
    color: "#cf5d47"
  },
  {
    id: "bellas-artes",
    title: "Museo Nacional de Bellas Artes de Cuba",
    titleEn: "National Museum of Fine Arts of Cuba",
    eyebrow: "Premio / Colección",
    year: "1995",
    venue: "Museo Nacional de Bellas Artes de Cuba",
    city: "La Habana",
    country: "Cuba",
    summary:
      "Sede del Premio Nacional Anual de Pintura Contemporánea Juan Francisco Elso y colección pública clave.",
    summaryEn:
      "Venue of the Juan Francisco Elso contemporary painting prize and a key public collection.",
    image: "/_career/bellas-artes",
    color: "#cf5d47"
  },
  {
    id: "macba",
    title: "MACBA",
    titleEn: "MACBA",
    eyebrow: "Museo / perfil",
    year: "2025",
    venue: "Museu d'Art Contemporani de Barcelona",
    city: "Barcelona",
    country: "España",
    summary:
      "Perfil institucional actualizado que sitúa su obra dentro de colecciones y trayectorias internacionales.",
    summaryEn:
      "Updated institutional profile situating her work within international collections and career references.",
    image: "/_career/macba",
    color: "#cf5d47",
    url: "https://www.macba.cat/en/actor/sandra-ceballos/"
  },
  {
    id: "cintas",
    title: "CINTAS Foundation",
    titleEn: "CINTAS Foundation",
    eyebrow: "Beca",
    year: "2022",
    venue: "CINTAS Foundation",
    city: "Miami",
    country: "Estados Unidos",
    summary:
      "Beca CINTAS en artes visuales, una distinción clave para creadores cubanos y de ascendencia cubana.",
    summaryEn:
      "CINTAS visual arts fellowship, a key distinction for Cuban and Cuban-descendant creators.",
    image: "/_career/cintas",
    color: "#cf5d47",
    url: "https://cintasfoundation.org/index.php/fellows"
  },
  {
    id: "art-journal",
    title: "Art Journal Open",
    titleEn: "Art Journal Open",
    eyebrow: "Prensa",
    year: "2025",
    venue: "College Art Association",
    city: "Nueva York",
    country: "Estados Unidos",
    summary:
      "Publicó una conversación extensa sobre democracia, censura, práctica artística y Aglutinador.",
    summaryEn:
      "Published an extensive conversation on democracy, censorship, artistic practice and Aglutinador.",
    image: "/_career/art-journal",
    color: "#cf5d47",
    url: "https://artjournal.collegeart.org/?p=19167"
  }
];

export const careerStages: CareerStage[] = [
  {
    year: "1961",
    title: "Guantánamo",
    titleEn: "Guantánamo",
    summary: "Nace en Guantánamo, Cuba.",
    summaryEn: "Born in Guantánamo, Cuba."
  },
  {
    year: "1983/1985",
    title: "San Alejandro",
    titleEn: "San Alejandro",
    summary: "Formación en la Escuela de Artes Plásticas San Alejandro, La Habana.",
    summaryEn: "Training at the San Alejandro School of Fine Arts, Havana."
  },
  {
    year: "1994",
    title: "Aglutinador",
    titleEn: "Aglutinador",
    summary: "Cofunda Espacio Aglutinador junto a Ezequiel Suárez.",
    summaryEn: "Co-founds Espacio Aglutinador with Ezequiel Suárez."
  },
  {
    year: "1997",
    title: "Nueva York / Buffalo",
    titleEn: "New York / Buffalo",
    summary: "Residencia y exhibición con Art in General, Longwood Project y Hallwalls.",
    summaryEn: "Residency and exhibition through Art in General, Longwood Project and Hallwalls."
  },
  {
    year: "2022",
    title: "CINTAS / documenta",
    titleEn: "CINTAS / documenta",
    summary: "Beca CINTAS y presencia de Aglutinador en documenta fifteen.",
    summaryEn: "CINTAS fellowship and Aglutinador's presence at documenta fifteen."
  },
  {
    year: "2024/2025",
    title: "ARC / Art Journal",
    titleEn: "ARC / Art Journal",
    summary: "Beca RESILIENCE y conversación publicada por Art Journal Open.",
    summaryEn: "RESILIENCE Fellowship and conversation published by Art Journal Open."
  }
];

export const careerPanels: CareerPanel[] = [
  {
    id: "biografia",
    label: "Biografía",
    labelEn: "Biography",
    eyebrow: "01",
    color: "#d8e6ee",
    summary:
      "Artista multidisciplinar y curadora cubana, nacida en Guantánamo. Cofundadora de Espacio Aglutinador en La Habana.",
    summaryEn:
      "Cuban multidisciplinary artist and curator, born in Guantánamo. Co-founder of Espacio Aglutinador in Havana.",
    items: [
      {
        year: "1961",
        title: "Nacimiento de Sandra Ceballos",
        venue: "",
        city: "Guantánamo",
        country: "Cuba",
        type: "biografía",
        url: "https://www.macba.cat/en/actor/sandra-ceballos/"
      },
      {
        year: "1983/1985",
        title: "Formación en la Escuela de Artes Plásticas San Alejandro",
        venue: "San Alejandro",
        city: "La Habana",
        country: "Cuba",
        type: "biografía"
      },
      {
        year: "1994",
        title: "Cofundación de Espacio Aglutinador junto a Ezequiel Suárez",
        venue: "Espacio Aglutinador",
        city: "La Habana",
        country: "Cuba",
        type: "biografía",
        url: "https://www.espacioaglutinador.com/"
      }
    ]
  },
  {
    id: "individuales",
    label: "Exposiciones individuales",
    labelEn: "Solo exhibitions",
    eyebrow: "02",
    color: "#79927e",
    summary:
      "Selección de hitos localizados en fuentes públicas y documentación de trayectoria.",
    summaryEn:
      "Selection of milestones found in public sources and career documentation.",
    items: [
      {
        year: "2024",
        title: "Desamparo con alevosía",
        venue: "Galería Plus Artists",
        city: "Madrid",
        country: "España",
        type: "individual"
      },
      {
        year: pending,
        title: "Diálogo de Sandra y Manuel Vidal",
        venue: "Galería L",
        city: "La Habana",
        country: "Cuba",
        type: "individual"
      },
      {
        year: pending,
        title: "Paisajes y paradojas",
        venue: "Centro de Arte de 23 y 12",
        city: "La Habana",
        country: "Cuba",
        type: "individual"
      }
    ]
  },
  {
    id: "colectivas",
    label: "Exposiciones colectivas",
    labelEn: "Group exhibitions",
    eyebrow: "03",
    color: "#ead1c7",
    summary:
      "Selección de sedes y muestras mencionadas en perfiles públicos.",
    summaryEn:
      "Selection of venues and exhibitions mentioned in public profiles.",
    items: [
      {
        year: "1997",
        title: "1990's Art from Cuba: A National Residency and Exhibition Program",
        venue: "Hallwalls Contemporary Art Center",
        city: "Buffalo, NY",
        country: "Estados Unidos",
        type: "colectiva"
      },
      {
        year: pending,
        title: "Exposición colectiva",
        venue: "Museo de Arte Carrillo Gil",
        city: "Ciudad de México",
        country: "México",
        type: "colectiva"
      },
      {
        year: pending,
        title: "Exposición colectiva",
        venue: "Museo Nacional Centro de Arte Reina Sofía",
        city: "Madrid",
        country: "España",
        type: "colectiva"
      },
      {
        year: "2022",
        title: "Abstractions Cubaines: Des Années 50 à Nos Jours",
        venue: "Passerelle Centre d'Art Contemporain",
        city: "Brest",
        country: "Francia",
        type: "colectiva"
      }
    ]
  },
  {
    id: "premios",
    label: "Premios",
    labelEn: "Awards",
    eyebrow: "04",
    color: "#b5a63e",
    summary:
      "Premios, becas y residencias localizados en fuentes públicas.",
    summaryEn:
      "Awards, grants and residencies found in public sources.",
    items: [
      {
        year: "1995",
        title:
          "Primer Premio, Premio Nacional Anual de Pintura Contemporánea Juan Francisco Elso",
        venue: "Museo Nacional de Bellas Artes de Cuba",
        city: "La Habana",
        country: "Cuba",
        type: "premio"
      },
      {
        year: "1996/1997",
        title: "Beca Art in General y Longwood Project",
        venue: "Art in General / Longwood Project",
        city: "Nueva York",
        country: "Estados Unidos",
        type: "premio"
      },
      {
        year: "1998",
        title: "Residencia en medios audiovisuales",
        venue: "Instituto de Diseño y Medios Audiovisuales",
        city: "Basilea",
        country: "Suiza",
        type: "premio"
      },
      {
        year: "2022",
        title: "Beca Fundación CINTAS",
        venue: "Fundación CINTAS",
        city: "Miami",
        country: "Estados Unidos",
        type: "premio"
      },
      {
        year: "2024",
        title: "Beca RESILIENCE",
        venue: "Artists at Risk Connection / PEN International",
        city: "Nueva York",
        country: "Estados Unidos",
        type: "premio"
      }
    ]
  },
  {
    id: "prensa",
    label: "Prensa",
    labelEn: "Press",
    eyebrow: "05",
    color: "#cf5d47",
    summary:
      "Referencias editoriales para ampliar la biografía y documentar Espacio Aglutinador.",
    summaryEn:
      "Editorial references to expand the biography and document Espacio Aglutinador.",
    items: [
      {
        year: "2017",
        title: "Sandra Ceballos: Así en la paz como en la (pos)guerra",
        venue: "IPS Cuba",
        city: "La Habana",
        country: "Cuba",
        type: "prensa",
        url: "https://www.ipscuba.net/sin-categoria/sandra-ceballos-asi-en-la-paz-como-en-la-posguerra/"
      },
      {
        year: "2020",
        title: "Sandra Ceballos conversa sobre Arte sin pollo: Aglutinador History",
        venue: "Rialta",
        city: "Online",
        country: "Internacional",
        type: "prensa",
        url: "https://rialta.org/author/sandra-ceballos/"
      },
      {
        year: "2025",
        title: "Perfil de Sandra Ceballos Obaya",
        venue: "MACBA",
        city: "Barcelona",
        country: "España",
        type: "prensa",
        url: "https://www.macba.cat/en/actor/sandra-ceballos/"
      }
    ]
  }
];
