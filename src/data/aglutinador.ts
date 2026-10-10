// Contenido de la sección Espacio Aglutinador.
// Fuente: "Cronología de Aglutinador" (documento de Sandra Ceballos) y el catálogo
// "Malditos de la posguerra" (2016–2018). Solo se incluyen personas que aparecen en
// esos documentos como participantes en el espacio.
import type { ImageMetadata } from "astro";
import logo from "@/assets/aglutinador/logo-aglutinador.jpg";
import archivo01 from "@/assets/aglutinador/archivo-01.jpg";
import archivo02 from "@/assets/aglutinador/archivo-02.jpg";
import archivo03 from "@/assets/aglutinador/archivo-03.jpg";
import anos01 from "@/assets/aglutinador/27-anos-01.jpg";
import anos02 from "@/assets/aglutinador/27-anos-02.jpg";
import anosDetalle from "@/assets/aglutinador/27-anos-detalle.jpg";
import espacio01 from "@/assets/aglutinador/espacio-01.jpg";
import espacio02 from "@/assets/aglutinador/espacio-02.jpg";
import espacio03 from "@/assets/aglutinador/espacio-03.jpg";
import vistaGeneral from "@/assets/aglutinador/vista-general.jpg";
import curadoresGoHome from "@/assets/aglutinador/curadores-go-home.jpg";
import malditosCatalogo from "@/assets/aglutinador/malditos-catalogo.jpg";
import grupo from "@/assets/aglutinador/grupo.jpg";

export type Participant = {
  name: string;
  role: string;
  roleEn: string;
  source: "cronologia" | "catalogo";
};

// Nombres de la portada: izquierda la persona, derecha qué hizo en Aglutinador.
export const participants: Participant[] = [
  { name: "Ezequiel Suárez", role: "Cofundador, 1994", roleEn: "Co-founder, 1994", source: "cronologia" },
  { name: "Orlando Hernández", role: "Curador, 1994–1999", roleEn: "Curator, 1994–1999", source: "cronologia" },
  { name: "Gerardo Mosquera", role: "Curador, 1995–1996", roleEn: "Curator, 1995–1996", source: "cronologia" },
  { name: "Tania Bruguera", role: "Exposición, 1996–1999", roleEn: "Exhibition, 1996–1999", source: "cronologia" },
  { name: "Santiago Sierra", role: "Exposición, 1996–1999", roleEn: "Exhibition, 1996–1999", source: "cronologia" },
  { name: "Ross Bleckner", role: "Exposición, 1996–1999", roleEn: "Exhibition, 1996–1999", source: "cronologia" },
  { name: "Jack Pierson", role: "Exposición, 1996–1999", roleEn: "Exhibition, 1996–1999", source: "cronologia" },
  { name: "Carlos Garaicoa", role: "Exposición personal", roleEn: "Solo exhibition", source: "cronologia" },
  { name: "Glexis Novoa", role: "Exposición personal", roleEn: "Solo exhibition", source: "cronologia" },
  { name: "Marta María Pérez Bravo", role: "Exposición, 1996–1999", roleEn: "Exhibition, 1996–1999", source: "cronologia" },
  { name: "Ernesto Pujol", role: "Exposición, 1996–1999", roleEn: "Exhibition, 1996–1999", source: "cronologia" },
  { name: "Lázaro Saavedra", role: "Exposición, 1996–1999", roleEn: "Exhibition, 1996–1999", source: "cronologia" },
  { name: "Chago Armada", role: "Exposiciones personales", roleEn: "Solo exhibitions", source: "cronologia" },
  { name: "Luis Camnitzer", role: "Cocurador, The Drawing Center", roleEn: "Co-curator, The Drawing Center", source: "cronologia" },
  { name: "Tamy Katz Freiman", role: "Curadora invitada", roleEn: "Guest curator", source: "cronologia" },
  { name: "Tzibi Geva", role: "Exposición, 1996–1999", roleEn: "Exhibition, 1996–1999", source: "cronologia" },
  { name: "Coco Fusco", role: "Performance y curaduría", roleEn: "Performance and curating", source: "cronologia" },
  { name: "Rachel Weiss", role: "Curadores, come home!", roleEn: "Curadores, come home!", source: "cronologia" },
  { name: "Magaly Espinosa", role: "Curadores, come home!", roleEn: "Curadores, come home!", source: "cronologia" },
  { name: "Elvia Rosa Castro", role: "Curadores, come home!", roleEn: "Curadores, come home!", source: "cronologia" },
  { name: "Antonio Eligio (Tonel)", role: "Curaduría, Dreaming My Dreams", roleEn: "Curating, Dreaming My Dreams", source: "cronologia" },
  { name: "Virginia Fleck", role: "Dreaming My Dreams", roleEn: "Dreaming My Dreams", source: "cronologia" },
  { name: "Glenda León", role: "QUÉ, 1999–2004", roleEn: "QUÉ, 1999–2004", source: "cronologia" },
  { name: "Oswaldo Maciá", role: "QUÉ, 1999–2004", roleEn: "QUÉ, 1999–2004", source: "cronologia" },
  { name: "Manuel Piña", role: "Fotografía, 1999–2004", roleEn: "Photography, 1999–2004", source: "cronologia" },
  { name: "Alexandre Arrechea", role: "Exposición, 1999–2004", roleEn: "Exhibition, 1999–2004", source: "cronologia" },
  { name: "Ángel Delgado", role: "Exposición personal", roleEn: "Solo exhibition", source: "cronologia" },
  { name: "Juan Carlos Alom", role: "Exposición, 1996–1999", roleEn: "Exhibition, 1996–1999", source: "cronologia" },
  { name: "Pedro Álvarez", role: "Exposición, 1996–1999", roleEn: "Exhibition, 1996–1999", source: "cronologia" },
  { name: "Magda Ileana González", role: "Curaduría, ARCO 2003", roleEn: "Curating, ARCO 2003", source: "cronologia" },
  { name: "Sandra Ramos", role: "Exposición personal", roleEn: "Solo exhibition", source: "cronologia" },
  { name: "Juan Sí González", role: "Malditos de la posguerra", roleEn: "Malditos de la posguerra", source: "catalogo" },
  { name: "Luis Manuel Otero", role: "Malditos de la posguerra", roleEn: "Malditos de la posguerra", source: "catalogo" },
  { name: "Hamlet Lavastida", role: "Malditos de la posguerra", roleEn: "Malditos de la posguerra", source: "catalogo" },
  { name: "Iván de la Nuez", role: "Textos de catálogo", roleEn: "Catalogue texts", source: "cronologia" },
  { name: "Paco Barragán", role: "Texto de catálogo", roleEn: "Catalogue text", source: "catalogo" },
  { name: "El Ciervo Encantado", role: "Teatro", roleEn: "Theatre", source: "cronologia" },
  { name: "Porno para Ricardo", role: "Concierto", roleEn: "Concert", source: "cronologia" }
];

