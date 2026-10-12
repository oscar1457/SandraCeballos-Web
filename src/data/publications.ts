import type { ImageMetadata } from "astro";
import catalogosPortadas from "@/assets/publicaciones/catalogos-portadas.png";
import absolutInterior from "@/assets/publicaciones/absolut-sandra-interior.png";
import absolutPortadilla from "@/assets/publicaciones/absolut-sandra-portadilla.png";
import bellaCastillo from "@/assets/publicaciones/la-bella-y-la-bestia-castillo-1989.jpg";
import bellaNaranja from "@/assets/publicaciones/la-bella-y-la-bestia-naranja.jpg";
import bestiaEspana from "@/assets/publicaciones/la-bestia-y-la-bestia-espana-1992.jpg";
import bestiaGaleriaHabana from "@/assets/publicaciones/la-bestia-y-la-bestia-galeria-habana.jpg";

export type Publication = {
  title: string;
  kind: string;
  kindEn: string;
  details: string;
  detailsEn: string;
  year: string;
};

// Catálogos de Sandra, de lo más reciente a lo más antiguo. Los datos de los
// catálogos antiguos salen de sus portadas; faltan por confirmar los años de
// "Absolut Sandra" y de dos ediciones de "La Bella y la Bestia".
export const publications: Publication[] = [
  {
    title: "Absolut Sandra",
    kind: "Catálogo",
    kindEn: "Catalogue",
    details: "Libro de obra de la serie Absolut Sandra.",
    detailsEn: "Book of works from the Absolut Sandra series.",
    year: ""
  },
  {
    title: "Desamparo con alevosía",
    kind: "Catálogo de exposición",
    kindEn: "Exhibition catalogue",
    details: "Galería Plus Artists, Madrid. Inauguración el 19 de diciembre de 2024.",
    detailsEn: "Galería Plus Artists, Madrid. Opened on 19 December 2024.",
    year: "2024"
  },
  {
    title: "La Bestia y la Bestia",
    kind: "Catálogo de exposición",
    kindEn: "Exhibition catalogue",
    details: "Sandra Ceballos en España.",
    detailsEn: "Sandra Ceballos in Spain.",
    year: "1992"
  },
  {
    title: "La Bella y la Bestia",
    kind: "Catálogo de exposición",
    kindEn: "Exhibition catalogue",
    details: "Proyecto Castillo de la Fuerza, La Habana, 4 de septiembre de 1989.",
    detailsEn: "Castillo de la Fuerza project, Havana, 4 September 1989.",
    year: "1989"
  },
  {
    title: "La Bestia y la Bestia",
    kind: "Catálogo",
    kindEn: "Catalogue",
    details: "Galería Habana: «Un homenaje a la destacada artista Sandra Ceballos Obaya».",
    detailsEn: "Galería Habana: “A tribute to the distinguished artist Sandra Ceballos Obaya”.",
    year: ""
  },
  {
    title: "La Bella y la Bestia",
    kind: "Catálogo",
    kindEn: "Catalogue",
    details: "Edición de portada naranja, firmada Sandra Ceballos Obaya.",
    detailsEn: "Orange-cover edition, signed Sandra Ceballos Obaya.",
    year: ""
  }
];

export type PublicationImage = {
  image: ImageMetadata;
  alt: string;
  altEn: string;
  caption: string;
  captionEn: string;
};

// Fotos de documentación de los catálogos.
export const publicationImages = {
  covers: {
    image: catalogosPortadas,
    alt: "Portadas de los catálogos Absolut Sandra y Desamparo con alevosía.",
    altEn: "Covers of the catalogues Absolut Sandra and Desamparo con alevosía.",
    caption: "Absolut Sandra y Desamparo con alevosía",
    captionEn: "Absolut Sandra and Desamparo con alevosía"
  },
  spread: {
    image: absolutInterior,
    alt: "Doble página de Absolut Sandra con las obras Santa Sandra y Sin título (G), 2019.",
    altEn: "Spread from Absolut Sandra with the works Santa Sandra and Sin título (G), 2019.",
    caption: "Absolut Sandra, págs. 22–23: «Santa Sandra» y «Sin título (G)», 2019",
    captionEn: "Absolut Sandra, pp. 22–23: “Santa Sandra” and “Sin título (G)”, 2019"
  },
  bestiaEspana: {
    image: bestiaEspana,
    alt: "Portada roja del catálogo La Bestia y la Bestia, Sandra Ceballos en España, 1992, con una fotografía en blanco y negro.",
    altEn: "Red cover of the catalogue La Bestia y la Bestia, Sandra Ceballos in Spain, 1992, with a black and white photograph.",
    caption: "La Bestia y la Bestia. Sandra Ceballos en España, 1992",
    captionEn: "La Bestia y la Bestia. Sandra Ceballos in Spain, 1992"
  },
  bellaCastillo: {
    image: bellaCastillo,
    alt: "Portada verde con letras pintadas a mano: La Bella y la Bestia, Sandra Ceballos, Proyecto Castillo de la Fuerza, 4 de septiembre de 1989.",
    altEn: "Green cover with hand-painted lettering: La Bella y la Bestia, Sandra Ceballos, Castillo de la Fuerza project, 4 September 1989.",
    caption: "La Bella y la Bestia. Proyecto Castillo de la Fuerza, 1989",
    captionEn: "La Bella y la Bestia. Castillo de la Fuerza project, 1989"
  },
  bestiaGaleriaHabana: {
    image: bestiaGaleriaHabana,
    alt: "Catálogo abierto en rojo y negro: Galería Habana, un homenaje a la destacada artista Sandra Ceballos Obaya, La Bestia y la Bestia.",
    altEn: "Open red and black catalogue: Galería Habana, a tribute to the distinguished artist Sandra Ceballos Obaya, La Bestia y la Bestia.",
    caption: "La Bestia y la Bestia. Galería Habana, portada y contraportada",
    captionEn: "La Bestia y la Bestia. Galería Habana, front and back cover"
  },
  bellaNaranja: {
    image: bellaNaranja,
    alt: "Portada naranja de La Bella y la Bestia, con un dibujo en tinta negra de una mujer de pelo rizado y una cola de diablo.",
    altEn: "Orange cover of La Bella y la Bestia, with a black ink drawing of a curly-haired woman and a devil's tail.",
    caption: "La Bella y la Bestia, portada naranja",
    captionEn: "La Bella y la Bestia, orange cover"
  },
  titlePage: {
    image: absolutPortadilla,
    alt: "Portadilla roja y blanca del libro Absolut Sandra.",
    altEn: "Red and white title page of the book Absolut Sandra.",
    caption: "Absolut Sandra, portadilla",
    captionEn: "Absolut Sandra, title page"
  }
} satisfies Record<string, PublicationImage>;
