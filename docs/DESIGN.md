# ApexVeil interactive design

## References and purpose

The design uses Resflow (https://resflow.in/) for condensed typography, restrained dark surfaces and scroll-driven composition. The archived Beam Widget presentation at https://curated.design/sites/s/3848/ informs the floating photo surface and precise Mac-like controls. No reference-site assets or code are redistributed.

Three fresh ImageGen section concepts define the hero, results explorer, and method/footer. They are retained privately under .design/v3. Production photography is the owner's explicitly approved real experiment media, not image-generated replacement results.

## Design system

- Near-black #0c0d0f, warm white #eeece6, secondary #969ba2, restrained orange #ff694a.
- Self-hosted Bebas Neue for large display type; self-hosted variable Manrope for body and controls. Licenses are included in assets/fonts.
- One floating photographic hero surface, one precise comparison workspace, open method rows, and an oversized quiet footer wordmark. No metrics, fake editor, or signup form.
- Controls use consistent selected, hover, loading and keyboard-focus states. The comparison stage is stable; decorative perspective motion is limited to the hero.

## Interaction contract

The page contains real browser-state interactions: split percentage with pointer/touch/keyboard, finish selection, three-view mode, three aligned cases, method step selection, and a decorative-motion pause control. Image pairs are preloaded together to prevent mismatched cases. The slider does not call a model. The selected case also updates the hero and method region.

## English above-the-fold copy

ApexVeil; Results; Method; GitHub; EN / 中文; Motion on/off; YOUR SHOT.; YOUR SIGNATURE.; Natural plate replacement and privacy.; The same scene, with your signature.; Explore the results; View on GitHub; Scroll to compare.

## Motion and accessibility

Motion consists of a reveal sweep over real image pairs, slight pointer perspective, gentle scroll parallax, once-only section reveals and footer drift. It can be paused, defaults off for prefers-reduced-motion, stops when the page is hidden, and does not hijack scrolling. Controls remain functional without decorative motion. Keyboard focus and slider value descriptions are explicit.

## Intentional differences from generated concepts

The concept's anonymized or invented plate lettering is replaced with the authorized real original and actual processed output. This is essential to honest comparison. The renderer uses the named real font files rather than rasterized concept typography. The hero's scan is a preview; the results explorer provides the precise draggable control. Case captions identify lighting/view conditions. Mobile stacks the three-view comparison so each result stays readable.

## Concept prompts

Built-in ImageGen was used for three UI mockups, with Resflow's screenshot as a style reference and the actual processed P7+ crop as photographic reference. Hero brief: cinematic black surface, Bebas Neue/Manrope, the exact copy above, floating subtle-perspective photograph and scroll cue. Results brief: SEE THE DIFFERENCE, case buttons, Split/Three views, original/custom divider, Blur/Mosaic/Custom, percentage and thumbnails. Method brief: three selectable surface/appearance/motion rows, true image/geometry panel and open-source footer. No generated concept bitmap is used as functioning UI.

The first method step shows the original image with the detected geometry; the second shows the actual custom result without a simulated lighting overlay. The video step is labeled as development work. This semantic adjustment avoids presenting an artificial tint as algorithm output.

## English and Chinese

The page, live comparison labels, case subtitles, image alternatives, loading/error feedback and percentage descriptions have English and Chinese copy. The first visit uses the browser language; explicit selection is remembered locally. Language switches update existing nodes and preserve comparison, method and motion state. Chinese display text uses Manrope with PingFang SC, Microsoft YaHei or Noto Sans CJK SC fallbacks. No additional page section or layout redesign is part of localization.
