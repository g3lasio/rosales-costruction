# Accessibility and Contrast Audit

## Scope

This review covers the public Rosales experience on the home, paver service, contact, about, areas, reviews, and privacy routes. It focuses on the implementation choices that are testable in the repository: keyboard focus, color contrast, motion preferences, responsive behavior, semantic landmarks, form labels, feedback states, and alternate text.

## Verified corrections

| Area | Criterion | Result | Implementation evidence |
|---|---|---|---|
| Primary action buttons | WCAG 2.2 AA, 4.5:1 for normal-size text | Pass | White `#FFFFFF` text on accessible green `#47793E` is asserted in `server/accessibility.contrast.test.ts`. |
| Conversation strip and chat fallback | WCAG 2.2 AA, 4.5:1 for normal-size text | Pass | White `#FFFFFF` text on accessible clay `#9D5036` is asserted in the same test. |
| Dark surfaces | WCAG 2.2 AA, 4.5:1 for normal-size text | Pass | White `#FFFFFF` text on deep pine `#17231A` is asserted in the same test. |
| Long-form content | WCAG 2.2 AA, 4.5:1 for normal-size text | Pass | Ink `#1E271F` text on limestone `#F2EEE5` is asserted in the same test. |
| Keyboard use | WCAG 2.2 focus visible | Pass | Global `:focus-visible` styling is retained; navigation, language selector, call, estimate, and chat actions use native controls or links. |
| Motion | WCAG 2.2 reduce motion | Pass | Non-essential transition behavior is reduced under `prefers-reduced-motion`. |
| Forms | Labels, errors, and input purpose | Pass | Estimate controls use visible labels, required fields, client/server validation, and accessible success/error messages. |
| Project photography | Text alternatives | Pass | Project images use descriptive localized alt text rather than filenames. |
| Mobile layout | Responsive reflow | Pass | Home, service, and contact routes were checked at 375 × 812 and 1280 × 720. |

## Follow-up during content maintenance

Any future button, badge, overlaid text, or image treatment should be reviewed against its final background image and state. New photos should always receive a precise English and Spanish description. The optional SMS-consent text must remain unchecked by default and remain separate from the ability to request an estimate.
