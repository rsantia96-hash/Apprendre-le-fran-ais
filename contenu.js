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

const NIVEAUX = [
{
  id: "a2", nom: "Niveau A2", sous: "Les bases de la vie quotidienne",
  modules: [
  { id: "a2-present", type: "qcm", epreuve: "grammaire", titre: "Le présent des verbes utiles",
    mots: [["un verbe", "un mot qui dit une action : manger, aller, travailler"], ["conjuguer", "changer la fin du verbe selon la personne : je mange, nous mangeons"]],
    regle: `<p>Le présent sert à parler d'aujourd'hui et des habitudes.</p>
<ul><li><b>Verbes en -er :</b> je parle, tu parles, il parle, nous parlons, vous parlez, ils parlent</li>
<li><b>Être :</b> je suis, tu es, il est, nous sommes, vous êtes, ils sont</li>
<li><b>Avoir :</b> j'ai, tu as, il a, nous avons, vous avez, ils ont</li>
<li><b>Aller :</b> je vais, tu vas, il va, nous allons, vous allez, ils vont</li>
<li><b>Faire :</b> je fais, tu fais, il fait, nous faisons, vous faites, ils font</li></ul>
<p class="ex">Nous habitons à Mamoudzou. Vous faites les courses le samedi.</p>`,
    q: [
      ["Nous ___ le bus tous les matins.", ["prenons", "prenez", "prennent"], 0, "Prendre : nous prenons."],
      ["Vous ___ fatigués ?", ["êtes", "sont", "sommes"], 0, "Être : vous êtes."],
      ["Ils ___ deux enfants.", ["ont", "sont", "avons"], 0, "Avoir : ils ont."],
      ["Je ___ au travail à pied.", ["vais", "va", "allons"], 0, "Aller : je vais."],
      ["Qu'est-ce que vous ___ ce week-end ?", ["faites", "faisez", "font"], 0, "Faire : vous faites (forme irrégulière)."],
      ["Elle ___ le français et le malgache.", ["parle", "parles", "parlent"], 0, "Verbe en -er avec « elle » : elle parle."],
      ["Tu ___ où ?", ["habites", "habite", "habitez"], 0, "Avec « tu », on ajoute -s : tu habites."],
      ["Les enfants ___ à l'école.", ["vont", "va", "allez"], 0, "Aller : ils vont."],
      ["Je ___ 30 ans.", ["ai", "suis", "a"], 0, "En français, on « a » un âge : j'ai 30 ans."],
      ["Nous ___ la cuisine ensemble.", ["faisons", "faites", "font"], 0, "Faire : nous faisons."]
    ]},
  { id: "a2-passe", type: "qcm", epreuve: "grammaire", titre: "Le passé composé",
    mots: [["l'auxiliaire", "le petit verbe avant le participe : avoir ou être"], ["le participe passé", "la forme du verbe après l'auxiliaire : mangé, fini, venu"]],
    regle: `<p>Le passé composé raconte une action finie : <b>avoir ou être + participe passé</b>.</p>
<ul><li>La plupart des verbes prennent <b>avoir</b> : j'ai mangé, nous avons fini.</li>
<li>Les verbes de mouvement prennent <b>être</b> : aller, venir, arriver, partir, entrer, sortir, monter, descendre, naître, mourir, rester, tomber, retourner. Et tous les verbes avec « se » (je me suis levée).</li>
<li>Avec être, le participe s'accorde : elle est partie, ils sont venus.</li></ul>
<p class="ex">Hier, j'ai travaillé. Ma fille est tombée.</p>`,
    q: [
      ["Hier, j'___ un gâteau.", ["ai fait", "suis fait", "ai faite"], 0, "Faire prend « avoir » : j'ai fait."],
      ["Elle ___ à 8 heures.", ["est arrivée", "a arrivé", "est arrivé"], 0, "Arriver prend « être », et on accorde avec « elle » : arrivée."],
      ["Nous ___ le film.", ["avons vu", "sommes vus", "avons voir"], 0, "Voir prend « avoir » : nous avons vu."],
      ["Ils ___ en France en 2020.", ["sont venus", "ont venu", "sont venu"], 0, "Venir prend « être », accord au pluriel : venus."],
      ["Je ___ tôt ce matin.", ["me suis levée", "ai levé", "me suis levé"], 0, "Avec « se lever », on prend « être ». Une femme écrit « levée »."],
      ["Tu ___ ton travail ?", ["as fini", "es fini", "as finir"], 0, "Finir prend « avoir » : tu as fini."],
      ["Mes amies ___ hier soir.", ["sont parties", "ont parti", "sont partis"], 0, "Partir prend « être ». Amies = féminin pluriel : parties."],
      ["Il ___ le bus.", ["a pris", "est pris", "a prendu"], 0, "Prendre → pris : il a pris."],
      ["Vous ___ à la mairie ?", ["êtes allés", "avez allé", "êtes aller"], 0, "Aller prend « être » : vous êtes allés."],
      ["J'___ mon dossier à la préfecture.", ["ai envoyé", "suis envoyé", "ai envoyer"], 0, "Envoyer prend « avoir » : j'ai envoyé."]
    ]},
  { id: "a2-vocab", type: "qcm", epreuve: "vocabulaire", titre: "Les mots de la vie quotidienne",
    mots: [["la mairie", "le bureau de la ville (état civil, école, mariage)"], ["la CAF", "l'organisme qui verse les aides pour la famille et le logement"], ["un loyer", "l'argent qu'on paie chaque mois pour un logement"], ["une ordonnance", "le papier du médecin pour acheter des médicaments"]],
    regle: `<p>Ces mots servent tous les jours : santé, logement, administration, travail.</p>
<ul><li><b>Santé :</b> un rendez-vous, une ordonnance, la pharmacie, la carte Vitale, les urgences</li>
<li><b>Logement :</b> le loyer, le propriétaire, le bail, la caution, une facture</li>
<li><b>Administration :</b> la mairie, la préfecture, un formulaire, un justificatif de domicile</li>
<li><b>Travail :</b> un CV, un entretien d'embauche, un contrat, un salaire, une fiche de paie</li></ul>`,
    q: [
      ["Pour acheter des médicaments, il faut souvent…", ["une ordonnance", "un bail", "un CV"], 0, "L'ordonnance est écrite par le médecin."],
      ["Chaque mois, je paie mon ___ au propriétaire.", ["loyer", "salaire", "rendez-vous"], 0, "Le loyer est le prix du logement."],
      ["Pour inscrire mon enfant à l'école, je vais à…", ["la mairie", "la pharmacie", "la banque"], 0, "L'inscription à l'école primaire se fait à la mairie."],
      ["Une facture d'électricité peut servir de…", ["justificatif de domicile", "fiche de paie", "carte Vitale"], 0, "Elle prouve où tu habites."],
      ["Avant de travailler, on signe…", ["un contrat", "une ordonnance", "un bail"], 0, "Le contrat de travail fixe les règles du poste."],
      ["En cas d'accident grave, je vais…", ["aux urgences", "à la mairie", "à la poste"], 0, "Les urgences sont à l'hôpital."],
      ["Le document qui montre mon salaire du mois, c'est…", ["la fiche de paie", "le bail", "le formulaire"], 0, "On dit aussi « bulletin de salaire »."],
      ["Pour louer un appartement, on signe…", ["un bail", "une ordonnance", "un entretien"], 0, "Le bail est le contrat de location."],
      ["« Prendre rendez-vous » veut dire…", ["fixer un jour et une heure pour voir quelqu'un", "payer une facture", "changer de logement"], 0, "Exemple : prendre rendez-vous chez le médecin."],
      ["La carte Vitale sert pour…", ["la santé", "le logement", "le transport"], 0, "Elle permet d'être remboursé par l'Assurance maladie."]
    ]},
  { id: "a2-lecture", type: "lecture", epreuve: "lire", titre: "Lire des messages simples",
    mots: [["fermé", "pas ouvert"], ["exceptionnellement", "seulement cette fois, pas d'habitude"]],
    docs: [
      { titre: "Affiche à la pharmacie", texte: `<p><b>Pharmacie du Port</b><br>Ouverte du lundi au samedi, de 8 h à 12 h 30 et de 14 h 30 à 19 h.<br>Fermée le dimanche.<br>Exceptionnellement, la pharmacie sera fermée le samedi 21 novembre.</p>`,
        q: [
          ["Quand la pharmacie est-elle fermée chaque semaine ?", ["Le dimanche", "Le samedi", "Le lundi", "Le mercredi"], 0, "« Fermée le dimanche »."],
          ["Peut-on y aller à 13 h un mardi ?", ["Non, c'est fermé", "Oui", "Seulement avec une ordonnance", "Seulement le matin"], 0, "Entre 12 h 30 et 14 h 30, c'est fermé."],
          ["Que se passe-t-il le samedi 21 novembre ?", ["La pharmacie est fermée", "Elle ouvre plus tard", "Elle ferme à 12 h", "Elle est ouverte toute la journée"], 0, "« Exceptionnellement » : seulement ce jour-là."]
        ]},
      { titre: "SMS de l'école", texte: `<p>Bonjour, la sortie à la plage de la classe de CE2 est reportée au vendredi 4 décembre à cause de la pluie. Merci de donner à votre enfant un pique-nique et une casquette. Mme Ali, maîtresse.</p>`,
        q: [
          ["Pourquoi la sortie change de date ?", ["À cause de la pluie", "La maîtresse est malade", "Le bus est en panne", "Il fait trop chaud"], 0, "« reportée … à cause de la pluie »."],
          ["« Reportée » veut dire…", ["déplacée à plus tard", "annulée pour toujours", "avancée", "payante"], 0, "Reporter = mettre à une autre date, plus tard."],
          ["Que faut-il donner à l'enfant ?", ["Un pique-nique et une casquette", "De l'argent", "Un maillot seulement", "Un livre"], 0, "C'est écrit dans le message."]
        ]}
    ]},
  { id: "a2-ecoute", type: "ecoute", epreuve: "ecouter", titre: "Comprendre un message court",
    mots: [["rappeler", "téléphoner à nouveau à quelqu'un"], ["le cabinet", "le bureau du médecin"]],
    docs: [
      { titre: "Message sur le répondeur", audio: "Bonjour madame, c'est le cabinet du docteur Martin. Votre rendez-vous de jeudi à 10 heures est annulé. Le docteur peut vous recevoir vendredi à 15 heures. Merci de nous rappeler au 02 69 61 00 00.",
        q: [
          ["Qui appelle ?", ["Le cabinet du médecin", "L'école", "La pharmacie", "La mairie"], 0, "« C'est le cabinet du docteur Martin »."],
          ["Quel est le nouveau rendez-vous proposé ?", ["Vendredi à 15 h", "Jeudi à 10 h", "Vendredi à 10 h", "Jeudi à 15 h"], 0, "Le rendez-vous de jeudi est annulé ; on propose vendredi 15 h."],
          ["Que doit faire la personne ?", ["Rappeler le cabinet", "Aller à la pharmacie", "Envoyer un e-mail", "Ne rien faire"], 0, "« Merci de nous rappeler »."]
        ]},
      { titre: "Annonce au supermarché", audio: "Chers clients, notre magasin fermera ses portes dans quinze minutes. Merci de vous diriger vers les caisses. Aujourd'hui, les fruits et légumes sont à moins vingt pour cent.",
        q: [
          ["Dans combien de temps le magasin ferme ?", ["15 minutes", "5 minutes", "50 minutes", "1 heure"], 0, "« dans quinze minutes »."],
          ["Que doivent faire les clients ?", ["Aller aux caisses", "Sortir tout de suite", "Revenir demain", "Appeler un vendeur"], 0, "« vous diriger vers les caisses »."],
          ["Quelle est la promotion ?", ["Les fruits et légumes à -20 %", "Le pain gratuit", "La viande à -50 %", "Il n'y a pas de promotion"], 0, "« moins vingt pour cent » sur les fruits et légumes."]
        ]}
    ]},
  { id: "a2-ecrit", type: "ecrit", epreuve: "ecrire", titre: "Écrire un message court",
    consigne: "Ton voisin t'a invitée à un repas samedi soir. Tu ne peux pas venir. Écris-lui un message : remercie-le, explique pourquoi tu ne peux pas venir et propose un autre jour.",
    mots: [40, 70],
    aide: ["Merci beaucoup pour…", "Malheureusement, je ne peux pas venir parce que…", "Est-ce que tu es libre… ?", "À bientôt !"],
    modele: "Bonjour Karim,\nMerci beaucoup pour ton invitation, c'est très gentil ! Malheureusement, je ne peux pas venir samedi soir parce que je travaille tard. Est-ce que tu es libre dimanche après-midi ? Je peux apporter un gâteau au chocolat. Dis-moi si ça te va.\nÀ bientôt,\nAmina",
    criteres: ["J'ai dit merci", "J'ai expliqué pourquoi (avec « parce que »)", "J'ai proposé un autre jour", "J'ai écrit entre 40 et 70 mots", "J'ai relu les accords et les majuscules"] },
  { id: "a2-oral", type: "oral", epreuve: "parler", titre: "Se présenter",
    consigne: "Présente-toi pendant 1 à 2 minutes, comme devant un examinateur.",
    questions: ["Comment vous appelez-vous ?", "D'où venez-vous ?", "Depuis quand habitez-vous en France ?", "Que faites-vous dans la vie ?", "Qu'aimez-vous faire le week-end ?"],
    aide: ["Je m'appelle…", "Je viens de… / Je suis né(e) à…", "J'habite à… depuis…", "Je travaille comme… / Je suis en formation de…", "Le week-end, j'aime…"],
    modele: "Je m'appelle Amina. Je viens de Madagascar et j'habite en France depuis 2023. Je vis avec mon mari et nos deux enfants. Je travaille dans un restaurant et, en même temps, je suis une formation pour devenir aide-soignante. Le week-end, j'aime cuisiner pour ma famille, surtout des gâteaux, et me promener au bord de la mer.",
    criteres: ["J'ai parlé au moins 1 minute", "J'ai dit d'où je viens et où j'habite", "J'ai parlé de mon travail ou de ma formation", "J'ai parlé de mes loisirs"] },
  { id: "a2-civique", type: "qcm", epreuve: "civique", titre: "Les symboles de la France",
    mots: [["la devise", "une phrase courte qui dit les valeurs d'un pays"], ["l'hymne", "le chant officiel d'un pays"]],
    regle: `<ul><li><b>La devise :</b> « Liberté, Égalité, Fraternité ».</li>
<li><b>Le drapeau :</b> bleu, blanc, rouge.</li>
<li><b>L'hymne national :</b> la Marseillaise.</li>
<li><b>Marianne :</b> la femme qui représente la République.</li>
<li><b>La fête nationale :</b> le 14 juillet.</li>
<li><b>La langue officielle :</b> le français.</li></ul>`,
    q: [
      ["Quelle est la devise de la République ?", ["Liberté, Égalité, Fraternité", "Travail, Famille, Patrie", "Unité, Paix, Progrès"], 0, "« Travail, Famille, Patrie » était la devise du régime de Vichy (1940-1944)."],
      ["Quelles sont les couleurs du drapeau ?", ["Bleu, blanc, rouge", "Vert, blanc, rouge", "Bleu, jaune, rouge"], 0, "Le drapeau tricolore est bleu, blanc, rouge."],
      ["Quel jour est la fête nationale ?", ["Le 14 juillet", "Le 11 novembre", "Le 1er mai"], 0, "Le 14 juillet rappelle la prise de la Bastille en 1789."],
      ["Comment s'appelle l'hymne national ?", ["La Marseillaise", "L'Internationale", "Le Chant des partisans"], 0, "La Marseillaise a été écrite en 1792."],
      ["Qui est Marianne ?", ["Le symbole de la République", "La première présidente", "Une reine de France"], 0, "Son buste est dans les mairies et son visage est sur les timbres."],
      ["Quelle est la langue de la République ?", ["Le français", "Le français et l'anglais", "Il n'y en a pas"], 0, "La Constitution dit : « La langue de la République est le français. »"],
      ["Le 14 juillet 1789, c'est…", ["la prise de la Bastille", "la fin de la Seconde Guerre mondiale", "l'élection du premier président"], 0, "C'est un moment clé de la Révolution française."],
      ["Où voit-on souvent le buste de Marianne ?", ["Dans les mairies", "Dans les églises", "Dans les supermarchés"], 0, "Chaque mairie a en général un buste de Marianne."],
      ["Le 11 novembre, on se souvient…", ["de la fin de la Première Guerre mondiale (1918)", "de la Révolution", "du vote des femmes"], 0, "L'armistice a été signé le 11 novembre 1918."],
      ["Le 8 mai, on se souvient…", ["de la victoire de 1945", "de la prise de la Bastille", "de la fête du Travail"], 0, "Le 8 mai 1945 marque la fin de la guerre en Europe."]
    ]}
  ]
},
{
  id: "b1", nom: "Niveau B1", sous: "Raconter, expliquer, se débrouiller",
  modules: [
  { id: "b1-imparfait", type: "qcm", epreuve: "grammaire", titre: "Passé composé ou imparfait ?",
    mots: [["l'imparfait", "un temps du passé pour décrire ou parler d'une habitude : je mangeais"]],
    regle: `<ul><li><b>Imparfait :</b> le décor, la description, l'habitude. « Quand j'étais petite, j'allais à la plage le dimanche. »</li>
<li><b>Passé composé :</b> une action précise, terminée. « Un jour, je suis tombée. »</li>
<li><b>Ensemble :</b> « Je dormais (décor) quand le téléphone a sonné (action). »</li>
<li><b>Formation de l'imparfait :</b> on part de « nous » au présent (nous finiss-ons) + -ais, -ais, -ait, -ions, -iez, -aient. Seul « être » est irrégulier : j'étais.</li></ul>`,
    q: [
      ["Quand j'étais enfant, je ___ beaucoup.", ["lisais", "ai lu", "lirai"], 0, "Habitude dans le passé : imparfait."],
      ["Il ___ quand je suis arrivée.", ["pleuvait", "a plu", "pleut"], 0, "Le décor (la pluie) est à l'imparfait."],
      ["Soudain, l'alarme ___.", ["a sonné", "sonnait", "sonne"], 0, "« Soudain » annonce une action précise : passé composé."],
      ["Avant, nous ___ à Tananarive.", ["habitions", "avons habité", "habitons"], 0, "« Avant » + situation longue : imparfait."],
      ["Hier, j'___ trois heures.", ["ai travaillé", "travaillais", "travaille"], 0, "Action finie, avec une durée précise : passé composé."],
      ["La maison ___ grande et lumineuse.", ["était", "a été", "est été"], 0, "Description : imparfait."],
      ["Je regardais la télé quand tu ___.", ["as appelé", "appelais", "appelles"], 0, "L'action qui coupe le décor : passé composé."],
      ["Tous les samedis, mon père ___ le marché.", ["faisait", "a fait", "fera"], 0, "« Tous les samedis » = habitude : imparfait."],
      ["En 2019, elle ___ son diplôme.", ["a obtenu", "obtenait", "obtient"], 0, "Un événement daté et fini : passé composé."],
      ["Nous ___ fatigués, alors nous sommes rentrés.", ["étions", "avons été", "sommes"], 0, "L'état (la fatigue) est à l'imparfait."]
    ]},
  { id: "b1-relatifs", type: "qcm", epreuve: "grammaire", titre: "Les pronoms qui, que, où, dont",
    mots: [["un pronom relatif", "un petit mot qui relie deux phrases sans répéter un nom"]],
    regle: `<ul><li><b>Qui</b> remplace le sujet : « La femme <b>qui</b> parle est ma voisine. »</li>
<li><b>Que</b> remplace le complément direct : « Le livre <b>que</b> je lis est intéressant. »</li>
<li><b>Où</b> pour un lieu ou un moment : « La ville <b>où</b> j'habite. Le jour <b>où</b> je suis arrivée. »</li>
<li><b>Dont</b> remplace « de + nom » : « Le collègue <b>dont</b> je t'ai parlé » (parler de quelqu'un).</li></ul>`,
    q: [
      ["C'est le collègue ___ m'aide souvent.", ["qui", "que", "dont"], 0, "Il est sujet du verbe « aide » : qui."],
      ["Le gâteau ___ tu as fait est délicieux.", ["que", "qui", "où"], 0, "Tu as fait le gâteau : complément direct, donc « que »."],
      ["La maison ___ j'ai grandi est loin.", ["où", "que", "dont"], 0, "Un lieu : où."],
      ["C'est le document ___ j'ai besoin.", ["dont", "que", "qui"], 0, "Avoir besoin DE quelque chose : dont."],
      ["Le jour ___ j'ai eu mon permis, j'étais heureuse.", ["où", "que", "dont"], 0, "Un moment : où."],
      ["La personne ___ tu cherches est partie.", ["que", "qui", "dont"], 0, "Tu cherches la personne : complément direct, que."],
      ["Voici l'entreprise ___ je suis responsable.", ["dont", "que", "où"], 0, "Être responsable DE : dont."],
      ["Le bus ___ va à Dzaoudzi part à 7 h.", ["qui", "que", "où"], 0, "Le bus est sujet de « va » : qui."],
      ["C'est un film ___ tout le monde parle.", ["dont", "que", "qui"], 0, "Parler DE : dont."],
      ["La formation ___ je suis est très utile.", ["que", "qui", "dont"], 0, "Suivre une formation : je suis la formation, complément direct, que."]
    ]},
  { id: "b1-futur", type: "qcm", epreuve: "grammaire", titre: "Le futur et les projets",
    mots: [["le futur simple", "le temps des projets et des prévisions : je travaillerai"], ["le futur proche", "aller + infinitif : je vais travailler"]],
    regle: `<ul><li><b>Futur proche :</b> aller + infinitif, pour bientôt ou sûr : « Je vais appeler la CAF. »</li>
<li><b>Futur simple :</b> infinitif + -ai, -as, -a, -ons, -ez, -ont : je parlerai, nous finirons.</li>
<li><b>Irréguliers :</b> être → je serai · avoir → j'aurai · aller → j'irai · faire → je ferai · pouvoir → je pourrai · venir → je viendrai · voir → je verrai · devoir → je devrai</li>
<li><b>Si + présent → futur :</b> « Si je réussis, je fêterai ça. »</li></ul>`,
    q: [
      ["L'année prochaine, je ___ mon diplôme.", ["passerai", "passais", "passe"], 0, "Projet : futur simple."],
      ["Demain, nous ___ à la plage.", ["irons", "allerons", "allions"], 0, "Aller → nous irons (irrégulier)."],
      ["Si tu viens, je ___ un gâteau.", ["ferai", "ferais", "faisais"], 0, "Si + présent → futur simple."],
      ["Tu ___ le temps ce soir ?", ["auras", "avras", "avais"], 0, "Avoir → tu auras."],
      ["Ils ___ en retard, c'est sûr.", ["seront", "sont été", "étaient"], 0, "Être → ils seront."],
      ["Attention, tu ___ tomber !", ["vas", "iras", "allais"], 0, "Danger immédiat : futur proche (tu vas tomber)."],
      ["Quand je ___ grande, je serai médecin.", ["serai", "suis", "serais"], 0, "Après « quand », on met le futur si l'action est future."],
      ["Vous ___ venir à la réunion ?", ["pourrez", "pouvrez", "pouvez été"], 0, "Pouvoir → vous pourrez."],
      ["Nous ___ le résultat la semaine prochaine.", ["verrons", "voirons", "voyions"], 0, "Voir → nous verrons."],
      ["Elle ___ tôt pour prendre l'avion.", ["devra partir", "doit partait", "devrait parti"], 0, "Devoir → elle devra, suivi de l'infinitif."]
    ]},
  { id: "b1-lecture", type: "lecture", epreuve: "lire", titre: "Lire un courrier et une annonce",
    mots: [["une pièce justificative", "un document qui prouve quelque chose"], ["au plus tard", "c'est la dernière date possible"]],
    docs: [
      { titre: "Courrier de la mairie", texte: `<p><b>Inscriptions scolaires 2027-2028</b><br>Madame, Monsieur,<br>Les inscriptions pour l'entrée à l'école maternelle et au CP auront lieu du 1er au 31 mars, au service Éducation de la mairie, du lundi au vendredi de 8 h à 15 h.<br>Merci d'apporter : le livret de famille ou l'acte de naissance de l'enfant, un justificatif de domicile de moins de trois mois et le carnet de santé (vaccins à jour).<br>Aucun dossier incomplet ne sera accepté. Les familles qui ne peuvent pas se déplacer peuvent envoyer les pièces par e-mail au plus tard le 31 mars.</p>`,
        q: [
          ["Ce courrier concerne…", ["l'inscription des enfants à l'école", "les vacances scolaires", "la cantine", "les vaccins gratuits"], 0, "Titre : « Inscriptions scolaires »."],
          ["Quel justificatif de domicile est accepté ?", ["Un justificatif de moins de trois mois", "N'importe quel document", "Un justificatif de moins d'un an", "Aucun"], 0, "« de moins de trois mois »."],
          ["Que se passe-t-il si le dossier est incomplet ?", ["Il est refusé", "On peut compléter en septembre", "On paie une amende", "La mairie appelle la famille"], 0, "« Aucun dossier incomplet ne sera accepté. »"],
          ["Une famille qui ne peut pas venir…", ["peut envoyer les documents par e-mail avant le 31 mars", "doit attendre l'année prochaine", "doit téléphoner", "peut venir le samedi"], 0, "Dernière phrase du courrier."]
        ]},
      { titre: "Offre d'emploi", texte: `<p><b>Boulangerie Le Fournil recrute un(e) vendeur(se)</b><br>CDI à temps partiel (24 h par semaine), du mardi au samedi. Expérience en vente appréciée mais non obligatoire : formation assurée. Qualités demandées : sourire, ponctualité, sens du contact. Envoyez CV et lettre de motivation à recrutement@lefournil.fr avant le 15 décembre.</p>`,
        q: [
          ["Le poste est…", ["un CDI à temps partiel", "un CDD à temps plein", "un stage", "un job d'été"], 0, "« CDI à temps partiel (24 h par semaine) »."],
          ["Faut-il de l'expérience ?", ["Non, mais c'est un plus", "Oui, obligatoirement", "Oui, 5 ans", "Le texte ne le dit pas"], 0, "« appréciée mais non obligatoire »."],
          ["Comment postuler ?", ["Envoyer CV et lettre par e-mail", "Venir sur place", "Téléphoner", "Remplir un formulaire en ligne"], 0, "Envoi à l'adresse e-mail indiquée."]
        ]}
    ]},
  { id: "b1-ecoute", type: "ecoute", epreuve: "ecouter", titre: "Comprendre une conversation",
    mots: [["un devis", "un document qui donne le prix avant un travail"], ["en panne", "qui ne marche plus"]],
    docs: [
      { titre: "Au téléphone avec le propriétaire", audio: "— Allô, monsieur Hassani ? C'est votre locataire, au deuxième étage. Le chauffe-eau est en panne depuis hier soir, nous n'avons plus d'eau chaude. — Ah, je suis désolé. Je vais appeler le plombier aujourd'hui. Il pourra sans doute passer demain matin. — Demain matin, je travaille, mais ma voisine peut lui ouvrir. — Très bien. Le plombier fera un devis, et c'est moi qui paierai la réparation.",
        q: [
          ["Quel est le problème ?", ["Le chauffe-eau ne marche plus", "Il y a une fuite au plafond", "L'électricité est coupée", "Le loyer a augmenté"], 0, "« Le chauffe-eau est en panne »."],
          ["Quand le plombier peut-il venir ?", ["Probablement demain matin", "Aujourd'hui", "La semaine prochaine", "Ce soir"], 0, "« Il pourra sans doute passer demain matin »."],
          ["Qui va ouvrir la porte au plombier ?", ["La voisine", "La locataire", "Le propriétaire", "Personne"], 0, "La locataire travaille ; sa voisine ouvrira."],
          ["Qui paie la réparation ?", ["Le propriétaire", "La locataire", "La voisine", "On partage"], 0, "« c'est moi qui paierai », dit le propriétaire."]
        ]},
      { titre: "À la radio : la météo", audio: "Voici la météo pour ce week-end à Mayotte. Samedi, le soleil sera présent toute la journée, avec trente et un degrés l'après-midi. Dimanche, attention : de fortes pluies sont attendues à partir de midi, avec du vent en fin de journée. Si vous prévoyez une sortie en mer, mieux vaut la faire samedi.",
        q: [
          ["Quel temps fera-t-il samedi ?", ["Ensoleillé et chaud", "Pluvieux", "Venteux", "Nuageux et frais"], 0, "Soleil toute la journée, 31 degrés."],
          ["Quand la pluie arrive-t-elle ?", ["Dimanche à partir de midi", "Samedi matin", "Dimanche soir seulement", "Lundi"], 0, "« dimanche … à partir de midi »."],
          ["Quel conseil donne la radio ?", ["Faire la sortie en mer samedi", "Rester chez soi samedi", "Sortir en mer dimanche", "Annuler toutes les sorties"], 0, "« mieux vaut la faire samedi »."]
        ]}
    ]},
  { id: "b1-ecrit", type: "ecrit", epreuve: "ecrire", titre: "Écrire un e-mail formel",
    consigne: "Tu as reçu une facture d'eau de 180 €, alors que d'habitude tu paies environ 40 €. Écris un e-mail au service client : présente-toi, explique le problème et demande une vérification.",
    mots: [80, 120],
    aide: ["Madame, Monsieur,", "Je suis cliente sous le numéro…", "J'ai bien reçu… cependant…", "Je vous serais reconnaissante de bien vouloir…", "Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées."],
    modele: "Madame, Monsieur,\nJe suis cliente chez vous sous le numéro 123456. J'ai bien reçu ma facture du mois d'octobre, d'un montant de 180 €. Cependant, je paie habituellement environ 40 € par mois et notre consommation n'a pas changé. Il est donc possible qu'il y ait une erreur ou une fuite.\nJe vous serais reconnaissante de bien vouloir vérifier mon relevé de compteur et de me tenir informée. En attendant, je ne règlerai que le montant habituel.\nJe vous prie d'agréer, Madame, Monsieur, mes salutations distinguées.\nAmina Saïd",
    criteres: ["J'ai utilisé une formule de politesse au début et à la fin", "J'ai donné mon numéro ou mon nom de client", "J'ai expliqué le problème avec des chiffres", "J'ai fait une demande claire", "J'ai utilisé « vous » partout"] },
  { id: "b1-oral", type: "oral", epreuve: "parler", titre: "Obtenir une information",
    consigne: "Tu veux inscrire ta fille à un club de natation. Tu appelles le club. Pose au moins 6 questions pour avoir toutes les informations (comme à l'épreuve d'interaction du test).",
    questions: ["Prix ? Jours et horaires ? Âge minimum ?", "Documents à fournir ? Certificat médical ?", "Matériel nécessaire ? Possibilité d'essayer ?"],
    aide: ["Bonjour, je vous appelle pour…", "Est-ce que vous pourriez me dire… ?", "À partir de quel âge… ?", "Combien coûte… ?", "Est-il possible de… ?", "Merci beaucoup pour ces informations."],
    modele: "Bonjour, je vous appelle pour avoir des renseignements sur les cours de natation pour enfants. Ma fille a huit ans. À partir de quel âge est-ce qu'elle peut s'inscrire ? Quels sont les jours et les horaires des cours ? Combien coûte l'inscription pour l'année ? Est-ce qu'il faut un certificat médical ? Qu'est-ce qu'elle doit apporter comme matériel ? Est-il possible de faire un cours d'essai avant de s'inscrire ? Merci beaucoup pour ces informations, bonne journée.",
    criteres: ["J'ai salué et expliqué pourquoi j'appelle", "J'ai posé au moins 6 questions différentes", "J'ai utilisé « vous » et des formes polies (pourriez-vous…)", "J'ai remercié à la fin"] },
  { id: "b1-civique", type: "qcm", epreuve: "civique", titre: "Les valeurs de la République",
    mots: [["la laïcité", "l'État ne soutient aucune religion et chacun est libre de croire ou non"], ["la discrimination", "traiter une personne moins bien à cause de son origine, son sexe, sa religion…"]],
    regle: `<ul><li><b>Liberté :</b> liberté d'expression, de religion, de circuler, dans le respect de la loi.</li>
<li><b>Égalité :</b> tous égaux devant la loi. Les femmes et les hommes ont les mêmes droits. Les discriminations sont punies.</li>
<li><b>Fraternité :</b> la solidarité (sécurité sociale, aides, entraide).</li>
<li><b>Laïcité :</b> loi de 1905 de séparation des Églises et de l'État. L'école publique est laïque.</li></ul>`,
    q: [
      ["Que veut dire « laïcité » ?", ["L'État est neutre face aux religions", "Une seule religion est autorisée", "Les religions sont interdites"], 0, "Chacun peut croire ou ne pas croire ; l'État ne favorise aucune religion."],
      ["Quelle loi sépare les Églises et l'État ?", ["La loi de 1905", "La loi de 1958", "La loi de 1789"], 0, "C'est la base de la laïcité."],
      ["Depuis quelle année les femmes votent-elles en France ?", ["1944", "1789", "1981"], 0, "Droit de vote accordé en 1944, premier vote en 1945."],
      ["Un employeur refuse un candidat à cause de son origine. C'est…", ["une discrimination punie par la loi", "autorisé", "une simple opinion"], 0, "La discrimination à l'embauche est un délit."],
      ["L'égalité femmes-hommes veut dire…", ["mêmes droits pour tous", "les femmes ont moins de droits", "seuls les hommes peuvent voter"], 0, "C'est un principe de la République."],
      ["Le mariage forcé en France est…", ["interdit", "autorisé avec l'accord des parents", "autorisé à 16 ans"], 0, "Le consentement libre des deux époux est obligatoire."],
      ["L'école publique est…", ["gratuite et laïque", "payante et religieuse", "réservée aux Français"], 0, "Gratuite, laïque et obligatoire de 3 à 16 ans."],
      ["La liberté d'expression permet…", ["de donner son opinion dans le respect de la loi", "d'insulter ou menacer", "de tout dire sans limite"], 0, "La diffamation, l'injure et l'appel à la haine restent interdits."],
      ["La fraternité se voit par exemple dans…", ["la sécurité sociale et la solidarité", "le service militaire", "les impôts locaux seulement"], 0, "La solidarité entre citoyens est au cœur de la fraternité."],
      ["Frapper son conjoint ou ses enfants est…", ["interdit et puni", "toléré dans la famille", "une affaire privée"], 0, "Les violences conjugales et sur les enfants sont des délits."]
    ]}
  ]
},
{
  id: "b2", nom: "Niveau B2", sous: "Argumenter, nuancer, convaincre",
  modules: [
  { id: "b2-connecteurs", type: "qcm", epreuve: "grammaire", titre: "Les connecteurs pour argumenter",
    mots: [["argumenter", "donner des raisons pour défendre son avis"], ["concéder", "reconnaître un point de l'autre avant de répondre"]],
    regle: `<ul><li><b>Opposer :</b> mais, cependant, pourtant, en revanche, alors que, tandis que</li>
<li><b>Concéder :</b> bien que (+ subjonctif), même si (+ indicatif), malgré (+ nom)</li>
<li><b>Cause :</b> parce que, car, puisque, grâce à (positif), à cause de (négatif)</li>
<li><b>Conséquence :</b> donc, c'est pourquoi, par conséquent, si bien que</li>
<li><b>Organiser :</b> d'abord, ensuite, de plus, en outre, enfin, pour conclure</li></ul>
<p class="ex">Bien que le travail soit difficile, j'aime mon métier. Malgré la fatigue, elle a fini son dossier.</p>`,
    q: [
      ["___ il fasse froid, je sors sans manteau.", ["Bien qu'", "Même s'", "Malgré"], 0, "« Bien que » + subjonctif (il fasse). « Même si » + indicatif, « malgré » + nom."],
      ["Je suis en retard ___ des embouteillages.", ["à cause", "grâce", "parce que"], 0, "Devant un nom négatif : à cause de."],
      ["Il a beaucoup travaillé, ___ il a réussi.", ["donc", "pourtant", "bien que"], 0, "Conséquence : donc."],
      ["Ma sœur aime la ville, ___ moi je préfère la campagne.", ["alors que", "parce que", "donc"], 0, "Opposition de deux faits : alors que."],
      ["___ la pluie, le marché a eu lieu.", ["Malgré", "Bien que", "Même si"], 0, "Malgré + nom."],
      ["Il est très compétent. ___, il manque d'expérience.", ["En revanche", "Par conséquent", "De plus"], 0, "Un point positif opposé à un point négatif."],
      ["___ tu es là, aide-moi.", ["Puisque", "Malgré", "Pourtant"], 0, "Puisque : une cause connue de tous."],
      ["Les prix augmentent ; ___, les familles achètent moins.", ["par conséquent", "cependant", "alors que"], 0, "Conséquence."],
      ["Même s'il ___ malade, il viendra.", ["est", "soit", "sera"], 0, "Après « même si » : indicatif."],
      ["J'ai réussi ___ mon professeur.", ["grâce à", "à cause de", "car"], 0, "Cause positive + nom : grâce à."]
    ]},
  { id: "b2-subjonctif", type: "qcm", epreuve: "grammaire", titre: "Le subjonctif",
    mots: [["le subjonctif", "une forme du verbe après « que » pour une volonté, un sentiment, un doute"]],
    regle: `<ul><li><b>Obligation :</b> il faut que, il est nécessaire que</li>
<li><b>Volonté :</b> je veux que, je souhaite que</li>
<li><b>Sentiment :</b> je suis contente que, j'ai peur que</li>
<li><b>Doute :</b> je doute que, je ne pense pas que</li>
<li><b>Après :</b> bien que, pour que, avant que, à condition que</li></ul>
<p><b>Formation :</b> « ils » au présent (ils finiss-ent) → que je finisse. <b>Irréguliers :</b> que je sois, que j'aie, que je fasse, que j'aille, que je puisse, que je sache, que je veuille.</p>
<p><b>Attention :</b> « je pense que », « espérer que », « après que » → indicatif.</p>`,
    q: [
      ["Il faut que nous ___ à l'heure.", ["soyons", "sommes", "serons"], 0, "Il faut que + subjonctif : soyons."],
      ["Je veux que tu ___ tes devoirs.", ["fasses", "fais", "feras"], 0, "Faire → que tu fasses."],
      ["Je pense qu'il ___ raison.", ["a", "ait", "aura eu"], 0, "« Je pense que » positif → indicatif."],
      ["Je ne pense pas qu'il ___ raison.", ["ait", "a", "aurait"], 0, "Négatif = doute → subjonctif."],
      ["Je suis contente que vous ___ venus.", ["soyez", "êtes", "serez"], 0, "Sentiment + subjonctif."],
      ["Il parle lentement pour que tout le monde ___.", ["comprenne", "comprend", "comprendra"], 0, "Pour que + subjonctif."],
      ["Il faut que j'___ à la préfecture.", ["aille", "vais", "irai"], 0, "Aller → que j'aille."],
      ["J'espère que tu ___ bien.", ["vas", "ailles", "aille"], 0, "Piège : espérer que + indicatif."],
      ["Avant que les enfants ___, je cuisine.", ["rentrent", "rentreront", "sont rentrés"], 0, "Avant que + subjonctif."],
      ["Il est possible qu'elle ___ venir.", ["puisse", "peut", "pourra"], 0, "Possibilité = doute → subjonctif."]
    ]},
  { id: "b2-hypothese", type: "qcm", epreuve: "grammaire", titre: "Le conditionnel et les hypothèses",
    mots: [["une hypothèse", "une situation imaginée : « si… »"], ["le conditionnel", "la forme du verbe pour l'imaginaire ou la politesse : je voudrais"]],
    regle: `<ul><li><b>Si + présent → futur :</b> possible. « Si j'ai le temps, je viendrai. »</li>
<li><b>Si + imparfait → conditionnel présent :</b> imaginaire. « Si j'avais une voiture, je viendrais. »</li>
<li><b>Si + plus-que-parfait → conditionnel passé :</b> regret. « Si j'avais su, je serais venue. »</li>
<li><b>Jamais de conditionnel après « si ».</b></li>
<li><b>Politesse :</b> je voudrais, pourriez-vous, j'aimerais.</li></ul>`,
    q: [
      ["Si j'avais plus de temps, je ___ le piano.", ["apprendrais", "apprendrai", "apprenais"], 0, "Si + imparfait → conditionnel."],
      ["Si tu étudies, tu ___.", ["réussiras", "réussirais", "réussissais"], 0, "Si + présent → futur."],
      ["Si nous étions partis plus tôt, nous ___ le train.", ["n'aurions pas raté", "ne raterions pas", "n'avons pas raté"], 0, "Si + plus-que-parfait → conditionnel passé."],
      ["S'il ___ beau, on irait à la plage.", ["faisait", "ferait", "fait"], 0, "Jamais de conditionnel après « si » : imparfait."],
      ["___-vous m'aider, s'il vous plaît ?", ["Pourriez", "Pouvriez", "Pourrez"], 0, "Politesse : conditionnel de pouvoir."],
      ["À ta place, je ___ au directeur.", ["parlerais", "parlerai", "parlais"], 0, "Conseil : « à ta place » + conditionnel."],
      ["Si j'___ su, je ne serais pas venue.", ["avais", "aurais", "ai"], 0, "Regret : si + plus-que-parfait (j'avais su)."],
      ["J'___ un rendez-vous, s'il vous plaît.", ["aimerais", "aimerai", "aimais"], 0, "Demande polie : j'aimerais."],
      ["Si elle avait le permis, elle ___ en voiture.", ["irait", "ira", "allait"], 0, "Si + imparfait → conditionnel : irait."],
      ["Tu ___ dû me prévenir !", ["aurais", "aurai", "avais"], 0, "Reproche : conditionnel passé de devoir."]
    ]},
  { id: "b2-opinion", type: "qcm", epreuve: "vocabulaire", titre: "Donner son avis avec nuance",
    mots: [["nuancer", "dire son avis sans être trop catégorique"], ["catégorique", "très sûr, sans aucun doute"]],
    regle: `<ul><li><b>Avis sûr (+ indicatif) :</b> je suis convaincue que, il est évident que, je crois que</li>
<li><b>Avis prudent :</b> il me semble que (+ indicatif), j'ai l'impression que</li>
<li><b>Doute (+ subjonctif) :</b> je doute que, je ne crois pas que, il n'est pas certain que</li>
<li><b>Nuancer :</b> dans une certaine mesure, d'un côté… de l'autre…, certes… mais…</li>
<li><b>Accord / désaccord :</b> je partage cet avis, je ne suis pas tout à fait d'accord</li></ul>`,
    q: [
      ["Il est évident que les écrans ___ un impact sur le sommeil.", ["ont", "aient", "auraient eu"], 0, "Certitude + indicatif."],
      ["Je doute que cette loi ___ efficace.", ["soit", "est", "sera"], 0, "Doute + subjonctif."],
      ["___, le télétravail est pratique, mais il isole.", ["Certes", "Donc", "Car"], 0, "« Certes… mais… » pour concéder puis nuancer."],
      ["Il me semble que tu ___ raison.", ["as", "aies", "avoir"], 0, "« Il me semble que » + indicatif."],
      ["Quelle phrase est la plus nuancée ?", ["Dans une certaine mesure, c'est utile.", "C'est complètement inutile.", "C'est absolument parfait."], 0, "« Dans une certaine mesure » limite l'affirmation."],
      ["Je ne crois pas que ce ___ la bonne solution.", ["soit", "est", "sera"], 0, "Croire à la forme négative + subjonctif."],
      ["Pour dire poliment son désaccord :", ["Je ne suis pas tout à fait d'accord.", "Vous avez tort.", "C'est n'importe quoi."], 0, "Formule polie et nuancée."],
      ["D'un côté, la ville offre des emplois ; ___, la vie y est chère.", ["de l'autre", "donc", "car"], 0, "« D'un côté… de l'autre… »."],
      ["Je suis convaincue que l'éducation ___ essentielle.", ["est", "soit", "être"], 0, "Conviction + indicatif."],
      ["« Je partage cet avis » veut dire…", ["je suis d'accord", "je ne suis pas d'accord", "je n'ai pas d'avis"], 0, "Partager un avis = avoir le même."]
    ]},
  { id: "b2-lecture", type: "lecture", epreuve: "lire", titre: "Lire un article d'opinion",
    mots: [["un enjeu", "ce qu'on peut gagner ou perdre ; ce qui est important"], ["nuire à", "faire du mal à"]],
    docs: [
      { titre: "Faut-il interdire les écrans avant 3 ans ?", texte: `<p>De plus en plus de pédiatres alertent : les écrans nuiraient au développement du langage chez les tout-petits. Selon eux, un enfant qui passe une heure par jour devant une tablette parle moins avec ses parents, alors que c'est par l'échange que le langage se construit.</p>
<p>Certains parents jugent pourtant ces recommandations irréalistes. « Quand on rentre du travail à 19 h et qu'il faut préparer le repas, le dessin animé est parfois la seule solution », confie Aïcha, mère de deux enfants. Les spécialistes ne demandent d'ailleurs pas la perfection : regarder ensemble et commenter ce qu'on voit limiterait une partie des effets négatifs.</p>
<p>L'enjeu dépasse donc la simple interdiction : il s'agit surtout d'accompagner les familles plutôt que de les culpabiliser.</p>`,
        q: [
          ["Selon les pédiatres, les écrans…", ["peuvent freiner le langage des petits", "améliorent le vocabulaire", "n'ont aucun effet", "sont utiles avant 3 ans"], 0, "« nuiraient au développement du langage »."],
          ["Pourquoi l'échange est-il important ?", ["C'est par lui que le langage se construit", "Il fatigue l'enfant", "Il remplace l'école", "Il évite les dessins animés"], 0, "Dernière phrase du premier paragraphe."],
          ["Que pense Aïcha ?", ["Les recommandations sont difficiles à suivre au quotidien", "Il faut interdire les écrans", "Les écrans sont dangereux", "Elle n'a pas d'avis"], 0, "Elle explique ses contraintes après le travail."],
          ["Que proposent les spécialistes ?", ["Regarder ensemble et commenter", "Supprimer la télévision", "Punir les parents", "Limiter à 3 heures par jour"], 0, "Cela « limiterait une partie des effets négatifs »."],
          ["Quelle est la conclusion de l'auteur ?", ["Il faut accompagner les familles sans les culpabiliser", "Il faut une loi stricte", "Les pédiatres exagèrent", "Les écrans sont sans danger"], 0, "« accompagner les familles plutôt que de les culpabiliser »."]
        ]},
      { titre: "Le bénévolat en hausse", texte: `<p>Après plusieurs années de baisse, le nombre de bénévoles repart à la hausse, en particulier chez les moins de 35 ans. Cependant, leur engagement change : ils préfèrent des missions courtes et concrètes à un engagement régulier dans une seule association. Les responsables associatifs doivent donc s'adapter, en proposant par exemple des actions ponctuelles d'une journée.</p>`,
        q: [
          ["Qu'est-ce qui augmente ?", ["Le nombre de bénévoles", "Le nombre d'associations", "Les dons d'argent", "Les salaires"], 0, "« le nombre de bénévoles repart à la hausse »."],
          ["Que préfèrent les jeunes bénévoles ?", ["Des missions courtes et concrètes", "Un engagement chaque semaine", "Travailler seuls", "Être payés"], 0, "C'est le changement décrit."],
          ["« Ponctuel » veut dire ici…", ["qui a lieu une seule fois", "toujours à l'heure", "très long", "obligatoire"], 0, "Une action ponctuelle = une action limitée dans le temps."]
        ]}
    ]},
  { id: "b2-ecoute", type: "ecoute", epreuve: "ecouter", titre: "Comprendre une interview et un débat",
    mots: [["les transports en commun", "bus, train, bateau, pour tout le monde"], ["un embouteillage", "beaucoup de voitures bloquées sur la route"]],
    docs: [
      { titre: "Interview à la radio", audio: "Aujourd'hui, nous recevons Fatima, qui a créé une épicerie solidaire il y a deux ans. Fatima, pourquoi ce projet ? — Parce que je voyais beaucoup de familles qui travaillaient mais qui n'arrivaient plus à finir le mois. Dans notre épicerie, les produits coûtent entre dix et trente pour cent du prix normal. En échange, nous proposons des ateliers : cuisine, budget, aide aux démarches. Ce n'est pas seulement de l'aide, c'est aussi un lieu où l'on se rencontre. Notre difficulté aujourd'hui, c'est de trouver des bénévoles le samedi.",
        q: [
          ["Pourquoi Fatima a-t-elle créé l'épicerie ?", ["Des familles qui travaillent manquaient d'argent", "Elle voulait gagner de l'argent", "Il n'y avait pas de supermarché", "Pour vendre des produits de luxe"], 0, "Des familles « n'arrivaient plus à finir le mois »."],
          ["Combien coûtent les produits ?", ["Entre 10 et 30 % du prix normal", "La moitié du prix", "Ils sont gratuits", "Le même prix qu'ailleurs"], 0, "C'est le chiffre donné."],
          ["Que propose aussi l'épicerie ?", ["Des ateliers", "Des cours de langue étrangère", "Des logements", "Des emplois"], 0, "Cuisine, budget, aide aux démarches."],
          ["Quelle est la difficulté actuelle ?", ["Trouver des bénévoles le samedi", "Payer le loyer", "Trouver des clients", "Avoir des produits frais"], 0, "Dernière phrase."]
        ]},
      { titre: "Débat : faut-il limiter les voitures en ville ?", audio: "— Pour moi, il faut réduire la place de la voiture. Les embouteillages font perdre des heures chaque jour et la pollution touche d'abord les enfants. — Je comprends, mais beaucoup de gens n'ont pas le choix. Sans bus fréquents, comment aller travailler à six heures du matin ? — Justement, il faut d'abord investir dans les transports en commun, puis limiter les voitures. — Là, je suis d'accord : pas d'interdiction sans solution.",
        q: [
          ["Quels problèmes cite la première personne ?", ["Les embouteillages et la pollution", "Le prix de l'essence", "Les accidents", "Le bruit seulement"], 0, "Elle parle de temps perdu et de pollution."],
          ["Quelle est l'objection de la deuxième personne ?", ["Beaucoup de gens n'ont pas d'autre solution", "Les voitures ne polluent pas", "Les bus sont trop chers", "Elle aime conduire"], 0, "« beaucoup de gens n'ont pas le choix »."],
          ["Sur quoi tombent-ils d'accord ?", ["D'abord des transports, ensuite des limites", "Interdire les voitures tout de suite", "Ne rien changer", "Supprimer les bus"], 0, "« pas d'interdiction sans solution »."]
        ]}
    ]},
  { id: "b2-ecrit-recit", type: "ecrit", epreuve: "ecrire", titre: "Raconter une expérience et donner son avis",
    consigne: "Sur un forum, on demande : « Quelle expérience vous a le plus aidé(e) à vous intégrer ? » Raconte une expérience personnelle et explique ce qu'elle t'a apporté.",
    mots: [120, 150],
    aide: ["Il y a … ans, quand je suis arrivée…", "Au début, … ; puis …", "Grâce à cette expérience, j'ai pu…", "Ce que je retiens, c'est que…"],
    modele: "Quand je suis arrivée en France, je ne connaissais presque personne et je n'osais pas parler français en public. Un jour, une voisine m'a proposé de l'accompagner à l'association de parents d'élèves de l'école. Au début, j'écoutais sans rien dire. Puis, peu à peu, j'ai commencé à aider pour la fête de fin d'année : je préparais des gâteaux et je tenais le stand.\nGrâce à cette expérience, j'ai pratiqué le français tous les jours, j'ai rencontré d'autres familles et j'ai compris comment fonctionne l'école de mes enfants. Surtout, j'ai pris confiance en moi. Ce que je retiens, c'est qu'on s'intègre d'abord en participant, même avec un français imparfait.",
    criteres: ["J'ai raconté au passé (imparfait + passé composé)", "J'ai organisé mon texte (au début, puis, grâce à…)", "J'ai expliqué ce que l'expérience m'a apporté", "J'ai écrit entre 120 et 150 mots"] },
  { id: "b2-ecrit-arg", type: "ecrit", epreuve: "ecrire", titre: "Argumenter : pour ou contre",
    consigne: "Document : « Certaines villes veulent interdire les téléphones portables au collège toute la journée. » Donne ton avis : présente les deux points de vue, puis défends ta position avec des arguments et des exemples.",
    mots: [120, 180],
    aide: ["Faut-il… ? La question divise.", "D'un côté, … En effet, …", "De l'autre, … Pourtant, …", "Pour ma part, je pense que…", "En conclusion, …"],
    modele: "Faut-il interdire les téléphones portables au collège toute la journée ? La question divise parents et enseignants.\nD'un côté, cette interdiction protège la concentration des élèves. En effet, un adolescent qui reçoit des notifications pendant les cours suit moins bien. De plus, elle limite le harcèlement en ligne pendant les récréations.\nDe l'autre, beaucoup de parents veulent pouvoir joindre leur enfant, surtout quand il rentre seul. Le téléphone peut aussi être un outil pour apprendre, à condition qu'il soit bien encadré.\nPour ma part, je pense que l'interdiction est utile, mais elle doit rester raisonnable : le téléphone peut être rangé pendant les cours et utilisé en cas d'urgence. En conclusion, plutôt qu'une interdiction totale, il faudrait apprendre aux élèves à s'en servir intelligemment.",
    criteres: ["J'ai présenté le sujet en une phrase", "J'ai donné des arguments pour et contre", "J'ai utilisé au moins 4 connecteurs (en effet, de plus, cependant…)", "J'ai donné mon avis clairement", "J'ai écrit une conclusion"] },
  { id: "b2-oral", type: "oral", epreuve: "parler", titre: "Défendre son point de vue",
    consigne: "Sujet : « Le télétravail devrait-il devenir la norme ? » Prépare 1 minute, puis parle 3 minutes : donne ton avis, deux arguments, un exemple, et réponds à une objection.",
    questions: ["Qu'est-ce que le télétravail change pour les familles ?", "Et pour les entreprises ?", "Est-ce possible pour tous les métiers ?"],
    aide: ["À mon avis…", "Je m'explique : …", "Prenons un exemple : …", "Certains diront que… Pourtant…", "Pour conclure, …"],
    modele: "À mon avis, le télétravail ne devrait pas devenir la norme, mais il devrait être possible pour ceux qui le souhaitent. Je m'explique : d'abord, il fait gagner beaucoup de temps de transport, ce qui est précieux pour les parents. Ensuite, on se concentre souvent mieux chez soi pour les tâches calmes. Prenons un exemple : dans un bureau, saisir des factures peut se faire à distance. Certains diront que le télétravail isole les salariés. C'est vrai, c'est pourquoi je pense qu'un ou deux jours par semaine sont un bon équilibre. De plus, beaucoup de métiers, comme infirmière ou vendeuse, ne peuvent pas se faire à distance. Pour conclure, le télétravail est un bon outil, à condition qu'il reste un choix.",
    criteres: ["J'ai donné mon avis dès le début", "J'ai donné deux arguments et un exemple", "J'ai répondu à une objection (certains diront que…)", "J'ai conclu", "J'ai parlé environ 3 minutes"] },
  { id: "b2-civique", type: "qcm", epreuve: "civique", titre: "Les institutions et l'histoire",
    mots: [["un mandat", "la durée pendant laquelle un élu exerce sa fonction"], ["une collectivité", "une partie du territoire avec ses élus : commune, département, région"]],
    regle: `<ul><li><b>La Constitution de 1958</b> fonde la Ve République.</li>
<li><b>Le Président</b> est élu au suffrage universel direct pour 5 ans. Il nomme le Premier ministre.</li>
<li><b>Le Parlement</b> (Assemblée nationale + Sénat) vote les lois.</li>
<li><b>La justice</b> est indépendante.</li>
<li><b>Les collectivités :</b> communes (maire), départements, régions. Mayotte est un département depuis 2011.</li>
<li><b>Dates :</b> 1789 Révolution et Déclaration des droits de l'homme · 1848 abolition définitive de l'esclavage · 1944 vote des femmes · 1958 Ve République.</li></ul>`,
    q: [
      ["Qui vote les lois ?", ["Le Parlement", "Le Président", "Le préfet"], 0, "Assemblée nationale + Sénat."],
      ["Pour combien de temps le Président est-il élu ?", ["5 ans", "7 ans", "4 ans"], 0, "Le quinquennat depuis 2002."],
      ["Qui nomme le Premier ministre ?", ["Le Président de la République", "Les députés", "Le Sénat"], 0, "C'est le Président qui le nomme."],
      ["Depuis quelle année Mayotte est-elle un département ?", ["2011", "1975", "1958"], 0, "Mayotte est devenue le 101e département en 2011."],
      ["Quelle Constitution est en vigueur ?", ["Celle de 1958", "Celle de 1789", "Celle de 1946"], 0, "C'est la Constitution de la Ve République."],
      ["En quelle année l'esclavage a-t-il été aboli définitivement en France ?", ["1848", "1789", "1905"], 0, "Décret du 27 avril 1848, porté par Victor Schœlcher."],
      ["Qui dirige la commune ?", ["Le maire", "Le préfet", "Le député"], 0, "Le maire est élu par le conseil municipal."],
      ["Quel texte de 1789 proclame les droits de chaque personne ?", ["La Déclaration des droits de l'homme et du citoyen", "Le Code civil", "La Marseillaise"], 0, "Adoptée le 26 août 1789."],
      ["Qui représente l'État dans le département ?", ["Le préfet", "Le maire", "Le sénateur"], 0, "Le préfet est nommé par le gouvernement."],
      ["La justice en France est…", ["indépendante", "décidée par le Président", "rendue par la police"], 0, "La séparation des pouvoirs garantit son indépendance."]
    ]}
  ]
},
{
  id: "examen", nom: "Examen blanc", sous: "S'entraîner dans les conditions du test",
  modules: [
  { id: "ex-grammaire", type: "blanc", epreuve: "grammaire", titre: "Quiz B2 : grammaire et vocabulaire (15 questions)", source: ["grammaire", "vocabulaire"], niveaux: ["b1", "b2"], nb: 15 },
  { id: "ex-comprendre", type: "blanc-comp", epreuve: "lire", titre: "Compréhension écrite et orale (mélange)", nb: 12 },
  { id: "ex-ecrit", type: "ecrit", epreuve: "ecrire", titre: "Écrit blanc : 3 tâches en 30 minutes", minuteur: 30,
    consigne: "Tâche 1 : écris à une amie pour l'inviter à ton anniversaire (date, lieu, ce qu'il faut apporter). Tâche 2 : sur un blog, raconte ton meilleur souvenir de voyage et dis ce qu'il t'a appris. Tâche 3 : « Faut-il rendre le service civique obligatoire pour les jeunes ? » Donne ton avis argumenté.",
    mots: [250, 400],
    aide: ["Tâche 1 : environ 60 à 120 mots", "Tâche 2 : environ 120 à 150 mots", "Tâche 3 : environ 120 à 180 mots", "Garde 3 minutes pour relire"],
    modele: "Tâche 3 (exemple) :\nFaut-il rendre le service civique obligatoire ? Certains pensent que cela renforcerait la cohésion sociale. En effet, des jeunes de milieux différents travailleraient ensemble sur des missions utiles. De plus, ils découvriraient des métiers. Cependant, un engagement imposé perd une partie de son sens : le bénévolat repose sur la volonté. Par ailleurs, certains jeunes doivent travailler pour aider leur famille. Pour ma part, je préfère un service civique encouragé, mieux payé et reconnu dans les études, plutôt qu'obligatoire.",
    criteres: ["J'ai fait les 3 tâches en 30 minutes", "Chaque tâche respecte la consigne", "J'ai relu mes accords et mes verbes", "J'ai envoyé mon texte pour correction"] },
  { id: "ex-oral", type: "oral", epreuve: "parler", titre: "Oral blanc : 3 tâches en 10 minutes", minuteur: 10,
    consigne: "Tâche 1 (2 min) : présente-toi, ton parcours et tes projets. Tâche 2 (3 min) : tu veux louer une salle pour une fête ; pose toutes tes questions au gérant. Tâche 3 (4 min) : « Les réseaux sociaux rapprochent-ils ou éloignent-ils les gens ? » Donne ton avis.",
    questions: ["Pourquoi voulez-vous devenir française ?", "Que représente pour vous la laïcité ?", "Comment voyez-vous votre vie dans cinq ans ?"],
    aide: ["Respire et parle lentement", "Fais des phrases complètes", "Si tu ne comprends pas : « Pourriez-vous répéter, s'il vous plaît ? »"],
    modele: "Tâche 3 (exemple) : À mon avis, les réseaux sociaux rapprochent les personnes éloignées, mais ils peuvent éloigner celles qui vivent ensemble. D'un côté, ils me permettent de parler chaque semaine avec ma famille à l'étranger, ce qui était impossible avant. De l'autre, on voit souvent des familles à table, chacun sur son téléphone. Certains diront qu'il suffit d'interdire les téléphones. Pourtant, je pense qu'il vaut mieux fixer des règles simples, comme pas d'écran pendant les repas. Pour conclure, ce n'est pas l'outil qui pose problème, c'est la façon de l'utiliser.",
    criteres: ["J'ai fait les 3 tâches sans m'arrêter", "J'ai posé au moins 6 questions à la tâche 2", "J'ai argumenté à la tâche 3", "Je me suis enregistrée pour me réécouter"] },
  { id: "ex-civique", type: "blanc", epreuve: "civique", titre: "Quiz civique final (15 questions)", source: ["civique"], niveaux: ["a2", "b1", "b2"], nb: 15 }
  ]
}
];

const EPREUVES = {
  ecouter: { nom: "Écouter", icone: "🎧" },
  lire: { nom: "Lire", icone: "📖" },
  ecrire: { nom: "Écrire", icone: "✍️" },
  parler: { nom: "Parler", icone: "🗣️" },
  grammaire: { nom: "Grammaire", icone: "🧩" },
  vocabulaire: { nom: "Vocabulaire", icone: "💬" },
  civique: { nom: "Vie en France", icone: "🇫🇷" }
};
