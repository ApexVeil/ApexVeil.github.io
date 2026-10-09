# v3 implementation review

Recorded on 2026-10-10 (Asia/Shanghai). This review covers the real-image comparison website and its English/Chinese switch. The earlier light editorial v2 and generated production photography have been superseded.

## Verified checks

1. **Published-media scope:** the repository contains three authorized 900 × 505 photographic crops (sunset, shade and rear), each with original, blur, mosaic and custom variants. The cases are pre-rendered; the page does not claim live inference or validated video replacement. See [provenance](DEMO_PROVENANCE.md).
2. **Chinese mobile layout:** the parent agent checked the rendered page at 390 px and 360 px widths. There was no horizontal overflow. Screenshots were retained privately.
3. **Language and comparison state:** browser checks confirmed that the shade case, mosaic finish and three-view layout remained selected after switching language. Component tests also confirm divider percentage, DOM-node identity and localized percentage descriptions survive a switch.
4. **Motion preference:** browser checks confirmed that motion remained off after language switching. The language handler updates text without restarting the animation loop or rebuilding the comparison component.
5. **Automated integrity:** 12 Node tests passed, covering comparison state transitions, data validation, bilingual key coverage, browser-language fallback, explicit-language persistence and in-place comparison translation. JavaScript syntax checks and `git diff --check` also passed.

## Scope and limits

The layout remains the dark v3 design with restrained orange accents, self-hosted typography, a real photographic hero and interactive comparisons. Chinese display headings use CJK-capable system fallbacks rather than relying on Bebas Neue for missing glyphs. No new sections or video demonstrations were added during localization.

These checks are not a claim of exhaustive device, assistive-technology or cross-browser coverage. This review does not establish segmentation accuracy, end-to-end processing performance, commercial readiness or video quality. The production website is a demonstration viewer; algorithm evaluation belongs to the separate engine repository.

Private browser screenshots and ImageGen design mockups are excluded from publication.
