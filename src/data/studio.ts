// Historias de «In the studio». Las que llevan `news` salen también, en ese
// orden, en la noticia de la portada.
import type { ImageMetadata } from "astro";
import documentaVentana from "@/assets/taller/documenta-ventana.jpg";
import documentaReplica from "@/assets/taller/documenta-replica-1.jpg";
import desamparoTapiz from "@/assets/taller/desamparo-tapiz.jpg";

export type News = {
  kicker: string; // lo que tiene que verse de un vistazo (p. ej. "documenta fifteen")
  meta: string; // lugar y año
  headline: string;
  headlineEn: string;
  image: ImageMetadata;
};

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
  news?: News;
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
    altEn: "Window of the Espacio Aglutinador replica at documenta fifteen; a painting by Sandra Ceballos is seen through it.",
    news: {
      kicker: "documenta fifteen",
      meta: "Kassel · 2022",
      headline: "Espacio Aglutinador, a tamaño real en Kassel",
      headlineEn: "Espacio Aglutinador, full scale in Kassel",
      image: documentaReplica
    }
  },
  {
    slug: "desamparo-con-alevosia",
    year: "2024",
    place: "Madrid",
    title: "Desamparo con alevosía",
    titleEn: "Desamparo con alevosía",
    text: "Sandra estira el tapiz, realizado con prendas de mujeres víctimas de violencia de género, para la exposición «Desamparo con alevosía», con la beca ARC and PEN.",
    textEn: "Sandra stretches the tapestry, made from the clothes of women who are victims of gender-based violence, for the exhibition “Desamparo con alevosía”, supported by the ARC and PEN grant.",
    image: desamparoTapiz,
    alt: "Sandra Ceballos estirando un gran tapiz hecho con prendas de ropa.",
    altEn: "Sandra Ceballos stretching a large tapestry made of garments.",
    news: {
      kicker: "Desamparo con alevosía",
      meta: "Madrid · 2024",
      headline: "Un tapiz con prendas de mujeres víctimas de violencia de género",
      headlineEn: "A tapestry made from the clothes of women victims of gender-based violence",
      image: desamparoTapiz
    }
  }
];
