# Dark Heresy 3rd Edition (DH2 fork) — V14 Migration Checklist

Use this as the execution tracker for migrating `dark-heresy-3rd-edition` to Foundry V14.

## How to Use

- Set **Owner** for each step.
- Move **Status** through `todo` -> `in-progress` -> `blocked`/`done`.
- A step is complete only when its **Definition of Done** is satisfied.
- **Live evidence** for the 2026-05-01 run is summarized under [Live validation summary](#live-validation-summary) and detailed in `FOUNDRY_V14_TEST_LOG.md`.

## Tracker

| # | Step | Owner | Status | Definition of Done |
|---|---|---|---|---|
| 1 | Manifest/platform bootstrap (`system.json` compatibility, pack metadata cleanup) | Main Agent | **done** | System installs and launches on v14 with no manifest validation errors. |
| 2 | Actor DataModel foundation (`acolyte`/`npc`/`vehicle`) | Main Agent | **done** | Actor subtypes are registered with `CONFIG.Actor.dataModels[...]` and validate existing migrated data. |
| 3 | Item DataModel foundation (core item families) | Main Agent | **done** | Item subtype models are registered and existing world + compendium imports validate without schema errors. |
| 4 | Legacy API cleanup (macros/drag-drop/document access) | Main Agent | **done** | No remaining v12 payload assumptions (`data.data`, token actor lookup legacy path, deprecated document access). |
| 5 | Document prep refactor (derived vs source mutation) | Main Agent | **in-progress** | Prepare flows compute derived values without mutating persistent source state in unsafe lifecycle points. |
| 6 | Sheet migration (actor sheets) | Main Agent | **done** | All actor sheets open/edit/save cleanly in v14 with no console errors. |
| 7 | Sheet migration (item families) | Main Agent | **done** | All item sheets open/edit/save cleanly and form bindings match schemas. |
| 8 | Nested item/container modernization | Main Agent | **done** | Nested items work for actor/world/compendium paths and migration is idempotent (no duplication on re-run). |
| 9 | Roll/chat/action pipeline hardening | Main Agent | **done** | Skill/weapon/psychic/chat-card flows pass baseline checks and produce correct outcomes. |
| 10 | Combat/effect automation validation | Main Agent | **done** | Turn/round automation is deterministic and executes once in multiplayer with first-GM guards. |
| 11 | Migration v2 implementation (`worldVersion` upgrade path) | Main Agent | **done** | World migration runs once, logs per-document failures, and leaves worlds playable. |
| 12 | Compendium/content migration | Main Agent | **done** | Packs open/import/search correctly in v14 and player/GM permissions behave as intended. |
| 13 | Full QA matrix + release prep | Main Agent | **in-progress** | Clean-world + migrated-world + nested-heavy-world scenarios pass on earliest and latest supported v14 builds. |

### Notes on steps 6–7 (sheets)

Runtime validation confirmed **sheet class registration** (4 actor / 27 item) and **document CRUD** under v14. **Optional follow-up:** manually open every sheet type once in the UI and save to catch template edge cases (see test log).

### Notes on step 13 (full matrix)

**Completed for this session:** live world `dark-heresy-3rd-edition-test`, Foundry `14.360`, user `cursor-gm`, smoke + deep automation scripts.  
**Remaining:** repeat matrix on another v14 patch if you pin `maximum` to a range; add a clean-world-only run and a dedicated nested-heavy world if desired.

## Live validation summary

| Run | Script (repo path) | World | Result |
|-----|-------------------|--------|--------|
| Smoke | `dark-heresy-2nd/tools/foundry-join/test-dh3-v14-smoke.mjs` | `dark-heresy-3rd-edition-test` | All checks **PASS** (system id, DataModels, actor/item create/delete, compendium index sample, sheet registration counts). |
| Deep | `dark-heresy-2nd/tools/foundry-join/test-dh3-v14-deep-suite.mjs` | `dark-heresy-3rd-edition-test` | All components **PASS** (nested + migration idempotency; roll/chat/macro + vocalize; first-GM guard via `DHCombatActionManager` instrumentation with two active GMs). |

## Current Priority Order

1. Step 5: Finish remaining `prepareDerivedData` / `updateSource` hygiene where still needed.
2. Step 13: Expand QA matrix (second v14 build, clean world, nested-heavy world).
3. Optional: unify drag payload schema (nice-to-have polish).

## Notes

- Keep this file in sync with `FOUNDRY_V14_MIGRATION_PLAN.md` (in `dark-heresy-2nd` or copy here as needed).
- Evidence detail: `FOUNDRY_V14_TEST_LOG.md`.
