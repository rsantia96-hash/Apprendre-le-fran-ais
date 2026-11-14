// Apprendre le français – parcours A2 → B2 (naturalisation)
// Progression gardée sur le téléphone (localStorage).
const CLE = "apf-v2";
const SEUIL = 0.7; // 70 % pour réussir un module
const BOITES = [1, 3, 7, 14, 30]; // répétition espacée (jours)

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
  const rv = aReviser();
  if (rv.length) bouton("🔁 Mes révisions du jour (" + rv.length + ")", revisions, "vert");
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
function ouvrir(m) {
  ({ qcm: moduleQcm, lecture: moduleDocs, ecoute: moduleDocs, ecrit: moduleEcrit, oral: moduleOral, blanc: moduleBlanc, "blanc-comp": moduleBlancComp })[m.type](m);
}
function enregistrer(m, ratio) {
  const s = E.modules[m.id] || {}; s.meilleur = Math.max(s.meilleur || 0, ratio); s.essais = (s.essais || 0) + 1;
  if (ratio >= SEUIL) s.ok = true; s.date = Date.now(); E.modules[m.id] = s; sauver();
}
function motsHtml(m) { return m.mots && m.mots.length ? '<div class="carte mots"><b>Mots utiles</b><ul>' + m.mots.map(([a, b]) => `<li><b>${esc(a)}</b> : ${esc(b)}</li>`).join("") + "</ul></div>" : ""; }

// ---------- Série de questions (commune) ----------
function serie(titre, qs, fin, avant) {
  let i = 0, score = 0;
  function pose() {
    vider();
    if (i >= qs.length) return fin(score, qs.length);
    const q = qs[i]; const [enonce, choix, bonne, expl] = q.q;
    ajoute(`<p class="petit">${esc(titre)} · ${i + 1} / ${qs.length}</p>`);
    if (avant) avant(q);
    ajoute(`<div class="carte"><b>${esc(enonce)}</b></div>`);
    let fini = false; const btns = {};
    melange(choix.map((c, n) => n)).forEach(n => {
      const b = bouton(choix[n], () => {
        if (fini) return; fini = true;
        if (n === bonne) { score++; b.classList.add("ok"); if (E.revisions[q.cle]) revOk(q.cle); }
        else { b.classList.add("ko"); btns[bonne].classList.add("ok"); ajouterRevision(q.cle, q.q); }
        sauver();
        ajoute(`<div class="expl">${n === bonne ? "✅ Bonne réponse. " : "❌ La bonne réponse : <b>" + esc(choix[bonne]) + "</b>. "}${esc(expl)}</div>`);
        bouton(i + 1 < qs.length ? "Question suivante →" : "Voir mon score", () => { i++; pose(); });
      }, "rep"); btns[n] = b;
    });
    bouton("← Quitter", accueil, "sec");
  }
  pose();
}
function revOk(cle) { const r = E.revisions[cle]; if (!r) return; r.boite++; if (r.boite >= BOITES.length) delete E.revisions[cle]; else r.due = Date.now() + BOITES[r.boite] * jour; }
function ecranScore(m, s, t, refaire) {
  enregistrer(m, s / t); const ok = s / t >= SEUIL;
  ajoute(`<div class="carte"><h2>${s} / ${t}</h2><p>${ok ? "Module réussi ✅ Ta progression est à <b>" + pourcentage() + " %</b>." : "Il faut " + Math.ceil(t * SEUIL) + " bonnes réponses pour valider. Tes erreurs sont ajoutées à tes révisions : tu les reverras dans quelques jours."}</p></div>`);
  bouton("Recommencer", refaire, "sec"); bouton("Retour à l'accueil", accueil);
}

// ---------- QCM avec règle ----------
function moduleQcm(m) {
  vider();
  ajoute(`<h2>${EPREUVES[m.epreuve].icone} ${esc(m.titre)}</h2>${motsHtml(m)}<div class="carte regle">${m.regle}</div>`);
  ajoute('<p class="petit">Conseil : lis la règle, cache-la, puis essaie de la redire avec tes mots avant de commencer.</p>');
  bouton("Commencer les " + m.q.length + " exercices", () => serie(m.titre, m.q.map((q, k) => ({ q, cle: m.id + ":" + k })), (s, t) => ecranScore(m, s, t, () => moduleQcm(m))));
  bouton("← Retour", accueil, "sec");
}

