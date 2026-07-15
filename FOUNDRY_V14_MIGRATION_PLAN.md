# Dark Heresy 2e -> Foundry V14 Migration Plan

## Goal

Upgrade `dark-heresy-3rd-edition` from Foundry v12 compatibility to a stable, playable v14 release without breaking existing worlds, actors, items, nested item data, or compendium workflows.

## Current Baseline (Observed)

- System manifest targets v12 (`minimum: 12`, `verified: 12.331`, `maximum: 12`).
- Data model is template-driven (`template.json`) with custom `Actor`/`Item` document classes and many item subtypes.
- Core gameplay logic is tightly coupled to:
  - Chat card actions and roll pipelines
  - Combat hooks and active-effect processing
  - Nested item container behavior
  - World migration setting/version flow (`world-version`)
- Compendia are `.db` packs with system-specific references.

## Migration Strategy

Use a phased migration with compatibility checkpoints. Do not attempt a single-step rewrite.

1. **Stabilize and test current behavior on v12/v13 sandbox**
2. **Introduce v14 data model architecture behind compatibility adapters**
3. **Migrate templates/documents/sheets incrementally by document type**
4. **Migrate content and pack format**
5. **Run full gameplay regression and release as v14**

---

## Phase 0 - Preparation and Safety Nets

### Deliverables

- Branch dedicated to v14 migration.
- Baseline smoke test checklist for current v12 behavior.
- Backup/export scripts for worlds and compendia.

### Tasks

- Freeze feature work except migration-critical bug fixes.
- Build a regression checklist covering:
  - Actor creation/edit (acolyte, npc, vehicle)
  - Item create/edit/equip/consume/container nesting
  - Core rolls (skill/weapon/psychic)
  - Damage assignment, fate reroll/refund, active effects
  - Compendium drag/drop and ownership behavior
- Capture baseline video/log output for comparison.

### Exit Criteria

- Baseline checklist reproducible and documented.
- Recovery path proven (world backup restore + pack restore).

---

## Phase 1 - Manifest and Platform Compatibility Setup

### Deliverables

- Updated `system.json` for v14 target builds.
- Explicit compatibility policy (`minimum`, `verified`, optional `maximum`).

### Tasks

- Update metadata fields:
  - `compatibility.minimum` -> `14`
  - `compatibility.verified` -> tested v14 build (pin after testing)
  - `compatibility.maximum` only if validated
- Verify `id`, folder name, and package URLs stay consistent and stable.
- Confirm module/style entrypoints exist and load in v14.

### Exit Criteria

- System installs/loads in Foundry v14 with no metadata validation errors.

---

## Phase 2 - Data Model Modernization (Highest Risk)

### Deliverables

- `TypeDataModel` classes for actor and item subtypes.
- Registration of data models under `CONFIG.<Document>.dataModels`.
- Migration map from `template.json` fields to model schema.

### Tasks

- Inventory actor and item subtype schemas currently in `template.json`.
- Define model classes for each major subtype family first:
  - Actors: `acolyte`, `npc`, `vehicle`
  - Items: `weapon`, `ammunition`, `armour`, `psychicPower`, `talent`, etc.
- Implement `defineSchema()` with:
  - explicit field types
  - defaults
  - nullable/required rules
  - option bounds/enums where needed
- Add `htmlFields`/`filePathFields` declarations where rich text or media paths are used.
- Implement `migrateData` transforms for renamed/moved fields.

### Exit Criteria

- New/edited documents validate cleanly in v14.
- Existing v12/v13-origin world data loads through migrations.

---

## Phase 3 - Document Class and Sheet Refactor

### Deliverables

- Updated custom actor/item document logic aligned with v14 lifecycle assumptions.
- Updated sheet classes/templates for any v14 API or rendering changes.

### Tasks

- Review and patch document methods that mutate `system` directly during prep.
- Replace fragile assumptions with model-aware getters and derived prep methods.
- Audit all sheet event bindings and drag/drop handlers for v14 behavior changes.
- Ensure `ActorProxy`/document class dispatch remains valid in v14.

### Exit Criteria

