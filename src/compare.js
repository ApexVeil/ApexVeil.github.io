import { normalizeLocale, translate, localizedCase } from "./i18n.js";

/**
 * A dependency-free, accessible comparison viewer.
 *
 * initComparison(element, [{ id, label, subtitle, images: {
 *   original, blur, mosaic, custom
 * }, quad, size: [width, height] }])
 *
 * Presentation belongs to style.css. The only geometry written by this module
 * is --split (percentage), --cmp-aspect and --cmp-aspect-value.
 */
const EFFECTS = Object.freeze(["blur", "mosaic", "custom"]);
const VIEWS = Object.freeze(["split", "three"]);

export function clampSplit(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.min(100, number)) : 50;
}

/** Keep the privacy column independent of a subsequent Custom selection. */
export function nextComparisonState(state, action, caseIds) {
  switch (action.type) {
    case "case":
      if (!caseIds.includes(action.value)) return state;
      return { ...state, caseId: action.value };
    case "effect":
      if (!EFFECTS.includes(action.value)) return state;
      return {
        ...state,
        effect: action.value,
        privacy: action.value === "custom" ? state.privacy : action.value,
      };
    case "view":
      return VIEWS.includes(action.value) ? { ...state, view: action.value } : state;
    case "split":
      return { ...state, split: clampSplit(action.value) };
    default:
      return state;
  }
}

export function validateCases(cases) {
  if (!Array.isArray(cases) || cases.length === 0) {
    throw new TypeError("Comparison requires at least one image case.");
  }
  const ids = new Set();
  return cases.map((item) => {
    if (!item || typeof item.id !== "string" || !item.id || ids.has(item.id)) {
      throw new TypeError("Every comparison case needs a unique, nonempty string id.");
    }
    ids.add(item.id);
    if (!item.images || ["original", ...EFFECTS].some((name) => {
      return typeof item.images[name] !== "string" || !item.images[name].trim();
    })) {
      throw new TypeError("Case " + item.id + " needs original, blur, mosaic and custom images.");
    }
    const size = item.size;
    if (!Array.isArray(size) || size.length !== 2 || size.some((n) => !Number.isFinite(n) || n <= 0)) {
      throw new TypeError("Case " + item.id + " needs positive image dimensions.");
    }
    return {
      ...item,
      label: String(item.label || item.id),
      subtitle: String(item.subtitle || ""),
      images: { ...item.images },
      size: [...size],
    };
  });
}

let instanceCount = 0;

