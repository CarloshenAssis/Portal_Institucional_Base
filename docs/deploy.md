# Deploy — novo cliente

Checklist para colocar uma instância nova (deste template) no ar para um cliente.

## 1. Supabase (banco novo, exclusivo deste cliente)

1. Criar um projeto novo em supabase.com/dashboard — **nunca reaproveitar o projeto de outro cliente**.
2. Aplicar as migrations de `supabase/migrations/` (0001 a 0008, em ordem) no projeto novo.
3. Confirmar que os 3 jobs do `pg_cron` ficaram ativos: `select jobname from cron.job;` deve listar `publish-scheduled-content`, `purge-trash`, `purge-rate-limit`. Se não aparecer nada, a extensão `pg_cron` pode não estar habilitada no projeto — habilitar em Database → Extensions.
4. Criar os buckets de storage com as policies da migration 0007 (`public-images`, `public-pdfs`, `public-videos`, `private-assets`) — a migration já cria tudo, só confirmar em Storage que os 4 aparecem.
5. Criar o usuário admin com `scripts/create-admin-user.ts` (requer `SUPABASE_SERVICE_ROLE_KEY` e `NEXT_PUBLIC_SUPABASE_URL` no ambiente local).
6. **Plano Free do Supabase pausa o projeto após ~7 dias sem uso**, o que para os jobs de `pg_cron`. Avaliar upgrade para o plano Pro antes do cliente ir ao ar de verdade, ou orientar o cliente sobre a limitação.

## 2. Env vars (Vercel → Project → Settings → Environment Variables)

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — do projeto Supabase deste cliente (passo 1).
- `SUPABASE_SERVICE_ROLE_KEY` — idem, chave `service_role` (não a `anon`). Necessária para o formulário de contato gravar mensagens.
- `TURNSTILE_SECRET_KEY` + `NEXT_PUBLIC_TURNSTILE_SITE_KEY` — criar um widget novo em dash.cloudflare.com → Turnstile, com o hostname de produção deste cliente cadastrado em Hostname Management.
- `NEXT_PUBLIC_SITE_URL` — domínio público final deste cliente (usada em `sitemap.xml`, `robots.txt`, JSON-LD, botões de compartilhamento).

Referência local: `.env.local.example` na raiz. Este template **não tem fallback hardcoded** para nenhuma dessas variáveis (de propósito — evita que um deploy mal configurado caia silenciosamente nos dados de outro cliente). Sem `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` configuradas, **`npm run build` falha de propósito** com `Error: supabaseUrl is required` (o `sitemap.xml` consulta o banco em build-time) — é o comportamento esperado, não um bug: configure as env vars reais do cliente antes de buildar/deployar.

## 3. Deploy

Conectar o repositório do cliente (fork/cópia deste base) no dashboard da Vercel — deploy automático a cada push na `main`. Framework: Next.js (auto-detectado). Nenhuma configuração extra de build é necessária além das env vars acima.

## 4. Pós-deploy

1. Supabase → Authentication → URL Configuration: adicionar o domínio de produção da Vercel em *Site URL / Redirect URLs*.
2. Testar login em `/admin/login` com o usuário criado no passo 1.5.
3. Testar um ciclo criar → publicar em qualquer módulo, e confirmar que aparece no portal público.
4. Testar o formulário de contato de ponta a ponta (Turnstile + gravação + rate-limit).
5. Personalizar em Configurações → Geral (nome do site, logo) e → Aparência (cores da marca do cliente).
