import type { ImageMetadata } from "astro";
import adoradoWolfi from "@/assets/artworks/adorado-wolfi.jpg";
import comidaComiendoComida from "@/assets/artworks/comida-comiendo-comida.jpg";
import discursosMangas2 from "@/assets/artworks/discursos-mangas-2.jpg";
import discursosMangasPequena from "@/assets/artworks/discursos-mangas-pequena.jpg";
import dragonbandera from "@/assets/artworks/dragonbandera.jpg";
import elVientoAbusador from "@/assets/artworks/el-viento-abusador.jpg";
import guia2 from "@/assets/artworks/guia-2.jpg";
import guia4 from "@/assets/artworks/guia-4.jpg";
import guiaEspiritual6 from "@/assets/artworks/guia-espiritual-6.jpg";
import guiaEspiritual9 from "@/assets/artworks/guia-espiritual-9.jpg";
import laCenaDelCharlatan from "@/assets/artworks/la-cena-del-charlatan.jpg";
import miArtilleriaEsPotente from "@/assets/artworks/mi-artilleria-es-potente.jpg";
import quienMatoAlComendador from "@/assets/artworks/quien-mato-al-comendador.jpg";

export type Artwork = {
  id: string;
  slug: string;
  title: string;
  year: string;
  technique: string;
  techniqueEn: string;
  dimensions: string;
  image: ImageMetadata;
  thumbnail: ImageMetadata;
  alt: string;
  description: string;
  descriptionEn: string;
  // Vídeo corto del proceso (ruta sin extensión: .webm, .mp4 y .jpg de póster).
  processVideo?: string;
};

