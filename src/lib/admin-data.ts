import "server-only";
import { prisma } from "@/lib/prisma";

export interface AdminProduct {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  ingredients: string;
  priceCents: number;
  weightGrams: number | null;
  imageUrl: string;
  imagePublicId: string;
  available: boolean;
  featured: boolean;
  stockQty: number | null;
  sortOrder: number;
}

export async function getAllProducts(): Promise<AdminProduct[]> {
  const rows = await prisma.product.findMany({ orderBy: { sortOrder: "asc" } });
  return rows as AdminProduct[];
}

export async function getAdminGallery() {
  return prisma.galleryPhoto.findMany({ orderBy: { sortOrder: "asc" } }) as Promise<
    { id: string; imageUrl: string; caption: string | null }[]
  >;
}

export interface FullSettings {
  pixKey: string;
  pixKeyType: "CPF" | "CNPJ" | "EMAIL" | "PHONE" | "RANDOM";
  merchantName: string;
  merchantCity: string;
  whatsappNumber: string;
  deliveryFeeCents: number;
  phone: string | null;
  address: string | null;
  instagram: string | null;
  heroTitle: string | null;
  heroSubtitle: string | null;
  aboutText: string | null;
  heroImageUrl: string | null;
  heroImagePublicId: string | null;
  comoImageUrl: string | null;
  comoImagePublicId: string | null;
  selo1Title: string;
  selo1Desc: string;
  selo2Title: string;
  selo2Desc: string;
  selo3Title: string;
  selo3Desc: string;
}

export async function getFullSettings(): Promise<FullSettings> {
  const s = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  if (!s) throw new Error("SiteSettings não encontrado. Rode o seed.");
  return s as FullSettings;
}

export interface AdminFaqItem {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
}

export async function getFaqItems(): Promise<AdminFaqItem[]> {
  const rows = await prisma.faqItem.findMany({ orderBy: { sortOrder: "asc" } });
  return rows as AdminFaqItem[];
}

export async function getAdmins() {
  return prisma.admin.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  }) as Promise<
    { id: string; name: string; email: string; role: string; createdAt: Date }[]
  >;
}
