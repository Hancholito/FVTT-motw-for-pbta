# Changelog

Toutes les modifications apportées depuis la version de base (**0.4.5**, motw-for-pbta de Rangertheman, Foundry v12).
Le format suit [Keep a Changelog](https://keepachangelog.com/fr/).

## [0.12.0] — Jouer un chasseur
### Ajouté
- Nouveau compendium **Jouer un chasseur** (entrées de journal) : traduction française du chapitre « Prêt à l'action » du manuel (p. 105 à 137). Sept entrées avec une page par sous-section : se préparer à l'action, comment jouer, manœuvres de base (avec grande magie et combats), dégâts et guérison (dont résurrection et Chance), équipement (étiquettes d'armes, armes personnalisées, armures), gagner des niveaux (améliorations de base, avancées et propres aux livrets) et résumé de séance. Les manœuvres de base citées renvoient vers les manœuvres du compendium.
- Montée de niveau : les améliorations se **sélectionnent** par un clic (un second clic désélectionne), dans la limite des niveaux en attente, puis un bouton **Valider** applique la sélection. On peut valider avec moins d'améliorations que de niveaux en attente et garder le reste pour plus tard.
### Modifié
- Le niveau du personnage n'est plus modifiable à la main (sauf par le MJ) : seule la flèche de montée de niveau l'augmente.
- Le bandeau d'avertissement « tags dépréciés » de PbtA est masqué sur la fiche des étiquettes.

## [0.11.1]
### Modifié
- Une fois une ligne de Caractéristiques choisie, elle est verrouillée : les autres lignes sont grisées et les valeurs de la fiche deviennent en lecture seule (les améliorations de niveau continuent de les modifier). Le MJ voit un bouton « Déverrouiller les caractéristiques » pour corriger une erreur.

## [0.11.0] — Montée de niveau automatisée
### Ajouté
- La flèche à côté du niveau (active quand les 5 cases d'expérience sont cochées) ouvre la liste des améliorations du livret.
- « Gagner +1 en X, max +N » applique le +1 en respectant le maximum ; « +1 à une caractéristique au choix » propose le choix.
- « Prendre une autre manœuvre » et « Prendre une manœuvre d'un autre livret » proposent les manœuvres disponibles et les ajoutent à la fiche.
- « Récupérer un point de Chance utilisé » / « Effacer une marque de Chance » retire une case de Chance cochée.
- Améliorations avancées verrouillées avant 5 améliorations prises ; chaque amélioration n'est prise qu'une fois.
- Les améliorations prises sont notées dans les champs Améliorations / Améliorations avancées ; les autres (alliés, refuge…) restent à gérer à la main.
- Bouton « Améliorations » dans l'onglet Description pour rouvrir la liste.
### Modifié
- Texte « Gagner des niveaux » des 18 livrets mis à jour pour décrire le nouveau fonctionnement.

## [0.10.0] — Caractéristiques et Histoire
### Ajouté
- Chaque ligne de **Caractéristiques** d'un livret est un bouton : un clic applique les cinq valeurs d'un coup.
- Chaque lien de **Histoire** a une zone de saisie pour le nom du personnage concerné.
### Corrigé
- Faute « Bizarre=+1 » dans Le Privé ; variantes d'écriture des signes (+, −, –, =) gérées.

## [0.9.0] — Apparence cliquable
### Ajouté
- Onglet Description : les choix d'**Apparence** du livret sont des boutons (un choix par liste) reportés dans le champ « Look » sans écraser le texte saisi à la main.
### Corrigé
- Mots restés en anglais dans les listes d'apparence (boy, girl, concealed, androgynous, indeterminate, transgressive, masked, mysterious, ambiguous).

## [0.8.0] — Icônes
### Ajouté
- Icônes SVG pour environ 680 éléments : équipement, manœuvres, étiquettes d'amélioration et livrets.
- Code couleur par catégorie (armes à feu, mêlée, explosifs, magie, armures, matériel, transports) et par caractéristique de jet pour les manœuvres.
- Crédits des auteurs dans le README et `icons/CREDITS.json` (game-icons.net, CC BY 3.0 / CC0).

## [0.7.1]
### Modifié
- Armes à feu : étiquette « bruyant » ajoutée à toutes (une arme à feu non silencieuse est bruyante).
- Étiquettes d'armes traduites en français ; ajout des étiquettes 0-dégât, contondant, fer, furtif, grand, irritant ; « enchanté » devient « magie » ; doublons supprimés.

## [0.7.0]
### Ajouté
- Nouveau compendium **Équipement** (214 objets) : armes, armures, transports, matériel, attaques de base et options, avec leurs étiquettes. Les listes d'équipement des livrets renvoient vers ces objets.
- Infobulle de description des manœuvres au survol de la fiche de personnage (délai de 300 ms, résultats séparés).
### Modifié
- Nouvelle disposition de la fiche de personnage : attributs en colonne verticale sous le portrait, jauges (Dégâts, Instable, Chance, Expérience) compactes en grille 2×2, liste des manœuvres sans menu déroulant.

## [0.6.0]
### Ajouté
- Compatibilité **Foundry VTT v14** et système **PbtA 1.2.0** (la base ciblait Foundry v12).
- **Traduction française complète** des 24 compendiums, dont les 18 livrets (Le Sinistre devient L'Effrayant), les manœuvres de base, autres manœuvres, manœuvres étranges, effets spéciaux et étiquettes.
### Corrigé
- Intro des livrets (« présentez votre … par ») : nom du livret manquant.
- Étiquettes à plusieurs mots (« peu fiable ») séparées à tort en deux.
- Liens d'équipement des livrets sans effet ou orphelins (1089 liens vérifiés, aucun cassé).

## Crédits
Module non officiel et gratuit, distribué avec l'autorisation de Michael Sands. Monster of the Week est © Generic Games / Evil Hat Productions. Base : motw-for-pbta de Rangertheman (MIT).
