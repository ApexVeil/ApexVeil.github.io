# ApexVeil website design — editorial direction

The redesign replaces the wireframe illustration with two photorealistic campaign assets and an open editorial layout. Generated images are concept imagery, not evidence of ApexVeil processing quality.

## Accepted implementation specification

Three coordinated ImageGen section concepts define the page: hero, approach, and development/footer. Their original references are retained privately under .design/concepts on the development host.

- Background: neutral off-white #f4f4f1; text: graphite #17191b; secondary text: #51555a; rules: #d2d3d3; limited accent: #d83c32.
- Header: compact italic APEXVEIL wordmark; Approach, Development, GitHub links. One global header only.
- Hero: 80px desktop headline with tight line height; 23px supporting text; 54px-high graphite primary CTA. Photo spans almost the full viewport with a 2.735:1 frame, no tint or overlay.
- Approach: open two-column composition, editorial text rows at left and a 1.28:1 photograph at right. No cards or invented controls.
- Development: graphite band, left heading and link, right three honest implementation-status rows. Desktop heading reaches 106px; the band is 660px high at the reference width.
- Footer: off-white, compact wordmark, tagline, Source / Documentation / GitHub links.
- Typography: Helvetica Neue / Arial with deliberate heading weights and tracking. The wordmark uses bold italic Arial Black fallbacks. No external font service.
- Icons: a simple code-native horizontal arrow for the development link; no decorative icon families.

## Above-the-fold copy lock

APEXVEIL; Approach; Development; GitHub; Invisible edits.; Unmistakable motion.; Natural-looking plate replacement and privacy for automotive imagery. Built in the open.; Explore GitHub; The approach; A study in scene consistency; Concept imagery.

## Intentional implementation decisions

The generated approach concept repeated a navigation header despite the brief. The implemented page uses one shared header. Mobile preserves source order, stacks the method and development columns, and reframes the panoramic image around the car. The photo uses no additional color overlay. Site copy does not claim a released editor or proven full-video replacement.

## Image generation

The built-in ImageGen tool was used, with no API-key fallback. The production assets are assets/hero-v2.webp and assets/detail-v2.webp, optimized from standalone generated PNGs. The reference mockups are never shipped as webpage UI.

Hero asset prompt: Create a standalone wide photographic asset matching the accepted hero concept: the same silver performance fastback driving on a pale concrete road, low front three-quarter angle, car right of center, subtle road and wheel motion blur, natural reflected daylight and fine texture. Preserve the matte black plate with white italic APEXVEIL. Remove all website navigation, headings, controls, margins and captions. No neon, artificial flare or CGI sheen.

Detail asset prompt: Recreate only the close-up photograph from the accepted approach concept: the same silver bumper, fine black honeycomb grille, matte black APEXVEIL plate with realistic thickness, natural dappled daylight, soft tree shadows, asphalt foreground and softly focused concrete background. Preserve the neutral palette and camera perspective. Remove all website UI and white margins.

The generation requests preserve brand scenes, not an actual before/after editing result. See the visible image captions.