export const artworks: Artwork[] = [
  {
    id: "obra-08",
    slug: "el-viento-abusador",
    title: "El viento abusador (dedicado a Ana Mendieta)",
    year: "2024",
    technique: "Acrílico sobre tela",
    techniqueEn: "Acrylic on canvas",
    dimensions: "73 x 53 cm",
    image: elVientoAbusador,
    thumbnail: elVientoAbusador,
    alt: "El viento abusador, acrílico sobre tela de Sandra Ceballos dedicado a Ana Mendieta.",
    description:
      "Pertenece a la serie Desamparo con alevosía. La obra parte de una investigación sobre las víctimas de la violencia de género en Cuba y rinde homenaje a la artista cubana Ana Mendieta.",
    descriptionEn:
      "Part of the series Desamparo con alevosía. The work stems from research into victims of gender-based violence in Cuba and pays tribute to the Cuban artist Ana Mendieta."
  },
  {
    id: "obra-09",
    slug: "guia-espiritual-9",
    title: "Guía espiritual #9",
    year: "2026",
    technique: "Óleo sobre tela",
    techniqueEn: "Oil on canvas",
    dimensions: "165 x 195 cm",
    image: guiaEspiritual9,
    thumbnail: guiaEspiritual9,
    alt: "Guía espiritual número 9, óleo sobre tela de Sandra Ceballos.",
    description:
      "Una monja que surge de un imaginario anecdótico, «de quién sabe cuándo y quién sabe qué». Sobre la tela, la artista escribe: «Sé quién eres, tu nombre también, pero tú no sabes quién soy, mi nombre tampoco».",
    descriptionEn:
      "A nun emerging from an anecdotal imaginary, “from who knows when and who knows what.” Written on the canvas: “I know who you are, your name too, but you do not know who I am, nor my name.”",
    processVideo: "/video/guia-espiritual-9-proceso"
  },
  {
    id: "obra-10",
    slug: "dragonbandera",
    title: "Dragon bandera",
    year: "2014",
    technique: "Acrílico sobre PVC",
    techniqueEn: "Acrylic on PVC",
    dimensions: "90 x 60 cm",
    image: dragonbandera,
    thumbnail: dragonbandera,
    alt: "Dragon bandera, obra de Sandra Ceballos de la serie Discursos Mangas.",
    description:
      "Pertenece a la serie Discursos Mangas. La obra establece un paralelo entre el superhéroe del manga y la figura de un supuesto líder político: dos representaciones del poder capaces de reunir tantos seguidores como detractores. En ella conviven fragmentos de discursos del presidente Fidel Castro y la figura de Dragon Ball convertida en bandera cubana.",
    descriptionEn:
      "Part of the series Discursos Mangas. The work draws a parallel between the manga superhero and the figure of a supposed political leader: two representations of power able to gather as many followers as detractors. Fragments of speeches by President Fidel Castro coexist with the figure of Dragon Ball turned into the Cuban flag."
  },
  {
    id: "obra-11",
    slug: "discursos-mangas-1",
    title: "Discursos Mangas #1",
    year: "2012",
    technique: "Acrílico sobre tela",
    techniqueEn: "Acrylic on canvas",
    dimensions: "150 x 125 cm",
    image: discursosMangasPequena,
    thumbnail: discursosMangasPequena,
    alt: "Discursos Mangas #1, acrílico sobre tela de Sandra Ceballos con gárgolas.",
    description:
      "Pertenece a la serie Discursos Mangas. Un grupo de gárgolas convive con fragmentos de discursos de Fidel Castro.",
    descriptionEn:
      "Part of the series Discursos Mangas. A group of gargoyles coexists with fragments of speeches by Fidel Castro."
  },
  {
    id: "obra-12",
    slug: "discursos-mangas-2",
    title: "Discursos Mangas #2",
    year: "2012",
    technique: "Acrílico sobre tela",
    techniqueEn: "Acrylic on canvas",
    dimensions: "150 x 125 cm",
    image: discursosMangas2,
    thumbnail: discursosMangas2,
    alt: "Discursos Mangas #2, acrílico sobre tela de Sandra Ceballos con la figura de Ben 10.",
    description:
      "Pertenece a la serie Discursos Mangas. La figura de Ben 10 convive con fragmentos de discursos de Fidel Castro.",
    descriptionEn:
      "Part of the series Discursos Mangas. The figure of Ben 10 coexists with fragments of speeches by Fidel Castro."
  },
  {
    id: "obra-13",
    slug: "adorado-wolfi",
    title: "Adorado Wolfi",
    year: "2017",
    technique: "Acrílico sobre PVC",
    techniqueEn: "Acrylic on PVC",
    dimensions: "95 x 65 cm",
    image: adoradoWolfi,
    thumbnail: adoradoWolfi,
    alt: "Adorado Wolfi, acrílico sobre PVC de Sandra Ceballos.",
    description:
      "Pertenece a la serie Adorado Wolfi.",
    descriptionEn:
      "Part of the series Adorado Wolfi."
  },
  {
    id: "obra-01",
    slug: "mi-artilleria-es-potente",
    title: "Mi artillería es potente",
    year: "2024",
    technique:
      "Muñeca de yeso, alfileres de cirugía, bisuterías, acrílico y collage sobre caja de metal",
    techniqueEn:
      "Plaster doll, surgical pins, costume jewelry, acrylic and collage on metal box",
    dimensions: "50 x 50 cm",
    image: miArtilleriaEsPotente,
    thumbnail: miArtilleriaEsPotente,
    alt: "Mi artillería es potente, obra de Sandra Ceballos en caja de metal.",
    description:
      "Objeto-collage en el que materiales domésticos, quirúrgicos y ornamentales se condensan en una composición frontal.",
    descriptionEn:
      "An object-collage in which domestic, surgical and ornamental materials condense into a frontal composition."
  },
  {
    id: "obra-02",
    slug: "la-cena-del-charlatan",
    title: "La cena del charlatán",
    year: "2022",
    technique: "Óleo sobre tela",
    techniqueEn: "Oil on canvas",
    dimensions: "200 x 210 cm",
    image: laCenaDelCharlatan,
    thumbnail: laCenaDelCharlatan,
    alt: "La cena del charlatán, óleo sobre tela de Sandra Ceballos.",
    description:
      "Pintura de gran formato concebida como una escena densa y teatral, abierta a múltiples lecturas.",
    descriptionEn:
      "A large-format painting conceived as a dense, theatrical scene, open to multiple readings."
  },
  {
    id: "obra-03",
    slug: "guia-4",
    title: "Guía #4",
    year: "2025",
    technique: "Acrílico sobre tela",
    techniqueEn: "Acrylic on canvas",
    dimensions: "110 x 132 cm",
    image: guia4,
    thumbnail: guia4,
    alt: "Guía número 4, acrílico sobre tela de Sandra Ceballos.",
    description:
      "Obra reciente de la serie Guía, de trazo directo y marcada presencia gráfica.",
    descriptionEn:
      "A recent work from the Guía series, with direct brushwork and a strong graphic presence."
  },
  {
    id: "obra-04",
    slug: "guia-espiritual-6",
    title: "Guía espiritual #6",
    year: "2025",
    technique: "Acrílico sobre tela y crucifijo de madera",
    techniqueEn: "Acrylic on canvas and wooden crucifix",
    dimensions: "83 x 65 cm",
    image: guiaEspiritual6,
    thumbnail: guiaEspiritual6,
    alt: "Guía espiritual número 6, acrílico sobre tela con crucifijo de madera.",
    description:
      "Pieza vertical que integra pintura y objeto religioso dentro de una investigación material y simbólica.",
    descriptionEn:
      "A vertical piece that brings together painting and a religious object within a material and symbolic inquiry."
  },
  {
    id: "obra-05",
    slug: "guia-2",
    title: "Guía #2",
    year: "2025",
    technique: "Acrílico y lápiz sobre tela",
    techniqueEn: "Acrylic and pencil on canvas",
    dimensions: "83 x 65 cm",
    image: guia2,
    thumbnail: guia2,
    alt: "Guía número 2, acrílico y lápiz sobre tela de Sandra Ceballos.",
    description:
      "La obra incluye el texto: «Sandri, no salves al Otro, sálvate tú, pequeña diabla».",
    descriptionEn:
      "The work includes the text: “Sandri, don't save the Other, save yourself, little devil.”"
  },
  {
    id: "obra-06",
    slug: "quien-mato-al-comendador",
    title: "¿Quién mató al Comendador? Los Radicales Libres, señor!",
    year: "2021",
    technique: "Acrílico sobre tela",
    techniqueEn: "Acrylic on canvas",
    dimensions: "100 x 80 cm",
    image: quienMatoAlComendador,
    thumbnail: quienMatoAlComendador,
    alt: "¿Quién mató al Comendador?, acrílico sobre tela de Sandra Ceballos.",
    description:
      "Pintura atravesada por el diálogo escrito, la ironía y la tensión narrativa.",
    descriptionEn:
      "A painting crossed by written dialogue, irony and narrative tension."
  },
  {
    id: "obra-07",
    slug: "comida-comiendo-comida",
    title: "Comida comiendo comida / Food eating food",
    year: "2021",
    technique: "Óleo sobre tela",
    techniqueEn: "Oil on canvas",
    dimensions: "150 x 95 cm",
    image: comidaComiendoComida,
    thumbnail: comidaComiendoComida,
    alt: "Comida comiendo comida, óleo sobre tela de la serie Absolut Sandra.",
    description:
      "Pertenece a la serie Absolut Sandra. El título bilingüe es de la propia artista.",
    descriptionEn:
      "Part of the series Absolut Sandra. The bilingual title is the artist's own."
  }
];
