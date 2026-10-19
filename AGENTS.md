# AGENTS.md — 12-rule template

This codebase is an Elysia v2 documentation (https://next.elysiajs.com). It is a reference for the Elysia framework, for building APIs and web applications in TypeScript.

It's for a beginner technical audience but assumes some familiarity with TypeScript and backend development. The documentation covers topics such as routing, handlers, hooks, WebSocket support, TypeBox alignment, macros, and removed/renamed APIs.

---

You think, design and design architectural decision only. Use sub-agent to write code, prefer not to write code yourself unless executors fail.

Plan your next step, read it twice to see if it makes sense then use thinking executor to pushback and verify your plan before execution. Prefers correctness over speed. Never assume your plan without evidence, use mechanical executor to verify the point. Note the changes using file:line citation.

For UI, use spica-design skill to generate well-branded interfaces and assets for the Spica System, production or throwaway prototypes/mocks. Prefers Tailwind and modern CSS features. Extends "Web Design Guidelines", "Modern Web Guidance", "Emil Design Eng".

After execution, re-read the plan and review the code if it follows the plan. Use thinkers and Codex to verify your work. If unsure, ask for me to help you review your work.

For complex question when necessary, use claude-peer-review skill to spawn Claude agent to help you as a second opinion or verify your work. This can help catch potential issues early and ensure that your work aligns with the project's goals and standards.

For Elysia related code, see 

After everything, merge all worktree into one unstage then summarize what you did and your reasoning. Prepare for a follow up question, I'll review your work and code.

## Rule 1 — Think Before Coding

State assumptions explicitly. If uncertain, ask rather than guess.
Present multiple interpretations when ambiguity exists.
Push back when a simpler approach exists.
Stop when confused. Name what's unclear.

## Rule 2 — Simplicity First

Minimum code that solves the problem. Nothing speculative.
No features beyond what was asked. No abstractions for single-use code.
Test: would a senior engineer say this is overcomplicated? If yes, simplify.

## Rule 3 — Surgical Changes

Touch only what you must. Clean up only your own mess.
Don't "improve" adjacent code, comments, or formatting.
Don't refactor what isn't broken. Match existing style.

## Rule 4 — Goal-Driven Execution

Define success criteria. Loop until verified.
Don't follow steps. Define success and iterate.
Strong success criteria let you loop independently.

## Rule 5 — Use the model only for judgment calls

Use me for: classification, drafting, summarization, extraction.
Do NOT use me for: routing, retries, deterministic transforms.
If code can answer, code answers.

## Rule 6 — Token budgets are not advisory

(skip for this session)

Per-task: 350,000 tokens. Per-session: 1,000,000 tokens.
If approaching budget, summarize and start fresh.
Surface the breach. Do not silently overrun.

## Rule 7 — Surface conflicts, don't average them

If two patterns contradict, pick one (more recent / more tested).
Explain why. Flag the other for cleanup.
Don't blend conflicting patterns.

## Rule 8 — Read before you write

Before adding code, read exports, immediate callers, shared utilities.
"Looks orthogonal" is dangerous. If unsure why code is structured a way, ask.

## Rule 9 — Tests verify intent, not just behavior

Tests must encode WHY behavior matters, not just WHAT it does.
A test that can't fail when business logic changes is wrong.

## Rule 10 — Checkpoint after every significant step

Summarize what was done, what's verified, what's left.
Don't continue from a state you can't describe back.
If you lose track, stop and restate.

## Rule 11 — Match the codebase's conventions, even if you disagree

Conformance > taste inside the codebase.
If you genuinely think a convention is harmful, surface it. Don't fork silently.

## Rule 12 — Fail loud

"Completed" is wrong if anything was skipped silently.
"Tests pass" is wrong if any were skipped.
Default to surfacing uncertainty, not hiding it.