export type Period = {
  years: string;
  title: string;
  titleEn: string;
  text: string;
  textEn: string;
};

// Cronología resumida a partir del documento de Sandra Ceballos.
export const periods: Period[] = [
  {
    years: "1994",
    title: "Fundación",
    titleEn: "Foundation",
    text: "Sandra Ceballos y Ezequiel Suárez crean Espacio Aglutinador en la casa-taller de Sandra, en el Vedado, La Habana, con la muestra «Arte degenerado en la era del mercado». Meses después se inaugura «El frente Bauhaus», de Ezequiel Suárez, una exposición censurada en la Galería de 23 y 12. Ese mismo año se incorpora al equipo de curadores Orlando Hernández con la muestra personal de Manuel Vidal y, más adelante, las de Glexis Novoa, Maite Díaz González, Chago Armada, Bernardo Sarria, Carlos Garaicoa, Enrique Lanza, Cleva Solís, Colette Rodríguez y Alberto Casado.",
    textEn: "Sandra Ceballos and Ezequiel Suárez create Espacio Aglutinador in Sandra’s home-studio in Vedado, Havana, with the show “Arte degenerado en la era del mercado”. Months later “El frente Bauhaus” by Ezequiel Suárez opens, an exhibition that had been censored at the 23 y 12 Gallery. That same year Orlando Hernández joins the curatorial team with Manuel Vidal’s solo show and, later, those of Glexis Novoa, Maite Díaz González, Chago Armada, Bernardo Sarria, Carlos Garaicoa, Enrique Lanza, Cleva Solís, Colette Rodríguez and Alberto Casado."
  },
  {
    years: "1995–1996",
    title: "Curaduría colectiva",
    titleEn: "Collective curating",
    text: "Gerardo Mosquera colabora como curador junto a Sandra, Ezequiel y Orlando en muestras como «La Carne», una convención de tatuajes, y la exposición personal de Ángel Delgado.",
    textEn: "Gerardo Mosquera collaborates as curator with Sandra, Ezequiel and Orlando on shows such as “La Carne”, a tattoo convention, and Ángel Delgado’s solo exhibition."
  },
  {
    years: "1996–1999",
    title: "Artistas de Cuba y del mundo",
    titleEn: "Artists from Cuba and abroad",
    text: "El equipo curatorial se reduce a Sandra y Ezequiel. Se realizan exposiciones de Tania Bruguera, Marta María Pérez Bravo, Ernesto Pujol, Lázaro Saavedra, Juan Carlos Alom y Pedro Álvarez, y de artistas internacionales como Jack Pierson, Ross Bleckner, Santiago Sierra y Tzibi Geva, esta última con la curadora israelí Tamy Katz Freiman. También las muestras de grupo «Una miseria temporal» y «Ambiente».",
    textEn: "The curatorial team narrows to Sandra and Ezequiel. Exhibitions include Tania Bruguera, Marta María Pérez Bravo, Ernesto Pujol, Lázaro Saavedra, Juan Carlos Alom and Pedro Álvarez, and international artists such as Jack Pierson, Ross Bleckner, Santiago Sierra and Tzibi Geva, the latter with Israeli curator Tamy Katz Freiman. Also the group shows “Una miseria temporal” and “Ambiente”."
  },
  {
    years: "1999–2004",
    title: "Proyección internacional",
    titleEn: "International reach",
    text: "Sandra Ceballos queda como curadora y René Quintana como productor y museógrafo. Se presentan «QUÉ», dedicada a los medios de difusión masiva, «PERMANECER», con fetiches de más de 50 artistas, y «Dreaming My Dreams», organizada por Antonio Eligio (Tonel). Aglutinador participa en FAIR, feria internacional de espacios alternativos en el Royal College de Londres, en ARCO 2003 y en una exposición de Chago Armada para The Drawing Center de Nueva York, curada por Sandra Ceballos y Luis Camnitzer.",
    textEn: "Sandra Ceballos remains as curator and René Quintana as producer and exhibition designer. Shows include “QUÉ”, on mass media, “PERMANECER”, with fetishes by more than 50 artists, and “Dreaming My Dreams”, organised by Antonio Eligio (Tonel). Aglutinador takes part in FAIR, an international fair of alternative spaces at the Royal College in London, in ARCO 2003, and in a Chago Armada exhibition for The Drawing Center in New York, curated by Sandra Ceballos and Luis Camnitzer."
  },
  {
    years: "2004–2023",
    title: "Un espacio comprometido",
    titleEn: "A committed space",
    text: "Con Sandra Ceballos como curadora, productora y diseñadora de montaje, el espacio asume proyectos más comprometidos con los conflictos existenciales, políticos y sociales del país. «Curadores, go home!» fue atacada por el Consejo Nacional de las Artes Plásticas; años después llegó «Curadores, come home!», con Rachel Weiss, Magaly Espinosa, Gerardo Mosquera y Elvia Rosa Castro.",
    textEn: "With Sandra Ceballos as curator, producer and exhibition designer, the space takes on projects more engaged with the country’s existential, political and social conflicts. “Curadores, go home!” was attacked by the National Council of Visual Arts; years later came “Curadores, come home!”, with Rachel Weiss, Magaly Espinosa, Gerardo Mosquera and Elvia Rosa Castro."
  },
  {
    years: "2007–2012",
    title: "Residencias PERRO y Museo de Arte Maníaco",
    titleEn: "PERRO residencies and the Museum of Maniac Art",
    text: "Sandra Ceballos crea las Residencias PERRO (Propuesta Experimental de Respuesta Rápida Organizada), con apoyo de Prince Claus y la Fundación HIVOS, para artistas, estudiantes y curadores menos favorecidos por las instituciones oficiales. En 2012 funda el MAM, Museo de Arte Maníaco, abierto a artistas de cualquier edad y procedencia, con o sin título.",
    textEn: "Sandra Ceballos creates the PERRO Residencies (Experimental Proposal for Organised Rapid Response), supported by Prince Claus and the HIVOS Foundation, for artists, students and curators overlooked by official institutions. In 2012 she founds the MAM, Museum of Maniac Art, open to artists of any age and background, trained or not."
  },
  {
    years: "2016–2018",
    title: "Malditos de la posguerra",
    titleEn: "Malditos de la posguerra",
    text: "Un programa de exposiciones para rescatar a artistas cubanos, vivos o muertos, exiliados o no, que sufrieron la censura, la represión y el olvido calculado: «1988: Proyecto G», con Juan Sí González; «OmniZonaFranca: un arte necesario»; «Crónicas y evidencias», con Ángel Delgado y Alberto Casado; «Desde las catacumbas» y «Exilio: outside, pero inside too».",
    textEn: "A programme of exhibitions to recover Cuban artists, living or dead, exiled or not, who suffered censorship, repression and calculated oblivion: “1988: Proyecto G”, with Juan Sí González; “OmniZonaFranca: un arte necesario”; “Crónicas y evidencias”, with Ángel Delgado and Alberto Casado; “Desde las catacumbas” and “Exilio: outside, pero inside too”."
  },
  {
    years: "2021–2022",
    title: "27 años y documenta",
    titleEn: "27 years and documenta",
    text: "La muestra «27 años de Espacio Aglutinador» presenta el archivo físico del espacio. En 2022, Espacio Aglutinador se presenta en documenta fifteen, en Kassel.",
    textEn: "The show “27 years of Espacio Aglutinador” presents the space’s physical archive. In 2022 Espacio Aglutinador is presented at documenta fifteen in Kassel."
  }
];

