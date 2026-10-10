<div align="center">

🇫🇷 [Version française](README.md)

# 🌙 Monster of the Week for Foundry VTT v14
### *A sheet, playbooks, and a cabin full of monsters.*

![Foundry v14](https://img.shields.io/badge/Foundry%20VTT-v14-informational?style=flat-square)
![PbtA 1.2.0+](https://img.shields.io/badge/PbtA-1.2.0%2B-8a2be2?style=flat-square)
![Free](https://img.shields.io/badge/price-free-brightgreen?style=flat-square)
![FR / EN](https://img.shields.io/badge/languages-FR%20%7C%20EN-orange?style=flat-square)

*Unofficial, free module, published with Michael Sands' permission.*

</div>

---

## The pitch

Monsters don't take holidays, and neither do Foundry updates.
This module picks up the work of [Rangertheman](https://github.com/Rangertheman/motw-for-pbta) (deprecated, stuck on Foundry v13) and gets it back on its feet for **Foundry VTT v14** and the **Powered by the Apocalypse 1.2.0+** system, with a redesigned sheet, an equipment compendium, icons everywhere, and a proper **French edition**.

You play the hunters, the Keeper runs the monsters. We'll deal with the paperwork.

## What you get

**🎭 A more readable character sheet**
Attributes in a column under the portrait, gauges (Harm, Unstable, Luck, Experience) grouped together, move descriptions in a tooltip on hover.

**🖱️ A Description tab that works for you**
- *Look*: the playbook's choices are buttons, carried over to the sheet without overwriting your notes.
- *Ratings*: one click on a line applies all five values at once, then the line locks (the GM keeps the key).
- *History*: each link has its own field to note the name of the character involved.

**⬆️ Level-up**
The arrow next to the level lights up when all five experience boxes are marked. It opens the playbook's improvements and applies ratings, moves and Luck. Only the GM can edit the level by hand.

**🗡️ An Equipment compendium**
200+ items (weapons, armour, transport, gear, base attacks, options) with their tags. The playbooks' gear lists link straight to them.

**🎨 About 680 icons**
Moves, items, improvement tags, playbooks: each has its own pictogram, colour-coded by category.

**📖 Playing a Hunter** *(French edition)*
The rulebook chapter on playing a hunter (pp. 105–137), translated and split into journal entries you can consult in play.

**🧛 All the playbooks**
The 18 playbooks: basic moves, other moves, Tome of Mysteries, Hardcover Edition, Luck moves, more flexible investigations, alternative weird basic moves.

## Two editions

| | French edition | English edition |
|---|---|---|
| Id | `motw-for-pbta` | `motw-for-pbta-en` |
| Content | 24 translated compendiums + *Playing a Hunter* | Original version + Equipment compendium |
| Manifest | `https://github.com/Hancholito/FVTT-motw-for-pbta/releases/latest/download/module-fr.json` | `https://github.com/Hancholito/FVTT-motw-for-pbta/releases/latest/download/module-en.json` |

⚠️ Enable only **one** of the two in a given world, and never alongside the original module: they configure the same sheets.

## Installation

1. In Foundry, open **Add-on Modules → Install Module**.
2. Paste the manifest URL of the edition you want (table above) and confirm.
3. Create or open a **Powered by the Apocalypse** world (Asacolips' [pbta](https://gitlab.com/asacolips-projects/foundry-mods/pbta) system, version 1.2.0 or later), then enable the module.

Need a hand with a manual install? Unzip the archive from the latest [release](https://github.com/Hancholito/FVTT-motw-for-pbta/releases) into `Data/modules/`.

## Work in progress

- **Level-up**: this is a *work in progress*. The selection of improvements will be refined in a future version.
- Tags still use an item type that PbtA considers deprecated; its warning banner is simply hidden.

An idea, a bug, a badly behaved monster? Open an [issue](https://github.com/Hancholito/FVTT-motw-for-pbta/issues).

---

## Credits and licences

- **Monster of the Week** is created by Michael Sands, © Generic Games / Evil Hat Productions. This module is made with his permission, as long as it stays free. It is not an official product.
- Original module: [motw-for-pbta](https://github.com/Rangertheman/motw-for-pbta) by Krister Persson (Rangertheman), MIT licence.
- PbtA system for Foundry: Asacolips.
- Additional playbooks: *Tome of Mysteries* (The Gumshoe: Mark Tygart, The Hex: Bruno Dias, The Pararomantic: Michał Werder, The Searcher: Michael Sands), *Hardcover Edition* (The Snoop, The Spooktacular: Michael Sands).
- Icons: [game-icons.net](https://game-icons.net) (CC BY 3.0, some CC0), recoloured. Authors are listed in `icons/CREDITS.json`.
- Used under Generic Games' [Third Party License](https://genericgames.co.nz/third_party_policy/).

<div align="center">

*Happy hunting. And keep a Luck box in reserve.*

</div>
