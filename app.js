// Apprendre le français – parcours A2 → B2 (naturalisation)
// Progression gardée sur le téléphone (localStorage).
const CLE = "apf-v2";
const SEUIL = 0.7; // 70 % pour réussir un module
const BOITES = [1, 3, 7, 14, 30]; // répétition espacée (jours)
const TIRAGE = 10; // questions par passage

let E = charger();
function charger() {
  try { return Object.assign({ modules: {}, depart: null, revisions: {}, textes: {}, debut: Date.now() }, JSON.parse(localStorage.getItem(CLE) || "{}")); }
  catch (e) { return { modules: {}, depart: null, revisions: {}, textes: {}, debut: Date.now() }; }
}
function sauver() { localStorage.setItem(CLE, JSON.stringify(E)); }

const app = document.getElementById("app");
const $ = (h) => { const d = document.createElement("div"); d.innerHTML = h; return d; };
function vider() { app.innerHTML = ""; window.scrollTo(0, 0); }
function ajoute(h) { const d = $(h); while (d.firstChild) app.appendChild(d.firstChild); }
function bouton(txt, fn, cls, parent) { const b = document.createElement("button"); b.textContent = txt; if (cls) b.className = cls; b.onclick = fn; (parent || app).appendChild(b); return b; }
function melange(t) { t = t.slice(); for (let i = t.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [t[i], t[j]] = [t[j], t[i]]; } return t; }
function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
const jour = 86400000;

// ---------- Voix (synthèse vocale du téléphone) ----------
function voixFr() { const v = speechSynthesis.getVoices().filter(v => v.lang && v.lang.startsWith("fr")); return v.find(x => /fr-FR/i.test(x.lang)) || v[0] || null; }
function dire(texte, vitesse, fin) {
  if (!("speechSynthesis" in window)) { alert("Ton navigateur ne peut pas lire le texte à voix haute."); return; }
  speechSynthesis.cancel();
  const morceaux = texte.split(/(?<=[.!?])\s+|\s+—\s+/).filter(Boolean);
  let i = 0;
  const suivant = () => {
    if (i >= morceaux.length) { if (fin) fin(); return; }
    const u = new SpeechSynthesisUtterance(morceaux[i].replace(/^—\s*/, ""));
    u.lang = "fr-FR"; u.rate = vitesse || 0.95; const v = voixFr(); if (v) u.voice = v;
    u.pitch = (texte.includes("—") && i % 2) ? 1.25 : 1;
    u.onend = () => { i++; suivant(); };
    speechSynthesis.speak(u);
  };
  suivant();
}
if ("speechSynthesis" in window) speechSynthesis.getVoices();

// ---------- Progression ----------
function tousModules() { const t = []; NIVEAUX.forEach(n => n.modules.forEach(m => t.push({ n, m }))); return t; }
function etat(id) { return E.modules[id] || null; }
function reussi(id) { const s = etat(id); return !!(s && (s.ok || s.dispense)); }
function valeur(id) { const s = etat(id); if (!s) return 0; if (s.ok || s.dispense) return 1; return Math.min(0.6, (s.meilleur || 0) * 0.6); }
function pourcentage() { const t = tousModules(); return Math.round(100 * t.reduce((a, x) => a + valeur(x.m.id), 0) / t.length); }
function niveauOuvert(i) {
  if (i === 0) return true;
  if (E.depart) { const k = NIVEAUX.findIndex(n => n.id === E.depart); if (i <= k) return true; }
  const prec = NIVEAUX[i - 1].modules; const ok = prec.filter(m => reussi(m.id)).length;
  return ok >= Math.ceil(prec.length * SEUIL);
}
function examenDate() { return new Date((E.examen || EXAMEN_DEFAUT) + "-01T00:00:00"); }
function examenMois() { return examenDate().toLocaleDateString("fr-FR", { month: "long", year: "numeric" }); }
function semainesRestantes() { return Math.max(0, Math.ceil((examenDate() - Date.now()) / (7 * jour))); }
function modulesRestants() { return tousModules().filter(x => !reussi(x.m.id)).length; }
function attendu() { // où il faudrait être aujourd'hui pour finir à temps (début = 1re visite)
  const tot = examenDate() - E.debut; if (tot <= 0) return 100;
  return Math.min(100, Math.round(100 * (Date.now() - E.debut) / tot));
}
function parEpreuve() {
  const r = {};
  tousModules().forEach(({ m }) => { const k = m.epreuve; r[k] = r[k] || { f: 0, t: 0 }; r[k].t++; r[k].f += valeur(m.id); });
  return r;
}

// ---------- Révisions (répétition espacée) ----------
function ajouterRevision(cle, item) {
  const r = E.revisions[cle];
  E.revisions[cle] = { item, boite: 0, due: Date.now() + jour, erreurs: (r ? r.erreurs : 0) + 1 };
}
function aReviser() { const n = Date.now(); return Object.entries(E.revisions).filter(([k, r]) => r.due <= n); }

