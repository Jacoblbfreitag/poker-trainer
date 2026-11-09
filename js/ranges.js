// Preflop ranges for 6-max No-Limit Hold'em cash, 100bb deep.
// Simplified, beginner-friendly versions of standard charts.
// Hands use the usual notation: "77+" (77 up to AA), "A2s+" (A2s..AKs),
// "K9s+" (K9s..KQs), "A5s-A2s" (A5s, A4s, A3s, A2s), single hands like "T9s".

const RANKS = "AKQJT98765432";
const POSITIONS = ["UTG", "HJ", "CO", "BTN", "SB", "BB"];

function rIdx(r) { return RANKS.indexOf(r); }

function handName(hi, lo, kind) {
  if (hi === lo) return hi + lo;
  return hi + lo + kind;
}

// Expand one token into a list of hand names.
function expandToken(tok) {
  tok = tok.trim();
  if (!tok) return [];
  const out = [];
  // Dash range: "A5s-A2s" or "22-99"
  if (tok.includes("-")) {
    const [a, b] = tok.split("-");
    if (a[0] === a[1]) { // pairs
      let i1 = rIdx(a[0]), i2 = rIdx(b[0]);
      const [s, e] = i1 < i2 ? [i1, i2] : [i2, i1];
      for (let i = s; i <= e; i++) out.push(RANKS[i] + RANKS[i]);
      return out;
    }
    const hi = a[0], kind = a[2];
    let k1 = rIdx(a[1]), k2 = rIdx(b[1]);
    const [s, e] = k1 < k2 ? [k1, k2] : [k2, k1];
    for (let k = s; k <= e; k++) out.push(handName(hi, RANKS[k], kind));
    return out;
  }
  const plus = tok.endsWith("+");
  const t = plus ? tok.slice(0, -1) : tok;
  if (t[0] === t[1]) { // pair
    if (!plus) return [t];
    for (let i = rIdx(t[0]); i >= 0; i--) out.push(RANKS[i] + RANKS[i]);
    return out;
  }
  const hi = t[0], lo = t[1], kind = t[2];
  if (!plus) return [t];
  // kicker from lo up to the rank just below hi
  for (let k = rIdx(lo); k > rIdx(hi); k--) out.push(handName(hi, RANKS[k], kind));
  return out;
}

function expand(list) {
  return list.split(",").flatMap(expandToken);
}