export const curators = [
  "Rachel Weiss (Estados Unidos)",
  "Gerardo Mosquera (Cuba)",
  "Coco Fusco (Estados Unidos)",
  "Eugenio Valdés (Cuba)",
  "Giselle Victoria (Cuba)",
  "Orlando Hernández (Cuba)",
  "Elvia Rosa Castro (Cuba)",
  "Magaly Espinosa (Cuba)",
  "Tamy Katz Freiman (Israel)",
  "Frency González (Cuba)",
  "Antonio Eligio (Tonel)"
];

export const catalogueAuthors = [
  "Gerardo Mosquera", "Coco Fusco", "Eugenio Valdés", "Giselle Victoria", "Orlando Hernández",
  "Elvia Rosa Castro", "Magaly Espinosa", "Tamy Katz Freiman", "Frency González", "Yanelys Núñez",
  "Iván de la Nuez", "Maite Díaz González", "Manuel Vidal", "Sandra Ceballos", "Chago Armada",
  "Luis Manuel Molina", "Joel Jover", "Cristina Vives", "Ezequiel Suárez", "Lázara Castellano",
  "Susette Sánchez", "Samuel Riera", "Natalia Bolívar", "Paco Barragán"
];

export type ArchivePhoto = {
  image: ImageMetadata;
  caption: string;
  captionEn: string;
};

