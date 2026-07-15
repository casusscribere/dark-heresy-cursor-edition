import { chromium } from "playwright";
import { existsSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROFILE_PATH = join(__dirname, "foundry-join.profile.json");
const WEAPONS_DB_PATH = join(__dirname, "..", "..", "packs", "weapons.db");

function loadProfile() {
  try {
    if (!existsSync(PROFILE_PATH)) return {};
    return JSON.parse(readFileSync(PROFILE_PATH, "utf8"));
  } catch {
    return {};
  }
}

/** Plain compendium rows from `packs/weapons.db` when the live index omits new ids. */
function readWeaponDbFallbackById(ids) {
  const out = {};
  try {
    const text = readFileSync(WEAPONS_DB_PATH, "utf8");
    const want = new Set(ids);
    for (const line of text.trim().split("\n")) {
      if (!line) continue;
      const o = JSON.parse(line);
      if (o._id && want.has(o._id)) out[o._id] = o;
    }
  } catch {
    /* missing or unreadable */
  }
  return out;
}

const profile = loadProfile();

/** Env overrides `foundry-join.profile.json`, which overrides these defaults (DH3 local GM). */
const base = process.env.FOUNDRY_URL ?? profile.foundryUrl ?? "http://localhost:30000";
const userName = process.env.FOUNDRY_USER ?? profile.user ?? "cursor-gm";
const password = process.env.FOUNDRY_PASSWORD ?? profile.password ?? "";

/** First three bolt weapons on the Content Index Weapons sheet → compendium ids. */
const CONTENT_INDEX_BOLT_WEAPON_IDS = [
  { id: "sAyRuUW6uPMZ5U1I", name: "Bolt Pistol" },
  { id: "b0l7erUnkn0wnPtn", name: "Bolter Pattern" },
  { id: "cbIQ5g50PnYqxeDw", name: "Boltgun" },
];
const BOLT_TEST_ACTOR_NAME = "Bolt Test — Content Index";
const WEAPONS_PACK = "dark-heresy-3rd-edition.weapons";

/** @returns {{ visible: boolean, help: boolean }} */
function parseBrowserMode(argv) {
  const args = new Set(argv.slice(2));
  if (args.has("--help") || args.has("-h")) {
    return { visible: false, help: true };
  }
  const truthy = (v) => /^(1|true|yes|on)$/i.test(String(v ?? "").trim());
  const envVisible =
    truthy(process.env.FOUNDRY_VISIBLE) ||
    truthy(process.env.FOUNDRY_HEADED); // legacy

  if (args.has("--headless")) {
    return { visible: false, help: false };
  }
  if (args.has("--headed") || args.has("--visible") || args.has("-H")) {
    return { visible: true, help: false };
  }
  return { visible: envVisible, help: false };
}

async function pickUser(page) {
  const select = page.locator("select").first();
  if ((await select.count()) > 0) {
    try {
      await select.selectOption({ label: userName });
      return;
    } catch {
      await select.selectOption({ value: userName }).catch(() => {});
    }
  }
  const combo = page.getByRole("combobox").first();
  if ((await combo.count()) > 0) {
    await combo.click();
    await page.getByRole("option", { name: userName, exact: true }).click();
    return;
  }
  const byText = page.getByText(userName, { exact: true }).first();
  if ((await byText.count()) > 0) {
    await byText.click();
    return;
  }
  throw new Error("Could not find user picker (select/combobox/list) for " + userName);
}

async function fillPassword(page) {
  const pwd = page.locator('input[type="password"], input[name="password"]').first();
  if ((await pwd.count()) > 0) {
    await pwd.fill(password);
  }
}

async function clickJoin(page) {
  const join = page.getByRole("button", { name: /join\s*game/i }).first();
  if ((await join.count()) > 0) {
    await join.click();
    return;
  }
  const alt = page.locator('button[type="submit"], input[type="submit"]').first();
  if ((await alt.count()) > 0) {
    await alt.click();
    return;
  }
  throw new Error('Could not find "Join Game" button');
}

const argvSet = new Set(process.argv.slice(2));
const equipContentIndexBolts = argvSet.has("--equip-content-index-bolts");

const { visible, help } = parseBrowserMode(process.argv);
if (help) {
  console.log(`Usage: node join-foundry.mjs [options]

Browser window
  --headed, --visible, -H   Show Chromium (default is headless)
  --headless               Force headless even if FOUNDRY_VISIBLE is set

After join (GM only)
  --equip-content-index-bolts   Create/update "${BOLT_TEST_ACTOR_NAME}" (acolyte) and equip the
                                first three Content Index bolt weapons from the weapons compendium.

Headed mode keeps the browser open after a successful login so your session
stays active. Close the Chromium window (or press Ctrl+C here) to end.

Environment (optional)
  FOUNDRY_VISIBLE=1       Same as --headed (also accepts true/yes/on)
  FOUNDRY_HEADED=1        Legacy alias for FOUNDRY_VISIBLE
  FOUNDRY_REMOTE_DEBUG_PORT=9222  Enable remote debugging in headed mode
  FOUNDRY_URL, FOUNDRY_USER, FOUNDRY_PASSWORD

Defaults file (optional, same folder as this script)
  foundry-join.profile.json — keys: foundryUrl, user, password (DH3 default: cursor-gm, blank password).
  Environment variables override the profile when set.

CLI wins over environment when --headed and --headless are used.

Use -H (capital) for a visible window; -h shows this help.`);
  process.exit(0);
}

const headless = !visible;
const demoSlowMo = visible ? 120 : 0;
const remoteDebugPort = Number.parseInt(process.env.FOUNDRY_REMOTE_DEBUG_PORT ?? "0", 10);
const launchArgs = [];
if (visible && Number.isInteger(remoteDebugPort) && remoteDebugPort > 0) {
  launchArgs.push(`--remote-debugging-port=${remoteDebugPort}`);
}

const browser = await chromium.launch({
  headless,
  slowMo: demoSlowMo,
  args: launchArgs,
});
const page = await browser.newPage();
page.setDefaultTimeout(90_000);

let stayOpenAfterSuccess = visible;

try {
  await page.goto(`${base.replace(/\/$/, "")}/join`, { waitUntil: "load" });
  await page.bringToFront().catch(() => {});

  await page.waitForFunction(
    () =>
      !!document.querySelector("select") ||
      !!document.querySelector('[role="combobox"]') ||
      !!document.querySelector("form"),
    { timeout: 90_000 }
  );

  await pickUser(page);
  await fillPassword(page);
  await clickJoin(page);

  // Foundry often attaches #board before it becomes "visible" to Playwright; URL leaving /join is reliable.
  await page.waitForURL((url) => !String(url.pathname).endsWith("/join"), { timeout: 120_000 });

  let boltTestResult = null;
  if (equipContentIndexBolts) {
    await page.waitForFunction(() => globalThis.game?.ready === true, { timeout: 120_000 });
    const weaponDbFallback = readWeaponDbFallbackById(CONTENT_INDEX_BOLT_WEAPON_IDS.map((w) => w.id));
    boltTestResult = await page.evaluate(
      async ({ packId, actorName, weaponDefs, weaponDbFallback: fb }) => {
        const game = globalThis.game;
        if (!game?.user?.isGM) {
          return { ok: false, error: `User "${game?.user?.name ?? "?"}" is not GM; cannot create actor/items.` };
        }
        const pack = game.packs.get(packId);
        if (!pack) return { ok: false, error: `Compendium pack not found: ${packId}` };
        await pack.getIndex({ force: true });

        let actor = game.actors.find((a) => a.name === actorName);
        if (!actor) {
          const types = game.documentTypes?.Actor ?? [];
          const type = types.includes("acolyte") ? "acolyte" : types[0] ?? "character";
          actor = await Actor.create({ name: actorName, type, system: {} });
        }

        const names = weaponDefs.map((w) => w.name);
        const removeIds = actor.items.filter((i) => names.includes(i.name)).map((i) => i.id);
        if (removeIds.length) await actor.deleteEmbeddedDocuments("Item", removeIds);

        const dup = globalThis.foundry.utils.duplicate;
        const mergeObject = globalThis.foundry.utils.mergeObject;

        const payloads = [];
        for (const { id } of weaponDefs) {
          const doc = await pack.getDocument(id);
          if (doc) {
            const itemData = dup(doc.toObject());
            delete itemData._id;
            const sys = itemData.system ?? itemData.data ?? {};
            itemData.system = mergeObject(dup(sys), { equipped: true });
            delete itemData.data;
            payloads.push(itemData);
            continue;
          }
          const row = fb[id];
          if (!row)
            return {
              ok: false,
              error: `Weapon ${id} missing from compendium and local weapons.db fallback.`,
            };
          const sys = row.system ?? row.data ?? {};
          payloads.push({
            name: row.name,
            type: row.type || "weapon",
            img: row.img,
            system: mergeObject(dup(sys), { equipped: true }),
          });
        }
        const created = await actor.createEmbeddedDocuments("Item", payloads);
        return {
          ok: true,
          actorId: actor.id,
          actorName: actor.name,
          equipped: created.map((i) => ({ name: i.name, id: i.id })),
        };
      },
      {
        packId: WEAPONS_PACK,
        actorName: BOLT_TEST_ACTOR_NAME,
        weaponDefs: CONTENT_INDEX_BOLT_WEAPON_IDS,
        weaponDbFallback,
      }
    );
  }

  const url = page.url();
  console.log(
    JSON.stringify({
      ok: true,
      url,
      headless,
      stayOpen: stayOpenAfterSuccess,
      boltTest: boltTestResult,
    })
  );
} catch (err) {
  stayOpenAfterSuccess = false;
  await page.screenshot({ path: "join-error.png", fullPage: true }).catch(() => {});
  console.error(JSON.stringify({ ok: false, error: String(err?.message ?? err) }));
  process.exitCode = 1;
} finally {
  if (!stayOpenAfterSuccess) {
    await browser.close();
  }
}

if (stayOpenAfterSuccess) {
  console.error(
    "Foundry login complete. Chromium is left open so you stay logged in. Close the browser window or press Ctrl+C here to exit."
  );
  if (launchArgs.length > 0) {
    console.error(`Remote debugging endpoint: http://localhost:${remoteDebugPort}`);
  }
  const shutdown = async () => {
    try {
      await browser.close();
    } catch {
      /* ignore */
    }
    process.exit(0);
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
  await new Promise((resolve) => {
    browser.once("disconnected", resolve);
  });
}
