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
    description: "De la serie Desamparo con alevosía.",
    descriptionEn: "From the series Desamparo con alevosía."
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
      "Texto escrito en la obra: “Sé quién eres, tu nombre también, pero tú no sabes quién soy, mi nombre tampoco.”",
    descriptionEn:
      "Text written in the work: “I know who you are, your name too, but you do not know who I am, nor my name.”"
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
    description: "De la serie Discursos Mangas.",
    descriptionEn: "From the series Discursos Mangas."
  },
  {
    id: "obra-11",
    slug: "discursos-mangas-pequena",
    title: "Discursos Mangas, pequeña",
    year: "2012",
    technique: "Acrílico sobre tela",
    techniqueEn: "Acrylic on canvas",
    dimensions: "150 x 125 cm",
    image: discursosMangasPequena,
    thumbnail: discursosMangasPequena,
    alt: "Discursos Mangas, pequeña, acrílico sobre tela de Sandra Ceballos.",
    description: "Obra de la serie Discursos Mangas.",
    descriptionEn: "Work from the series Discursos Mangas."
  },
  {
    id: "obra-12",
    slug: "discursos-mangas",
    title: "Discursos Mangas",
    year: "2012",
    technique: "Acrílico sobre tela",
    techniqueEn: "Acrylic on canvas",
    dimensions: "150 x 125 cm",
    image: discursosMangas2,
    thumbnail: discursosMangas2,
    alt: "Discursos Mangas, acrílico sobre tela de Sandra Ceballos.",
    description: "Obra de la serie Discursos Mangas.",
    descriptionEn: "Work from the series Discursos Mangas."
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
    description: "De la serie Adorado Wolfi.",
    descriptionEn: "From the series Adorado Wolfi."
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
      "Objeto y collage donde materiales domésticos, quirúrgicos y ornamentales se condensan en una composición frontal.",
    descriptionEn:
      "Object and collage where domestic, surgical and ornamental materials condense into a frontal composition."
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
      "Pintura de gran formato organizada como una escena densa, teatral y de lectura abierta.",
    descriptionEn:
      "Large-format painting arranged as a dense, theatrical scene open to interpretation."
  },
  {
    id: "obra-03",
    slug: "guia-4",
    title: "Guía # 4",
    year: "2025",
    technique: "Acrílico sobre tela",
    techniqueEn: "Acrylic on canvas",
    dimensions: "110 x 132 cm",
    image: guia4,
    thumbnail: guia4,
    alt: "Guía número 4, acrílico sobre tela de Sandra Ceballos.",
    description:
      "Obra reciente de la serie Guía, con trazo directo y una estructura pictórica de fuerte presencia gráfica.",
    descriptionEn:
      "Recent work from the Guide series, with direct brushwork and a pictorial structure of strong graphic presence."
  },
  {
    id: "obra-04",
    slug: "guia-espiritual-6",
    title: "Guía espiritual # 6",
    year: "2025",
    technique: "Acrílico sobre tela y crucifijo de madera",
    techniqueEn: "Acrylic on canvas and wooden crucifix",
    dimensions: "83 x 65 cm",
    image: guiaEspiritual6,
    thumbnail: guiaEspiritual6,
    alt: "Guía espiritual número 6, acrílico sobre tela con crucifijo de madera.",
    description:
      "Pieza vertical que incorpora objeto religioso y pintura como parte de una investigación material y simbólica.",
    descriptionEn:
      "Vertical piece incorporating a religious object and painting as part of a material and symbolic investigation."
  },
  {
    id: "obra-05",
    slug: "guia-2",
    title: "Guía # 2",
    year: "2025",
    technique: "Acrílico y lápiz sobre tela",
    techniqueEn: "Acrylic and pencil on canvas",
    dimensions: "83 x 65 cm",
    image: guia2,
    thumbnail: guia2,
    alt: "Guía número 2, acrílico y lápiz sobre tela de Sandra Ceballos.",
    description:
      "Incluye el texto en obra: Sandri no salves al Otro, sálvate tú, pequeña diabla.",
    descriptionEn:
      "Includes the text in the work: Sandri, don't save the Other, save yourself, little devil."
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
      "Pintura atravesada por diálogo escrito, ironía y tensión narrativa.",
    descriptionEn:
      "Painting crossed by written dialogue, irony and narrative tension."
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
      "Obra de la serie Absolut Sandra con título bilingüe indicado por la artista.",
    descriptionEn:
      "Work from the Absolut Sandra series with the bilingual title indicated by the artist."
  }
];
