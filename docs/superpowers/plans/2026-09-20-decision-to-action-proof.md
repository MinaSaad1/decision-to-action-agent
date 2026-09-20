# Decision-to-Action AI Agent Proof Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and verify a public interactive proof that demonstrates one reusable AI agent engine across Procurement, Recruitment, and Customer Operations, with Procurement as the featured 90-second walkthrough.

**Architecture:** A React and TypeScript application renders three configuration-driven workflow packs through one state-machine engine. The default deterministic driver makes every public run repeatable, while an optional Vercel serverless endpoint exposes the same structured contract for a live OpenRouter-backed run without leaking credentials. Consequential actions remain prepared drafts until a human approves them, and every state transition produces a visible audit event.

**Tech Stack:** React 19, TypeScript, Vite, Zod, Vitest, React Testing Library, Playwright, Vercel Functions, CSS Modules or focused global CSS, npm

---

## File Map

```text
decision-to-action-proof/
├── api/
│   └── run.ts                         # Optional live structured agent endpoint
├── docs/
│   ├── case-snapshot.md               # One-page buyer-facing proof copy
│   ├── recording-script.md            # 90-second procurement walkthrough
│   └── superpowers/
│       ├── plans/2026-09-20-decision-to-action-proof.md
│       └── specs/2026-09-20-decision-to-action-proof-design.md
├── e2e/
│   ├── happy-path.spec.ts
│   ├── exception-path.spec.ts
│   └── responsive.spec.ts
├── public/
│   └── favicon.svg
├── src/
│   ├── app/
│   │   ├── App.tsx                    # Page composition only
│   │   └── App.test.tsx
│   ├── components/
│   │   ├── ActionRecord.tsx
│   │   ├── AgentTrace.tsx
│   │   ├── DecisionPanel.tsx
│   │   ├── Hero.tsx
│   │   ├── HumanGate.tsx
│   │   ├── PackSelector.tsx
│   │   ├── SourceRecordCard.tsx
│   │   ├── Workspace.tsx
│   │   └── components.test.tsx
│   ├── engine/
│   │   ├── deterministicDriver.ts
│   │   ├── deterministicDriver.test.ts
│   │   ├── liveDriver.ts
│   │   ├── liveDriver.test.ts
│   │   ├── reducer.ts
│   │   ├── reducer.test.ts
│   │   └── types.ts
│   ├── hooks/
│   │   ├── useAgentRun.ts
│   │   └── useAgentRun.test.ts
│   ├── packs/
│   │   ├── customerOperations.ts
│   │   ├── procurement.ts
│   │   ├── recruitment.ts
│   │   ├── registry.test.ts
│   │   └── registry.ts
│   ├── styles/
│   │   └── global.css
│   ├── test/
│   │   └── setup.ts
│   ├── main.tsx
│   └── vite-env.d.ts
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── playwright.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json
└── vite.config.ts
```

