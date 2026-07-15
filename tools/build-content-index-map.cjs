/**
 * One-off / repeatable: reads RT_GDRIVE Content Index JSON export and maps rows to DH3 compendia.
 * Prerequisite: content-index-full.json from xlsx (see README in docs).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PACKS = path.join(ROOT, 'packs');
const CONTENT_INDEX_JSON =
    process.env.CONTENT_INDEX_JSON ||
    'C:/Users/kirkl/OneDrive/Documents/ROGUE_TRADER/AI_available_materials/RT_GDRIVE/content-index-full.json';

const PACK_FILES = {
    weapons: 'weapons.db',
    armour: 'armour.db',
    ammo: 'ammo.db',
    'weapon-mods': 'weapon-mods.db',
    'attack-specials': 'attack-specials.db',
    consumables: 'consumables.db',
    tools: 'tools.db',
    cybernetics: 'cybernetics.db',
    'psychic-powers': 'psychic-powers.db',
    talents: 'talents.db',
    traits: 'traits.db',
};

function loadPack(file) {
    const p = path.join(PACKS, file);
    if (!fs.existsSync(p)) return [];
    return fs
        .readFileSync(p, 'utf8')
        .trim()
        .split('\n')
        .filter(Boolean)
        .map((line) => JSON.parse(line));
}

function norm(s) {
    return String(s || '')
        .toLowerCase()
        .replace(/[’'"]/g, '')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
}

function loadAllCompendia() {
    const byPack = {};
    const flat = [];
    for (const [pack, file] of Object.entries(PACK_FILES)) {
        const items = loadPack(file);
        byPack[pack] = items;
        for (const it of items) {
            flat.push({
                pack,
                collection: `dark-heresy-3rd-edition.${pack.replace('psychic-powers', 'psychic-powers').replace('weapon-mods', 'weapon-mods')}`,
                name: it.name,
                id: it._id,
                type: it.type,
                nn: norm(it.name),
            });
        }
    }
    // fix collection slug to match system.json "name" field
    for (const row of flat) {
        row.collection = `dark-heresy-3rd-edition.${row.pack}`; // pack id = system.json packs[].name
    }
    return { byPack, flat };
}

function bestMatch(name, packsToSearch, flat, byPack) {
    const n = norm(name);
    if (!n) return { confidence: 'none', matches: [] };

    const candidates = flat.filter((x) => packsToSearch.includes(x.pack));
    const exact = candidates.filter((c) => c.nn === n);
    if (exact.length === 1) return { confidence: 'exact', matches: exact };
    if (exact.length > 1) return { confidence: 'exact-ambiguous', matches: exact };

    const subs = candidates.filter((c) => c.nn.includes(n) || n.includes(c.nn));
    const good = subs.filter((c) => Math.min(c.nn.length, n.length) >= 4);
    if (good.length === 1) return { confidence: 'substring', matches: good };
    if (good.length > 1) {
        good.sort((a, b) => b.nn.length - a.nn.length);
        const top = good[0];
        if (good.filter((g) => g.nn.length === top.nn.length).length === 1) return { confidence: 'substring-best', matches: [top] };
        return { confidence: 'ambiguous', matches: good.slice(0, 5) };
    }

    return { confidence: 'none', matches: [] };
}

function aiSnapshot(sheet, row) {
    const o = {};
    for (const [k, v] of Object.entries(row)) {
        if (k.startsWith('__EMPTY')) continue;
        if (v === '' || v === undefined) continue;
        const shortKey = k.replace(/#/g, 'Num').replace(/\s+/g, '_');
        o[shortKey] = v;
    }
    return o;
}

const SHEET_PACK_RULES = [
    { sheet: 'Weapons', packs: ['weapons'], nameKey: 'Name' },
    { sheet: 'Armor', packs: ['armour'], nameKey: 'Name' },
    {
        sheet: 'Modifications',
        packs: ['ammo', 'weapon-mods'],
        nameKey: 'Name',
        packPick: (row) =>
            row.Cat === 'A'
                ? ['ammo']
                : row.Cat === 'W'
                  ? ['weapon-mods']
                  : ['weapon-mods', 'ammo', 'attack-specials', 'tools', 'cybernetics'],
    },
    { sheet: 'Gear & Tools', packs: ['tools', 'consumables'], nameKey: 'Name' },
    { sheet: 'Drugs', packs: ['consumables'], nameKey: 'Name' },
    { sheet: 'PsyPwrs', packs: ['psychic-powers'], nameKey: 'Name' },
    { sheet: 'Cybernetics etc', packs: ['cybernetics'], nameKey: 'Name' },
    { sheet: 'Unique Wpns', packs: ['weapons'], nameKey: 'Name' },
    { sheet: 'Uniques', packs: ['weapons', 'armour', 'tools', 'consumables', 'cybernetics'], nameKey: 'Name' },
    { sheet: 'V Weps', packs: ['weapons'], nameKey: 'Name' },
];

const NO_ITEM_SHEETS = new Set([
    'Services',
    'Vehicles',
    'Creatures',
    'VS Hull',
    'Squads',
    'Allies',
    'VS Ess',
    'VS Wpns',
    'VS Supp',
    'VS Upgs',
    'VS Etc',
]);

function main() {
    if (!fs.existsSync(CONTENT_INDEX_JSON)) {
        console.error('Missing', CONTENT_INDEX_JSON);
        console.error('Create it with xlsx: read workbook, sheet_to_json, write JSON.');
        process.exit(1);
    }
    const workbook = JSON.parse(fs.readFileSync(CONTENT_INDEX_JSON, 'utf8'));
    const { flat, byPack } = loadAllCompendia();

    const records = [];

    /** Same display name as a core weapon but different stats — map to distinct compendium item. */
    function matchNameForRow(sheet, row, name) {
        if (sheet === 'Unique Wpns' && name === 'Astartes Combi-Bolter') {
            const origin = String(row.Origin || '');
            if (origin.includes('Heretic')) return 'Astartes Combi-Bolter (Heretic Astartes)';
        }
        return name;
    }

    for (const rule of SHEET_PACK_RULES) {
        const rows = workbook.sheets[rule.sheet] || [];
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const name = row[rule.nameKey];
            const packs = rule.packPick ? rule.packPick(row) : rule.packs;
            const lookupName = matchNameForRow(rule.sheet, row, name);
            const { confidence, matches } = bestMatch(lookupName, packs, flat, byPack);
            records.push({
                sheet: rule.sheet,
                row: i + 2,
                name,
                snapshot: aiSnapshot(rule.sheet, row),
                dh3: {
                    implementable: true,
                    packsSearched: packs,
                    matchConfidence: confidence,
                    matches: matches.map((m) => ({
                        pack: m.pack,
                        compendium: m.collection,
                        itemName: m.name,
                        itemId: m.id,
                        itemType: m.type,
                    })),
                },
            });
        }
    }

    const handledSheets = new Set(SHEET_PACK_RULES.map((r) => r.sheet));
    for (const sheet of workbook.sheetNames) {
        if (handledSheets.has(sheet)) continue;
        if (!NO_ITEM_SHEETS.has(sheet)) continue;
        const rows = workbook.sheets[sheet] || [];
        const nameKeys = ['Name', 'Service', 'Squad Name', 'Vehicle(s)', 'Type', 'Effect'];
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            let name = row.Name || row.Service || row['Squad Name'] || row['Vehicle(s)'] || row.Type || `row-${i + 2}`;
            records.push({
                sheet,
                row: i + 2,
                name,
                snapshot: aiSnapshot(sheet, row),
                dh3: {
                    implementable: false,
                    reason: 'No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro.',
                    packsSearched: [],
                    matchConfidence: 'n-a',
                    matches: [],
                },
            });
        }
    }

    const outJson = path.join(ROOT, 'docs', 'content-index-foundry-map.json');
    fs.mkdirSync(path.dirname(outJson), { recursive: true });
    fs.writeFileSync(outJson, JSON.stringify({ generated: new Date().toISOString(), source: CONTENT_INDEX_JSON, count: records.length, records }, null, 2));

    const stats = {};
    for (const r of records) {
        const k = `${r.sheet}|${r.dh3.matchConfidence}`;
        stats[k] = (stats[k] || 0) + 1;
    }

    const summaryPath = path.join(ROOT, 'docs', 'CONTENT_INDEX_VTT_REFERENCE.md');
    let md = `---\ndescription: AI-optimized index of RT_GDRIVE Content Index.xlsx mapped to Dark Heresy 3rd Edition Foundry compendia.\n---\n\n`;
    md += `# Content Index → DH3 Foundry VTT\n\n`;
    md += `**Source spreadsheet:** \`C:\\Users\\kirkl\\OneDrive\\Documents\\ROGUE_TRADER\\AI_available_materials\\RT_GDRIVE\\Content Index.xlsx\`\n\n`;
    md += `**Machine-readable map (all rows):** [content-index-foundry-map.json](content-index-foundry-map.json)\n\n`;
    md += `**Regenerate** after editing the spreadsheet: export sheets to \`docs/content-index-full.json\` (same schema as produced from the \`.xlsx\` via the \`xlsx\` npm package), then run \`node tools/build-content-index-map.cjs\` (optional env: \`CONTENT_INDEX_JSON\`).\n\n`;
    md += `## Using in Cursor\n\n`;
    md += `- Attach **\`docs/CONTENT_INDEX_VTT_REFERENCE.md\`** when you need campaign loot, NPC gear, or voidship components by name; use the **Complete index** table for **DH3** compendium pack ids and item names.\n`;
    md += `- Prefer **\`docs/content-index-foundry-map.json\`** for scripts: each record has \`snapshot\` (spreadsheet fields) and \`dh3.matches[]\` with \`compendium\`, \`itemId\`, \`itemType\`.\n`;
    md += `- Rows with **\`n-a\`** or **no compendium match** are still valid campaign data: implement as a custom **Item** (\`template.json\`), **Actor** (\`enemy\`, acolyte), or **JournalEntry**.\n\n`;
    md += `## Legend\n\n`;
    md += `- **snapshot** fields in JSON are spreadsheet columns with empty cells removed — safe context for LLMs.\n`;
    md += `- **Compendium slug** format: \`dark-heresy-3rd-edition.<pack>\` where pack is one of: \`${Object.keys(PACK_FILES).join(', ')}\`.\n`;
    md += `- **matchConfidence:** \`exact\` | \`substring\` | \`substring-best\` | \`exact-ambiguous\` | \`ambiguous\` | \`none\` | \`n-a\` (non-item sheets).\n`;
    md += `- **Modifications sheet:** \`Cat\` A → ammo, W → weapon-mods, R/V → also search weapon-mods (armour/vehicle flavour — often custom).\n\n`;
    md += `## Implementability\n\n`;
    md += `| DH3 compendium | Item types |\n|----------------|------------|\n`;
    md += `| weapons | weapon |\n| armour | armour |\n| ammo | ammunition |\n| weapon-mods | weaponModification |\n| attack-specials | attackSpecial |\n| consumables | consumable, drug |\n| tools | tool |\n| cybernetics | cybernetic |\n| psychic-powers | psychicPower |\n| talents | talent |\n| traits | trait |\n\n`;
    md += `**Not in compendia:** vehicles, voidship components, squads, allies, services, creatures — model as **Actor**, **JournalEntry**, or homebrew **Item** using \`template.json\` types (\`enemy\`, etc.) where supported.\n\n`;
    md += `## Match statistics\n\n`;
    md += '```json\n' + JSON.stringify(stats, null, 2) + '\n```\n\n';
    md += `## Per-sheet sample (first 3 rows each)\n\n`;
    const bySheet = {};
    for (const r of records) {
        bySheet[r.sheet] = bySheet[r.sheet] || [];
        if (bySheet[r.sheet].length < 3) bySheet[r.sheet].push(r);
    }
    for (const sheet of Object.keys(bySheet).sort()) {
        md += `### ${sheet}\n\n`;
        for (const r of bySheet[sheet]) {
            md += `- **${r.name}** — \`${r.dh3.matchConfidence}\` — `;
            if (r.dh3.matches[0]) {
                md += `\`${r.dh3.matches[0].compendium}\` / ${r.dh3.matches[0].itemName}\n`;
            } else if (!r.dh3.implementable) {
                md += `*${r.dh3.reason}*\n`;
            } else {
                md += `*no compendium match*\n`;
            }
        }
        md += '\n';
    }

    fs.writeFileSync(summaryPath, md);

    let table = '\n## Complete index (all spreadsheet rows)\n\n';
    table += '| Sheet | Name | Row | Confidence | DH3 compendium / note |\n';
    table += '|---|---|--:|---|---|\n';
    for (const r of records) {
        const m = r.dh3.matches[0];
        let col = '';
        if (m) col = '`' + m.compendium + '` **' + String(m.itemName).replace(/\|/g, '/') + '**';
        else if (r.dh3.implementable) col = '*no compendium match*';
        else col = String(r.dh3.reason).replace(/\|/g, '/');
        const name = String(r.name || '')
            .replace(/\|/g, '\\|')
            .replace(/\n/g, ' ');
        table +=
            '| ' + r.sheet + ' | ' + name + ' | ' + r.row + ' | ' + r.dh3.matchConfidence + ' | ' + col + ' |\n';
    }
    fs.appendFileSync(summaryPath, table);

    console.log('Wrote', outJson, 'records:', records.length);
    console.log('Wrote', summaryPath);
}

main();
