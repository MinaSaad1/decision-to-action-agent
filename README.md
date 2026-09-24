# Decision-to-Action Agent Proof

A public interactive proof of a production-minded AI agent pattern across Procurement, Recruitment, and Customer Operations.

**Canonical home:** https://www.mina-saad.com/decision-to-action (ported into the `mina-saad-site` repo on 2026-09-24, deterministic mode only). This repo stays as the standalone build: the GitHub Pages copy is the rollback, and it still carries the optional live-model driver and `api/run.ts`. The site version also fixed return and escalate so they no longer prepare the approved action.

## What it demonstrates

- One reusable six-stage agent engine
- Evidence-backed decisions
- Explicit policy checks and exception handling
- Human approval before consequential action
- A visible audit trail
- No external writes in demonstration mode

All bundled records are synthetic. No customer data is used.

## Local development

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Verification

```bash
npm run check
```

This runs unit and interaction tests, creates a production build, and runs Chromium E2E tests.

## Agent modes

`VITE_AGENT_MODE=demonstration` is the safe default. It uses validated, repeatable scenario output and never contacts an external service.

The optional Vercel function under `api/run.ts` supports an OpenRouter-backed structured run. Configure these only on the server:

```dotenv
OPENROUTER_API_KEY=
OPENROUTER_MODEL=openai/gpt-5-mini
```

The browser bundle never receives the API key.

## Deploy to Vercel

1. Import this repository into Vercel.
2. Keep demonstration mode for the public proof.
3. Add the two server environment variables only if live mode is intentionally enabled.
4. Deploy, then exercise all three packs and the exception scenario against the deployed URL.

## Safety boundary

The proof prepares actions but does not send email, update an ATS, write to a CRM, award a supplier, or contact a customer.

## Recording

`node scripts/record-proof.mjs` records the procurement walkthrough from the website, cued to `docs/recording-script.md`, and prints the front trim for the page load. The current cut is `artifacts/decision-to-action-agent-90s-site.mp4` (the original GitHub Pages cut is kept beside it).

## Project documents

- [Design specification](docs/superpowers/specs/2026-09-20-decision-to-action-proof-design.md)
- [Implementation plan](docs/superpowers/plans/2026-09-20-decision-to-action-proof.md)
- [Case snapshot](docs/case-snapshot.md)
- [Recording script](docs/recording-script.md)
