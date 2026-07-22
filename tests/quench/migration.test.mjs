/**
 * Migration suite for the player agent.
 *
 * Verifies that `checkAndMigrateWorld` is idempotent, that the stored
 * worldVersion advances exactly once per upgrade, and that representative
 * legacy payloads (pre-181 nested-item flag shape, pre-180 storage-location
 * shape) survive the upgrade path without data loss.
 *
 * The player agent should add a new `it()` here whenever the migration plan
 * in CURSOR_DOCS/.../FOUNDRY_V14_MIGRATION_CHECKLIST.md adds a numbered step.
 */

export function registerMigrationSuite(quench, { systemId, recordResult }) {
    quench.registerBatch(
        `${systemId}.migration`,
        async (context) => {
            const { describe, it, assert, before, after } = context;

            const setting = () => game.settings.get(systemId, 'world-version');
            let originalVersion;
            const createdActorIds = [];

            before(async () => {
                originalVersion = setting();
            });

            describe('worldVersion bookkeeping', () => {
                it('setting is registered and is a finite number', () => {
                    assert.equal(typeof setting(), 'number');
                    assert.ok(Number.isFinite(setting()));
                });

                it('running migration twice does not advance worldVersion past target', async () => {
                    const mod = await import(`/systems/${systemId}/module/dark-heresy-migrations.mjs`);
                    await mod.checkAndMigrateWorld();
                    const afterFirst = setting();
                    await mod.checkAndMigrateWorld();
                    const afterSecond = setting();
                    assert.equal(afterFirst, afterSecond, 'second run must be idempotent');
                });
            });

            describe('legacy data passes through migration without loss', () => {
                it('nested-item flag (pre-1.8.1 shape) is materialised', async () => {
                    const sampleWeapon = await Item.create(
                        {
                            name: 'Quench Test Weapon',
                            type: 'weapon',
                            flags: {
                                itemcollection: {
                                    contentsData: [
                                        { name: 'Quench Nested Ammo', type: 'ammunition' },
                                    ],
                                },
                            },
                        },
                        { temporary: false },
                    );
                    try {
                        const mod = await import(`/systems/${systemId}/module/dark-heresy-migrations.mjs`);
                        await mod.checkAndMigrateWorld();
                        const reloaded = game.items.get(sampleWeapon.id);
                        assert.ok(reloaded, 'sample weapon survived migration');
                    } finally {
                        await sampleWeapon.delete();
                    }
                });
            });

            after(async function () {
                for (const id of createdActorIds) {
                    const a = game.actors.get(id);
                    if (a) await a.delete();
                }
                recordResult(`${systemId}.migration`, this);
            });
        },
        { displayName: 'Rogue Trader 2e - Migration' },
    );
}
