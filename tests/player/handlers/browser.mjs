/**
 * Browser-level handlers: Foundry join screen, world launch, readiness.
 */

const DEFAULT_TIMEOUT = 120_000;

/**
 * @param {import('playwright').Page} page
 * @param {{ user: string, password?: string }} args
 */
export async function login(page, args) {
    const userName = args.user;
    const password = args.password ?? '';

    await page.waitForLoadState('domcontentloaded');

    const userSelectors = [
        `li.user[data-user-id="${userName}"]`,
        `li.user:has-text("${userName}")`,
        `[data-user="${userName}"]`,
        `button:has-text("${userName}")`,
    ];

    let clicked = false;
    for (const sel of userSelectors) {
        const el = page.locator(sel).first();
        if ((await el.count()) > 0) {
            await el.click();
            clicked = true;
            break;
        }
    }
    if (!clicked) {
        throw new Error(`could not find user "${userName}" on join screen`);
    }

    const passwordField = page.locator('#password, input[name="password"], input[type="password"]').first();
    if ((await passwordField.count()) > 0 && password) {
        await passwordField.fill(password);
    }

    const joinButtons = [
        'button[data-action="join"]',
        'button:has-text("Join Game Session")',
        'button:has-text("Join Game")',
        'button[type="submit"]',
    ];
    for (const sel of joinButtons) {
        const btn = page.locator(sel).first();
        if ((await btn.count()) > 0 && (await btn.isVisible())) {
            await btn.click();
            break;
        }
    }

    await page.waitForLoadState('networkidle', { timeout: DEFAULT_TIMEOUT }).catch(() => {});
}

/**
 * @param {import('playwright').Page} page
 * @param {{ name: string }} args
 */
export async function enterWorld(page, args) {
    const worldName = args.name;

    const worldSelectors = [
        `.world-row[data-world-id="${worldName}"]`,
        `.world[data-id="${worldName}"]`,
        `li.world:has-text("${worldName}")`,
        `.world-row:has-text("${worldName}")`,
        `[data-package-id="${worldName}"]`,
    ];

    let launched = false;
    for (const sel of worldSelectors) {
        const row = page.locator(sel).first();
        if ((await row.count()) > 0) {
            await row.click();
            launched = true;
            break;
        }
    }

    if (!launched) {
        const launchBtn = page.locator(
            `button:has-text("Launch World"), button:has-text("Play World"), button[data-action="launchWorld"]`,
        ).first();
        if ((await launchBtn.count()) > 0) {
            await launchBtn.click();
        } else {
            throw new Error(`could not find world "${worldName}" on setup/join screen`);
        }
    }

    await page.waitForLoadState('networkidle', { timeout: DEFAULT_TIMEOUT }).catch(() => {});
}

/**
 * @param {import('playwright').Page} page
 * @param {{ timeout?: number }} args
 */
export async function waitReady(page, args) {
    const timeout = args.timeout ?? DEFAULT_TIMEOUT;
    await page.waitForFunction(
        () => typeof globalThis.game !== 'undefined' && globalThis.game?.ready === true,
        null,
        { timeout },
    );
}
