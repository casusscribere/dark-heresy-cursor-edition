/**
 * Execution context for RT2E player action scripts.
 * Resolves $last, $last_item, $actor:<name> references.
 */

export function createContext() {
    return {
        lastActorId: null,
        lastActorName: null,
        lastItemId: null,
        lastItemName: null,
        actorsByName: new Map(),
        itemsByName: new Map(),
        openSheetActorId: null,
    };
}

/**
 * @param {ReturnType<typeof createContext>} ctx
 * @param {string} ref
 * @returns {string}
 */
export function resolveActorRef(ctx, ref) {
    if (ref === '$last') {
        if (!ctx.lastActorId) throw new Error('$last actor is not set');
        return ctx.lastActorId;
    }
    if (ref.startsWith('$actor:')) {
        const name = ref.slice('$actor:'.length);
        const id = ctx.actorsByName.get(name);
        if (!id) throw new Error(`unknown actor ref: ${ref}`);
        return id;
    }
    return ref;
}

/**
 * @param {ReturnType<typeof createContext>} ctx
 * @param {string} ref
 * @returns {string}
 */
export function resolveItemRef(ctx, ref) {
    if (ref === '$last_item') {
        if (!ctx.lastItemId) throw new Error('$last_item is not set');
        return ctx.lastItemId;
    }
    if (ref.startsWith('$item:')) {
        const name = ref.slice('$item:'.length);
        const id = ctx.itemsByName.get(name);
        if (!id) throw new Error(`unknown item ref: ${ref}`);
        return id;
    }
    return ref;
}

/**
 * @param {ReturnType<typeof createContext>} ctx
 * @param {{ id: string, name: string }} actor
 */
export function rememberActor(ctx, actor) {
    ctx.lastActorId = actor.id;
    ctx.lastActorName = actor.name;
    ctx.actorsByName.set(actor.name, actor.id);
}

/**
 * @param {ReturnType<typeof createContext>} ctx
 * @param {{ id: string, name: string }} item
 */
export function rememberItem(ctx, item) {
    ctx.lastItemId = item.id;
    ctx.lastItemName = item.name;
    ctx.itemsByName.set(item.name, item.id);
}
