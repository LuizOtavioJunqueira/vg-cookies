// DTOs serializaveis usados pela UI. Mapeados a partir do Prisma na camada de dados.
// Manter a UI desacoplada do ORM.

export interface ProductDTO {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  ingredients: string;
  priceCents: number;
  weightGrams: number | null;
  imageUrl: string;
  available: boolean;
  featured: boolean;
  stockQty: number | null;
}

export interface GalleryPhotoDTO {
  id: string;
  imageUrl: string;
  caption: string | null;
}

export interface SiteSettingsDTO {
  deliveryFeeCents: number;
  whatsappNumber: string;
  phone: string | null;
  address: string | null;
  instagram: string | null;
  heroTitle: string | null;
  heroSubtitle: string | null;
  aboutText: string | null;
  selo1Title: string;
  selo1Desc: string;
  selo2Title: string;
  selo2Desc: string;
  selo3Title: string;
  selo3Desc: string;
  // Flag: Pix esta configurado? (a chave em si nao vai pro cliente)
  pixConfigured: boolean;
}

export interface FaqItemDTO {
  id: string;
  question: string;
  answer: string;
}
