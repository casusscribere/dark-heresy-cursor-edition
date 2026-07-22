#!/usr/bin/env node
/**
 * CLI entry: run an RT2E player action script against a live Foundry instance.
 *
 *   node tests/player/run.mjs tests/player/scenarios/smoke.rt2e
 *
 * Environment (or tests/player/.env):
 *   FOUNDRY_URL       - default http://localhost:30000
 *   FOUNDRY_HEADLESS  - true|false (default true)
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { executeScript } from './executor.mjs';
import { loadPlayerEnvFile } from './load-env.mjs';
import { injectSessionCredentials, resolvePlayerConfig } from './config.mjs';

const here = dirname(fileURLToPath(import.meta.url));

loadPlayerEnvFile();
const playerConfig = resolvePlayerConfig();

const scriptArg = process.argv[2] ?? resolve(here, 'scenarios', 'smoke.rt2e');
const scriptPath = resolve(process.cwd(), scriptArg);
const baseUrl = playerConfig.baseUrl;
const headless = playerConfig.headless;

const rawScript = readFileSync(scriptPath, 'utf8');
const scriptSource = injectSessionCredentials(rawScript, playerConfig);

const outputDir = resolve(here, 'output');
mkdirSync(outputDir, { recursive: true });

const browser = await chromium.launch({ headless });
try {
    const report = await executeScript({
        scriptPath,
        scriptSource,
        baseUrl,
        browser,
        headless,
        playerConfig,
    });
    const outPath = resolve(outputDir, `player-run-${Date.now()}.json`);
    writeFileSync(outPath, JSON.stringify(report, null, 2));

    console.log(`User: ${playerConfig.user} (password ${playerConfig.password === '' ? 'blank' : 'set'})`);
    console.log(`World: ${playerConfig.world} @ ${baseUrl}`);
    console.log(`Report: ${outPath}`);
    console.log(`Result: ${report.ok ? 'PASS' : 'FAIL'}`);
    console.log(`Steps: ${report.summary.passed} passed, ${report.summary.failed} failed`);

    if (!report.ok) {
        if (report.phase === 'parse') {
            for (const e of report.errors ?? []) {
                console.error(`  line ${e.line}: ${e.message}`);
            }
        } else {
            const fail = report.steps.find((s) => !s.ok);
            if (fail) console.error(`  line ${fail.line} ${fail.verb}: ${fail.error}`);
        }
        process.exit(1);
    }
} finally {
    await browser.close();
}