// Pies de foto descriptivos. Sin fecha ni nombres cuando no constan en la documentación.
export const archivePhotos: ArchivePhoto[] = [
  { image: logo, caption: "Logotipo de Espacio Aglutinador", captionEn: "Espacio Aglutinador logo" },
  { image: vistaGeneral, caption: "Vista general del espacio", captionEn: "General view of the space" },
  { image: anos01, caption: "27 años de Espacio Aglutinador, archivo físico", captionEn: "27 years of Espacio Aglutinador, physical archive" },
  { image: anos02, caption: "27 años de Espacio Aglutinador, archivo físico", captionEn: "27 years of Espacio Aglutinador, physical archive" },
  { image: anosDetalle, caption: "Detalle de la exposición «27 años de Espacio Aglutinador», 2021", captionEn: "Detail of the exhibition “27 years of Espacio Aglutinador”, 2021" },
  { image: curadoresGoHome, caption: "Cartel de «Curadores, go home!»", captionEn: "Poster for “Curadores, go home!”" },
  { image: malditosCatalogo, caption: "Malditos de la posguerra, páginas del catálogo", captionEn: "Malditos de la posguerra, catalogue pages" },
  { image: archivo01, caption: "Archivo de Espacio Aglutinador", captionEn: "Espacio Aglutinador archive" },
  { image: archivo02, caption: "Montaje en Espacio Aglutinador", captionEn: "Installation at Espacio Aglutinador" },
  { image: archivo03, caption: "Encuentro en Espacio Aglutinador", captionEn: "Gathering at Espacio Aglutinador" },
  { image: espacio01, caption: "Sala de exposiciones", captionEn: "Exhibition room" },
  { image: espacio02, caption: "Espacio Aglutinador", captionEn: "Espacio Aglutinador" },
  { image: espacio03, caption: "Espacio Aglutinador", captionEn: "Espacio Aglutinador" },
  { image: grupo, caption: "Espacio Aglutinador", captionEn: "Espacio Aglutinador" }
];

export const catalogue = {
  title: "Malditos de la posguerra",
  file: "/files/malditos-de-la-posguerra.pdf",
  size: "3,7 MB"
};
