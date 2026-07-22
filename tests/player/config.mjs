/**
 * Default Foundry test-server credentials for the player agent.
 *
 * Override with environment variables or tests/player/.env (loaded by run.mjs).
 */

export const FOUNDRY_PLAYER_DEFAULTS = {
    /** Foundry join URL for the local test server */
    baseUrl: 'http://localhost:30000',
    /** Dedicated automation account on the test server */
    user: 'cursor-player',
    /** Blank password (cursor-player is configured without a password) */
    password: '',
    /** Default test world id / display name */
    world: 'test',
    headless: true,
};

/**
 * @param {Partial<typeof FOUNDRY_PLAYER_DEFAULTS>} overrides
 */
export function resolvePlayerConfig(overrides = {}) {
    return {
        baseUrl: process.env.FOUNDRY_URL ?? FOUNDRY_PLAYER_DEFAULTS.baseUrl,
        user: process.env.FOUNDRY_USER ?? FOUNDRY_PLAYER_DEFAULTS.user,
        password:
            process.env.FOUNDRY_PASSWORD !== undefined
                ? process.env.FOUNDRY_PASSWORD
                : FOUNDRY_PLAYER_DEFAULTS.password,
        world: process.env.FOUNDRY_WORLD ?? FOUNDRY_PLAYER_DEFAULTS.world,
        headless:
            process.env.FOUNDRY_HEADLESS !== undefined
                ? process.env.FOUNDRY_HEADLESS.toLowerCase() !== 'false'
                : FOUNDRY_PLAYER_DEFAULTS.headless,
        ...overrides,
    };
}

/**
 * Rewrites LOGIN / ENTER_WORLD lines so scripts stay credential-agnostic.
 *
 * @param {string} source
 * @param {ReturnType<typeof resolvePlayerConfig>} cfg
 */
export function injectSessionCredentials(source, cfg) {
    const passwordToken = cfg.password === '' ? '' : cfg.password;
    return source
        .replace(/^LOGIN\s+.*$/m, `LOGIN user=${cfg.user} password=${passwordToken}`)
        .replace(/^ENTER_WORLD\s+.*$/m, `ENTER_WORLD name=${cfg.world}`);
}
