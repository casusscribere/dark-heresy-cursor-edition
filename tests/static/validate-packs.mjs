#!/usr/bin/env node
/**
 * Static pack validator for the rogue-trader-2nd Foundry system.
 *
 * Reads every line-delimited NeDB `.db` file declared in `system.json`,
 * decodes each document, and flags anything that will block or degrade the
 * Foundry v14 migration. No Foundry runtime is required; this is the cheapest
 * feedback layer in the test pyramid and is intended to run on every commit.
 *
 * Run as:    node tests/static/validate-packs.mjs
 *      or:   npm run test:static
 *
 * Exits non-zero if any document fails a required check.
 */

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const systemRoot = resolve(here, '..', '..');
const manifestPath = resolve(systemRoot, 'system.json');

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const declaredSystemId = manifest.id;

const findings = [];
function flag(severity, packName, docId, message) {
    findings.push({ severity, packName, docId, message });
}

for (const pack of manifest.packs ?? []) {
    const packPath = resolve(systemRoot, pack.path);
    let raw;
    try {
        raw = readFileSync(packPath, 'utf8');
    } catch (e) {
        flag('error', pack.name, '-', `cannot read pack file: ${e.message}`);
        continue;
    }

    const lines = raw.split(/\r?\n/).filter((l) => l.length > 0);
    for (const [i, line] of lines.entries()) {
        let doc;
        try {
            doc = JSON.parse(line);
        } catch (e) {
            flag('error', pack.name, `line:${i + 1}`, `invalid JSON: ${e.message}`);
            continue;
        }

        const id = doc._id ?? `line:${i + 1}`;

        if (!doc.name) flag('error', pack.name, id, 'missing name');
        if (!doc._id) flag('error', pack.name, id, 'missing _id');
        if (pack.type === 'Item' && !doc.type)
            flag('error', pack.name, id, 'item missing subtype `type`');

        if ('data' in doc && !('system' in doc))
            flag(
                'warn',
                pack.name,
                id,
                'document uses legacy `data` key instead of `system` (v14 migration target)',
            );

        if (typeof doc.img === 'string' && doc.img.includes('/systems/')) {
            const refMatch = doc.img.match(/\/systems\/([^/]+)\//);
            if (refMatch && refMatch[1] !== declaredSystemId)
                flag(
                    'warn',
                    pack.name,
                    id,
                    `img references foreign system "${refMatch[1]}" (expected "${declaredSystemId}")`,
                );
        }
    }
}

const errors = findings.filter((f) => f.severity === 'error');
const warnings = findings.filter((f) => f.severity === 'warn');

for (const f of findings) {
    const sev = f.severity.toUpperCase().padEnd(5);
    console.log(`${sev}  [${f.packName}/${f.docId}] ${f.message}`);
}

console.log('');
console.log(`Summary: ${errors.length} error(s), ${warnings.length} warning(s)`);

if (errors.length > 0) process.exit(1);
process.exit(0);
