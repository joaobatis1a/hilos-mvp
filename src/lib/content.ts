import type { StaticImageData } from "next/image";
import conjuntoEstampado from "@/assets/photos/conjunto-estampado.jpg";
import pantalonaLinho from "@/assets/photos/pantalona-linho.jpg";
import pantalonaAlfaiataria from "@/assets/photos/pantalona-alfaiataria.jpg";
import vestidoOmbro from "@/assets/photos/vestido-ombro.jpg";
import vestidoBrisa from "@/assets/photos/vestido-brisa.jpg";
import pantalonaNoite from "@/assets/photos/pantalona-noite.jpg";
import blusaLinho from "@/assets/photos/blusa-linho.jpg";
import tecidoMovimento from "@/assets/photos/tecido-movimento.jpg";
import vestidoFluido from "@/assets/photos/vestido-fluido.jpg";
import praiaVento from "@/assets/photos/praia-vento.jpg";
import lojaShopping from "@/assets/photos/loja-shopping.jpg";
import lojaVitrine from "@/assets/photos/loja-vitrine.jpg";
import lojaInterior from "@/assets/photos/loja-interior.jpg";
import lojaFachada from "@/assets/photos/loja-fachada.jpg";

export const photos = {
  conjuntoEstampado,
  pantalonaLinho,
  pantalonaAlfaiataria,
  vestidoOmbro,
  vestidoBrisa,
  pantalonaNoite,
  blusaLinho,
  tecidoMovimento,
  vestidoFluido,
  praiaVento,
  lojaShopping,
  lojaVitrine,
  lojaInterior,
  lojaFachada,
};

export type Product = {
  name: string;
  category: "Pantalonas" | "Vestidos" | "Conjuntos" | "Novidades";
  fabric: string;
  sizes: string;
  image: StaticImageData;
};

export const products: Product[] = [
  {
    name: "Conjunto Maracatu",
    category: "Conjuntos",
    fabric: "Viscose estampada",
    sizes: "P ao GG",
    image: conjuntoEstampado,
  },
  {
    name: "Pantalona Capibaribe",
    category: "Pantalonas",
    fabric: "Linho misto",
    sizes: "P ao GG",
    image: pantalonaLinho,
  },
  {
    name: "Vestido Ciranda",
    category: "Vestidos",
    fabric: "Viscolinho",
    sizes: "P ao G",
    image: vestidoOmbro,
  },
  {
    name: "Pantalona Madrugada",
    category: "Novidades",
    fabric: "Viscose fluida",
    sizes: "P ao GG",
    image: pantalonaNoite,
  },
  {
    name: "Vestido Brisa",
    category: "Vestidos",
    fabric: "Algodão leve",
    sizes: "P ao G",
    image: vestidoBrisa,
  },
  {
    name: "Conjunto Boa Viagem",
    category: "Conjuntos",
    fabric: "Linho",
    sizes: "P ao GG",
    image: blusaLinho,
  },
];

export type Location = {
  name: string;
  badge: "Ponto HILOS" | "Evento" | "Pop-up" | "Próxima edição";
  description: string;
  image: StaticImageData;
};

export const locations: Location[] = [
  {
    name: "North Way",
    badge: "Ponto HILOS",
    description: "Nosso ponto fixo: a coleção inteira para provar com calma.",
    image: lojaShopping,
  },
  {
    name: "Eventos",
    badge: "Evento",
    description: "Feiras e encontros de moda autoral por Pernambuco.",
    image: lojaVitrine,
  },
  {
    name: "Aldeia",
    badge: "Pop-up",
    description: "Uma arara HILOS no meio do verde, por temporada.",
    image: lojaInterior,
  },
  {
    name: "Patteo Olinda",
    badge: "Próxima edição",
    description: "Em breve. Fale com a gente para saber a data.",
    image: lojaFachada,
  },
];

export const menuLinks = [
  { href: "#colecao", label: "Coleção", image: conjuntoEstampado },
  { href: "#manifesto", label: "Manifesto", image: tecidoMovimento },
  { href: "#destaque", label: "Pantalona HILOS", image: pantalonaAlfaiataria },
  { href: "#movimento", label: "Onde encontrar", image: lojaShopping },
  { href: "#atacado", label: "Atacado", image: lojaInterior },
  { href: "#comunidade", label: "#usehilos", image: vestidoBrisa },
];

export const categories = ["Pantalonas", "Vestidos", "Conjuntos", "Novidades"] as const;

export const instagramShots = [
  vestidoBrisa,
  conjuntoEstampado,
  praiaVento,
  pantalonaLinho,
  vestidoOmbro,
  pantalonaNoite,
  blusaLinho,
  vestidoFluido,
  pantalonaAlfaiataria,
  tecidoMovimento,
];
