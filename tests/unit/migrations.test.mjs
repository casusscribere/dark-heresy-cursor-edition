/**
 * Pure-logic tests for migration helpers. The full `checkAndMigrateWorld`
 * routine is exercised by the player agent inside Foundry (see
 * tests/quench/migration.test.mjs) because it relies on real document
 * lifecycle. This file targets logic that can be tested without a live world.
 *
 * The code-side agent expands this file in lockstep with new migration steps:
 * any new helper added to module/dark-heresy-migrations.mjs should land here
 * before being merged.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { resetFoundryMocks } from './mocks/foundry.mjs';

beforeEach(() => {
    resetFoundryMocks();
});

describe('migration module loads cleanly', () => {
    it('exports checkAndMigrateWorld as a function', async () => {
        const mod = await import('../../module/dark-heresy-migrations.mjs');
        expect(typeof mod.checkAndMigrateWorld).toBe('function');
    });
});

describe('worldVersion comparison semantics', () => {
    it.todo(
        'worldVersion < 181 triggers compendium permission update but not 181+',
    );
    it.todo(
        'worldVersion < 180 triggers nested-item materialisation but not 180+',
    );
});
