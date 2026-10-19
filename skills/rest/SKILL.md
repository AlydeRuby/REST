---
name: rest
description: Guide a gentle REST recovery check-in with energy self-assessment, seven rest methods, a short personalized plan, and follow-up. Use when someone asks for /REST, a recovery break, or the REST room dashboard.
---

# /REST 休養小室

Default to Traditional Chinese unless the user chooses another language. Keep controls and prose compact, gentle, and nonjudgmental. Do not infer a person's energy or diagnose a condition.

The dashboard has exactly two language choices, Traditional Chinese and English. Its language switch preserves assessment and timer state. The room's top-right rain switch is off by default and synthesizes gentle rain locally after a user click; do not autoplay sound or add remote audio services.

## The interactive room

The fixed interface lives in `assets/app/`. Reuse these assets unchanged when the user wants the same dashboard; do not regenerate its layout from prose. The package is self-contained and needs no external libraries, fonts, APIs, account, connector, sensor, or AI service.

When local execution and a browser are available, run `node scripts/serve.mjs` from this skill directory, then open the printed loopback URL. Use a different `PORT` if needed. Keep the server alive while the user is using the room. Where direct local execution is unavailable, provide the publisher's actual deployed app URL if known; never invent one. If no URL is configured, explain how to run or host the bundled assets, or offer the conversational flow below. A skill alone does not guarantee an identical embedded interface in every chat host.

For implementation or customization, `assets/app/core.js` is the single source for need labels, method definitions, recommendation weights, step durations, work pacing, and reassessment rules. `app.js` handles controls; `room.js` contains original SVG artwork; `style.css` and `layout.css` define presentation.

## Conversational recovery flow

1. Ask for energy from 0 to 10 only if not already provided. Start unassessed; never silently substitute 5 or treat 0 as missing. Let users choose any of five needs: 身體疲倦、腦袋很滿、心緒不安、有點孤單、感官過載. No selection is allowed.
2. Offer a recommendation or honor one manually selected method. The seven methods are grouped as 生理（身體休息、感官休息）、心理（心智休息、情緒休息、創造休息）、社會・環境（社交休息、心靈休息）. These are practical organizing labels, not diagnoses or a validated clinical scale.
3. For exact consistency with the app, call `makePlan(energy, needs, manual)` from `assets/app/core.js` when JavaScript execution is available. Otherwise read its rules and disclose that the conversational response is a suggestion. Give 2–3 small steps with durations and brief work pacing advice. At low energy, keep the plan short and prioritize rest. Avoid promises of recovery or claims of scientific validation.
4. After the user rests, ask for energy again and whether each selected feeling is 舒緩了、差不多、更明顯. Do not assume improvement. Use `evaluateRecovery` for deterministic follow-up when possible. A worsened feeling overrides an energy increase; lower energy calls for easing demands. Let the user adjust or stop at any point.

## Privacy and boundaries

The web app keeps answers only in page memory and clears them on reload/reset. Do not add persistence, analytics, connectors, health sensors, or send assessments elsewhere without a new user request. Do not claim chat messages have the same privacy properties as the standalone app: chat hosts apply their own data policies. Suggestions about contacting someone are for the user to act on; never message another person on their behalf without authorization. These are everyday rest suggestions, not medical treatment.
