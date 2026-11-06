# AI Chat Starter

A complete, backend-agnostic AI chat surface built with Slipstream UI. Streaming
text, reasoning, tool calls, human approval and citations, with one SSE contract
and two server backends.

## Run

```bash
pnpm install
pnpm --filter slipstream-ai-chat-starter dev
# http://localhost:3200
```

The mock backend works with no keys. To use a real model:

```bash
OPENAI_API_KEY=sk-...
CHAT_BACKEND=openai
OPENAI_MODEL=gpt-4.1-mini
# optional: OPENAI_BASE_URL=https://your-gateway/v1
```

## Architecture

```
app/api/chat/route.ts        server: chooses mock or OpenAI, emits SSE
src/lib/chat/types.ts        events + message model
src/lib/chat/mock-adapter.ts deterministic stream (reasoning, tool, citation, approval)
src/lib/chat/openai-adapter.ts OpenAI-compatible raw SSE (no SDK)
src/lib/chat/sse-adapter.ts  client fetch -> ChatEvent parser
src/lib/chat/runner.ts       pure event reducer + run loop
src/components/chat-shell.tsx UI built from @slipstream-ui/*
```

The client never imports a model SDK. To use Vercel AI SDK, LangGraph or your own
backend, emit the same `ChatEvent` JSON frames from an endpoint and point
`createFetchAdapter` at it. The UI does not change.

## Event protocol

```
data: {"type":"text","delta":"Hello"}
data: {"type":"reasoning","delta":"Checking the request."}
data: {"type":"reasoning-done"}
data: {"type":"tool","tool":{"id":"t1","name":"search","arguments":{},"status":"completed"}}
data: {"type":"citation","citation":{"id":"s1","title":"Docs","url":"https://..."}}
data: {"type":"approval","approval":{"id":"a1","title":"Deploy?","status":"pending"}}
data: {"type":"done"}
data: {"type":"error","message":"..."}
```


## Internationalization

The starter ships English, Arabic (RTL) and Spanish. The server reads the
`slipstream-locale` cookie and renders `<html lang dir>`; the client provider
comes from `@slipstream-ui/i18n/react` so the pure runtime stays server-safe.

- Catalogs: `packages/i18n/src/messages/{en,ar,es}.ts` (typed; `en` is the source)
- Runtime: `translate`, `translatePlural`, `formatNumber`, `formatDate`,
  `formatRelativeTime`
- Switching: the header select writes the cookie, sets `lang`/`dir`, and reloads
- Mock backend and checkout errors are localized too

To add a locale:

1. Add the code to `SUPPORTED_LOCALES` and `LOCALE_LABELS` in
   `packages/i18n/src/locales.ts`.
2. Add `packages/i18n/src/messages/<code>.ts` (`satisfies Messages`).
3. Register it in `packages/i18n/src/messages/index.ts`.
4. Run `pnpm --filter @slipstream-ui/i18n test` and add a catalog key parity test.

Do not hardcode user-facing strings in the app; add a key to every catalog.
## Tests

```bash
pnpm test:starter
```

Covers the mock stream, event reducer, abort behaviour, tool replacement,
partial SSE frame parsing, history persistence, consent-gated analytics, the
checkout redirect, and an axe pass on the empty state. The full populated UI is
not snapshot-tested.

## Deploy

The app is a standard Next.js App Router project and deploys to Vercel without
extra configuration.

1. Import `apps/starters/ai-chat` as the project root.
2. Set `CHAT_BACKEND`, `OPENAI_API_KEY`, `OPENAI_MODEL` and
   `NEXT_PUBLIC_CHECKOUT_URL` in the environment.
3. Build command: `pnpm build`; output: Next.js default.
4. Keep `NEXT_PUBLIC_ANALYTICS_ENDPOINT` unset unless you have a consent flow.

The API route runs on the Node runtime and streams SSE. If your host buffers
responses, disable buffering for `/api/chat` or move the stream to a dedicated
edge/worker endpoint.

## What is included

- Working Next.js app, dark-mode tokens, responsive layout.
- Streaming chat with stop/retry (stop aborts the request; retry is a new send).
- Reasoning, tool calls, approval gate, citations, attachments.
- Two backends behind one client protocol.
- MIT-licensed Slipstream components; this starter is sold under the licence in
  [`LICENSE.md`](./LICENSE.md).

## What is not included

- Authentication, multi-tenant storage, billing inside the starter.
- Server-side conversation persistence.
- Tool execution. The approval gate is a UI gate; wire `onApprove` to your
  backend before claiming it is enforced.
- A judge/eval for response quality.

## Selling it

Reuse the existing `apps/app` Stripe + licence infrastructure:

1. Create a product in Stripe and set `STRIPE_PRICE_*` for the starter.
2. Set `NEXT_PUBLIC_CHECKOUT_URL` to the Stripe Payment Link (or hosted checkout).
   The starter's `/buy` route redirects there and returns a clear 503 when unset.
3. On checkout success, issue a licence key through `apps/app` (`licenses`).
4. Deliver the starter as a private repo or a private registry token.
5. Keep the marketing page explicit about what is and is not included.
