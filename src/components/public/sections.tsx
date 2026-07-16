"use client";

import Link from "next/link";
import type { ProductDTO, GalleryPhotoDTO, SiteSettingsDTO, FaqItemDTO } from "@/lib/types";
import { formatBRL } from "@/lib/format";
import { SectionMark } from "./kicker";
import { CookieImage } from "./cookie-image";
import { ProductCard } from "./product-card";
import { FlameIcon, ClockIcon, TruckIcon } from "./icons";

/* ---------- HERO ---------- */
export function Hero({ settings }: { settings: SiteSettingsDTO }) {
  return (
    <section id="inicio" className="overflow-hidden py-11">
      <div className="mx-auto grid max-w-[1140px] items-center gap-6 px-5 md:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="text-[13px] font-bold uppercase tracking-[1.5px] text-laranja-forte">
            {settings.address ?? "Potirendaba · SP"}
          </p>
          <h1 className="mt-3 text-[clamp(44px,11vw,84px)] text-marrom">
            {settings.heroTitle ?? "Cookie recheado, do jeito que tem que ser."}
          </h1>
          <p className="mt-4 max-w-[420px] text-[17px] leading-relaxed text-cinza">
            {settings.heroSubtitle}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#destaques"
              className="rounded-full bg-vermelho px-7 py-3.5 text-[15px] font-bold text-branco transition-colors hover:bg-vermelho-esc"
            >
              Ver cardápio
            </a>
            <a
              href="#como"
              className="rounded-full border-2 border-marrom px-7 py-3.5 text-[15px] font-bold text-marrom transition-colors hover:bg-marrom hover:text-creme"
            >
              Como funciona
            </a>
          </div>
        </div>
        <div className="relative flex justify-center">
          <div
            className="pointer-events-none absolute inset-0 m-auto aspect-square w-[min(84vw,400px)] rounded-full"
            style={{
              background:
                "radial-gradient(circle, var(--color-laranja) 0%, var(--color-laranja) 60%, transparent 62%)",
              opacity: 0.35,
            }}
            aria-hidden
          />
          <CookieImage
            src={settings.heroImageUrl ?? ""}
            alt="Cookie recheado VG"
            rounded="rounded-full"
            className="relative z-10 w-[min(72vw,340px)] shadow-[0_24px_48px_rgba(58,29,12,0.25)]"
          />
        </div>
      </div>
    </section>
  );
}

