---
description: AI-optimized index of RT_GDRIVE Content Index.xlsx mapped to Dark Heresy 3rd Edition Foundry compendia.
---

# Content Index → DH3 Foundry VTT

**Source spreadsheet:** `C:\Users\kirkl\OneDrive\Documents\ROGUE_TRADER\AI_available_materials\RT_GDRIVE\Content Index.xlsx`

**Machine-readable map (all rows):** [content-index-foundry-map.json](content-index-foundry-map.json)

**Regenerate** after editing the spreadsheet: export sheets to `docs/content-index-full.json` (same schema as produced from the `.xlsx` via the `xlsx` npm package), then run `node tools/build-content-index-map.cjs` (optional env: `CONTENT_INDEX_JSON`).

## Using in Cursor

- Attach **`docs/CONTENT_INDEX_VTT_REFERENCE.md`** when you need campaign loot, NPC gear, or voidship components by name; use the **Complete index** table for **DH3** compendium pack ids and item names.
- Prefer **`docs/content-index-foundry-map.json`** for scripts: each record has `snapshot` (spreadsheet fields) and `dh3.matches[]` with `compendium`, `itemId`, `itemType`.
- Rows with **`n-a`** or **no compendium match** are still valid campaign data: implement as a custom **Item** (`template.json`), **Actor** (`enemy`, acolyte), or **JournalEntry**.

## Legend

- **snapshot** fields in JSON are spreadsheet columns with empty cells removed — safe context for LLMs.
- **Compendium slug** format: `dark-heresy-3rd-edition.<pack>` where pack is one of: `weapons, armour, ammo, weapon-mods, attack-specials, consumables, tools, cybernetics, psychic-powers, talents, traits`.
- **matchConfidence:** `exact` | `substring` | `substring-best` | `exact-ambiguous` | `ambiguous` | `none` | `n-a` (non-item sheets).
- **Modifications sheet:** `Cat` A → ammo, W → weapon-mods, R/V → also search weapon-mods (armour/vehicle flavour — often custom).

## Implementability

| DH3 compendium | Item types |
|----------------|------------|
| weapons | weapon |
| armour | armour |
| ammo | ammunition |
| weapon-mods | weaponModification |
| attack-specials | attackSpecial |
| consumables | consumable, drug |
| tools | tool |
| cybernetics | cybernetic |
| psychic-powers | psychicPower |
| talents | talent |
| traits | trait |

**Not in compendia:** vehicles, voidship components, squads, allies, services, creatures — model as **Actor**, **JournalEntry**, or homebrew **Item** using `template.json` types (`enemy`, etc.) where supported.

## Match statistics

```json
{
  "Weapons|exact": 133,
  "Weapons|none": 111,
  "Weapons|substring-best": 2,
  "Weapons|substring": 15,
  "Weapons|exact-ambiguous": 3,
  "Armor|exact": 23,
  "Armor|none": 23,
  "Armor|substring": 1,
  "Modifications|substring": 1,
  "Modifications|exact": 54,
  "Modifications|none": 47,
  "Gear & Tools|exact": 33,
  "Gear & Tools|none": 44,
  "Drugs|exact": 13,
  "Drugs|none": 6,
  "PsyPwrs|none": 12,
  "PsyPwrs|substring": 1,
  "Cybernetics etc|exact": 23,
  "Cybernetics etc|substring": 3,
  "Cybernetics etc|none": 7,
  "Unique Wpns|none": 33,
  "Unique Wpns|exact": 5,
  "Unique Wpns|substring": 3,
  "Uniques|none": 60,
  "Uniques|substring": 1,
  "V Weps|none": 19,
  "V Weps|substring-best": 1,
  "V Weps|substring": 2,
  "Services|n-a": 23,
  "Vehicles|n-a": 46,
  "Creatures|n-a": 20,
  "VS Hull|n-a": 36,
  "Squads|n-a": 6,
  "Allies|n-a": 43,
  "VS Ess|n-a": 99,
  "VS Wpns|n-a": 69,
  "VS Supp|n-a": 107,
  "VS Upgs|n-a": 21,
  "VS Etc|n-a": 29
}
```

## Per-sheet sample (first 3 rows each)

### Allies

- **Harlan Sneed** — `n-a` — *No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro.*
- **Austros Kokolias** — `n-a` — *No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro.*
- **Charin** — `n-a` — *No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro.*

### Armor

- **Armoured Bodyglove** — `exact` — `dark-heresy-3rd-edition.armour` / Armoured Bodyglove
- **Chainmail Suit** — `exact` — `dark-heresy-3rd-edition.armour` / Chainmail Suit
- **Feudal World Plate** — `exact` — `dark-heresy-3rd-edition.armour` / Feudal World Plate

### Creatures

- **Grizdek Slithercatch** — `n-a` — *No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro.*
- **Tau Drone** — `n-a` — *No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro.*
- **Demiurg Turret** — `n-a` — *No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro.*

### Cybernetics etc

- **Augur Array** — `exact` — `dark-heresy-3rd-edition.cybernetics` / Augur Array
- **Autosanguine** — `exact` — `dark-heresy-3rd-edition.cybernetics` / Autosanguine
- **Baleful Eye** — `exact` — `dark-heresy-3rd-edition.cybernetics` / Baleful Eye

### Drugs

- **Amasec** — `exact` — `dark-heresy-3rd-edition.consumables` / Amasec
- **Desoleum Fungus** — `exact` — `dark-heresy-3rd-edition.consumables` / Desoleum Fungus
- **De-Tox** — `exact` — `dark-heresy-3rd-edition.consumables` / De-Tox

### Gear & Tools

- **Auspex/Scanner** — `exact` — `dark-heresy-3rd-edition.tools` / Auspex/Scanner
- **Auto Quill** — `exact` — `dark-heresy-3rd-edition.tools` / Auto Quill
- **Backpack** — `none` — *no compendium match*

### Modifications

- **Abyssal Bolts** — `substring` — `dark-heresy-3rd-edition.ammo` / Abyssal Bolt
- **Amputator Shells** — `exact` — `dark-heresy-3rd-edition.ammo` / Amputator Shells
- **Banestrike Rounds** — `none` — *no compendium match*

### PsyPwrs

- **Powa' Burst** — `none` — *no compendium match*
- **Frazzle** — `none` — *no compendium match*
- **Up an' at 'Em** — `none` — *no compendium match*

### Services

- **Accomodations** — `n-a` — *No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro.*
- **Accomodations** — `n-a` — *No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro.*
- **Accomodations** — `n-a` — *No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro.*

### Squads

- **Abaoth Armsmen** — `n-a` — *No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro.*
- **Yeldi Fire Warrior Cadre** — `n-a` — *No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro.*
- **Rawne's Raiders** — `n-a` — *No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro.*

### Unique Wpns

- **Ame-no, Ward of the Peaks** — `none` — *no compendium match*
- **Ancient Bolt-Action Rifle** — `none` — *no compendium match*
- **Anzion's Pseudogenitor** — `none` — *no compendium match*

### Uniques

- **5x Buglike Xenos heads on a string** — `none` — *no compendium match*
- **Alien organ in a stasis chamber** — `none` — *no compendium match*
- **Ancient Astartes Power Armor** — `none` — *no compendium match*

### V Weps

- **--** — `none` — *no compendium match*
- **Ancient Heavy Flamer(Sponson)** — `substring-best` — `dark-heresy-3rd-edition.weapons` / Heavy Flamer
- **Ancient Lascannon** — `none` — *no compendium match*

### VS Ess

- **Auto-Stabilised Logis-Targeter** — `n-a` — *No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro.*
- **BG-15 Assault Scanners** — `n-a` — *No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro.*
- **Deep Void Augur Array** — `n-a` — *No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro.*

### VS Etc

- **Krakenslayer** — `n-a` — *No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro.*
- **Planetbound for Millenia** — `n-a` — *No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro.*
- **Reaver of the Unbeholden Reaches** — `n-a` — *No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro.*

### VS Hull

- **Armageddon** — `n-a` — *No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro.*
- **Chalice** — `n-a` — *No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro.*
- **Mars** — `n-a` — *No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro.*

### VS Supp

- **"Storm" Drop Pod Launch Bays** — `n-a` — *No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro.*
- **Arboretum** — `n-a` — *No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro.*
- **Arboretum** — `n-a` — *No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro.*

### VS Upgs

- **Arrester Engines** — `n-a` — *No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro.*
- **Astartes Detachment** — `n-a` — *No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro.*
- **Atomics** — `n-a` — *No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro.*

### VS Wpns

- **Gauss Cannon** — `n-a` — *No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro.*
- **Dawnbringer** — `n-a` — *No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro.*
- **Dragon's Breath Lance Weapon** — `n-a` — *No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro.*

### Vehicles

- **--** — `n-a` — *No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro.*
- **Lux-equus** — `n-a` — *No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro.*
- **Grizdek Slithercatch** — `n-a` — *No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro.*

### Weapons

- **Bolt Pistol** — `exact` — `dark-heresy-3rd-edition.weapons` / Bolt Pistol
- **Bolter[???-pattern]** — `exact` — `dark-heresy-3rd-edition.weapons` / Bolter Pattern
- **Boltgun** — `exact` — `dark-heresy-3rd-edition.weapons` / Boltgun


## Complete index (all spreadsheet rows)

