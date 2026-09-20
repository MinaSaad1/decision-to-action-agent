# Decision-to-Action AI Agent Proof

**Status:** Approved design
**Date:** 2026-09-20
**Owner:** Mina Saad

## Purpose

Create a public, buyer-facing proof that Mina builds production-minded AI agents, not chatbots or one-off model demos. The proof must show an agent receiving business input, understanding it, applying judgment, explaining its reasoning, pausing for human approval when required, taking action, and recording an audit trail.

The proof supports Mina's flagship commercial offer: the 14-Day AI Operations Agent Sprint.

## Positioning

**Core promise:** Turn one repetitive business workflow into an AI agent that understands, decides, acts, and stays accountable.

**Primary audience:** Founders, COOs, and Operations Heads at Gulf-based small and mid-sized companies.

**Primary CTA:** Show me the workflow your team repeats every week.

**Explicit exclusions:**

- No Power BI service positioning
- No data-analysis service positioning
- No generic chatbot
- No MissionSync name, screenshots, data, or references
- No invented ROI, customer claims, or testimonials
- No implication that synthetic demonstration records are real customer data

## Product Shape

Build one reusable **Decision-to-Action Agent Engine** with three selectable workflow packs:

1. **Procurement**, the hero story
2. **Recruitment**
3. **Customer Operations**

These are not three disconnected demos. Each pack uses the same six-stage operating model:

```text
Intake → Understand → Evaluate → Explain → Human Gate → Act and Log
```

The procurement pack receives the deepest treatment and drives the 90-second recording. Recruitment and Customer Operations prove that the engine transfers across business functions.

## Experience Design

### Entry screen

The first screen makes the distinction immediately:

> Not another chatbot. An agent that completes the workflow.

It shows the six-stage operating model and lets the visitor choose one of the three packs. Procurement is selected by default and marked as the featured walkthrough.

### Shared workspace

Every pack uses the same workspace structure:

- **Incoming work:** the source email, document, form, CV, or customer request
- **Agent run:** a visible stage-by-stage trace of what the agent is doing
- **Decision panel:** recommendation, confidence, evidence, risks, and missing information
- **Human gate:** approve, return, or escalate
- **Action record:** downstream action taken and immutable-looking audit entry

The visitor must be able to run a supplied scenario without uploading anything or entering credentials.

### Visual direction

- Light background
- Mina's yellow accent `#F5C518`
- Editorial, operational, and precise rather than futuristic
- Visible documents, decisions, and action records
- No purple gradients, glowing AI orbs, robot imagery, or generic chat bubbles
- Desktop-first recording composition, responsive enough for mobile review
- Restrained motion that clarifies state transitions
- No heavy text blocks

## Workflow Packs

### 1. Procurement, featured

**Input:** A purchase request and three supplier quotations in realistic synthetic PDF-like records.

**Agent responsibilities:**

- Extract price, currency, quantity, lead time, payment terms, validity, and exceptions
- Normalize offers for fair comparison
- Check offers against the purchase request
- Identify missing or conflicting terms
- Rank valid offers against explicit weighted criteria
- Explain the recommendation with evidence from the supplied records
- Escalate if a required condition fails
- Prepare the next action after approval

**Human gate:** A procurement manager approves, returns, or escalates the recommendation.

**Action:** Create a decision record and prepare an award or clarification message. The public demo does not send external email.

### 2. Recruitment

**Input:** A role brief and three realistic synthetic CVs.

**Agent responsibilities:**

- Extract required and preferred qualifications
- Evaluate candidates only against stated job criteria
- Cite evidence from each CV
- Identify missing information without inferring protected attributes
- Recommend shortlist, review, or reject
- Explain the recommendation and confidence

**Human gate:** A recruiter confirms or changes the shortlist.

**Action:** Create the shortlist record and prepare candidate-status messages. The public demo does not send them.

### 3. Customer Operations

**Input:** Three realistic synthetic customer requests from email, form, or WhatsApp-style intake.

**Agent responsibilities:**

- Classify intent, urgency, and routing destination
- Retrieve the relevant operating rule from a supplied policy set
- Recommend resolution or escalation
- Draft a response grounded only in supplied information
- Flag policy conflicts or missing evidence

**Human gate:** An operations owner approves, edits, or escalates the resolution.

**Action:** Update the request state and prepare the response. The public demo does not contact a real customer.

## Agent Behavior

The public proof must expose enough operational detail to establish trust:

- Source-grounded evidence for every recommendation
- Confidence shown as a labeled signal, not false precision
- Explicit missing-information flags
- Clear distinction between rule checks and model judgment
- Human approval before consequential actions
- Failure and escalation states
- Audit entries for input, decision, reviewer action, and prepared downstream action

The interface must never present hidden chain-of-thought. It shows concise decision rationale, evidence citations, applied rules, and action logs.

## Technical Architecture

### Frontend

A lightweight web application will provide the public experience, scenario switching, agent-run visualization, human gates, and audit trail.

### Agent engine

One backend contract serves all packs:

```text
scenario configuration
+ supplied input records
+ evaluation policy
→ structured extraction
→ rule evaluation
→ model judgment where required
→ decision packet
→ approval state
→ prepared action record
```

Each pack supplies its own schema, criteria, policies, and action templates while preserving the same engine stages.

### Demonstration mode

The public version uses bundled synthetic scenarios. Runs must be repeatable and safe. No external email, ATS, CRM, procurement platform, or customer system is modified.

The implementation should support two execution paths:

1. A live structured agent path when configured credentials are available
2. A clearly labeled deterministic demonstration path for reliable public playback and recording

The deterministic path must use precomputed outputs generated from the same schemas and policies. It must not pretend to be a live model call.

### Data model

Core entities:

- `WorkflowPack`
- `Scenario`
- `SourceRecord`
- `PolicyRule`
- `AgentRun`
- `StageResult`
- `DecisionPacket`
- `HumanReview`
- `PreparedAction`
- `AuditEvent`

## Error and Exception Handling

The proof must include visible handling for:

- Missing required document or field
- Conflicting values across records
- Unsupported file or malformed input
- Low-confidence judgment
- Failed policy check
- Agent execution failure
- Human rejection or requested revision

Failures must end in an actionable state such as request clarification, retry, or escalate. No silent failure and no false success state.

## Proof Package

The completed package contains:

1. Public interactive web proof
2. Procurement-led 90-second screen recording
3. One-page case snapshot describing the before state, agent workflow, human controls, and operational outcome
4. Reusable screenshots for outreach and LinkedIn
5. Primary CTA linking to Mina's booking path or inquiry flow

## Success Criteria

The proof is complete only when:

- A first-time visitor can understand the value without technical explanation
- The procurement walkthrough reaches a prepared action and audit record in under 90 seconds
- All three packs visibly use the same engine model
- Every recommendation cites supplied evidence or an explicit policy
- At least one exception path is demonstrated
- Human approval is required before the consequential action
- Synthetic data is identified clearly
- No MissionSync reference or confidential material appears anywhere
- No Power BI or data-analysis service positioning appears anywhere
- The page works at desktop and mobile breakpoints
- Browser console is clean during all three walkthroughs
- Automated tests cover the happy path, exception path, scenario switching, and human-gate behavior

## Non-Goals

- Building a multi-tenant SaaS product
- User accounts, billing, or persistent customer workspaces
- Real external-system writes
- General-purpose prompt input
- Supporting arbitrary document types
- Claiming measured business impact before a real client implementation

## Implementation Boundary

Version 1 is a public proof asset, not a commercial platform. It should feel production-minded while remaining intentionally bounded to the three supplied scenarios and the sales narrative.
