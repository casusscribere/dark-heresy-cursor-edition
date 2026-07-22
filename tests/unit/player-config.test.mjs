import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
    FOUNDRY_PLAYER_DEFAULTS,
    injectSessionCredentials,
    resolvePlayerConfig,
} from '../player/config.mjs';

describe('player config', () => {
    const envSnapshot = { ...process.env };

    afterEach(() => {
        process.env = { ...envSnapshot };
    });

    it('defaults to cursor-player with blank password on test world', () => {
        delete process.env.FOUNDRY_USER;
        delete process.env.FOUNDRY_PASSWORD;
        delete process.env.FOUNDRY_WORLD;
        const cfg = resolvePlayerConfig();
        expect(cfg.user).toBe('cursor-player');
        expect(cfg.password).toBe('');
        expect(cfg.world).toBe('test');
    });

    it('injects session credentials into scripts', () => {
        const source = 'LOGIN user=old password=secret\nENTER_WORLD name=other\n';
        const out = injectSessionCredentials(source, {
            user: 'cursor-player',
            password: '',
            world: 'test',
        });
        expect(out).toContain('LOGIN user=cursor-player password=');
        expect(out).toContain('ENTER_WORLD name=test');
    });

    it('documents FOUNDRY_PLAYER_DEFAULTS user', () => {
        expect(FOUNDRY_PLAYER_DEFAULTS.user).toBe('cursor-player');
        expect(FOUNDRY_PLAYER_DEFAULTS.password).toBe('');
    });
});