// Every spot: layers are applied in order, later layers override earlier ones.
// Anything not listed is a fold.
const SPOTS = [
  {
    id: "utg-rfi", group: "open", hero: "UTG", villain: null,
    label: "UTG open",
    situation: "Folded to you. You are first to act (UTG).",
    actions: ["fold", "raise"],
    layers: [["raise", "55+, A2s+, K9s+, QTs+, JTs, T9s, 98s, ATo+, KQo"]],
    note: "Five players still act after you, so open only strong hands. Small pairs, weak offsuit aces and offsuit broadways like KJo get dominated too often.",
  },
  {
    id: "hj-rfi", group: "open", hero: "HJ", villain: null,
    label: "HJ open",
    situation: "UTG folds. You are in the Hijack (HJ).",
    actions: ["fold", "raise"],
    layers: [["raise", "44+, A2s+, K8s+, Q9s+, J9s+, T9s, 98s, 87s, 76s, ATo+, KJo+, QJo"]],
    note: "One player fewer behind you than UTG. Add a few suited connectors and KJo/QJo.",
  },
  {
    id: "co-rfi", group: "open", hero: "CO", villain: null,
    label: "CO open",
    situation: "Folded to you in the Cutoff (CO).",
    actions: ["fold", "raise"],
    layers: [["raise", "22+, A2s+, K5s+, Q8s+, J8s+, T8s+, 97s+, 87s, 76s, 65s, 54s, A8o+, KTo+, QTo+, JTo"]],
    note: "Only the Button and blinds are left. All pairs and almost every suited ace can open.",
  },
  {
    id: "btn-rfi", group: "open", hero: "BTN", villain: null,
    label: "BTN open",
    situation: "Folded to you on the Button (BTN).",
    actions: ["fold", "raise"],
    layers: [["raise", "22+, A2s+, K2s+, Q4s+, J6s+, T6s+, 96s+, 85s+, 75s+, 64s+, 54s, 53s, A2o+, K8o+, Q9o+, J9o+, T8o+, 98o"]],
    note: "The best seat: you act last after the flop on every street. Open wide, close to half of all hands.",
  },
  {
    id: "sb-rfi", group: "open", hero: "SB", villain: null,
    label: "SB open",
    situation: "Folded to you in the Small Blind (SB). Only the BB is left.",
    actions: ["fold", "raise"],
    layers: [["raise", "22+, A2s+, K2s+, Q5s+, J7s+, T7s+, 97s+, 86s+, 75s+, 65s, 54s, A4o+, K9o+, Q9o+, J9o+, T9o"]],
    note: "Raise or fold, never limp. Raise a bit bigger (3bb) because you will be out of position after the flop.",
  },
  {
    id: "bb-vs-btn", group: "facing", hero: "BB", villain: "BTN",
    label: "BB vs BTN",
    situation: "BTN opens to 2.5bb, SB folds. You are in the Big Blind.",
    actions: ["fold", "call", "3bet"],
    layers: [
      ["call", "22-99, A2s-ATs, K2s-KJs, Q5s+, J6s+, T6s+, 96s+, 85s+, 74s+, 63s+, 53s+, 43s, A2o-AJo, K7o-KQo, Q8o+, J8o+, T8o+, 98o, 87o"],
      ["3bet", "TT+, AJs+, KQs, A5s-A4s, AQo+"],
    ],
    note: "You already have 1bb in the pot and close the action, so you get a great price. Defend very wide. 3-bet strong hands for value plus A5s/A4s as bluffs: they block aces and can make straights.",
  },
  {
    id: "bb-vs-utg", group: "facing", hero: "BB", villain: "UTG",
    label: "BB vs UTG",
    situation: "UTG opens to 2.5bb, everyone folds to you in the Big Blind.",
    actions: ["fold", "call", "3bet"],
    layers: [
      ["call", "22-JJ, A2s-AQs, K9s-KQs, Q9s+, J9s+, T8s+, 97s+, 86s+, 75s+, 65s, 54s, AJo-AQo, KQo"],
      ["3bet", "QQ+, AKs, AKo, A5s"],
    ],
    note: "UTG's range is strong, so defend much tighter than against the Button. Offsuit hands like KJo and ATo are dominated by UTG's range.",
  },
  {
    id: "btn-vs-co", group: "facing", hero: "BTN", villain: "CO",
    label: "BTN vs CO",
    situation: "CO opens to 2.5bb. You are on the Button.",
    actions: ["fold", "call", "3bet"],
    layers: [
      ["call", "22-TT, A9s-AJs, KTs-KQs, QTs+, J9s+, T9s, 98s, 87s, 76s, AJo-AQo, KQo"],
      ["3bet", "JJ+, AQs+, AKo, A5s-A4s, K9s, 65s"],
    ],
    note: "You will have position for the whole hand, so calling is fine. 3-bet to about 7.5bb (3x the open).",
  },
  {
    id: "btn-vs-utg", group: "facing", hero: "BTN", villain: "UTG",
    label: "BTN vs UTG",
    situation: "UTG opens to 2.5bb, HJ and CO fold. You are on the Button.",
    actions: ["fold", "call", "3bet"],
    layers: [
      ["call", "22-JJ, ATs-AQs, KTs-KQs, QTs+, JTs, T9s, 98s, AQo"],
      ["3bet", "QQ+, AKs, AKo, A5s"],
    ],
    note: "UTG is strong. Hands like KJo, AJo and QJo look good but lose a lot of money against AK, AQ and KQ.",
  },
  {
    id: "sb-vs-btn", group: "facing", hero: "SB", villain: "BTN",
    label: "SB vs BTN",
    situation: "BTN opens to 2.5bb. You are in the Small Blind.",
    actions: ["fold", "call", "3bet"],
    layers: [
      ["3bet", "77+, A8s+, A5s-A3s, KTs+, QTs+, JTs, T9s, 98s, AJo+, KQo"],
    ],
    note: "From the SB you play 3-bet or fold. If you just call, the BB can squeeze and you play out of position. 3-bet to about 11bb.",
  },
];

