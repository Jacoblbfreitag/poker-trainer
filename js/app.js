/* Six-Max Trainer: views, quiz and hand trainer logic. */
(function () {
  "use strict";

  // ---------- helpers ----------
  const $ = (sel, el = document) => el.querySelector(sel);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const rand = (n) => Math.floor(Math.random() * n);
  const pick = (arr) => arr[rand(arr.length)];

  const store = {
    get(key, dflt) {
      try { const v = localStorage.getItem("smt:" + key); return v == null ? dflt : JSON.parse(v); }
      catch (e) { return dflt; }
    },
    set(key, val) {
      try { localStorage.setItem("smt:" + key, JSON.stringify(val)); } catch (e) { /* storage blocked */ }
    },
  };

  const SUITS = { s: "♠", h: "♥", d: "♦", c: "♣" };
  const SUIT_NAMES = { s: "spades", h: "hearts", d: "diamonds", c: "clubs" };

  function cardHTML(c, cls = "") {
    const r = c[0] === "T" ? "10" : c[0];
    const s = c[1];
    return `<span class="pcard suit-${s} ${cls}" aria-label="${r} of ${SUIT_NAMES[s]}"><span class="pcard-r">${r}</span><span class="pcard-s">${SUITS[s]}</span></span>`;
  }

  function seatsHTML(hero, villain) {
    return `<div class="seats" aria-label="Table positions">` +
      POSITIONS.map((p) => {
        const cls = p === hero ? "seat is-hero" : p === villain ? "seat is-villain" : "seat";
        const tag = p === hero ? "You" : p === villain ? "Villain" : "";
        return `<span class="${cls}"><b>${p}</b>${tag ? `<i>${tag}</i>` : ""}</span>`;
      }).join("") + `</div>`;
  }

  function fmtBB(x) { return (Math.round(x * 10) / 10).toString().replace(/\.0$/, "") + "bb"; }

  // ---------- range grid ----------
  function gridHTML(spot, opts = {}) {
    const m = spotMap(spot);
    let html = opts.small
      ? `<div class="grid grid-small" aria-hidden="true">`
      : `<div class="grid" role="group" aria-label="${esc(spot.label)} range chart">`;
    for (let r = 0; r < 13; r++) {
      for (let c = 0; c < 13; c++) {
        const h = gridHand(r, c);
        const act = m[h] || "fold";
        const hl = opts.highlight === h ? " is-hl" : "";
        const sel = opts.selected === h ? " is-sel" : "";
        const tagName = opts.small ? "span" : "button";
        const attrs = opts.small ? "" : ` type="button" data-hand="${h}" aria-label="${h}: ${ACTION_LABEL[act]}"`;
        html += `<${tagName} class="cell a-${act}${hl}${sel}"${attrs}>${h}</${tagName}>`;
      }
    }
    return html + `</div>`;
  }

  function legendHTML(spot) {
    const st = spotStats(spot);
    const rows = [];
    if (spot.group === "open") rows.push(["raise", "Raise", st.raise]);
    else {
      rows.push(["3bet", "3-bet", st["3bet"]]);
      if (st.call > 0) rows.push(["call", "Call", st.call]);
    }
    const total = Math.round((st.raise + st.call + st["3bet"]) * 10) / 10;
    return `<div class="legend">` +
      rows.map(([k, l, v]) => `<span class="key"><span class="swatch a-${k}"></span>${l} <b class="num">${v}%</b></span>`).join("") +
      `<span class="key"><span class="swatch a-fold"></span>Fold <b class="num">${Math.round((100 - total) * 10) / 10}%</b></span>` +
      `</div>`;
  }

  // ---------- views ----------
  const view = $("#view");
  const state = {
    spotId: store.get("spot", "btn-rfi"),
    selHand: null,
    quiz: null,
    lesson: null,
    play: null,
    // Score for this visit only; per-spot accuracy is what gets saved.
    session: { c: 0, t: 0, streak: 0, best: 0 },
  };

  // After a re-render, put keyboard focus back somewhere sensible.
  function refocus(selector) {
    const el = $(selector);
    if (!el) return;
    if (!el.matches("button, a, [tabindex]")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  }

  // ===== Ranges =====
  function renderRanges() {
    const spot = SPOTS.find((s) => s.id === state.spotId) || SPOTS[3];
    const chips = (group) => SPOTS.filter((s) => s.group === group)
      .map((s) => `<button type="button" class="chip${s.id === spot.id ? " is-on" : ""}" data-spot="${s.id}">${s.label}</button>`).join("");
    let detail = `<p class="hint">Tap any hand in the chart to see what to do with it.</p>`;
    if (state.selHand) {
      const act = actionFor(spot, state.selHand);
      detail = `<div class="detail">
        <div class="detail-head"><span class="hand-big">${state.selHand}</span><span class="pill a-${act}">${ACTION_LABEL[act]}</span></div>
        <p>${esc(familyNote(spot, state.selHand))}</p>
        <p class="muted">${combos(state.selHand)} combos (${state.selHand.length === 2 ? "pair" : state.selHand[2] === "s" ? "suited" : "offsuit"}).</p>
      </div>`;
    }
    view.innerHTML = `
      <section class="stack">
        <header class="view-head">
          <p class="eyebrow">6-max · 100bb · cash</p>
          <h1>Preflop ranges</h1>
        </header>
        <div class="chip-group"><span class="chip-label">First in (open)</span><div class="chips">${chips("open")}</div></div>
        <div class="chip-group"><span class="chip-label">Facing a raise</span><div class="chips">${chips("facing")}</div></div>
        ${seatsHTML(spot.hero, spot.villain)}
        <p class="situation">${esc(spot.situation)}</p>
        ${legendHTML(spot)}
        <div class="grid-wrap">${gridHTML(spot, { selected: state.selHand })}</div>
        <p class="grid-key muted">Pairs on the diagonal · suited above it · offsuit below it</p>
        ${detail}
        <div class="note"><h2>Why this range</h2><p>${esc(spot.note)}</p></div>
      </section>`;
  }

  view.addEventListener("click", (e) => {
    const t = e.target.closest("[data-spot],[data-hand]");
    if (!t || !view.contains(t)) return;
    if (t.dataset.spot) {
      state.spotId = t.dataset.spot; state.selHand = null; store.set("spot", state.spotId); renderRanges();
      refocus(`[data-spot="${state.spotId}"]`);
    } else if (t.dataset.hand) {
      state.selHand = t.dataset.hand; renderRanges();
      refocus(`[data-hand="${state.selHand}"]`);
      const d = $(".detail"); if (d) d.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  });

  // ===== Quiz =====
  function dealClass(hand) {
    const suits = ["s", "h", "d", "c"];
    const a = hand[0], b = hand[1];
    if (hand[2] === "s") { const s = pick(suits); return [a + s, b + s]; }
    // pairs and offsuit hands: two different suits
    const s1 = pick(suits); const s2 = pick(suits.filter((x) => x !== s1));
    return [a + s1, b + s2];
  }

  // Pick hands near the edge of a range half the time, so the quiz isn't all easy folds.
  const _edge = {};
  function edgeHands(spot) {
    if (_edge[spot.id]) return _edge[spot.id];
    const out = (_edge[spot.id] = []);
    for (let r = 0; r < 13; r++) for (let c = 0; c < 13; c++) {
      const h = gridHand(r, c), a = actionFor(spot, h);
      const nb = [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].filter(([x, y]) => x >= 0 && y >= 0 && x < 13 && y < 13);
      if (nb.some(([x, y]) => actionFor(spot, gridHand(x, y)) !== a)) out.push(h);
    }
    return out;
  }

  function randomClass() {
    // Weighted by real combos: deal two random cards.
    const ranks = RANKS.split("");
    const deck = [];
    for (const r of ranks) for (const s of "shdc") deck.push(r + s);
    const c1 = deck.splice(rand(deck.length), 1)[0];
    const c2 = deck[rand(deck.length)];
    const [hi, lo] = rIdx(c1[0]) <= rIdx(c2[0]) ? [c1, c2] : [c2, c1];
    const name = hi[0] === lo[0] ? hi[0] + lo[0] : hi[0] + lo[0] + (hi[1] === lo[1] ? "s" : "o");
    return { name, cards: [hi, lo] };
  }

  function newQuestion() {
    const spot = pick(SPOTS);
    let name, cards;
    if (Math.random() < 0.55) {
      name = pick(edgeHands(spot)); cards = dealClass(name);
    } else {
      const d = randomClass(); name = d.name; cards = d.cards;
    }
    state.quiz = { spot, name, cards, answer: actionFor(spot, name), picked: null };
  }

  function actionButtonLabel(spot, a) {
    if (a === "raise") return spot.hero === "SB" ? "Raise 3bb" : "Raise 2.5bb";
    if (a === "3bet") return spot.hero === "BB" || spot.hero === "SB" ? "3-bet 11bb" : "3-bet 7.5bb";
    if (a === "call") return "Call";
    return "Fold";
  }

  function renderQuiz() {
    if (!state.quiz) newQuestion();
    const q = state.quiz;
    const stats = store.get("quizStats", {});
    const session = state.session;
    const answered = q.picked != null;
    const right = answered && q.picked === q.answer;

    const buttons = q.spot.actions.map((a) => {
      let cls = "act-btn a-" + a;
      if (answered) {
        if (a === q.answer) cls += " is-answer";
        else if (a === q.picked) cls += " is-wrong";
      }
      return `<button type="button" class="${cls}" data-quiz="${a}" ${answered ? "disabled" : ""}>${actionButtonLabel(q.spot, a)}</button>`;
    }).join("");

    const feedback = answered ? `
      <div class="feedback ${right ? "is-right" : "is-miss"}" role="status" tabindex="-1">
        <p class="fb-title">${right ? "Correct" : "Not quite"}: <b>${ACTION_LABEL[q.answer]}</b> ${q.name}</p>
        <p>${esc(familyNote(q.spot, q.name))}</p>
        <p class="muted">${esc(q.spot.note)}</p>
        <div class="mini">${gridHTML(q.spot, { small: true, highlight: q.name })}</div>
        <button type="button" class="primary" data-quiz="next">Next hand</button>
      </div>` : "";

    const statRows = SPOTS.filter((s) => stats[s.id]).map((s) => {
      const st = stats[s.id]; const pct = Math.round((st.c / st.t) * 100);
      return `<li><span>${s.label}</span><span class="bar"><span style="width:${pct}%"></span></span><span class="num">${pct}% <span class="muted">(${st.t})</span></span></li>`;
    }).join("");

    view.innerHTML = `
      <section class="stack">
        <header class="view-head">
          <p class="eyebrow">Preflop quiz</p>
          <h1>What's your play?</h1>
        </header>
        <div class="scoreline">
          <span>This session <b class="num">${session.c}/${session.t}</b></span>
          <span>Streak <b class="num">${session.streak}</b></span>
          <span>Best <b class="num">${session.best}</b></span>
        </div>
        <div class="table-felt">
          ${seatsHTML(q.spot.hero, q.spot.villain)}
          <p class="situation on-felt">${esc(q.spot.situation)}</p>
          <div class="hole">${q.cards.map((c) => cardHTML(c, "lg")).join("")}</div>
          <p class="hand-name">${q.name} · ${q.spot.hero}</p>
        </div>
        <div class="act-row">${buttons}</div>
        ${feedback}
        ${statRows ? `<div class="note"><h2>Your accuracy by spot</h2><ul class="statlist">${statRows}</ul>
          <button type="button" class="link" data-quiz="reset">Reset stats</button></div>` : ""}
      </section>`;
  }

  view.addEventListener("click", (e) => {
    const t = e.target.closest("[data-quiz]");
    if (!t) return;
    const v = t.dataset.quiz;
    if (v === "next") { newQuestion(); renderQuiz(); refocus(".act-btn"); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    if (v === "reset") { store.set("quizStats", {}); state.session = { c: 0, t: 0, streak: 0, best: 0 }; renderQuiz(); return; }
    const q = state.quiz;
    if (!q || q.picked != null) return;
    q.picked = v;
    const ok = v === q.answer;
    const stats = store.get("quizStats", {});
    const st = stats[q.spot.id] || { c: 0, t: 0 };
    st.t++; if (ok) st.c++;
    stats[q.spot.id] = st; store.set("quizStats", stats);
    const ses = state.session;
    ses.t++; if (ok) { ses.c++; ses.streak++; ses.best = Math.max(ses.best, ses.streak); } else ses.streak = 0;
    renderQuiz();
    refocus(".feedback");
    const fb = $(".feedback"); if (fb) fb.scrollIntoView({ block: "nearest", behavior: "smooth" });
  });

  // ===== Lessons =====
  function renderLessons() {
    const done = store.get("lessonsDone", {});
    if (!state.lesson) {
      const tags = [...new Set(LESSONS.map((l) => l.tag))];
      const doneCount = LESSONS.filter((l) => done[l.id]).length;
      view.innerHTML = `
        <section class="stack">
          <header class="view-head">
            <p class="eyebrow">${doneCount} of ${LESSONS.length} completed</p>
            <h1>Lessons</h1>
          </header>
          ${tags.map((tag) => `
            <div class="lesson-group">
              <h2 class="group-title">${tag}</h2>
              <ul class="lesson-list">
                ${LESSONS.filter((l) => l.tag === tag).map((l) => `
                  <li><button type="button" class="lesson-item" data-lesson="${l.id}">
                    <span class="li-title">${esc(l.title)}</span>
                    <span class="li-meta">${done[l.id] ? '<span class="done">Done</span>' : `${l.quiz.length} question${l.quiz.length > 1 ? "s" : ""}`}</span>
                  </button></li>`).join("")}
              </ul>
            </div>`).join("")}
        </section>`;
      return;
    }
    const l = LESSONS.find((x) => x.id === state.lesson.id);
    const ans = state.lesson.answers;
    const idx = LESSONS.indexOf(l);
    const nextL = LESSONS[idx + 1];
    view.innerHTML = `
      <section class="stack lesson">
        <button type="button" class="back" data-lesson="__back">← All lessons</button>
        <header class="view-head">
          <p class="eyebrow">${l.tag}</p>
          <h1>${esc(l.title)}</h1>
        </header>
        <div class="prose">${l.body.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
        <div class="note"><h2>Remember</h2><ul class="points">${l.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div>
        <h2 class="group-title">Check yourself</h2>
        ${l.quiz.map((q, qi) => {
          const a = ans[qi];
          return `<div class="lq">
            <p class="lq-q">${esc(q.q)}</p>
            <div class="lq-opts">${q.options.map((o, oi) => {
              let cls = "opt";
              if (a != null) { if (oi === q.answer) cls += " is-answer"; else if (oi === a) cls += " is-wrong"; }
              return `<button type="button" class="${cls}" data-lq="${qi}:${oi}" ${a != null ? "disabled" : ""}>${esc(o)}</button>`;
            }).join("")}</div>
            ${a != null ? `<p class="lq-why ${a === q.answer ? "ok" : "bad"}">${a === q.answer ? "Correct. " : "Not quite. "}${esc(q.why)}</p>` : ""}
          </div>`;
        }).join("")}
        ${nextL ? `<button type="button" class="primary" data-lesson="${nextL.id}">Next: ${esc(nextL.title)}</button>` : `<button type="button" class="primary" data-lesson="__back">Back to all lessons</button>`}
      </section>`;
  }

  view.addEventListener("click", (e) => {
    const t = e.target.closest("[data-lesson],[data-lq]");
    if (!t) return;
    if (t.dataset.lesson) {
      state.lesson = t.dataset.lesson === "__back" ? null : { id: t.dataset.lesson, answers: {} };
      renderLessons(); window.scrollTo({ top: 0 }); return;
    }
    const [qi, oi] = t.dataset.lq.split(":").map(Number);
    state.lesson.answers[qi] = oi;
    const l = LESSONS.find((x) => x.id === state.lesson.id);
    // A lesson counts as done once every check question is answered correctly.
    if (l.quiz.every((q, i) => state.lesson.answers[i] === q.answer)) {
      const done = store.get("lessonsDone", {}); done[l.id] = true; store.set("lessonsDone", done);
    }
    renderLessons();
    const why = view.querySelectorAll(".lq")[qi]?.querySelector(".lq-why");
    if (why) { why.setAttribute("tabindex", "-1"); why.focus({ preventScroll: true }); }
  });

  // ===== Hand trainer =====
  function renderHands() {
    const best = store.get("handBest", {});
    if (!state.play) {
      view.innerHTML = `
        <section class="stack">
          <header class="view-head">
            <p class="eyebrow">${HANDS.length} hands · flop to river</p>
            <h1>Hand trainer</h1>
          </header>
          <p class="lead">Play real spots street by street. Pick an action and see why it works or doesn't.</p>
          <ul class="hand-list">
            ${HANDS.map((h) => {
              const b = best[h.id];
              return `<li><button type="button" class="hand-item" data-hplay="${h.id}">
                <span class="hi-cards">${h.cards.map((c) => cardHTML(c, "sm")).join("")}</span>
                <span class="hi-text"><span class="li-title">${esc(h.title)}</span><span class="muted">${h.hero} vs ${h.villain} · ${esc(h.focus)}</span></span>
                <span class="hi-score num">${b != null ? b + "%" : ""}</span>
              </button></li>`;
            }).join("")}
          </ul>
        </section>`;
      return;
    }
    const p = state.play;
    const h = HANDS.find((x) => x.id === p.id);
    if (p.step >= h.steps.length) {
      const total = p.scores.reduce((a, b) => a + b, 0);
      const pct = Math.round((total / (h.steps.length * 2)) * 100);
      const prev = best[h.id];
      if (prev == null || pct > prev) { best[h.id] = pct; store.set("handBest", best); }
      const idx = HANDS.indexOf(h); const nextH = HANDS[idx + 1];
      view.innerHTML = `
        <section class="stack">
          <button type="button" class="back" data-hplay="__back">← All hands</button>
          <header class="view-head"><p class="eyebrow">Hand complete</p><h1>${esc(h.title)}</h1></header>
          <div class="result">
            <span class="result-num num">${pct}%</span>
            <span>${p.scores.filter((s) => s === 2).length} of ${h.steps.length} best decisions</span>
          </div>
          <p class="lead">${esc(h.steps[h.steps.length - 1].after)}</p>
          <ol class="recap">${h.steps.map((st, i) => `<li><span class="muted">${st.street}</span> ${esc(st.options[p.picks[i]].label)} <span class="grade g${p.scores[i]}">${["Mistake", "OK", "Best"][p.scores[i]]}</span></li>`).join("")}</ol>
          <div class="btn-row">
            <button type="button" class="ghost" data-hplay="${h.id}">Play again</button>
            ${nextH ? `<button type="button" class="primary" data-hplay="${nextH.id}">Next hand</button>` : `<button type="button" class="primary" data-hplay="__back">All hands</button>`}
          </div>
        </section>`;
      return;
    }
    const st = h.steps[p.step];
    const picked = p.picked;
    const board = [0, 1, 2, 3, 4].map((i) => st.board[i] ? cardHTML(st.board[i]) : `<span class="pcard empty" aria-hidden="true"></span>`).join("");
    const bestOpt = st.options.reduce((bi, o, i, arr) => (o.s > arr[bi].s ? i : bi), 0);
    const opts = st.options.map((o, i) => {
      let cls = "opt";
      if (picked != null) { if (o.s === st.options[bestOpt].s) cls += " is-answer"; else if (i === picked) cls += " is-wrong"; }
      return `<button type="button" class="${cls}" data-hopt="${i}" ${picked != null ? "disabled" : ""}>${esc(o.label)}</button>`;
    }).join("");
    let fb = "";
    if (picked != null) {
      const o = st.options[picked];
      const grade = ["Mistake", "OK, not best", "Best play"][o.s];
      fb = `<div class="feedback g-${o.s}" role="status" tabindex="-1">
        <p class="fb-title">${grade}</p>
        <p>${esc(o.fb)}</p>
        ${o.s < 2 ? `<p class="muted"><b>Best: ${esc(st.options[bestOpt].label)}.</b> ${esc(st.options[bestOpt].fb)}</p>` : ""}
        ${p.step < h.steps.length - 1 ? `<p class="after">${esc(st.after)}</p>` : ""}
        <button type="button" class="primary" data-hnext="1">${p.step < h.steps.length - 1 ? "Continue" : "See result"}</button>
      </div>`;
    }
    view.innerHTML = `
      <section class="stack">
        <button type="button" class="back" data-hplay="__back">← All hands</button>
        <header class="view-head">
          <p class="eyebrow">Hand ${HANDS.indexOf(h) + 1} · ${esc(h.focus)}</p>
          <h1>${esc(h.title)}</h1>
        </header>
        ${p.step === 0 ? `<p class="lead">${esc(h.intro)}</p>` : ""}
        <div class="table-felt">
          ${seatsHTML(h.hero, h.villain)}
          <div class="street-row"><span class="street">${st.street}</span><span class="pot">Pot <b class="num">${fmtBB(st.pot)}</b></span><span class="pot">Stack <b class="num">${fmtBB(st.stack)}</b></span></div>
          <div class="board">${board}</div>
          <div class="hole">${h.cards.map((c) => cardHTML(c, "lg")).join("")}</div>
        </div>
        <p class="prompt">${esc(st.prompt)}</p>
        <div class="opt-col">${opts}</div>
        ${fb}
        <div class="progress" aria-label="Decision ${p.step + 1} of ${h.steps.length}">${h.steps.map((_, i) => `<span class="${i < p.step ? "done" : i === p.step ? "now" : ""}"></span>`).join("")}</div>
      </section>`;
  }

  view.addEventListener("click", (e) => {
    const t = e.target.closest("[data-hplay],[data-hopt],[data-hnext]");
    if (!t) return;
    if (t.dataset.hplay) {
      state.play = t.dataset.hplay === "__back" ? null : { id: t.dataset.hplay, step: 0, picked: null, picks: [], scores: [] };
      renderHands(); window.scrollTo({ top: 0 }); return;
    }
    const p = state.play; if (!p) return;
    const h = HANDS.find((x) => x.id === p.id);
    if (t.dataset.hopt != null && p.picked == null) {
      p.picked = Number(t.dataset.hopt);
      p.picks.push(p.picked);
      p.scores.push(h.steps[p.step].options[p.picked].s);
      renderHands();
      refocus(".feedback");
      const fb = $(".feedback"); if (fb) fb.scrollIntoView({ block: "nearest", behavior: "smooth" });
      return;
    }
    if (t.dataset.hnext) {
      p.step++; p.picked = null; renderHands(); refocus(".opt, .primary"); window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  // ---------- routing ----------
  const ROUTES = { ranges: renderRanges, quiz: renderQuiz, lessons: renderLessons, hands: renderHands };
  function route() {
    let name = location.hash.replace("#", "");
    if (!ROUTES[name]) name = "ranges";
    document.querySelectorAll(".tab").forEach((a) => {
      if (a.dataset.tab === name) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    ROUTES[name]();
    window.scrollTo({ top: 0 });
  }
  // Tapping the active tab again returns to that tab's start screen.
  document.querySelectorAll(".tab").forEach((a) => a.addEventListener("click", () => {
    if (location.hash === "#" + a.dataset.tab) {
      if (a.dataset.tab === "lessons") state.lesson = null;
      if (a.dataset.tab === "hands") state.play = null;
      route();
    }
  }));
  window.addEventListener("hashchange", route);
  route();
})();
