import backgroundImage from "@/assets/artworks/la-cena-del-charlatan.jpg";
import ogImage from "@/assets/artworks/mi-artilleria-es-potente.jpg";

export const site = {
  name: "Sandra Ceballos",
  role: "Artista y curadora",
  roleEn: "Artist and curator",
  lang: "es",
  locale: "es_ES",
  url: "https://sandra-ceballos.vercel.app",
  title: "Sandra Ceballos | Portafolio",
  titleEn: "Sandra Ceballos | Portfolio",
  description:
    "Portafolio visual de Sandra Ceballos: obras recientes, trayectoria y contacto.",
  descriptionEn:
    "Visual portfolio of Sandra Ceballos: recent works, career and contact.",
  email: "aglutinadorsandra@gmail.com",
  portfolioPdf: "/files/sandra-ceballos-portfolio.pdf",
  instagram: {
    label: "@art_sandraceballos_photos",
    url: "https://www.instagram.com/art_sandraceballos_photos/"
  },
  backgroundImage,
  ogImage,
  nav: {
    artwork: "Obra",
    artworkEn: "Works",
    essentials: "Esenciales",
    essentialsEn: "Essentials",
    career: "Trayectoria",
    careerEn: "Career",
    contact: "Contacto",
    contactEn: "Contact",
    portfolio: "Portfolio",
    portfolioEn: "Portfolio",
    closeGallery: "Cerrar galería",
    closeGalleryEn: "Close gallery",
    closeCareer: "Cerrar trayectoria",
    closeCareerEn: "Close career",
    previous: "Anterior",
    previousEn: "Previous",
    next: "Siguiente",
    nextEn: "Next",
    viewArtwork: "Ver obra",
    viewArtworkEn: "View works"
  },
  footer: {
    privacy: "Privacidad",
    privacyEn: "Privacy",
    legal: "Aviso legal",
    legalEn: "Legal notice"
  },
  biography:
    "Sandra Ceballos es artista multidisciplinar y curadora cubana. Cursó estudios en San Alejandro, cofundó Espacio Aglutinador en La Habana en 1994 junto a Ezequiel Suárez y ha desarrollado una práctica sostenida entre creación, archivo, curaduría independiente y resistencia cultural.",
  biographyEn:
    "Sandra Ceballos is a Cuban multidisciplinary artist and curator. She studied at San Alejandro, co-founded Espacio Aglutinador in Havana in 1994 with Ezequiel Suárez, and has sustained a practice spanning creation, archive, independent curating and cultural resistance.",
  biographyNote:
    "Selección de biografía, exposiciones, premios y prensa.",
  biographyNoteEn:
    "Selection of biography, exhibitions, awards and press.",
  contactIntro:
    "Para consultas sobre obra, exposiciones o colaboraciones, escribe mediante el formulario.",
  contactIntroEn:
    "For inquiries about works, exhibitions or collaborations, write through the form.",
  form: {
    name: "Nombre",
    nameEn: "Name",
    email: "Correo electrónico",
    emailEn: "Email",
    subject: "Asunto",
    subjectOptional: "Asunto opcional",
    subjectOptionalEn: "Optional subject",
    message: "Mensaje",
    messageEn: "Message",
    submit: "Enviar mensaje",
    submitEn: "Send message",
    sending: "Enviando...",
    sendingEn: "Sending...",
    success: "Mensaje enviado. Gracias por escribir.",
    successEn: "Message sent. Thank you for writing.",
    endpointMissing:
      "Falta configurar PUBLIC_FORMSPREE_ENDPOINT. El mensaje no se ha enviado.",
    endpointMissingEn:
      "PUBLIC_FORMSPREE_ENDPOINT is not configured. The message was not sent.",
    genericError:
      "No se pudo enviar el mensaje. Revisa los campos o inténtalo de nuevo.",
    genericErrorEn:
      "The message could not be sent. Check the fields or try again.",
    required: "Este campo es obligatorio.",
    requiredEn: "This field is required.",
    invalidEmail: "Introduce un correo válido.",
    invalidEmailEn: "Enter a valid email.",
    privacyPrefix: "Al enviar aceptas la",
    privacyPrefixEn: "By sending you accept the",
    privacyLink: "política de privacidad",
    privacyLinkEn: "privacy policy"
  },
  sources: [
    {
      label: "MACBA",
      url: "https://www.macba.cat/en/actor/sandra-ceballos/"
    },
    {
      label: "Espacio Aglutinador",
      url: "https://www.espacioaglutinador.com/"
    },
    {
      label: "Cuban Art Database",
      url: "https://www.cubanartresources.org/sandra-ceballos"
    },
    {
      label: "El Árbol Rojo",
      url: "https://www.elarbolrojoart.com/es/artistas/producer/61-sandra-ceballos"
    },
    {
      label: "Rialta",
      url: "https://rialta.org/author/sandra-ceballos/"
    },
    {
      label: "IPS Cuba",
      url: "https://www.ipscuba.net/sin-categoria/sandra-ceballos-asi-en-la-paz-como-en-la-posguerra/"
    }
  ],
  socialProfiles: [
    "https://www.instagram.com/art_sandraceballos_photos/",
    "https://www.espacioaglutinador.com/"
  ]
} as const;

export type Site = typeof site;
