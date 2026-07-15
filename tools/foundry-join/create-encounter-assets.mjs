import { chromium } from "playwright";

const DEBUG_URL = process.env.FOUNDRY_CDP_URL ?? "http://localhost:9222";
const ENCOUNTER_NAME = "Encounter: Ashes of the Eighth Charge";
const FOLDER_NAME = "Encounter Assets";

const ACTOR_BLUEPRINTS = [
  {
    name: "Chaos Ritual Champion",
    quantity: 1,
    description:
      "Leader/caster. Commands ritual tempo, projects decoys, and channels final cast on rounds 5-6.",
  },
  {
    name: "Elite Bodyguard",
    quantity: 2,
    description:
      "Bruiser. Pins melee lanes and punishes disengage while pylons remain active.",
  },
  {
    name: "Cult Reaver",
    quantity: 8,
    description:
      "Minion. Pressures civilians and pylon zones; use in waves of 3-4.",
  },
  {
    name: "Illusion Adept",
    quantity: 1,
    description:
      "Controller. Spawns decoys and marks false weak points each round.",
  },
];

const ROLL_TABLES = [
  {
    name: "Ashes: Cinder Gale Zone",
    description: "End-of-round obscuration and movement hazard shifts.",
    formula: "1d6",
    results: [
      "North lane chokes with ash: ranged attacks are impaired until next round.",
      "East flank updraft: movement through fissures costs +1 zone.",
      "Center vortex: all ranged lines through center are obscured.",
      "South embers burst: first mover this round suffers minor fire damage.",
      "West glare: awareness checks to identify illusions are easier.",
      "Calm eye: remove one active obscuration effect this round.",
    ],
  },
  {
    name: "Ashes: Rift Pulse Effect",
    description: "Round 3+ pulse effect while ritual pylons remain active.",
    formula: "1d6",
    results: [
      "Warp burn: everyone in the ritual zone takes minor fire/spirit damage.",
      "Stagger wave: test or lose one action/step next activation.",
      "Daemonic static: casting/channeling checks become harder this round.",
      "False victory: a decoy target appears real until exposed.",
      "Reality tear: spawn 1 extra minion at nearest pylon.",
      "Backlash on cult: one enemy suffers the pulse instead.",
    ],
  },
];

function chooseActorType(game) {
  const types = game.documentTypes?.Actor ?? [];
  if (types.includes("npc")) return "npc";
  if (types.includes("threat")) return "threat";
  if (types.includes("creature")) return "creature";
  if (types.length > 0) return types[0];
  return "character";
}

const browser = await chromium.connectOverCDP(DEBUG_URL);