// ---------- Accueil ----------
function accueil() {
  vider(); speechSynthesis && speechSynthesis.cancel();
  const p = pourcentage(), att = attendu(), sem = semainesRestantes(), rest = modulesRestants();
  const rythme = sem > 0 ? Math.max(1, Math.ceil(rest / sem)) : rest;
  const avance = p >= att ? "Tu es dans les temps 👏" : "Un peu de retard : fais " + rythme + " module" + (rythme > 1 ? "s" : "") + " cette semaine.";
  ajoute(`<div class="carte hero">
    <div class="anneau" style="--p:${p}"><span>${p}<small>%</small></span></div>
    <div><b>Ta progression vers le B2</b><br><span class="petit">Objectif : passer l'examen en ${examenMois()}<br>${sem} semaines restantes · ${rest} modules à faire</span><br><span class="petit fort">${avance}</span></div>
  </div>`);
  const sj = serieJours(); const nb = Object.keys(E.badges || {}).length;
  ajoute(`<div class="jeu"><span>🔥 <b>${sj}</b> jour${sj > 1 ? "s" : ""} de suite</span><span>🏅 <b>${nb}</b> / ${BADGES.length} badges</span><span>✅ <b>${E.bonnes || 0}</b> bonnes réponses</span></div>`);
  const pe = parEpreuve(); let barres = '<div class="carte"><b>Tes compétences</b>';
  for (const k in EPREUVES) if (pe[k]) { const v = Math.round(100 * pe[k].f / pe[k].t); barres += `<div class="ligne"><span>${EPREUVES[k].icone} ${EPREUVES[k].nom}</span><div class="barre"><i style="width:${v}%"></i></div><span class="petit">${v}%</span></div>`; }
  ajoute(barres + "</div>");

  if (!E.vu) {
    ajoute(`<div class="carte accent"><b>Bienvenue 👋</b><p>Ce site gratuit t'aide à atteindre le niveau <b>B2</b> en français, demandé pour la nationalité française. Tu avances de A2 à B2 avec des exercices corrigés, de l'écoute, de l'écrit, de l'oral et la vie en France.</p><p class="petit">Pas de compte, pas d'inscription. Ta progression reste seulement sur ton téléphone.</p></div>`);
    bouton("C'est parti", () => { E.vu = true; sauver(); accueil(); });
    bouton("📲 Mettre le site sur mon écran d'accueil", ecranAccueil, "sec");
    return;
  }
  if (!E.depart) {
    ajoute('<div class="carte accent"><b>Commence par le test de niveau</b><br><span class="petit">15 questions, 5 minutes. Il te place au bon niveau et ouvre les modules qui te correspondent.</span></div>');
    bouton("🧭 Faire le test de niveau", testNiveau);
  }
  if (E.depart && !(E.defis && E.defis[aujourdhui()] != null)) bouton("⚡ Défi du jour : 5 questions", defiDuJour, "vert");
  const rv = aReviser();
  if (rv.length) bouton("🔁 Mes révisions du jour (" + rv.length + ")", revisions, "vert");
  if (hebdoDispo() && !(E.hebdo && E.hebdo[hebdoSemaine()] != null) && hebdoPool().length >= 5) bouton("📅 Révision de la semaine", revisionSemaine, "vert");
  const ne = toutesErreurs().length; if (ne) bouton("❗ Mes erreurs (" + ne + ")", pageErreurs, "sec");
  const suiv = prochain(); if (suiv) bouton("▶️ Continuer : " + suiv.m.titre, () => ouvrir(suiv.m));

  NIVEAUX.forEach((n, i) => {
    const ouvert = niveauOuvert(i), faits = n.modules.filter(m => reussi(m.id)).length;
    ajoute(`<h2>${ouvert ? "" : "🔒 "}${n.nom} <span class="petit">· ${faits}/${n.modules.length}</span></h2><p class="petit">${n.sous}${ouvert ? "" : " — se débloque quand tu as réussi " + Math.ceil(NIVEAUX[i - 1].modules.length * SEUIL) + " modules du niveau précédent."}</p>`);
    if (!ouvert) return;
    n.modules.forEach(m => {
      const s = etat(m.id); const ic = EPREUVES[m.epreuve].icone;
      const st = reussi(m.id) ? " ✅" : s && s.meilleur != null ? " · " + Math.round(s.meilleur * 100) + "%" : "";
      bouton(ic + " " + m.titre + st, () => ouvrir(m), reussi(m.id) ? "rep fait" : "rep");
    });
  });
  ajoute('<h2>Plus</h2>');
  bouton("📚 Mes mots (cartes de vocabulaire)", cartesMots, "sec");
  bouton("❗ Mes erreurs (" + toutesErreurs().length + ")", pageErreurs, "sec");
  bouton("🏅 Mes badges", pageBadges, "sec");
  bouton("📅 Révision de la semaine" + (hebdoDispo() ? "" : " (dimanche et lundi)"), () => hebdoDispo() ? revisionSemaine() : (vider(), ajoute('<div class="carte">La révision de la semaine s\'ouvre le dimanche et reste disponible le lundi.</div>'), bouton("← Retour", accueil, "sec")), "sec");
  bouton("ℹ️ Le test B2 et la méthode", infos, "sec");
  bouton("📅 Changer la date de mon examen", changerDate, "sec");
  bouton("📲 Mettre le site sur mon écran d'accueil", ecranAccueil, "sec");
  bouton("💬 Partager avec une amie (WhatsApp)", partager, "vert");
  bouton("↺ Remettre à zéro", () => { if (confirm("Effacer toute ta progression ?")) { localStorage.removeItem(CLE); E = charger(); sauver(); accueil(); } }, "sec");
}
function prochain() {
  for (let i = 0; i < NIVEAUX.length; i++) { if (!niveauOuvert(i)) break; const m = NIVEAUX[i].modules.find(m => !reussi(m.id)); if (m) return { n: NIVEAUX[i], m }; }
  return null;
}
function ouvrir(m, autre) {
  ({ qcm: moduleQcm, lecture: moduleDocs, ecoute: moduleDocs, ecrit: moduleEcrit, oral: moduleOral, blanc: moduleBlanc, "blanc-comp": moduleBlancComp })[m.type](m, autre);
}
function enregistrer(m, ratio) {
  const s = E.modules[m.id] || {}; s.meilleur = Math.max(s.meilleur || 0, ratio); s.essais = (s.essais || 0) + 1;
  if (ratio >= SEUIL) s.ok = true; s.date = Date.now(); E.modules[m.id] = s; sauver();
}
function motsHtml(m) { return Array.isArray(m.mots) && Array.isArray(m.mots[0]) ? '<div class="carte mots"><b>Mots utiles</b><ul>' + m.mots.map(([a, b]) => `<li><b>${esc(a)}</b> : ${esc(b)}</li>`).join("") + "</ul></div>" : ""; }

