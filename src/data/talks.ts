// Charlas y lecturas en vídeo (YouTube). Los créditos salen de la descripción
// de cada vídeo y de la documentación de cada evento; solo se nombra a quien
// consta en esas fuentes.
import type { ImageMetadata } from "astro";
import pamm from "@/assets/charlas/pamm-2016.jpg";
import aglutinador from "@/assets/charlas/aglutinador-then-and-now.jpg";
import lecturas from "@/assets/charlas/lecturas-al-fin.jpg";

export type Credit = { role: string; roleEn: string; names: string };

export type Talk = {
  id: string; // identificador del vídeo en YouTube
  year: string;
  place: string;
  title: string;
  text: string;
  textEn: string;
  credits: Credit[];
  image: ImageMetadata; // fotograma del propio vídeo
};

export const talks: Talk[] = [
  {
    // Fuente: descripción del vídeo (canal de Janet Batet) y dialoguesincubanart.org.
    id: "4MWkFFcz6CY",
    year: "2016",
    place: "Pérez Art Museum Miami",
    title: "Sandra Ceballos en el PAMM",
    text: "Intervención de Sandra Ceballos en el simposio «Dialogues in Cuban Art», celebrado en el Pérez Art Museum Miami los días 28 y 29 de abril de 2016.",
    textEn: "Sandra Ceballos speaking at the symposium “Dialogues in Cuban Art”, held at the Pérez Art Museum Miami on 28 and 29 April 2016.",
    credits: [
      { role: "Simposio", roleEn: "Symposium", names: "Dialogues in Cuban Art" },
      { role: "Idea del proyecto", roleEn: "Project conceived by", names: "Elizabeth Cerejido" },
      { role: "Publicado por", roleEn: "Published by", names: "Janet Batet" }
    ],
    image: pamm,
  },
  {
    // Fuente: descripción del vídeo (canal de Coco Fusco) y su presentación en pantalla.
    id: "F2mhXy8q7rM",
    year: "2017",
    place: "La Habana",
    title: "Aglutinador: Then and Now",
    text: "Sobre Espacio Aglutinador, la galería independiente más antigua de Cuba, en la casa de Sandra Ceballos en La Habana. Se hizo para apoyar la campaña de recaudación del espacio.",
    textEn: "About Espacio Aglutinador, Cuba’s oldest independent art gallery, in Sandra Ceballos’s home in Havana. It was made to support the space’s fundraising campaign.",
    credits: [
      { role: "Publicado por", roleEn: "Published by", names: "Coco Fusco" }
    ],
    image: aglutinador,
  },
  {
    // Fuente: descripción del vídeo (canal Forma Foco) y cartel del evento.
    id: "1tWOPKU8ujk",
    year: "2025",
    place: "Librería Arenales, Madrid",
    title: "Lecturas al Fin III · My Classroom #2",
    text: "Sandra Ceballos presenta su libro inédito «My Classroom #2» (2006), 23 hojas de cartón sobre la memoria y su pérdida, escritas como un castigo escolar que se repite hasta borrarse.",
    textEn: "Sandra Ceballos presents her unpublished book “My Classroom #2” (2006), 23 cardboard sheets about memory and its loss, written like a school punishment repeated until it blurs.",
    credits: [
      { role: "Lectura compartida", roleEn: "Shared reading", names: "Solveig Font" },
      { role: "Organiza", roleEn: "Organised by", names: "Colectivo Forma Foco" },
      { role: "Vídeo", roleEn: "Video", names: "Fernando Fraguela (Palenque Films)" }
    ],
    image: lecturas,
  }
];
