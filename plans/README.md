# Animation plans

| # | Plan | Severity | Status |
| --- | --- | --- | --- |
| 001 | [Make the bar → panel morph settle like Liquid Glass](001-liquid-glass-morph.md) | HIGH | DONE |

## Order

1. 001: standalone. It touches `src/components/assistant/morph.ts` and one rule in `src/styles/global.css`. Run it after the in-progress assistant work (Revision 8 in `.claude/ask-plan.md`) has landed in the working tree, since that work created `morph.ts`.
