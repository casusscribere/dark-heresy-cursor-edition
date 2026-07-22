# rogue-trader-2nd test harness

This directory is shared by three Cursor agents that together drive the Foundry
v14 migration of `rogue-trader-2nd`.

| Agent | Skill path | Runs |
| --- | --- | --- |
| **Project manager** | `.cursor/skills/foundry-project-manager/SKILL.md` | Orchestrates code + player agents; writes aggregated PM reports. |
| **Player** | `.cursor/skills/foundry-player-tester/SKILL.md` | Playwright player-action scripts (`.rt2e`), Quench, static packs. |
| **Code** | `.cursor/skills/foundry-code-tester/SKILL.md` | Vitest unit tests against `module/**/*.mjs` with mocked Foundry globals. |

Start a full validation cycle with the **project manager** (`@foundry-project-manager`
or ask for the "PM agent"). It delegates to the code and player agents and
documents their changes in `tests/PROJECT_REPORT_<date>_pm.md`.

The code and player agents are deliberately decoupled but share three artefacts:

1. **The test pyramid layout** below.
2. **`tests/REPORT_TEMPLATE.md`** - both agents fill this in when they finish a
   run so the other agent (and the human GM) can pick up where they left off.
3. **The migration checklist** at
   `CURSOR_DOCS/rogue_trader_2e/dark-heresy-2nd/FOUNDRY_V14_MIGRATION_CHECKLIST.md`.
   Every test added by either agent must reference the checklist step it
   defends.

## Layout

```
tests/
  README.md                 - this file
  REPORT_TEMPLATE.md        - shared run report contract (code + player)
  PROJECT_REPORT_TEMPLATE.md - PM aggregation contract
  static/
    validate-packs.mjs      - cheapest layer: lint .db files for v14 readiness
  unit/                     - code-side: Vitest, Node-only
    mocks/foundry.mjs       - minimal Foundry globals
    roll-helpers.test.mjs   - seed suite
    migrations.test.mjs     - migration pure-logic suite
  player/                   - player agent: login + UI workflow scripts
    grammar.ebnf            - formal grammar
    parser.mjs              - script parser
    run.mjs                 - Playwright runner CLI
    scenarios/smoke.rt2e    - default smoke workflow
    output/                 - JSON run reports (gitignored artefacts)
  quench/                   - player-side: in-Foundry document API batches
    index.mjs
    packs.test.mjs
    migration.test.mjs
    data-models.test.mjs
```

## The pyramid

```
   ^ slow / high signal
   |
   | [4] Quench in-Foundry suite           <- document API checks
   | [3] Player-action scripts (.rt2e)     <- login, sheets, gear, stats
   | [2] Vitest module suite               <- code agent
   | [1] Static pack/manifest validator    <- nearly free
   v fast / cheap
```

Pass layers in order. When layer (3) or (4) finds a regression, the code agent
backfills layer (2) where possible.

## How to run

### Layer 1 - static
```
node tests/static/validate-packs.mjs
```
Or `npm run test:static` once `npm install` has been run.

### Layer 2 - code-side unit tests
```
npm install            # one-time, installs vitest
npm test               # single run
npm run test:watch     # iterate
npm run test:coverage  # coverage report
```
The Vitest JSON report lands at `tests/.vitest-report.json` and is the canonical
machine-readable input for the **Code** agent's report.

### Layer 3 - player-action scripts

Requires Foundry running locally.

```
npm install
npx playwright install chromium
$env:FOUNDRY_URL = "http://localhost:30000"   # PowerShell
npm run test:player
```

Edit `tests/player/scenarios/smoke.rt2e` or add scenarios. Grammar:
`tests/player/grammar.ebnf` and `.cursor/skills/foundry-player-tester/reference/player-action-grammar.md`.

JSON reports land in `tests/player/output/`.

Parse-only (no Foundry): `npm run test:player:parse`

### Layer 4 - player-side Quench suite
1. Install the **Quench** module
   (https://github.com/Ethaks/FVTT-Quench) and enable it in the test world.
2. Load the registration entry point. The cheapest path is a one-line dev
   module that re-exports it, or pasting this into the Foundry console once
   the world is up:
   ```js
   import('/systems/rogue-trader-2nd/tests/quench/index.mjs');
   ```
3. Open Quench (sidebar -> Game Settings -> Quench) and click **Run All**.
4. In the console:
   ```js
   copy(JSON.stringify(window.__rt2ePlayerReport, null, 2));
   ```
   Paste the blob into the player agent's chat. It is the canonical
   machine-readable input for the **Player** agent's report.

## Hand-off contract

When either agent finishes a meaningful run it MUST:

1. Save a filled-out copy of `REPORT_TEMPLATE.md` next to this README,
   timestamped (`REPORT_2026-05-13_player.md`, `REPORT_2026-05-13_code.md`).
2. List, by checklist step number, every regression it opened.
3. Reference the failing test path so the *other* agent can drive a fix.

This is the handshake between **code** and **player**; they never call each
other directly. The **project manager** reads both reports and writes
`PROJECT_REPORT_<date>_pm.md` using `PROJECT_REPORT_TEMPLATE.md`. Agent roster
and onboarding: `.cursor/skills/foundry-project-manager/reference/agents-registry.md`.
