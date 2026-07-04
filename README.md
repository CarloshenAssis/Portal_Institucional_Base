# Portal Institucional — código base

Template completo de portal público + painel administrativo, pronto para ser
clonado e customizado para um novo cliente. Stack: **Next.js 16** (App
Router, Turbopack), **Tailwind v4**, **shadcn/Base UI**, **Supabase**
(Postgres + Auth + Storage + RLS), **Vitest**.

## O que já vem pronto

- **Painel administrativo** (`/admin`): dashboard, 6 módulos de conteúdo
  (Trajetória, Projetos, Comunidade, Ideias, Notícias, Agenda) com
  criar/editar/publicar/despublicar/duplicar/lixeira/restaurar, páginas
  singleton (Home, Sobre — com Missão/Visão/Valores), biblioteca de mídias
  (upload embutido no próprio seletor, em qualquer campo de imagem, com
  botão "Remover" e tamanho ideal indicado), caixa de entrada de mensagens,
  configurações (dados gerais, **aparência/cores da marca editáveis sem
  código**, contato, redes sociais, SEO), histórico de alterações, perfil
  com tema claro/escuro.
- **Editor de texto rico**: negrito/itálico/link/lista/tabela/citação, e
  **inserção de imagem em qualquer ponto do texto** direto da Biblioteca de
  Mídias (buscar ou enviar na hora) — não é preciso colar URL.
- **Segurança**: rate limit de login (5 tentativas erradas travam o IP por
  45s, anti brute-force/robô), formulário de contato com Cloudflare
  Turnstile + rate limit + honeypot.
- **Portal público**: Home dirigida pelo admin, listagens + detalhes dos 6
  módulos (galeria de fotos em carrossel deslizável), Sobre, Trajetória,
  Agenda, Contato, Pesquisa, SEO completo (`sitemap.xml`, `robots.txt`,
  metadata por página, JSON-LD), tema dinâmico (cores editáveis pelo admin),
  responsivo (mobile-first).
- **Banco**: schema completo em `supabase/migrations/` (0001–0009), RLS
  configurada (leitura pública só de conteúdo publicado, escrita só
  autenticado), triggers de histórico de revisão, jobs `pg_cron` (publicação
  agendada, purga de lixeira, purga de rate-limit).

## Início rápido (desenvolvimento local)

```bash
npm install
cp .env.local.example .env.local   # preencher com um projeto Supabase de teste
npm run dev
```

## Usar este template para um cliente novo

1. Duplique/faça fork deste repositório para o repositório do cliente.
2. Siga `docs/deploy.md` — criar projeto Supabase novo, aplicar as
   migrations, configurar env vars na Vercel, deploy.
3. Personalize pelo próprio painel (sem tocar em código): nome do site e
   logo em Configurações → Geral, cores da marca em Configurações →
   Aparência, conteúdo em cada módulo.

**Nunca reaproveite um projeto Supabase entre clientes diferentes** — cada
cliente precisa do próprio banco (dados, mensagens de contato e usuários
admin são isolados por projeto, não por linha).

Também vale conferir `docs/guia-de-conteudo.md` (se presente) — referência
de todos os campos do admin, SEO e tamanho ideal de imagem por seção, útil
pra treinar quem for alimentar o site com conteúdo.

## Testes

```bash
npm test          # roda uma vez
npm run test:watch
npx tsc --noEmit  # typecheck
```
