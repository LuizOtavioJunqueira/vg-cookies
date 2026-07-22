import { z } from "zod";

export const paymentMethodSchema = z.enum([
  "PIX",
  "CARTAO_CREDITO",
  "CARTAO_DEBITO",
  "DINHEIRO",
]);
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

export const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().min(2, "Informe seu nome").max(80),
    address: z.string().min(5, "Informe o endereço de entrega").max(200),
    phone: z.string().max(20).optional().or(z.literal("")),
  }),
  paymentMethod: paymentMethodSchema,
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        qty: z.number().int().positive().max(50),
      }),
    )
    .min(1, "Carrinho vazio"),
});
export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const productSchema = z.object({
  name: z.string().min(1, "Nome obrigatório").max(80),
  shortDescription: z.string().min(1).max(200),
  longDescription: z.string().min(1).max(1000),
  ingredients: z.string().min(1).max(1000),
  priceCents: z.number().int().min(0).max(1_000_000),
  weightGrams: z.number().int().min(0).max(100_000).nullable(),
  imageUrl: z.string().max(500),
  imagePublicId: z.string().max(200),
  available: z.boolean(),
  featured: z.boolean(),
  stockQty: z.number().int().min(0).max(100_000).nullable(),
  sortOrder: z.number().int().min(0).max(9999),
});
export type ProductInput = z.infer<typeof productSchema>;

export const settingsSchema = z.object({
  pixKey: z.string().max(200),
  pixKeyType: z.enum(["CPF", "CNPJ", "EMAIL", "PHONE", "RANDOM"]),
  merchantName: z.string().max(25),
  merchantCity: z.string().max(15),
  whatsappNumber: z
    .string()
    .max(20)
    .regex(/^\d*$/, "Apenas números (ex.: 5517996636191)"),
  deliveryFeeCents: z.number().int().min(0).max(100_000),
  phone: z.string().max(40).nullable(),
  address: z.string().max(120).nullable(),
  instagram: z.string().max(60).nullable(),
});
export type SettingsInput = z.infer<typeof settingsSchema>;

export const contentSchema = z.object({
  heroTitle: z.string().max(120).nullable(),
  heroSubtitle: z.string().max(300).nullable(),
  aboutText: z.string().max(500).nullable(),
  heroImageUrl: z.string().max(500).nullable(),
  heroImagePublicId: z.string().max(200).nullable(),
  comoImageUrl: z.string().max(500).nullable(),
  comoImagePublicId: z.string().max(200).nullable(),
  selo1Title: z.string().min(1).max(40),
  selo1Desc: z.string().min(1).max(120),
  selo2Title: z.string().min(1).max(40),
  selo2Desc: z.string().min(1).max(120),
  selo3Title: z.string().min(1).max(40),
  selo3Desc: z.string().min(1).max(120),
});
export type ContentInput = z.infer<typeof contentSchema>;

export const faqItemSchema = z.object({
  question: z.string().min(1, "Pergunta obrigatória").max(200),
  answer: z.string().min(1, "Resposta obrigatória").max(1000),
  sortOrder: z.number().int().min(0).max(9999),
});
export type FaqItemInput = z.infer<typeof faqItemSchema>;

export const adminCreateSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(120),
  password: z.string().min(8, "Mínimo 8 caracteres").max(100),
});
export type AdminCreateInput = z.infer<typeof adminCreateSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});