- No runtime errors when opening/editing all actor/item sheets.
- Derived fields (characteristics, movement, ammo, etc.) compute correctly.

---

## Phase 4 - Roll/Chat/Action Pipeline Migration

### Deliverables

- v14-compatible action pipeline for simple, weapon, and psychic flows.
- Updated chat card controls and permissions behavior.

### Tasks

- Validate roll evaluation/rendering APIs (`Roll.evaluate`, render, chat posting).
- Verify `fromUuid`, token targeting, chat message hooks, and click handlers in v14.
- Retest:
  - jams/overheats
  - suppressing fire
  - knockdown/stun/feint
  - perils/opposed tests
  - resource use/refund
- Normalize async flow and state storage (`storedRolls`) for reliability.

### Exit Criteria

- End-to-end action flows produce correct chat output and mechanical outcomes.

---

## Phase 5 - Effects, Combat, and Automation

### Deliverables

- Reliable combat turn/round effect processing in v14.
- Verified active effect hooks and condition automation.

### Tasks

- Revalidate `combatTurn`/`combatRound` hooks and payload shape.
- Re-check first-GM execution guard logic.
- Confirm burning/bleeding automation remains deterministic and single-execution.

### Exit Criteria

- Combat automation behaves identically (or documented improvements) vs baseline.

---

## Phase 6 - Compendium and Content Migration

### Deliverables

- Packs migrated to current Foundry-supported format/workflow.
- Content references updated and validated.

### Tasks

- Convert legacy `.db` packs if required by target v14 workflow.
- Verify all pack metadata references system id correctly.
- Reindex and test:
  - drag/drop from packs
  - nested items from compendium sources
  - ownership/permissions behavior
- Remove one-off migration hacks only after replacement path is proven.

### Exit Criteria

- All packs open, search, and import cleanly in v14.

---

## Phase 7 - World Migration Version 2.0

### Deliverables

- New migration version constant and upgrade routines for v14 schema.
- Release notes for users with explicit migration caveats.

### Tasks

- Add a new migration step set beyond current `worldVersion` logic.
- Include idempotent actor/item migration routines.
- Log and isolate migration failures per document without aborting full run.
- Provide user-visible release notes and post-migration verification guidance.

### Exit Criteria

- Existing worlds upgrade once, safely, and remain playable.

---

## Phase 8 - QA, Performance, and Release

### Deliverables

- Full regression report against baseline checklist.
- Release candidate and final v14 release package.

### Tasks

- Execute regression on:
  - clean world
  - mature migrated world
  - mixed permissions multiplayer session
- Measure and address obvious performance regressions (sheet open, roll latency, migration duration).
- Finalize versioning and changelog.

### Exit Criteria

- No critical/high blockers.
- Compatibility field values accurately reflect tested builds.
- Release package published with rollback instructions.

---

## Work Breakdown (Suggested Order)

1. Manifest compatibility update + boot validation
2. Actor model classes + migration
3. Item model classes + migration
4. Sheet refactor per actor type
5. Sheet refactor per item family
6. Roll/action pipeline hardening
7. Active effects + combat hooks
8. Compendium conversion and validation
9. Final regression + release

## Risk Register

- **High:** Data model migration from `template.json` to v14 model patterns may break existing worlds.
- **High:** Nested item behavior and compendium coupling can regress silently.
- **Medium:** Chat card control handlers may break due to subtle hook/DOM timing changes.
- **Medium:** Migration scripts may be non-idempotent without guard logic.

## Required Test Matrix

- Foundry builds: earliest supported v14 + latest stable v14
- World states:
  - new world
  - old world with legacy actors/items
  - heavily customized world with nested items
- User roles: GM and Player
- Feature areas: sheets, rolls, damage, effects, pack imports, tours/settings

## Definition of Done

- System runs on v14 with validated manifest metadata.
- Existing worlds migrate without data loss or major behavior regressions.
- Core gameplay loops (combat, psychic, damage, inventory, chat controls) pass regression.
- Compendium content is fully usable from packs.
- Migration/release notes and rollback guidance are documented.
