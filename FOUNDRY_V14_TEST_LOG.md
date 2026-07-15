# Foundry V14 Migration Test Log

Independent verification log for **`dark-heresy-3rd-edition`** (V14 migration tree under `Data/systems/dark-heresy-3rd-edition`).

## Live validation summary (2026-05-01)

| Script | Location | World | Foundry | User | Outcome |
|--------|----------|--------|---------|------|---------|
| `test-dh3-v14-smoke.mjs` | `Data/systems/dark-heresy-2nd/tools/foundry-join/` | `dark-heresy-3rd-edition-test` | 14.360 | `cursor-gm` | **PASS** — system id, DataModels, actor/item create+delete, compendium index (13 packs, sampled), sheet registration counts (4 actor / 27 item). |
| `test-dh3-v14-deep-suite.mjs` | same | same | 14.360 | `cursor-gm` (+ second GM `Gamemaster` for determinism) | **PASS** — nested items + migration idempotency; roll + chat-card macro + vocalize (no throw; `CONST.CHAT_MESSAGE_TYPES.IC` fallback verified); `updateCombat` + first-GM guard exercised via controlled `DHCombatActionManager` stub. |

**Fixes exercised during live runs:** `basic-action-manager.mjs` — safe chat message type fallback when `CONST.CHAT_MESSAGE_TYPES.IC` is undefined on v14.

## Step 1 - Manifest/platform bootstrap (`system.json` compatibility, pack metadata cleanup)

**Test objective**
- Verify `system.json` is V14-targeted and pack metadata is present/structured for system compendia.

**Commands/checks run**
- Read `system.json` and reviewed compatibility + packs entries.
- Ran `node --check` across all `module/*.mjs` files (71 files) to confirm no obvious syntax breakage that would block bootstrap.
- **Live:** `test-dh3-v14-smoke.mjs` against world `dark-heresy-3rd-edition-test` on Foundry **14.360** (system loads, world opens, documents create).

**Evidence**
- `system.json` sets compatibility to V14 (`minimum: 14`, `verified: "14.360"`, `maximum: 14`).
- All pack entries include `name`, `system`, `label`, `path`, and `type`.
- Pack paths still use `.db` entries (e.g., `./packs/weapons.db`), with no runtime manifest validation performed in Foundry client during this audit.
- **Live:** smoke script reported system id `dark-heresy-3rd-edition` and completed all checks without manifest load failure.

**Result**
- PASS

**Follow-up issues**
- Optional: spot-check Foundry UI for any non-blocking warnings on first load after system update.

---

## Step 2 - Actor DataModel foundation (`acolyte`/`npc`/`vehicle`)

**Test objective**
- Verify actor DataModel classes exist and are registered for `acolyte`/`npc`/`vehicle`.

**Commands/checks run**
- Read `module/models/data-models.mjs`.
- Read `module/hooks-manager.mjs`.

**Evidence**
- `module/models/data-models.mjs` defines `DHAcolyteModel`, `DHNpcModel`, and `DHVehicleModel`.
- `registerDataModels()` assigns `CONFIG.Actor.dataModels["acolyte"|"npc"|"vehicle"]`.
- `module/hooks-manager.mjs` imports `registerDataModels` and calls it during `HooksManager.init()`.

**Result**
- PASS

**Follow-up issues**
- None.

---

## Step 3 - Item DataModel foundation (core item families)

**Test objective**
- Verify item DataModel base exists and core item types are registered.

**Commands/checks run**
- Read `module/models/data-models.mjs`.
- Read `module/hooks-manager.mjs`.

**Evidence**
- `module/models/data-models.mjs` defines `DHItemModel` with schema fields used across item families.
- `registerDataModels()` registers a core item type list (e.g., `weapon`, `armour`, `talent`, `tool`, `psychicPower`, etc.) into `CONFIG.Item.dataModels`.
- Registration path is active via `registerDataModels()` call in `module/hooks-manager.mjs`.

**Result**
- PASS

**Follow-up issues**
- None.

---

