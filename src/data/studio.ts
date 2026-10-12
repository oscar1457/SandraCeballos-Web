// Historias de «In the studio». PROVISIONALES: salen de los catálogos y de la
// cronología de Aglutinador; Sandra tiene que revisarlas o sustituirlas por las
// suyas (año, titular, dos líneas y una foto).
import type { ImageMetadata } from "astro";
import bellaCastillo from "@/assets/publicaciones/la-bella-y-la-bestia-castillo-1989.jpg";
import bestiaEspana from "@/assets/publicaciones/la-bestia-y-la-bestia-espana-1992.jpg";
import aglutinador from "@/assets/aglutinador/vista-general.jpg";
import guiaProceso from "@/assets/taller/guia-espiritual-9-proceso.jpg";

export type Story = {
  year: string;
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
