/** Small, local-only EN/ZH dictionary. No external requests or framework. */
export const messages = Object.freeze({
  en: Object.freeze({
    "nav.video": "Video",
    "video.eyebrow": "In motion",
    "video.title": "Every frame, together.",
    "video.description": "One continuous drive-by.\nOriginal, native mask and the final composite.",
    "video.rgb": "RGB · Original",
    "video.sam": "SAM 3.1 · Mask",
    "video.result": "ApexVeil · Replace",
    "video.player": "Drive-by video comparison: RGB, SAM 3.1 mask and ApexVeil replacement",
    "video.fallback": "Download the comparison video",
    "video.metadata": "3.3 seconds · 30 fps · Offline processing",
    "video.caption": "A real processed clip. Watch the plate approach and leave the frame.",
    "video.download": "Download original demo",
    "video.note": "A short-shot experiment, not a universal quality benchmark. Open fullscreen to inspect the details.",
    "video.studio": "Run your own Studio ↗",

    "page.title": "ApexVeil · 极影 — Your shot. Your signature.",
    "page.description": "Explore real automotive image and video experiments: blur, mosaic, custom plate replacement and a reusable offline Studio.",
    "page.ogDescription": "Your shot. Your signature. Explore the real before-and-after results.",
    "nav.skip": "Skip to results",
    "nav.home": "ApexVeil home",
    "nav.main": "Main navigation",
    "nav.results": "Results",
    "nav.method": "Method",
    "nav.language": "Website language",
    "motion.on": "Motion on",
    "motion.off": "Motion off",
    "motion.pause": "Pause decorative motion",
    "motion.enable": "Enable decorative motion",
    "hero.line1": "Your shot.",
    "hero.line2": "Your signature.",
    "hero.description": "Natural plate replacement and privacy.\nThe same scene, with your signature.",
    "hero.explore": "Explore the results",
    "hero.github": "View on GitHub",
    "hero.preview": "Explore the interactive before and after results",
    "hero.image": "{label} — a real P7+ plate replacement experiment.",
    "hero.initialImage": "A real P7+ plate replacement experiment in warm sunset light.",
    "method.initialAlt": "The selected example with its detected surface outline.",
    "hero.scroll": "Scroll to compare",
    "results.title": "See the difference.",
    "results.instructions": "Drag the divider. Switch the finish.\nInspect the details.",
    "results.loading": "Loading the image examples…",
    "results.note": "Pre-rendered image examples. No upload required.",
    "results.error": "The examples could not be loaded. Reload the page to try again.",
    "results.retry": "Reload examples",
    "method.eyebrow": "Method explorer",
    "method.title": "Every detail\nstays in frame.",
    "method.group": "Explore the method",
    "method.surface.title": "Find the surface",
    "method.surface.description": "Select the region. Keep the foreground.",
    "method.appearance.title": "Match the scene",
    "method.appearance.description": "Perspective, light and texture belong together.",
    "method.motion.title": "Follow the motion",
    "method.motion.description": "Stabilize geometry and appearance over time.",
    "method.surface.caption": "Region selected",
    "method.appearance.caption": "Light and perspective matched",
    "method.motion.caption": "Explore the video demo above",
    "method.surface.alt": "{label} — original surface and detected geometry",
    "method.appearance.alt": "{label} — custom replacement with light and perspective matching",
    "method.motion.alt": "{label} — still-image method illustration; the real video demo is above",
    "open.eyebrow": "Open source",
    "open.title": "Built in the open.",
    "open.description": "A shared image and video engine. Reusable segmentation, deterministic composition and an optional AI guide.",
    "open.code": "Explore the code",
    "open.roadmap": "Read the roadmap",
    "footer.tagline": "Precision in motion.",
    "cmp.chooseCase": "Choose a photograph",
    "cmp.layout": "Comparison layout",
    "cmp.split": "Split",
    "cmp.three": "Three views",
    "cmp.stage": "Interactive before and after image comparison",
    "cmp.original": "Original",
    "cmp.blur": "Blur",
    "cmp.mosaic": "Mosaic",
    "cmp.custom": "Custom",
    "cmp.divider": "Before and after divider",
    "cmp.original.note": "The source photograph",
    "cmp.privacy.note": "Keep the scene. Hide the details.",
    "cmp.custom.note": "A new surface, in the same scene.",
    "cmp.finish": "Choose a finish",
    "cmp.drag": "Drag to compare",
    "cmp.thumbnails": "Photograph thumbnails",
    "cmp.viewCase": "View {label}",
    "cmp.percentage": "{original}% original, {processed}% {effect}",
    "cmp.original.alt": "original photograph",
    "cmp.treatment.alt": "{effect} treatment",
    "cmp.custom.alt": "custom surface replacement",
    "cmp.loading": "Loading {label}…",
    "cmp.error": "This photograph could not be loaded. Choose another photograph or try again.",
    "case.sunset.label": "Sunset",
    "case.sunset.subtitle": "Warm light · front three-quarter",
    "case.shade.label": "Shade",
    "case.shade.subtitle": "Soft shade · front detail",
    "case.rear.label": "Rear",
    "case.rear.subtitle": "Rear view · perspective",
  }),
  zh: Object.freeze({
    "nav.video": "视频",
    "video.eyebrow": "真实动态演示",
    "video.title": "每一帧，连贯如一。",
    "video.description": "一段连续驶过的镜头。\n原始画面、原生遮罩与最终合成，同步呈现。",
    "video.rgb": "RGB · 原始画面",
    "video.sam": "SAM 3.1 · 遮罩",
    "video.result": "ApexVeil · 替换",
    "video.player": "车辆驶过视频对比：原始画面、SAM 3.1 遮罩与 ApexVeil 替换结果",
    "video.fallback": "下载三栏对比视频",
    "video.metadata": "3.3 秒 · 30 fps · 离线处理",
    "video.caption": "真实处理片段，查看车牌靠近与移出画面时的效果。",
    "video.download": "下载原始演示视频",
    "video.note": "这是一个短镜头实验，不代表所有场景的效果。建议全屏查看细节。",
    "video.studio": "运行自己的 Studio ↗",

    "page.title": "ApexVeil · 极影 — 你的镜头，你的风格。",
    "page.description": "探索真实汽车影像的处理效果：原图、模糊、马赛克与自定义车牌替换。ApexVeil 极影正在开源迭代。",
    "page.ogDescription": "你的镜头，你的风格。交互查看真实的处理前后对比。",
    "nav.skip": "跳到效果对比",
    "nav.home": "ApexVeil 极影首页",
    "nav.main": "主导航",
    "nav.results": "效果",
    "nav.method": "方法",
    "nav.language": "网站语言",
    "motion.on": "动效开启",
    "motion.off": "动效关闭",
    "motion.pause": "暂停装饰动效",
    "motion.enable": "开启动效",
    "hero.line1": "你的镜头。",
    "hero.line2": "你的风格。",
    "hero.description": "自然融入的车牌替换与隐私遮挡。\n保留真实场景，呈现你的风格。",
    "hero.explore": "探索处理效果",
    "hero.github": "在 GitHub 查看",
    "hero.preview": "探索交互式处理前后对比",
    "hero.image": "{label} — 真实的 P7+ 铭牌替换实验。",
    "hero.initialImage": "暖色夕照下的真实 P7+ 铭牌替换实验。",
    "method.initialAlt": "当前示例与检测到的目标表面轮廓。",
    "hero.scroll": "向下探索对比",
    "results.title": "效果，眼见为实。",
    "results.instructions": "拖动分界线，切换处理方式。\n查看每一处细节。",
    "results.loading": "正在加载图片示例…",
    "results.note": "预先生成的真实图片示例，无需上传。",
    "results.error": "示例加载失败，请刷新页面重试。",
    "results.retry": "重新加载示例",
    "method.eyebrow": "探索方法",
    "method.title": "每一处细节，\n都自然入镜。",
    "method.group": "探索处理方法",
    "method.surface.title": "定位目标表面",
    "method.surface.description": "选中目标区域，保留前景遮挡。",
    "method.appearance.title": "融入真实场景",
    "method.appearance.description": "让透视、光影与质感协调一致。",
    "method.motion.title": "跟随镜头运动",
    "method.motion.description": "在时间维度稳定几何、光影与质感。",
    "method.surface.caption": "已选中目标区域",
    "method.appearance.caption": "匹配光影与透视",
    "method.motion.caption": "向上查看真实视频演示",
    "method.surface.alt": "{label} — 原始表面与检测到的几何轮廓",
    "method.appearance.alt": "{label} — 匹配光影与透视的自定义替换结果",
    "method.motion.alt": "{label} — 处理方法的静态示意，真实视频演示位于上方",
    "open.eyebrow": "开源项目",
    "open.title": "开放开发，共同进步。",
    "open.description": "图片与视频共享同一套引擎。复用识别结果，以确定性合成处理场景，并可选 AI 指导。",
    "open.code": "探索源代码",
    "open.roadmap": "查看路线图",
    "footer.tagline": "于动感中，见精准。",
    "cmp.chooseCase": "选择照片",
    "cmp.layout": "对比布局",
    "cmp.split": "滑动对比",
    "cmp.three": "三栏对比",
    "cmp.stage": "交互式处理前后对比",
    "cmp.original": "原图",
    "cmp.blur": "模糊",
    "cmp.mosaic": "马赛克",
    "cmp.custom": "自定义",
    "cmp.divider": "处理前后分界线",
    "cmp.original.note": "未经处理的原始照片",
    "cmp.privacy.note": "保留场景，隐藏号码。",
    "cmp.custom.note": "更换表面，自然融入原景。",
    "cmp.finish": "选择处理方式",
    "cmp.drag": "拖动滑杆进行对比",
    "cmp.thumbnails": "照片缩略图",
    "cmp.viewCase": "查看{label}",
    "cmp.percentage": "{original}% 原图，{processed}% {effect}",
    "cmp.original.alt": "原始照片",
    "cmp.treatment.alt": "{effect}处理结果",
    "cmp.custom.alt": "自定义铭牌替换结果",
    "cmp.loading": "正在加载{label}…",
    "cmp.error": "这张照片加载失败，请选择其他照片或重试。",
    "case.sunset.label": "夕阳",
    "case.sunset.subtitle": "暖色夕照 · 前侧视角",
    "case.shade.label": "阴影",
    "case.shade.subtitle": "柔和阴影 · 车头细节",
    "case.rear.label": "车尾",
    "case.rear.subtitle": "车尾视角 · 透视贴合",
  }),
});

