// Scripted hands for the Hand Trainer. 6-max, 100bb, blinds 0.5/1.
// Each step: street, full board so far, pot (before hero acts), hero stack,
// prompt, options [{label, s (2 best, 1 ok, 0 mistake), fb}], after (what happens next).
const HANDS = [
  {
    id: "h1", title: "Top pair on a dry board", focus: "Value betting three streets",
    hero: "BTN", villain: "BB", cards: ["As", "Kd"],
    intro: "You open the Button to 2.5bb with A♠K♦. The SB folds, the BB calls.",
    steps: [
      {
        street: "Flop", board: ["Ks", "7d", "2c"], pot: 5.5, stack: 97.5,
        prompt: "BB checks to you.",
        options: [
          { label: "Check", s: 1, fb: "Checking AK isn't terrible, but you give a free card and miss value from 7x, 2x and weaker kings." },
          { label: "Bet 33% · 1.8bb", s: 2, fb: "On a dry king-high board you have the range advantage. A small bet keeps worse kings, 7x and even A-high in, and costs little when you're behind." },
          { label: "Bet 75% · 4.1bb", s: 1, fb: "Fine for value, but it folds out the weak hands you want to keep in. The small size does the same job more cheaply." },
          { label: "All-in · 97.5bb", s: 0, fb: "Far too big. Only sets call and every worse hand folds." },
        ],
        after: "You bet 1.8bb and BB calls.",
      },
      {
        street: "Turn", board: ["Ks", "7d", "2c", "4h"], pot: 9.1, stack: 95.7,
        prompt: "BB checks again.",
        options: [
          { label: "Check", s: 1, fb: "You don't need pot control with top pair top kicker here. Checking loses a street of value." },
          { label: "Bet 50% · 4.5bb", s: 1, fb: "Reasonable, just a bit small when you have the best hand this often." },
          { label: "Bet 66% · 6bb", s: 2, fb: "BB's calling range is full of weaker kings, 7x and pocket pairs. Charge them." },
          { label: "All-in · 95.7bb", s: 0, fb: "Only better hands call an overbet this large." },
        ],
        after: "You bet 6bb and BB calls.",
      },
      {
        street: "River", board: ["Ks", "7d", "2c", "4h", "9c"], pot: 21.1, stack: 89.7,
        prompt: "BB checks a third time.",
        options: [
          { label: "Check", s: 0, fb: "Too passive. KQ, KJ, KT, K9 and many pairs call a medium bet." },
          { label: "Bet 50% · 10.5bb", s: 2, fb: "A medium size gets called by worse kings and some pairs. That's thin value done right." },
          { label: "Bet 150% · 31.6bb", s: 0, fb: "Only two pair and sets call this. You win more with a size worse hands can call." },
        ],
        after: "BB calls with K♥T♣. Your top kicker wins a 42bb pot.",
      },
    ],
  },
  {
    id: "h2", title: "Flush draw, then a river bluff", focus: "Semi-bluffs and bluffing missed draws",
    hero: "BTN", villain: "BB", cards: ["Jh", "Th"],
    intro: "You open the Button to 2.5bb with J♥T♥. BB calls.",
    steps: [
      {
        street: "Flop", board: ["9h", "5h", "2s"], pot: 5.5, stack: 97.5,
        prompt: "BB checks.",
        options: [
          { label: "Check", s: 1, fb: "Taking a free card is OK, but you give up the chance to win the pot now with a strong draw." },
          { label: "Bet 33% · 1.8bb", s: 1, fb: "Small bets suit dry boards. With draws around, this lets BB continue too cheaply." },
          { label: "Bet 66% · 3.6bb", s: 2, fb: "A flush draw plus two overcards is a great semi-bluff. You can win now, and you have lots of equity when called." },
          { label: "All-in · 97.5bb", s: 0, fb: "Way too much. You only get called by hands that are ahead or have big draws." },
        ],
        after: "You bet 3.6bb and BB calls.",
      },
      {
        street: "Turn", board: ["9h", "5h", "2s", "Kc"], pot: 12.7, stack: 93.9,
        prompt: "BB checks.",
        options: [
          { label: "Check", s: 1, fb: "A free card is fine, but the K is a good card for you: kings are far more often in your range than in BB's." },
          { label: "Bet 66% · 8.4bb", s: 2, fb: "Keep the pressure on. Weak 9x, 5x and small pairs often fold, and you still have 9 flush outs when called." },
          { label: "Bet 125% · 16bb", s: 1, fb: "Possible, but a big risk with a draw. Save overbets for spots with more fold equity." },
        ],
        after: "You bet 8.4bb and BB calls.",
      },
      {
        street: "River", board: ["9h", "5h", "2s", "Kc", "3d"], pot: 29.5, stack: 85.5,
        prompt: "The flush missed. BB checks. You have jack-high.",
        options: [
          { label: "Check", s: 1, fb: "Fine, but jack-high almost never wins at showdown." },
          { label: "Bet 33% · 9.8bb", s: 0, fb: "Small bluffs get called by any pair. If you bluff, bet enough to fold out 9x and 5x." },
          { label: "Bet 75% · 22bb", s: 2, fb: "Your hand can't win at showdown, and BB's range is capped (rarely KK or sets after just calling). The bluff needs to work 43% of the time: 22 ÷ (29.5 + 22)." },
        ],
        after: "BB folds 9♠8♠. Your bluff wins 29.5bb.",
      },
    ],
  },
  {
    id: "h3", title: "Nut flush draw in the BB", focus: "Pot odds and implied odds",
    hero: "BB", villain: "BTN", cards: ["Ac", "Tc"],
    intro: "BTN opens to 2.5bb, SB folds. You call in the BB with A♣T♣.",
    steps: [
      {
        street: "Flop", board: ["Kc", "8c", "3d"], pot: 9.2, stack: 97.5,
        prompt: "You check, BTN bets 3.7bb (⅔ pot).",
        options: [
          { label: "Fold", s: 0, fb: "Never fold the nut flush draw here." },
          { label: "Call 3.7bb", s: 2, fb: "You need 3.7 ÷ 12.9 = 29%. A nut flush draw is about 36% with two cards to come, plus extra outs. Calling also keeps BTN's bluffs in." },
          { label: "Raise to 12bb", s: 1, fb: "A good semi-bluff some of the time, but calling is the simpler, solid choice." },
        ],
        after: "You call. The pot is 12.9bb.",
      },
      {
        street: "Turn", board: ["Kc", "8c", "3d", "Jh"], pot: 21.4, stack: 93.8,
        prompt: "You check, BTN bets 8.5bb.",
        options: [
          { label: "Fold", s: 1, fb: "Not a disaster, but the J♥ gave you a gutshot. You now have 12 outs: 9 clubs plus three more queens for the nut straight (A-K-Q-J-T)." },
          { label: "Call 8.5bb", s: 2, fb: "12 outs × 2 ≈ 24% vs 28% needed (8.5 ÷ 29.9). Implied odds cover the gap: when the nut flush hits you can win much more." },
          { label: "All-in · 93.8bb", s: 0, fb: "Too much. BTN's kings and sets won't fold." },
        ],
        after: "You call. The pot is 29.9bb.",
      },
      {
        street: "River", board: ["Kc", "8c", "3d", "Jh", "7c"], pot: 29.9, stack: 85.3,
        prompt: "The 7♣ gives you the nut flush. You act first.",
        options: [
          { label: "Check", s: 1, fb: "A check-raise can work, but BTN often checks back kings and you win nothing extra." },
          { label: "Bet 33% · 10bb", s: 1, fb: "You get called, but this is too small with the nuts." },
          { label: "Bet 75% · 22bb", s: 2, fb: "Kings, 88 and sets will call a solid bet. With the nuts, pick the biggest size second-best hands still call." },
        ],
        after: "BTN calls with K♦9♠. You win a 74bb pot.",
      },
    ],
  },
  {
    id: "h4", title: "Flopping a set", focus: "Building a pot out of position",
    hero: "BB", villain: "BTN", cards: ["6d", "6s"],
    intro: "You are in the Big Blind with 6♦6♠.",
    steps: [
      {
        street: "Preflop", board: [], pot: 4, stack: 99,
        prompt: "BTN opens to 2.5bb, SB folds.",
        options: [
          { label: "Fold", s: 0, fb: "66 is too strong to fold at this price." },
          { label: "Call 1.5bb", s: 2, fb: "You get a good price and 66 can flop a set and win a big pot." },
          { label: "3-bet to 11bb", s: 1, fb: "Not terrible, but 66 plays better as a call. It hates facing a 4-bet." },
        ],
        after: "You call. The pot is 5.5bb.",
      },
      {
        street: "Flop", board: ["Jh", "6c", "2d"], pot: 5.5, stack: 97.5,
        prompt: "Set of sixes. You act first.",
        options: [
          { label: "Check", s: 2, fb: "BTN c-bets most of their range on this dry board. Let them put money in." },
          { label: "Bet 33% · 1.8bb", s: 1, fb: "OK, but BTN would bet more often than you. Checking lets them bluff." },
          { label: "Bet 100% · 5.5bb", s: 0, fb: "This folds out almost every hand you beat." },
        ],
        after: "You check, BTN bets 1.8bb.",
      },
      {
        street: "Flop", board: ["Jh", "6c", "2d"], pot: 7.3, stack: 97.5,
        prompt: "BTN bets 1.8bb.",
        options: [
          { label: "Fold", s: 0, fb: "You have the third-best possible hand." },
          { label: "Call 1.8bb", s: 1, fb: "Fine on a dry board, but you miss a chance to grow the pot." },
          { label: "Raise to 7bb", s: 2, fb: "Jx and overpairs call. Start building the pot now so you can get stacks in by the river." },
          { label: "All-in · 97.5bb", s: 0, fb: "This only folds out the hands you beat." },
        ],
        after: "BTN calls 7bb. The pot is 19.5bb.",
      },
      {
        street: "Turn", board: ["Jh", "6c", "2d", "9s"], pot: 19.5, stack: 90.5,
        prompt: "You act first.",
        options: [
          { label: "Check", s: 1, fb: "This gives a free card and may cost you a whole street." },
          { label: "Bet 66% · 13bb", s: 2, fb: "Jx and 9x pay. After this, a river bet of about ¾ pot leaves you close to all-in." },
          { label: "All-in · 90.5bb", s: 0, fb: "Too big right now; it only folds out worse hands." },
        ],
        after: "BTN calls. The pot is 45.5bb.",
      },
      {
        street: "River", board: ["Jh", "6c", "2d", "9s", "3c"], pot: 45.5, stack: 77.5,
        prompt: "You act first.",
        options: [
          { label: "Check", s: 0, fb: "Too passive. BTN often checks back one pair." },
          { label: "Bet 75% · 34bb", s: 2, fb: "Jx with a good kicker still calls this. Strong value." },
          { label: "All-in · 77.5bb", s: 1, fb: "Not crazy with a set, but most Jx folds to a 170% overbet." },
        ],
        after: "BTN calls with A♣J♦. Your set wins a 113bb pot.",
      },
    ],
  },
  {
    id: "h5", title: "Queens in a 3-bet pot", focus: "Low SPR and respecting a river shove",
    hero: "BTN", villain: "CO", cards: ["Qs", "Qd"],
    intro: "You are on the Button with Q♠Q♦.",
    steps: [
      {
        street: "Preflop", board: [], pot: 4, stack: 100,
        prompt: "CO opens to 2.5bb.",
        options: [
          { label: "Fold", s: 0, fb: "QQ is a premium hand." },
          { label: "Call 2.5bb", s: 1, fb: "Calling in position is OK, but you let the blinds in cheaply and miss value." },
          { label: "3-bet to 7.5bb", s: 2, fb: "3-bet for value, 3x the open since you're in position." },
        ],
        after: "Both blinds fold, CO calls. The pot is 16.5bb.",
      },
      {
        street: "Flop", board: ["8s", "5d", "3c"], pot: 16.5, stack: 92.5,
        prompt: "CO checks. SPR is about 5.6.",
        options: [
          { label: "Check", s: 1, fb: "This gives free cards to hands like AJ and KQ." },
          { label: "Bet 33% · 5.5bb", s: 2, fb: "A small bet in a 3-bet pot on a dry, low board. You have the range advantage, and 77–TT, 8x and A5s call." },
          { label: "Bet 75% · 12.4bb", s: 1, fb: "Fine, but it folds out hands you'd like to keep betting into." },
          { label: "All-in · 92.5bb", s: 0, fb: "Way too big. Worse hands fold." },
        ],
        after: "CO calls. The pot is 27.5bb.",
      },
      {
        street: "Turn", board: ["8s", "5d", "3c", "Kh"], pot: 27.5, stack: 87,
        prompt: "CO checks.",
        options: [
          { label: "Check", s: 1, fb: "Reasonable for pot control, but many worse hands still pay a small bet." },
          { label: "Bet 33% · 9bb", s: 2, fb: "99–JJ, 8x and draws like A4s and 76s can call a small bet. A big bet only gets called by kings and sets." },
          { label: "All-in · 87bb", s: 0, fb: "Only better hands call." },
        ],
        after: "CO calls 9bb. The pot is 45.5bb.",
      },
      {
        street: "River", board: ["8s", "5d", "3c", "Kh", "2s"], pot: 123.5, stack: 78,
        prompt: "CO moves all-in for 78bb.",
        options: [
          { label: "Fold", s: 2, fb: "CO check-called twice, then shoved when A4 and 64 made straights. That is far more often a set, two pair or a straight than a bluff. You need 39% (78 ÷ 201.5) and you rarely have it." },
          { label: "Call 78bb", s: 1, fb: "Hero calls can be right against very aggressive players, but this shove is usually strong." },
        ],
        after: "CO shows 6♥4♥ for a straight. Good fold.",
      },
    ],
  },
  {
    id: "h6", title: "Middle pair vs three barrels", focus: "When to stop calling",
    hero: "BB", villain: "BTN", cards: ["9s", "8s"],
    intro: "BTN opens to 2.5bb. You call in the BB with 9♠8♠.",
    steps: [
      {
        street: "Flop", board: ["Ad", "9c", "4h"], pot: 7.3, stack: 97.5,
        prompt: "You check, BTN bets 1.8bb (⅓ pot).",
        options: [
          { label: "Fold", s: 0, fb: "Far too tight. Against a ⅓-pot bet you need only 20% equity." },
          { label: "Call 1.8bb", s: 2, fb: "You need 1.8 ÷ 9.1 = 20%. BTN bets almost everything here, so 9x is often ahead." },
          { label: "Raise to 6bb", s: 1, fb: "Raising turns your pair into a bluff: better aces call, worse hands fold." },
        ],
        after: "You call. The pot is 9.1bb.",
      },
      {
        street: "Turn", board: ["Ad", "9c", "4h", "2s"], pot: 15.1, stack: 95.7,
        prompt: "You check, BTN bets 6bb.",
        options: [
          { label: "Fold", s: 1, fb: "Reasonable against tight players, but BTN still has many bluffs like KQ, QJ and 76." },
          { label: "Call 6bb", s: 2, fb: "You need 6 ÷ 21.1 = 28%. Middle pair plus a backdoor flush draw is enough against a range with many bluffs." },
          { label: "Raise to 20bb", s: 0, fb: "Only better hands continue." },
        ],
        after: "You call. The pot is 21.1bb.",
      },
      {
        street: "River", board: ["Ad", "9c", "4h", "2s", "Kc"], pot: 42.1, stack: 89.7,
        prompt: "You check, BTN bets 21bb (pot size).",
        options: [
          { label: "Fold", s: 2, fb: "A third big bet usually means an ace or better. Most players don't triple-barrel bluff often enough to call with a pair of nines." },
          { label: "Call 21bb", s: 0, fb: "You need 33% and you rarely have it here." },
        ],
        after: "BTN shows A♣J♥. Good fold.",
      },
    ],
  },
  {
    id: "h7", title: "AJ from the Small Blind", focus: "3-bet or fold from the SB",
    hero: "SB", villain: "BTN", cards: ["Ah", "Jd"],
    intro: "You are in the Small Blind with A♥J♦.",
    steps: [
      {
        street: "Preflop", board: [], pot: 4, stack: 99.5,
        prompt: "BTN opens to 2.5bb.",
        options: [
          { label: "Fold", s: 0, fb: "AJo is well ahead of a Button opening range." },
          { label: "Call 2bb", s: 1, fb: "Calling from the SB invites the BB to squeeze and leaves you out of position." },
          { label: "3-bet to 11bb", s: 2, fb: "From the SB you 3-bet or fold. Make it about 4x because you'll be out of position." },
        ],
        after: "BB folds, BTN calls. The pot is 23bb.",
      },
      {
        street: "Flop", board: ["Js", "6h", "2d"], pot: 23, stack: 89,
        prompt: "Top pair, top kicker. You act first.",
        options: [
          { label: "Check", s: 1, fb: "Not bad, but you miss value." },
          { label: "Bet 33% · 7.5bb", s: 2, fb: "Small bets on dry boards in 3-bet pots. Pairs and overcards call." },
          { label: "All-in · 89bb", s: 0, fb: "Too big. Worse hands fold." },
        ],
        after: "BTN calls. The pot is 38bb.",
      },
      {
        street: "Turn", board: ["Js", "6h", "2d", "4c"], pot: 38, stack: 81.5,
        prompt: "You act first.",
        options: [
          { label: "Check", s: 1, fb: "You give up value with what is usually the best hand." },
          { label: "Bet 50% · 19bb", s: 2, fb: "77–TT, KJ, QJ and JT still call. Now the river all-in is a natural size." },
          { label: "All-in · 81.5bb", s: 1, fb: "Not crazy with a low SPR, but a smaller bet keeps more worse hands in." },
        ],
        after: "BTN calls. The pot is 76bb.",
      },
      {
        street: "River", board: ["Js", "6h", "2d", "4c", "2c"], pot: 76, stack: 62.5,
        prompt: "You act first. You have less than one pot left (SPR 0.8).",
        options: [
          { label: "Check", s: 1, fb: "Safe, but you leave value. BTN calls with worse jacks and pairs." },
          { label: "Bet 33% · 25bb", s: 1, fb: "OK, but with SPR under 1 there's little reason to hold back." },
          { label: "All-in · 62.5bb", s: 2, fb: "With top pair top kicker and less than a pot behind, just put it in. Worse jacks and 77–TT often call." },
        ],
        after: "BTN calls with K♠J♣. You win a 201bb pot.",
      },
    ],
  },
  {
    id: "h8", title: "Facing a check-raise", focus: "Calling down vs raises on wet boards",
    hero: "CO", villain: "BB", cards: ["As", "Qs"],
    intro: "You open the Cutoff to 2.5bb with A♠Q♠. BB calls.",
    steps: [
      {
        street: "Flop", board: ["Qd", "Td", "5c"], pot: 5.5, stack: 97.5,
        prompt: "BB checks.",
        options: [
          { label: "Check", s: 1, fb: "Too passive with top pair top kicker on a draw-heavy board." },
          { label: "Bet 33% · 1.8bb", s: 1, fb: "A small bet lets all the draws in cheaply." },
          { label: "Bet 66% · 3.6bb", s: 2, fb: "Wet board, strong hand: bet bigger to charge draws." },
        ],
        after: "BB check-raises to 11bb.",
      },
      {
        street: "Flop", board: ["Qd", "Td", "5c"], pot: 20.1, stack: 93.9,
        prompt: "BB check-raises to 11bb. You need to call 7.4bb.",
        options: [
          { label: "Fold", s: 0, fb: "Top pair top kicker is too strong to fold." },
          { label: "Call 7.4bb", s: 2, fb: "You beat BB's draws (KJ, J9, flush draws) and weaker queens, but lose to two pair and sets. Calling keeps the pot under control." },
          { label: "All-in · 93.9bb", s: 1, fb: "Sets and big combo draws call. You're often flipping or behind." },
        ],
        after: "You call. The pot is 27.5bb.",
      },
      {
        street: "Turn", board: ["Qd", "Td", "5c", "2s"], pot: 42.5, stack: 86.5,
        prompt: "BB bets 15bb.",
        options: [
          { label: "Fold", s: 1, fb: "Too tight. BB bets draws here a lot." },
          { label: "Call 15bb", s: 2, fb: "You need 15 ÷ 57.5 = 26%. You beat all of BB's draws and some of their value hands." },
          { label: "All-in · 86.5bb", s: 1, fb: "Big draws and sets call; you get worse hands to fold." },
        ],
        after: "You call. The pot is 57.5bb.",
      },
      {
        street: "River", board: ["Qd", "Td", "5c", "2s", "3h"], pot: 57.5, stack: 71.5,
        prompt: "All the draws missed. BB checks.",
        options: [
          { label: "Check", s: 2, fb: "Missed draws fold to a bet, and two pair and sets call. Take the free showdown." },
          { label: "Bet 50% · 28.7bb", s: 0, fb: "Only better hands call. The missed draws you beat fold." },
        ],
        after: "BB shows K♦J♦. Your queens win a 57.5bb pot.",
      },
    ],
  },
  {
    id: "h9", title: "Monotone flop, no hearts", focus: "Small c-bets and giving up",
    hero: "BTN", villain: "BB", cards: ["Kc", "Qc"],
    intro: "You open the Button to 2.5bb with K♣Q♣. BB calls.",
    steps: [
      {
        street: "Flop", board: ["9h", "6h", "2h"], pot: 5.5, stack: 97.5,
        prompt: "BB checks.",
        options: [
          { label: "Check", s: 1, fb: "Also fine. With no heart you have little equity." },
          { label: "Bet 33% · 1.8bb", s: 2, fb: "On monotone boards bet small. You fold out many hands and risk little." },
          { label: "Bet 75% · 4.1bb", s: 0, fb: "Big bets on monotone boards only get called by flushes and strong draws." },
        ],
        after: "BB calls. The pot is 9.1bb.",
      },
      {
        street: "Turn", board: ["9h", "6h", "2h", "4s"], pot: 9.1, stack: 95.7,
        prompt: "BB checks.",
        options: [
          { label: "Check", s: 2, fb: "BB called on a monotone board: often a heart or a pair. You have king-high with no heart. Give up and take a free river." },
          { label: "Bet 66% · 6bb", s: 0, fb: "BB's calling range rarely folds to a second barrel here." },
        ],
        after: "River 8♦. BB bets, you fold. Small loss, good discipline.",
      },
    ],
  },
  {
    id: "h10", title: "Two pair on a wet board", focus: "Raising for value and protection",
    hero: "BB", villain: "CO", cards: ["8s", "7s"],
    intro: "You are in the Big Blind with 8♠7♠.",
    steps: [
      {
        street: "Preflop", board: [], pot: 4, stack: 99,
        prompt: "CO opens to 2.5bb, BTN and SB fold.",
        options: [
          { label: "Fold", s: 1, fb: "Too tight. 87s plays well and you get a good price." },
          { label: "Call 1.5bb", s: 2, fb: "Suited connector, great price, you close the action." },
          { label: "3-bet to 11bb", s: 1, fb: "A possible bluff sometimes, but it plays fine as a call." },
        ],
        after: "You call. The pot is 5.5bb.",
      },
      {
        street: "Flop", board: ["8d", "7c", "5d"], pot: 7.3, stack: 97.5,
        prompt: "Top two pair. You check, CO bets 1.8bb.",
        options: [
          { label: "Fold", s: 0, fb: "You have a very strong hand." },
          { label: "Call 1.8bb", s: 1, fb: "This lets flush and straight draws, and overcards, see the turn cheaply." },
          { label: "Raise to 7bb", s: 2, fb: "Lots of draws on this board. Raise to charge them and build the pot." },
        ],
        after: "CO calls. The pot is 19.5bb.",
      },
      {
        street: "Turn", board: ["8d", "7c", "5d", "2c"], pot: 19.5, stack: 90.5,
        prompt: "A blank. You act first.",
        options: [
          { label: "Check", s: 0, fb: "Never give free cards on a board this wet." },
          { label: "Bet 75% · 14.6bb", s: 2, fb: "Overpairs, 8x and all the draws pay. Bigger on wet boards." },
          { label: "Bet 33% · 6.5bb", s: 1, fb: "Too cheap for the draws." },
        ],
        after: "CO calls. The pot is 48.7bb.",
      },
      {
        street: "River", board: ["8d", "7c", "5d", "2c", "Kh"], pot: 48.7, stack: 75.9,
        prompt: "You act first.",
        options: [
          { label: "Check", s: 0, fb: "Overpairs and Kx won't bet for you." },
          { label: "Bet 66% · 32bb", s: 2, fb: "Overpairs and kings that improved call. A size worse hands can still call." },
          { label: "All-in · 75.9bb", s: 1, fb: "OK, but a smaller bet is called more often." },
        ],
        after: "CO calls with T♠T♥. Your two pair wins 113bb.",
      },
    ],
  },
  {
    id: "h11", title: "KJo vs an UTG open", focus: "Avoiding dominated hands",
    hero: "BTN", villain: "UTG", cards: ["Kd", "Js"],
    intro: "You are on the Button with K♦J♠.",
    steps: [
      {
        street: "Preflop", board: [], pot: 4, stack: 100,
        prompt: "UTG opens to 2.5bb, HJ and CO fold.",
        options: [
          { label: "Fold", s: 2, fb: "KJo is dominated by AK, AJ and KQ, which make up much of UTG's range." },
          { label: "Call 2.5bb", s: 0, fb: "It looks harmless but loses money over time: when you make top pair you're often outkicked." },
          { label: "3-bet to 7.5bb", s: 0, fb: "UTG continues mostly with hands that crush you." },
        ],
        after: "You fold. UTG takes the blinds.",
      },
    ],
  },
  {
    id: "h12", title: "Small pair on a connected board", focus: "Checking back and bluff-catching",
    hero: "BTN", villain: "BB", cards: ["7s", "7d"],
    intro: "You open the Button to 2.5bb with 7♠7♦. BB calls.",
    steps: [
      {
        street: "Flop", board: ["Jc", "Td", "8s"], pot: 5.5, stack: 97.5,
        prompt: "BB checks.",
        options: [
          { label: "Check", s: 2, fb: "77 is weak here: any J, T, 8 or 9 beats you, and BB's range hits connected boards hard." },
          { label: "Bet 33% · 1.8bb", s: 1, fb: "Not terrible, but better hands call and worse ones fold." },
          { label: "Bet 75% · 4.1bb", s: 0, fb: "You're bluffing with a hand that has showdown value." },
        ],
        after: "You check behind.",
      },
      {
        street: "Turn", board: ["Jc", "Td", "8s", "2h"], pot: 5.5, stack: 97.5,
        prompt: "BB checks again.",
        options: [
          { label: "Check", s: 1, fb: "Fine, but now you can get some value and protection." },
          { label: "Bet 50% · 2.8bb", s: 2, fb: "BB checked twice, so they rarely have a strong hand. 66, 55, ace-high and gutshots call or fold, and you deny them a free card." },
          { label: "All-in · 97.5bb", s: 0, fb: "Only better hands call." },
        ],
        after: "BB calls. The pot is 11.1bb.",
      },
      {
        street: "River", board: ["Jc", "Td", "8s", "2h", "3c"], pot: 16.6, stack: 94.7,
        prompt: "BB bets 5.5bb (half pot).",
        options: [
          { label: "Fold", s: 1, fb: "Small river bets are often thin value or bluffs. Folding gives up too often." },
          { label: "Call 5.5bb", s: 2, fb: "You need 5.5 ÷ 22.1 = 25%. This small bet includes missed draws like K9 and A9, and weaker pairs." },
          { label: "Raise to 18bb", s: 0, fb: "Only better hands call a raise." },
        ],
        after: "BB shows A♦9♦, a missed draw. Your sevens win 22bb.",
      },
    ],
  },
  {
    id: "h13", title: "Squeeze with AQs", focus: "3-betting an open and a call",
    hero: "BTN", villain: "UTG", cards: ["Ad", "Qd"],
    intro: "You are on the Button with A♦Q♦.",
    steps: [
      {
        street: "Preflop", board: [], pot: 6.5, stack: 100,
        prompt: "UTG opens to 2.5bb, HJ folds, CO calls.",
        options: [
          { label: "Fold", s: 0, fb: "AQs is far too strong to fold." },
          { label: "Call 2.5bb", s: 1, fb: "Calling is fine, but you play a multiway pot and the blinds can join." },
          { label: "3-bet to 11bb", s: 2, fb: "A squeeze. CO's call usually means a medium hand (they 3-bet their best ones). Make it 3x plus the extra caller: you often win now or play heads-up in position." },
        ],
        after: "Everyone folds. You win 6.5bb.",
      },
    ],
  },
  {
    id: "h14", title: "The nut straight", focus: "Getting stacks in with the nuts",
    hero: "BTN", villain: "BB", cards: ["9h", "8h"],
    intro: "You open the Button to 2.5bb with 9♥8♥. BB calls.",
    steps: [
      {
        street: "Flop", board: ["7h", "6c", "5d"], pot: 5.5, stack: 97.5,
        prompt: "You flopped the nut straight. BB checks.",
        options: [
          { label: "Check", s: 1, fb: "Slowplaying gives free cards on a board full of draws." },
          { label: "Bet 33% · 1.8bb", s: 1, fb: "Too cheap for the draws on this wet board." },
          { label: "Bet 75% · 4.1bb", s: 2, fb: "Bigger on wet boards. Draws and pairs pay you." },
        ],
        after: "BB check-raises to 12bb.",
      },
      {
        street: "Flop", board: ["7h", "6c", "5d"], pot: 21.6, stack: 93.4,
        prompt: "BB check-raises to 12bb.",
        options: [
          { label: "Fold", s: 0, fb: "You have the nuts." },
          { label: "Call 7.9bb", s: 1, fb: "Safe, but you let BB's draws see the turn cheaply." },
          { label: "Re-raise to 30bb", s: 2, fb: "Build the pot now. Sets, two pair and draws continue." },
          { label: "All-in · 93.4bb", s: 1, fb: "Not bad with the nuts, but a smaller raise keeps more draws in." },
        ],
        after: "BB calls 30bb. The pot is 65.5bb.",
      },
      {
        street: "Turn", board: ["7h", "6c", "5d", "Ks"], pot: 65.5, stack: 67.5,
        prompt: "BB checks.",
        options: [
          { label: "Check", s: 0, fb: "This gives a free card to every draw that can beat you." },
          { label: "Bet 33% · 22bb", s: 1, fb: "OK, but leaves an awkward river." },
          { label: "All-in · 67.5bb", s: 2, fb: "About pot size. Sets and draws call; get it in while you're ahead." },
        ],
        after: "BB calls with 7♣7♦. The river is a 2♥. Your straight holds: 200bb pot.",
      },
    ],
  },
  {
    id: "h15", title: "A weak flush draw", focus: "When implied odds aren't enough",
    hero: "BB", villain: "BTN", cards: ["6s", "5s"],
    intro: "BTN opens to 2.5bb. You call in the BB with 6♠5♠.",
    steps: [
      {
        street: "Flop", board: ["As", "Kd", "3s"], pot: 7.3, stack: 97.5,
        prompt: "You check, BTN bets 1.8bb.",
        options: [
          { label: "Fold", s: 0, fb: "Never fold a flush draw to a small bet. You need just 20%." },
          { label: "Call 1.8bb", s: 2, fb: "You need 20% and have about 36% with two cards to come." },
          { label: "Check-raise to 6bb", s: 1, fb: "A reasonable semi-bluff too." },
        ],
        after: "You call. The pot is 9.1bb.",
      },
      {
        street: "Turn", board: ["As", "Kd", "3s", "9c"], pot: 15.1, stack: 95.7,
        prompt: "You check, BTN bets 6bb.",
        options: [
          { label: "Fold", s: 2, fb: "You need 28% (6 ÷ 21.1) and have about 18% (9 outs × 2). Your flush is only 6-high, so when you hit, better flushes win and the ace on board scares Ax away. Your implied odds are poor." },
          { label: "Call 6bb", s: 1, fb: "Close, but you're paying too much for a draw that isn't the nuts." },
        ],
        after: "You fold. Compare with the A♣T♣ hand, where the nut draw made calling right.",
      },
    ],
  },
];