// ---------- Série de questions (commune) ----------
function trouverModule(id) { for (const n of NIVEAUX) for (const m of n.modules) if (m.id === id) return m; return null; }
function resoudre(cle) { // retrouve une question de la banque à partir de sa clé
  const p = cle.split(":"); const m = trouverModule(p[0]); if (!m) return null;
  if (p.length === 2 && m.q && m.q[+p[1]]) return { q: m.q[+p[1]], cle, mod: m.id };
  if (p.length === 3 && m.docs && m.docs[+p[1]] && m.docs[+p[1]].q[+p[2]]) return { q: m.docs[+p[1]].q[+p[2]], cle, mod: m.id, d: m.docs[+p[1]], ecoute: m.type === "ecoute" };
  return null;
}
// ---------- Erreurs (comme le code de la route) ----------
function noterErreur(cle) { E.erreurs = E.erreurs || {}; const r = E.erreurs[cle] || { fois: 0 }; r.fois++; r.suite = 0; E.erreurs[cle] = r; }
function noterJuste(cle) { if (!E.erreurs || !E.erreurs[cle]) return; E.erreurs[cle].suite = (E.erreurs[cle].suite || 0) + 1; if (E.erreurs[cle].suite >= 2) delete E.erreurs[cle]; }
function erreursDe(modId) { return Object.keys(E.erreurs || {}).filter(c => c.split(":")[0] === modId && resoudre(c)); }
function toutesErreurs() { return Object.keys(E.erreurs || {}).filter(c => resoudre(c)); }

function afficherDoc(q, etat) {
  if (!q.d) return;
  if (q.ecoute) {
    ajoute(`<div class="carte"><b>🎧 ${esc(q.d.titre)}</b></div>`);
    const ligne = document.createElement("div"); ligne.className = "duo"; app.appendChild(ligne);
    bouton("▶️ Écouter", () => dire(q.d.audio, 0.95), "", ligne);
    bouton("🐢 Plus lent", () => dire(q.d.audio, 0.75), "sec", ligne);
    const tr = $(`<details class="carte petit"><summary>Voir le texte (après avoir répondu)</summary>${esc(q.d.audio)}</details>`); app.appendChild(tr.firstChild);
    if (etat.doc !== q.d) { etat.doc = q.d; setTimeout(() => dire(q.d.audio, 0.95), 300); }
  } else ajoute(`<div class="carte doc"><b>${esc(q.d.titre)}</b>${q.d.texte}</div>`);
}
function serie(titre, qs, fin) {
  let i = 0, score = 0; const ratees = [], etat = {};
  function pose() {
    vider();
    if (i >= qs.length) return fin(score, qs.length, ratees);
    const q = qs[i]; const [enonce, choix, bonne, expl] = q.q;
    ajoute(`<p class="petit">${esc(titre)} · ${i + 1} / ${qs.length}${E.erreurs && E.erreurs[q.cle] ? " · ❗ déjà ratée" : ""}</p>`);
    afficherDoc(q, etat);
    ajoute(`<div class="carte"><b>${esc(enonce)}</b></div>`);
    let fini = false; const btns = {};
    melange(choix.map((c, n) => n)).forEach(n => {
      const b = bouton(choix[n], () => {
        if (fini) return; fini = true;
        E.vues = E.vues || {}; const av = E.vues[q.cle]; E.vues[q.cle] = { t: Date.now(), juste: n === bonne, rate: (av && av.rate) || n !== bonne };
        marquerJour(); if (n === bonne) E.bonnes = (E.bonnes || 0) + 1;
        if (n === bonne) { score++; b.classList.add("ok", "pop"); if (E.revisions[q.cle]) revOk(q.cle); noterJuste(q.cle); }
        else { b.classList.add("ko"); btns[bonne].classList.add("ok"); ajouterRevision(q.cle, q.q); noterErreur(q.cle); ratees.push(q); }
        sauver();
        const enc = n === bonne ? (av && av.rate ? "✅ Bravo, tu l'avais ratée avant : elle rentre. " : "✅ Bonne réponse. ") : null;
        ajoute(`<div class="expl">${n === bonne ? enc : "❌ La bonne réponse : <b>" + esc(choix[bonne]) + "</b>. "}${esc(expl)}</div>`);
        bouton(i + 1 < qs.length ? "Question suivante →" : "Voir mon score", () => { i++; pose(); });
      }, "rep"); btns[n] = b;
    });
    bouton("← Quitter", accueil, "sec");
  }
  pose();
}
function revOk(cle) { const r = E.revisions[cle]; if (!r) return; r.boite++; if (r.boite >= BOITES.length) delete E.revisions[cle]; else r.due = Date.now() + BOITES[r.boite] * jour; }
function refaireErreurs(liste, retour) {
  serie("Refaire mes erreurs", melange(liste), (s, t, r) => {
    vider(); ajoute(`<div class="carte"><h2>${s} / ${t}</h2><p>${r.length ? "Encore " + r.length + " à revoir. Une question quitte ta liste d'erreurs quand tu la réussis 2 fois de suite." : "Tout est juste 👏 Réussis-les encore une fois plus tard pour les sortir de ta liste."}</p></div>`);
    if (r.length) bouton("❗ Refaire mes erreurs (" + r.length + ")", () => refaireErreurs(r, retour));
    bouton("Retour", retour, "sec");
  });
}
function ecranScore(m, s, t, refaire, ratees) {
  const avant = etat(m.id) && etat(m.id).meilleur;
  enregistrer(m, s / t); const ok = s / t >= SEUIL;
  if (avant != null && !etat(m.id).dispense) ajoute(`<p class="petit">${s / t > avant ? "📈 Nouveau record sur ce module (avant : " + Math.round(avant * t) + " / " + t + ")." : "Ton record sur ce module : " + Math.round(avant * 100) + " %."}</p>`);
  ajoute(`<div class="carte"><h2>${s} / ${t}</h2><p>${ok ? "Module réussi ✅ Ta progression est à <b>" + pourcentage() + " %</b>." : "Il faut " + Math.ceil(t * SEUIL) + " bonnes réponses pour valider."}</p>${ratees && ratees.length ? '<p class="petit">Tes erreurs reviendront en premier à ta prochaine série, et dans tes révisions des prochains jours.</p>' : ""}</div>`);
  bandeauBadges(nouveauxBadges());
  if (ratees && ratees.length) bouton("❗ Refaire mes erreurs (" + ratees.length + ")", () => refaireErreurs(ratees, accueil));
  bouton("Nouvelle série", refaire, "sec"); bouton("Retour à l'accueil", accueil, "sec");
}
function pageErreurs() {
  vider(); const tout = toutesErreurs();
  ajoute(`<h2>❗ Mes erreurs <span class="petit">· ${tout.length}</span></h2><div class="carte petit">Une question quitte la liste quand tu la réussis 2 fois de suite.</div>`);
  if (!tout.length) { ajoute('<div class="carte">Aucune erreur en attente 👍</div>'); return bouton("← Retour", accueil, "sec"); }
  bouton("Refaire toutes mes erreurs (" + tout.length + ")", () => refaireErreurs(tout.map(resoudre), pageErreurs));
  NIVEAUX.forEach(n => n.modules.forEach(m => { const e = erreursDe(m.id); if (e.length) bouton(EPREUVES[m.epreuve].icone + " " + m.titre + " · " + e.length, () => refaireErreurs(e.map(resoudre), pageErreurs), "rep"); }));
  bouton("← Retour", accueil, "sec");
}
function blocErreursModule(m) {
  const e = erreursDe(m.id);
  if (e.length) { ajoute(`<div class="carte accent petit">❗ ${e.length} erreur${e.length > 1 ? "s" : ""} en attente dans ce module. Elles passeront en premier.</div>`); bouton("Refaire mes erreurs de ce module (" + e.length + ")", () => refaireErreurs(e.map(resoudre), () => ouvrir(m)), "sec"); }
}

