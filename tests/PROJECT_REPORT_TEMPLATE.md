# Project Manager Report

Copy to `PROJECT_REPORT_<YYYY-MM-DD>_pm.md` at the end of every orchestrated
cycle. This file aggregates subagent work; it does not replace
`REPORT_<date>_code.md` or `REPORT_<date>_player.md`.

## Metadata

- **PM run date (UTC):**
- **User goal:**
- **Migration checklist step(s) in scope:**
- **System version:** (from `system.json#version`)
- **Prior PM report:** path or "none"

## Executive summary

Two to four sentences: overall health, whether both agents ran, and whether the
cycle is **complete**, **blocked**, or **partial**.

## Delegation log

| Step | Agent | Brief assigned | Status (done / blocked / skipped) |
| --- | --- | --- | --- |
| 1 | code | | |
| 2 | player | | |
| 3 | code (reconcile) | | |
| 4 | player (reconcile) | | |

## Code agent — changes and outcomes

Link: `tests/REPORT_<date>_code.md`

### Improvements / alterations

List each meaningful change the code agent made (not only test files):

| Area | File(s) | What changed | Why (checklist step or failure) |
| --- | --- | --- | --- |
| | | | |

### Tests added or updated

- Vitest: `tests/unit/...`
- Static: (if run)

### Hand-offs issued to player

Quote or summarise each **Hand-off: player agent** line still open after
reconcile.

## Player agent — changes and outcomes

Link: `tests/REPORT_<date>_player.md`

### Improvements / alterations

| Area | File(s) | What changed | Why |
| --- | --- | --- | --- |
| | | | |

Note: player agent must not list `module/**` patches — only Quench/static test
artefacts.

### Tests added or updated

- Quench: `tests/quench/...`
- Static validator runs

### Hand-offs issued to code

Quote or summarise each **Hand-off: code agent** line still open after
reconcile.

## Pyramid status (aggregated)

| Layer | Passed | Failed | Pending | Owner agent | Notes |
| --- | --- | --- | --- | --- | --- |
| Static | | | | code / player | |
| Vitest | | | | code | |
| Quench | | | | player | |

## Regressions (cross-agent)

Defects that were green in the prior PM report and are red now. Attribute each
to the agent that detected it.

## Open queue for next run

Numbered list prioritized for the next PM cycle:

1.
2.

## Agent registry changes

- [ ] No registry changes this run
- [ ] Updated `reference/agents-registry.md`: (describe)

## Sign-off

- [ ] Checklist steps in scope are green or have tracked failures above.
- [ ] Subagent reports saved under `tests/`.
- [ ] This PM report saved as `PROJECT_REPORT_<date>_pm.md`.
- [ ] User informed of any Foundry/Quench action required.
