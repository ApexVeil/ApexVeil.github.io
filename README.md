# ApexVeil project website

Source for [apexveil.github.io](https://apexveil.github.io), separate from the [ApexVeil engine](https://github.com/ApexVeil/ApexVeil).

The v3 website is a static, interactive viewer of three authorized real photographic examples: sunset, shade and rear. Each example includes the original, blur, mosaic and custom P7+ replacement. A draggable split comparison, three-view layout and method explorer make the results inspectable. Decorative motion can be paused.

English and Chinese cover the page and comparison controls. The first visit follows the browser language; explicit selection is stored locally. Switching language preserves the selected photograph, finish, comparison layout, divider percentage, method step and motion setting.

These are pre-rendered image experiments, not live inference. The site does not upload media or run models. Robust video replacement and the interactive processing editor remain in development; no experimental videos are published here.

## Preview and checks

Serve the repository root:

```sh
python -m http.server 18766 --bind 127.0.0.1
```

Open `http://127.0.0.1:18766`. For a remote checkout, use ordinary SSH port forwarding; no tunnel code is embedded in the website.

Run the dependency-free Node tests (Node 20 or later):

```sh
node --experimental-default-type=module --test src/compare.test.mjs src/i18n.test.mjs
```

GitHub Pages publishes the `main` branch root. The page has no external tracking or framework dependency. Font files are self-hosted with their OFL licenses.

## Documentation

- [Design and interaction specification](docs/DESIGN.md)
- [Demonstration media provenance and publication scope](docs/DEMO_PROVENANCE.md)
- [Recorded checks and remaining limits](docs/FIDELITY.md)

Private source photographs, model weights, credentials, local caches and design mockups are excluded. Only the explicitly authorized 900 × 505 demonstration crops and small masks are published.

Original source: Apache-2.0. See font licenses separately. ApexVeil naming and identity are not a grant of trademark rights.