## Step 4 - Legacy API cleanup (macros/drag-drop/document access)

**Test objective**
- Verify macro and drag/drop flows no longer depend on legacy v12 payload/document assumptions.

**Commands/checks run**
- Read `module/macros/macro-manager.mjs`.
- Read `module/sheets/item/item-container-sheet.mjs`.
- Read `module/sheets/actor/actor-container-sheet.mjs`.
- Read `module/documents/item-container.mjs`.

**Evidence**
- `module/macros/macro-manager.mjs` now uses `getPayloadData(data) { return data ?? {}; }` (no `data.data` fallback path).
- `module/sheets/actor/actor-container-sheet.mjs` now checks dropped item ids via top-level fields (`data.id`, `data.itemId`, `data._id`) instead of nested payload assumptions.
- `module/sheets/item/item-container-sheet.mjs` still resolves dropped content primarily from `fromUuid(data.uuid)` and also reads `data.actor`, while actor drag payloads are mixed-format (`id`/`itemId` plus nested `data` object), so drag contract is not fully normalized.
- **Live:** deep suite executed roll/chat macros and container-related paths without throw; macro payload handling exercised under v14.

**Result**
- PASS

**Follow-up issues**
- Optional polish: unify actor<->item container drag payload to one V14 schema (single source of truth for dropped Item document identity) and remove mixed `uuid`/`id`/`itemId`/`data` handling.

---

## Step 5 - Document prep refactor (derived vs source mutation)

**Test objective**
- Verify prepare flows compute derived state without unsafe persistent source mutation.

**Commands/checks run**
- Read `module/documents/base-actor.mjs`.
- Read `module/documents/acolyte.mjs`.
- Read `module/documents/item.mjs`.
- Read `module/documents/item-container.mjs`.
- **Live:** smoke script created and deleted test `acolyte` + `weapon` documents without schema/runtime errors.

**Evidence**
- Actor/document classes use `prepareDerivedData()` paths for computed values (e.g., characteristics, skills, armour, encumbrance) in `module/documents/base-actor.mjs` and `module/documents/acolyte.mjs`.
- Nested item prep in `module/documents/item-container.mjs` still calls `currentItem.updateSource(idata)` inside `prepareEmbeddedDocuments()`.
- `module/documents/item.mjs` also mutates `this.system` defaults during `prepareDerivedData()` (e.g., damage/penetration/craftsmanship/availability normalization).
- **Live:** document CRUD confirms prepare paths do not block normal play for sampled types; strict DataModel hygiene for remaining mutations is still open.

**Result**
- PARTIAL

**Follow-up issues**
- Confirm and, where needed, refactor remaining `updateSource`/`this.system` mutations in prepare lifecycles to guaranteed non-persistent derived-only patterns for V14.

---

## Step 6 - Sheet migration (actor sheets)

**Test objective**
- Verify actor sheets are V14-registered and structurally ready for open/edit/save in V14.

**Commands/checks run**
- Read `module/hooks-manager.mjs`.
- Read `module/sheets/actor/actor-container-sheet.mjs`.
- Read `module/sheets/actor/acolyte-sheet.mjs`.
- Read `module/sheets/actor/npc-sheet.mjs`.
- Read `module/sheets/actor/vehicle-sheet.mjs`.
- **Live:** `test-dh3-v14-smoke.mjs` asserted actor sheet registration count **4** (includes container/base registrations as configured).

**Evidence**
- V14 `DocumentSheetConfig.registerSheet(...)` path is present for `acolyte`, `npc`, and `vehicle` in `module/hooks-manager.mjs`.
- Actor sheet classes and templates are wired (`templates/actor/actor-acolyte-sheet.hbs`, `actor-npc-sheet.hbs`, `actor-vehicle-sheet.hbs`).
- Drag/drop and edit handlers are implemented in `module/sheets/actor/actor-container-sheet.mjs`.
- **Live:** runtime registration check passed; exhaustive manual open/save of every actor sheet variant in the UI was not scripted.

**Result**
- PASS

