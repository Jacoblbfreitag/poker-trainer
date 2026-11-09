# Six-Max Trainer

A phone-first web app for learning 6-max No-Limit Hold'em (cash, 100bb deep).

**Open the app:** https://GITHUB_USER.github.io/poker-trainer/

## What's inside

| Tab | What it does |
| --- | --- |
| **Ranges** | 13×13 preflop charts: opening ranges for UTG, HJ, CO, BTN, SB, and 3-bet/call/fold charts for common spots (BB vs BTN, BB vs UTG, BTN vs CO, BTN vs UTG, SB vs BTN). Tap a hand to see why. |
| **Quiz** | Random seat + random hand: choose Fold, Call, Raise or 3-bet. Instant feedback with the chart, streaks and accuracy per spot. |
| **Lessons** | 10 short lessons: position, hand selection, open sizes, 3-betting, pot odds and outs, c-betting by board texture, value vs bluff, bet sizing and SPR, river play, common leaks. Each ends with check questions. |
| **Hands** | 15 scripted hands played street by street. Pick a bet size or action and get feedback on why it's best, OK or a mistake. |

## Install on your phone

- **iPhone (Safari):** open the link → Share → *Add to Home Screen*.
- **Android (Chrome):** open the link → ⋮ menu → *Add to Home screen* / *Install app*.

It then opens full-screen like a normal app. Progress (quiz stats, finished lessons, best hand scores) is saved in your browser on that device.

## Run locally

No build step. Open `index.html` in a browser, or serve the folder:

```sh
python -m http.server 8000
```

## Notes on the ranges

The charts are simplified, beginner-friendly versions of standard 6-max 100bb ranges with a 2.5bb open size (3bb from the SB). They're a solid starting point. Real solver ranges mix some hands between actions.

## Files

- `index.html`: app shell and tab bar
- `css/style.css`: styles (light and dark theme)
- `js/ranges.js`: range data and chart helpers
- `js/lessons.js`: lesson content
- `js/hands.js`: hand trainer scenarios
- `js/app.js`: views, quiz and trainer logic
