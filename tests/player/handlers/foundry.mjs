/**
 * In-world handlers executed via page.evaluate against the live Foundry client.
 */

function getByPath(obj, path) {
    return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

/**
 * @param {import('playwright').Page} page
 * @param {import('../context.mjs').createContext extends Function ? ReturnType<import('../context.mjs').createContext> : never} ctx
 * @param {object} cmd
 */
export async function runFoundryCommand(page, ctx, cmd) {
    const payload = { verb: cmd.verb, args: cmd.args, ctx: serializeCtx(ctx) };
    const result = await page.evaluate(async ({ verb, args, ctx: c }) => {
        const errors = [];
        const out = { ok: true, data: null };

        function actorId(ref) {
            if (ref === '$last') return c.lastActorId;
            if (ref?.startsWith('$actor:')) {
                const name = ref.slice(7);
                return c.actorsByName[name] ?? null;
            }
            return ref;
        }

        function itemId(ref) {
            if (ref === '$last_item') return c.lastItemId;
            if (ref?.startsWith('$item:')) {
                const name = ref.slice(6);
                return c.itemsByName[name] ?? null;
            }
            return ref;
        }

        function getActor(ref) {
            const id = actorId(ref);
            const a = game.actors.get(id);
            if (!a) throw new Error(`actor not found: ${ref} (${id})`);
            return a;
        }

        function getItem(ref) {
            const id = itemId(ref);
            let item = game.items.get(id);
            if (!item) {
                for (const actor of game.actors) {
                    item = actor.items.get(id);
                    if (item) break;
                }
            }
            if (!item) throw new Error(`item not found: ${ref} (${id})`);
            return item;
        }

        function buildUpdate(path, value) {
            const fullPath = path.startsWith('system.') ? path : `system.${path}`;
            const update = {};
            foundry.utils.setProperty(update, fullPath, value);
            return update;
        }

        try {
            switch (verb) {
                case 'CREATE_CHARACTER': {
                    const data = { name: args.name, type: args.type };
                    if (args.folder) data.folder = args.folder;
                    const actor = await Actor.create(data);
                    out.data = { id: actor.id, name: actor.name, type: actor.type };
                    break;
                }
                case 'OPEN_SHEET': {
                    const actor = getActor(args.actor);
                    await actor.sheet?.render(true);
                    out.data = { id: actor.id, sheetRendered: !!actor.sheet?.rendered };
                    break;
                }
                case 'CLOSE_SHEET': {
                    const sheets = Object.values(ui.windows).filter(
                        (w) => w instanceof ActorSheet || w?.constructor?.name?.includes('Sheet'),
                    );
                    for (const s of sheets) await s.close();
                    out.data = { closed: sheets.length };
                    break;
                }
                case 'CREATE_ITEM': {
                    const actor = getActor(args.actor);
                    const item = await Item.create(
                        { name: args.name, type: args.type },
                        { parent: actor },
                    );
                    out.data = { id: item.id, name: item.name, type: item.type, actorId: actor.id };
                    break;
                }
                case 'EQUIP': {
                    const item = getItem(args.item);
                    const equipped = args.equipped !== undefined ? args.equipped : true;
                    await item.update({ 'system.equipped': equipped });
                    out.data = { id: item.id, equipped: item.system.equipped };
                    break;
                }
                case 'MODIFY_GEAR': {
                    const item = getItem(args.item);
                    const update = buildUpdate(args.path, args.value);
                    await item.update(update);
                    const fullPath = args.path.startsWith('system.') ? args.path : `system.${args.path}`;
                    out.data = { id: item.id, path: fullPath, value: getByPath(item, fullPath) };
                    break;
                }
                case 'SET_STAT': {
                    const actor = getActor(args.actor);
                    const update = buildUpdate(args.path, args.value);
                    await actor.update(update);
                    const fullPath = args.path.startsWith('system.') ? args.path : `system.${args.path}`;
                    out.data = { id: actor.id, path: fullPath, value: getByPath(actor, fullPath) };
                    break;
                }
                case 'ASSERT': {
                    const actor = getActor(args.actor);
                    const path = args.path.startsWith('system.') ? args.path : `system.${args.path}`;
                    const actual = getByPath(actor, path);
                    if (actual !== args.equals && String(actual) !== String(args.equals)) {
                        throw new Error(`ASSERT failed: ${path} expected ${args.equals} got ${actual}`);
                    }
                    out.data = { path, actual };
                    break;
                }
                case 'ASSERT_EXISTS': {
                    getActor(args.actor);
                    out.data = { exists: true };
                    break;
                }
                case 'DELETE_ACTOR': {
                    const actor = getActor(args.actor);
                    await actor.delete();
                    out.data = { deleted: actor.id };
                    break;
                }
                case 'DELETE_ITEM': {
                    const item = getItem(args.item);
                    await item.delete();
                    out.data = { deleted: item.id };
                    break;
                }
                default:
                    throw new Error(`unknown in-world verb: ${verb}`);
            }
        } catch (e) {
            out.ok = false;
            out.error = e?.message ?? String(e);
        }

        return out;
    }, payload);

    if (!result.ok) {
        throw new Error(result.error ?? 'in-world command failed');
    }

    applyResult(ctx, cmd, result.data);
    return result.data;
}

function serializeCtx(ctx) {
    return {
        lastActorId: ctx.lastActorId,
        lastActorName: ctx.lastActorName,
        lastItemId: ctx.lastItemId,
        lastItemName: ctx.lastItemName,
        actorsByName: Object.fromEntries(ctx.actorsByName),
        itemsByName: Object.fromEntries(ctx.itemsByName),
    };
}

function applyResult(ctx, cmd, data) {
    if (!data) return;
    if (cmd.verb === 'CREATE_CHARACTER' && data.id) {
        ctx.lastActorId = data.id;
        ctx.lastActorName = data.name;
        ctx.actorsByName.set(data.name, data.id);
    }
    if (cmd.verb === 'CREATE_ITEM' && data.id) {
        ctx.lastItemId = data.id;
        ctx.lastItemName = data.name;
        ctx.itemsByName.set(data.name, data.id);
    }
    if (cmd.verb === 'OPEN_SHEET' && data.id) {
        ctx.openSheetActorId = data.id;
    }
    if (cmd.verb === 'DELETE_ACTOR' && data.deleted) {
        if (ctx.lastActorId === data.deleted) ctx.lastActorId = null;
    }
    if (cmd.verb === 'DELETE_ITEM' && data.deleted) {
        if (ctx.lastItemId === data.deleted) ctx.lastItemId = null;
    }
}