export function initComparison(root, inputCases, options = {}) {
  if (!root || !root.ownerDocument) throw new TypeError("A comparison root element is required.");
  const cases = validateCases(inputCases);
  const doc = root.ownerDocument;
  const win = doc.defaultView;
  let locale = normalizeLocale(options.locale || doc.documentElement.lang);
  const t = (key, values) => translate(locale, key, values);
  const caseCopy = (item) => localizedCase(item, locale);
  const effectLabel = (effect) => t("cmp." + effect);
  let statusKind = "";
  const instanceId = "cmp-" + (++instanceCount);
  const caseIds = cases.map((item) => item.id);
  const byId = new Map(cases.map((item) => [item.id, item]));
  const listeners = [];
  const imagePromises = new Map();
  let destroyed = false;
  let loadVersion = 0;
  let dragPointer = null;
  let dragRect = null;
  let displayedCaseId = null;
  let state = { caseId: cases[0].id, effect: "custom", privacy: "blur", view: "split", split: 50 };

  function el(tag, className, text) {
    const element = doc.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function listen(target, name, handler, options) {
    target.addEventListener(name, handler, options);
    listeners.push(() => target.removeEventListener(name, handler, options));
  }

  function button(className, text, action) {
    const element = el("button", className, text);
    element.type = "button";
    listen(element, "click", action);
    return element;
  }

  function group(className, label) {
    const element = el("div", className);
    element.setAttribute("role", "group");
    element.setAttribute("aria-label", label);
    return element;
  }

  function pressed(element, active) {
    element.setAttribute("aria-pressed", String(active));
    element.classList.toggle("is-active", active);
  }

  const shell = el("div", "cmp-shell");
  const toolbar = el("div", "cmp-toolbar");
  const caseGroup = group("cmp-cases", "Choose a photograph");
  const caseButtons = new Map();
  cases.forEach((item, index) => {
    const element = button("cmp-case-button", undefined, () => setCase(item.id));
    element.append(el("span", "cmp-case-label", caseCopy(item).label));
    element.dataset.case = item.id;
    const number = el("span", "cmp-case-number", String(index + 1).padStart(2, "0"));
    number.setAttribute("aria-hidden", "true");
    element.prepend(number);
    caseButtons.set(item.id, element);
    caseGroup.append(element);
  });

  const viewGroup = group("cmp-view-switch", "Comparison layout");
  const viewButtons = new Map();
  [["split", "Split"], ["three", "Three views"]].forEach(([value, label]) => {
    const element = button("cmp-view-button", label, () => setView(value));
    element.dataset.view = value;
    viewButtons.set(value, element);
    viewGroup.append(element);
  });
  toolbar.append(caseGroup, viewGroup);

  const workspace = el("div", "cmp-workspace");
  workspace.style.setProperty("--cmp-aspect", cases[0].size[0] + " / " + cases[0].size[1]);
  workspace.style.setProperty("--cmp-aspect-value", String(cases[0].size[0] / cases[0].size[1]));
  const stage = el("div", "cmp-stage");
  stage.setAttribute("aria-label", "Interactive before and after image comparison");
  const original = el("img", "cmp-image cmp-original");
  const after = el("div", "cmp-after");
  const processed = el("img", "cmp-image cmp-processed");
  [original, processed].forEach((image) => {
    image.draggable = false;
    image.decoding = "async";
  });
  after.append(processed);
  const originalLabel = el("span", "cmp-image-label cmp-image-label--original", "Original");
  const resultLabel = el("span", "cmp-image-label cmp-image-label--result", "Custom");
  originalLabel.setAttribute("aria-hidden", "true");
  resultLabel.setAttribute("aria-hidden", "true");

  const divider = el("div", "cmp-divider");
  const handle = el("div", "cmp-handle");
  handle.tabIndex = 0;
  handle.setAttribute("role", "slider");
  handle.setAttribute("aria-label", "Before and after divider");
  handle.setAttribute("aria-valuemin", "0");
  handle.setAttribute("aria-valuemax", "100");
  handle.setAttribute("aria-orientation", "horizontal");
  const handleIcon = el("span", "cmp-handle-icon");
  handleIcon.setAttribute("aria-hidden", "true");
  const svg = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  const path = doc.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "m8 7-5 5 5 5m8-10 5 5-5 5");
  svg.append(path); handleIcon.append(svg);
  handle.append(handleIcon);
  divider.append(handle);
  stage.append(original, after, originalLabel, resultLabel, divider);

  const triptych = el("div", "cmp-triptych");
  const panels = new Map();
  [
    ["original", "Original", "The source photograph"],
    ["privacy", "Blur", "Keep the scene. Hide the details."],
    ["custom", "Custom", "A new surface, in the same scene."],
  ].forEach(([key, label, note]) => {
    const panel = el("figure", "cmp-panel cmp-panel--" + key);
    const media = el("div", "cmp-panel-media");
    const image = el("img", "cmp-panel-image");
    image.draggable = false;
    image.decoding = "async";
    media.append(image);
    const caption = el("figcaption", "cmp-panel-caption");
    const title = el("span", "cmp-panel-label", label);
    const description = el("span", "cmp-panel-note", note);
    caption.append(title, description);
    panel.append(media, caption);
    triptych.append(panel);
    panels.set(key, { panel, image, title, description });
  });
  workspace.append(stage, triptych);

  const controls = el("div", "cmp-controls");
  const effectGroup = group("cmp-effect-switch", "Choose a finish");
  const effectButtons = new Map();
  EFFECTS.forEach((effect) => {
    const element = button("cmp-effect-button", undefined, () => setEffect(effect));
    element.append(el("span", "cmp-effect-label", effectLabel(effect)));
    element.dataset.effect = effect;
    const dot = el("span", "cmp-effect-dot cmp-effect-dot--" + effect);
    dot.setAttribute("aria-hidden", "true");
    element.prepend(dot);
    effectButtons.set(effect, element);
    effectGroup.append(element);
  });
  const rangeGroup = el("div", "cmp-range-group");
  const rangeLabel = el("label", "cmp-range-label", "Drag to compare");
  const range = el("input", "cmp-range");
  range.type = "range";
  range.min = "0";
  range.max = "100";
  range.step = "0.1";
  range.value = "50";
  range.id = instanceId + "-range";
  rangeLabel.htmlFor = range.id;
  const percentage = el("output", "cmp-percentage", "50%");
  percentage.setAttribute("for", range.id);
  rangeGroup.append(rangeLabel, range, percentage);
  controls.append(effectGroup, rangeGroup);

  const caption = el("p", "cmp-caption");
  const status = el("p", "cmp-status");
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  status.hidden = true;

  const thumbs = group("cmp-thumbs", "Photograph thumbnails");
  const thumbButtons = new Map();
  cases.forEach((item) => {
    const thumb = button("cmp-thumb", undefined, () => setCase(item.id));
    thumb.setAttribute("aria-label", "View " + item.label);
    const image = el("img", "cmp-thumb-image");
    image.alt = "";
    image.src = item.images.custom;
    image.loading = "lazy";
    image.decoding = "async";
    const text = el("span", "cmp-thumb-label", item.label);
    thumb.append(image, text);
    thumbs.append(thumb);
    thumbButtons.set(item.id, thumb);
  });

  shell.append(toolbar, workspace, controls, caption, status, thumbs);
  root.replaceChildren(shell);

  function emit(name, detail) {
    root.dispatchEvent(new win.CustomEvent(name, { bubbles: true, detail }));
  }

  function updateSplit() {
    const percentageValue = state.split + "%";
    stage.style.setProperty("--split", percentageValue);
    range.value = String(state.split);
    const rounded = Math.round(state.split);
    percentage.value = rounded + "%";
    handle.setAttribute("aria-valuenow", String(rounded));
    const description = t("cmp.percentage", { original: rounded, processed: 100 - rounded, effect: effectLabel(state.effect).toLowerCase() });
    handle.setAttribute("aria-valuetext", description);
    range.setAttribute("aria-valuetext", description);
  }

  function updateControls() {
    root.dataset.view = state.view;
    root.dataset.effect = state.effect;
    root.dataset.case = state.caseId;
    workspace.dataset.view = state.view;
    caseButtons.forEach((element, id) => pressed(element, id === state.caseId));
    thumbButtons.forEach((element, id) => pressed(element, id === state.caseId));
    viewButtons.forEach((element, value) => pressed(element, value === state.view));
    effectButtons.forEach((element, value) => pressed(element, value === state.effect));
    stage.hidden = state.view !== "split";
    triptych.hidden = state.view !== "three";
    rangeGroup.hidden = state.view !== "split";
    resultLabel.textContent = effectLabel(state.effect);
    panels.get("privacy").title.textContent = effectLabel(state.privacy);
    updateSplit();
  }

  function preload(url) {
    if (!imagePromises.has(url)) {
      const promise = new Promise((resolve, reject) => {
        const image = new win.Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error("Could not load a comparison image."));
        image.src = url;
      }).catch((error) => {
        imagePromises.delete(url);
        throw error;
      });
      imagePromises.set(url, promise);
    }
    return imagePromises.get(url);
  }

  function applyImages(item) {
    const setImage = (image, src, label) => {
      if (image.getAttribute("src") !== src) image.src = src;
      image.alt = caseCopy(item).label + " — " + label;
      image.width = item.size[0];
      image.height = item.size[1];
    };
    setImage(original, item.images.original, t("cmp.original.alt"));
    setImage(processed, item.images[state.effect], t("cmp.treatment.alt", { effect: effectLabel(state.effect).toLowerCase() }));
    setImage(panels.get("original").image, item.images.original, t("cmp.original.alt"));
    setImage(panels.get("privacy").image, item.images[state.privacy], t("cmp.treatment.alt", { effect: effectLabel(state.privacy).toLowerCase() }));
    setImage(panels.get("custom").image, item.images.custom, t("cmp.custom.alt"));
    workspace.style.setProperty("--cmp-aspect", item.size[0] + " / " + item.size[1]);
    workspace.style.setProperty("--cmp-aspect-value", String(item.size[0] / item.size[1]));
    caption.textContent = caseCopy(item).subtitle;
    displayedCaseId = item.id;
  }

  async function loadCase() {
    const item = byId.get(state.caseId);
    const version = ++loadVersion;
    root.setAttribute("aria-busy", "true");
    workspace.classList.add("is-loading");
    statusKind = "loading";
    status.textContent = t("cmp.loading", { label: caseCopy(item).label });
    status.hidden = false;
    try {
      // Commit all variants together so the two sides never show different cases.
      await Promise.all(Object.values(item.images).map(preload));
      if (destroyed || version !== loadVersion) return;
      applyImages(item);
      updateControls();
      statusKind = "";
      status.hidden = true;
      workspace.classList.remove("is-loading");
      root.setAttribute("aria-busy", "false");
      emit("casechange", { id: item.id, case: item, state: getState() });
    } catch (error) {
      if (destroyed || version !== loadVersion) return;
      workspace.classList.remove("is-loading");
      root.setAttribute("aria-busy", "false");
      if (displayedCaseId) {
        state = { ...state, caseId: displayedCaseId };
        applyImages(byId.get(displayedCaseId));
        updateControls();
      }
      statusKind = "error";
      status.textContent = t("cmp.error");
      status.hidden = false;
      emit("comparisonerror", { id: item.id, message: error.message });
    }
  }

  function setLocale(value) {
    if (destroyed) return locale;
    locale = normalizeLocale(value);
    caseGroup.setAttribute("aria-label", t("cmp.chooseCase"));
    viewGroup.setAttribute("aria-label", t("cmp.layout"));
    stage.setAttribute("aria-label", t("cmp.stage"));
    handle.setAttribute("aria-label", t("cmp.divider"));
    effectGroup.setAttribute("aria-label", t("cmp.finish"));
    thumbs.setAttribute("aria-label", t("cmp.thumbnails"));
    rangeLabel.textContent = t("cmp.drag");
    originalLabel.textContent = t("cmp.original");
    viewButtons.forEach((element, view) => { element.textContent = t("cmp." + view); });
    caseButtons.forEach((element, id) => {
      element.querySelector(".cmp-case-label").textContent = caseCopy(byId.get(id)).label;
    });
    thumbButtons.forEach((element, id) => {
      const label = caseCopy(byId.get(id)).label;
      element.setAttribute("aria-label", t("cmp.viewCase", { label }));
      element.querySelector(".cmp-thumb-label").textContent = label;
    });
    effectButtons.forEach((element, effect) => {
      element.querySelector(".cmp-effect-label").textContent = effectLabel(effect);
    });
    panels.forEach((panel, key) => {
      panel.description.textContent = t("cmp." + key + ".note");
      panel.title.textContent = effectLabel(key === "privacy" ? state.privacy : key);
    });
    if (displayedCaseId) applyImages(byId.get(displayedCaseId));
    if (statusKind === "loading") {
      status.textContent = t("cmp.loading", { label: caseCopy(byId.get(state.caseId)).label });
    } else if (statusKind === "error") {
      status.textContent = t("cmp.error");
    }
    updateControls();
    return locale;
  }

  function getState() {
    return { ...state };
  }

  function setCase(id) {
    if (destroyed || !byId.has(id)) return getState();
    state = nextComparisonState(state, { type: "case", value: id }, caseIds);
    updateControls();
    loadCase();
    return getState();
  }

  function setEffect(effect) {
    if (destroyed || !EFFECTS.includes(effect)) return getState();
    state = nextComparisonState(state, { type: "effect", value: effect }, caseIds);
    if (displayedCaseId === state.caseId) applyImages(byId.get(state.caseId));
    updateControls();
    return getState();
  }

  function setView(view) {
    if (destroyed || !VIEWS.includes(view)) return getState();
    state = nextComparisonState(state, { type: "view", value: view }, caseIds);
    updateControls();
    return getState();
  }

  function setSplit(value) {
    if (destroyed) return;
    state = nextComparisonState(state, { type: "split", value }, caseIds);
    updateSplit();
  }

  listen(range, "input", () => setSplit(range.value));
  listen(handle, "keydown", (event) => {
    const step = event.shiftKey ? 10 : 1;
    let next;
    switch (event.key) {
      case "ArrowLeft":
      case "ArrowDown": next = state.split - step; break;
      case "ArrowRight":
      case "ArrowUp": next = state.split + step; break;
      case "Home": next = 0; break;
      case "End": next = 100; break;
      case "PageDown": next = state.split - 10; break;
      case "PageUp": next = state.split + 10; break;
      default: return;
    }
    event.preventDefault();
    setSplit(next);
  });

  function positionPointer(event) {
    if (!dragRect || !dragRect.width) return;
    setSplit((event.clientX - dragRect.left) / dragRect.width * 100);
  }

  listen(stage, "pointerdown", (event) => {
    if (event.button !== 0 || dragPointer !== null || state.view !== "split") return;
    dragPointer = event.pointerId;
    dragRect = stage.getBoundingClientRect();
    stage.setPointerCapture(event.pointerId);
    stage.classList.add("is-dragging");
    positionPointer(event);
    if (event.target === handle || handle.contains(event.target)) {
      handle.focus({ preventScroll: true });
    }
    // Touch scrolling remains available off the handle (CSS: pan-y on stage).
    if (event.pointerType === "mouse") event.preventDefault();
  });

  listen(stage, "pointermove", (event) => {
    if (event.pointerId === dragPointer) positionPointer(event);
  });

  function endDrag(event) {
    if (event.pointerId !== dragPointer) return;
    if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    dragPointer = null;
    dragRect = null;
    stage.classList.remove("is-dragging");
  }
  listen(stage, "pointerup", endDrag);
  listen(stage, "pointercancel", endDrag);
  listen(stage, "lostpointercapture", endDrag);
  listen(win, "resize", () => {
    if (dragPointer !== null) dragRect = stage.getBoundingClientRect();
  });

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    ++loadVersion;
    if (dragPointer !== null && stage.hasPointerCapture(dragPointer)) stage.releasePointerCapture(dragPointer);
    dragPointer = null;
    listeners.forEach((remove) => remove());
    root.replaceChildren();
    root.removeAttribute("aria-busy");
    delete root.dataset.view;
    delete root.dataset.effect;
    delete root.dataset.case;
    imagePromises.clear();
  }

  setLocale(locale);
  loadCase();
  return { getState, setCase, setEffect, setView, setLocale, destroy };
}
