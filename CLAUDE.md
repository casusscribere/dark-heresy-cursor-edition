# dark-heresy-3rd-edition — Foundry v14 system (agent orientation)

(`AGENTS.md` mirrors this file.)

## What this is

A Foundry VTT **system** (`id: dark-heresy-3rd-edition`, v1.8.1 lineage of the DH2 community system),
migrated to Foundry v14 by Cursor in early 2026 and live-validated on 14.360 (2026-05-01 — see
`FOUNDRY_V14_TEST_LOG.md`). It lives inside the live Foundry install
(`FoundryVTT\Data\systems\`), so **edits here are live** the next time Foundry loads the world.

## Status & standing intent (2026-07-22)

- Migration checklist (`FOUNDRY_V14_MIGRATION_CHECKLIST.md`): steps 1–4 and 6–12 done; **step 5
  (document-prep refactor: derived vs source mutation) and step 13 (full QA matrix) remain
  in-progress**.
- Own `README.md`: "Likely defunct; will replace with a more careful Fable-based build." So: this
  system is (a) the **live deploy target** for `dh2_roll_api`'s Lane C (module deploys via its
  `npm run deploy:foundry` + Playwright join-harness), and (b) a **reference implementation** whose
  rules seams (`module/rules/attack-specials.mjs`, `critical-damage.mjs`, …) dh2_roll_api ported. Large
  new feature investment here is questionable — check with the user before starting any.
- Git initialized 2026-07-15 (3 commits). **No remote — push one before anything else.** LevelDB pack
  runtime files (`packs/*/LOG*`, `CURRENT`, `MANIFEST-*`, `*.log`) churn on every Foundry launch and
  pollute `git status`; add a `.gitignore` policy for them (see
  `AI_available_materials/docs/handoff_2026-07-22/04_WSL_TRANSFER_RECOMMENDATIONS.md` §0).

## Map

- `module/` — system code (data models, sheets, rolls, rules, migrations, macros, hooks).
- `packs/` — compendia, in BOTH legacy NeDB `.db` files and compiled LevelDB directories.
- `template.json`, `system.json` — Foundry manifest/schema (v14 compatibility pinned).
- `docs/` — `CONTENT_INDEX_VTT_REFERENCE.md` + content-index JSON maps (ties to the campaign Content
  Index imported into the DH2 corpus 2026-07-10 as `integrated_homebrew/data/content_index/`).
- `tools/foundry-join/` — Playwright harness that joins a running Foundry and runs in-page assertions;
  `tools/build-content-index-map.cjs`.
- `FOUNDRY_V14_MIGRATION_PLAN.md` / `_CHECKLIST.md` / `_TEST_LOG.md` — the migration record.

## Related trees (different roots — don't confuse them)

- `AI_available_materials/tools/dh2_roll_api/foundry/dh2-roll-vm/` — the roll-engine **module**
  deployed INTO this install.
- `AI_available_materials/codified-systems/dark_heresy_2e/foundry-module/` — an older NeDB compendium
  module built from the codified corpus (pre-v14).
- Sibling systems in the same install (per dh2_roll_api's `FOUNDRY_MIGRATION.md`): `dark-heresy-2nd`
  (v12 original) and `rogue-trader-2nd` (v12; the Phase-7 RT target).