// ---------- Lecture / écoute ----------
function moduleDocs(m) {
  vider(); const ecoute = m.type === "ecoute";
  ajoute(`<h2>${EPREUVES[m.epreuve].icone} ${esc(m.titre)}</h2>${motsHtml(m)}<div class="carte petit">${ecoute ? "Écoute d'abord sans lire. Tu peux réécouter, puis ralentir. Le texte s'affiche à la fin de chaque document." : "Lis d'abord les questions, puis cherche les réponses dans le texte."}</div>`);
  const qs = []; m.docs.forEach((d, di) => d.q.forEach((q, k) => qs.push({ q, cle: m.id + ":" + di + ":" + k, d, di })));
  bouton("Commencer", () => {
    let dernier = -1;
    serie(m.titre, qs, (s, t) => ecranScore(m, s, t, () => moduleDocs(m)), (q) => {
      if (ecoute) {
        ajoute(`<div class="carte"><b>🎧 ${esc(q.d.titre)}</b></div>`);
        const ligne = document.createElement("div"); ligne.className = "duo"; app.appendChild(ligne);
        bouton("▶️ Écouter", () => dire(q.d.audio, 0.95), "", ligne);
        bouton("🐢 Plus lent", () => dire(q.d.audio, 0.75), "sec", ligne);
        const tr = $(`<details class="carte petit"><summary>Voir le texte (après avoir répondu)</summary>${esc(q.d.audio)}</details>`); app.appendChild(tr.firstChild);
        if (dernier !== q.di) { dernier = q.di; setTimeout(() => dire(q.d.audio, 0.95), 300); }
      } else ajoute(`<div class="carte doc"><b>${esc(q.d.titre)}</b>${q.d.texte}</div>`);
    });
  });
  bouton("← Retour", accueil, "sec");
}

