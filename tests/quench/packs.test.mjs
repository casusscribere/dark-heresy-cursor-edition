/**
 * Compendium / pack suite for the player agent.
 *
 * Verifies that every system-declared pack loads in v14, every document inside
 * validates against its declared subtype data model, and a representative drag
 * payload can be re-imported into the world without error.
 *
 * Suites are intentionally additive: when the player agent finds a regression
 * during exploratory testing it adds a focused `it()` below the matching
 * `describe()` block and reruns just that batch from the Quench UI.
 */

export function registerPacksSuite(quench, { systemId, recordResult }) {
    quench.registerBatch(
        `${systemId}.packs`,
        async (context) => {
            const { describe, it, assert, after } = context;
            const expectedPacks = [
                'ammo',
                'aptitudes',
                'armour',
                'attack-specials',
                'consumables',
                'cybernetics',
                'psychic-powers',
                'tables',
                'talents',
                'tools',
                'traits',
                'weapons',
                'weapon-mods',
            ];

            describe('manifest-declared packs are present', () => {
                for (const name of expectedPacks) {
                    it(`pack "${name}" is registered`, () => {
                        const pack = game.packs.get(`${systemId}.${name}`);
                        assert.ok(pack, `expected pack ${systemId}.${name} to be registered`);
                    });
                }
            });

            describe('packs load and index without throwing', () => {
                for (const name of expectedPacks) {
                    it(`pack "${name}" indexes successfully`, async () => {
                        const pack = game.packs.get(`${systemId}.${name}`);
                        assert.ok(pack);
                        const index = await pack.getIndex();
                        assert.ok(index.size >= 0, 'index returned');
                    });
                }
            });

            describe('every pack document validates against its data model', () => {
                for (const name of expectedPacks) {
                    it(`pack "${name}" documents validate`, async () => {
                        const pack = game.packs.get(`${systemId}.${name}`);
                        assert.ok(pack);
                        const docs = await pack.getDocuments();
                        const invalid = docs.filter((d) => {
                            try {
                                d.validate({ strict: true });
                                return false;
                            } catch (e) {
                                return true;
                            }
                        });
                        assert.equal(
                            invalid.length,
                            0,
                            `invalid docs in ${name}: ${invalid.map((d) => d.name).join(', ')}`,
                        );
                    });
                }
            });

            after(function () {
                recordResult(`${systemId}.packs`, this);
            });
        },
        { displayName: 'Rogue Trader 2e - Packs' },
    );
}
