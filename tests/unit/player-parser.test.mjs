import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseScript, validateCommands } from '../player/parser.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const smokePath = resolve(here, '..', 'player', 'scenarios', 'smoke.rt2e');

describe('player action parser', () => {
    it('parses smoke.rt2e without errors', () => {
        const source = readFileSync(smokePath, 'utf8');
        const { commands, errors } = parseScript(source);
        validateCommands(commands, errors);
        expect(errors).toEqual([]);
        expect(commands.length).toBeGreaterThan(5);
    });

    it('parses LOGIN with optional password', () => {
        const { commands, errors } = parseScript('LOGIN user=GM password=secret\n');
        expect(errors).toEqual([]);
        expect(commands[0]).toMatchObject({ verb: 'LOGIN', args: { user: 'GM', password: 'secret' } });
    });

    it('parses quoted names and numeric values', () => {
        const { commands, errors } = parseScript(
            'CREATE_CHARACTER name="Test Guy" type=acolyte\nSET_STAT actor=$last path=system.wounds.value value=12\n',
        );
        expect(errors).toEqual([]);
        expect(commands[0].args.name).toBe('Test Guy');
        expect(commands[1].args.value).toBe(12);
    });

    it('reports unknown verbs', () => {
        const { commands, errors } = parseScript('FLY_TO_MOON target=luna\n');
        validateCommands(commands, errors);
        expect(errors.some((e) => e.message.includes('unknown verb'))).toBe(true);
    });
});