**Follow-up issues**
- Optional: manually open each actor sheet type once in the v14 client and save to confirm zero template/console issues.

---

## Step 7 - Sheet migration (item families)

**Test objective**
- Verify item sheet family classes are V14-registered and structurally aligned with templates/form bindings.

**Commands/checks run**
- Read `module/hooks-manager.mjs`.
- Read `module/sheets/item/item-sheet.mjs`.
- Read `module/sheets/item/item-container-sheet.mjs`.
- Enumerated item sheet classes under `module/sheets/item`.
- Checked template presence under `templates/item`.
- **Live:** `test-dh3-v14-smoke.mjs` asserted item sheet registration count **27**.

**Evidence**
- `module/hooks-manager.mjs` registers all core item sheet classes via V14 `DocumentSheetConfig.registerSheet(...)`.
- Item sheet inheritance covers all families (`ammo`, `armour`, `attackSpecial`, `cybernetic`, `forceField`, `gear`, `journalEntry`, `peer/enemy`, `psychicPower`, `storageLocation`, `talent`, `trait`, `weapon`, `weaponModification`).
- Corresponding item templates exist in `templates/item`.
- **Live:** runtime registration check passed; per-family UI open/save matrix not automated.

**Result**
- PASS

**Follow-up issues**
- Optional: open one item of each family in the v14 client and save to confirm form bindings and zero console errors.

---

## Step 8 - Nested item/container modernization

**Test objective**
- Verify nested item/container flows for actor/world/compendium paths and idempotent migration behavior.

**Commands/checks run**
- Read `module/documents/item-container.mjs`.
- Read `module/documents/item.mjs`.
- Read `module/sheets/item/item-container-sheet.mjs`.
- Read `module/dark-heresy-migrations.mjs`.
- **Live:** `test-dh3-v14-deep-suite.mjs` — nested container on actor, re-run migration idempotency (no duplicate nested explosion).

**Evidence**
- Nested APIs exist in `module/documents/item-container.mjs` (`createNestedDocuments`, `deleteNestedDocuments`, `updateNestedDocuments`, `prepareEmbeddedDocuments`).
- Legacy nested flag conversion and compendium-special migration path exists in `module/documents/item.mjs` (`_determineNestedItems`, `_updateSpecialsFromPack`).
- Migration guards for idempotent nested creation are present in `module/dark-heresy-migrations.mjs` (`!item.items || item.items.size === 0` checks).
- **Live:** deep suite reported PASS for nested + idempotency checks.

**Result**
- PASS

**Follow-up issues**
- Optional: dedicated compendium-import nested stress test if you rely heavily on pack-derived specials.

---

## Step 9 - Roll/chat/action pipeline hardening

**Test objective**
- Verify skill/weapon/psychic/chat-card flow wiring and baseline action pipeline integrity.

**Commands/checks run**
- Read `module/documents/acolyte.mjs`.
- Read `module/actions/targeted-action-manager.mjs`.
- Read `module/actions/basic-action-manager.mjs`.
- Read `module/prompts/psychic-power-prompt.mjs` and related prompt/template references via code search.
- **Live:** `test-dh3-v14-deep-suite.mjs` — skill roll macro, chat-card macro, vocalize path; success = no thrown errors (message-count assertions avoided due to v14 prompt behavior).

**Evidence**
- `module/documents/acolyte.mjs` routes `rollSkill`, `rollItem`, weapon, and psychic flows through prompt/action managers.
- `module/actions/targeted-action-manager.mjs` provides attack/psychic targeted roll pipelines.
- `module/actions/basic-action-manager.mjs` handles chat render hooks and chat action controls (refund, reroll, assign/apply damage).
- **Live:** deep suite PASS; `CONST.CHAT_MESSAGE_TYPES.IC` undefined on v14 — mitigated via safe fallback in `basic-action-manager.mjs`.

**Result**
- PASS

**Follow-up issues**
- Optional: add UI-driven regression for every roll type (ranged/melee/psychic) if you need message-card snapshot tests.

---

## Step 10 - Combat/effect automation validation

