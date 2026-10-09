import test from "node:test";
import assert from "node:assert/strict";
import { clampSplit, nextComparisonState, validateCases } from "./compare.js";

const initial = () => ({
  caseId: "sunset", effect: "custom", privacy: "blur", view: "split", split: 50,
});
const ids = ["sunset", "shade", "rear"];
const photograph = () => ({
  id: "sunset", label: "Sunset", subtitle: "One real scene.",
  size: [1800, 1000],
  images: { original: "o.jpg", blur: "b.jpg", mosaic: "m.jpg", custom: "c.jpg" },
});

test("the divider clamps at both image boundaries and tolerates invalid input", () => {
  assert.equal(clampSplit(-2), 0);
  assert.equal(clampSplit(108), 100);
  assert.equal(clampSplit("32.4"), 32.4);
  assert.equal(clampSplit(Number.NaN), 50);
  assert.equal(clampSplit(Infinity), 50);
});

test("switching cases preserves the chosen effect, layout and divider", () => {
  const before = { ...initial(), effect: "mosaic", privacy: "mosaic", view: "three", split: 72.5 };
  const after = nextComparisonState(before, { type: "case", value: "rear" }, ids);
  assert.deepEqual(after, { ...before, caseId: "rear" });
  assert.equal(before.caseId, "sunset");
});

test("the triptych remembers Mosaic when the main effect returns to Custom", () => {
  let state = nextComparisonState(initial(), { type: "effect", value: "mosaic" }, ids);
  state = nextComparisonState(state, { type: "view", value: "three" }, ids);
  state = nextComparisonState(state, { type: "effect", value: "custom" }, ids);
  assert.equal(state.effect, "custom");
  assert.equal(state.privacy, "mosaic");
  assert.equal(state.view, "three");
});

test("selecting Blur replaces the remembered privacy effect", () => {
  const before = { ...initial(), privacy: "mosaic" };
  const after = nextComparisonState(before, { type: "effect", value: "blur" }, ids);
  assert.equal(after.privacy, "blur");
  assert.equal(after.effect, "blur");
});

test("unknown public controller values cannot create an invalid state", () => {
  const before = initial();
  for (const action of [
    { type: "case", value: "missing" },
    { type: "effect", value: "missing" },
    { type: "view", value: "missing" },
    { type: "unknown", value: "missing" },
  ]) assert.equal(nextComparisonState(before, action, ids), before);
});

test("input cases are copied so component normalization does not mutate callers", () => {
  const input = photograph();
  const normalized = validateCases([input])[0];
  normalized.images.custom = "different.jpg";
  normalized.size[0] = 100;
  assert.equal(input.images.custom, "c.jpg");
  assert.equal(input.size[0], 1800);
});

test("missing variants, duplicate identities and invalid dimensions fail early", () => {
  const missing = photograph();
  delete missing.images.blur;
  assert.throws(() => validateCases([missing]), /original, blur, mosaic and custom/);
  assert.throws(() => validateCases([photograph(), photograph()]), /unique/);
  assert.throws(() => validateCases([{ ...photograph(), size: [0, 20] }]), /positive/);
  assert.throws(() => validateCases([]), /at least one/);
});
