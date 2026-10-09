## Description

An unofficial, free **Foundry VTT v14** edition of the Monster of the Week module for Asacolips' Powered by the Apocalypse (PbtA) system. It adds the Monster of the Week playbooks, moves, tags and an equipment compendium, and configures the actor and NPC sheets for Monster of the Week.

It is based on [motw-for-pbta](https://github.com/Rangertheman/motw-for-pbta) by Rangertheman (base version 0.4.5, Foundry v12) and includes the playbooks from Monster of the Week: Tome of Mysteries and the Hardcover Edition, plus Special (Luck) Moves, More Flexible Investigations, and Alternative Weird Basic Moves.

This module has its own id (`motw-for-pbta-en`). **Do not enable it together with the original `motw-for-pbta` module or with the French edition**: they configure the same sheets and would conflict.

## What this edition adds

- Compatible with Foundry VTT v14 and PbtA system 1.2.0 or later.
- New character sheet layout: attributes in a column under the portrait, compact gauges (Harm, Unstable, Luck, Experience), move descriptions in a tooltip on hover.
- **Equipment compendium** (about 210 items): weapons, armour, transport, gear, base attacks and options, with their tags. The gear lists in the playbooks link to these items.
- **Icons** for about 680 moves, items, improvement tags and playbooks (see credits below).
- **Description tab helpers** on the character sheet: the playbook's *Look* choices, *Ratings* lines and *History* links are clickable (a ratings line sets all five ratings at once and is then locked; the GM can unlock it; each History link has a field for the character's name).
- **Level-up helper**: the arrow next to the level (active when the five experience boxes are marked) opens the playbook's improvement list and applies ratings, moves and Luck automatically. The level field can only be edited by the GM.
- The “deprecated tags” notice of PbtA is hidden on tag items.

## Installation

Install the module from the manifest URL provided with the release (or unzip the package into `Data/modules/`), then enable it in your world. The following Foundry VTT game system must be installed: [Powered by the Apocalypse](https://gitlab.com/asacolips-projects/foundry-mods/pbta), by Asacolips.

When removing the module, the settings in the “System Settings” page remain; use the “Reset to Defaults” button there to revert them.

### Icon credits

The pictograms come from the free library **[game-icons.net](https://game-icons.net)**, licensed under
[Creative Commons BY 3.0](https://creativecommons.org/licenses/by/3.0/) (some CC0). They have been recoloured and placed
on a coloured background; the silhouettes remain the work of their authors:

- **Lorc** — 110 icon(s)
- **Delapouite** — 97 icon(s)
- **Skoll** — 11 icon(s)
- **sbed** — 10 icon(s)
- **DarkZaitzev** — 2 icon(s)
- **Faithtoken** — 2 icon(s)
- **Caro Asercion** — 2 icon(s)
- **Carl Olsen** — 2 icon(s)
- **Various artists (game-icons.net “badges” collection)** — 2 icon(s)
- **SeregaCthtuf** — 1 icon(s)
- **Zeromancer (CC0)** — 1 icon(s)
- **Andy Meneely** — 1 icon(s)
- **John Colburn** — 1 icon(s)
- **Various artists (game-icons.net “various-artists” collection)** — 1 icon(s)


The detail of the icons used and their authors is in `icons/CREDITS.json`. Thanks to all these artists.

## Known issues and ideas

- **Level-up:** this part is a work in progress and will be improved in a future version.
- Tags (the “Tags” compendium) still use the item type PbtA considers deprecated; the warning notice is hidden.
- The French edition also contains a journal compendium with the “Playing a Hunter” chapter of the rulebook; it is not part of this English edition.

## Credits

* This module has been made possible with the kind and express permission of Michael Sands.
* Monster of the Week is created by Michael Sands. Monster of the Week is copyrighted by Evil Hat Productions, LLC and Generic Games.
* Tome of Mysteries text and artwork are copyright © 2018-2019 Michael Sands, Generic Games, Evil Hat Productions, LLC and their respective creators.
* Monster of the Week: Codex of Worlds text and artwork are copyright © 2023 Michael Sands, Generic Games, Evil Hat Productions LLC, and their respective creators.
* The Powered by the Apocalypse system for Foundry VTT is created and maintained by Asacolips.
* For Tome of Mysteries [ToM]: The Gumshoe (Mark Tygart), The Hex (Bruno Dias), The Pararomantic (Michał Werder), The Searcher (Michael Sands). For the Hardcover Edition [HE]: The Snoop and The Spooktacular (Michael Sands). Codex of Worlds [CoW]: Marek Golonka (co-author).

## Licensing

This module is for use with Monster of the Week by Michael Sands and is used under Generic Games' [Third Party License](https://genericgames.co.nz/third_party_policy/). The module and its iterations are free of charge.

MIT License - Copyright (c) 2023 Rangertheman

Please note that this is not an official product of Michael Sands, Evil Hat or Generic Games.
