// Betting & strategy lessons. Each lesson: short sections + key points + check questions.
const LESSONS = [
  {
    id: "position",
    title: "Position is power",
    tag: "Preflop",
    body: [
      "The seats in 6-max are UTG, HJ, CO, BTN (Button), SB and BB. After the flop the Button always acts last, and acting last is a big advantage. You see what everyone else did before you decide.",
      "That is why ranges get wider as you move toward the Button. From UTG five players can still wake up with a big hand behind you. From the Button only the two blinds are left, and you will have position on both of them.",
      "In the blinds you are out of position after the flop. You still defend the BB a lot, because you already put 1bb in and get a good price.",
    ],
    points: [
      "UTG opens about 15%, HJ 19%, CO 27%, BTN 45%.",
      "Acting last = more information = more profit.",
      "The SB is the hardest seat: you pay a blind and act first after the flop.",
    ],
    quiz: [
      {
        q: "Which seat should open the widest range when folded to?",
        options: ["UTG", "CO", "BTN", "SB"],
        answer: 2,
        why: "The Button acts last after the flop against both blinds, so it can play the most hands profitably.",
      },
      {
        q: "Why does UTG play so tight?",
        options: ["The blinds are bigger", "Five players still act behind", "UTG acts last postflop"],
        answer: 1,
        why: "With five players left to act, there's a good chance someone holds a strong hand. Weak hands get dominated.",
      },
    ],
  },
  {
    id: "hands",
    title: "Which hands are good?",
    tag: "Preflop",
    body: [
      "Starting hands win in different ways. Pairs can make sets (three of a kind). Suited hands can make flushes. Connected hands like 87s make straights. Big cards (A, K, Q) make top pair with a good kicker.",
      "The danger is domination: when you hold a hand like A9 and your opponent has AQ. You both hit the ace, but they win almost every time. That's why offsuit hands like KJo or A9o are folded early in position: they mostly make second-best hands.",
      "Suited hands are only about 3% better in raw equity, but they play much better because flush draws let you keep betting and win big pots.",
    ],
    points: [
      "Suited beats offsuit; connected beats gapped.",
      "Watch out for domination with offsuit aces and kings.",
      "Small pairs need deep stacks: you hit a set only about 1 time in 8.5.",
    ],
    quiz: [
      {
        q: "You have A9o and the flop is A-7-2. Which hand do you fear most?",
        options: ["K-Q", "A-Q", "8-8"],
        answer: 1,
        why: "AQ dominates you: same pair, better kicker. You win only when a 9 comes or it's a split.",
      },
      {
        q: "How often does a pocket pair flop a set or better?",
        options: ["About 1 in 3", "About 1 in 8.5", "About 1 in 20"],
        answer: 1,
        why: "Roughly 12%, or once every 8.5 flops. That's why small pairs want cheap flops and deep stacks.",
      },
    ],
  },
  {
    id: "opening",
    title: "Open-raise, don't limp",
    tag: "Preflop",
    body: [
      "When it's folded to you, either raise or fold. Limping (just calling the big blind) gives the blinds a cheap look and tells everyone your hand is weak.",
      "Standard open size in 6-max online cash is 2.5bb. In the Small Blind raise to 3bb, because you will be out of position. Live games often use bigger opens (3–4bb) because players call more.",
      "If someone has already limped, raise bigger: about 3bb + 1bb for each limper.",
    ],
    points: [
      "Open 2.5bb, SB 3bb.",
      "Add 1bb per limper.",
      "Raising wins the blinds right away when everyone folds.",
    ],
    quiz: [
      {
        q: "Folded to you on the CO with 76s. What do you do?",
        options: ["Limp", "Raise to 2.5bb", "Raise to 6bb"],
        answer: 1,
        why: "76s is in the CO opening range. Use the standard 2.5bb size.",
      },
      {
        q: "One player limps, you want to raise from the Button. Good size?",
        options: ["2.5bb", "4bb", "10bb"],
        answer: 1,
        why: "About 3bb plus 1bb for the limper = 4bb.",
      },
    ],
  },
  {
    id: "threebet",
    title: "Facing a raise: 3-bet, call or fold",
    tag: "Preflop",
    body: [
      "When someone has opened, you have three choices. Fold most hands. Call with hands that play well after the flop, especially when you will have position. 3-bet (re-raise) with your best hands and a few bluffs.",
      "Good 3-bet bluffs are hands like A5s and A4s. They block your opponent's aces (fewer AA/AK combos for them) and can still make a straight or the nut flush when called.",
      "Size: about 3x the open when you're in position (7.5bb vs 2.5bb), about 4x when out of position (10–11bb). Calling an open from the SB is usually a mistake; 3-bet or fold.",
    ],
    points: [
      "3-bet 3x in position, 4x out of position.",
      "A5s/A4s are classic 3-bet bluffs.",
      "Tighten up a lot against an early-position open.",
    ],
    quiz: [
      {
        q: "BTN opens 2.5bb, you are in the SB. Good 3-bet size?",
        options: ["5bb", "7.5bb", "11bb"],
        answer: 2,
        why: "Out of position you want ~4x the open, around 10–11bb, so the Button has a harder time calling.",
      },
      {
        q: "Why is A5s a good 3-bet bluff?",
        options: ["It's ahead of most hands", "It blocks AA/AK and can make straights/flushes", "Opponents always fold to it"],
        answer: 1,
        why: "Holding an ace means fewer AA and AK combos for villain, and the hand still has real equity when called.",
      },
    ],
  },
  {
    id: "potodds",
    title: "Pot odds and outs",
    tag: "Math",
    body: [
      "Pot odds tell you how often you need to win to make a call profitable. Formula: call ÷ (pot after your call). If the pot is 10bb and villain bets 5bb, you call 5 to win a pot of 20 total: 5 ÷ 20 = 25%.",
      "Outs are the cards that improve you to the best hand. A flush draw has 9 outs, an open-ended straight draw 8, a gutshot 4.",
      "Rule of 2 and 4: on the flop with two cards to come, outs × 4 ≈ your equity. On the turn with one card left, outs × 2. So a flush draw on the flop is ~36%, on the turn ~18%.",
      "If your equity is higher than the pot odds, calling makes money. If it's lower, you need implied odds: money you expect to win later when you hit.",
    ],
    points: [
      "Needed equity = call ÷ (pot + bet + call).",
      "Flop: outs × 4. Turn: outs × 2.",
      "Common bets: ⅓ pot needs 20%, ½ pot needs 25%, ¾ pot 30%, pot 33%.",
    ],
    quiz: [
      {
        q: "Pot is 12bb, villain bets 6bb. What equity do you need to call?",
        options: ["20%", "25%", "33%"],
        answer: 1,
        why: "You call 6 to win a final pot of 12 + 6 + 6 = 24. 6 ÷ 24 = 25%.",
      },
      {
        q: "Turn, you have an open-ended straight draw (8 outs). Rough equity?",
        options: ["~8%", "~16%", "~32%"],
        answer: 1,
        why: "One card to come: 8 × 2 = 16%.",
      },
    ],
  },
  {
    id: "cbet",
    title: "C-betting and board texture",
    tag: "Postflop",
    body: [
      "A continuation bet (c-bet) is when the preflop raiser bets the flop. How often and how big depends on the board.",
      "Dry boards like K-7-2 rainbow favour the raiser, who has more strong Kx and big pairs. Bet small (about ⅓ pot) with almost your whole range. The caller can't have many strong hands and must fold a lot.",
      "Wet, connected boards like 9♥8♥6♣ hit the caller's range (suited connectors, small pairs). Bet less often, but bigger (⅔–¾ pot) when you do, to charge the draws. Check many weak hands.",
      "Monotone boards (three cards of one suit) are scary for everyone. Bet small or check.",
    ],
    points: [
      "Dry board → small bet, often.",
      "Wet board → bigger bet, less often.",
      "Ask: whose range hits this board better?",
    ],
    quiz: [
      {
        q: "You opened BTN, BB called. Flop A♠8♦3♣. Typical c-bet?",
        options: ["Check everything", "Small, ~⅓ pot", "Overbet all-in"],
        answer: 1,
        why: "A-high dry board strongly favours the preflop raiser. A small bet works with your whole range.",
      },
      {
        q: "Flop T♥9♥8♣. Who does this board usually help?",
        options: ["The preflop raiser", "The BB caller", "Nobody"],
        answer: 1,
        why: "Connected middle boards hit the caller's suited connectors and small pairs. The raiser should check more.",
      },
    ],
  },
  {
    id: "valuebluff",
    title: "Why bet? Value or bluff",
    tag: "Postflop",
    body: [
      "There are two good reasons to bet. Value: worse hands will call. Bluff: better hands will fold. If neither is true, check.",
      "Medium-strength hands (second pair, weak top pair) usually don't want to bet big: better hands call, worse hands fold. These are your check-and-call (bluff-catch) hands.",
      "The best bluffs have some equity (draws) or block your opponent's calling hands. A missed draw with no showdown value is a good river bluff candidate; a weak pair that might win at showdown is not.",
    ],
    points: [
      "Value: called by worse. Bluff: folds better.",
      "Middle-strength hands → check more.",
      "Bluff with hands that can't win at showdown.",
    ],
    quiz: [
      {
        q: "River, you have third pair. Villain checks. Bet big?",
        options: ["Yes, for value", "No, better hands call and worse fold", "Yes, as a bluff"],
        answer: 1,
        why: "A big bet with third pair only gets called by better hands. Check and take a cheap showdown.",
      },
    ],
  },
  {
    id: "sizing",
    title: "Bet sizing and SPR",
    tag: "Postflop",
    body: [
      "Sizes are said as a fraction of the pot. Small (25–33%) is for dry boards and range bets. Medium (50–75%) is the normal value-and-draws size. Big (100%+, overbets) is for very strong hands and bluffs when you have the nut advantage.",
      "Plan to get stacks in. With a strong hand, pick sizes that build the pot to all-in by the river. In a single-raised pot (5.5bb on the flop) three ⅔-pot bets put only about 32bb in the middle. To get 100bb in you need roughly pot-sized bets, or a raise along the way. Small bets keep pots small, so use them when that's what you want.",
      "SPR (stack-to-pot ratio) = effective stack ÷ pot on the flop. In a 3-bet pot SPR is often ~4–5, so top pair is strong enough to go all-in. In a single-raised pot SPR is ~18 and one pair is usually too weak to stack off.",
    ],
    points: [
      "Small for dry boards, bigger for wet boards.",
      "Strong hand: plan three bets to all-in.",
      "Low SPR → one pair is strong. High SPR → be careful.",
    ],
    quiz: [
      {
        q: "3-bet pot: pot is 20bb on the flop, stacks 90bb. SPR?",
        options: ["~2", "~4.5", "~10"],
        answer: 1,
        why: "90 ÷ 20 = 4.5. Top pair or an overpair is happy to get all-in here.",
      },
    ],
  },
  {
    id: "river",
    title: "River decisions",
    tag: "Postflop",
    body: [
      "On the river there are no more cards, so draws are dead. Your hand either wins at showdown or it doesn't.",
      "Bet for value with hands that beat most of what calls. Bet a size that worse hands can still call: often 50–75%.",
      "When facing a bet, compare pot odds with how often villain is bluffing. A pot-sized bet needs you to be right 33% of the time. Many players bluff far too little on the river, especially with big bets. Lean toward folding marginal hands against big river bets from passive players.",
      "Minimum defence frequency (MDF): against a ½-pot bet, a perfect defender calls with ~67% of their range. Use it as a guide, not a rule, against real opponents.",
    ],
    points: [
      "Missed draws are bluff candidates; weak pairs check.",
      "Big river bets from passive players = usually strong.",
      "Bet ½–¾ pot for thin value.",
    ],
    quiz: [
      {
        q: "Villain bets the full pot on the river. How often must you win to call?",
        options: ["25%", "33%", "50%"],
        answer: 1,
        why: "You call 1 pot to win a total of 3 pots: 1 ÷ 3 = 33%.",
      },
    ],
  },
  {
    id: "mistakes",
    title: "Common beginner leaks",
    tag: "Mindset",
    body: [
      "Playing too many hands from early position. Stick to the charts first; widen later.",
      "Calling too much preflop. Calling with dominated offsuit hands (KJo vs UTG, A9o vs a raise) loses money slowly and steadily.",
      "Slowplaying too often. Most of the time, bet your strong hands. People call more than they raise.",
      "Paying off big river raises. A raise on the river from an average player is almost never a bluff.",
      "Tilt. Take a break after a bad beat. Decisions matter, single results don't.",
    ],
    points: [
      "Tight preflop, aggressive postflop.",
      "Bet strong hands; don't slowplay by default.",
      "Respect river raises.",
    ],
    quiz: [
      {
        q: "You flopped a set on a draw-heavy board. Best default?",
        options: ["Check and hope they bet", "Bet for value and protection", "Fold, the board is scary"],
        answer: 1,
        why: "Bet. Draws will call, and you deny free cards that could beat you.",
      },
    ],
  },
];