try {
  const context = browser.contexts()[0];
  if (!context) throw new Error("No browser context found on remote debug session.");
  const pages = context.pages();
  const gamePage =
    pages.find((p) => p.url().includes("/game")) ??
    pages.find((p) => p.url().includes("localhost:30000"));
  if (!gamePage) throw new Error("Could not find an open Foundry game tab.");

  await gamePage.bringToFront();
  await gamePage.waitForLoadState("domcontentloaded");

  const result = await gamePage.evaluate(
    async ({ encounterName, folderName, actorBlueprints, rollTables }) => {
      if (!globalThis.game?.ready) throw new Error("Foundry game is not ready.");
      if (!game.user?.isGM) throw new Error(`Active user "${game.user?.name}" is not a GM.`);

      const findFolder = (type, name) =>
        game.folders.find((f) => f.type === type && f.name === name) ?? null;

      const ensureFolder = async (type, name, color = "#7f1d1d") => {
        let folder = findFolder(type, name);
        if (!folder) folder = await Folder.create({ name, type, color });
        return folder;
      };

      const actorFolder = await ensureFolder("Actor", folderName, "#8b1f1f");
      const tableFolder = await ensureFolder("RollTable", folderName, "#87330f");

      const actorType = (() => {
        const types = game.documentTypes?.Actor ?? [];
        if (types.includes("npc")) return "npc";
        if (types.includes("threat")) return "threat";
        if (types.includes("creature")) return "creature";
        return types[0] ?? "character";
      })();

      const createdActors = [];
      for (const bp of actorBlueprints) {
        const actorName = bp.quantity > 1 ? `${bp.name} (x${bp.quantity})` : bp.name;
        let actor = game.actors.find((a) => a.name === actorName) ?? null;
        if (!actor) {
          actor = await Actor.create({
            name: actorName,
            type: actorType,
            folder: actorFolder.id,
            prototypeToken: { disposition: -1 },
            system: {},
          });
          createdActors.push(actorName);
        } else if (actor.folder?.id !== actorFolder.id) {
          await actor.update({ folder: actorFolder.id });
        }

        const descPath = actor?.system?.details?.biography ? "system.details.biography.value" : "system.details.notes";
        await actor.update({ [descPath]: bp.description }).catch(() => {});
      }

      const createdTables = [];
      for (const tableDef of rollTables) {
        let table = game.tables.find((t) => t.name === tableDef.name) ?? null;
        if (!table) {
          table = await RollTable.create({
            name: tableDef.name,
            formula: tableDef.formula,
            folder: tableFolder.id,
            description: tableDef.description,
            replacement: true,
            displayRoll: true,
          });
          createdTables.push(tableDef.name);
        } else if (table.folder?.id !== tableFolder.id) {
          await table.update({ folder: tableFolder.id });
        }

        const results = tableDef.results.map((text, i) => ({
          type: CONST.TABLE_RESULT_TYPES.TEXT,
          text,
          weight: 1,
          range: [i + 1, i + 1],
          drawn: false,
        }));

        if (table.results.size > 0) {
          await table.deleteEmbeddedDocuments("TableResult", table.results.contents.map((r) => r.id));
        }
        await table.createEmbeddedDocuments("TableResult", results);
        await table.normalize();
      }

      const journal =
        game.journal.find((j) => j.name === encounterName) ??
        game.journal.find((j) => j.name.includes("Ashes of the Eighth Charge"));
      if (!journal) throw new Error(`Journal "${encounterName}" was not found.`);
      const page = journal.pages?.contents?.[0] ?? null;

      const scene = game.scenes.active ?? game.scenes.contents[0] ?? null;
      if (!scene) throw new Error("No scene found to place a note.");

      const noteLabel = "Ashes of the Eighth Charge";
      const existing =
        scene.notes.find((n) => n.text === noteLabel) ??
        scene.notes.find((n) => n.entryId === journal.id || n.journalEntryId === journal.id) ??
        null;

      const baseData = {
        x: Math.round((scene.width ?? 4000) / 2),
        y: Math.round((scene.height ?? 3000) / 2),
        text: noteLabel,
        iconSize: 48,
        textAnchor: CONST.TEXT_ANCHOR_POINTS.TOP,
        textColor: "#ffe6a7",
        fontSize: 28,
      };

      const linkData =
        page != null
          ? { entryId: journal.id, pageId: page.id, journalEntryId: journal.id, journalEntryPageId: page.id }
          : { entryId: journal.id, journalEntryId: journal.id };

      let noteAction = "updated";
      if (existing) {
        await existing.update({ ...baseData, ...linkData });
      } else {
        await scene.createEmbeddedDocuments("Note", [{ ...baseData, ...linkData }]);
        noteAction = "created";
      }

      await journal.sheet.render(true);
      await scene.view();

      return {
        ok: true,
        actorType,
        createdActors,
        createdTables,
        noteAction,
        sceneName: scene.name,
      };
    },
    {
      encounterName: ENCOUNTER_NAME,
      folderName: FOLDER_NAME,
      actorBlueprints: ACTOR_BLUEPRINTS,
      rollTables: ROLL_TABLES,
    }
  );

  console.log(JSON.stringify(result));
} catch (err) {
  console.error(JSON.stringify({ ok: false, error: String(err?.message ?? err) }));
  process.exitCode = 1;
} finally {
  await browser.close();
}