// ---------- QCM avec règle ----------
function moduleQcm(m) {
  vider();
  ajoute(`<h2>${EPREUVES[m.epreuve].icone} ${esc(m.titre)}</h2>${motsHtml(m)}<div class="carte regle">${m.regle}</div>`);
  ajoute('<p class="petit">Conseil : lis la règle, cache-la, puis essaie de la redire avec tes mots avant de commencer.</p>');
  const nb = Math.min(TIRAGE, m.q.length);
  ajoute(`<p class="petit">${nb} questions tirées au hasard dans une banque de ${m.q.length}. Chaque passage est différent.</p>`);
  blocErreursModule(m);
  bouton("Commencer les " + nb + " exercices", () => {
    const err = melange(erreursDe(m.id)).slice(0, nb).map(resoudre);
    const reste = melange(m.q.map((q, k) => ({ q, cle: m.id + ":" + k })).filter(x => !err.some(e => e.cle === x.cle)));
    serie(m.titre, err.concat(reste).slice(0, nb), (s, t, r) => ecranScore(m, s, t, () => moduleQcm(m), r));
  });
  bouton("← Retour", accueil, "sec");
}

// ---------- Lecture / écoute ----------
function moduleDocs(m) {
  vider(); const ecoute = m.type === "ecoute";
  ajoute(`<h2>${EPREUVES[m.epreuve].icone} ${esc(m.titre)}</h2>${motsHtml(m)}<div class="carte petit">${ecoute ? "Écoute d'abord sans lire. Tu peux réécouter, puis ralentir. Le texte s'affiche après ta réponse." : "Lis d'abord la question, puis cherche la réponse dans le texte."}</div>`);
  let tot = 0; m.docs.forEach(d => tot += d.q.length);
  ajoute(`<p class="petit">Documents tirés au hasard dans une banque de ${m.docs.length} documents (${tot} questions).</p>`);
  blocErreursModule(m);
  bouton("Commencer", () => {
    // d'abord les documents où il reste des erreurs, puis au hasard
    const errDocs = new Set(erreursDe(m.id).map(c => +c.split(":")[1]));
    const ordre = melange(m.docs.map((d, di) => di)).sort((x, y) => errDocs.has(y) - errDocs.has(x));
    const qs = []; for (const di of ordre) { if (qs.length >= TIRAGE) break; m.docs[di].q.forEach((q, k) => qs.push(resoudre(m.id + ":" + di + ":" + k))); }
    serie(m.titre, qs, (s, t, r) => ecranScore(m, s, t, () => moduleDocs(m), r));
  });
  bouton("← Retour", accueil, "sec");
}

