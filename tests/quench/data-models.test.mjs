/**
 * Data model suite for the player agent.
 *
 * Confirms that every Actor/Item subtype the player can create round-trips
 * cleanly through:
 *   1. document creation
 *   2. derived data preparation
 *   3. update + reload
 *   4. delete
 *
 * The player agent grows this suite as new subtypes are migrated to
 * TypeDataModel under the FOUNDRY_V14_MIGRATION_PLAN.
 */

export function registerDataModelSuite(quench, { systemId, recordResult }) {
    quench.registerBatch(
        `${systemId}.data-models`,
        async (context) => {
            const { describe, it, assert, after } = context;

            const actorTypes = ['acolyte', 'npc', 'vehicle'];
            const itemTypes = [
                'weapon',
                'armour',
                'ammunition',
                'talent',
                'trait',
                'psychicPower',
                'cybernetic',
                'consumable',
                'tool',
                'forceField',
                'weaponModification',
            ];

            describe('actor subtypes round-trip', () => {
                for (const type of actorTypes) {
                    it(`creates, updates, deletes an empty "${type}"`, async () => {
                        const actor = await Actor.create({ name: `Quench ${type}`, type });
                        try {
                            assert.ok(actor.id);
                            await actor.update({ name: `Quench ${type} renamed` });
                            const reloaded = game.actors.get(actor.id);
                            assert.equal(reloaded.name, `Quench ${type} renamed`);
                            assert.doesNotThrow(() => reloaded.prepareData());
                        } finally {
                            await actor.delete();
                        }
                    });
                }
            });

            describe('item subtypes round-trip', () => {
                for (const type of itemTypes) {
                    it(`creates, updates, deletes an empty "${type}"`, async () => {
                        const item = await Item.create({ name: `Quench ${type}`, type });
                        try {
                            assert.ok(item.id);
                            await item.update({ name: `Quench ${type} renamed` });
                            const reloaded = game.items.get(item.id);
                            assert.equal(reloaded?.name, `Quench ${type} renamed`);
                            assert.doesNotThrow(() => reloaded.prepareData());
                        } finally {
                            await item.delete();
                        }
                    });
                }
            });

            after(function () {
                recordResult(`${systemId}.data-models`, this);
            });
        },
        { displayName: 'Rogue Trader 2e - Data Models' },
    );
}