// Build a hand -> action map for a spot (cached).
const _cache = {};
function spotMap(spot) {
  if (_cache[spot.id]) return _cache[spot.id];
  const m = {};
  for (const [act, list] of spot.layers) for (const h of expand(list)) m[h] = act;
  _cache[spot.id] = m;
  return m;
}

function actionFor(spot, hand) { return spotMap(spot)[hand] || "fold"; }

function combos(hand) {
  if (hand.length === 2) return 6;
  return hand[2] === "s" ? 4 : 12;
}

// % of all 1326 starting combos for each action.
function spotStats(spot) {
  const m = spotMap(spot);
  const s = { raise: 0, call: 0, "3bet": 0 };
  for (const h in m) s[m[h]] += combos(h);
  for (const k in s) s[k] = Math.round((s[k] / 1326) * 1000) / 10;
  return s;
}

// Grid position -> hand name. Row = first rank, col = second rank.
// Upper-right (col > row) suited, lower-left offsuit, diagonal pairs.
function gridHand(row, col) {
  if (row === col) return RANKS[row] + RANKS[col];
  if (col > row) return RANKS[row] + RANKS[col] + "s";
  return RANKS[col] + RANKS[row] + "o";
}

// Short explanation of where the cut-off is for this hand's family,
// e.g. "From CO, suited kings K5s+ are played".
function familyNote(spot, hand) {
  const base = familyBase(spot, hand);
  const act = actionFor(spot, hand);
  if (spot.group !== "facing" || act === "fold") return base;
  // Name the hands in this family that take the same action (3-bet vs call).
  const fam = [];
  if (hand.length === 2) {
    for (const r of RANKS) fam.push(r + r);
  } else {
    for (let k = rIdx(hand[0]) + 1; k < RANKS.length; k++) fam.push(hand[0] + RANKS[k] + hand[2]);
  }
  const same = fam.filter((h) => actionFor(spot, h) === act);
  return `${base} ${ACTION_LABEL[act]} with: ${same.join(", ")}.`;
}

function familyBase(spot, hand) {
  if (hand.length === 2) {
    const pairs = [];
    for (let i = RANKS.length - 1; i >= 0; i--) {
      const p = RANKS[i] + RANKS[i];
      if (actionFor(spot, p) !== "fold") pairs.push(p);
    }
    if (!pairs.length) return "No pairs are played here.";
    return `Pairs played here: ${pairs[0]} and up` + (pairs.length < 13 ? "." : " (all of them).");
  }
  const hi = hand[0], kind = hand[2];
  const played = [];
  for (let k = RANKS.length - 1; k > rIdx(hi); k--) {
    const h = hi + RANKS[k] + kind;
    if (actionFor(spot, h) !== "fold") played.push(h);
  }
  const fam = (kind === "s" ? "suited " : "offsuit ") + hi + "x";
  if (!played.length) return `No ${fam} hands are played here.`;
  if (played.length === 1) return `Only ${played[0]} is played from the ${fam} hands.`;
  // Is it a contiguous block up to the top kicker? Then show "K5s+".
  const topK = rIdx(hi) + 1;
  const lowK = rIdx(played[0][1]);
  if (played.length === lowK - topK + 1) {
    return `${fam} hands played here: ${played[0]} and better.`;
  }
  return `${fam} hands played here: ${played.join(", ")}.`;
}

const ACTION_LABEL = { fold: "Fold", call: "Call", raise: "Raise", "3bet": "3-bet" };
