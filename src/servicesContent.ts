export interface ServiceItem {
  image: string;
  
  title: string;
  description: string;
  href: string;
}

export interface ServiceCategory {
  title: string;
  id: string;
  items: ServiceItem[];
}

export const servicesItems: ServiceCategory[] = [
  {
    id:'makeup',
    title: "Makeup",
    items: [
      {
        image: "/images/services/maquillaje-novia.webp",
        title: "Maquillaje de novia",
        description:
          "Realza tu belleza con un maquillaje de novia personalizado, duradero y armonioso, diseñado para complementar tu estilo nupcial.",
        href: "#",
      },
      {
        image: "/images/looks-main.webp",
        title: "Prueba de maquillaje de novia",
        description:
          "Encuentra el look ideal antes de tu boda, probando técnicas, tonos y estilos hasta lograr un maquillaje personalizado.",
        href: "#",
      },
      {
        image: "/images/gallery/gallery-21.webp",
        title: "Maquillaje quinceañeras y Sweet 16",
        description:
          "Brilla en tu celebración con un maquillaje fresco, personalizado, diseñado para realzar tu belleza durante el evento.",
        href: "#",
      },
      {
        image: "/images/services/maquillaje-social.webp",
        title: "Maquillaje social estudio",
        description:
          "Disfruta un maquillaje personalizado para eventos de día o noche, resaltando tus facciones con técnicas y acabado impecable.",
        href: "#",
      },
      {
        image: "/images/gallery/gallery-31.webp",
        title: "Maquillaje social locación",
        description:
          "Luce espectacular en tu evento con maquillaje personalizado en locación, adaptado al horario, estilo, outfit y esencia personal.",
        href: "#",
      },
      {
        image: "/images/gallery/gallery-27.webp",
        title: "Maquillaje sesiones fotográficas",
        description:
          "Potencia tu imagen con maquillaje personalizado, creado para complementar el concepto, estilo y propósito de cada sesión.",
        href: "#",
      },
    ],
  },
  {
    id: 'hair',
    title: "Hair",
    items: [
      {
        image: "/images/services/ondas-glam.webp",
        title: "Ondas glam",
        description:
          "Consigue ondas glamorosas y duraderas, adaptadas a tu estilo; precio puede variar dependiendo de las condiciones del cabello.",
        href: "#",
      },
      {
        image: "/images/services/recogido.webp",
        title: "Recogidos",
        description:
          "Luce un recogido elegante y sofisticado; precio puede variar dependiendo de las condiciones del cabello y sus características.",
        href: "#",
      },
      {
        image: "/images/services/semirecogido.webp",
        title: "Semirecogidos",
        description:
          "Disfruta un semirecogido versátil; precio puede variar dependiendo de las condiciones del cabello y adaptarse a tu estilo.",
        href: "#",
      },
      {
        image: "#",
        title: "Trenzas",
        description:
          "Elige trenzas modernas y personalizadas que aporten textura, estilo y personalidad a tu look, ideales para distintas ocasiones.",
        href: "#",
      },
      {
        image: "/images/services/secado-planchado.webp",
        title: "Secado y planchado",
        description:
          "Obtén un cabello pulido y manejable con secado y planchado profesional, logrando un acabado suave, elegante y duradero.",
        href: "#",
      },
      {
        image: "#",
        title: "Peinados para niñas",
        description:
          "Peinado cómodo para niñas, adaptado a su edad y ocasión. Aplica para niñas hasta ocho (08) años.",
        href: "#",
      },
      {
        image: "#",
        title: "Blow dry / secado profesional",
        description:
          "Disfruta un blow dry para conseguir movimiento y brillo; precio puede variar dependiendo de las condiciones del cabello.",
        href: "#",
      },
      {
        image: "#",
        title: "Blow dry / secado + ondas",
        description:
          "Combina un blow dry con ondas glamorosas y suaves; precio puede variar dependiendo de las condiciones del cabello.",
        href: "#",
      },
      {
        image: "#",
        title: "Hidratación capilar",
        description:
          "Devuelve suavidad y vitalidad a tu cabello mediante hidratación; precio puede variar dependiendo de las condiciones del cabello.",
        href: "#",
      },
      {
        image: "/images/services/botox-capilar.webp",
        title: "Botox capilar",
        description:
          "Revitaliza tu cabello con botox capilar para mejorar brillo; precio puede variar dependiendo de las condiciones del cabello.",
        href: "#",
      },
      {
        image: "#",
        title: "Alisado con keratina",
        description:
          "Disfruta alisado con keratina para controlar frizz y suavizarlo; precio puede variar dependiendo de las condiciones del cabello.",
        href: "#",
      },
    ],
  },
  {
    id: "hairstyling",
    title: "Hairstyling",
    items: [
      {
        image: "#",
        title: "Corte de cabello",
        description:
          "Renueva tu look con corte personalizado, incluye lavado y tarifa única, adaptado a tus facciones, estilo y preferencias.",
        href: "#",
      },
      {
        image: "#",
        title: "Corte de cabello + secado",
        description:
          "Actualiza tu look con corte y secado profesional, con tarifa única, logrando una apariencia pulida, fresca y adaptada.",
        href: "#",
      },
      {
        image: "#",
        title: "Retoque de raíz",
        description:
          "Refresca con retoque de raíz que incluye lavado y secado, con tarifa única, para mantener una apariencia uniforme.",
        href: "#",
      },
      {
        image: "#",
        title: "Tinte completo",
        description:
          "Renueva tu color con un tinte personalizado; tarifa puede variar según largo, cantidad y condición del cabello.",
        href: "#",
      },
      {
        image: "#",
        title: "Servicio de color personalizado",
        description:
          "Diseñado según el resultado que desea la clienta. Requiere una evaluación previa con la especialista para analizar el cabello, su condición y antecedentes químicos para determinar qué resultado puede lograrse y crear una propuesta que se ajuste a sus expectativas.",
        href: "#",
      },
    ],
  },
  {
    id: "facials",
    title: "Facials",
    items: [
      {
        image: "/images/services/facial-mantenimiento.webp",
        title: "Facial de mantenimiento",
        description:
          "Mantén tu piel luminosa y equilibrada con un facial de mantenimiento diseñado para conservar limpieza, frescura y bienestar.",
        href: "#",
      },
      {
        image: "/images/services/facial-adolescente.webp",
        title: "Facial para adolescentes",
        description:
          "Cuida la piel adolescente con un facial suave y personalizado, enfocado en limpieza, equilibrio y una apariencia saludable.",
        href: "#",
      },
      {
        image: "/images/services/facial-profundo.webp",
        title: "Facial profundo",
        description:
          "Purifica y revitaliza tu piel con un facial que ayuda a eliminar impurezas, mejorar textura y devolver luminosidad.",
        href: "#",
      },
      {
        image: "/images/services/microdermoabrasion.webp",
        title: "Microdermoabrasión",
        description:
          "Renueva la textura y luminosidad de tu piel mediante microdermoabrasión, incluyendo limpieza facial profunda dentro del protocolo completo.",
        href: "#",
      },
      {
        image: "/images/services/facial-plasma.webp",
        title: "Facial profundo con plasma rico en plaquetas",
        description:
          "Potencia la renovación de tu piel con un facial y plasma rico en plaquetas, personalizado según tus necesidades.",
        href: "#",
      },
    ],
  },
  {
    id: "eyebrows-lashes",
    title: "EYEBROWS & LASHES",
    items: [
      {
        image: "/images/services/diseno-depilacion.webp",
        title: "Diseño y depilación de cejas",
        description:
          "Define y depila tus cejas para lograr una forma armoniosa, limpia y favorecedora, adaptada a tus facciones.",
        href: "#",
      },
      {
        image: "/images/services/henna.webp",
        title: "Diseño, depilación y aplicación de henna para cejas",
        description:
          "Diseña y depila tus cejas, complementándolas con henna para aportar definición, intensidad y un acabado armonioso y personalizado.",
        href: "#",
      },
      {
        image: "/images/services/lashlifting.webp",
        title: "Lashlifting",
        description:
          "Realza tu mirada con lashlifting, curvando tus pestañas naturales para conseguir una apariencia más abierta, definida y femenina.",
        href: "#",
      },
      {
        image: "/images/services/extension-pestanas.webp",
        title: "Extensiones de pestañas clásicas",
        description:
          "Consigue una mirada elegante y natural con extensiones clásicas, aplicadas cuidadosamente para aportar longitud, definición y sofisticación.",
        href: "#",
      },
      {
        image: "#",
        title: "Extensiones de pestañas con volumen",
        description:
          "Intensifica tu mirada con extensiones de volumen, creando pestañas más densas, llamativas y personalizadas según tu estilo.",
        href: "#",
      },
      {
        image: "/images/services/extension-hibridas.webp",
        title: "Extensiones de pestañas híbridas",
        description:
          "Combina naturalidad y volumen con extensiones híbridas, creando una mirada definida, equilibrada y personalizada para cada ocasión.",
        href: "#",
      },
      {
        image: "#",
        title: "Remoción de extensiones",
        description:
          "No realizamos refill en trabajos de otras especialistas; este servicio debe incluirse al retirar extensiones previas correctamente.",
        href: "#",
      },
      {
        image: "/images/services/brow-lamination.webp",
        title: "Brow lamination",
        description:
          "Alinea, define y estiliza tus cejas con brow lamination, logrando una apariencia abundante y que realza su forma.",
        href: "#",
      },
    ],
  },
  {
    id: "laser",
    title: "Laser",
    items: [
      {
        image: "#",
        title: "Depilación láser bozo",
        description:
          "Reduce progresivamente el vello del bozo con láser diodo, logrando una piel más suave y una apariencia uniforme.",
        href: "#",
      },
      {
        image: "#",
        title: "Depilación láser bikini",
        description:
          "Disminuye el vello del bikini mediante láser diodo, buscando una piel más suave, uniforme y libre de afeitado.",
        href: "#",
      },
      {
        image: "#",
        title: "Depilación láser axilas",
        description:
          "Reduce el vello de las axilas con láser diodo, ayudando a conseguir una piel más suave y uniforme.",
        href: "#",
      },
      {
        image: "#",
        title: "Depilación láser brasileña",
        description:
          "Disminuye el vello de la zona brasileña con láser diodo, para una piel más suave y resultados duraderos.",
        href: "#",
      },
      {
        image: "#",
        title: "Depilación láser glúteos",
        description:
          "Reduce progresivamente el vello de los glúteos mediante láser diodo, favoreciendo una piel más suave, uniforme y cómoda.",
        href: "#",
      },
      {
        image: "#",
        title: "Depilación láser mentón",
        description:
          "Disminuye progresivamente el vello del mentón con láser diodo, ayudando a conseguir una piel más suave y uniforme.",
        href: "#",
      },
      {
        image: "#",
        title: "Depilación láser patillas",
        description:
          "Reduce progresivamente el vello de las patillas con láser diodo, logrando una apariencia más limpia, suave y uniforme.",
        href: "#",
      },
      {
        image: "#",
        title: "Depilación láser brazos completos",
        description:
          "Disminuye progresivamente el vello de los brazos completos con láser diodo, buscando una piel más suave y uniforme.",
        href: "#",
      },
      {
        image: "#",
        title: "Depilación láser medio brazo",
        description:
          "Reduce progresivamente el vello del medio brazo con láser diodo, ayudando a conseguir una piel suave y uniforme.",
        href: "#",
      },
      {
        image: "#",
        title: "Depilación láser piernas completas",
        description:
          "Disminuye progresivamente el vello de las piernas completas con láser diodo, para una piel más suave y duradera.",
        href: "#",
      },
      {
        image: "#",
        title: "Depilación láser media pierna",
        description:
          "Reduce el vello de la media pierna con láser diodo, ayudando a conseguir una piel suave y uniforme.",
        href: "#",
      },
      {
        image: "#",
        title: "Depilación láser espalda completa",
        description:
          "Disminuye progresivamente el vello de la espalda completa con láser diodo, favoreciendo una piel más suave y uniforme.",
        href: "#",
      },
      {
        image: "#",
        title: "Depilación láser pecho y abs completos",
        description:
          "Reduce progresivamente el vello del pecho y abdomen completos con láser diodo, buscando una piel suave y uniforme.",
        href: "#",
      },
      {
        image: "#",
        title: "Depilación láser línea abs inferior",
        description:
          "Disminuye el vello de la línea abdominal inferior con láser diodo, logrando una piel más suave y uniforme.",
        href: "#",
      },
    ],
  },
];
