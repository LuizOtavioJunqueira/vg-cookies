"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { cloudinary, CLOUDINARY_FOLDER } from "@/lib/cloudinary";
import { assertAdmin, assertSuperAdmin } from "@/lib/session";
import {
  productSchema,
  settingsSchema,
  contentSchema,
  faqItemSchema,
  adminCreateSchema,
} from "@/lib/validations";

type ActionResult = { ok: true } | { ok: false; error: string };

function fail(e: unknown): ActionResult {
  return { ok: false, error: e instanceof Error ? e.message : "Erro inesperado." };
}

function revalidateSite() {
  revalidatePath("/");
  revalidatePath("/painel-x7k2");
}

/* ---------- PRODUTOS ---------- */
export async function createProduct(input: unknown): Promise<ActionResult> {
  try {
    await assertAdmin();
    const data = productSchema.parse(input);
    await prisma.product.create({ data });
    revalidateSite();
    revalidatePath("/painel-x7k2/produtos");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function updateProduct(id: string, input: unknown): Promise<ActionResult> {
  try {
    await assertAdmin();
    const data = productSchema.parse(input);
    await prisma.product.update({ where: { id }, data });
    revalidateSite();
    revalidatePath("/painel-x7k2/produtos");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    const p = await prisma.product.findUnique({ where: { id } });
    if (p?.imagePublicId) {
      await cloudinary.uploader.destroy(p.imagePublicId).catch(() => {});
    }
    await prisma.product.delete({ where: { id } });
    revalidateSite();
    revalidatePath("/painel-x7k2/produtos");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/* ---------- CONFIGURAÇÕES (Pix, WhatsApp, taxa, contato) ---------- */
export async function updateSettings(input: unknown): Promise<ActionResult> {
  try {
    await assertAdmin();
    const data = settingsSchema.parse(input);
    await prisma.siteSettings.update({ where: { id: 1 }, data });
    revalidateSite();
    revalidatePath("/painel-x7k2/configuracoes");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/* ---------- CMS (textos da Home) ---------- */
export async function updateContent(input: unknown): Promise<ActionResult> {
  try {
    await assertAdmin();
    const data = contentSchema.parse(input);
    await prisma.siteSettings.update({ where: { id: 1 }, data });
    revalidateSite();
    revalidatePath("/painel-x7k2/conteudo");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/* ---------- FAQ ---------- */
export async function createFaqItem(input: unknown): Promise<ActionResult> {
  try {
    await assertAdmin();
    const data = faqItemSchema.parse(input);
    await prisma.faqItem.create({ data });
    revalidateSite();
    revalidatePath("/painel-x7k2/faq");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function updateFaqItem(id: string, input: unknown): Promise<ActionResult> {
  try {
    await assertAdmin();
    const data = faqItemSchema.parse(input);
    await prisma.faqItem.update({ where: { id }, data });
    revalidateSite();
    revalidatePath("/painel-x7k2/faq");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteFaqItem(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    await prisma.faqItem.delete({ where: { id } });
    revalidateSite();
    revalidatePath("/painel-x7k2/faq");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/* ---------- GALERIA ---------- */
export async function addGalleryPhoto(input: {
  imageUrl: string;
  imagePublicId: string;
  caption?: string;
}): Promise<ActionResult> {
  try {
    await assertAdmin();
    if (!input.imageUrl || !input.imagePublicId)
      throw new Error("Envie uma imagem antes de salvar.");
    const count = await prisma.galleryPhoto.count();
    await prisma.galleryPhoto.create({
      data: {
        imageUrl: input.imageUrl,
        imagePublicId: input.imagePublicId,
        caption: input.caption ?? null,
        sortOrder: count,
      },
    });
    revalidateSite();
    revalidatePath("/painel-x7k2/galeria");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteGalleryPhoto(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    const ph = await prisma.galleryPhoto.findUnique({ where: { id } });
    if (ph?.imagePublicId) {
      await cloudinary.uploader.destroy(ph.imagePublicId).catch(() => {});
    }
    await prisma.galleryPhoto.delete({ where: { id } });
    revalidateSite();
    revalidatePath("/painel-x7k2/galeria");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/* ---------- ADMINS (só super admin) ---------- */
export async function createAdmin(input: unknown): Promise<ActionResult> {
  try {
    await assertSuperAdmin();
    const { name, email, password } = adminCreateSchema.parse(input);
    const exists = await prisma.admin.findUnique({ where: { email } });
    if (exists) throw new Error("Já existe um admin com esse e-mail.");
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.admin.create({
      data: { name, email, passwordHash, role: "ADMIN" },
    });
    revalidatePath("/painel-x7k2/admins");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteAdmin(id: string): Promise<ActionResult> {
  try {
    const me = await assertSuperAdmin();
    if (me.id === id) throw new Error("Você não pode remover a si mesmo.");
    const target = await prisma.admin.findUnique({ where: { id } });
    if (target?.role === "SUPER_ADMIN")
      throw new Error("Não é possível remover o super admin.");
    await prisma.admin.delete({ where: { id } });
    revalidatePath("/painel-x7k2/admins");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/* ---------- CLOUDINARY (assinatura para upload direto do client) ---------- */
export async function signCloudinaryUpload(): Promise<
  | { ok: true; timestamp: number; signature: string; apiKey: string; cloudName: string; folder: string }
  | { ok: false; error: string }
> {
  try {
    await assertAdmin();
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret)
      throw new Error("Cloudinary não configurado no ambiente.");

    const timestamp = Math.round(Date.now() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder: CLOUDINARY_FOLDER },
      apiSecret,
    );
    return { ok: true, timestamp, signature, apiKey, cloudName, folder: CLOUDINARY_FOLDER };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Erro" };
  }
}