export function normalizeLocale(value) {
  return typeof value === "string" && /^zh(?:-|$)/i.test(value) ? "zh" : "en";
}

export function resolveLocale(stored) {
  return stored === "zh" ? "zh" : "en";
}

export function translate(locale, key, values = {}) {
  const text = messages[normalizeLocale(locale)][key] ?? messages.en[key] ?? key;
  return text.replace(/\{(\w+)\}/g, (match, name) => {
    return Object.prototype.hasOwnProperty.call(values, name) ? String(values[name]) : match;
  });
}

export function localizedCase(item, locale) {
  const dictionary = messages[normalizeLocale(locale)];
  return {
    label: dictionary["case." + item.id + ".label"] ?? item.label,
    subtitle: dictionary["case." + item.id + ".subtitle"] ?? item.subtitle,
  };
}

export function applyTranslations(doc, locale) {
  const language = normalizeLocale(locale);
  doc.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  doc.documentElement.dataset.language = language;
  doc.title = translate(language, "page.title");
  doc.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = translate(language, node.dataset.i18n);
  });
  doc.querySelectorAll("[data-i18n-lines]").forEach((node) => {
    const lines = translate(language, node.dataset.i18nLines).split("\n");
    const children = [];
    lines.forEach((line, index) => {
      if (index) {
        const br = doc.createElement("br");
        if (node.dataset.i18nBreakClass) br.className = node.dataset.i18nBreakClass;
        children.push(br);
      }
      children.push(doc.createTextNode(line));
    });
    node.replaceChildren(...children);
  });
  ["aria-label", "alt", "content"].forEach((attribute) => {
    doc.querySelectorAll("[data-i18n-" + attribute + "]").forEach((node) => {
      node.setAttribute(attribute, translate(language, node.getAttribute("data-i18n-" + attribute)));
    });
  });
  doc.querySelectorAll("[data-locale]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.locale === language));
  });
}

export function initI18n(doc) {
  const win = doc.defaultView;
  let saved;
  try { saved = win.localStorage.getItem("apexveil-language"); } catch { /* Storage is optional. */ }
  let locale = resolveLocale(saved);
  function setLocale(value) {
    const next = normalizeLocale(value);
    try { win.localStorage.setItem("apexveil-language", next); } catch { /* Optional. */ }
    if (next === locale) return locale;
    locale = next;
    applyTranslations(doc, locale);
    doc.dispatchEvent(new win.CustomEvent("apexveil:languagechange", { detail: { locale } }));
    return locale;
  }
  doc.querySelectorAll("[data-locale]").forEach((button) => {
    button.addEventListener("click", () => setLocale(button.dataset.locale));
  });
  applyTranslations(doc, locale);
  return {
    getLocale: () => locale,
    setLocale,
    t: (key, values) => translate(locale, key, values),
  };
}
