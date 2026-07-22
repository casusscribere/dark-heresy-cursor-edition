/**
 * Foundry global mocks for Vitest.
 *
 * Loaded automatically via `vitest.config.mjs#setupFiles`. The code-side agent
 * may extend this file with additional mocks as more module surface is brought
 * under unit test, but the surface kept here is intentionally minimal: only
 * what pure-logic modules actually call. Heavy UI surface (Dialog, Application,
 * sheet classes) should NOT be mocked here -- it belongs in the Quench suite
 * the player agent runs.
 */

import { vi } from 'vitest';

const noop = () => undefined;

class MockRoll {
    constructor(formula, data = {}) {
        this.formula = formula;
        this.data = data;
        this.total = 0;
        this._evaluated = false;
    }
    async evaluate() {
        this._evaluated = true;
        return this;
    }
    static create(formula, data) {
        return new MockRoll(formula, data);
    }
}

const settingsStore = new Map();

globalThis.Roll = MockRoll;

globalThis.CONST = {
    CHAT_MESSAGE_STYLES: { OTHER: 0, OOC: 1, IC: 2, EMOTE: 3, WHISPER: 4, ROLL: 5 },
    DOCUMENT_OWNERSHIP_LEVELS: { NONE: 0, LIMITED: 1, OBSERVER: 2, OWNER: 3 },
};

globalThis.game = {
    settings: {
        get: vi.fn((scope, key) => settingsStore.get(`${scope}.${key}`)),
        set: vi.fn(async (scope, key, value) => {
            settingsStore.set(`${scope}.${key}`, value);
            return value;
        }),
        register: vi.fn((scope, key, config) => {
            if (config && 'default' in config && !settingsStore.has(`${scope}.${key}`)) {
                settingsStore.set(`${scope}.${key}`, config.default);
            }
        }),
    },
    user: { id: 'test-user', isGM: true },
    actors: { contents: [], get: vi.fn(() => null) },
    items: { contents: [], get: vi.fn(() => null) },
    packs: {
        get: vi.fn(() => null),
        filter: vi.fn(() => []),
        forEach: noop,
    },
    i18n: {
        localize: (k) => k,
        format: (k) => k,
    },
};

globalThis.ui = {
    notifications: {
        info: vi.fn(noop),
        warn: vi.fn(noop),
        error: vi.fn(noop),
    },
};

globalThis.ChatMessage = {
    create: vi.fn(async (data) => data),
    getWhisperRecipients: vi.fn(() => []),
};

globalThis.renderTemplate = vi.fn(async () => '<div></div>');

globalThis.Hooks = {
    on: vi.fn(noop),
    once: vi.fn(noop),
    off: vi.fn(noop),
    call: vi.fn(() => true),
    callAll: vi.fn(noop),
};

globalThis.Dialog = class MockDialog {
    constructor(opts) {
        this.opts = opts;
    }
    render = vi.fn();
};

/**
 * Reset call counts and the in-memory settings store between tests. The
 * code-side agent should import and invoke this in `beforeEach` for any
 * test that depends on settings state.
 */
export function resetFoundryMocks() {
    settingsStore.clear();
    for (const fn of [
        globalThis.game.settings.get,
        globalThis.game.settings.set,
        globalThis.game.settings.register,
        globalThis.ChatMessage.create,
        globalThis.ChatMessage.getWhisperRecipients,
        globalThis.renderTemplate,
        globalThis.ui.notifications.info,
        globalThis.ui.notifications.warn,
        globalThis.ui.notifications.error,
        globalThis.Hooks.on,
        globalThis.Hooks.once,
        globalThis.Hooks.off,
        globalThis.Hooks.call,
        globalThis.Hooks.callAll,
    ]) {
        fn.mockClear();
    }
}
