import { PrismaClient, PixKeyType } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import bcrypt from "bcryptjs";

neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL ?? "" });
const prisma = new PrismaClient({ adapter });

// Cardapio inicial (do impresso). imageUrl vazio ate o admin subir foto no Cloudinary.
const PRODUCTS = [
  { name: "Baunilha Nutella", priceCents: 1300, short: "Massa de baunilha, Nutella e gotas de chocolate.", long: "Massa tradicional de baunilha recheada com Nutella original e gotas de chocolate nobre na massa.", ing: "Farinha de trigo, manteiga, acucar, ovos, Nutella, gotas de chocolate nobre, essencia de baunilha.", featured: true },
  { name: "Chocolate Nutella", priceCents: 1300, short: "Massa de cacau 100% com Nutella e gotas de chocolate.", long: "Massa de cacau 100% recheada com Nutella e gotas de chocolate nobre na massa.", ing: "Farinha de trigo, cacau 100%, manteiga, acucar, ovos, Nutella, gotas de chocolate nobre.", featured: false },
  { name: "Red Nutella", priceCents: 1300, short: "Leite ninho e cacau, Nutella e gotas de chocolate branco.", long: "Massa de leite ninho e cacau em po com corante comestivel vermelho, recheada com Nutella e gotas de chocolate branco nobre na massa.", ing: "Farinha de trigo, leite ninho, cacau, corante comestivel, manteiga, acucar, ovos, Nutella, chocolate branco nobre.", featured: false },
  { name: "Kinder", priceCents: 1500, short: "Recheio cremoso de Bueno e meio Kinder no topo.", long: "Massa tradicional de baunilha com recheio cremoso de Bueno, gotas chips e meio Kinder Bueno no topo.", ing: "Farinha de trigo, manteiga, acucar, ovos, creme de Bueno, gotas de chocolate, Kinder Bueno.", featured: true },
  { name: "Kit Kat", priceCents: 1500, short: "Recheio artesanal de KitKat e meio KitKat no topo.", long: "Massa tradicional de baunilha com um recheio artesanal de KitKat e meio KitKat no topo.", ing: "Farinha de trigo, manteiga, acucar, ovos, recheio de KitKat, KitKat.", featured: false },
  { name: "Reeses", priceCents: 1500, short: "Manteiga de amendoim, cubos de chocolate e pasta de Reeses.", long: "Massa feita com a manteiga de amendoim Reeses, cubos de chocolate nobre e pasta de Reeses no topo (sem recheio).", ing: "Farinha de trigo, manteiga de amendoim Reeses, acucar, ovos, chocolate nobre, pasta de Reeses.", featured: false },
  { name: "Lotus Biscoff", priceCents: 1500, short: "Creme de Lotus artesanal e biscoito caramelizado.", long: "Massa de baunilha com especiarias, recheada com um creme de Lotus artesanal e um biscoito Lotus caramelizado no topo.", ing: "Farinha de trigo, especiarias, manteiga, acucar, ovos, creme de Lotus, biscoito Lotus.", featured: true },
  { name: "Ovomaltine", priceCents: 1500, short: "Creme crocante de ovomaltine e um toque no topo.", long: "Massa tradicional de baunilha recheada com creme crocante de ovomaltine e um toque de ovomaltine no topo.", ing: "Farinha de trigo, manteiga, acucar, ovos, creme crocante de ovomaltine, ovomaltine.", featured: false },
  { name: "Bala Baiana", priceCents: 1600, short: "Chocolate branco, caramelo, leite de coco e coco ralado.", long: "Massa feita com cubos de chocolate nobre branco, lascas de caramelo, leite de coco e coco ralado.", ing: "Farinha de trigo, chocolate branco nobre, caramelo, leite de coco, coco ralado, manteiga, acucar, ovos.", featured: true },
];

const FAQ_ITEMS = [
  {
    question: "Como faço o pedido?",
    answer:
      "Escolha os cookies no cardápio, adicione ao carrinho e finalize. O site gera um Pix com o valor exato, você paga pelo app do banco e envia o comprovante no nosso WhatsApp.",
  },
  {
    question: "Quais as formas de pagamento?",
    answer:
      "Por enquanto trabalhamos com Pix. Na finalização você recebe o código copia e cola e o QR Code na tela.",
  },
  {
    question: "Qual a taxa de entrega?",
    answer: "O valor aparece no resumo do pedido antes de você finalizar.",
  },
  {
    question: "Quanto tempo demora?",
    answer:
      "Em média 40 minutos, já que assamos na hora. Em horários de pico pode variar um pouco.",
  },
  {
    question: "Fazem encomenda para festas?",
    answer:
      "Sim! Para pedidos grandes, chame no WhatsApp com antecedência que a gente organiza tudo.",
  },
];

async function main() {
  // Super admin
  const email = process.env.SEED_SUPERADMIN_EMAIL ?? "dono@vgcookies.com";
  const password = process.env.SEED_SUPERADMIN_PASSWORD ?? "troque-esta-senha";
  const name = process.env.SEED_SUPERADMIN_NAME ?? "Dono VG";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { name, email, passwordHash, role: "SUPER_ADMIN" },
  });
  console.log(`Super admin: ${email}`);

  // SiteSettings singleton com PLACEHOLDERS — dono preenche no painel
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      pixKey: "",
      pixKeyType: PixKeyType.RANDOM,
      merchantName: "",
      merchantCity: "POTIRENDABA",
      whatsappNumber: "",
      deliveryFeeCents: 0,
      phone: "(17) 99663-6191",
      address: "Potirendaba - SP",
      instagram: "@vg_cookies",
      heroTitle: "Cookie recheado, do jeito que tem que ser.",
      heroSubtitle:
        "Massa artesanal, recheio generoso e entrega em ate 40 minutos. Feito na hora, so depois que voce pede.",
      aboutText:
        "Massa artesanal descansada, recheio generoso e forno na medida. E assim que garantimos aquele centro cremoso em cada mordida.",
    },
  });
  console.log("SiteSettings criado (Pix vazio — preencher no painel).");

  // Produtos
  for (let i = 0; i < PRODUCTS.length; i++) {
    const p = PRODUCTS[i];
    const existing = await prisma.product.findFirst({ where: { name: p.name } });
    if (existing) continue;
    await prisma.product.create({
      data: {
        name: p.name,
        shortDescription: p.short,
        longDescription: p.long,
        ingredients: p.ing,
        priceCents: p.priceCents,
        imageUrl: "",
        imagePublicId: "",
        available: true,
        featured: p.featured,
        sortOrder: i,
      },
    });
  }
  console.log(`${PRODUCTS.length} produtos garantidos.`);

  // FAQ inicial — só cria se a tabela estiver vazia (não duplica em re-seed)
  const faqCount = await prisma.faqItem.count();
  if (faqCount === 0) {
    for (let i = 0; i < FAQ_ITEMS.length; i++) {
      await prisma.faqItem.create({
        data: { ...FAQ_ITEMS[i], sortOrder: i },
      });
    }
    console.log(`${FAQ_ITEMS.length} perguntas de FAQ criadas.`);
  } else {
    console.log("FAQ já tem itens — nada criado.");
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
