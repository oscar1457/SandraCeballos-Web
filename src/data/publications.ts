import type { ImageMetadata } from "astro";
import catalogosPortadas from "@/assets/publicaciones/catalogos-portadas.png";
import absolutInterior from "@/assets/publicaciones/absolut-sandra-interior.png";
import absolutPortadilla from "@/assets/publicaciones/absolut-sandra-portadilla.png";

export type Publication = {
  title: string;
  kind: string;
  kindEn: string;
  details: string;
  detailsEn: string;
  year: string;
};

// Catálogos de Sandra. El año de "Absolut Sandra" está pendiente de confirmar.
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
  titlePage: {
    image: absolutPortadilla,
    alt: "Portadilla roja y blanca del libro Absolut Sandra.",
    altEn: "Red and white title page of the book Absolut Sandra.",
    caption: "Absolut Sandra, portadilla",
    captionEn: "Absolut Sandra, title page"
  }
} satisfies Record<string, PublicationImage>;