// ---------- Écrit ----------
function compte(t) { return (t.trim().match(/[\wÀ-ÿ'’-]+/g) || []).length; }
function sujet(m, autre) {
  if (!m.sujets) return m;
  E.sujets = E.sujets || {};
  let k = E.sujets[m.id];
  if (k == null || autre || k >= m.sujets.length) { let n; do { n = Math.floor(Math.random() * m.sujets.length); } while (m.sujets.length > 1 && n === k); k = n; E.sujets[m.id] = k; sauver(); }
  return Object.assign({}, m, m.sujets[k], { idTexte: m.id + ":" + k, numSujet: k + 1 });
}
function boutonAutre(m) { if (m.sujets && m.sujets.length > 1) bouton("🎲 Un autre sujet (" + m.sujets.length + " sujets)", () => ouvrir(m, true), "sec"); }
function moduleEcrit(m0, autre) {
  const m = sujet(m0, autre); vider();
  ajoute(`<h2>✍️ ${esc(m.titre)}</h2><div class="carte"><b>Consigne</b><p>${esc(m.consigne)}</p><p class="petit">Longueur : ${m.mots[0]} à ${m.mots[1]} mots${m.minuteur ? " · " + m.minuteur + " minutes" : ""}.</p></div>`);
  ajoute('<details class="carte"><summary><b>Phrases utiles</b></summary><ul>' + m.aide.map(a => "<li>" + esc(a) + "</li>").join("") + "</ul></details>");
  if (m.minuteur) minuteur(m.minuteur);
  const ta = document.createElement("textarea"); ta.placeholder = "Écris ton texte ici…"; ta.value = E.textes[m.idTexte || m.id] || ""; app.appendChild(ta);
  const nb = $('<p class="petit"></p>').firstChild; app.appendChild(nb);
  const maj = () => { const c = compte(ta.value); nb.textContent = c + " mots" + (c < m.mots[0] ? " (encore " + (m.mots[0] - c) + ")" : c > m.mots[1] ? " (un peu trop long)" : " ✔"); E.textes[m.idTexte || m.id] = ta.value; sauver(); };
  ta.oninput = maj; maj();
  bouton("📋 Copier mon texte (pour le faire corriger)", () => { navigator.clipboard && navigator.clipboard.writeText(m.consigne + "\n\n" + ta.value).then(() => alert("Texte copié. Colle-le dans un message à ton correcteur.")); }, "sec");
  bouton("Voir un modèle et m'auto-évaluer", () => autoEval(m));
  boutonAutre(m0);
  bouton("← Retour", accueil, "sec");
}
function minuteur(min) {
  const d = $(`<div class="carte minuteur"><b>⏱️ <span>${min}:00</span></b></div>`).firstChild; app.appendChild(d);
  let reste = min * 60, t = null; const sp = d.querySelector("span");
  bouton("Démarrer le minuteur", (e) => { if (t) return; e.target.textContent = "Minuteur lancé"; t = setInterval(() => { reste--; sp.textContent = Math.floor(reste / 60) + ":" + String(reste % 60).padStart(2, "0"); if (reste <= 0) { clearInterval(t); sp.textContent = "Temps écoulé !"; } }, 1000); }, "sec");
}
function autoEval(m) {
  vider();
  ajoute(`<h2>${EPREUVES[m.epreuve].icone} ${esc(m.titre)}</h2><div class="carte"><b>Modèle${m.numSujet ? " (sujet " + m.numSujet + ")" : ""}</b><p class="modele">${esc(m.modele).replace(/\n/g, "<br>")}</p></div>`);
  if (m.type === "oral") {
    ajoute('<div class="carte petit"><b>Shadowing :</b> écoute une phrase, puis répète-la en même temps que la voix, avec la même mélodie. Fais-le 2 ou 3 fois.</div>');
    const l = document.createElement("div"); l.className = "duo"; app.appendChild(l);
    bouton("▶️ Écouter le modèle", () => dire(m.modele, 0.95), "", l); bouton("🐢 Lentement", () => dire(m.modele, 0.75), "sec", l);
  }
  ajoute("<div class='carte'><b>Coche ce que tu as réussi</b></div>");
  const cases = m.criteres.map(c => { const l = $(`<label class="case"><input type="checkbox"> ${esc(c)}</label>`).firstChild; app.appendChild(l); return l.querySelector("input"); });
  bouton("Valider mon auto-évaluation", () => {
    const r = cases.filter(c => c.checked).length / cases.length; enregistrer(m, r); vider();
    ajoute(`<div class="carte"><h2>${Math.round(r * 100)} %</h2><p>${r >= SEUIL ? "Module validé ✅ Progression : <b>" + pourcentage() + " %</b>." : "Pas encore validé. Reprends ton texte avec le modèle sous les yeux, puis réessaie."}</p><p class="petit">Le plus efficace : fais corriger ton texte ou ton enregistrement par quelqu'un, puis réécris-le une fois corrigé.</p></div>`);
    bouton("Refaire", () => ouvrir(NIVEAUX.flatMap(n => n.modules).find(x => x.id === m.id)), "sec"); bouton("Retour à l'accueil", accueil);
  });
  bouton("← Retour", () => ouvrir(NIVEAUX.flatMap(n => n.modules).find(x => x.id === m.id)), "sec");
}

// ---------- Oral ----------
function moduleOral(m0, autre) {
  const m = sujet(m0, autre); vider();
  ajoute(`<h2>🗣️ ${esc(m.titre)}</h2><div class="carte"><b>Consigne</b><p>${esc(m.consigne)}</p></div>`);
  if (m.questions && m.questions.length) {
    ajoute('<div class="carte"><b>Questions possibles de l\'examinateur</b><ul>' + m.questions.map(q => "<li>" + esc(q) + "</li>").join("") + "</ul></div>");
    const l = document.createElement("div"); l.className = "duo"; app.appendChild(l);
    bouton("🔊 Entendre les questions", () => dire(m.questions.join(" ")), "sec", l);
  }
  ajoute('<details class="carte"><summary><b>Phrases utiles</b></summary><ul>' + m.aide.map(a => "<li>" + esc(a) + "</li>").join("") + "</ul></details>");
  ajoute('<div class="carte petit">Parle à voix haute. Le mieux : enregistre-toi avec l\'app Dictaphone (ou un vocal), réécoute-toi, puis compare avec le modèle.</div>');
  minuteur(m.minuteur || 3);
  bouton("J'ai parlé : voir le modèle et m'auto-évaluer", () => autoEval(m));
  boutonAutre(m0);
  bouton("← Retour", accueil, "sec");
}

// ---------- Examen blanc ----------
function moduleBlanc(m) {
  const pool = [];
  NIVEAUX.filter(n => m.niveaux.includes(n.id)).forEach(n => n.modules.filter(x => x.type === "qcm" && m.source.includes(x.epreuve)).forEach(x => x.q.forEach((q, k) => pool.push({ q, cle: x.id + ":" + k }))));
  vider(); ajoute(`<h2>🎯 ${esc(m.titre)}</h2><div class="carte petit">Des questions tirées au hasard dans tout le parcours. Il faut ${Math.round(SEUIL * 100)} % pour valider.</div>`);
  bouton("Commencer", () => serie(m.titre, melange(pool).slice(0, m.nb), (s, t, r) => ecranScore(m, s, t, () => moduleBlanc(m), r)));
  bouton("← Retour", accueil, "sec");
}
function moduleBlancComp(m) {
  const docs = []; NIVEAUX.forEach(n => n.id !== "a2" && n.modules.filter(x => x.type === "lecture" || x.type === "ecoute").forEach(x => x.docs.forEach((d, di) => docs.push({ x, d, di }))));
  vider(); ajoute(`<h2>🎯 ${esc(m.titre)}</h2><div class="carte petit">Documents écrits et sonores mélangés, comme le jour du test. Écoute une seule fois si tu veux te mettre en condition.</div>`);
  bouton("Commencer", () => {
    const qs = []; for (const o of melange(docs)) { if (qs.length >= m.nb) break; o.d.q.forEach((q, k) => qs.push(resoudre(o.x.id + ":" + o.di + ":" + k))); }
    serie(m.titre, qs, (s, t, r) => ecranScore(m, s, t, () => moduleBlancComp(m), r));
  });
  bouton("← Retour", accueil, "sec");
}

// ---------- Jeu : série de jours, badges, défi du jour ----------
function aujourdhui(d) { const x = d ? new Date(d) : new Date(); return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0"); }
function marquerJour() { E.jours = E.jours || {}; E.jours[aujourdhui()] = 1; E.bonnes = (E.bonnes || 0); }
function serieJours() {
  const j = E.jours || {}; let n = 0; const d = new Date();
  if (!j[aujourdhui(d)]) d.setDate(d.getDate() - 1); // la série tient encore si on a travaillé hier
  while (j[aujourdhui(d)]) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
const BADGES = [
  ["premier", "🌱", "Premier module réussi", () => tousModules().some(x => etat(x.m.id) && etat(x.m.id).ok)],
  ["bonnes100", "🎯", "100 bonnes réponses", () => (E.bonnes || 0) >= 100],
  ["bonnes500", "🏹", "500 bonnes réponses", () => (E.bonnes || 0) >= 500],
  ["serie3", "🔥", "3 jours de suite", () => serieJours() >= 3],
  ["serie7", "⚡", "7 jours de suite", () => serieJours() >= 7],
  ["serie30", "🌟", "30 jours de suite", () => serieJours() >= 30],
  ["a2", "🥉", "Niveau A2 terminé", () => NIVEAUX[0].modules.every(m => reussi(m.id) && !etat(m.id).dispense)],
  ["b1", "🥈", "Niveau B1 terminé", () => NIVEAUX[1].modules.every(m => reussi(m.id) && !etat(m.id).dispense)],
  ["b2", "🥇", "Niveau B2 terminé", () => NIVEAUX[2].modules.every(m => reussi(m.id))],
  ["examen", "🏆", "Examen blanc réussi", () => NIVEAUX[3].modules.every(m => reussi(m.id))],
  ["zero", "🧹", "Plus aucune erreur en attente", () => (E.bonnes || 0) >= 50 && toutesErreurs().length === 0]
];
function nouveauxBadges() {
  E.badges = E.badges || {}; const n = [];
  BADGES.forEach(([id, ic, nom, f]) => { if (!E.badges[id] && f()) { E.badges[id] = Date.now(); n.push(ic + " " + nom); } });
  if (n.length) sauver(); return n;
}
function bandeauBadges(n) { if (n.length) ajoute(`<div class="carte badge-new">Nouveau badge : <b>${n.map(esc).join(", ")}</b></div>`); }
function graine(str) { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; }; }
function defiDuJour() {
  const pool = [];
  NIVEAUX.forEach((n, i) => { if (niveauOuvert(i)) n.modules.forEach(m => { if (m.type === "qcm") m.q.forEach((q, k) => pool.push(m.id + ":" + k)); }); });
  const r = graine(aujourdhui()); const choisies = [];
  while (choisies.length < 5 && pool.length) choisies.push(pool.splice(Math.floor(r() * pool.length), 1)[0]);
  vider(); ajoute(`<h2>⚡ Défi du jour</h2><div class="carte petit">5 questions, les mêmes pour tout le monde aujourd'hui. 2 minutes, et ta série de jours continue.</div>`);
  bouton("Relever le défi", () => serie("Défi du jour", choisies.map(resoudre), (s, t, rt) => {
    E.defis = E.defis || {}; E.defis[aujourdhui()] = s; sauver(); vider();
    ajoute(`<div class="carte"><h2>${s === t ? "Parfait ! " : ""}${s} / ${t}</h2><p>${s === t ? "Défi réussi sans faute." : "Les questions ratées sont dans tes erreurs : tu les reverras."}</p><p>🔥 Série : <b>${serieJours()} jour${serieJours() > 1 ? "s" : ""}</b></p></div>`);
    bandeauBadges(nouveauxBadges());
    if (rt.length) bouton("❗ Refaire mes erreurs (" + rt.length + ")", () => refaireErreurs(rt, accueil));
    bouton("Retour à l'accueil", accueil, "sec");
  }));
  bouton("← Retour", accueil, "sec");
}

function pageBadges() {
  nouveauxBadges(); vider(); ajoute(`<h2>🏅 Mes badges</h2>`);
  BADGES.forEach(([id, ic, nom]) => ajoute(`<div class="carte ${E.badges && E.badges[id] ? "" : "gris"}">${ic} <b>${nom}</b>${E.badges && E.badges[id] ? " ✅" : ""}</div>`));
  bouton("← Retour", accueil, "sec");
}

// ---------- Révision de la semaine (dimanche et lundi) ----------
function semaineCle(d) { const x = new Date(d); x.setHours(0, 0, 0, 0); const j = (x.getDay() + 6) % 7; x.setDate(x.getDate() - j); return x.toISOString().slice(0, 10); } // lundi de la semaine
function hebdoDispo() { const j = new Date().getDay(); return j === 0 || j === 1; }
function hebdoSemaine() { const d = new Date(); if (d.getDay() === 1) d.setDate(d.getDate() - 1); return semaineCle(d); } // le lundi, on révise la semaine qui vient de finir
function hebdoPool() {
  const fin = new Date(hebdoSemaine()); fin.setDate(fin.getDate() + 8); const debut = new Date(hebdoSemaine()).getTime();
  const vues = Object.entries(E.vues || {}).filter(([c, v]) => v.t >= debut && v.t < fin.getTime() && resoudre(c));
  const poids = ([c, v]) => (E.erreurs && E.erreurs[c] ? 0 : v.rate ? 1 : 2);
  return melange(vues).sort((a, b) => poids(a) - poids(b)).map(([c]) => c);
}
function revisionSemaine() {
  const pool = hebdoPool().slice(0, 20);
  vider();
  if (pool.length < 5) { ajoute('<div class="carte">Pas assez de questions travaillées cette semaine pour une révision. Fais quelques modules, et reviens dimanche 💪</div>'); return bouton("← Retour", accueil, "sec"); }
  ajoute(`<h2>📅 Révision de la semaine</h2><div class="carte petit">${pool.length} questions des modules travaillés cette semaine, en commençant par celles que tu as ratées.</div>`);
  bouton("Commencer", () => serie("Révision de la semaine", pool.map(resoudre), (s, t, r) => {
    E.hebdo = E.hebdo || {}; const cle = hebdoSemaine(); E.hebdo[cle] = Math.round(100 * s / t); sauver();
    const prec = Object.keys(E.hebdo).filter(k => k < cle).sort().pop();
    const diff = prec != null ? E.hebdo[cle] - E.hebdo[prec] : null;
    vider();
    ajoute(`<div class="carte"><h2>Bilan de la semaine</h2><p><b>Score : ${s} / ${t} (${E.hebdo[cle]} %)</b></p><p>${diff == null ? "C'est ta première révision de la semaine : elle servira de point de comparaison." : diff > 0 ? "📈 +" + diff + " points par rapport à la semaine d'avant." : diff < 0 ? "📉 " + diff + " points par rapport à la semaine d'avant. Pas grave : refais tes erreurs." : "Même score que la semaine d'avant."}</p><p>Erreurs qui restent : <b>${toutesErreurs().length}</b></p><p>Progression totale : <b>${pourcentage()} %</b></p></div>`);
    if (r.length) bouton("❗ Refaire mes erreurs (" + r.length + ")", () => refaireErreurs(r, accueil));
    bouton("Retour à l'accueil", accueil, "sec");
  }));
  bouton("← Retour", accueil, "sec");
}

// ---------- Test de niveau ----------
function testNiveau() {
  const qs = POSITIONNEMENT.map((q, k) => ({ q: [q[0], q[1], q[2], "Niveau " + q[3]], cle: "pos:" + k, niv: q[3] }));
  let res = { A2: 0, B1: 0, B2: 0 }, i = 0;
  (function pose() {
    vider();
    if (i >= qs.length) {
      let dep = "a2"; if (res.A2 >= 4 && res.B1 >= 4) dep = "b2"; else if (res.A2 >= 4) dep = "b1";
      E.depart = dep;
      const k = NIVEAUX.findIndex(n => n.id === dep);
      NIVEAUX.slice(0, k).forEach(n => n.modules.forEach(m => { if (!E.modules[m.id]) E.modules[m.id] = { dispense: true }; }));
      sauver();
      ajoute(`<div class="carte"><h2>Ton point de départ : ${NIVEAUX[k].nom}</h2><p>A2 : ${res.A2}/5 · B1 : ${res.B1}/5 · B2 : ${res.B2}/5</p><p>${k > 0 ? "Les niveaux d'avant sont comptés comme acquis. Tu peux quand même les ouvrir pour réviser." : "On commence par les bases : c'est le chemin le plus sûr vers le B2."}</p><p>Ta progression : <b>${pourcentage()} %</b>.</p></div>`);
      return bouton("Voir mon parcours", accueil);
    }
    const q = qs[i];
    ajoute(`<p class="petit">Test de niveau · ${i + 1} / ${qs.length}</p><div class="carte"><b>${esc(q.q[0])}</b></div>`);
    melange(q.q[1].map((c, n) => n)).forEach(n => bouton(q.q[1][n], () => { if (n === q.q[2]) res[q.niv]++; i++; pose(); }, "rep"));
    bouton("Je ne sais pas", () => { i++; pose(); }, "sec");
  })();
}

// ---------- Révisions du jour ----------
function revisions() {
  const items = melange(aReviser()).slice(0, 15).map(([cle, r]) => resoudre(cle) || { q: r.item, cle });
  if (!items.length) { vider(); ajoute('<div class="carte">Rien à réviser aujourd\'hui 👍</div>'); return bouton("Retour à l'accueil", accueil); }
  serie("Révisions", items, (s, t) => { vider(); ajoute(`<div class="carte"><h2>${s} / ${t}</h2><p>Les bonnes réponses reviennent plus tard (dans 3, 7, puis 14 jours). Les erreurs reviennent demain.</p></div>`); bouton("Retour à l'accueil", accueil); });
}

// ---------- Cartes de mots (rappel actif) ----------
function cartesMots() {
  const mots = []; tousModules().forEach(({ n, m }) => { if (niveauOuvert(NIVEAUX.indexOf(n))) (Array.isArray(m.mots) ? m.mots : []).forEach(x => { if (Array.isArray(x)) mots.push(x); }); });
  const paquet = melange(mots); let i = 0;
  (function carte() {
    vider(); if (i >= paquet.length) { ajoute('<div class="carte"><h2>Paquet terminé 🎉</h2></div>'); return bouton("Retour à l'accueil", accueil); }
    const [mot, def] = paquet[i];
    ajoute(`<p class="petit">Carte ${i + 1} / ${paquet.length}</p><div class="carte grand"><b>${esc(mot)}</b></div><p class="petit">Dis la définition à voix haute, puis retourne la carte.</p>`);
    bouton("🔊 Écouter le mot", () => dire(mot), "sec");
    const r = bouton("Retourner la carte", () => { r.remove(); ajoute(`<div class="carte">${esc(def)}</div>`); bouton("Carte suivante →", () => { i++; carte(); }); });
    bouton("← Quitter", accueil, "sec");
  })();
}

// ---------- Partage, écran d'accueil, date ----------
const LIEN = "https://rsantia96-hash.github.io/Apprendre-le-fran-ais/";
function partager() {
  const msg = "Je prépare le B2 de français (naturalisation) avec ce site gratuit : test de niveau, exercices corrigés, oral et écrit. Essaie ! " + LIEN;
  if (navigator.share) navigator.share({ title: "Apprendre le français – B2", text: msg.replace(LIEN, "").trim(), url: LIEN }).catch(() => {});
  else window.open("https://wa.me/?text=" + encodeURIComponent(msg), "_blank");
}
function ecranAccueil() {
  vider();
  ajoute(`<h2>📲 Sur l'écran d'accueil</h2><div class="carte"><b>Sur iPhone (Safari)</b><ol><li>Touche le bouton Partager (le carré avec une flèche vers le haut).</li><li>Choisis « Sur l'écran d'accueil ».</li><li>Touche « Ajouter ».</li></ol></div><div class="carte"><b>Sur Android (Chrome)</b><ol><li>Touche les trois points en haut à droite.</li><li>Choisis « Ajouter à l'écran d'accueil ».</li></ol></div>`);
  bouton("← Retour", accueil, "sec");
}
function changerDate() {
  vider();
  ajoute(`<h2>📅 Mon objectif</h2><div class="carte"><p>Quand veux-tu passer le test ?</p></div>`);
  const i = document.createElement("input"); i.type = "month"; i.value = E.examen || EXAMEN_DEFAUT; app.appendChild(i);
  bouton("Enregistrer", () => { if (i.value) { E.examen = i.value; sauver(); } accueil(); });
  bouton("← Retour", accueil, "sec");
}

// ---------- Infos ----------
function infos() {
  vider();
  ajoute(`<h2>Le test et la méthode</h2>
<div class="carte"><b>Pour la naturalisation</b><p>Depuis le 1er janvier 2026, il faut prouver un niveau <b>B2</b> en français, à l'oral et à l'écrit (diplôme ou test). Les tests acceptés sont le <b>TCF IRN</b> et le <b>TEF IRN</b>. L'attestation doit dater de moins de 2 ans. Il faut aussi réussir un <b>examen civique</b>.</p>
<p><b>Le TCF IRN</b> dure environ 1 h 35 : compréhension orale, compréhension écrite (questions à choix multiple), expression écrite (3 tâches, 30 min) et expression orale (3 tâches, 10 min, face à un examinateur).</p>
<p class="petit">Vérifie toujours les règles à jour sur service-public.gouv.fr et le site de France Éducation international.</p></div>
<div class="carte"><b>Comment ce parcours t'aide à progresser</b><ul>
<li><b>Des tâches de la vraie vie</b> : courriers, appels, débats, comme dans le test.</li>
<li><b>Un pas au-dessus de ton niveau</b> : le test de niveau te place, puis chaque niveau monte un peu.</li>
<li><b>Une explication à chaque réponse</b>, tout de suite.</li>
<li><b>Révisions espacées</b> : tes erreurs reviennent demain, puis dans 3, 7 et 14 jours, jusqu'à ce qu'elles soient sues.</li>
<li><b>Rappel actif</b> : les cartes de mots te font chercher la réponse avant de la voir.</li>
<li><b>Shadowing</b> : répéter le modèle en même temps que la voix pour gagner en aisance.</li>
<li><b>Écrire, se faire corriger, réécrire</b> : c'est ce qui fait le plus progresser à l'écrit.</li></ul>
<p class="petit">Le bon rythme : 3 à 4 séances courtes par semaine valent mieux qu'une longue.</p></div>`);
  bouton("← Retour", accueil, "sec");
}

if (!E.debut) E.debut = Date.now(); sauver();
accueil();
