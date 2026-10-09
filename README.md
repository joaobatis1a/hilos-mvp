# HILOS — Landing Page (MVP)

MVP da landing page da HILOS, construído a partir do briefing "HILOS — Fios em
Movimento": uma página única que usa o fio como fio condutor visual (literalmente),
conectando Hero → Manifesto → Coleção → Produto destaque → Locais → Atacado →
Instagram → CTA final.

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** (reveals em scroll + a linha do "fio")
- Tipografia: **Cormorant Garamond** (títulos) + **Manrope** (corpo/botões)
- Pronto para deploy na **Vercel**

## Rodando localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

| Variável | Para quê |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL de produção (usada em metadata, sitemap, robots, OpenGraph) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número da HILOS no formato `55DDDNUMERO` (sem símbolos). **Hoje está com um placeholder — troque antes de publicar.** |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Link do perfil `@usehilos` |
| `NEXT_PUBLIC_GA_ID` | ID do Google Analytics 4 (`G-XXXXXXX`). Se vazio, o script não carrega. |
| `NEXT_PUBLIC_META_PIXEL_ID` | ID do Meta Pixel. Se vazio, o script não carrega. |

## O que já está implementado

- Hero com CTA duplo (coleção / onde encontrar) + CTA direto para WhatsApp
- Manifesto com reveal em scroll
- Seção Coleção (cards editoriais, swipe horizontal no mobile)
- Produto destaque (Pantalona HILOS) com CTA que abre o WhatsApp com mensagem
  pré-pronta — pensado para ser o principal evento de conversão mensurável
- Seção "HILOS em Movimento" (locais com badges de status)
- Atacado: formulário client-side que monta a mensagem e abre no WhatsApp
  (zero backend — mesma lógica de mensuração do produto destaque)
- Seção Instagram (`#usehilos`) com grade de placeholders para UGC
- CTA final, fechando a narrativa com o elemento do fio voltando à marca
- O "fio": linha vertical que nasce no topo e cresce conforme o scroll,
  com um ponto em cada seção — a assinatura visual pedida no briefing
- Eventos de analytics (`trackEvent`) nos principais cliques de WhatsApp e no
  envio do formulário de atacado, para alimentar GA4/Meta Pixel
- SEO: metadata, OpenGraph, `sitemap.xml`, `robots.txt`, JSON-LD (`ClothingStore`)
- Acessibilidade básica: `prefers-reduced-motion` respeitado, foco visível,
  contraste cuidado nas duas paletas (clara/escura)

## Pendências de conteúdo (não dá para resolver sem o cliente)

- **Fotografia real**: todo o site usa placeholders estilizados (com legenda
  indicando o que deveria entrar ali) no lugar de fotos reais da HILOS.
- **História da marca**: o texto do Manifesto é um rascunho baseado no
  briefing — precisa ser validado com a história real da empresa antes de publicar.
- **Status dos locais** (North Way, Eventos, Aldeia, Patteo Olinda): as badges
  ("Ponto HILOS", "Evento", "Pop-up", "Próxima edição") são placeholders —
  confirmar com a operação antes de publicar.
- **Número de WhatsApp, Instagram e logo vetorial** da marca.
- O formulário de Atacado hoje só manda os dados por WhatsApp (sem CRM/banco de
  dados) — é suficiente para o MVP, mas pode evoluir para um sistema B2B depois.

## Deploy

```bash
npm i -g vercel   # se ainda não tiver
vercel
```

Configure as variáveis de ambiente acima no painel da Vercel (Project Settings →
Environment Variables) antes do deploy de produção.
