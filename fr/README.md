## Description

An add-on module for Asacolips' Powered by the Apocalypse (PbtA) system for Foundry VTT to add the Monster of the Week playbooks and moves. It will also configure the actor and NPC sheets for Monster of the Week. The Character Sheet is now available in English, French, German, Brazilian Portuguese and Swedish.

The module also includes playbooks from Monster of the Week: Tome of Mysteries, and MotW: Hardcover Edition, plus Special (Luck) Moves, More Flexible Investigations, and Alternative Weird Basic Moves.

## Installation

* Install

To install and use this module, simply find it and download it in the **Install Module** dialog on the Setup menu of the Foundry VTT application.

!DO NOT! use this module at the same time as similar Add-on modules as this may cause loops and other unwanted effects.

* Uninstall

When removing this module from your game world, the settings in the "System Settings" page will remain. You can change them individually or use the "Reset to Defaults" button at the bottom of the page to revert everything back to it's default state in the PbtA system.

### Dependencies

The following Foundry VTT game system must be installed: [Powered by the Apocalypse](https://gitlab.com/asacolips-projects/foundry-mods/pbta), by Asacolips.

## Credits
 
* This module has been made possible with the kind and express permission of Michael Sands.

* Monster of the Week is created by Michael Sands. Monster of the Week is copyrighted by Evil Hat Productions, LLC and Generic Games.
* Tome of Mysteries text and artwork are copyright © 2018-2019 Michael Sands, Generic Games, Evil Hat Productions, LLC and their respective creators.
* Monster of the Week: Codex of Worlds text and artwork are copyright © 2023 Michael Sands, Generic Games, Evil Hat Productions LLC, and their respective creators.

* The Powered by the Apocalypse system for Foundry VTT is created and maintained by Asacolips.
* French translation by TooPick (Alexandre SANIGOU). German translation by benjin and HAL325. Brazlilian Portuguese translation by mclemente. Thank you all!

## Additional credits

* For Tome of Mysteries [ToM]: The Gumshoe (Mark Tygart), The Hex (Bruno Dias), The Pararomantic (Michał Werder), The Searcher (Michael Sands).
* For Monster of the Week Hardcover Edition [HE]: The Snoop (Michael Sands), The Spooktacular (Michael Sands).
* For Codex of Worlds [CoW]: Marek Golonka (Co-author).

## Licensing

This module is for use with with Monster of the Week by Michael Sands and is used under Generic Games' [Third Party License](https://genericgames.co.nz/third_party_policy/).

MIT License - Copyright (c) 2023 Rangertheman

## Feedback

* Despite the approval, please note that this is not an official product of Michael Sands, Evil Hat or Generic Games. I assume full responsibility for its functionality.
* Any suggestion or feedback is greatly appreciated. Please use the issue system.

---

## Version 0.7.0 (Foundry v14, traduction française)

- Compatible Foundry VTT v14 et système PbtA ≥ 1.2.0.
- Traduction française complète des compendiums (manœuvres, livrets, étiquettes).
- Nouvelle disposition de la fiche de personnage : attributs en colonne sous le portrait, jauges regroupées, description des manœuvres en infobulle au survol.
- Nouveau compendium « Équipement » : armes, armures, transports, matériel, attaques de base et options, avec leurs étiquettes.
- Module non officiel, gratuit, distribué avec l'autorisation de Michael Sands. Monster of the Week est © Generic Games / Evil Hat Productions. Base : motw-for-pbta de Rangertheman (MIT).

## Version 0.8.0 — Icônes

Chaque manœuvre, objet, étiquette d'amélioration et livret possède désormais un pictogramme SVG (dossier `icons/`).
Les couleurs indiquent la catégorie : armes à feu, mêlée, explosifs, magie, armures, matériel, transports ; les manœuvres sont colorées selon la caractéristique du jet (Calme, Vigueur, Charme, Perspicacité, Étrange).

### Crédits des icônes

Les pictogrammes sont issus de la bibliothèque libre **[game-icons.net](https://game-icons.net)**, sous licence
[Creative Commons BY 3.0](https://creativecommons.org/licenses/by/3.0/) (certains en CC0). Ils ont été recolorés et placés
sur un fond coloré ; les silhouettes restent l'œuvre de leurs auteurs :

- **Lorc** — 110 icône(s)
- **Delapouite** — 97 icône(s)
- **Skoll** — 11 icône(s)
- **sbed** — 10 icône(s)
- **DarkZaitzev** — 2 icône(s)
- **Faithtoken** — 2 icône(s)
- **Caro Asercion** — 2 icône(s)
- **Carl Olsen** — 2 icône(s)
- **Divers artistes (collection « badges » de game-icons.net)** — 2 icône(s)
- **SeregaCthtuf** — 1 icône(s)
- **Zeromancer (CC0)** — 1 icône(s)
- **Andy Meneely** — 1 icône(s)
- **John Colburn** — 1 icône(s)
- **Divers artistes (collection « various-artists » de game-icons.net)** — 1 icône(s)

Le détail des icônes utilisées et de leurs auteurs est dans `icons/CREDITS.json`. Merci à tous ces artistes.

## Version 0.9.0 — Apparence cliquable

Sur la fiche de personnage, l'onglet Description affiche les choix d'**Apparence** du livret sélectionné (genre, regard/visage, tenue…) sous forme de boutons. Un clic choisit l'option (un choix par liste, un second clic l'annule) et le résultat est reporté dans le champ « Look » de la fiche, sans écraser le texte que vous y avez écrit vous-même. Quelques termes restés en anglais dans ces listes ont été traduits.

## Version 0.10.0 — Caractéristiques et Histoire

Dans l'onglet Description de la fiche de personnage :
- chaque ligne de **Caractéristiques** du livret est un bouton : un clic applique d'un coup les cinq valeurs (Charme, Cool, Futé, Coriace, Bizarre) ;
- chaque lien de **Histoire** possède une zone pour saisir le nom du personnage concerné.

## Version 0.11.0 — Montée de niveau automatisée

La flèche à côté du niveau (active quand les cinq cases d'expérience sont cochées) ouvre la liste des améliorations du livret :
- « Gagner +1 en X, max +N » applique le +1 en respectant le maximum ;
- « Gagner +1 à une caractéristique au choix » propose le choix de la caractéristique ;
- « Prendre une autre manœuvre » et « Prendre une manœuvre d'un autre livret » ouvrent le choix de la manœuvre et l'ajoutent à la fiche ;
- les points de Chance utilisés sont récupérés ;
- les améliorations avancées ne sont proposées qu'après cinq améliorations prises ;
- les autres améliorations (alliés, refuge, etc.) sont simplement notées dans les champs Améliorations, à gérer à la main.
Un bouton « Améliorations » dans l'onglet Description permet de rouvrir la liste si on a fermé la fenêtre avant de choisir.

## Version 0.11.1

Une ligne de Caractéristiques choisie est verrouillée ; le MJ peut la déverrouiller depuis l'onglet Description.

## Version 0.12.0

- Nouveau compendium « Jouer un chasseur » : le chapitre « Prêt à l'action » du manuel (p. 105-137), traduit en français, en entrées de journal.
- Montée de niveau : sélection des améliorations puis bouton « Valider » ; niveau non modifiable à la main (sauf MJ).
- Bandeau « tags dépréciés » masqué sur les étiquettes.

## Problèmes connus et pistes d'amélioration

- **Montée de niveau :** cette partie est un travail en cours (work in progress) et sera améliorée dans une prochaine version.
- Les étiquettes (compendium « Étiquettes ») utilisent encore le type d'objet « étiquette » jugé déprécié par PbtA ; le bandeau d'avertissement est masqué.
- Version anglaise : disponible séparément (module « motw-for-pbta-en »).
