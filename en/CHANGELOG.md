# Changelog

All changes made since the base version (**0.4.5**, motw-for-pbta by Rangertheman, Foundry v12). The English edition shares its version numbers with the French edition.

## [0.14.0] — Choice windows on level-up
### Added
- Level-up: improvements that used to be only written down by hand now open a choice window.
  - **Haven** ("Get a haven", "Add an option to your haven", laboratory, workshop, mystical library): lists the Expert's haven options, enforces the exact number and excludes those already taken. The chosen options are added to the character's moves.
  - **Basic moves marked as advanced** ("Mark two of the basic moves as advanced", "another two"): pick among the basic moves not yet marked; they are flagged on the character (internal flag) and noted.
  - **Ally, team, chapter, Guide, Rotes, tags to delete, etc.**: a window asks for a name and details, noted with the improvement.
  - **Retire this hunter** (the character's name gets "(retired)"), **Create a second hunter** (opens actor creation), **Change this hunter to a new type** (pick the new playbook) and **free yourself from the curse** (−1 Weird).

## [0.13.0] — English edition
### Added
- **Character creation assistant**: once the playbook and moves are chosen, the sheet switches to the Description tab (look and ratings), then to the Equipment tab, where a window offers the playbook's gear.
- The window grants the fixed items (laptop, armour, etc.), then asks for the playbook's choices ("pick two weapons from…") and enforces the exact number. The gear rules for all 27 playbooks are in `data/gear-rules.json`.
- Progress is remembered: a "Character creation" banner lets players resume at any time if they close a window. Only the GM can end the creation early, or reopen the gear window from the Equipment tab.
- 9 extra playbooks, each with its own move compendium, gear and tags: The Creature, The Tough, The Exile, The Nosy Kid, The Luchador, The Mad Scientist, The Summoned, The Big Game Hunter and The Unleashed Scientist (labelled "[Extra]").
- The Snooper is not duplicated: the existing Snoop [HE] covers it.
- New equipment items and tags linked from the new playbooks.
### Note
- These playbooks are an unofficial translation from the French supplementary playbooks; names and wording may differ from any official English text.
### Fixed
- Level-up: the improvements window no longer reacted to clicks, so nothing was applied. Improvements can be selected again, "Get +1 X" raises the rating, and "Take another move" / "from another playbook" open their choice windows.
### Changed
- Level-up: "Get +1 X" improvements now parse correctly.

## [0.12.0] — English edition
### Added
- First English edition of the v14 module (id `motw-for-pbta-en`), built from the original English texts.
- Equipment compendium in English, with the same icons and tags; playbook gear lists link to it.
- Sheet helpers (Look, Ratings and History buttons, level-up dialog) adapted to the English playbooks.
- Level-up: improvements are selected with a click (a second click deselects), up to the pending levels, then confirmed with a **Confirm** button.
### Changed
- The character level can no longer be edited by hand (except by the GM); only the level-up arrow raises it.
- The PbtA “deprecated tags” notice is hidden on tag items.
- Dangling links to tags that never existed in the original module were replaced by plain text.

## Changes shared with the French edition (0.6.0 – 0.11.1)
- Foundry VTT v14 and PbtA 1.2.0 compatibility.
- New sheet layout; move description tooltips (300 ms delay).
- Equipment compendium; weapon tags such as 0-harm, blunt, iron, stealthy, large, irritating; firearms are tagged loud.
- About 680 SVG icons (game-icons.net, CC BY 3.0 / CC0), colour-coded by category and by rating rolled.
- Clickable Look, Ratings and History in the Description tab; ratings lines lock after choosing.
- Automated level-up (ratings, moves, Luck); advanced improvements unlock after five improvements.

## Credits
Unofficial, free module, distributed with the permission of Michael Sands. Monster of the Week is © Generic Games / Evil Hat Productions. Base: motw-for-pbta by Rangertheman (MIT).
