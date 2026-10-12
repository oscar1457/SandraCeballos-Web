// Historias de «In the studio». La primera (documenta) es la de la noticia de
// la portada y su texto viene de Sandra; las demás son PROVISIONALES: salen de
// los catálogos y de la cronología de Aglutinador.
import type { ImageMetadata } from "astro";
import bellaCastillo from "@/assets/publicaciones/la-bella-y-la-bestia-castillo-1989.jpg";
import bestiaEspana from "@/assets/publicaciones/la-bestia-y-la-bestia-espana-1992.jpg";
import aglutinador from "@/assets/aglutinador/vista-general.jpg";
import guiaProceso from "@/assets/taller/guia-espiritual-9-proceso.jpg";
import documentaVentana from "@/assets/taller/documenta-ventana.jpg";

export type Story = {
  slug: string; // para enlazar directamente: #taller/<slug>
  year: string;
  place?: string;
  title: string;
  titleEn: string;
  text: string;
  textEn: string;
  image: ImageMetadata;
  alt: string;
  altEn: string;
};

export const stories: Story[] = [
  {
    slug: "documenta-fifteen",
    year: "2022",
    place: "Kassel",
    title: "Espacio Aglutinador en documenta fifteen",
    titleEn: "Espacio Aglutinador at documenta fifteen",
    text: "En documenta fifteen, dentro del proyecto de INSTAR y la artista Tania Bruguera, se levantó a tamaño real una réplica de Espacio Aglutinador, la primera galería de arte independiente y democrática de Cuba (1994–2023), cofundada por Sandra Ceballos en su casa de La Habana. Entre sus muros se expuso también la obra de Sandra.",
    textEn: "At documenta fifteen, as part of the project by INSTAR and the artist Tania Bruguera, a full-scale replica was built of Espacio Aglutinador, Cuba's first independent and democratic art gallery (1994–2023), co-founded by Sandra Ceballos in her Havana home. Sandra's own work was shown within its walls.",
    image: documentaVentana,
    alt: "Ventana de la réplica de Espacio Aglutinador en documenta fifteen; a través de ella se ve un cuadro de Sandra Ceballos.",
    altEn: "Window of the Espacio Aglutinador replica at documenta fifteen; a painting by Sandra Ceballos is seen through it."
  },
  {
    slug: "la-bella-y-la-bestia",
    year: "1989",
    title: "La Bella y la Bestia",
    titleEn: "La Bella y la Bestia",
    text: "El 4 de septiembre de 1989 presenta «La Bella y la Bestia» en el Proyecto Castillo de la Fuerza, en La Habana.",
    textEn: "On 4 September 1989 she presents “La Bella y la Bestia” at the Castillo de la Fuerza project in Havana.",
    image: bellaCastillo,
    alt: "Catálogo de La Bella y la Bestia, Proyecto Castillo de la Fuerza, 1989.",
    altEn: "Catalogue of La Bella y la Bestia, Castillo de la Fuerza project, 1989."
  },
  {
    slug: "sandra-ceballos-en-espana",
    year: "1992",
    title: "Sandra Ceballos en España",
    titleEn: "Sandra Ceballos in Spain",
    text: "«La Bestia y la Bestia» viaja a España. El catálogo lo anuncia en portada: «Sandra Ceballos en España, 1992».",
    textEn: "“La Bestia y la Bestia” travels to Spain. The catalogue cover reads: “Sandra Ceballos en España, 1992”.",
    image: bestiaEspana,
    alt: "Portada roja del catálogo La Bestia y la Bestia, Sandra Ceballos en España, 1992.",
    altEn: "Red cover of the catalogue La Bestia y la Bestia, Sandra Ceballos in Spain, 1992."
  },
  {
    slug: "nace-espacio-aglutinador",
    year: "1994",
    title: "Nace Espacio Aglutinador",
    titleEn: "Espacio Aglutinador is born",
    text: "Con Ezequiel Suárez convierte su casa-taller del Vedado en un espacio de arte independiente. Abre con «Arte degenerado en la era del mercado».",
    textEn: "With Ezequiel Suárez she turns her home-studio in Vedado into an independent art space. It opens with “Arte degenerado en la era del mercado”.",
    image: aglutinador,
    alt: "Vista de Espacio Aglutinador con obras en las paredes.",
    altEn: "View of Espacio Aglutinador with works on the walls."
  },
  {
    slug: "guia-espiritual-9",
    year: "2026",
    title: "Guía espiritual #9",
    titleEn: "Guía espiritual #9",
    text: "Pinta una monja de 165 × 195 cm. Sobre la tela escribe: «Sé quién eres, tu nombre también, pero tú no sabes quién soy».",
    textEn: "She paints a 165 × 195 cm nun. On the canvas she writes: “I know who you are, your name too, but you do not know who I am”.",
    image: guiaProceso,
    alt: "Sandra Ceballos pintando Guía espiritual #9 en su taller.",
    altEn: "Sandra Ceballos painting Guía espiritual #9 in her studio."
  }
];
