import { describe, it, expect, beforeEach } from 'vitest';
import { resetFoundryMocks } from './mocks/foundry.mjs';
import {
    uuid,
    getDegree,
    getOpposedDegrees,
    roll1d100,
    recursiveUpdate,
    handleDotNotationUpdate,
} from '../../module/rolls/roll-helpers.mjs';

beforeEach(() => {
    resetFoundryMocks();
});

describe('uuid()', () => {
    it('produces a v4-shaped string', () => {
        const id = uuid();
        expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    });

    it('returns different values across calls', () => {
        expect(uuid()).not.toEqual(uuid());
    });
});

describe('getDegree()', () => {
    it('returns the floored 10s difference between target and roll', () => {
        expect(getDegree(55, 23)).toBe(3);
        expect(getDegree(10, 90)).toBe(-8);
        expect(getDegree(50, 50)).toBe(0);
    });
});

describe('getOpposedDegrees()', () => {
    it('subtracts opposed success when both succeed', () => {
        expect(getOpposedDegrees(3, 0, 1, 0)).toBe(2);
    });
    it('adds opposed failure when self succeeds and opponent fails', () => {
        expect(getOpposedDegrees(2, 0, 0, 4)).toBe(6);
    });
    it('returns negative when self fails and opponent succeeds', () => {
        expect(getOpposedDegrees(0, 3, 1, 0)).toBe(-4);
    });
    it('returns negative when both fail', () => {
        expect(getOpposedDegrees(0, 4, 0, 2)).toBe(-2);
    });
});

describe('roll1d100()', () => {
    it('returns an evaluated Roll using the 1d100 formula', async () => {
        const r = await roll1d100();
        expect(r.formula).toBe('1d100');
        expect(r._evaluated).toBe(true);
    });
});

describe('handleDotNotationUpdate()', () => {
    it('sets a top-level scalar', () => {
        const target = { a: 1 };
        handleDotNotationUpdate(target, 'a', 5);
        expect(target.a).toBe(5);
    });

    it('descends into nested keys using dot notation', () => {
        const target = { a: { b: { c: 0 } } };
        handleDotNotationUpdate(target, 'a.b.c', 7);
        expect(target.a.b.c).toBe(7);
    });

    it('deletes the leaf when the value is null or undefined', () => {
        const target = { a: { b: 1 } };
        handleDotNotationUpdate(target, 'a.b', null);
        expect(target.a.b).toBeUndefined();
    });

    it('coerces strings to numbers when the existing field is numeric', () => {
        const target = { a: 0 };
        handleDotNotationUpdate(target, 'a', '42');
        expect(target.a).toBe(42);
        expect(typeof target.a).toBe('number');
    });
});

describe('recursiveUpdate()', () => {
    it('applies multiple dot-notation updates atomically', () => {
        const target = { a: { b: 1, c: 2 }, d: 3 };
        recursiveUpdate(target, { 'a.b': 9, d: 4 });
        expect(target).toEqual({ a: { b: 9, c: 2 }, d: 4 });
    });
});
