# VG Cookies

Site full-stack de cookies recheados: cardápio, carrinho, checkout via Pix e
painel administrativo completo. Mobile-first. Design B (Vitrine VG).

## Stack

- **Next.js 15** (App Router) + **TypeScript** strict
- **Tailwind CSS v4** (design tokens em `globals.css`)
- **Prisma 6** (generator `prisma-client` Rust-free) + **driver adapter Neon**
- **PostgreSQL (Neon)**
- **Auth.js v5** (Credentials + JWT, senha com bcrypt)
- **Zustand** (carrinho, persistido em localStorage)
- **pix-utils** + **qrcode** (Pix copia-e-cola + QR por pedido)
- **Cloudinary** (upload de imagens, assinado no servidor)
- Deploy: **Vercel** (projeto único)

## Setup

```bash
npm install
cp .env.example .env         # preencha DATABASE_URL, AUTH_SECRET, Cloudinary, seed
npx prisma generate
npx prisma db push
npm run prisma:seed          # super admin + configs (Pix vazio) + cardápio
npm run dev                  # http://localhost:3000
```

- `AUTH_SECRET`: gere com `npx auth secret`.
- Super admin: definido em `SEED_SUPERADMIN_*`. **Troque a senha após o 1º login.**
- Painel: `http://localhost:3000/painel-x7k2` (não é linkado no site público).

> **Se você já tinha o banco criado antes desta versão:** rode `npx prisma db
> push` de novo — ele adiciona a tabela `FaqItem` e as colunas novas
> (`stockQty`, `selo1Title` etc.) sem apagar nada existente. Depois rode
> `npm run prisma:seed` de novo — ele é idempotente: não duplica produtos,
> admins ou configurações, e só cria as 5 perguntas de FAQ padrão se a tabela
> estiver vazia.

> O `prisma generate`/`db push` e o `next/font` baixam artefatos na primeira vez
> (precisam de internet). Em sandbox sem rede isso falha; na sua máquina/Vercel, ok.

## Verificação

```bash
npm run typecheck   # tsc --noEmit
npm run build       # prisma generate && next build
```

## Fluxo do cliente (checkout Pix)

1. Adiciona cookies (card ou modal) → carrinho (drawer) → "Finalizar pedido".
2. Formulário: nome, endereço, telefone (opcional).
3. `POST /api/checkout` **recalcula os preços no servidor** (nunca confia no
   cliente), soma a taxa, gera o payload Pix + QR (valor exato) e monta a
   mensagem do WhatsApp.
4. Tela de resumo: itens, total, QR Code, copia-e-cola (botão copiar), aviso
   "anexe o comprovante nesta conversa", botão "Enviar comprovante no WhatsApp"
   (`wa.me` com o resumo pré-preenchido).
5. Se o Pix não estiver configurado, mostra aviso em vez de gerar QR quebrado.

## Painel admin (`/painel-x7k2`)

- **Login** com e-mail + senha (hash bcrypt). Middleware protege todo o painel;
  além disso cada página/action revalida a sessão no servidor.
- **Produtos**: CRUD completo (imagem via Cloudinary, nome, descrições,
  ingredientes, preço, peso, **estoque disponível**, disponível, destaque, ordem).
- **Galeria**: upload/remoção de fotos.
- **Textos da Home** (CMS): título/subtítulo do topo, texto "Como fazemos" e os
  3 selos (ícone + título + descrição) exibidos logo abaixo do hero.
- **FAQ**: perguntas e respostas totalmente editáveis — adicionar, editar,
  remover e reordenar (campo "ordem de exibição").
- **Configurações**: chave Pix + tipo + recebedor + cidade, WhatsApp, taxa de
  entrega (grátis por padrão), telefone/endereço/Instagram.
- **Admins** (só super admin): criar/remover admins. Não dá pra remover a si
  mesmo nem o super admin.

## Controle de estoque

Cada produto tem um campo opcional **"Estoque disponível"** no admin:

- **Vazio (padrão)** = estoque ilimitado, não controlado.
- **Número** = o admin ajusta manualmente conforme vende/repõe. Quando chega a
  zero, o produto aparece como "Esgotado" no site (card e modal) e o botão de
  adicionar fica desabilitado.
- Isso **não é decrementado automaticamente pelos pedidos** (o projeto não tem
  uma tabela de pedidos, por decisão anterior — o dono confirma cada venda pelo
  WhatsApp). O admin ajusta o número manualmente conforme vai vendendo.
- Mesmo assim, o checkout **valida no servidor**: se alguém tentar comprar mais
  do que o estoque configurado, a API rejeita o pedido com uma mensagem clara.

## Cardápio completo (`/cardapio`)

Página dedicada listando **todos os produtos disponíveis** (não só os 4
destaques da Home). Acessível pelo link "Cardápio" no menu e pelos botões
"Ver cardápio completo" (Home) e "Ver cardápio" (CTA final) — ambos agora
navegam de verdade para essa página (antes apontavam para uma âncora que não
existia fora da Home).

## Segurança

- Senhas só como hash (bcrypt). Zero credencial hardcoded — tudo em env vars.
- `.env` no `.gitignore`. Chave Pix nunca vai pro cliente (só a flag
  `pixConfigured`).
- Rota do painel é ofuscada (não linkada), mas a trava real é a sessão +
  checagem server-side em toda página e server action.
- Dinheiro sempre em centavos (nunca float).

## Deploy (Vercel)

1. Suba o repositório e importe na Vercel.
2. Env vars: `DATABASE_URL`, `AUTH_SECRET`, `CLOUDINARY_*` (e opcionalmente os
   `SEED_*` se for rodar o seed via script).
3. Build command padrão (`npm run build` já roda `prisma generate`).
4. Rode o seed uma vez apontando para o banco de produção
   (`npm run prisma:seed` local com a `DATABASE_URL` de produção, ou via console).

## Estrutura

```
prisma/            schema + seed
src/
  app/
    page.tsx                    Home (Design B)
    checkout/                   fluxo Pix
    api/checkout/               geração do Pix (server)
    api/auth/[...nextauth]/     Auth.js
    painel-x7k2/
      login/                    login
      (app)/                    área autenticada (guard + shell)
        page, produtos, galeria, conteudo, configuracoes, admins
  components/public/            Home, carrinho, modal, checkout
  components/admin/             shell, formulários, uploader, managers
  lib/                          prisma, data, admin-data, pix, cloudinary,
                                session, actions, auth-actions, validations
  store/cart.ts                 carrinho (Zustand)
  auth.ts / auth.config.ts      Auth.js (split config p/ edge)
  middleware.ts                 protege /painel-x7k2
```
