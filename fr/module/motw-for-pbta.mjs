import {
   configSheet
} from "./helper/config-sheet.mjs";
import { registerMoveTooltips } from "./motw-sheet-tooltips.mjs";
import { registerLookPicker } from "./motw-sheet-look.mjs";
import { registerLevelUp } from "./motw-sheet-levelup.mjs";

// once the game has initialized, set up the module
Hooks.once('init', () => {

   registerMoveTooltips();
  registerLookPicker();
  registerLevelUp();

   // register MotW settings
   game.settings.register('motw-for-pbta', 'settings-override', {
      name: game.i18n.localize("motw.Settings.Title"),
      default: false,
      type: Boolean,
      scope: 'world',
      config: true,
      hint: game.i18n.localize("motw.Settings.Hint"),
      requiresReload: true
   });
   // Define custom PbtA system tags.
   game.pbta.tagConfigOverride = {
      // Tags available to any actor and item
      actor: {
          // Tags available to all actors
          all: '[{"value":"personne"}]',
          // Tags available to a specific actor type set up on game.pbta.sheetConfig.actorTypes (e.g. "character", "npc")
          character: '[{"value":"apparence repoussante"},{"value":"mobilité entravée"},{"value":"mains tremblantes"},{"value":"sens altérés"},{"value":"santé affaiblie"}]',
          npc: '[{"value":"sbire"}]'
      },
      item: {
          // Tags available to all actors
          all: '[{"value":"consommable"}]',
          // Tags available to a specific item type (e.g. "equipment", "move")
          weapon: '[{"value":"-1 dégât", "description":"Réduit les dégâts de 1"},{"value":"+1 dégât", "description":"Augmente les dégâts de +1"},{"value":"+2 dégâts", "description":"Augmente les dégâts de +2"},{"value":"+3 dégâts", "description":"Augmente les dégâts de +3"},{"value":"+4 dégâts", "description":"Augmente les dégâts de +4"},{"value":"1-dégât", "description":"C’est le nombre de dégâts que l’attaque inflige"},{"value":"2-dégâts", "description":"C’est le nombre de dégâts que l’attaque inflige"},{"value":"3-dégâts", "description":"C’est le nombre de dégâts que l’attaque inflige"},{"value":"4-dégâts", "description":"C’est le nombre de dégâts que l’attaque inflige"},{"value":"zone", "description":"Peut toucher plusieurs ennemis. Vous pouvez répartir les dégâts infligés entre plusieurs cibles"},{"value":"auto"},{"value":"équilibré", "description":"Facile à manier et à garder en main"},{"value":"barrière", "description":"Inflige des dégâts à tout ce qui la traverse. Compte comme une armure contre toute attaque qui la traverse"},{"value":"os"},{"value":"proche", "description":"Efficace à assez courte distance, hors de portée de bras, mais pas trop loin"},{"value":"fer froid"},{"value":"loin", "description":"Efficace à longue portée"},{"value":"feu", "description":"Met le feu"},{"value":"puissant", "description":"Repousse les choses et vous permet de les forcer où vous voulez, en plus des effets normaux de l’attaque"},{"value":"main", "description":"Efficace à portée de bras"}, {"value":"lourd", "description":"Cette arme est lourde et difficile à manier"}, {"value":"caché"}, {"value":"sacré", "description":"Plus efficace contre les monstres vulnérables aux objets sacrés"}, {"value":"ignore-armure", "description":"Ignore l’armure. L’armure n’a aucun effet sur ces dégâts. Si l’armure a l’étiquette magie, l’attaque a besoin à la fois de ignore-armure et de magie pour la contourner"}, {"value":"anodin", "description":"N’attire pas les soupçons"}, {"value":"intime", "description":"Efficace au plus près — dans l’étreinte de votre ennemi"}, {"value":"draine-vie", "description":"Transfère l’énergie vitale : le porteur guérit d’autant de points de dégâts qu’il en a infligés. Par ex. si vous infligez 2-dégâts, vous guérissez 2-dégâts de vos blessures"}, {"value":"bruyant", "description":"Assez bruyant pour attirer l’attention"}, {"value":"magie","description":"Enchanté : peut affecter certaines créatures et armures insensibles aux armes normales"}, {"value":"nombreux", "description":"Ces armes sont assez petites pour en porter un grand nombre"}, {"value":"sanglant", "description":"Répand beaucoup de sang et de viscères"}, {"value":"banal"}, {"value":"obsidienne"}, {"value":"évident"}, {"value":"d’un autre temps"}, {"value":"pratique"}, {"value":"rapide", "description":"Rapide à préparer et à utiliser, ce qui vous donne plus de chances d’agir en premier"}, {"value":"discret"}, {"value":"recharge", "description":"Cette arme a des munitions limitées et peut en manquer et devoir être rechargée"}, {"value":"entravant", "description":"Une attaque réussie entrave ou saisit la victime"}, {"value":"sérieux"}, {"value":"fétiche"}, {"value":"argent"}, {"value":"lent", "description":"Cette arme est lente à préparer et à utiliser"}, {"value":"petit", "description":"Cette arme est minuscule et facile à dissimuler"}, {"value":"acier"}, {"value":"pierre"}, {"value":"étourdissant"}, {"value":"crocs"}, {"value":"peu fiable", "description":"Cette arme demande un nettoyage et un entretien réguliers. Sinon, elle ne marchera tout simplement pas"}, {"value":"utile", "description":"Cette arme a d’autres usages que la violence"}, {"value":"précieux", "description":"Cette arme est ancienne ou faite de matériaux précieux"}, {"value":"volatile", "description":"Cette arme est dangereuse et instable"}, {"value":"bois"},{"value":"0-dégât","description":"Presque inoffensif : à peine plus dangereux qu’un coup de poing"},{"value":"contondant"},{"value":"fer"},{"value":"furtif"},{"value":"grand"},{"value":"irritant"}]',
          armour: '[{"value":"+1 armure", "description":"Augmente l’armure de +1"},{"value":"+2 armure", "description":"Augmente l’armure de +2"},{"value":"+3 armure", "description":"Augmente l’armure de +3"},{"value":"1-armure", "description":"Procure 1 point d’armure"},{"value":"2-armure", "description":"Procure 2 points d’armure"},{"value":"3-armure", "description":"Procure 3 points d’armure"}]'
      }
  };

});

Hooks.once('pbtaSheetConfig', () => {

   // Disable the sheet config form.
   game.settings.set('pbta', 'sheetConfigOverride', true);

   // Replace the game.pbta.sheetConfig with the MotW version.
   configSheet();

})