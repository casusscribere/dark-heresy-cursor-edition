/**
 * Executes parsed RT2E player action scripts against a live Foundry instance.
 */

import { readFileSync } from 'node:fs';
import { parseScript, validateCommands } from './parser.mjs';
import { createContext, resolveActorRef, resolveItemRef } from './context.mjs';
import * as browser from './handlers/browser.mjs';
import { runFoundryCommand } from './handlers/foundry.mjs';

const BROWSER_VERBS = new Set(['LOGIN', 'ENTER_WORLD', 'WAIT_READY', 'SCREENSHOT']);
const FOUNDRY_VERBS = new Set([
    'CREATE_CHARACTER',
    'OPEN_SHEET',
    'CLOSE_SHEET',
    'CREATE_ITEM',
    'EQUIP',
    'MODIFY_GEAR',
    'SET_STAT',
    'ASSERT',
    'ASSERT_EXISTS',
    'DELETE_ACTOR',
    'DELETE_ITEM',
]);

/**
 * @param {import('playwright').Page} page
 * @param {object} cmd
 * @param {ReturnType<typeof createContext>} ctx
 */
async function executeCommand(page, cmd, ctx) {
    const started = Date.now();
    /** @type {object} */
    let data = null;

    if (cmd.verb === 'LOGIN') {
        await browser.login(page, cmd.args);
    } else if (cmd.verb === 'ENTER_WORLD') {
        await browser.enterWorld(page, cmd.args);
    } else if (cmd.verb === 'WAIT_READY') {
        await browser.waitReady(page, cmd.args);
    } else if (cmd.verb === 'SCREENSHOT') {
        const label = cmd.args.label ?? 'shot';
        const path = `tests/player/output/${label}-${Date.now()}.png`;
        await page.screenshot({ path, fullPage: true });
        data = { path };
    } else if (FOUNDRY_VERBS.has(cmd.verb)) {
        const args = { ...cmd.args };
        if (args.actor) args.actor = resolveActorRef(ctx, String(args.actor));
        if (args.item) args.item = resolveItemRef(ctx, String(args.item));
        data = await runFoundryCommand(page, ctx, { ...cmd, args });
    } else {
        throw new Error(`unsupported verb: ${cmd.verb}`);
    }

    return {
        line: cmd.line,
        verb: cmd.verb,
        ok: true,
        durationMs: Date.now() - started,
        data,
    };
}

/**
 * @param {object} options
 * @param {string} options.scriptPath
 * @param {string} options.baseUrl
 * @param {import('playwright').Browser} options.browser
 * @param {boolean} [options.headless]
 * @returns {Promise<object>}
 */
export async function executeScript(options) {
    const {
        scriptPath,
        scriptSource: providedSource,
        baseUrl,
        browser: pwBrowser,
        headless = true,
        playerConfig = null,
    } = options;

    const source = providedSource ?? readFileSync(scriptPath, 'utf8');
    const { commands, errors } = parseScript(source);
    validateCommands(commands, errors);

    if (errors.length > 0) {
        return {
            ok: false,
            scriptPath,
            phase: 'parse',
            errors,
            steps: [],
        };
    }

    const ctx = createContext();
    const page = await pwBrowser.newPage();
    const steps = [];
    const report = {
        ok: true,
        scriptPath,
        baseUrl,
        playerConfig,
        startedAt: new Date().toISOString(),
        finishedAt: null,
        steps,
        summary: { passed: 0, failed: 0 },
    };

    try {
        await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 120_000 });

        for (const cmd of commands) {
            try {
                const step = await executeCommand(page, cmd, ctx);
                steps.push(step);
                report.summary.passed++;
            } catch (e) {
                const step = {
                    line: cmd.line,
                    verb: cmd.verb,
                    ok: false,
                    error: e?.message ?? String(e),
                    raw: cmd.raw,
                };
                steps.push(step);
                report.summary.failed++;
                report.ok = false;
                break;
            }
        }
    } finally {
        report.finishedAt = new Date().toISOString();
        await page.close();
    }

    return report;
}

export { BROWSER_VERBS, FOUNDRY_VERBS };