| Sheet | Name | Row | Confidence | DH3 compendium / note |
|---|---|--:|---|---|
| Weapons | Bolt Pistol | 2 | exact | `dark-heresy-3rd-edition.weapons` **Bolt Pistol** |
| Weapons | Bolter[???-pattern] | 3 | exact | `dark-heresy-3rd-edition.weapons` **Bolter Pattern** |
| Weapons | Boltgun | 4 | exact | `dark-heresy-3rd-edition.weapons` **Boltgun** |
| Weapons | Godwyn-De’az Bolt Pistol | 5 | exact | `dark-heresy-3rd-edition.weapons` **Godwyn-Deaz Bolt Pistol** |
| Weapons | Godwyn-De’az Bolter | 6 | exact | `dark-heresy-3rd-edition.weapons` **Godwyn-Deaz Bolter** |
| Weapons | Godwyn-De’az Heavy Bolter | 7 | exact | `dark-heresy-3rd-edition.weapons` **Godwyn-Deaz Heavy Bolter** |
| Weapons | Godwyn-De’az Storm Bolter | 8 | exact | `dark-heresy-3rd-edition.weapons` **Godwyn-Deaz Storm Bolter** |
| Weapons | Heavy Bolter | 9 | exact | `dark-heresy-3rd-edition.weapons` **Heavy Bolter** |
| Weapons | Psycannon | 10 | exact | `dark-heresy-3rd-edition.weapons` **Psycannon** |
| Weapons | Storm Bolter | 11 | exact | `dark-heresy-3rd-edition.weapons` **Storm Bolter** |
| Weapons | Chainaxe | 12 | exact | `dark-heresy-3rd-edition.weapons` **Chainaxe** |
| Weapons | Chainblade | 13 | exact | `dark-heresy-3rd-edition.weapons` **Chainblade** |
| Weapons | Chainsword | 14 | exact | `dark-heresy-3rd-edition.weapons` **Chainsword** |
| Weapons | Eviscerator | 15 | exact | `dark-heresy-3rd-edition.weapons` **Eviscerator** |
| Weapons | Thing | 16 | none | *no compendium match* |
| Weapons | Grind-Axe | 17 | none | *no compendium match* |
| Weapons | Ablative Projector | 18 | none | *no compendium match* |
| Weapons | Adherence Grenade | 19 | none | *no compendium match* |
| Weapons | Æther Blade | 20 | none | *no compendium match* |
| Weapons | Agonizer | 21 | none | *no compendium match* |
| Weapons | Akvran Cutter | 22 | none | *no compendium match* |
| Weapons | Antimatter Assault Rifle | 23 | none | *no compendium match* |
| Weapons | Antimatter Pistol | 24 | none | *no compendium match* |
| Weapons | Arc Pistol | 25 | none | *no compendium match* |
| Weapons | Arc Rifle | 26 | none | *no compendium match* |
| Weapons | Arrow of Light | 27 | none | *no compendium match* |
| Weapons | Assault Launcher (Melee) | 28 | none | *no compendium match* |
| Weapons | Assault Launcher (Ranged) | 29 | none | *no compendium match* |
| Weapons | Astartes Bolt Pistol | 30 | exact | `dark-heresy-3rd-edition.weapons` **Astartes Bolt Pistol** |
| Weapons | Astartes Bolter | 31 | exact | `dark-heresy-3rd-edition.weapons` **Astartes Bolter** |
| Weapons | Astartes Combi-Bolter | 32 | exact | `dark-heresy-3rd-edition.weapons` **Astartes Combi-Bolter** |
| Weapons | Astartes Chainsword | 33 | substring-best | `dark-heresy-3rd-edition.weapons` **Chainsword** |
| Weapons | Astartes Infernus Pistol | 34 | none | *no compendium match* |
| Weapons | Astartes Lightning Claw | 35 | none | *no compendium match* |
| Weapons | Astartes Plasma Pistol | 36 | substring | `dark-heresy-3rd-edition.weapons` **Plasma Pistol** |
| Weapons | Astartes Power Fist | 37 | substring | `dark-heresy-3rd-edition.weapons` **Power Fist** |
| Weapons | Astartes Power Sword | 38 | substring-best | `dark-heresy-3rd-edition.weapons` **Power Sword** |
| Weapons | Astartes Storm Shield | 39 | substring | `dark-heresy-3rd-edition.weapons` **Shield** |
| Weapons | Astartes Thunder Hammer | 40 | substring | `dark-heresy-3rd-edition.weapons` **Thunder Hammer** |
| Weapons | Beast Choppa | 41 | none | *no compendium match* |
| Weapons | Beast Shoota | 42 | none | *no compendium match* |
| Weapons | Beast Slugga | 43 | none | *no compendium match* |
| Weapons | Big Choppa | 44 | none | *no compendium match* |
| Weapons | Big Shoota | 45 | none | *no compendium match* |
| Weapons | Blast Shield | 46 | substring | `dark-heresy-3rd-edition.weapons` **Shield** |
| Weapons | Breacher Charge | 47 | none | *no compendium match* |
| Weapons | Burna | 48 | none | *no compendium match* |
| Weapons | Burna (melee) | 49 | none | *no compendium match* |
| Weapons | Cascade Lance (melee) | 50 | none | *no compendium match* |
| Weapons | Cascade Lance (ranged) | 51 | none | *no compendium match* |
| Weapons | Charge Pistol | 52 | none | *no compendium match* |
| Weapons | Charge Rifle | 53 | none | *no compendium match* |
| Weapons | Choppa | 54 | none | *no compendium match* |
| Weapons | Concussion Beamer | 55 | none | *no compendium match* |
| Weapons | Condemnor | 56 | exact | `dark-heresy-3rd-edition.weapons` **Condemnor** |
| Weapons | Digi-Weapon | 57 | exact | `dark-heresy-3rd-edition.weapons` **Digi-Weapon** |
| Weapons | Firesprite Needler | 58 | exact | `dark-heresy-3rd-edition.weapons` **Firesprite Needler** |
| Weapons | Ghost Blade | 59 | exact | `dark-heresy-3rd-edition.weapons` **Ghost Blade** |
| Weapons | Grav Hammer | 60 | none | *no compendium match* |
| Weapons | Grav Pistol | 61 | exact | `dark-heresy-3rd-edition.weapons` **Grav Pistol** |
| Weapons | Graviton Grenade | 62 | exact | `dark-heresy-3rd-edition.weapons` **Graviton Grenade** |
| Weapons | Graviton Gun | 63 | exact | `dark-heresy-3rd-edition.weapons` **Graviton Gun** |
| Weapons | Graviton Hammer | 64 | exact | `dark-heresy-3rd-edition.weapons` **Graviton Hammer** |
| Weapons | Guldaniri Bile Projector | 65 | none | *no compendium match* |
| Weapons | Harlequin's Kiss | 66 | none | *no compendium match* |
| Weapons | Havatian Ringblade (melee) | 67 | none | *no compendium match* |
| Weapons | Havatian Ringblade (Ranged) | 68 | none | *no compendium match* |
| Weapons | Hoplite Shield | 69 | substring | `dark-heresy-3rd-edition.weapons` **Shield** |
| Weapons | Hoplite Spear | 70 | substring | `dark-heresy-3rd-edition.weapons` **Spear** |
| Weapons | Integration Cannon | 71 | exact | `dark-heresy-3rd-edition.weapons` **Integration Cannon** |
| Weapons | Kroot Rifle (Pulse configuration) | 72 | none | *no compendium match* |
| Weapons | Kroot Rifle (Sniper configuration) | 73 | none | *no compendium match* |
| Weapons | Kyaire Riveblade Grenade | 74 | none | *no compendium match* |
| Weapons | Lascutter | 75 | none | *no compendium match* |
| Weapons | Longshot Pulse Rifle | 76 | none | *no compendium match* |
| Weapons | Molecular Blade | 77 | none | *no compendium match* |
| Weapons | MP Thermo-cutter | 78 | none | *no compendium match* |
| Weapons | Needle Pistol | 79 | exact | `dark-heresy-3rd-edition.weapons` **Needle Pistol** |
| Weapons | Needle Rifle | 80 | exact | `dark-heresy-3rd-edition.weapons` **Needle Rifle** |
| Weapons | Neural Catalyzer | 81 | none | *no compendium match* |
| Weapons | Photon Grenade | 82 | none | *no compendium match* |
| Weapons | Plasma Caliver | 83 | none | *no compendium match* |
| Weapons | Plasma Grenade | 84 | none | *no compendium match* |
| Weapons | Power Gauntlet | 85 | none | *no compendium match* |
| Weapons | Power Sword | 86 | exact | `dark-heresy-3rd-edition.weapons` **Power Sword** |
| Weapons | Praetor Blade | 87 | none | *no compendium match* |
| Weapons | Praetor Shield | 88 | substring | `dark-heresy-3rd-edition.weapons` **Shield** |
| Weapons | Pulse Carbine | 89 | none | *no compendium match* |
| Weapons | Pulse Pistol | 90 | none | *no compendium match* |
| Weapons | Pulse Rifle | 91 | none | *no compendium match* |
| Weapons | Purgatus Crossbow | 92 | exact | `dark-heresy-3rd-edition.weapons` **Purgatus Crossbow** |
| Weapons | Quillgun | 93 | exact | `dark-heresy-3rd-edition.weapons` **Quillgun** |
| Weapons | Rad Axe | 94 | none | *no compendium match* |
| Weapons | Radium Pistol | 95 | none | *no compendium match* |
| Weapons | Rail Rifle | 96 | none | *no compendium match* |
| Weapons | Razor Gun | 97 | none | *no compendium match* |
| Weapons | Razorquill | 98 | none | *no compendium match* |
| Weapons | Resonance Arc | 99 | none | *no compendium match* |
| Weapons | Rokkit Launcha | 100 | none | *no compendium match* |
| Weapons | Shardcarbine | 101 | none | *no compendium match* |
| Weapons | Shoota | 102 | none | *no compendium match* |
| Weapons | Shuriken Cannon | 103 | none | *no compendium match* |
| Weapons | Shuriken Catapult | 104 | none | *no compendium match* |
| Weapons | Shuriken Pistol | 105 | none | *no compendium match* |
| Weapons | Silver Shield | 106 | exact | `dark-heresy-3rd-edition.weapons` **Silver Shield** |
| Weapons | Slugga | 107 | none | *no compendium match* |
| Weapons | Splinter Cannon | 108 | none | *no compendium match* |
| Weapons | Splinter Pistol | 109 | none | *no compendium match* |
| Weapons | Splinter Rifle | 110 | none | *no compendium match* |
| Weapons | Stikkbomb | 111 | none | *no compendium match* |
| Weapons | Talonblade | 112 | none | *no compendium match* |
| Weapons | Transuranic Arquebus | 113 | substring | `dark-heresy-3rd-edition.weapons` **Arquebus** |
| Weapons | Thermo-cutter (industrial) | 114 | none | *no compendium match* |
| Weapons | Web Pistol | 115 | exact | `dark-heresy-3rd-edition.weapons` **Web Pistol** |
| Weapons | Webber | 116 | exact | `dark-heresy-3rd-edition.weapons` **Webber** |
| Weapons | Volkite Disruptor | 117 | none | *no compendium match* |
| Weapons | Xenarch Death-Arc | 118 | none | *no compendium match* |
| Weapons | Fire Bomb | 119 | exact | `dark-heresy-3rd-edition.weapons` **Fire Bomb** |
| Weapons | Melta Bomb | 120 | exact | `dark-heresy-3rd-edition.weapons` **Melta Bomb** |
| Weapons | Brazier of Holy Fire | 121 | exact | `dark-heresy-3rd-edition.weapons` **Brazier of Holy Fire** |
| Weapons | Cerberus Heavy Flamer | 122 | exact | `dark-heresy-3rd-edition.weapons` **Cerberus Heavy Flamer** |
| Weapons | Expurgator | 123 | none | *no compendium match* |
| Weapons | Exterminator | 124 | none | *no compendium match* |
| Weapons | Extirpator | 125 | none | *no compendium match* |
| Weapons | Fire Gauntlets | 126 | exact | `dark-heresy-3rd-edition.weapons` **Fire Gauntlets** |
| Weapons | Flamer | 127 | exact | `dark-heresy-3rd-edition.weapons` **Flamer** |
| Weapons | Gorgon Chemical Flamer | 128 | exact | `dark-heresy-3rd-edition.weapons` **Gorgon Chemical Flamer** |
| Weapons | Hand Flamer | 129 | exact | `dark-heresy-3rd-edition.weapons` **Hand Flamer** |
| Weapons | Heavy Flamer | 130 | exact | `dark-heresy-3rd-edition.weapons` **Heavy Flamer** |
| Weapons | Hydra Flamer Array | 131 | exact | `dark-heresy-3rd-edition.weapons` **Hydra Flamer Array** |
| Weapons | Incinerator | 132 | exact | `dark-heresy-3rd-edition.weapons` **Incinerator** |
| Weapons | Animus Hammer | 133 | exact | `dark-heresy-3rd-edition.weapons` **Animus Hammer** |
| Weapons | Force Hammer | 134 | exact | `dark-heresy-3rd-edition.weapons` **Force Hammer** |
| Weapons | Force Staff | 135 | exact | `dark-heresy-3rd-edition.weapons` **Force Staff** |
| Weapons | Force Sword | 136 | exact | `dark-heresy-3rd-edition.weapons` **Force Sword** |
| Weapons | Nemesis Daemon Hammer | 137 | exact | `dark-heresy-3rd-edition.weapons` **Nemesis Daemon Hammer** |
| Weapons | Sanctus Hammer | 138 | none | *no compendium match* |
| Weapons | Tempus Hammer | 139 | exact | `dark-heresy-3rd-edition.weapons` **Tempus Hammer** |
| Weapons | Blind Grenade | 140 | exact | `dark-heresy-3rd-edition.weapons` **Blind Grenade** |
| Weapons | Choke Grenade | 141 | exact | `dark-heresy-3rd-edition.weapons` **Choke Grenade** |
| Weapons | Cryo Grenade | 142 | none | *no compendium match* |
| Weapons | Explosive Charge | 143 | none | *no compendium match* |
| Weapons | Frag Grenade | 144 | exact | `dark-heresy-3rd-edition.weapons` **Frag Grenade** |
| Weapons | Frag Lance | 145 | none | *no compendium match* |
| Weapons | Frag Missile | 146 | exact | `dark-heresy-3rd-edition.weapons` **Frag Missile** |
| Weapons | Gas Grenade | 147 | none | *no compendium match* |
| Weapons | Hallucinogen Grenade | 148 | exact | `dark-heresy-3rd-edition.weapons` **Hallucinogen Grenade** |
| Weapons | Haywire Grenade | 149 | exact | `dark-heresy-3rd-edition.weapons` **Haywire Grenade** |
| Weapons | Howler Grenade | 150 | none | *no compendium match* |
| Weapons | Immolator (grenade) | 151 | none | *no compendium match* |
| Weapons | Immolator (missile) | 152 | none | *no compendium match* |
| Weapons | Incarcerator (missile) | 153 | none | *no compendium match* |
| Weapons | Incinerator (grenade) | 154 | substring | `dark-heresy-3rd-edition.weapons` **Incinerator** |
| Weapons | Incinerator (missile) | 155 | substring | `dark-heresy-3rd-edition.weapons` **Incinerator** |
| Weapons | Krak Grenade | 156 | exact | `dark-heresy-3rd-edition.weapons` **Krak Grenade** |
| Weapons | Krak Missile | 157 | exact | `dark-heresy-3rd-edition.weapons` **Krak Missile** |
| Weapons | Melta Lance | 158 | none | *no compendium match* |
| Weapons | Photon Flash Grenade | 159 | exact | `dark-heresy-3rd-edition.weapons` **Photon Flash Grenade** |
| Weapons | Psychotroke Grenade | 160 | exact | `dark-heresy-3rd-edition.weapons` **Psychotroke Grenade** |
| Weapons | Psyk-Out Grenade | 161 | exact-ambiguous | `dark-heresy-3rd-edition.weapons` **Psyk-Out Grenade** |
| Weapons | Rad Grenade | 162 | exact | `dark-heresy-3rd-edition.weapons` **Rad Grenade** |
| Weapons | Shock Grenade | 163 | none | *no compendium match* |
| Weapons | Smoke Grenade | 164 | exact | `dark-heresy-3rd-edition.weapons` **Smoke Grenade** |
| Weapons | Spore Bomb | 165 | exact | `dark-heresy-3rd-edition.weapons` **Spore Bomb** |
| Weapons | Stun Grenade | 166 | exact | `dark-heresy-3rd-edition.weapons` **Stun Grenade** |
| Weapons | Stunner | 167 | none | *no compendium match* |
| Weapons | Tears of the Emperor | 168 | exact | `dark-heresy-3rd-edition.weapons` **Tears of the Emperor** |
| Weapons | Web Grenade | 169 | exact | `dark-heresy-3rd-edition.weapons` **Web Grenade** |
| Weapons | Whitefire Grenade | 170 | exact | `dark-heresy-3rd-edition.weapons` **Whitefire Grenade** |
| Weapons | Hot-shot Lasgun | 171 | exact | `dark-heresy-3rd-edition.weapons` **Hot-shot Lasgun** |
| Weapons | Hot-shot Laspistol | 172 | exact | `dark-heresy-3rd-edition.weapons` **Hot-shot Laspistol** |
| Weapons | Lascaliver | 173 | none | *no compendium match* |
| Weapons | Lasgun | 174 | exact | `dark-heresy-3rd-edition.weapons` **Lasgun** |
| Weapons | Laslock | 175 | exact | `dark-heresy-3rd-edition.weapons` **Laslock** |
| Weapons | Laspistol | 176 | exact | `dark-heresy-3rd-edition.weapons` **Laspistol** |
| Weapons | Long-Las | 177 | exact | `dark-heresy-3rd-edition.weapons` **Long-Las** |
| Weapons | ??? Rotary Las weapon | 178 | none | *no compendium match* |
| Weapons | Grenade Launcher | 179 | exact | `dark-heresy-3rd-edition.weapons` **Grenade Launcher** |
| Weapons | Missile Launcher | 180 | exact | `dark-heresy-3rd-edition.weapons` **Missile Launcher** |
| Weapons | Vanquisher | 181 | none | *no compendium match* |
| Weapons | Vindicator | 182 | none | *no compendium match* |
| Weapons | Arquebus | 183 | exact | `dark-heresy-3rd-edition.weapons` **Arquebus** |
| Weapons | Axe of Retribution | 184 | exact | `dark-heresy-3rd-edition.weapons` **Axe of Retribution** |
| Weapons | Bolas | 185 | exact | `dark-heresy-3rd-edition.weapons` **Bolas** |
| Weapons | Bow | 186 | exact | `dark-heresy-3rd-edition.weapons` **Bow** |
| Weapons | Castigator Heavy Crossbow | 187 | exact | `dark-heresy-3rd-edition.weapons` **Castigator Heavy Crossbow** |
| Weapons | Crossbow | 188 | exact | `dark-heresy-3rd-edition.weapons` **Crossbow** |
| Weapons | Deliverance Light Crossbow | 189 | exact | `dark-heresy-3rd-edition.weapons` **Deliverance Light Crossbow** |
| Weapons | Drake’s Claw | 190 | exact | `dark-heresy-3rd-edition.weapons` **Drakes Claw** |
| Weapons | Flail of Chastisement | 191 | exact | `dark-heresy-3rd-edition.weapons` **Flail of Chastisement** |
| Weapons | Flintlock Pistol | 192 | exact | `dark-heresy-3rd-edition.weapons` **Flintlock Pistol** |
| Weapons | Great Weapon | 193 | exact | `dark-heresy-3rd-edition.weapons` **Great Weapon** |
| Weapons | Hunting Lance | 194 | exact | `dark-heresy-3rd-edition.weapons` **Hunting Lance** |
| Weapons | Improvised | 195 | exact | `dark-heresy-3rd-edition.weapons` **Improvised** |
| Weapons | Knife | 196 | exact-ambiguous | `dark-heresy-3rd-edition.weapons` **Knife** |
| Weapons | Lance | 197 | substring | `dark-heresy-3rd-edition.weapons` **Hunting Lance** |
| Weapons | Longflame | 198 | exact | `dark-heresy-3rd-edition.weapons` **Longflame** |
| Weapons | Man-Catcher | 199 | exact | `dark-heresy-3rd-edition.weapons` **Man-Catcher** |
| Weapons | Musket | 200 | exact | `dark-heresy-3rd-edition.weapons` **Musket** |
| Weapons | Praesidium Protectiva | 201 | exact | `dark-heresy-3rd-edition.weapons` **Praesidium Protectiva** |
| Weapons | Rune Weapon(sword) | 202 | exact | `dark-heresy-3rd-edition.weapons` **Rune Weapon (Sword)** |
| Weapons | Shield | 203 | exact | `dark-heresy-3rd-edition.weapons` **Shield** |
| Weapons | Snapper Repeating Rifle | 204 | exact | `dark-heresy-3rd-edition.weapons` **Snapper Repeating Rifle** |
| Weapons | Spear | 205 | exact | `dark-heresy-3rd-edition.weapons` **Spear** |
| Weapons | Staff | 206 | exact | `dark-heresy-3rd-edition.weapons` **Staff** |
| Weapons | Stealth Claw | 207 | exact | `dark-heresy-3rd-edition.weapons` **Stealth Claw** |
| Weapons | Sword | 208 | exact | `dark-heresy-3rd-edition.weapons` **Sword** |
| Weapons | Truncheon | 209 | exact | `dark-heresy-3rd-edition.weapons` **Truncheon** |
| Weapons | Unarmed | 210 | exact | `dark-heresy-3rd-edition.weapons` **Unarmed** |
| Weapons | Wailing Trident | 211 | exact | `dark-heresy-3rd-edition.weapons` **Wailing Trident** |
| Weapons | Warhammer | 212 | exact | `dark-heresy-3rd-edition.weapons` **Warhammer** |
| Weapons | Whip | 213 | exact | `dark-heresy-3rd-edition.weapons` **Whip** |
| Weapons | Driver Assault Rifle | 214 | none | *no compendium match* |
| Weapons | Driver Pistol | 215 | none | *no compendium match* |
| Weapons | Driver Shotgun | 216 | substring | `dark-heresy-3rd-edition.weapons` **Shotgun** |
| Weapons | Driver SMG | 217 | none | *no compendium match* |
| Weapons | Driver Sniper | 218 | none | *no compendium match* |
| Weapons | Inferno Pistol | 219 | exact | `dark-heresy-3rd-edition.weapons` **Inferno Pistol** |
| Weapons | Meltagun | 220 | exact | `dark-heresy-3rd-edition.weapons` **Meltagun** |
| Weapons | Plasma Gun | 221 | exact | `dark-heresy-3rd-edition.weapons` **Plasma Gun** |
| Weapons | Plasma Pistol | 222 | exact | `dark-heresy-3rd-edition.weapons` **Plasma Pistol** |
| Weapons | Sentinel Plasma Rifle | 223 | exact | `dark-heresy-3rd-edition.weapons` **Sentinel Plasma Rifle** |
| Weapons | Desoleum Power Blade | 224 | exact-ambiguous | `dark-heresy-3rd-edition.weapons` **Desoleum Power Blade** |
| Weapons | Ebenus Hammer | 225 | exact | `dark-heresy-3rd-edition.weapons` **Ebenus Hammer** |
| Weapons | Omnissian Axe | 226 | exact | `dark-heresy-3rd-edition.weapons` **Omnissian Axe** |
| Weapons | Power Axe | 227 | exact | `dark-heresy-3rd-edition.weapons` **Power Axe** |
| Weapons | Power Fist | 228 | exact | `dark-heresy-3rd-edition.weapons` **Power Fist** |
| Weapons | Power Glaive | 229 | substring | `dark-heresy-3rd-edition.weapons` **Ordo Malleus Power Glaive** |
| Weapons | Power Maul (High) | 230 | exact | `dark-heresy-3rd-edition.weapons` **Power Maul (High)** |
| Weapons | Power Maul (Low) | 231 | exact | `dark-heresy-3rd-edition.weapons` **Power Maul (Low)** |
| Weapons | Power Shield | 232 | exact | `dark-heresy-3rd-edition.weapons` **Power Shield** |
| Weapons | Power Stake | 233 | exact | `dark-heresy-3rd-edition.weapons` **Power Stake** |
| Weapons | Power Sword | 234 | exact | `dark-heresy-3rd-edition.weapons` **Power Sword** |
| Weapons | Thunder Hammer | 235 | exact | `dark-heresy-3rd-edition.weapons` **Thunder Hammer** |
| Weapons | Electro-Flail | 236 | exact | `dark-heresy-3rd-edition.weapons` **Electro-Flail** |
| Weapons | Naval Baton | 237 | none | *no compendium match* |
| Weapons | Shock Gauntlets | 238 | none | *no compendium match* |
| Weapons | Shock Gauntlets (Overcharged) | 239 | none | *no compendium match* |
| Weapons | Shock Maul | 240 | exact | `dark-heresy-3rd-edition.weapons` **Shock Maul** |
| Weapons | Shock Whip | 241 | exact | `dark-heresy-3rd-edition.weapons` **Shock Whip** |
| Weapons | Autocannon | 242 | exact | `dark-heresy-3rd-edition.weapons` **Autocannon** |
| Weapons | Autogun | 243 | exact | `dark-heresy-3rd-edition.weapons` **Autogun** |
| Weapons | Autopistol | 244 | exact | `dark-heresy-3rd-edition.weapons` **Autopistol** |
| Weapons | Hand Cannon | 245 | exact | `dark-heresy-3rd-edition.weapons` **Hand Cannon** |
| Weapons | Heavy Stubber | 246 | exact | `dark-heresy-3rd-edition.weapons` **Heavy Stubber** |
| Weapons | Kalovan Hunter Rifle | 247 | none | *no compendium match* |
| Weapons | Kalovan Hunter Shotgun | 248 | substring | `dark-heresy-3rd-edition.weapons` **Shotgun** |
| Weapons | Pacifier | 249 | none | *no compendium match* |
| Weapons | Pardoner | 250 | none | *no compendium match* |
| Weapons | Pummeler | 251 | none | *no compendium match* |
| Weapons | Punisher | 252 | none | *no compendium match* |
| Weapons | Shotgun | 253 | exact | `dark-heresy-3rd-edition.weapons` **Shotgun** |
| Weapons | Shotgun (Combat) | 254 | exact | `dark-heresy-3rd-edition.weapons` **Shotgun (Combat)** |
| Weapons | Sniper Rifle | 255 | exact | `dark-heresy-3rd-edition.weapons` **Sniper Rifle** |
| Weapons | Stub Automatic | 256 | exact | `dark-heresy-3rd-edition.weapons` **Stub Automatic** |
| Weapons | Stub Revolver | 257 | exact | `dark-heresy-3rd-edition.weapons` **Stub Revolver** |
| Weapons | Ork Mek Speshul | 258 | none | *no compendium match* |
| Weapons | Ork Rivet Cannon | 259 | none | *no compendium match* |
| Weapons | Ork Supa Shoota (TL) | 260 | none | *no compendium match* |
| Weapons | Ork Kustom Shokk Rifle | 261 | none | *no compendium match* |
| Weapons | Ork Squig Launcha | 262 | none | *no compendium match* |
| Weapons | Ork Squig Mine | 263 | none | *no compendium match* |
| Weapons | Our Lord's Ire | 264 | none | *no compendium match* |
| Weapons | The Greaterest Good | 265 | none | *no compendium match* |
| Armor | Armoured Bodyglove | 2 | exact | `dark-heresy-3rd-edition.armour` **Armoured Bodyglove** |
| Armor | Chainmail Suit | 3 | exact | `dark-heresy-3rd-edition.armour` **Chainmail Suit** |
| Armor | Feudal World Plate | 4 | exact | `dark-heresy-3rd-edition.armour` **Feudal World Plate** |
| Armor | Heavy Leathers | 5 | exact | `dark-heresy-3rd-edition.armour` **Heavy Leathers** |
| Armor | Imperial Robes | 6 | exact | `dark-heresy-3rd-edition.armour` **Imperial Robes** |
| Armor | Obsidian Plate | 7 | exact | `dark-heresy-3rd-edition.armour` **Obsidian Plate** |
| Armor | Xenos Hide Vest | 8 | exact | `dark-heresy-3rd-edition.armour` **Xenos Hide Vest** |
| Armor | Carapace Chestplate | 9 | exact | `dark-heresy-3rd-edition.armour` **Carapace Chestplate** |
| Armor | Carapace Gauntlets | 10 | exact | `dark-heresy-3rd-edition.armour` **Carapace Gauntlets** |
| Armor | Carapace Greaves | 11 | exact | `dark-heresy-3rd-edition.armour` **Carapace Greaves** |
| Armor | Carapace Helm | 12 | exact | `dark-heresy-3rd-edition.armour` **Carapace Helm** |
| Armor | Enforcer Light Carapace | 13 | exact | `dark-heresy-3rd-edition.armour` **Enforcer Light Carapace** |
| Armor | Marine Armor | 14 | none | *no compendium match* |
| Armor | Militarium Tempestus Carapace | 15 | none | *no compendium match* |
| Armor | Ancient Astartes Power Armor | 16 | none | *no compendium match* |
| Armor | Astartes Power Armor | 17 | none | *no compendium match* |
| Armor | Blast-suit | 18 | none | *no compendium match* |
| Armor | Holo-guard | 19 | none | *no compendium match* |
| Armor | Klaivex Armour | 20 | none | *no compendium match* |
| Armor | Sentinel Holo-guard | 21 | none | *no compendium match* |
| Armor | Iga Shroud | 22 | none | *no compendium match* |
| Armor | Praetor Armor | 23 | none | *no compendium match* |
| Armor | Soulward of Vail | 24 | none | *no compendium match* |
| Armor | Combat Armor | 25 | none | *no compendium match* |
| Armor | Recon Armor | 26 | none | *no compendium match* |
| Armor | The Black Armor of Vail | 27 | none | *no compendium match* |
| Armor | Clone Field | 28 | none | *no compendium match* |
| Armor | Flare Shield | 29 | exact | `dark-heresy-3rd-edition.armour` **Flare Shield** |
| Armor | Icon of the Just | 30 | exact | `dark-heresy-3rd-edition.armour` **Icon of the Just** |
| Armor | Rosarius | 31 | exact | `dark-heresy-3rd-edition.armour` **Rosarius** |
| Armor | Shimmershield | 32 | none | *no compendium match* |
| Armor | Magnus-Pattern Field Wall Generator | 33 | substring | `dark-heresy-3rd-edition.armour` **Field Wall Generator** |
| Armor | Flak Cloak | 34 | exact | `dark-heresy-3rd-edition.armour` **Flak Cloak** |
| Armor | Flak Coat | 35 | exact | `dark-heresy-3rd-edition.armour` **Flak Coat** |
| Armor | Flak Gauntlets | 36 | exact | `dark-heresy-3rd-edition.armour` **Flak Gauntlets** |
| Armor | Flak Helmet | 37 | exact | `dark-heresy-3rd-edition.armour` **Flak Helmet** |
| Armor | Flak Vest | 38 | exact | `dark-heresy-3rd-edition.armour` **Flak Vest** |
| Armor | Imperial Guard Flak Armor | 39 | none | *no compendium match* |
| Armor | Light Flak Cloak | 40 | exact | `dark-heresy-3rd-edition.armour` **Light Flak Cloak** |
| Armor | Mesh Cloak | 41 | exact | `dark-heresy-3rd-edition.armour` **Mesh Cloak** |
| Armor | Mesh Vest | 42 | exact | `dark-heresy-3rd-edition.armour` **Mesh Vest** |
| Armor | Mouldsuit | 43 | none | *no compendium match* |
| Armor | Adepta Sororitas Power Armor | 44 | none | *no compendium match* |
| Armor | Heavy Power Armor | 45 | none | *no compendium match* |
| Armor | Legionary Armor | 46 | none | *no compendium match* |
| Armor | Light Power Armor | 47 | none | *no compendium match* |
| Armor | Praetorian Armor | 48 | none | *no compendium match* |
| Modifications | Abyssal Bolts | 2 | substring | `dark-heresy-3rd-edition.ammo` **Abyssal Bolt** |
| Modifications | Amputator Shells | 3 | exact | `dark-heresy-3rd-edition.ammo` **Amputator Shells** |
| Modifications | Banestrike Rounds | 4 | none | *no compendium match* |
| Modifications | Bleeder Rounds | 5 | exact | `dark-heresy-3rd-edition.ammo` **Bleeder Rounds** |
| Modifications | Dragonfire Rounds | 6 | none | *no compendium match* |
| Modifications | Dumdum Bullets | 7 | exact | `dark-heresy-3rd-edition.ammo` **Dumdum Bullets** |
| Modifications | "Emperor's Light" Thermal Bolts | 8 | exact | `dark-heresy-3rd-edition.ammo` **Emperors Light Thermal Bolts** |
| Modifications | "Emperor's Wrath" Shard Bolts | 9 | exact | `dark-heresy-3rd-edition.ammo` **Emperors Wrath Shard Bolts** |
| Modifications | Expander Rounds | 10 | exact | `dark-heresy-3rd-edition.ammo` **Expander Rounds** |
| Modifications | Explosive Arrows/Quarrels | 11 | exact | `dark-heresy-3rd-edition.ammo` **Explosive Arrows/Quarrels** |
| Modifications | Hellfire Rounds | 12 | none | *no compendium match* |
| Modifications | "Heretic's Match" Incendiary Rounds | 13 | exact | `dark-heresy-3rd-edition.ammo` **Heretics Match Incendiary Rounds** |
| Modifications | Hot-shot Charge Packs | 14 | exact | `dark-heresy-3rd-edition.ammo` **Hot-Shot Charge Packs** |
| Modifications | Implosion Shells | 15 | none | *no compendium match* |
| Modifications | Inferno Shells | 16 | exact | `dark-heresy-3rd-edition.ammo` **Inferno Shells** |
| Modifications | Kraken Rounds | 17 | none | *no compendium match* |
| Modifications | Kroot Sniper Rounds | 18 | none | *no compendium match* |
| Modifications | Man-Stopper Bullets | 19 | exact | `dark-heresy-3rd-edition.ammo` **Man-Stopper Bullets** |
| Modifications | MD-(A) MASS DRIVER AMMO RULES | 20 | none | *no compendium match* |
| Modifications | MD-Chemical | 21 | none | *no compendium match* |
| Modifications | MD-Cryo | 22 | none | *no compendium match* |
| Modifications | MD-Flux | 23 | none | *no compendium match* |
| Modifications | MD-Hammerhead | 24 | none | *no compendium match* |
| Modifications | MD-Inferno | 25 | none | *no compendium match* |
| Modifications | MD-Overload | 26 | none | *no compendium match* |
| Modifications | MD-Phasic | 27 | none | *no compendium match* |
| Modifications | MD-Polonium | 28 | none | *no compendium match* |
| Modifications | MD-Shredder | 29 | none | *no compendium match* |
| Modifications | MD-Tungsten | 30 | none | *no compendium match* |
| Modifications | Metal Storm Rounds | 31 | none | *no compendium match* |
| Modifications | Nitidus Rounds | 32 | exact | `dark-heresy-3rd-edition.ammo` **Nitidus Rounds** |
| Modifications | Psybolts | 33 | exact | `dark-heresy-3rd-edition.ammo` **Psybolts** |
| Modifications | Psyflame | 34 | exact | `dark-heresy-3rd-edition.ammo` **Psyflame** |
| Modifications | Purgatus Stakes | 35 | exact | `dark-heresy-3rd-edition.ammo` **Purgatus Stakes** |
| Modifications | Purity Bolts | 36 | exact | `dark-heresy-3rd-edition.ammo` **Purity Bolts** |
| Modifications | Sanctified Ammunition | 37 | exact | `dark-heresy-3rd-edition.ammo` **Sanctified Ammunition** |
| Modifications | Scrambler Rounds | 38 | exact | `dark-heresy-3rd-edition.ammo` **Scrambler Rounds** |
| Modifications | Silver Stakes | 39 | exact | `dark-heresy-3rd-edition.ammo` **Silver Stakes** |
| Modifications | Stalker Rounds | 40 | none | *no compendium match* |
| Modifications | Tempest Bolt Shells | 41 | exact | `dark-heresy-3rd-edition.ammo` **Tempest Bolt Shells** |
| Modifications | Theta-Pattern Concussion Bolts | 42 | exact | `dark-heresy-3rd-edition.ammo` **Theta-Pattern Concussion Bolts** |
| Modifications | Theta-Pattern Shock Bolts | 43 | exact | `dark-heresy-3rd-edition.ammo` **Theta-Pattern Shock Bolts** |
| Modifications | Tox Rounds | 44 | exact | `dark-heresy-3rd-edition.ammo` **Tox Rounds** |
| Modifications | Vengeance Rounds | 45 | none | *no compendium match* |
| Modifications | Witch Bolts | 46 | none | *no compendium match* |
| Modifications | Adamantine Chainguard | 47 | none | *no compendium match* |
| Modifications | Auto-Senses | 48 | none | *no compendium match* |
| Modifications | Brazier of Saint Roberto | 49 | none | *no compendium match* |
| Modifications | Ceramite Plating | 50 | none | *no compendium match* |
| Modifications | Devotional Iconography | 51 | none | *no compendium match* |
| Modifications | Hexagrammatic Wards | 52 | none | *no compendium match* |
| Modifications | Leviathan Ballistic Gel | 53 | none | *no compendium match* |
| Modifications | Pentagramatic Wards | 54 | none | *no compendium match* |
| Modifications | Razor Guards | 55 | none | *no compendium match* |
| Modifications | Sacred Incense Burner | 56 | none | *no compendium match* |
| Modifications | Truesilver Filigree | 57 | none | *no compendium match* |
| Modifications | Unguents of Warding | 58 | none | *no compendium match* |
| Modifications | Seals of Banishment(vehicular) | 59 | none | *no compendium match* |
| Modifications | Venerated Gyroscope | 60 | none | *no compendium match* |
| Modifications | Aux Grenade Launcher | 61 | none | *no compendium match* |
| Modifications | Backpack Ammo Supply | 62 | exact | `dark-heresy-3rd-edition.weapon-mods` **Backpack Ammo Supply** |
| Modifications | Bulk Build | 63 | none | *no compendium match* |
| Modifications | Compact | 64 | exact | `dark-heresy-3rd-edition.weapon-mods` **Compact** |
| Modifications | Custom Grip | 65 | exact | `dark-heresy-3rd-edition.weapon-mods` **Custom Grip** |
| Modifications | Deactivated Safety Features | 66 | exact | `dark-heresy-3rd-edition.weapon-mods` **Deactivated Safety Features** |
| Modifications | Driver Grip | 67 | none | *no compendium match* |
| Modifications | Driver Scope | 68 | none | *no compendium match* |
| Modifications | Expanded Magazine | 69 | exact | `dark-heresy-3rd-edition.weapon-mods` **Expanded Magazine** |
| Modifications | Extended Barrel | 70 | none | *no compendium match* |
| Modifications | Extended Driver Magazine | 71 | none | *no compendium match* |
| Modifications | Exterminator | 72 | exact | `dark-heresy-3rd-edition.weapon-mods` **Exterminator** |
| Modifications | Fire Selector | 73 | exact | `dark-heresy-3rd-edition.weapon-mods` **Fire Selector** |
| Modifications | Fluid Action | 74 | exact | `dark-heresy-3rd-edition.weapon-mods` **Fluid Action** |
| Modifications | Forearm Weapon Mounting | 75 | exact | `dark-heresy-3rd-edition.weapon-mods` **Forearm Weapon Mounting** |
| Modifications | HunTR System | 76 | none | *no compendium match* |
| Modifications | Impeller | 77 | none | *no compendium match* |
| Modifications | Melee Attachment | 78 | exact | `dark-heresy-3rd-edition.weapon-mods` **Melee Attachment** |
| Modifications | Modified Stock | 79 | exact | `dark-heresy-3rd-edition.weapon-mods` **Modified Stock** |
| Modifications | Mono | 80 | exact | `dark-heresy-3rd-edition.weapon-mods` **Mono** |
| Modifications | Motion Predictor | 81 | exact | `dark-heresy-3rd-edition.weapon-mods` **Motion Predictor** |
| Modifications | Omni Scope | 82 | exact | `dark-heresy-3rd-edition.weapon-mods` **Omni-Scope** |
| Modifications | Photo Sight | 83 | exact | `dark-heresy-3rd-edition.weapon-mods` **Photo Sight** |
| Modifications | Pistol Grip | 84 | exact | `dark-heresy-3rd-edition.weapon-mods` **Pistol Grip** |
| Modifications | Preysense Sight | 85 | exact | `dark-heresy-3rd-edition.weapon-mods` **Preysense Sight** |
| Modifications | Pulse Accelerator | 86 | none | *no compendium match* |
| Modifications | Quick-release | 87 | exact | `dark-heresy-3rd-edition.weapon-mods` **Quick-Release** |
| Modifications | Red-Dot Laser Sight | 88 | exact | `dark-heresy-3rd-edition.weapon-mods` **Red-Dot Laser Sight** |
| Modifications | Reinforced | 89 | exact | `dark-heresy-3rd-edition.weapon-mods` **Reinforced** |
| Modifications | Sacred Inscriptions | 90 | exact | `dark-heresy-3rd-edition.weapon-mods` **Sacred Inscriptions** |
| Modifications | Seals of Banishment(personal) | 91 | none | *no compendium match* |
| Modifications | Silencer | 92 | exact | `dark-heresy-3rd-edition.weapon-mods` **Silencer** |
| Modifications | Stability Dampener | 93 | none | *no compendium match* |
| Modifications | Suspensors | 94 | exact | `dark-heresy-3rd-edition.weapon-mods` **Suspensors** |
| Modifications | Targeter | 95 | exact | `dark-heresy-3rd-edition.weapon-mods` **Targeter** |
| Modifications | Telescopic Sight | 96 | exact | `dark-heresy-3rd-edition.weapon-mods` **Telescopic Sight** |
| Modifications | Tox Dispenser | 97 | exact | `dark-heresy-3rd-edition.weapon-mods` **Tox Dispenser** |
| Modifications | Tripod/Bipod | 98 | exact | `dark-heresy-3rd-edition.weapon-mods` **Tripod/Bipod** |
| Modifications | Truesilver Gilding | 99 | exact | `dark-heresy-3rd-edition.weapon-mods` **Truesilver Gilding** |
| Modifications | Truesilver Weaving | 100 | exact | `dark-heresy-3rd-edition.weapon-mods` **Truesilver Weaving** |
| Modifications | Ultralight Materials | 101 | none | *no compendium match* |
| Modifications | Vox Operated | 102 | exact | `dark-heresy-3rd-edition.weapon-mods` **Vox-Operated** |
| Modifications | Warpleech Canister | 103 | exact | `dark-heresy-3rd-edition.weapon-mods` **Warpleech Canister** |
| Gear & Tools | Auspex/Scanner | 2 | exact | `dark-heresy-3rd-edition.tools` **Auspex/Scanner** |
| Gear & Tools | Auto Quill | 3 | exact | `dark-heresy-3rd-edition.tools` **Auto Quill** |
| Gear & Tools | Backpack | 4 | none | *no compendium match* |
| Gear & Tools | Banishing Rod | 5 | none | *no compendium match* |
| Gear & Tools | Blacksun Filter | 6 | none | *no compendium match* |
| Gear & Tools | Chameleoline Cloak | 7 | none | *no compendium match* |
| Gear & Tools | Chrono | 8 | none | *no compendium match* |
| Gear & Tools | Clip/Drop Harness | 9 | exact | `dark-heresy-3rd-edition.tools` **Clip/Drop Harness** |
| Gear & Tools | Clothing | 10 | none | *no compendium match* |
| Gear & Tools | Combat Vest | 11 | none | *no compendium match* |
| Gear & Tools | Combi-Tool | 12 | exact | `dark-heresy-3rd-edition.tools` **Combi-tool** |
| Gear & Tools | Comm Leech | 13 | exact | `dark-heresy-3rd-edition.tools` **Comm Leech** |
| Gear & Tools | Concealed Holster | 14 | none | *no compendium match* |
| Gear & Tools | Consecrated Scrolls | 15 | none | *no compendium match* |
| Gear & Tools | Dataslate | 16 | exact | `dark-heresy-3rd-edition.tools` **Dataslate** |
| Gear & Tools | Deadspace Earpiece | 17 | none | *no compendium match* |
| Gear & Tools | Demiurg Drone/turret Controller | 18 | none | *no compendium match* |
| Gear & Tools | Demolition Kit | 19 | exact | `dark-heresy-3rd-edition.tools` **Demolition Kit** |
| Gear & Tools | Diagnostor | 20 | exact | `dark-heresy-3rd-edition.tools` **Diagnostor** |
| Gear & Tools | Disguise Kit | 21 | exact | `dark-heresy-3rd-edition.tools` **Disguise Kit** |
| Gear & Tools | Empyrean Brain Mine | 22 | none | *no compendium match* |
| Gear & Tools | Boost-pack | 23 | none | *no compendium match* |
| Gear & Tools | Excruciator Kit | 24 | exact | `dark-heresy-3rd-edition.tools` **Excruciator Kit** |
| Gear & Tools | Explosive Collar | 25 | none | *no compendium match* |
| Gear & Tools | Field Suture | 26 | exact | `dark-heresy-3rd-edition.tools` **Field Suture** |
| Gear & Tools | Filtration Plugs | 27 | none | *no compendium match* |
| Gear & Tools | Glow-Globe/Stablight | 28 | none | *no compendium match* |
| Gear & Tools | Grapnel & Line | 29 | none | *no compendium match* |
| Gear & Tools | Grav Chute | 30 | exact | `dark-heresy-3rd-edition.tools` **Grav Chute** |
| Gear & Tools | Gravity Wave Projector | 31 | none | *no compendium match* |
| Gear & Tools | Hand-Held Targeter | 32 | exact | `dark-heresy-3rd-edition.tools` **Hand-Held Targeter** |
| Gear & Tools | Inhaler/Injector | 33 | exact | `dark-heresy-3rd-edition.tools` **Inhaler/Injector** |
| Gear & Tools | Lascutter | 34 | exact | `dark-heresy-3rd-edition.tools` **Lascutter** |
| Gear & Tools | Laud Hailer | 35 | exact | `dark-heresy-3rd-edition.tools` **Laud Hailer** |
| Gear & Tools | Magboots | 36 | exact | `dark-heresy-3rd-edition.tools` **Magboots** |
| Gear & Tools | Magnoculars | 37 | exact | `dark-heresy-3rd-edition.tools` **Magnoculars** |
| Gear & Tools | Manacles | 38 | exact | `dark-heresy-3rd-edition.tools` **Manacles** |
| Gear & Tools | Medi-Kit | 39 | exact | `dark-heresy-3rd-edition.tools` **Medi-kit** |
| Gear & Tools | Micro-Bead | 40 | exact | `dark-heresy-3rd-edition.tools` **Micro-bead** |
| Gear & Tools | Monotask Servo-Skull | 41 | exact | `dark-heresy-3rd-edition.tools` **Monotask Servo-Skull** |
| Gear & Tools | Multicompass | 42 | none | *no compendium match* |
| Gear & Tools | Multikey | 43 | exact | `dark-heresy-3rd-edition.tools` **Multikey** |
| Gear & Tools | Null Rod | 44 | exact | `dark-heresy-3rd-edition.tools` **Null Rod** |
| Gear & Tools | Photo-Visors/Contacts | 45 | none | *no compendium match* |
| Gear & Tools | Pict Recorder | 46 | exact | `dark-heresy-3rd-edition.tools` **Pict Recorder** |
| Gear & Tools | Positional Relay | 47 | none | *no compendium match* |
| Gear & Tools | Preysense Goggles | 48 | none | *no compendium match* |
| Gear & Tools | Psy Focus | 49 | exact | `dark-heresy-3rd-edition.tools` **Psy Focus** |
| Gear & Tools | Psyocculum | 50 | none | *no compendium match* |
| Gear & Tools | Rebreather | 51 | none | *no compendium match* |
| Gear & Tools | Recoil Glove | 52 | none | *no compendium match* |
| Gear & Tools | Regicide Set | 53 | exact | `dark-heresy-3rd-edition.tools` **Regicide Set** |
| Gear & Tools | Respirator/Gas Mask | 54 | none | *no compendium match* |
| Gear & Tools | Screamer | 55 | exact | `dark-heresy-3rd-edition.tools` **Screamer** |
| Gear & Tools | Signal Jammer | 56 | exact | `dark-heresy-3rd-edition.tools` **Signal Jammer** |
| Gear & Tools | Static Generator | 57 | exact | `dark-heresy-3rd-edition.tools` **Static Generator** |
| Gear & Tools | Stummer | 58 | exact | `dark-heresy-3rd-edition.tools` **Stummer** |
| Gear & Tools | Survival Suit | 59 | none | *no compendium match* |
| Gear & Tools | Synskin | 60 | none | *no compendium match* |
| Gear & Tools | Target Lock | 61 | none | *no compendium match* |
| Gear & Tools | Tau Drone Controller | 62 | none | *no compendium match* |
| Gear & Tools | Void Suit | 63 | none | *no compendium match* |
| Gear & Tools | Vox-Caster | 64 | exact | `dark-heresy-3rd-edition.tools` **Vox-caster** |
| Gear & Tools | Writing Kit | 65 | exact | `dark-heresy-3rd-edition.tools` **Writing Kit** |
| Gear & Tools | "Safaree" Prism | 66 | none | *no compendium match* |
| Gear & Tools | Prism | 67 | none | *no compendium match* |
| Gear & Tools | Greater Prism | 68 | none | *no compendium match* |
| Gear & Tools | Ultra Prism | 69 | none | *no compendium match* |
| Gear & Tools | Master Prism | 70 | none | *no compendium match* |
| Gear & Tools | Harmonic Prism | 71 | none | *no compendium match* |
| Gear & Tools | Kalovan Warpstone | 72 | none | *no compendium match* |
| Gear & Tools | TM #XXX | 73 | none | *no compendium match* |
| Gear & Tools | Mysterious "Candy" | 74 | none | *no compendium match* |
| Gear & Tools | Max Revive | 75 | none | *no compendium match* |
| Gear & Tools | Moldy Sandwich | 76 | none | *no compendium match* |
| Gear & Tools | Psychoactive Clay | 77 | none | *no compendium match* |
| Gear & Tools | Everstone | 78 | none | *no compendium match* |
| Drugs | Amasec | 2 | exact | `dark-heresy-3rd-edition.consumables` **Amasec** |
| Drugs | Desoleum Fungus | 3 | exact | `dark-heresy-3rd-edition.consumables` **Desoleum Fungus** |
| Drugs | De-Tox | 4 | exact | `dark-heresy-3rd-edition.consumables` **De-Tox** |
| Drugs | Frenzon | 5 | exact | `dark-heresy-3rd-edition.consumables` **Frenzon** |
| Drugs | Lho-Sticks | 6 | exact | `dark-heresy-3rd-edition.consumables` **Lho-Sticks** |
| Drugs | Obscura | 7 | exact | `dark-heresy-3rd-edition.consumables` **Obscura** |
| Drugs | Ration Pack | 8 | exact | `dark-heresy-3rd-edition.consumables` **Ration Pack** |
| Drugs | Recaf | 9 | exact | `dark-heresy-3rd-edition.consumables` **Recaf** |
| Drugs | Sacred Unguents | 10 | exact | `dark-heresy-3rd-edition.consumables` **Sacred Unguents** |
| Drugs | Slaught | 11 | exact | `dark-heresy-3rd-edition.consumables` **Slaught** |
| Drugs | Spook | 12 | exact | `dark-heresy-3rd-edition.consumables` **Spook** |
| Drugs | Stimm | 13 | exact | `dark-heresy-3rd-edition.consumables` **Stimm** |
| Drugs | Tranq | 14 | exact | `dark-heresy-3rd-edition.consumables` **Tranq** |
| Drugs | Accelerai | 15 | none | *no compendium match* |
| Drugs | Corpse Obmulen | 16 | none | *no compendium match* |
| Drugs | Eviscerine | 17 | none | *no compendium match* |
| Drugs | Murder's Boon | 18 | none | *no compendium match* |
| Drugs | Shudderstep | 19 | none | *no compendium match* |
| Drugs | Slitherbind | 20 | none | *no compendium match* |
| PsyPwrs | Powa' Burst | 2 | none | *no compendium match* |
| PsyPwrs | Frazzle | 3 | none | *no compendium match* |
| PsyPwrs | Up an' at 'Em | 4 | none | *no compendium match* |
| PsyPwrs | Warpath | 5 | none | *no compendium match* |
| PsyPwrs | Dis is Takin' Too Long! | 6 | none | *no compendium match* |
| PsyPwrs | Smash da Gitz | 7 | none | *no compendium match* |
| PsyPwrs | We'z Gotta be Lucky | 8 | substring | `dark-heresy-3rd-edition.psychic-powers` **Luck** |
| PsyPwrs | Zzap | 9 | none | *no compendium match* |
| PsyPwrs | Ere We Go | 10 | none | *no compendium match* |
| PsyPwrs | Deff Wave | 11 | none | *no compendium match* |
| PsyPwrs | Krump 'Em All | 12 | none | *no compendium match* |
| PsyPwrs | Ead to 'Ead | 13 | none | *no compendium match* |
| PsyPwrs | I'z Gunna Squig Ya! | 14 | none | *no compendium match* |
| Cybernetics etc | Augur Array | 2 | exact | `dark-heresy-3rd-edition.cybernetics` **Augur Array** |
| Cybernetics etc | Autosanguine | 3 | exact | `dark-heresy-3rd-edition.cybernetics` **Autosanguine** |
| Cybernetics etc | Baleful Eye | 4 | exact | `dark-heresy-3rd-edition.cybernetics` **Baleful Eye** |
| Cybernetics etc | Bionic Arms | 5 | substring | `dark-heresy-3rd-edition.cybernetics` **Bionic Arm** |
| Cybernetics etc | Bionic Heart | 6 | exact | `dark-heresy-3rd-edition.cybernetics` **Bionic Heart** |
| Cybernetics etc | Bionic Legs | 7 | exact | `dark-heresy-3rd-edition.cybernetics` **Bionic Legs** |
| Cybernetics etc | Bionic Respiratory System | 8 | exact | `dark-heresy-3rd-edition.cybernetics` **Bionic Respiratory System** |
| Cybernetics etc | Bionic Senses | 9 | exact | `dark-heresy-3rd-edition.cybernetics` **Bionic Senses** |
| Cybernetics etc | Calculus Logi Upgrade | 10 | exact | `dark-heresy-3rd-edition.cybernetics` **Calculus Logi Upgrade** |
| Cybernetics etc | Cerebral Implants | 11 | exact | `dark-heresy-3rd-edition.cybernetics` **Cerebral Implants** |
| Cybernetics etc | Cranial Armor | 12 | none | *no compendium match* |
| Cybernetics etc | Enhanced Potentia Coil | 13 | none | *no compendium match* |
| Cybernetics etc | Ferric Lure Implants | 14 | exact | `dark-heresy-3rd-edition.cybernetics` **Ferric Lure Implants** |
| Cybernetics etc | Interface Port | 15 | exact | `dark-heresy-3rd-edition.cybernetics` **Interface Port** |
| Cybernetics etc | Internal Reservoir | 16 | exact | `dark-heresy-3rd-edition.cybernetics` **Internal Reservoir** |
| Cybernetics etc | Lathes Mechadendrite Stabilisers | 17 | substring | `dark-heresy-3rd-edition.cybernetics` **Mechadendrite** |
| Cybernetics etc | Locator Matrix | 18 | exact | `dark-heresy-3rd-edition.cybernetics` **Locator Matrix** |
| Cybernetics etc | Luminen Capacitor | 19 | exact | `dark-heresy-3rd-edition.cybernetics` **Luminen Capacitor** |
| Cybernetics etc | Maglev Coils | 20 | exact | `dark-heresy-3rd-edition.cybernetics` **Maglev Coils** |
| Cybernetics etc | Mechadendrite | 21 | exact | `dark-heresy-3rd-edition.cybernetics` **Mechadendrite** |
| Cybernetics etc | Memorance Implant | 22 | exact | `dark-heresy-3rd-edition.cybernetics` **Memorance Implant** |
| Cybernetics etc | Mind Impulse Unit (MIU) | 23 | substring | `dark-heresy-3rd-edition.cybernetics` **Mind Impulse Unit** |
| Cybernetics etc | MIU Weapon Interface | 24 | exact | `dark-heresy-3rd-edition.cybernetics` **MIU Weapon Interface** |
| Cybernetics etc | Perinetus-Pattern Servo-Harness | 25 | none | *no compendium match* |
| Cybernetics etc | Respiratory Filter Implant | 26 | exact | `dark-heresy-3rd-edition.cybernetics` **Respiratory Filter Implant** |
| Cybernetics etc | Scribe-Tines | 27 | exact | `dark-heresy-3rd-edition.cybernetics` **Scribe-tines** |
| Cybernetics etc | Subskin Armor | 28 | none | *no compendium match* |
| Cybernetics etc | Synthmuscle | 29 | exact | `dark-heresy-3rd-edition.cybernetics` **Synthmuscle** |
| Cybernetics etc | Vocal Implant | 30 | exact | `dark-heresy-3rd-edition.cybernetics` **Vocal Implant** |
| Cybernetics etc | Volitor Implant | 31 | exact | `dark-heresy-3rd-edition.cybernetics` **Volitor Implant** |
| Cybernetics etc | Subskin Hologuard | 32 | none | *no compendium match* |
| Cybernetics etc | Guildsight | 33 | none | *no compendium match* |
| Cybernetics etc | Ironbone Transformation | 34 | none | *no compendium match* |
| Unique Wpns | Ame-no, Ward of the Peaks | 2 | none | *no compendium match* |
| Unique Wpns | Ancient Bolt-Action Rifle | 3 | none | *no compendium match* |
| Unique Wpns | Anzion's Pseudogenitor | 4 | none | *no compendium match* |
| Unique Wpns | Archangel Mk II | 5 | none | *no compendium match* |
| Unique Wpns | Aspirant's Sanguinary Pistol | 6 | exact | `dark-heresy-3rd-edition.weapons` **Aspirant's Sanguinary Pistol** |
| Unique Wpns | Aspirant's Sanguinary Boltgun | 7 | exact | `dark-heresy-3rd-edition.weapons` **Aspirant's Sanguinary Boltgun** |
| Unique Wpns | Astartes Combi-Bolter | 8 | exact | `dark-heresy-3rd-edition.weapons` **Astartes Combi-Bolter (Heretic Astartes)** |
| Unique Wpns | Brotherhood | 9 | none | *no compendium match* |
| Unique Wpns | Bulldog | 10 | none | *no compendium match* |
| Unique Wpns | Cerberus | 11 | substring | `dark-heresy-3rd-edition.weapons` **Cerberus Heavy Flamer** |
| Unique Wpns | Claymore | 12 | none | *no compendium match* |
| Unique Wpns | Consort Honor-Blade(Las) | 13 | none | *no compendium match* |
| Unique Wpns | Consort Honor-Blade(Axe) | 14 | none | *no compendium match* |
| Unique Wpns | Culling | 15 | none | *no compendium match* |
| Unique Wpns | Da Rippa | 16 | none | *no compendium match* |
| Unique Wpns | Darloth Chain Cannon | 17 | none | *no compendium match* |
| Unique Wpns | Edge of Night | 18 | none | *no compendium match* |
| Unique Wpns | Elemental Assault | 19 | none | *no compendium match* |
| Unique Wpns | Executor Bolt Pistol (Bolt) | 20 | exact | `dark-heresy-3rd-edition.weapons` **Executor Bolt Pistol (Bolt)** |
| Unique Wpns | Executor Bolt Pistol (Needle) | 21 | exact | `dark-heresy-3rd-edition.weapons` **Executor Bolt Pistol (Needle)** |
| Unique Wpns | Hand of Retribution | 22 | none | *no compendium match* |
| Unique Wpns | Khanite Chainblade | 23 | substring | `dark-heresy-3rd-edition.weapons` **Chainblade** |
| Unique Wpns | Kusanagi, Voice of the Wind | 24 | none | *no compendium match* |
| Unique Wpns | Masamune, Spirit of the Warrior | 25 | none | *no compendium match* |
| Unique Wpns | Midnight Essence | 26 | none | *no compendium match* |
| Unique Wpns | Modified Inferno Pistol | 27 | substring | `dark-heresy-3rd-edition.weapons` **Inferno Pistol** |
| Unique Wpns | Prismatic Fist(Las) | 28 | none | *no compendium match* |
| Unique Wpns | Prismatic Fist(Melta) | 29 | none | *no compendium match* |
| Unique Wpns | Prismatic Fist(Plasma) | 30 | none | *no compendium match* |
| Unique Wpns | Da Rally Flagg | 31 | none | *no compendium match* |
| Unique Wpns | Shadowglass | 32 | none | *no compendium match* |
| Unique Wpns | Sturm und Drang | 33 | none | *no compendium match* |
| Unique Wpns | Svalinndar | 34 | none | *no compendium match* |
| Unique Wpns | The Black Hand | 35 | none | *no compendium match* |
| Unique Wpns | The Twin Dragons | 36 | none | *no compendium match* |
| Unique Wpns | Voidblade | 37 | none | *no compendium match* |
| Unique Wpns | Volkite Disruptor | 38 | none | *no compendium match* |
| Unique Wpns | Zennyo, Soul of the Depths | 39 | none | *no compendium match* |
| Unique Wpns | Bloodpike | 40 | none | *no compendium match* |
| Unique Wpns | Nightbane | 41 | none | *no compendium match* |
| Unique Wpns | The Unseen | 42 | none | *no compendium match* |
| Uniques | 5x Buglike Xenos heads on a string | 2 | none | *no compendium match* |
| Uniques | Alien organ in a stasis chamber | 3 | none | *no compendium match* |
| Uniques | Ancient Astartes Power Armor | 4 | none | *no compendium match* |
| Uniques | Archaeotech Preysense Goggles | 5 | none | *no compendium match* |
| Uniques | Anzion's Pseudogenitor | 6 | none | *no compendium match* |
| Uniques | Cantic Thrallnet | 7 | none | *no compendium match* |
| Uniques | Case of Cybernetics | 8 | none | *no compendium match* |
| Uniques | Chalice of Sorrow | 9 | none | *no compendium match* |
| Uniques | Charon Battle Servitor | 10 | none | *no compendium match* |
| Uniques | Chivalry | 11 | none | *no compendium match* |
| Uniques | Crystal Skull | 12 | none | *no compendium match* |
| Uniques | Dragon's Tooth | 13 | none | *no compendium match* |
| Uniques | Egarian Puzzle Cube | 14 | none | *no compendium match* |
| Uniques | Eldar Histories | 15 | none | *no compendium match* |
| Uniques | Fhaisorr | 16 | none | *no compendium match* |
| Uniques | Flying sphere | 17 | none | *no compendium match* |
| Uniques | Gemstones in Glass | 18 | none | *no compendium match* |
| Uniques | Hesperidan Sapling | 19 | none | *no compendium match* |
| Uniques | Ingot of Iridescent Metal | 20 | none | *no compendium match* |
| Uniques | Karelian Repulsor | 21 | none | *no compendium match* |
| Uniques | Large Brass Cog | 22 | none | *no compendium match* |
| Uniques | Lux-Equine | 23 | none | *no compendium match* |
| Uniques | Map of the Reach | 24 | none | *no compendium match* |
| Uniques | Morrowine | 25 | none | *no compendium match* |
| Uniques | Mysterious Jet-black stone | 26 | none | *no compendium match* |
| Uniques | Prismatic Fist | 27 | none | *no compendium match* |
| Uniques | Red and Blue Flags | 28 | none | *no compendium match* |
| Uniques | Retribution Bolt Shells | 29 | none | *no compendium match* |
| Uniques | Rough pink crystal | 30 | none | *no compendium match* |
| Uniques | Sanctified Box | 31 | none | *no compendium match* |
| Uniques | Sanghelos Combat Armor | 32 | none | *no compendium match* |
| Uniques | Shattered Hilt of Indridi's Blade | 33 | none | *no compendium match* |
| Uniques | Strange Tree Branch | 34 | none | *no compendium match* |
| Uniques | Sunshot rounds | 35 | none | *no compendium match* |
| Uniques | Vanishing Fabric | 36 | none | *no compendium match* |
| Uniques | Void-Stalker Cloak | 37 | none | *no compendium match* |
| Uniques | Wayfarer's Browncoat | 38 | none | *no compendium match* |
| Uniques | Whispersilk Cloth | 39 | none | *no compendium match* |
| Uniques | Wraithbone Flute | 40 | none | *no compendium match* |
| Uniques | Xenos Death-Dream's Fragment Multikey | 41 | substring | `dark-heresy-3rd-edition.tools` **Multikey** |
| Uniques | Ancient Manual of (Poxian) Health | 42 | none | *no compendium match* |
| Uniques | Da Squiggin' Stick | 43 | none | *no compendium match* |
| Uniques | Da (smol) Red Buttun | 44 | none | *no compendium match* |
| Uniques | Annuver Wun | 45 | none | *no compendium match* |
| Uniques | Paint (fer) da Targut  | 46 | none | *no compendium match* |
| Uniques | Da  Boss' Hittin' (er Trowin) Stik | 47 | none | *no compendium match* |
| Uniques | Annals of the Laughing God | 48 | none | *no compendium match* |
| Uniques | Journal of the Von Zarovich Dynasty | 49 | none | *no compendium match* |
| Uniques | Inquisitor Stefan's Ciphered Notebook | 50 | none | *no compendium match* |
| Uniques | The Twofold Land | 51 | none | *no compendium match* |
| Uniques | Tomorrow's Wind | 52 | none | *no compendium match* |
| Uniques | Twenty Shadows | 53 | none | *no compendium match* |
| Uniques | Out of Mind: Meaning and the Making of Realities via Exploration of Psyko-Spatial Phenomena | 54 | none | *no compendium match* |
| Uniques | Mysterious Instruction Manual | 55 | none | *no compendium match* |
| Uniques | Tome of Alaric | 56 | none | *no compendium match* |
| Uniques | Glyphs of the Collector | 57 | none | *no compendium match* |
| Uniques | Freendship Circly Thing | 58 | none | *no compendium match* |
| Uniques | Da Gitfinda | 59 | none | *no compendium match* |
| Uniques | Supa Hidin Gas | 60 | none | *no compendium match* |
| Uniques | Shoutin' Cone | 61 | none | *no compendium match* |
| Uniques | Da Fixit Rok | 62 | none | *no compendium match* |
| V Weps | -- | 2 | none | *no compendium match* |
| V Weps | Ancient Heavy Flamer(Sponson) | 3 | substring-best | `dark-heresy-3rd-edition.weapons` **Heavy Flamer** |
| V Weps | Ancient Lascannon | 4 | none | *no compendium match* |
| V Weps | Ancient Multilaser(Co-axial) | 5 | none | *no compendium match* |
| V Weps | Ancient Multilaser(Pintle) | 6 | none | *no compendium match* |
| V Weps | Ancient Multilaser(Sponson) | 7 | none | *no compendium match* |
| V Weps | Stormhammer Cannon | 8 | none | *no compendium match* |
| V Weps | Storhammer Cannon(Titanslayer) | 9 | none | *no compendium match* |
| V Weps | Storhammer Cannon(Sanguinius) | 10 | none | *no compendium match* |
| V Weps | Twin Battlecannon | 11 | none | *no compendium match* |
| V Weps | Automatic Grenade Launcher | 12 | substring | `dark-heresy-3rd-edition.weapons` **Grenade Launcher** |
| V Weps | Long-Barrelled Autocannons | 13 | substring | `dark-heresy-3rd-edition.weapons` **Autocannon** |
| V Weps | TL Long-Barrelled Lascannon | 14 | none | *no compendium match* |
| V Weps | Long-Barrelled Lascannon Bank | 15 | none | *no compendium match* |
| V Weps | Void Missiles | 16 | none | *no compendium match* |
| V Weps | Sulphur Breath | 17 | none | *no compendium match* |
| V Weps | Clawed Limbs | 18 | none | *no compendium match* |
| V Weps | Filthy Claws | 19 | none | *no compendium match* |
| V Weps | Rending Maw | 20 | none | *no compendium match* |
| V Weps | Mangling Claws | 21 | none | *no compendium match* |
| V Weps | Brilliant Hooves | 22 | none | *no compendium match* |
| V Weps | Razor's Edge | 23 | none | *no compendium match* |
| Services | Accomodations | 2 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Services | Accomodations | 3 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Services | Accomodations | 4 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Services | Provisions | 5 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Services | Provisions | 6 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Services | Provisions | 7 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Services | Transportation | 8 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Services | Transportation | 9 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Services | Transportation | 10 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Services | Interstellar Travel | 11 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Services | Interstellar Travel | 12 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Services | Interstellar Travel | 13 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Services | Interstellar Travel | 14 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Services | Interstellar Travel | 15 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Services | Interstellar Travel | 16 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Services | Medical Care | 17 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Services | Medical Care | 18 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Services | Medical Care | 19 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Services | Medical Care | 20 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Services | Path to Silence | 21 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Services | Purification Strike | 22 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Services | Purification Strike | 23 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Services | Purification Strike | 24 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | -- | 2 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Lux-equus | 3 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Grizdek Slithercatch | 4 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Jetbike | 5 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Jetbike | 6 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Raider | 7 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Glassteed | 8 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Warhorse | 9 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Skerab Walker | 10 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Van Cleef's Wader | 11 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Aelurus Heavy Trike | 12 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Hectin Autocarriage | 13 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Veloxic Bike | 14 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Viator Desert Crawler | 15 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Wildcat Transport Buggy | 16 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Repressor Armoured Transport | 17 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Immolator | 18 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Rhino | 19 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Chimera | 20 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Sentinel | 21 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Taurox | 22 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Meiron Explorer | 23 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Meiron Scout Rover | 24 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Meiron Transporter | 25 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | MCR Vanguard | 26 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | "Disguised" Carriage | 27 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Malleus Ignem | 28 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Astartes Rhino | 29 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Serberys Sulphuran | 30 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Astartes Scout Bike | 31 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Chiropteran Scout | 32 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Aquila Lander | 33 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Arvus Lighter | 34 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Fury Interceptor(Calixis) | 35 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Gun-Cutter | 36 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Drop Pod | 37 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Exodite Carnosaur | 38 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Warbike | 39 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Warbike(w/ sidecar) | 40 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Warbuggy(Scrapjet) | 41 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Warbuggy(Boomdakka) | 42 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Warbuggy(Boosta-Blasta) | 43 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | War Buggy(Shokkjump) | 44 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Warbuggy(Squigbuggy) | 45 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Trukk | 46 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Vehicles | Warbike of the Aporkalypse | 47 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Creatures | Grizdek Slithercatch | 2 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Creatures | Tau Drone | 3 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Creatures | Demiurg Turret | 4 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Creatures | Demiurg Sentinel Drone | 5 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Creatures | Servo-skull | 6 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Creatures | Crystal Servo-skull | 7 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Creatures | Lux-equus | 8 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Creatures | Charon Battle Servitor | 9 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Creatures | Clan V'lan Ogryn Warrior | 10 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Creatures | Valhallan Defender | 11 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Creatures | Fire Caste Commando | 12 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Creatures | Ferrymen Assassin | 13 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Creatures | Carradini Bannermen | 14 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Creatures | Abaoth Deckhands(all) | 15 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Creatures | Abaoth Armsmen(all) | 16 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Creatures | Tarantula Sentry Gun | 17 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Creatures | Exodite Ashqyen | 18 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Creatures | Razorwing | 19 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Creatures | Exodite Carnosaur | 20 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Creatures | Serberys Suphuran | 21 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Hull | Armageddon | 2 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Hull | Chalice | 3 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Hull | Mars | 4 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Hull | Overlord | 5 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Hull | Ambition | 6 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Hull | Conquest | 7 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Hull | Dictator | 8 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Hull | Lunar | 9 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Hull | Tyrant | 10 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Hull | Claymore | 11 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Hull | Falchion | 12 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Hull | Firestorm | 13 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Hull | Sword | 14 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Hull | Tempest | 15 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Hull | Turbulent | 16 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Hull | Avenger | 17 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Hull | Exorcist | 18 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Hull | Repulsive | 19 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Hull | Dauntless | 20 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Hull | Defiant | 21 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Hull | Endeavour | 22 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Hull | Lathe | 23 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Hull | Secutor | 24 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Hull | Cobra | 25 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Hull | Havoc | 26 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Hull | Hazeroth | 27 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Hull | Iconoclast | 28 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Hull | Meritech Shrike | 29 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Hull | Viper | 30 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Hull | Carrack | 31 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Hull | Goliath | 32 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Hull | Jericho | 33 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Hull | Loki | 34 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Hull | Orion | 35 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Hull | Universe | 36 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Hull | Vagabond | 37 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Squads | Abaoth Armsmen | 2 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Squads | Yeldi Fire Warrior Cadre | 3 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Squads | Rawne's Raiders | 4 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Squads | Valhallan Warren-kin | 5 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Squads | Ogryn Mob | 6 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Squads | Muddy "Bannermen" | 7 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | Harlan Sneed | 2 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | Austros Kokolias | 3 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | Charin | 4 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | Corvin Defin | 5 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | Sarina Glessvig | 6 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | M-O/M80/W2N | 7 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | Ariadne de Aquinius | 8 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | Jasmin Donnet | 9 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | Kaezahn | 10 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | Michel Delon | 11 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | Cheef | 12 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | Stig Nilsson | 13 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | Paddy McPherson | 14 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | Emilios Galanis | 15 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | Xi-Xi 18 | 16 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | Isidor Dimitriev | 17 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | Yarp | 18 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | Stasius Drusus | 19 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | Pholous Hispaniensis | 20 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | Lyra Quantus | 21 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | Jak | 22 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | Igan Assassin | 23 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | Ferryman Assassins | 24 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | Ogryn Clansmen | 25 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | Sept Commandos | 26 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | Valhallan Refugees | 27 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | Rawne's Raiders | 28 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | Armsmen(Exousia) | 29 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | Armsmen(Bulwark) | 30 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | Armsmen(Dauntless) | 31 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | Defenders(Garmr) | 32 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | Defenders(Kraken) | 33 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | Defenders(Kalova) | 34 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | The Escadrilles | 35 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | -- | 36 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | -- | 37 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | -- | 38 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | -- | 39 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | -- | 40 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | -- | 41 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | -- | 42 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | -- | 43 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| Allies | row-44 | 44 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Auto-Stabilised Logis-Targeter | 2 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | BG-15 Assault Scanners | 3 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Deep Void Augur Array | 4 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Ghost-Pattern Detection Array | 5 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | M-100 Augur Array | 6 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | M-201.b Augur Array | 7 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | R-50 Auspex Multi-Band | 8 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | W-240 Passive Detection Arrays | 9 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | X-470 Ultimo Array | 10 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Bilge Rat Quarters | 11 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Bilge Rat Quarters | 12 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Clan-Kin Quarters | 13 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Clan-Kin Quarters | 14 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Cold Quarters | 15 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Cold Quarters | 16 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Pressed-Crew Quarters | 17 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Pressed-Crew Quarters | 18 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Skaald Clan-hold | 19 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Slave Quarters | 20 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Slave Quarters | 21 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Voidsman Quarters | 22 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Voidsman Quarters | 23 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Belecane-Pattern 90.r Gellar Field | 24 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Emergency Field | 25 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Gellar Field | 26 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Mezoa Gellar Void Integrant | 27 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Warpsbane Hull | 28 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Ancient Life Sustainer | 29 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Ancient Life Sustainer | 30 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Clemency-Pattern Life Sustainer | 31 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Clemency-Pattern Life Sustainer | 32 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Euphoric Life Sustainer | 33 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Euphoric Life Sustainer | 34 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | M-1.r Life Sustainer | 35 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | M-1.r Life Sustainer | 36 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Vitae Pattern Life Sustainer | 37 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Vitae Pattern Life Sustainer | 38 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Cypra-Pattern Class 1 Drive | 39 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Cypra-Pattern Class 2 Drive | 40 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Jovian Pattern "Warcruiser" | 41 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Jovian Pattern "Warcruiser" | 42 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Jovian Pattern Class 1 Drive | 43 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Jovian Pattern Class 2 Drive | 44 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Jovian Pattern Class 3 Drive | 45 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Jovian Pattern Class 4 Drive | 46 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Jovian Pattern Class 8.1 Drive | 47 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Jovian Pattern Class 8.2 Drive | 48 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Jovian Pattern Class 8.3 Drive | 49 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Jovian Pattern Class 8.4 Drive | 50 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Lathe Pattern 2a Drive | 51 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Lathe Pattern 2b "Escort" Drive | 52 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Lathe Pattern Class 1 Drive | 53 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Mezoa-Pattern Theta-7 Drive | 54 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Mimic Engine | 55 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Mimic Engine | 56 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Mimic Engine | 57 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Mimic Engine | 58 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Modified Drive | 59 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Saturnine-Pattern Class 4A "Ultra" | 60 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Saturnine-Pattern Class 5 Drive | 61 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Armored Command Bridge | 62 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Armored Command Bridge | 63 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Automata Bridge | 64 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Bridge of Antiquity | 65 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Bridge of Antiquity | 66 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Combat Bridge | 67 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Combat Bridge | 68 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Command Bridge | 69 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Command Bridge | 70 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Commerce Bridge | 71 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Exploration Bridge | 72 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Exploration Bridge | 73 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Fleet Flag Bridge | 74 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Flight Command Bridge | 75 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Invasion Bridge | 76 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Ship Master's Bridge | 77 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Smuggler's Bridge | 78 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Castellan Shield | 79 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Castellan Shield Array | 80 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Ghost Field | 81 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Multiple Void Shield Array | 82 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Repulsor Shield | 83 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Repulsor Shield Array | 84 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Single Void Shield Array | 85 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Triple Void Shield Array | 86 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Voss "Glimmer"-pattern Array | 87 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Voss "Glimmer"-pattern Multiple Array | 88 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Albanov 1 Warp Engine | 89 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Ascension Phase Engine | 90 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Klenova Class M Warp Engine | 91 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Klenova Class α Warp Engine | 92 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Markov 1 Warp Engine | 93 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Markov 2 Warp Engine | 94 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Miloslav G-616.b Warp Engine | 95 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Miloslav H-616.b Warp Engine | 96 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Segrazian "Viperdrive" Pirate Engine | 97 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Strelov 1 Warp Engine | 98 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Strelov 2 Warp Engine | 99 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Ess | Rho-Ultima Archeoanalyzer | 100 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Gauss Cannon | 2 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Dawnbringer | 3 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Dragon's Breath Lance Weapon | 4 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Duskbringer | 5 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Godsbane Lance | 6 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Godsbane Lance Battery | 7 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Las-Burner | 8 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Mezoa-Pattern Hybrid Lance Battery | 9 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Mezoa-Pattern Hybrid Lance Weapon | 10 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Star-Flare Lance | 11 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Starbreaker Lance Weapon | 12 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Sunhammer Lance | 13 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Sunhammer Lance Battery | 14 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Titanforge Lance Battery | 15 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Titanforge Lance Weapon | 16 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Voidsunder Lance Battery | 17 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Ares-Pattern Macrocannon | 18 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Dark Cannon | 19 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Disruption Macrocannon Broadside | 20 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Disruption Macrocannons | 21 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Eldar Starcannon Cluster Battery | 22 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Energy Drain Matrix | 23 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Grapple Cannon | 24 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Hecutor-Pattern Plasma Battery | 25 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Hecutor-Pattern Plasma Broadside | 26 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Jovian Missile Battery | 27 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Lathe Grav-culverin Broadside | 28 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Mars Pattern Macrocannon Broadside | 29 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Mars Pattern Macrocannons | 30 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Mezoa Macrocannons | 31 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Missile Battery | 32 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Pyros Melta-cannons | 33 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Railgun Battery | 34 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Railgun Battery | 35 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Ryza Pattern Plasma Battery | 36 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Shard Cannon Battery | 37 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Staravar Laser Macrobattery | 38 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Stygies-Pattern Bombardment Cannons | 39 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Stygies-Pattern Macrocannons | 40 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Sunsear Las-Broadside | 41 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Sunsear Laser Battery | 42 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Sunsear Mark 2 Laser Battery | 43 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Thunderstrike Macrocannons | 44 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Jovian-Pattern Nova Cannon | 45 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Mars-Pattern Nova Cannon | 46 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Ryza-Pattern Nova Cannon | 47 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Hold Landing Bay | 48 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Jovian-Pattern Escort Bay | 49 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Jovian-Pattern Landing Bay | 50 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Lathe-Pattern Landing Bay | 51 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Guided | 52 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Hunter-Seeker | 53 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Seeking | 54 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Short-Burn | 55 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Standard | 56 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Fortis-Pattern Torpedo Tubes | 57 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Gravitic Launcher | 58 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Gryphonne-Pattern Torpedo Tubes | 59 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Mars-Pattern Torpedo Tubes | 60 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Plasma Accelerated Torpedo Tubes | 61 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Voss-Pattern Torpedo Tubes | 62 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Boarding Torpedo | 63 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Hunter-Seeker Torpedo | 64 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Melta Torpedo | 65 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Plasma Torpedo | 66 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Virus Torpedo | 67 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | Vortex Torpedo | 68 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | "Sunwrath" Laser Battery | 69 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Wpns | "Sunwrath" Lance Weapon | 70 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | "Storm" Drop Pod Launch Bays | 2 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Arboretum | 3 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Arboretum | 4 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Armor Plating* | 5 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Armor Plating* | 6 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Armored Prow* | 7 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Asteroid Mining Facility | 8 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Astropathic Choir-Chambers | 9 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Augmented Retro-Thrusters | 10 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Augmented Retro-Thrusters | 11 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Augmented Retro-Thrusters | 12 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Auto Temple | 13 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Auxiliary Plasma Banks | 14 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Auxiliary Plasma Banks | 15 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Barracks | 16 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Brig | 17 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Broadband Hymn-Casters | 18 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Cargo Hold and Lighter Bay | 19 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Chameleon Hull | 20 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Cloudmining Facility | 21 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Cogitator Interlink | 22 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Compartmentalized Cargo Hold | 23 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Crew Reclamation Facility | 24 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Defensive Countermeasures | 25 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Eldar Aconite Solar Sails | 26 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Eldar Holo Field | 27 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Emergency Energy Reserves | 28 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Emergency Energy Reserves | 29 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Empyrean Mantle | 30 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Empyrean Mantle | 31 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Energistic Conversion Matrix | 32 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Evacuation Bay* | 33 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Excess Void Armor | 34 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Excess Void Armor | 35 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Extended Supply Vaults | 36 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Field Bracing | 37 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Fire Suppression System | 38 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Fire Suppression System | 39 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Fire Suppression System | 40 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Flak Turrets | 41 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Flicker Device | 42 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Flicker Device | 43 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Forward Deflector Grid | 44 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Ghost Field | 45 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Gilded Hull | 46 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Gilded Hull | 47 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Grav Repulsors | 48 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Gravitic Hooks | 49 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Graviton Flare | 50 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Gravity Sails | 51 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Gravity Sails | 52 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Gyro-Stabilization Matrix | 53 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Hydraphuran KL-247 Jamming System | 54 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Laboratorium | 55 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Librarium Vault | 56 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Lux Net | 57 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Luxury Passenger Quarters | 58 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Main Cargo Hold | 59 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Manufactorum | 60 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Marian Detachment Quarters | 61 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Medicae Deck | 62 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Melodium | 63 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Micro Laser Defense Grid | 64 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Minelayer Bay | 65 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Munitorium | 66 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Munitorium | 67 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Murder Servitors | 68 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Null Bay | 69 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Observation Dome | 70 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Pharmacia | 71 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Pilot's Chamber | 72 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Plasma Scoop | 73 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Plasma Scoop | 74 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Power Ram | 75 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Recovery Chambers | 76 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Reinforced Interior Bulkheads | 77 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Reinforced Interior Bulkheads | 78 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Reinforced Prow | 79 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Reinforced Prow | 80 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Runecaster | 81 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Salvage Systems | 82 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Sensorium | 83 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Shadowblind Bays | 84 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Shadowfield | 85 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Ship's Stores | 86 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Ship's Stores | 87 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Small Craft Repair Dock | 88 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Spacedock Piers | 89 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Suspension Chambers | 90 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Suspension Chambers | 91 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Teleportarium | 92 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Teleportarium(ancient) | 93 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Temple-Shrine to the God-Emperor | 94 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Tenebro-Maze | 95 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Tenebro-Maze | 96 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | The Grand Compendium | 97 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Trophy Room | 98 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Variable Figurehead | 99 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Warp Antenna | 100 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Warp Disruptor | 101 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Warp Gate Map | 102 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Warp Sextant | 103 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Witch Augur | 104 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | XED1.11178e "Ubertas" Device | 105 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Xenos Habitats | 106 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Xenos Librarium | 107 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Supp | Rho-Ultima Archeoanalyzer | 108 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Upgs | Arrester Engines | 2 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Upgs | Astartes Detachment | 3 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Upgs | Atomics | 4 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Upgs | Blessed Atomics | 5 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Upgs | Cherubim Aerie | 6 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Upgs | Crew Improvements | 7 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Upgs | Disciplinarium | 8 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Upgs | Distributed Cargo Hold | 9 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Upgs | Exterminatus Device | 10 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Upgs | Mimic Drive | 11 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Upgs | Ostentatious Displays of Wealth | 12 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Upgs | Overload Shield Capacitors | 13 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Upgs | Resolution Arena | 14 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Upgs | Secondary Reactors | 15 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Upgs | Servitor Crew | 16 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Upgs | Star Chart Collection | 17 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Upgs | Storm Trooper Detachment | 18 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Upgs | Superior Damage Control | 19 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Upgs | Targeting Matrix | 20 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Upgs | Turbo-Weapon Batteries | 21 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Upgs | Vaulted Ceilings | 22 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Etc | Krakenslayer | 2 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Etc | Planetbound for Millenia | 3 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Etc | Reaver of the Unbeholden Reaches | 4 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Etc | Thulian Explorator Vessel | 5 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Etc | Veteran of the Angevin Crusade | 6 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Etc | A Nose for Trouble | 7 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Etc | Adventurous | 8 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Etc | Ancient and Wise | 9 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Etc | Blasphemous Tendencies | 10 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Etc | Martial Hubris | 11 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Etc | Rebellious | 12 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Etc | Resolute | 13 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Etc | Skittish | 14 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Etc | Stoic | 15 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Etc | Temporally Unmoored | 16 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Etc | Wrothful | 17 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Etc | Death Cult | 18 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Etc | Emissary of the Imperator | 19 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Etc | Finances in Arrears | 20 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Etc | Haunted | 21 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Etc | Mercenary Corps | 22 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Etc | Mysterious Death Cult | 23 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Etc | Reliquary of Mars | 24 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Etc | Temperamental Warp Engine | 25 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Etc | The Fourth Protocol | 26 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Etc | Turbulent Past | 27 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Etc | Wolf in Sheep's Clothing | 28 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Etc | Wrested from a Space Hulk | 29 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
| VS Etc | Xenophilious | 30 | n-a | No native Item type in dark-heresy-3rd-edition compendia — use Actor (enemy/vehicle), JournalEntry, or Macro. |
