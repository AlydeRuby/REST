# Verification record

Verified locally on 2026-10-19 with Node.js 24.19.0 and the Codex in-app browser. No deployment has been performed.

## Automated checks — passed

`node --test --test-isolation=none tests/*.test.mjs` — 13 tests passed.

- All 11 energy values × 32 need combinations × 8 selection modes = **2,816 plans**; valid duration totals, two or three steps, manual override, stable output, and no mutation of user selections.
- Null/invalid energy rejected while zero is accepted.
- Need-specific recommendations and low-energy prioritization.
- Reassessment cannot complete without explicit energy and each selected symptom.
- Worsening overrides an energy improvement; unchanged, improved, and low-energy outcomes differ.
- Timer math accounts for elapsed wall time and clamps at zero.
- Static files resolve locally; no outbound request, sensor, or browser persistence APIs in the app; restrictive connection policy.
- Local server returns HTML/JavaScript successfully, rejects POST, and returns 404 for missing paths.
- Skill required manifest fields, absence of unfinished placeholders, and self-contained server path.
- English translations cover all methods, plan steps, work pacing, recovery outcomes, and dynamic values.
- Rain samples are deterministic, non-silent, and bounded; playback starts only on request, supports stop/restart, and avoids duplicate sources.

`node scripts/build.mjs` — static build completed successfully.

The bundled skill-creator Python validator was attempted but its environment lacked PyYAML. The manifest was checked by the included Node test instead; this is not a claim that the Python validator passed.

## Browser checks — passed

- Initial energy reads unassessed; generate button disabled.
- Keyboard sets 0 and 10 correctly; no needs is valid.
- Three needs at energy 6 produce a three-step recommendation.
- Manual method choice overrides recommendation; returning to automatic recommendation works.
- Timer starts, pauses, resets, advances, and finishes the plan; direct review also works.
- Follow-up energy starts unassessed; each selected need receives an explicit answer.
- Worsened symptom with energy rising from 6 to 10 produces gentler advice; changing that symptom removes stale advice and recalculates correctly.
- Next round carries forward the new energy and only unresolved needs.
- Changing method invalidates the previous plan and evaluation.
- Lamp and night controls change their pressed state and room appearance.
- Reset cancellation preserves the assessment; confirmed reset returns to unassessed.
- Viewports 320, 390, 768, and 1280 pixels: no horizontal page overflow. Recovery/reassessment also checked at 320 pixels.
- No browser console warnings or errors in the tested flow.
- Switching Traditional Chinese ↔ English preserves energy, selected needs, and an active timer. English planning and reassessment were exercised end to end.
- Rain control successfully starts the browser audio context, reports on/off, and stops playback. Subjective sound quality and physical phone audio output were not independently evaluated.

## Remaining verification limits

- Browser checks were performed interactively; only the Node tests run in GitHub Actions.
- No Safari, Firefox, physical touch device, or assistive technology audit.
- The full two-minute timer was not waited out in the browser; expiration math was tested directly.
- GitHub Pages publication requires your repository and Pages configuration. Its live URL and workflow execution remain unverified until you publish.
- Vercel configuration is included and follows the official static-build settings. No Vercel deployment or public URL has been created or verified.
- Original embedded conversation UI was unavailable; this implementation follows the written requirements and later supplied room reference. Exact original method names and pixel fidelity are not claimed.
