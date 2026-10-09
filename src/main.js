import { initComparison } from "./compare.js";
import { initI18n, localizedCase } from "./i18n.js";

const html = document.documentElement;
html.classList.add("js");
const i18n = initI18n(document);
const t = i18n.t;
const motionButton = document.querySelector("#motion-toggle");
const motionLabel = document.querySelector("#motion-label");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
let preference;
try { preference = localStorage.getItem("apexveil-motion"); } catch { /* Storage is optional. */ }
let motionEnabled = preference === "off" ? false : !reducedMotion.matches;
let heroVisible = true;
let raf = 0;
let phaseStart = performance.now();
let pointer = { x: 0, y: 0 };
let current = { x: 0, y: 0 };
let activeCase;
let activeStep = "surface";
const hero = document.querySelector(".hero");
const heroVisual = document.querySelector("#hero-visual");
const surface = document.querySelector(".hero-surface");
const footerMark = document.querySelector(".footer-wordmark");
const methodPreview = document.querySelector(".method-preview");
const methodImage = document.querySelector("#method-image");
const geometry = document.querySelector("#method-geometry");
const caption = document.querySelector("#method-caption");

function tick(now) {
  raf = 0;
  if (!motionEnabled || document.hidden || !heroVisible) return;
  const progress = Math.max(0, Math.min(1, scrollY / Math.max(1, hero.offsetHeight)));
  current.x += (pointer.x - current.x) * .055;
  current.y += (pointer.y - current.y) * .055;
  surface.style.setProperty("--pointer-x", current.x.toFixed(3) + "deg");
  surface.style.setProperty("--pointer-y", current.y.toFixed(3) + "deg");
  surface.style.setProperty("--hero-split", (50 + Math.cos((now - phaseStart) / 2500) * 34).toFixed(2) + "%");
  heroVisual.style.setProperty("--hero-scroll", (progress * 44).toFixed(2) + "px");
  raf = requestAnimationFrame(tick);
}

function startMotion() {
  if (!raf && motionEnabled && heroVisible && !document.hidden) raf = requestAnimationFrame(tick);
}

function updateMotionLabels() {
  motionLabel.textContent = t(motionEnabled ? "motion.on" : "motion.off");
  motionButton.setAttribute("aria-label", t(motionEnabled ? "motion.pause" : "motion.enable"));
}

function applyMotion() {
  html.dataset.motion = motionEnabled ? "on" : "off";
  updateMotionLabels();
  motionButton.setAttribute("aria-pressed", String(motionEnabled));
  if (!motionEnabled) {
    cancelAnimationFrame(raf); raf = 0;
    surface.style.setProperty("--hero-split", "84%");
    surface.style.setProperty("--pointer-x", "0deg");
    surface.style.setProperty("--pointer-y", "0deg");
    heroVisual.style.setProperty("--hero-scroll", "0px");
    footerMark.style.setProperty("--footer-drift", "0px");
  } else { phaseStart = performance.now(); startMotion(); }
}

motionButton.addEventListener("click", () => {
  motionEnabled = !motionEnabled;
  preference = motionEnabled ? "on" : "off";
  try { localStorage.setItem("apexveil-motion", motionEnabled ? "on" : "off"); } catch { /* Optional. */ }
  applyMotion();
});
reducedMotion.addEventListener("change", () => {
  motionEnabled = !reducedMotion.matches && preference !== "off";
  applyMotion();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else startMotion();
});
hero.addEventListener("pointermove", (event) => {
  if (!motionEnabled || event.pointerType === "touch") return;
  const rect = hero.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width - .5) * 3;
  pointer.y = -((event.clientY - rect.top) / rect.height - .5) * 2;
});
hero.addEventListener("pointerleave", () => { pointer = { x: 0, y: 0 }; });
const heroObserver = new IntersectionObserver(([entry]) => {
  heroVisible = entry.isIntersecting;
  if (heroVisible) startMotion(); else { cancelAnimationFrame(raf); raf = 0; }
});
heroObserver.observe(hero);

const revealObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) if (entry.isIntersecting) {
    entry.target.classList.add("is-visible"); revealObserver.unobserve(entry.target);
  }
}, { threshold: .06 });
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
(document.fonts?.ready || Promise.resolve()).then(() => html.classList.add("is-ready"));
applyMotion();

function updateMethod() {
  caption.textContent = t("method." + activeStep + ".caption");
  if (!activeCase) return;
  methodPreview.dataset.step = activeStep;
  methodImage.src = activeStep === "surface" ? activeCase.images.original : activeCase.images.custom;
  methodImage.alt = t("method." + activeStep + ".alt", { label: localizedCase(activeCase, i18n.getLocale()).label });
  geometry.setAttribute("viewBox", "0 0 " + activeCase.size.join(" "));
  const points = activeCase.quad.map(([x, y]) => [x * activeCase.size[0], y * activeCase.size[1]]);
  document.querySelector("#surface-polygon").setAttribute("points", points.map((p) => p.join(",")).join(" "));
  const circles = points.map(([x, y]) => {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x); circle.setAttribute("cy", y); circle.setAttribute("r", "4");
    return circle;
  });
  document.querySelector("#surface-points").replaceChildren(...circles);
}
document.querySelectorAll(".method-step").forEach((button) => button.addEventListener("click", () => {
  activeStep = button.dataset.step;
  document.querySelectorAll(".method-step").forEach((item) => {
    const active = item === button; item.classList.toggle("is-active", active); item.setAttribute("aria-pressed", String(active));
  });
  updateMethod();
}));

const compareRoot = document.querySelector("#comparison-root");
let comparison;
function updateHeroLabel() {
  if (activeCase) document.querySelector("#hero-custom").alt = t("hero.image", { label: localizedCase(activeCase, i18n.getLocale()).label });
}
document.addEventListener("apexveil:languagechange", () => {
  comparison?.setLocale(i18n.getLocale());
  updateMotionLabels();
  updateMethod();
  updateHeroLabel();
});
updateMethod();
compareRoot.addEventListener("casechange", (event) => {
  activeCase = event.detail.case;
  document.querySelector("#hero-original").src = activeCase.images.original;
  document.querySelector("#hero-custom").src = activeCase.images.custom;
  updateHeroLabel();
  updateMethod();
});
try {
  const response = await fetch(new URL("../assets/demos/cases.json", import.meta.url));
  if (!response.ok) throw new Error("Image manifest unavailable");
  const cases = await response.json();
  comparison = initComparison(compareRoot, cases, { locale: i18n.getLocale() });
  compareRoot.addEventListener("input", (event) => {
    if (event.target.matches(".cmp-range")) event.target.style.setProperty("--range-fill", event.target.value + "%");
  });
  const observer = new MutationObserver(() => {
    const range = compareRoot.querySelector(".cmp-range");
    const handle = compareRoot.querySelector(".cmp-handle");
    if (range && handle) range.style.setProperty("--range-fill", handle.getAttribute("aria-valuenow") + "%");
  });
  const handle = compareRoot.querySelector(".cmp-handle");
  if (handle) observer.observe(handle, { attributes: true, attributeFilter: ["aria-valuenow"] });
} catch (error) {
  const text = document.createElement("p"); text.className = "loading-copy";
  text.dataset.i18n = "results.error"; text.textContent = t("results.error");
  const retry = document.createElement("button"); retry.type = "button"; retry.className = "button-primary"; retry.dataset.i18n = "results.retry"; retry.textContent = t("results.retry");
  retry.addEventListener("click", () => location.reload());
  compareRoot.replaceChildren(text, retry);
  console.error("ApexVeil examples:", error.message);
}

let scrollQueued = false;
addEventListener("scroll", () => {
  if (!motionEnabled || scrollQueued) return;
  scrollQueued = true;
  requestAnimationFrame(() => {
    const rect = footerMark.getBoundingClientRect();
    if (rect.top < innerHeight && rect.bottom > 0) footerMark.style.setProperty("--footer-drift", ((rect.top / innerHeight - .5) * 22).toFixed(2) + "px");
    scrollQueued = false;
  });
}, { passive: true });