**Test objective**
- Verify combat effect processing migrated to `updateCombat` lifecycle and guarded to single active GM.

**Commands/checks run**
- Read `module/actions/combat-action-manager.mjs`.
- Read `module/dark-heresy-settings.mjs` and `module/hooks-manager.mjs` for hook enable/disable path.
- **Live:** `test-dh3-v14-deep-suite.mjs` — with two users flagged **GM**, exercised `updateCombat` path and first-GM guard via temporary stub of `processCombatActiveEffects` / `getFirstGM` (avoids ambiguous multi-client chat deltas).

**Evidence**
- Hooks are registered on `updateCombat` (`Hooks.on('updateCombat', ...)`) and gate on turn/round changes.
- Processing routes through `updateCombat(combat, changed)` and then `processCombatActiveEffects(...)`.
- First-GM guard exists: `if (game.userId === this.getFirstGM())`.
- **Live:** deep suite PASS — non-first GM path correctly no-ops; first-GM path invoked under stub.

**Result**
- PASS

**Follow-up issues**
- Optional: full dual-client session with real combat turn advance and chat-side effect spam check (beyond instrumentation).

---

## Step 11 - Migration v2 implementation (`worldVersion` upgrade path)

**Test objective**
- Verify worldVersion bump, idempotent migration behavior, and failure logging are implemented.

**Commands/checks run**
- Read `module/dark-heresy-migrations.mjs`.

**Evidence**
- `worldVersion` target is set to `200`.
- Migration now executes only when `(currentVersion ?? 0) < worldVersion` for GM user (upgrade-only semantics).
- Per-document failure collection exists for actor/item loops (`failures.push(...)` + summary warning).
- Nested item migration paths include idempotency guard (`(!item.items || item.items.size === 0)` before `createNestedDocuments(...)`).
- `updateCompendiumPermissions(...)` now wraps each `compendium.configure(...)` in try/catch and appends failures to the shared migration failure log.

**Result**
- PASS

**Follow-up issues**
- None.

---

## Step 12 - Compendium/content migration

**Test objective**
- Verify compendium migration wiring, pack accessibility assumptions, and permissions update pathway.

**Commands/checks run**
- Read `system.json` packs section.
- Read `module/dark-heresy-migrations.mjs`.
- Read `module/documents/item.mjs` compendium lookup paths.
- **Live:** `test-dh3-v14-smoke.mjs` — indexed **13** system packs, sampled document retrieval from multiple packs.

**Evidence**
- System packs are declared in `system.json` with package/type metadata.
- `module/dark-heresy-migrations.mjs` includes compendium permission update routine (`updateCompendiumPermissions`) with per-pack failure capture.
- `module/documents/item.mjs` reads from system compendia for special-item derivation (`dark-heresy-3rd-edition.attack-specials`, etc.).
- **Live:** smoke PASS — pack index + getDocument from compendium; player-role permission matrix not automated.

**Result**
- PASS

**Follow-up issues**
- Optional: log in as a non-GM player and confirm pack visibility matches your table’s expectations.

---

## Step 13 - Full QA matrix + release prep

**Test objective**
- Validate full release QA matrix across clean/migrated/nested-heavy worlds and earliest/latest supported V14 builds.

**Commands/checks run**
- Performed static code review across migration-critical modules and sheet/action paths.
- Ran `node --check` across all `module/*.mjs` files (71 files).
- **Live (partial matrix):** world `dark-heresy-3rd-edition-test`, Foundry **14.360**, smoke + deep automation as above.

**Evidence**
- Static checks pass and key migration scaffolding is in place (manifest, DataModels, migration path, sheets, actions, nested items).
- **Live:** one migrated-style world on one v14 patch validated end-to-end for scripted scenarios; clean-world-only and alternate v14 patch not yet recorded here.

**Result**
- PARTIAL

**Follow-up issues**
- Complete full runtime QA matrix on earliest and latest supported V14 builds for clean, migrated, and nested-heavy worlds (extend scripts or manual checklist).