// ---------- Écrit ----------
function compte(t) { return (t.trim().match(/[\wÀ-ÿ'’-]+/g) || []).length; }
function moduleEcrit(m) {
  vider();
  ajoute(`<h2>✍️ ${esc(m.titre)}</h2><div class="carte"><b>Consigne</b><p>${esc(m.consigne)}</p><p class="petit">Longueur : ${m.mots[0]} à ${m.mots[1]} mots${m.minuteur ? " · " + m.minuteur + " minutes" : ""}.</p></div>`);
  ajoute('<details class="carte"><summary><b>Phrases utiles</b></summary><ul>' + m.aide.map(a => "<li>" + esc(a) + "</li>").join("") + "</ul></details>");
  if (m.minuteur) minuteur(m.minuteur);
  const ta = document.createElement("textarea"); ta.placeholder = "Écris ton texte ici…"; ta.value = E.textes[m.id] || ""; app.appendChild(ta);
  const nb = $('<p class="petit"></p>').firstChild; app.appendChild(nb);
  const maj = () => { const c = compte(ta.value); nb.textContent = c + " mots" + (c < m.mots[0] ? " (encore " + (m.mots[0] - c) + ")" : c > m.mots[1] ? " (un peu trop long)" : " ✔"); E.textes[m.id] = ta.value; sauver(); };
  ta.oninput = maj; maj();
  bouton("📋 Copier mon texte (pour le faire corriger)", () => { navigator.clipboard && navigator.clipboard.writeText(m.consigne + "\n\n" + ta.value).then(() => alert("Texte copié. Colle-le dans un message à ton correcteur.")); }, "sec");
  bouton("Voir un modèle B2 et m'auto-évaluer", () => autoEval(m, "modele"));
  bouton("← Retour", accueil, "sec");
}
function minuteur(min) {
  const d = $(`<div class="carte minuteur"><b>⏱️ <span>${min}:00</span></b></div>`).firstChild; app.appendChild(d);
  let reste = min * 60, t = null; const sp = d.querySelector("span");
  bouton("Démarrer le minuteur", (e) => { if (t) return; e.target.textContent = "Minuteur lancé"; t = setInterval(() => { reste--; sp.textContent = Math.floor(reste / 60) + ":" + String(reste % 60).padStart(2, "0"); if (reste <= 0) { clearInterval(t); sp.textContent = "Temps écoulé !"; } }, 1000); }, "sec");
}
function autoEval(m) {
  vider();
  ajoute(`<h2>${EPREUVES[m.epreuve].icone} ${esc(m.titre)}</h2><div class="carte"><b>Modèle B2</b><p class="modele">${esc(m.modele).replace(/\n/g, "<br>")}</p></div>`);
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
    bouton("Refaire", () => ouvrir(m), "sec"); bouton("Retour à l'accueil", accueil);
  });
  bouton("← Retour", () => ouvrir(m), "sec");
}

// ---------- Oral ----------
function moduleOral(m) {
  vider();
  ajoute(`<h2>🗣️ ${esc(m.titre)}</h2><div class="carte"><b>Consigne</b><p>${esc(m.consigne)}</p></div>`);
  ajoute('<div class="carte"><b>Questions possibles de l\'examinateur</b><ul>' + m.questions.map(q => "<li>" + esc(q) + "</li>").join("") + "</ul></div>");
  const l = document.createElement("div"); l.className = "duo"; app.appendChild(l);
  bouton("🔊 Entendre les questions", () => dire(m.questions.join(". ")), "sec", l);
  ajoute('<details class="carte"><summary><b>Phrases utiles</b></summary><ul>' + m.aide.map(a => "<li>" + esc(a) + "</li>").join("") + "</ul></details>");
  ajoute('<div class="carte petit">Parle à voix haute. Le mieux : enregistre-toi avec l\'app Dictaphone (ou un vocal), réécoute-toi, puis compare avec le modèle.</div>');
  minuteur(m.minuteur || 3);
  bouton("J'ai parlé : voir le modèle et m'auto-évaluer", () => autoEval(m));
  bouton("← Retour", accueil, "sec");
}

// ---------- Examen blanc ----------
function moduleBlanc(m) {
  const pool = [];
  NIVEAUX.filter(n => m.niveaux.includes(n.id)).forEach(n => n.modules.filter(x => x.type === "qcm" && m.source.includes(x.epreuve)).forEach(x => x.q.forEach((q, k) => pool.push({ q, cle: x.id + ":" + k }))));
  vider(); ajoute(`<h2>🎯 ${esc(m.titre)}</h2><div class="carte petit">Des questions tirées au hasard dans tout le parcours. Il faut ${Math.round(SEUIL * 100)} % pour valider.</div>`);
  bouton("Commencer", () => serie(m.titre, melange(pool).slice(0, m.nb), (s, t) => ecranScore(m, s, t, () => moduleBlanc(m))));
  bouton("← Retour", accueil, "sec");
}
function moduleBlancComp(m) {
  const docs = []; NIVEAUX.forEach(n => n.id !== "a2" && n.modules.filter(x => x.type === "lecture" || x.type === "ecoute").forEach(x => x.docs.forEach((d, di) => docs.push({ x, d, di }))));
  const qs = []; melange(docs).forEach(o => o.d.q.forEach((q, k) => qs.length < m.nb + 4 && qs.push({ q, cle: o.x.id + ":" + o.di + ":" + k, d: o.d, ecoute: o.x.type === "ecoute" })));
  vider(); ajoute(`<h2>🎯 ${esc(m.titre)}</h2><div class="carte petit">Documents écrits et sonores mélangés, comme le jour du test. Écoute une seule fois si tu veux te mettre en condition.</div>`);
  bouton("Commencer", () => {
    let der = null;
    serie(m.titre, qs, (s, t) => ecranScore(m, s, t, () => moduleBlancComp(m)), (q) => {
      if (q.ecoute) { ajoute(`<div class="carte"><b>🎧 ${esc(q.d.titre)}</b></div>`); bouton("▶️ Écouter", () => dire(q.d.audio), "sec"); if (der !== q.d) { der = q.d; setTimeout(() => dire(q.d.audio), 300); } }
      else ajoute(`<div class="carte doc"><b>${esc(q.d.titre)}</b>${q.d.texte}</div>`);
    });
  });
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
  const items = melange(aReviser()).slice(0, 15).map(([cle, r]) => ({ q: r.item, cle }));
  if (!items.length) { vider(); ajoute('<div class="carte">Rien à réviser aujourd\'hui 👍</div>'); return bouton("Retour à l'accueil", accueil); }
  serie("Révisions", items, (s, t) => { vider(); ajoute(`<div class="carte"><h2>${s} / ${t}</h2><p>Les bonnes réponses reviennent plus tard (dans 3, 7, puis 14 jours). Les erreurs reviennent demain.</p></div>`); bouton("Retour à l'accueil", accueil); });
}

// ---------- Cartes de mots (rappel actif) ----------
function cartesMots() {
  const mots = []; tousModules().forEach(({ n, m }) => { if (niveauOuvert(NIVEAUX.indexOf(n))) (m.mots || []).forEach(x => mots.push(x)); });
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
