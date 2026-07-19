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

const pending = "Sin fecha";

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
        venue: pending,
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
        venue: "Museo Nacional Centro de Arte Reina Sofia",
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
