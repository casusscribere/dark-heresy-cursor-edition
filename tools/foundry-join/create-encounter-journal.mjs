import { chromium } from "playwright";

const DEBUG_URL = process.env.FOUNDRY_CDP_URL ?? "http://localhost:9222";
const JOURNAL_NAME = "Encounter: Ashes of the Eighth Charge";
const FOLDER_NAME = "Encounters";

const encounterHtml = `
<h1>Echoes of the Burning Skies</h1>
<p><strong>Encounter Title:</strong> Ashes of the Eighth Charge<br>
<strong>Threat:</strong> Mid<br>
<strong>Realm:</strong> Aqshy (Flamescar Plateau)<br>
<strong>Theme:</strong> Battle of Burning Skies echo (red dawn, daemonic pressure, illusion and betrayal)</p>

<h2>Premise</h2>
<p>A Chaos cult reenacts the Eighth Charge at a ruined lava-canal fort. Their ritual can turn a battlefield memory into a stable daemonic breach unless the Binding collapses it in time.</p>

<h2>Objectives</h2>
<ul>
  <li><strong>Primary:</strong> Collapse the ritual before the end of round 6.</li>
  <li><strong>Secondary:</strong> Rescue trapped militia pinned under burning debris.</li>
  <li><strong>Complication:</strong> Illusions create false weak points and decoy commanders.</li>
</ul>

<h2>Battlefield Features</h2>
<ul>
  <li><strong>Cinder Gale:</strong> End of each round, random zone becomes lightly obscured.</li>
  <li><strong>Heat Fissures:</strong> Unsafe movement over marked cracks causes minor fire damage.</li>
  <li><strong>Ritual Pylons (4):</strong> Each active pylon buffs one enemy role.</li>
</ul>

<h2>Enemy Composition (Mid Threat)</h2>
<ul>
  <li>1 Chaos Ritual Champion (leader/caster)</li>
  <li>2 Elite Bodyguards (bruisers)</li>
  <li>6-8 Cult Reavers (minions)</li>
  <li>1 Illusion Adept (controller)</li>
</ul>
<p><em>Scaling:</em> For larger/optimized groups, add 2 minions at start or 1 extra elite on round 3.</p>

<h2>Encounter Flow</h2>
<h3>Phase 1: Red Dawn (Rounds 1-2)</h3>
<ul>
  <li>Minions pressure civilians and pylon zones.</li>
  <li>Illusion Adept projects a decoy champion silhouette.</li>
</ul>

<h3>Phase 2: Fourfold Pressure (Rounds 3-4)</h3>
<ul>
  <li>Each active pylon grants one buff (damage, defense, speed, sorcery).</li>
  <li>Rift pulses force checks or apply burn/stagger conditions.</li>
</ul>

<h3>Phase 3: Eighth Charge (Rounds 5-6)</h3>
<ul>
  <li>Champion begins final cast sequence.</li>
  <li>If 2+ pylons remain active, minor daemon spillover appears.</li>
  <li>If the ritual completes, the breach stabilizes and the arc escalates.</li>
</ul>

<h2>Skill and Utility Opportunities</h2>
<ul>
  <li><strong>Arcana/Channeling:</strong> Disrupt a pylon (2 successes over 2 actions).</li>
  <li><strong>Athletics/Reflex:</strong> Pull a survivor from collapse.</li>
  <li><strong>Awareness/Insight:</strong> Identify the illusion source and expose decoys.</li>
  <li><strong>Leadership:</strong> Rally militia to hold one lane for 1 round.</li>
</ul>

<h2>Outcome Matrix</h2>
<ul>
  <li><strong>Full Victory:</strong> Ritual stopped, breach sealed, survivors saved, relic clue recovered.</li>
  <li><strong>Costly Victory:</strong> Breach sealed with heavy casualties and lingering taint.</li>
  <li><strong>Failure:</strong> Breach opens into a multi-session Burning Skies scar arc.</li>
</ul>

<h2>GM Tuning Knobs</h2>
<ul>
  <li><strong>Too hard:</strong> Remove one elite or one pylon buff.</li>
  <li><strong>Too easy:</strong> Increase pulse frequency or reinforce on round 4.</li>
  <li><strong>More urgency:</strong> Ritual clock is 5 rounds instead of 6.</li>
</ul>

<blockquote>
  <p><strong>Read-Aloud:</strong> "Seven steps took the storm, and none could stay him - yet the sky remembers the lie that turned the hammer's flight, and the red dawn hungers to happen again."</p>
</blockquote>
`;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
    async ({ folderName, journalName, html }) => {
      if (!globalThis.game?.ready) throw new Error("Foundry game is not ready.");

      // Confirm permission up front so failure is explicit.
      if (!globalThis.game.user?.isGM) {
        throw new Error(`Active user "${game.user?.name}" is not a GM; cannot create world journal entries.`);
      }

      let folder =
        game.folders.find((f) => f.type === "JournalEntry" && f.name === folderName) ?? null;
      if (!folder) {
        folder = await Folder.create({ name: folderName, type: "JournalEntry", color: "#a63a2b" });
      }

      const existing = game.journal.find((j) => j.name === journalName);
      const pageData = { name: "Encounter Sheet", type: "text", text: { format: 1, content: html } };

      if (existing) {
        const firstPage = existing.pages?.contents?.[0];
        if (firstPage) {
          await firstPage.update({ "text.content": html, "text.format": 1, name: "Encounter Sheet" });
        } else {
          await existing.createEmbeddedDocuments("JournalEntryPage", [pageData]);
        }
        await existing.update({ folder: folder.id });
        await existing.sheet.render(true);
        return { created: false, id: existing.id, name: existing.name };
      }

      const [created] = await JournalEntry.createDocuments([
        { name: journalName, folder: folder.id, pages: [pageData] },
      ]);
      await created.sheet.render(true);
      return { created: true, id: created.id, name: created.name };
    },
    { folderName: FOLDER_NAME, journalName: JOURNAL_NAME, html: encounterHtml }
  );

  // Give Foundry a moment to render newly opened sheet in UI.
  await sleep(700);
  console.log(JSON.stringify({ ok: true, ...result }));
} catch (err) {
  console.error(JSON.stringify({ ok: false, error: String(err?.message ?? err) }));
  process.exitCode = 1;
} finally {
  await browser.close();
}