/* ---------- SELOS ---------- */
export function Selos({ settings }: { settings: SiteSettingsDTO }) {
  const selos = [
    { Icon: FlameIcon, title: settings.selo1Title, desc: settings.selo1Desc },
    { Icon: ClockIcon, title: settings.selo2Title, desc: settings.selo2Desc },
    { Icon: TruckIcon, title: settings.selo3Title, desc: settings.selo3Desc },
  ];
  return (
    <section className="border-y border-borda bg-branco">
      <div className="mx-auto grid max-w-[1140px] gap-5 px-5 py-7 sm:grid-cols-3">
        {selos.map(({ Icon, title, desc }) => (
          <div key={title} className="flex items-center gap-3.5">
            <div className="flex h-[46px] w-[46px] flex-none items-center justify-center rounded-full bg-vermelho-suave text-vermelho">
              <Icon className="h-[22px] w-[22px]" />
            </div>
            <div>
              <h4 className="font-display text-[16px] font-bold">{title}</h4>
              <p className="mt-0.5 text-[13px] leading-snug text-cinza">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- DESTAQUES ---------- */
export function Destaques({
  products,
  onOpen,
}: {
  products: ProductDTO[];
  onOpen: (p: ProductDTO) => void;
}) {
  return (
    <section id="destaques" className="mx-auto max-w-[1140px] px-5 pb-6 pt-16">
      <SectionMark />
      <h2 className="text-[clamp(32px,6.5vw,48px)]">Nossos destaques</h2>
      <p className="mt-2.5 max-w-[440px] text-[16px] text-cinza">
        Os campeões da casa. O cardápio completo tem muito mais sabor pra você escolher.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {products.length > 0 ? (
          products.map((p) => (
            <ProductCard key={p.id} product={p} onOpen={onOpen} />
          ))
        ) : (
          <p className="col-span-full text-cinza">
            Cardápio sendo carregado. Configure os produtos no painel.
          </p>
        )}
      </div>
      <div className="mt-9 text-center">
        <Link
          href="/cardapio"
          className="rounded-full bg-vermelho px-7 py-3.5 text-[15px] font-bold text-branco transition-colors hover:bg-vermelho-esc"
        >
          Ver cardápio completo
        </Link>
      </div>
    </section>
  );
}

/* ---------- COMO FAZEMOS ---------- */
const PASSOS = [
  {
    n: "1",
    title: "Massa preparada e descansada",
    desc: "Feita do zero, com o tempo de descanso que a receita pede.",
  },
  {
    n: "2",
    title: "Recheio porcionado à mão",
    desc: "Cada cookie recebe a dose certa de recheio, sem economia.",
  },
  {
    n: "3",
    title: "Assado na hora do pedido",
    desc: "Só vai pro forno quando você pede. Chega quentinho.",
  },
];

export function ComoFazemos({ settings }: { settings: SiteSettingsDTO }) {
  return (
    <section id="como" className="mt-12 bg-vermelho text-creme">
      <div className="mx-auto grid max-w-[1140px] items-center gap-8 px-5 py-16 md:grid-cols-2 md:py-20">
        <div>
          <span className="mb-4 block h-[4px] w-9 rounded-full bg-creme" aria-hidden />
          <h2 className="text-[clamp(30px,6.5vw,46px)] text-white">
            Do jeito certo, sem pressa na receita.
          </h2>
          <p className="mt-3 max-w-[420px] text-[16px] leading-relaxed opacity-90">
            {settings.aboutText}
          </p>
          <div className="mt-7 flex flex-col gap-5">
            {PASSOS.map((p) => (
              <div key={p.n} className="flex items-start gap-4">
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-laranja font-display text-[20px] font-extrabold text-marrom">
                  {p.n}
                </span>
                <div>
                  <h4 className="font-display text-[16px] font-bold">{p.title}</h4>
                  <p className="mt-0.5 text-[13.5px] leading-snug opacity-85">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center">
          <CookieImage
            src={settings.comoImageUrl ?? ""}
            alt="Cookie sendo preparado"
            rounded="rounded-full"
            className="w-[min(72vw,330px)] border-[5px] border-laranja shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
          />
        </div>
      </div>
    </section>
  );
}

/* ---------- GALERIA ---------- */
export function Galeria({ photos }: { photos: GalleryPhotoDTO[] }) {
  // Sempre mostra 6 posições: fotos reais primeiro, e o restante preenchido
  // com o placeholder listrado. Assim o grid nunca fica "torto" enquanto o
  // admin nao tiver subido as 6 fotos.
  const slots: GalleryPhotoDTO[] = [...photos];
  while (slots.length < 6) {
    slots.push({ id: `ph-placeholder-${slots.length}`, imageUrl: "", caption: null });
  }
  return (
    <section className="mx-auto max-w-[1140px] px-5 py-16">
      <SectionMark />
      <h2 className="text-[clamp(30px,6.5vw,46px)]">Direto do forno</h2>
      <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
        {slots.map((ph) => (
          <CookieImage
            key={ph.id}
            src={ph.imageUrl}
            alt={ph.caption ?? "Cookie VG"}
            rounded="rounded-[18px]"
          />
        ))}
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
export function Faq({ items }: { items: FaqItemDTO[] }) {
  return (
    <section id="faq" className="mx-auto max-w-[1140px] px-5 py-16">
      <SectionMark />
      <h2 className="text-[clamp(30px,6.5vw,46px)]">Perguntas frequentes</h2>
      <div className="mt-8">
        {items.length === 0 ? (
          <p className="text-cinza">Nenhuma pergunta cadastrada ainda.</p>
        ) : (
          items.map((item, i) => (
            <details
              key={item.id}
              open={i === 0}
              className="group mb-3 overflow-hidden rounded-2xl bg-branco shadow-[0_2px_10px_rgba(58,29,12,0.05)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 text-[15.5px] font-bold [&::-webkit-details-marker]:hidden">
                {item.question}
                <span className="flex h-[26px] w-[26px] flex-none items-center justify-center rounded-full bg-vermelho-suave text-[18px] leading-none text-vermelho transition group-open:rotate-45 group-open:bg-vermelho group-open:text-white">
                  +
                </span>
              </summary>
              <p className="max-w-[680px] px-5 pb-5 text-[14.5px] leading-relaxed text-cinza">
                {item.answer}
              </p>
            </details>
          ))
        )}
      </div>
    </section>
  );
}

/* ---------- CTA FINAL ---------- */
export function CtaFinal() {
  return (
    <section
      className="px-5 py-20 text-center"
      style={{
        background:
          "radial-gradient(120% 100% at 50% 0%, var(--color-laranja) 0%, var(--color-laranja-forte) 100%)",
      }}
    >
      <h2 className="text-[clamp(38px,8vw,60px)] text-marrom">Bateu a vontade?</h2>
      <p className="mx-auto mt-3.5 mb-7 max-w-[380px] text-[16px] text-marrom">
        Monte seu pedido agora e receba seus cookies quentinhos.
      </p>
      <Link
        href="/cardapio"
        className="inline-block rounded-full bg-vermelho px-7 py-3.5 text-[15px] font-bold text-branco transition-colors hover:bg-vermelho-esc"
      >
        Ver cardápio
      </Link>
    </section>
  );
}

/* ---------- FOOTER ---------- */
export function Footer({ settings }: { settings: SiteSettingsDTO }) {
  return (
    <footer className="bg-marrom py-13 text-creme">
      <div className="mx-auto grid max-w-[1140px] gap-8 px-5 sm:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <div className="font-display text-[24px] font-extrabold text-laranja">
            VG&nbsp;Cookies
          </div>
          <p className="mt-3 text-[14px] leading-relaxed opacity-80">
            Cookies recheados assados na hora.
            <br />
            {settings.address ?? "Potirendaba – SP"}.
          </p>
        </div>
        <div>
          <h5 className="mb-3 font-display text-[14px] font-bold uppercase tracking-wide text-laranja">
            Atendimento
          </h5>
          <p className="text-[14px] leading-relaxed opacity-80">
            Entrega em até 40 minutos
            <br />
            Retirada ou delivery
            {settings.phone && (
              <>
                <br />
                {settings.phone}
              </>
            )}
          </p>
        </div>
        <div>
          <h5 className="mb-3 font-display text-[14px] font-bold uppercase tracking-wide text-laranja">
            Redes
          </h5>
          {settings.instagram && (
            
              <a href={`https://instagram.com/${settings.instagram.replace(/^@/, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-1.5 block text-[14px] opacity-80 hover:text-laranja hover:opacity-100">
            
              {settings.instagram}
            </a>
          )}
          {settings.whatsappNumber && (
            
              <a href={`https://wa.me/${settings.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[14px] opacity-80 hover:text-laranja hover:opacity-100">
            
              WhatsApp
            </a>
          )}
        </div>
      </div>
      <div className="mx-auto mt-9 max-w-[1140px] px-5 text-center text-[12.5px] opacity-55">
        © {new Date().getFullYear()} VG Cookies. Todos os direitos reservados.
      </div>
    </footer>
  );
}
