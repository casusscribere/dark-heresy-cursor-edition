/**
 * Quench test registration entry point for rogue-trader-2nd.
 *
 * This file is loaded by the Quench Foundry module (https://github.com/Ethaks/FVTT-Quench)
 * when it is installed and enabled in the active world. Quench exposes the
 * `quenchReady` hook on which we register every suite that the "player" agent maintains.
 *
 * To load this file in a world, add it to a small loader module or paste the
 * import into Foundry's developer console while a world is open:
 *
 *   import('/systems/dark-heresy-3rd-edition/tests/quench/index.mjs');
 *
 * Each registered suite returns a structured JSON result via `window.__rt2ePlayerReport`
 * so the player agent can ingest it without scraping DOM.
 */

import { registerPacksSuite } from './packs.test.mjs';
import { registerMigrationSuite } from './migration.test.mjs';
import { registerDataModelSuite } from './data-models.test.mjs';

const SYSTEM_ID = 'dark-heresy-3rd-edition';
const REPORT_KEY = '__rt2ePlayerReport';

function ensureReportBucket() {
    if (typeof window === 'undefined') return;
    if (!window[REPORT_KEY]) {
        window[REPORT_KEY] = {
            system: SYSTEM_ID,
            startedAt: new Date().toISOString(),
            suites: {},
            summary: { passed: 0, failed: 0, pending: 0 },
        };
    }
    return window[REPORT_KEY];
}

function recordResult(batchKey, runner) {
    const report = ensureReportBucket();
    if (!report || !runner) return;
    const stats = runner.stats ?? {};
    report.suites[batchKey] = {
        passed: stats.passes ?? 0,
        failed: stats.failures ?? 0,
        pending: stats.pending ?? 0,
        durationMs: stats.duration ?? null,
        finishedAt: new Date().toISOString(),
    };
    report.summary.passed += stats.passes ?? 0;
    report.summary.failed += stats.failures ?? 0;
    report.summary.pending += stats.pending ?? 0;
}

Hooks.on('quenchReady', (quench) => {
    registerPacksSuite(quench, { systemId: SYSTEM_ID, recordResult });
    registerMigrationSuite(quench, { systemId: SYSTEM_ID, recordResult });
    registerDataModelSuite(quench, { systemId: SYSTEM_ID, recordResult });
    console.log(`[${SYSTEM_ID}] Quench suites registered.`);
});

/**
 * Helper invoked from the developer console after `Run All` completes:
 *
 *   copy(JSON.stringify(window.__rt2ePlayerReport, null, 2));
 *
 * The player agent ingests this blob to fill in tests/REPORT_TEMPLATE.md.
 */
export function getPlayerReport() {
    if (typeof window === 'undefined') return null;
    return window[REPORT_KEY] ?? null;
}
