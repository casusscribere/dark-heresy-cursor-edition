/**
 * Parser for RT2E Player Action scripts (.rt2e files).
 * Grammar: tests/player/grammar.ebnf
 */

const ARG_PATTERN =
    /(\w+)=(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|([^\s]*))/g;

/**
 * @param {string} source
 * @returns {{ commands: object[], errors: { line: number, message: string }[] }}
 */
export function parseScript(source) {
    const lines = source.split(/\r?\n/);
    /** @type {object[]} */
    const commands = [];
    /** @type {{ line: number, message: string }[]} */
    const errors = [];

    for (let i = 0; i < lines.length; i++) {
        const lineNo = i + 1;
        const raw = lines[i];
        const trimmed = raw.trim();

        if (!trimmed || trimmed.startsWith('#')) continue;

        const cmdMatch = trimmed.match(/^([A-Z][A-Z0-9_]*)\s*(.*)$/);
        if (!cmdMatch) {
            errors.push({ line: lineNo, message: `unrecognised command: ${trimmed}` });
            continue;
        }

        const verb = cmdMatch[1];
        const argsStr = cmdMatch[2] ?? '';

        try {
            const args = parseArgs(argsStr);
            commands.push({ line: lineNo, verb, args, raw: trimmed });
        } catch (e) {
            errors.push({ line: lineNo, message: e.message });
        }
    }

    return { commands, errors };
}

/**
 * @param {string} argsStr
 * @returns {Record<string, string|number|boolean|null>}
 */
function parseArgs(argsStr) {
    const args = {};
    if (!argsStr.trim()) return args;

    let match;
    const re = new RegExp(ARG_PATTERN.source, 'g');
    let lastIndex = 0;
    while ((match = re.exec(argsStr)) !== null) {
        const key = match[1];
        let value = match[2] ?? match[3] ?? match[4] ?? '';
        if (match[2] !== undefined || match[3] !== undefined) {
            value = String(value).replace(/\\(.)/g, '$1');
        } else if (value === 'true') value = true;
        else if (value === 'false') value = false;
        else if (value === 'null') value = null;
        else if (/^-?\d+$/.test(value)) value = Number.parseInt(value, 10);
        else if (/^-?\d+\.\d+$/.test(value)) value = Number.parseFloat(value);

        if (key in args) throw new Error(`duplicate argument: ${key}`);
        args[key] = value;
        lastIndex = re.lastIndex;
    }

    const remainder = argsStr.slice(lastIndex).trim();
    if (remainder) throw new Error(`unparsed argument fragment: ${remainder}`);

    return args;
}

/**
 * @param {object[]} commands
 * @param {{ line: number, message: string }[]} errors
 */
export function validateCommands(commands, errors) {
    const REQUIRED = {
        LOGIN: ['user'],
        ENTER_WORLD: ['name'],
        CREATE_CHARACTER: ['name', 'type'],
        OPEN_SHEET: ['actor'],
        CREATE_ITEM: ['actor', 'name', 'type'],
        EQUIP: ['actor', 'item'],
        MODIFY_GEAR: ['actor', 'item', 'path', 'value'],
        SET_STAT: ['actor', 'path', 'value'],
        ASSERT: ['actor', 'path', 'equals'],
        ASSERT_EXISTS: ['actor'],
        DELETE_ACTOR: ['actor'],
        DELETE_ITEM: ['item'],
        SCREENSHOT: ['label'],
    };

    const ALLOWED = new Set([
        'LOGIN',
        'ENTER_WORLD',
        'WAIT_READY',
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
        'SCREENSHOT',
    ]);

    for (const cmd of commands) {
        if (!ALLOWED.has(cmd.verb)) {
            errors.push({ line: cmd.line, message: `unknown verb: ${cmd.verb}` });
            continue;
        }
        const req = REQUIRED[cmd.verb];
        if (req) {
            for (const key of req) {
                if (!(key in cmd.args)) {
                    errors.push({ line: cmd.line, message: `${cmd.verb} missing required arg: ${key}` });
                }
            }
        }
    }
}
