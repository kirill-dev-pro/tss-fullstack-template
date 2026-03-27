# TSS Full-Stack Template

A production-ready full-stack boilerplate for bootstrapping modern web applications. Built with a hand-picked set of technologies that work exceptionally well together — with end-to-end type safety from the database to the UI, Telegram integration, AI features, and multi-tenant auth all included out of the box.

**Live Demo:** [tss-fulstack-template.vercel.app](https://tss-fulstack-template.vercel.app)

<img width="1599" alt="Landing page" src="https://github.com/user-attachments/assets/e53f8665-ecf6-422b-a04a-014b99bdc922" />

<img width="1597" alt="Dashboard overview" src="https://github.com/user-attachments/assets/01bccb09-b700-41e3-815c-be5dc02c5e7c" />

---

## Why This Template?

Most boilerplates give you a blank canvas. This one gives you a running application. The technology choices are intentional — each library was selected because it integrates cleanly with the rest of the stack, not just because it's popular:

- **TanStack Start + tRPC** — file-based routing with fully typed API calls, no code generation required
- **Drizzle ORM + Neon** — SQL-first ORM with zero-config serverless Postgres that spins up automatically on `bun run dev`
- **Better Auth** — complete auth system with 2FA, organisations, passkeys, and invitation flows
- **Telegram integration** — Mini App, bot webhooks, and broadcast messaging all pre-wired
- **Vercel AI SDK** — streaming chat, RAG, image generation, and MCP server ready to use

---

## Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [TanStack Start](https://tanstack.com/start/v1) on [Vite](https://vitejs.dev/) — React with SSR |
| **Routing** | [TanStack Router](https://tanstack.com/router/v1) — type-safe file-based routing |
| **API** | [tRPC v11](https://trpc.io/) — end-to-end typesafe RPC |
| **Database** | [Drizzle ORM](https://orm.drizzle.team/) + [Neon](https://neon.com/) serverless Postgres |
| **UI** | [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Lucide Icons](https://lucide.dev/) |
| **State** | [TanStack Query](https://tanstack.com/query/v5), [TanStack Store](https://tanstack.com/store/v0), [TanStack DB](https://tanstack.com/db/latest) |
| **Forms** | [React Hook Form](https://react-hook-form.com/), [TanStack Form](https://tanstack.com/form/v1), [Zod v4](https://zod.dev/) |
| **Auth** | [Better Auth](https://www.better-auth.com/) |
| **Email** | [Resend](https://resend.com/) + [React Email](https://react.email/) |
| **AI** | [Vercel AI SDK](https://sdk.vercel.ai/) — OpenAI, Anthropic, streaming, RAG, MCP |
| **Telegram** | [Grammy](https://grammy.dev/) bot + [TMA.js SDK](https://docs.telegram-mini-apps.com/) Mini App |
| **Monitoring** | [Sentry](https://sentry.io/) |
| **i18n** | [i18next](https://www.i18next.com/) |
| **Testing** | [Vitest](https://vitest.dev/) |
| **Tooling** | [oxlint](https://oxc.rs/docs/guide/usage/oxlint) + [oxfmt](https://oxc.rs/docs/guide/usage/oxfmt), [T3 Env](https://env.t3.gg/), TypeScript strict mode |
| **Runtime** | [Bun](https://bun.sh/) |

---

## Features

### Authentication

Powered by [Better Auth](https://www.better-auth.com/):

- Sign up / sign in with email + password
- Forgot password / reset password flow
- Two-factor authentication (TOTP)
- Passkey support
- Organisation and team management (multi-tenancy)
- Member invitation flow
- Admin user management dashboard
- API reference at `/api/auth/reference`

<img width="1597" alt="Auth screens" src="https://github.com/user-attachments/assets/e1b3ac60-d95d-4add-b31b-807322d20605" />

<img width="1599" alt="Dashboard" src="https://github.com/user-attachments/assets/17d16240-279d-4c65-994e-6ba286d85cb9" />

### Telegram Integration

Three Telegram features are pre-built and ready to connect to your bot:

- **Mini App** (`/telegram-mini-app`) — full Telegram Mini App with WebApp SDK, native auth, and haptic feedback
- **Web Chat** (`/dashboard/telegram/chats`) — view and reply to Telegram messages from the dashboard, powered by bot webhooks + tRPC
- **Broadcasts** (`/dashboard/telegram/contacts`) — manage contacts, filter by segment, and send bulk messages with delivery tracking

### AI Features

<img width="1591" alt="AI chat" src="https://github.com/user-attachments/assets/9e87d828-60cb-4430-b690-44b8d635e14f" />

<img width="1600" alt="AI features" src="https://github.com/user-attachments/assets/2cf7ab06-fc4b-441d-b1e6-88b391b0691b" />

- **Basic Chat** (`/dashboard/chat`) — streaming chat with OpenAI GPT-4o
- **Vercel v0 Chat** (`/dashboard/chat/vercel`) — web-dev–optimised chat using `v0-1.0-md`
- **Image Generation** (`/dashboard/chat/image`) — AI image generation via the AI SDK
- **RAG Chat** (`/dashboard/chat/rag`) — upload PDFs, generate embeddings with `pg_vector`, and chat with your documents
- **MCP Server** (`/api/ai/mcp/mcp`) — Model Context Protocol server compatible with Claude Desktop and Cursor

<img width="1599" alt="RAG feature" src="https://github.com/user-attachments/assets/473dd7f7-50b2-4a3b-af1c-bfb195d00800" />

### TanStack DB — Reactive Collections

<img width="1599" alt="TanStack DB example" src="https://github.com/user-attachments/assets/3e0d9de1-e7c4-4f0e-93f9-1cca421fc424" />

TanStack DB provides reactive client-side collections with live queries. Visit `/dashboard/tanstack-db-example` to see a todo list with three simultaneously live-updating views (All, Pending, Completed) — all driven by a single data source with no manual refetch.

### Database with Neon

[Neon](https://neon.com/) serverless Postgres is the default database. The `@neondatabase/vite-plugin-postgres` Vite plugin automatically creates a database on the first `bun run dev` if `DATABASE_URL` is not set — no signup or configuration needed for local development.

- **Zero-config setup** — run `bun run dev` and the database is ready
- **Database branching** — create isolated database branches per feature
- **pg_vector** — vector extension for AI embeddings
- **Auto-provisioned** — the Vite plugin writes the connection string to `.env`

The database expires after 72 hours unless claimed with a free Neon account.

### MCP Integration

A fully functional MCP server lets Claude Desktop and Cursor call your app's tools and query your database directly from their chat interfaces.

Configure in Claude Desktop (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "your-app": {
      "command": "npx",
      "args": ["mcp-remote", "http://localhost:3000/api/ai/mcp/mcp"]
    }
  }
}
```

Built-in example tools: `getCatFact`, `getJoke`, `calculateBMI`, `getTodos` (live database query), `getWelcomeMessage`.

Add your own tools in `src/lib/ai/mcp-tools.ts`.

---

## Getting Started

### Prerequisites

Install [Bun](https://bun.sh/):

```bash
# macOS / Linux / WSL
curl -fsSL https://bun.sh/install | bash

# Windows
powershell -c "irm bun.sh/install.ps1 | iex"
```

### Setup

```bash
# 1. Clone
git clone https://github.com/kirill-dev-pro/tss-fulstack-template.git
cd tss-fulstack-template

# 2. Install dependencies
bun install

# 3. Copy environment variables
cp .env-example .env

# 4. Start the dev server (database is auto-created by the Vite plugin)
bun run dev
```

The app will be running at `http://localhost:3000`.

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Auto | Neon Postgres connection string — created automatically by the Vite plugin |
| `BETTER_AUTH_SECRET` | Yes | Random secret for Better Auth (`openssl rand -base64 32`) |
| `RESEND_API_KEY` | For email | [Resend](https://resend.com/) API key |
| `ANTHROPIC_API_KEY` | For AI | Anthropic API key |
| `VITE_SENTRY_DSN` | Optional | Sentry DSN for error tracking |

### Database Setup

```bash
# Enable pg_vector extension (required for AI/RAG features)
bun run db:setup-vector

# Push schema to database
bun run db:push

# Optional: open Drizzle Studio
bun run db:studio
```

---

## Project Structure

```
src/
├── components/          # Reusable UI (shadcn/ui + custom)
├── features/            # Feature-specific logic (auth, org, file upload, embeddings)
├── hooks/               # Custom React hooks
├── lib/
│   ├── auth/            # Better Auth configuration
│   ├── db/              # Drizzle schema
│   ├── trpc/            # tRPC client + server setup
│   ├── intl/            # i18next configuration
│   └── store/           # TanStack Store
├── routes/
│   ├── (public)/        # Landing page
│   ├── (auth)/          # Login, register, 2FA, reset password, accept invite
│   ├── _authenticated/
│   │   └── dashboard/
│   │       ├── admin/          # User management
│   │       ├── chat/           # AI chat (basic, RAG, v0, image)
│   │       ├── telegram/       # Telegram chats + contacts
│   │       ├── workspace/      # Organisation settings
│   │       └── settings/       # User settings
│   ├── api/
│   │   ├── auth/        # Better Auth endpoints
│   │   ├── trpc/        # tRPC handler
│   │   ├── ai/          # Chat, RAG, image generation, MCP, v0
│   │   └── telegram/    # Webhook handler + contacts API
│   └── telegram-mini-app/  # Telegram Mini App
└── server/              # tRPC router + server-side routes
```

---

## Available Scripts

| Script | Description |
|---|---|
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun run start` | Start production server |
| `bun run test` | Run Vitest tests |
| `bun run db:push` | Push Drizzle schema to database |
| `bun run db:generate` | Generate migration files |
| `bun run db:studio` | Open Drizzle Studio |
| `bun run db:setup-vector` | Enable pg_vector extension |
| `bun run db:neon-setup` | Manual Neon database setup |
| `bun run add-ui-components <name>` | Add a shadcn/ui component |
| `bun run format` | Format with oxfmt |
| `bun run lint` | Lint with oxlint |
| `bun run check` | Run format + lint check |

---

## Deployment

### Vercel (recommended)

The project uses the Nitro Vercel preset. Deploy directly from GitHub — no extra configuration needed.

### Docker

```bash
# Local testing with Docker Compose
docker-compose up --build

# The app will be available at http://localhost:3000
```

GitHub Actions CI/CD workflow is included at `.github/workflows/build-docker.yml`. It builds a multi-stage Docker image and pushes it to GitHub Container Registry on push to `main`.

---

## Telegram Bot Setup

1. Create a bot with [@BotFather](https://t.me/BotFather) and copy the token
2. Add `TELEGRAM_BOT_TOKEN` to your `.env`
3. Set the webhook URL to `https://your-domain.com/api/telegram/webhook`
4. For the Mini App, set the Web App URL in BotFather to `https://your-domain.com/telegram-mini-app`

---

## Vercel v0 Chat Setup

1. Requires a Vercel Premium or Team plan
2. Create an API key at [v0.dev](https://v0.dev)
3. Add `V0_API_KEY` to your `.env`
4. Navigate to `/dashboard/chat/vercel`

---

## License

MIT
