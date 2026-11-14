// Contenu du parcours. Pour ajouter un module : ajoute un objet dans le tableau "modules" d'un niveau.
// Types : qcm (grammaire, vocabulaire, civique), lecture, ecoute, ecrit, oral, blanc (quiz tiré au hasard).
// Dans les questions : [question, [choix...], index de la bonne réponse, explication]. La bonne réponse est mélangée à l'affichage.

const EXAMEN_DEFAUT = "2027-09"; // objectif par défaut, modifiable par chaque personne

const POSITIONNEMENT = [
  // A2
  ["Je ___ à Mamoudzou depuis trois ans.", ["habite", "habiter", "habité", "habites"], 0, "A2"],
  ["Hier, nous ___ au marché.", ["sommes allés", "avons allé", "allons", "irons"], 0, "A2"],
  ["Tu veux ___ pain ?", ["du", "de la", "des", "un les"], 0, "A2"],
  ["Le médecin est ouvert ___ 8 h ___ 12 h.", ["de … à", "à … de", "en … au", "par … pour"], 0, "A2"],
  ["« Une ordonnance », c'est…", ["un papier du médecin pour les médicaments", "un horaire de bus", "un contrat de travail", "une facture d'eau"], 0, "A2"],
  // B1
  ["Quand j'étais petite, je ___ souvent chez ma grand-mère.", ["allais", "suis allée", "irai", "aille"], 0, "B1"],
  ["C'est la ville ___ je suis née.", ["où", "que", "qui", "dont"], 0, "B1"],
  ["Si j'ai le temps, je ___ demain.", ["viendrai", "viendrais", "venais", "vienne"], 0, "B1"],
  ["Le livre ___ je t'ai parlé est sur la table.", ["dont", "que", "qui", "où"], 0, "B1"],
  ["Il a perdu son travail ___ la crise.", ["à cause de", "grâce à", "parce que", "pour que"], 0, "B1"],
  // B2
  ["Il faut que tu ___ ce dossier avant lundi.", ["fasses", "fais", "feras", "faisais"], 0, "B2"],
  ["Si j'avais su, je ___ plus tôt.", ["serais venue", "viendrais", "suis venue", "venais"], 0, "B2"],
  ["___ il soit fatigué, il continue à travailler.", ["Bien qu'", "Même s'", "Malgré", "Puisqu'"], 0, "B2"],
  ["Le projet a été ___ par le conseil municipal.", ["adopté", "adopter", "adoptait", "adoptant"], 0, "B2"],
  ["Je ne pense pas qu'il ___ raison.", ["ait", "a", "aura", "avait"], 0, "B2"]
];

const NIVEAUX = []; // rempli par niveaux/a2.js, b1.js, b2.js, examen.js

const EPREUVES = {
  ecouter: { nom: "Écouter", icone: "🎧" },
  lire: { nom: "Lire", icone: "📖" },
  ecrire: { nom: "Écrire", icone: "✍️" },
  parler: { nom: "Parler", icone: "🗣️" },
  grammaire: { nom: "Grammaire", icone: "🧩" },
  vocabulaire: { nom: "Vocabulaire", icone: "💬" },
  civique: { nom: "Vie en France", icone: "🇫🇷" }
};
