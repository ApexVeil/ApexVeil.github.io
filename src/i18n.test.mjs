import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { messages, resolveLocale, translate, localizedCase, initI18n } from "./i18n.js";
import { initComparison } from "./compare.js";

test("explicit language selection overrides the browser; first visit follows Chinese variants", () => {
  assert.equal(resolveLocale("en", "zh-CN"), "en");
  assert.equal(resolveLocale("zh", "en-US"), "zh");
  assert.equal(resolveLocale(null, "zh-TW"), "zh");
  assert.equal(resolveLocale(null, "zh-Hans"), "zh");
  assert.equal(resolveLocale("unsupported", "en-GB"), "en");
});

test("both languages cover the same keys and every HTML translation key exists", async () => {
  assert.deepEqual(Object.keys(messages.en).sort(), Object.keys(messages.zh).sort());
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  for (const match of html.matchAll(/data-i18n(?:-lines|-aria-label|-alt|-content)?="([^"]+)"/g)) {
    assert.ok(messages.en[match[1]], "Missing key: " + match[1]);
  }
});

test("dynamic percentage and status messages interpolate without mutating case data", () => {
  assert.equal(translate("zh", "cmp.percentage", { original: 73, processed: 27, effect: "马赛克" }), "73% 原图，27% 马赛克");
  assert.equal(translate("en", "cmp.loading", { label: "Rear" }), "Loading Rear…");
  const item = { id: "sunset", label: "Sunset", subtitle: "Warm light", images: { original: "a.jpg" } };
  const snapshot = structuredClone(item);
  assert.deepEqual(localizedCase(item, "zh"), { label: "夕阳", subtitle: "暖色夕照 · 前侧视角" });
  assert.deepEqual(item, snapshot);
  assert.equal(localizedCase({ id: "new", label: "New case", subtitle: "" }, "zh").label, "New case");
});

/** Minimal DOM fixture: exercise the real controller, without a browser/dependency. */
class Element extends EventTarget {
  constructor(tag, ownerDocument) {
    super();
    this.tagName = tag;
    this.ownerDocument = ownerDocument;
    this.children = [];
    this.dataset = {};
    this.attributes = new Map();
    this.className = "";
    this.style = { setProperty() {} };
    this.classList = {
      add: (name) => this.classList.toggle(name, true),
      remove: (name) => this.classList.toggle(name, false),
      toggle: (name, force) => {
        const classes = new Set(this.className.split(" ").filter(Boolean));
        if (force) classes.add(name); else classes.delete(name);
        this.className = [...classes].join(" ");
      },
    };
  }
  append(...nodes) { this.children.push(...nodes); }
  prepend(...nodes) { this.children.unshift(...nodes); }
  replaceChildren(...nodes) { this.children = [...nodes]; }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  getAttribute(name) { return this.attributes.get(name) ?? null; }
  removeAttribute(name) { this.attributes.delete(name); }
  set src(value) { this.setAttribute("src", value); }
  get src() { return this.getAttribute("src"); }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  querySelectorAll(selector) {
    const found = [];
    for (const child of this.children) {
      if (!(child instanceof Element)) continue;
      if (selector[0] === "." && child.className.split(" ").includes(selector.slice(1))) found.push(child);
      found.push(...child.querySelectorAll(selector));
    }
    return found;
  }
  hasPointerCapture() { return false; }
}

function fixture() {
  const win = new EventTarget();
  win.CustomEvent = class extends Event {
    constructor(type, options) { super(type); this.detail = options.detail; }
  };
  win.Image = class {
    set src(value) { this.url = value; queueMicrotask(() => this.onload?.()); }
  };
  win.navigator = { language: "zh-CN" };
  const storage = new Map();
  win.localStorage = { getItem: (key) => storage.get(key), setItem: (key, value) => storage.set(key, value) };
  const doc = new EventTarget();
  doc.defaultView = win;
  doc.documentElement = { lang: "en", dataset: {} };
  doc.createElement = (tag) => new Element(tag, doc);
  doc.createElementNS = (_, tag) => new Element(tag, doc);
  doc.createTextNode = (text) => text;
  doc.querySelectorAll = () => [];
  return { doc, root: doc.createElement("div"), storage };
}

const examples = ["sunset", "rear"].map((id) => ({
  id, label: id, subtitle: id, size: [900, 505],
  images: Object.fromEntries(["original", "blur", "mosaic", "custom"].map((effect) => [effect, id + "-" + effect + ".webp"])),
}));

test("a language change preserves the actual comparison DOM, state and percentage", async () => {
  const { root } = fixture();
  const controller = initComparison(root, examples, { locale: "en" });
  await new Promise(setImmediate);
  controller.setCase("rear");
  controller.setEffect("mosaic");
  controller.setView("three");
  await new Promise(setImmediate);
  const handle = root.querySelector(".cmp-handle");
  handle.dispatchEvent(Object.assign(new Event("keydown"), { key: "ArrowRight", shiftKey: true }));
  const before = controller.getState();
  assert.equal(before.split, 60);
  const shell = root.children[0];
  controller.setLocale("zh-CN");
  assert.deepEqual(controller.getState(), before);
  assert.equal(root.children[0], shell);
  assert.equal(root.querySelector(".cmp-handle"), handle);
  assert.equal(root.querySelector(".cmp-caption").textContent, "车尾视角 · 透视贴合");
  assert.equal(handle.getAttribute("aria-valuetext"), "60% 原图，40% 马赛克");
  assert.equal(root.querySelector(".cmp-range-label").textContent, "拖动滑杆进行对比");
  controller.setLocale("en");
  assert.deepEqual(controller.getState(), before);
  assert.equal(handle.getAttribute("aria-valuetext"), "60% original, 40% mosaic");
  controller.destroy();
});

test("language selection survives reload and updates html.lang without new comparison state", () => {
  const { doc, storage } = fixture();
  let changes = 0;
  doc.addEventListener("apexveil:languagechange", () => changes++);
  const i18n = initI18n(doc);
  assert.equal(doc.documentElement.lang, "zh-CN");
  i18n.setLocale("en");
  assert.equal(doc.documentElement.lang, "en");
  assert.equal(storage.get("apexveil-language"), "en");
  assert.equal(changes, 1);
  const reloaded = initI18n(doc);
  assert.equal(reloaded.getLocale(), "en");
  reloaded.setLocale("en");
  assert.equal(changes, 1);
});