## Task 1: Scaffold the tested application shell

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/app/App.tsx`
- Create: `src/app/App.test.tsx`
- Create: `src/test/setup.ts`
- Create: `.gitignore`
- Create: `.env.example`

- [ ] **Step 1: Create package metadata and scripts**

Use this script contract in `package.json`:

```json
{
  "name": "decision-to-action-proof",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "check": "npm run test && npm run build && npm run test:e2e"
  },
  "dependencies": {
    "@vitejs/plugin-react": "latest",
    "lucide-react": "latest",
    "react": "latest",
    "react-dom": "latest",
    "zod": "latest"
  },
  "devDependencies": {
    "@playwright/test": "latest",
    "@testing-library/jest-dom": "latest",
    "@testing-library/react": "latest",
    "@testing-library/user-event": "latest",
    "@types/node": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "jsdom": "latest",
    "typescript": "latest",
    "vite": "latest",
    "vitest": "latest"
  }
}
```

- [ ] **Step 2: Install dependencies and record the lockfile**

Run:

```bash
npm install
npx playwright install chromium
```

Expected: `package-lock.json` exists and Chromium installation exits with code 0.

- [ ] **Step 3: Write the first failing render test**

Create `src/app/App.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('states the proof in buyer language', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { name: /not another chatbot/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/synthetic demonstration data/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Run the test and verify failure**

Run: `npm test -- src/app/App.test.tsx`

Expected: FAIL because `App.tsx` and test setup are not implemented.

- [ ] **Step 5: Add the minimal application and test configuration**

Create `src/app/App.tsx`:

```tsx
export function App() {
  return (
    <main>
      <h1>Not another chatbot. An agent that completes the workflow.</h1>
      <p>Synthetic demonstration data. No customer records are used.</p>
    </main>
  );
}
```

Configure Vitest in `vite.config.ts` with `environment: 'jsdom'` and `setupFiles: './src/test/setup.ts'`. Import `@testing-library/jest-dom/vitest` in the setup file. Mount `<App />` from `src/main.tsx`.

- [ ] **Step 6: Verify scaffold quality**

Run:

```bash
npm test -- src/app/App.test.tsx
npm run build
```

Expected: one passing test and a successful production build.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vite.config.ts tsconfig.json tsconfig.node.json index.html src .gitignore .env.example
git commit -m "chore: scaffold decision-to-action proof"
```

## Task 2: Define the shared domain contract and three workflow packs

**Files:**
- Create: `src/engine/types.ts`
- Create: `src/packs/procurement.ts`
- Create: `src/packs/recruitment.ts`
- Create: `src/packs/customerOperations.ts`
- Create: `src/packs/registry.ts`
- Create: `src/packs/registry.test.ts`

- [ ] **Step 1: Write failing registry tests**

The tests must assert:

```ts
expect(workflowPacks.map((pack) => pack.id)).toEqual([
  'procurement',
  'recruitment',
  'customer-operations',
]);
expect(workflowPacks.every((pack) => pack.stages.length === 6)).toBe(true);
expect(procurementPack.featured).toBe(true);
expect(procurementPack.scenarios.some((scenario) => scenario.kind === 'exception')).toBe(true);
```

Also validate every pack with a Zod `WorkflowPackSchema` so malformed synthetic records fail during development.

- [ ] **Step 2: Run the registry test and verify failure**

Run: `npm test -- src/packs/registry.test.ts`

Expected: FAIL because the pack contract and registry do not exist.

- [ ] **Step 3: Implement the shared types and schemas**

Define these public contracts in `src/engine/types.ts`:

```ts
export const stageIds = [
  'intake',
  'understand',
  'evaluate',
  'explain',
  'human-gate',
  'act-and-log',
] as const;

export type StageId = (typeof stageIds)[number];
export type PackId = 'procurement' | 'recruitment' | 'customer-operations';
export type ScenarioKind = 'happy' | 'exception';
export type ReviewDecision = 'approved' | 'returned' | 'escalated';

export interface EvidenceRef {
  sourceId: string;
  label: string;
  excerpt: string;
}

export interface PolicyCheck {
  id: string;
  label: string;
  result: 'pass' | 'warn' | 'fail';
  detail: string;
}

export interface DecisionPacket {
  recommendation: string;
  confidence: 'high' | 'medium' | 'low';
  rationale: string[];
  evidence: EvidenceRef[];
  policyChecks: PolicyCheck[];
  missingInformation: string[];
}

export interface SourceRecord {
  id: string;
  type: 'request' | 'quotation' | 'cv' | 'customer-message' | 'policy';
  title: string;
  sender: string;
  receivedAt: string;
  fields: Record<string, string>;
  body: string;
}

export interface PreparedAction {
  title: string;
  destination: string;
  body: string;
  status: 'prepared' | 'approved' | 'returned' | 'escalated';
}

export interface Scenario {
  id: string;
  label: string;
  kind: ScenarioKind;
  summary: string;
  sourceRecords: SourceRecord[];
  stageSummaries: Record<Exclude<StageId, 'human-gate' | 'act-and-log'>, string>;
  decision: DecisionPacket;
  preparedAction: Omit<PreparedAction, 'status'>;
}

export interface WorkflowPack {
  id: PackId;
  label: string;
  eyebrow: string;
  description: string;
  featured: boolean;
  stages: readonly StageId[];
  scenarios: Scenario[];
}
```

Add Zod schemas mirroring these interfaces and export `WorkflowPackSchema`.

- [ ] **Step 4: Write the Procurement pack**

Create two complete synthetic scenarios:

1. `supplier-award`, three quotations where one supplier wins on weighted total value despite not having the lowest unit price.
2. `missing-compliance`, one quotation lacks a required compliance certificate and must be escalated.

Use a fictitious company name, `Northstar Facilities`, and suppliers `Aster Supply`, `Cedar Industrial`, and `Meridian Trade`. Label all records as synthetic inside their body text. Include explicit price, currency, lead time, payment terms, validity, compliance status, and warranty fields.

- [ ] **Step 5: Write the Recruitment and Customer Operations packs**

Recruitment uses a fictitious `Automation Operations Lead` role and three synthetic candidates. Evaluation criteria must remain job-related and must not include age, gender, nationality, photo, marital status, religion, disability, or other protected attributes.

Customer Operations uses a fictitious equipment-service company with three requests: a normal reschedule, a warranty exception, and an urgent safety escalation. Ground each recommendation in a supplied synthetic service policy record.

- [ ] **Step 6: Implement the registry and verify**

Export the ordered array and `getWorkflowPack(id)` from `src/packs/registry.ts`.

Run:

```bash
npm test -- src/packs/registry.test.ts
npm run build
```

Expected: registry tests pass and all pack data type-checks.

- [ ] **Step 7: Commit**

```bash
git add src/engine/types.ts src/packs
git commit -m "feat: add three workflow packs"
```

## Task 3: Build the deterministic agent engine and audit state machine

**Files:**
- Create: `src/engine/deterministicDriver.ts`
- Create: `src/engine/deterministicDriver.test.ts`
- Create: `src/engine/reducer.ts`
- Create: `src/engine/reducer.test.ts`

- [ ] **Step 1: Write failing driver tests**

Cover these exact behaviors:

```ts
const result = await deterministicDriver.run(procurementHappyScenario);
expect(result.mode).toBe('demonstration');
expect(result.stageResults.map((stage) => stage.stageId)).toEqual([
  'intake',
  'understand',
  'evaluate',
  'explain',
]);
expect(result.decision.evidence.length).toBeGreaterThan(0);
expect(result.decision.policyChecks.every((check) => check.detail.length > 0)).toBe(true);
```

Assert that the exception scenario returns at least one `fail` policy check and low or medium confidence.

- [ ] **Step 2: Run the driver tests and verify failure**

Run: `npm test -- src/engine/deterministicDriver.test.ts`

Expected: FAIL because the driver does not exist.

- [ ] **Step 3: Implement the driver contract**

Define:

```ts
export interface AgentRunResult {
  mode: 'demonstration' | 'live';
  stageResults: Array<{
    stageId: Exclude<StageId, 'human-gate' | 'act-and-log'>;
    summary: string;
    completedAt: string;
  }>;
  decision: DecisionPacket;
}

export interface AgentDriver {
  run(scenario: Scenario): Promise<AgentRunResult>;
}
```

The deterministic driver copies only prevalidated scenario output and marks itself `demonstration`. It must never use random values or imply a network request.

- [ ] **Step 4: Write failing reducer tests**

Cover:

- `START_RUN` resets prior review and audit state.
- `STAGE_COMPLETED` advances only to the next legal stage.
- `RUN_READY_FOR_REVIEW` pauses at `human-gate`.
- `REVIEW_SUBMITTED` requires `approved`, `returned`, or `escalated`.
- Only `approved` changes the prepared action to `approved`.
- Every event appends one timestamped `AuditEvent`.

- [ ] **Step 5: Implement the reducer**

Use a discriminated union of events and reject out-of-order transitions by returning the unchanged state plus an error field. Do not allow `act-and-log` before a review decision.

- [ ] **Step 6: Verify the engine**

Run:

```bash
npm test -- src/engine
npm run build
```

Expected: all engine tests pass and build succeeds.

- [ ] **Step 7: Commit**

```bash
git add src/engine
git commit -m "feat: add auditable agent run engine"
```

## Task 4: Add the orchestration hook

**Files:**
- Create: `src/hooks/useAgentRun.ts`
- Create: `src/hooks/useAgentRun.test.ts`

- [ ] **Step 1: Write failing hook tests**

Use fake timers and assert:

- A new run starts at `intake`.
- Four automated stages complete in order.
- The run pauses at `human-gate`.
- Approval produces a prepared action and final audit event.
- Switching scenario cancels pending timers and clears the previous decision.

- [ ] **Step 2: Run and verify failure**

Run: `npm test -- src/hooks/useAgentRun.test.ts`

Expected: FAIL because the hook does not exist.

- [ ] **Step 3: Implement the hook**

The hook owns reducer dispatch and animation timing, but not presentational markup. Expose:

```ts
{
  state,
  startRun,
  submitReview,
  resetRun,
  isRunning,
}
```

Use short staggered delays totaling no more than 3.5 seconds so the public walkthrough remains under 90 seconds. Respect `prefers-reduced-motion` by completing all automated stages immediately.

- [ ] **Step 4: Verify**

Run:

```bash
npm test -- src/hooks/useAgentRun.test.ts
npm run build
```

Expected: all hook tests pass and build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/hooks
git commit -m "feat: orchestrate agent workflow runs"
```

## Task 5: Build the visual shell and pack selection

**Files:**
- Create: `src/components/Hero.tsx`
- Create: `src/components/PackSelector.tsx`
- Create: `src/components/Workspace.tsx`
- Create: `src/styles/global.css`
- Modify: `src/app/App.tsx`
- Create: `src/components/components.test.tsx`
- Create: `public/favicon.svg`

- [ ] **Step 1: Write failing component tests**

Assert:

- The hero uses the headline `Not another chatbot. An agent that completes the workflow.`
- The six stages are visible in order.
- Procurement is initially selected and marked `Featured walkthrough`.
- Selecting Recruitment changes the workspace title and source-record count.
- A permanent badge reads `Synthetic demonstration data`.

- [ ] **Step 2: Run and verify failure**

Run: `npm test -- src/components/components.test.tsx`

Expected: FAIL because the components do not exist.

- [ ] **Step 3: Implement the structural components**

`App.tsx` owns selected pack and scenario IDs, then passes records and callbacks downward. `PackSelector` renders an accessible tablist. `Workspace` composes the input, trace, decision, human-gate, and action regions but does not implement their internals yet.

- [ ] **Step 4: Implement the visual system**

Use CSS variables:

```css
:root {
  --paper: #f7f4ec;
  --surface: #ffffff;
  --ink: #171715;
  --muted: #69675f;
  --line: #d8d2c4;
  --accent: #f5c518;
  --accent-soft: #fff3b5;
  --success: #247451;
  --warning: #9a6500;
  --danger: #a33a32;
  --radius-sm: 10px;
  --radius-md: 18px;
  --shadow: 0 18px 60px rgba(32, 27, 13, 0.08);
}
```

Use a light editorial layout, visible operational artifacts, strong black type, yellow emphasis, and restrained shadows. Avoid gradients, glass cards, chat bubbles, AI orbs, and robot imagery. Include visible focus styles and a `prefers-reduced-motion` media query.

- [ ] **Step 5: Verify shell behavior**

Run:

```bash
npm test -- src/app/App.test.tsx src/components/components.test.tsx
npm run build
```

Expected: shell tests pass and production build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/app src/components src/styles public/favicon.svg
git commit -m "feat: build proof workspace shell"
```

## Task 6: Implement records, trace, decision, human gate, and action log

**Files:**
- Create: `src/components/SourceRecordCard.tsx`
- Create: `src/components/AgentTrace.tsx`
- Create: `src/components/DecisionPanel.tsx`
- Create: `src/components/HumanGate.tsx`
- Create: `src/components/ActionRecord.tsx`
- Modify: `src/components/Workspace.tsx`
- Modify: `src/components/components.test.tsx`

- [ ] **Step 1: Add failing interaction tests**

Assert the full procurement path:

```ts
await user.click(screen.getByRole('button', { name: /run procurement agent/i }));
expect(await screen.findByText(/ready for human review/i)).toBeInTheDocument();
expect(screen.getByText(/evidence/i)).toBeInTheDocument();
expect(screen.getByText(/policy checks/i)).toBeInTheDocument();
expect(screen.getByRole('button', { name: /approve recommendation/i })).toBeEnabled();
await user.click(screen.getByRole('button', { name: /approve recommendation/i }));
expect(screen.getByText(/action prepared and approved/i)).toBeInTheDocument();
expect(screen.getByText(/audit trail/i)).toBeInTheDocument();
```

Add an exception scenario test that ends with `Escalation prepared` rather than a false success state.

- [ ] **Step 2: Run and verify failure**

Run: `npm test -- src/components/components.test.tsx`

Expected: FAIL on missing workflow components.

- [ ] **Step 3: Implement source records and trace**

`SourceRecordCard` displays synthetic labeling, sender, timestamp, typed fields, and body. `AgentTrace` renders the six fixed stages with `waiting`, `active`, `complete`, or `blocked` states. Use `aria-live="polite"` for status changes.

- [ ] **Step 4: Implement the decision panel**

Render recommendation, labeled confidence, concise rationale, evidence citations, rule checks, and missing information. Evidence links scroll or focus the corresponding source record. Never render hidden reasoning or chain-of-thought language.

- [ ] **Step 5: Implement the human gate and action record**

Expose three explicit controls: `Approve recommendation`, `Return for clarification`, and `Escalate exception`. Disable them before the run reaches review. Render the prepared message but never provide a Send button. The final action record must state `Prepared only. No external system was changed.`

- [ ] **Step 6: Verify all interactions**

Run:

```bash
npm test
npm run build
```

Expected: unit and interaction tests pass, with a successful production build.

- [ ] **Step 7: Commit**

```bash
git add src/components src/app
git commit -m "feat: complete decision and human review experience"
```

## Task 7: Add the optional live structured-agent path

**Files:**
- Create: `api/run.ts`
- Create: `src/engine/liveDriver.ts`
- Create: `src/engine/liveDriver.test.ts`
- Create: `vercel.json`
- Modify: `.env.example`

- [ ] **Step 1: Write failing live-driver tests**

Mock `fetch` and assert:

- The request posts only pack ID, scenario ID, source records, and policies.
- The response is parsed through the shared Zod decision schema.
- Invalid responses produce an actionable `LiveAgentError`.
- A missing server configuration falls back only when the caller explicitly enables deterministic mode.

- [ ] **Step 2: Run and verify failure**

Run: `npm test -- src/engine/liveDriver.test.ts`

Expected: FAIL because the live driver does not exist.

- [ ] **Step 3: Implement the browser live driver**

Post to `/api/run` and return the same `AgentRunResult` contract as the deterministic driver. Never read an API key in browser code.

- [ ] **Step 4: Implement the Vercel function**

`api/run.ts` must:

1. Accept only `POST`.
2. Validate the request with Zod.
3. Reject unknown pack or scenario IDs.
4. Read `OPENROUTER_API_KEY` and `OPENROUTER_MODEL` server-side.
5. Call `https://openrouter.ai/api/v1/chat/completions` with structured JSON output.
6. Instruct the model to return concise decision rationale, evidence references, policy checks, missing information, and confidence.
7. Parse and validate the model response before returning it.
8. Return safe error messages without secrets or raw provider payloads.

Use this environment contract in `.env.example`:

```dotenv
OPENROUTER_API_KEY=
OPENROUTER_MODEL=openai/gpt-5-mini
VITE_AGENT_MODE=demonstration
```

The committed default remains `demonstration`.

- [ ] **Step 5: Verify live-path safety**

Run:

```bash
npm test -- src/engine/liveDriver.test.ts
npm run build
```

Expected: mocked live-driver tests pass; production build contains no API key.

Search built assets for the environment variable name and confirm only configuration labels appear, not a secret value.

- [ ] **Step 6: Commit**

```bash
git add api src/engine/liveDriver.ts src/engine/liveDriver.test.ts vercel.json .env.example
git commit -m "feat: add optional live agent driver"
```

## Task 8: Add browser-level verification and responsive behavior

**Files:**
- Create: `playwright.config.ts`
- Create: `e2e/happy-path.spec.ts`
- Create: `e2e/exception-path.spec.ts`
- Create: `e2e/responsive.spec.ts`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Configure Playwright**

Configure Chromium against `http://127.0.0.1:4173`, with `npm run build && npm run preview -- --host 127.0.0.1` as the web server. Enable traces on first retry and screenshots only on failure.

- [ ] **Step 2: Write the happy-path test**

The test must:

1. Open the page.
2. Confirm the synthetic-data badge.
3. Run the featured Procurement scenario.
4. Wait for human review.
5. Approve the recommendation.
6. Verify the prepared action and audit trail.
7. Switch to Recruitment and Customer Operations and verify each uses the same six stages.
8. Assert there are no console errors.

- [ ] **Step 3: Write the exception-path test**

Select `Missing compliance document`, run it, verify the failed policy check, escalate it, and assert that the final state is `Escalation prepared` rather than `Action completed`.

- [ ] **Step 4: Write the responsive test**

At desktop `1440 × 1000` and mobile `390 × 844`:

- Assert no horizontal overflow.
- Assert all primary controls remain visible.
- Capture full-page screenshots to `test-results/visual/`.
- Verify the tablist remains keyboard reachable.

- [ ] **Step 5: Run E2E and fix only evidenced defects**

Run:

```bash
npm run test:e2e
```

Expected: all Chromium tests pass with no console errors.

- [ ] **Step 6: Run the complete quality gate**

Run:

```bash
npm run check
```

Expected: unit tests, build, and E2E tests all pass.

- [ ] **Step 7: Commit**

```bash
git add playwright.config.ts e2e src/styles/global.css
git commit -m "test: verify proof workflows in browser"
```

## Task 9: Produce the buyer-facing proof package

**Files:**
- Create: `docs/case-snapshot.md`
- Create: `docs/recording-script.md`
- Modify: `src/app/App.tsx`

- [ ] **Step 1: Write the one-page case snapshot**

Use this exact structure:

```markdown
# From incoming document to accountable action

## Before
A team member opens every request, extracts the details, checks policy, compares options, writes a recommendation, and updates the next system.

## The agent
The Decision-to-Action Agent receives the work, structures it, applies explicit rules, makes the judgment calls that need context, cites the evidence, and pauses before any consequential action.

## Human control
The reviewer can approve, return, or escalate. The agent records what it saw, what rules it applied, what it recommended, and what action was prepared.

## What this proof demonstrates
- One engine across Procurement, Recruitment, and Customer Operations
- Evidence-backed recommendations
- Explicit exception handling
- Human approval before action
- A complete audit trail

## Important
Every company has different policies and systems. This public proof uses synthetic data. A client sprint starts by mapping one real workflow and defining its controls.

## Next step
Show me the workflow your team repeats every week.
```

- [ ] **Step 2: Write the 90-second recording script**

Time-box the script:

- `0:00-0:10`, problem and promise
- `0:10-0:23`, incoming request and three quotations
- `0:23-0:45`, extraction, rule checks, and comparison
- `0:45-1:02`, evidence-backed recommendation and exception visibility
- `1:02-1:16`, human approval
- `1:16-1:25`, prepared action and audit record
- `1:25-1:30`, CTA

The spoken script must stay below 195 words and contain no invented customer or ROI claims.

- [ ] **Step 3: Add the final CTA**

Add one primary CTA to `App.tsx` using Mina's existing booking URL:

```text
https://cal.com/minasaad/60min?overlayCalendar=true
```

Label it `Show me your workflow`. Add a secondary text link `See all three examples` that scrolls to the pack selector.

- [ ] **Step 4: Verify copy constraints**

Search public source and docs for prohibited positioning terms and confidential references. Confirm any occurrence is limited to internal design documentation, not rendered UI, case snapshot, or recording script.

Run:

```bash
npm run check
```

Expected: full quality gate passes.

- [ ] **Step 5: Commit**

```bash
git add docs/case-snapshot.md docs/recording-script.md src/app/App.tsx
git commit -m "docs: add proof package and sales narrative"
```

## Task 10: Final browser QA and deployable handoff

**Files:**
- Modify only files implicated by verified defects
- Create: `README.md`

- [ ] **Step 1: Document local and deployment workflows**

`README.md` must include:

- What the proof demonstrates
- `npm install`, `npm run dev`, `npm run check`
- Demonstration mode as the safe default
- Optional OpenRouter server configuration
- Vercel deployment steps
- Synthetic-data and no-external-write guarantees
- Link to the design spec and implementation plan

- [ ] **Step 2: Run the final automated gate**

Run:

```bash
npm run check
```

Expected: all unit tests, production build, and Playwright tests pass.

- [ ] **Step 3: Perform real-browser QA**

In Chromium, exercise every pack and every tab:

- Procurement happy path
- Procurement missing-compliance exception
- Recruitment happy path
- Customer Operations happy path
- Approve, return, and escalate controls
- Desktop and mobile viewport
- Keyboard navigation
- Reduced-motion mode

Capture screenshots of each pack's decision state plus the procurement action-record state. Record console output and confirm zero errors.

- [ ] **Step 4: Inspect the production artifact**

Serve `dist/` through `npm run preview`. Confirm the page loads directly, reloads without routing failure, contains no secret, and performs no external write.

- [ ] **Step 5: Commit the verified handoff**

```bash
git add README.md .
git commit -m "docs: finalize verified proof handoff"
```

- [ ] **Step 6: Report evidence**

Report:

- Exact test counts
- Production build result
- E2E test count
- Screenshot paths
- Browser console status
- Commit hash
- Deployment URL only if deployment was actually completed and read back successfully
