import { en, type I18nKey } from "./locales/en.js";
import { zhCN } from "./locales/zh-CN.js";
import { jaJP } from "./locales/ja-JP.js";

const locales = {
  en,
  "zh-CN": zhCN,
  "zh": zhCN,
  "ja-JP": jaJP,
  "ja": jaJP,
} as const;

function detectLang(): string {
  const envLang = process.env.PAPERCLIP_LANG;
  if (envLang && envLang in locales) return envLang;
  // Also try without region
  if (envLang) {
    const base = envLang.split("-")[0].toLowerCase();
    if (base in locales) return base;
  }
  return "en";
}

let currentLang = detectLang();
let currentLocale = locales[currentLang as keyof typeof locales] ?? en;

export function setLanguage(lang: string): boolean {
  const target = lang.toLowerCase();
  if (target in locales) {
    currentLang = target;
    currentLocale = locales[target as keyof typeof locales] ?? en;
    return true;
  }
  // Try base language without region
  const base = target.split("-")[0];
  if (base in locales) {
    currentLang = base;
    currentLocale = locales[base as keyof typeof locales] ?? en;
    return true;
  }
  return false;
}

export function t(key: I18nKey, vars?: Record<string, string | number>): string {
  let text = currentLocale[key] ?? en[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replace(new RegExp(`{${k}}`, "g"), String(v));
    }
  }
  return text;
}

export function getCurrentLang(): string {
  return currentLang;
}
