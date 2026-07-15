import { handleBleeding, handleOnFire } from '../rules/active-effects.mjs';

export class CombatActionManager {
    combatUpdateHook;

    initializeHooks() {
        // Foundry v14 emits combat lifecycle through updateCombat.
        this.combatUpdateHook = Hooks.on('updateCombat', async (combat, changed) => {
            if (!("turn" in changed) && !("round" in changed)) return;
            await this.updateCombat(combat, changed);
        });
    }

    disableHooks() {
        game.dh.log('Disabling Hooks', {'updateHook': this.combatUpdateHook})
        Hooks.off('updateCombat', this.combatUpdateHook);
    }

    async updateCombat(combat, data) {
        console.log(combat);
        console.log(data);
        // Only Run on the first GM -- so it will only run once
        if(game.userId === this.getFirstGM()) {
            game.dh.log('updateCombat - this should only be running on first GM');
            this.processCombatActiveEffects(combat, data);
        }
    }

    async processCombatActiveEffects(combat, data) {
        const turnIndex = Number.isInteger(data?.turn) ? data.turn : combat.turn;
        const currentCombatant = combat.turns?.[turnIndex];
        game.dh.log('processCombatActiveEffects', currentCombatant);

        if (currentCombatant) {
            // Handle Actor Effects
            if(currentCombatant.actor && currentCombatant.actor.effects) {
                for(const effect of currentCombatant.actor.effects.contents) {
                    // On Fire!
                    if(effect.label === 'Burning') {
                        await handleOnFire(currentCombatant.actor);
                    } else if (effect.label === 'Bleeding') {
                        await handleBleeding(currentCombatant.actor);
                    }
                }
            }
        }
    }

    getFirstGM() {
        for(const user of game.users.contents) {
            if (user.active && user.isGM) return user.id;
        }
    }
}



export const DHCombatActionManager = new CombatActionManager();
