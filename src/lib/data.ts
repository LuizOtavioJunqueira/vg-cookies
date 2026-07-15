import "server-only";
import { prisma } from "@/lib/prisma";
import type { ProductDTO, GalleryPhotoDTO, SiteSettingsDTO, FaqItemDTO } from "@/lib/types";

// Todas as leituras da Home. Server-only. Se o DB nao estiver acessivel
// (ex.: build sem env), retornam vazio/defaults para nao quebrar a pagina.

export async function getProducts(): Promise<ProductDTO[]> {
  try {
    const rows = await prisma.product.findMany({
      where: { available: true },
      orderBy: { sortOrder: "asc" },
    });
    return rows.map(toProductDTO);
  } catch (e) {
    console.error("[getProducts] falha ao consultar o banco:", e);
    return [];
  }
}

export async function getFeaturedProducts(limit = 4): Promise<ProductDTO[]> {
  try {
    const rows = await prisma.product.findMany({
      where: { available: true, featured: true },
      orderBy: { sortOrder: "asc" },
      take: limit,
    });
    return rows.map(toProductDTO);
  } catch (e) {
    console.error("[getFeaturedProducts] falha ao consultar o banco:", e);
    return [];
  }
}

export async function getGallery(limit = 6): Promise<GalleryPhotoDTO[]> {
  try {
    const rows = await prisma.galleryPhoto.findMany({
      orderBy: { sortOrder: "asc" },
      take: limit,
    });
    return rows.map((r: { id: string; imageUrl: string; caption: string | null }) => ({ id: r.id, imageUrl: r.imageUrl, caption: r.caption }));
  } catch (e) {
    console.error("[getGallery] falha ao consultar o banco:", e);
    return [];
  }
}

export async function getFaq(): Promise<FaqItemDTO[]> {
  try {
    const rows = await prisma.faqItem.findMany({ orderBy: { sortOrder: "asc" } });
    return rows.map((r: { id: string; question: string; answer: string }) => ({
      id: r.id,
      question: r.question,
      answer: r.answer,
    }));
  } catch (e) {
    console.error("[getFaq] falha ao consultar o banco:", e);
    return [];
  }
}

export async function getSettings(): Promise<SiteSettingsDTO> {
  try {
    const s = await prisma.siteSettings.findUnique({ where: { id: 1 } });
    if (!s) return defaultSettings();
    return {
      deliveryFeeCents: s.deliveryFeeCents,
      whatsappNumber: s.whatsappNumber,
      phone: s.phone,
      address: s.address,
      instagram: s.instagram,
      heroTitle: s.heroTitle,
      heroSubtitle: s.heroSubtitle,
      aboutText: s.aboutText,
      selo1Title: s.selo1Title,
      selo1Desc: s.selo1Desc,
      selo2Title: s.selo2Title,
      selo2Desc: s.selo2Desc,
      selo3Title: s.selo3Title,
      selo3Desc: s.selo3Desc,
      pixConfigured: s.pixKey.trim().length > 0 && s.merchantName.trim().length > 0,
    };
  } catch (e) {
    console.error("[getSettings] falha ao consultar o banco:", e);
    return defaultSettings();
  }
}

function defaultSettings(): SiteSettingsDTO {
  return {
    deliveryFeeCents: 0,
    whatsappNumber: "",
    phone: null,
    address: "Potirendaba - SP",
    instagram: "@vg_cookies",
    heroTitle: "Cookie recheado, do jeito que tem que ser.",
    heroSubtitle:
      "Massa artesanal, recheio generoso e entrega em até 40 minutos. Feito na hora, só depois que você pede.",
    aboutText:
      "Massa artesanal descansada, recheio generoso e forno na medida. É assim que garantimos aquele centro cremoso em cada mordida.",
    selo1Title: "Assados na hora",
    selo1Desc: "Cada cookie sai do forno depois do seu pedido.",
    selo2Title: "Em até 40 minutos",
    selo2Desc: "Do forno até a sua porta, quentinho.",
    selo3Title: "Retirada ou delivery",
    selo3Desc: "Entregamos em Potirendaba e região.",
    pixConfigured: false,
  };
}

interface ProductRow {
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

function toProductDTO(p: ProductRow): ProductDTO {
  return {
    id: p.id,
    name: p.name,
    shortDescription: p.shortDescription,
    longDescription: p.longDescription,
    ingredients: p.ingredients,
    priceCents: p.priceCents,
    weightGrams: p.weightGrams,
    imageUrl: p.imageUrl,
    available: p.available,
    featured: p.featured,
    stockQty: p.stockQty,
  };
}
