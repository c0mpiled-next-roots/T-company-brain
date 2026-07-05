// 言語切り替え(ja/en)。
// 静的DOM: data-i18n 属性で一括適用。動的文言: t() とトークン変換ヘルパー。
// 報告書などの「現場データ」は日本語のまま(製品価値の演出)。UI側だけ切り替える。

const UI = {
  'brand.sub': {
    ja: 'The senior engineer watching over your shoulder',
    en: 'The senior engineer watching over your shoulder',
  },
  'part.name': { ja: 'フロントサスペンション マウントフランジ', en: 'Front Suspension Mount Flange' },
  'part.no': { ja: 'FLG-SUS-001-C(2025年モデル・開発中)', en: 'FLG-SUS-001-C (2025 model, in development)' },
  'btn.compiler': { ja: '⚙ 知識コンパイラ', en: '⚙ Knowledge Compiler' },
  'brain.title': { ja: '脳内の構造化レッスン数', en: 'Structured lessons in the brain' },
  'ctl.thickness': { ja: '板厚', en: 'Plate thickness' },
  'ctl.fillet': { ja: 'R部(フィレット)', en: 'Fillet radius' },
  'ctl.context': {
    ja: '△2 編集中: 新規バッテリブラケットとの干渉回避を検討(R5→R3 を試そうとしている)',
    en: '△2 in progress: clearing interference with the new battery bracket (about to try R5→R3)',
  },
  'graph.title': { ja: '🗺 生きた地図 — この部品の知識', en: '🗺 Living map — what the company knows about this part' },
  'legend.part': { ja: '部品', en: 'Part' },
  'legend.gen': { ja: '世代', en: 'Generation' },
  'legend.rev': { ja: '△改訂', en: '△ Revision' },
  'legend.doc': { ja: '文書', en: 'Document' },
  'legend.person': { ja: '人', en: 'Person' },
  'fly.yes': { ja: 'はい、そうです', en: 'Yes, exactly' },
  'fly.no': { ja: 'いいえ', en: 'No' },
  'fly.fallback': {
    ja: 'この変更(逃がし形状の追加)の理由は、新規バッテリブラケットとの干渉回避ですね？',
    en: 'This change (adding a relief shape) — the reason is clearing the new battery bracket, correct?',
  },
  'comp.head': { ja: '知識コンパイラ — 散らばった文書を、実行可能な知識に', en: 'Knowledge Compiler — from scattered documents to executable knowledge' },
  'comp.in': { ja: '📄 トラブル報告書(そのまま貼り付け・日本語原文)', en: '📄 Trouble report (pasted as-is — original Japanese)' },
  'comp.out': { ja: '🧠 構造化レッスン(実行可能)', en: '🧠 Structured lesson (executable)' },
  'comp.run': { ja: '▶ コンパイル', en: '▶ Compile' },
  'comp.add': { ja: '🧠 脳に追加', en: '🧠 Add to brain' },
  'comp.working': { ja: 'コンパイル中… 文書を読んでいます', en: 'Compiling… reading the document' },
  'comp.done.live': { ja: '✓ Claude が構造化しました', en: '✓ Structured by Claude' },
  'comp.done': { ja: '✓ 構造化しました', en: '✓ Structured' },
  'comp.added': { ja: '🧠 脳に追加されました — 次の設計から警告に使われます', en: '🧠 Added to the brain — it will warn designers from the next edit on' },
  'toast.grown': { ja: '🧠 脳が育ちました — レッスン {n} 件目', en: '🧠 The brain just grew — lesson #{n}' },
  'senpai.sent': { ja: '✉ 送信しました(デモ)', en: '✉ Message sent (demo)' },
  'senpai.reco': { ja: '(推奨)', en: ' (recommended)' },
  'viewer.relief': { ja: '逃がし形状', en: 'Relief shape' },
};

// 現場データのトークン変換(チップ・グラフ用)
const TOKENS = {
  categories: {
    '強度不足': 'Insufficient strength', '干渉': 'Interference', '加工性': 'Manufacturability',
    '軽量化': 'Weight reduction', '材料変更': 'Material change',
  },
  authors: {
    '山田(設計)': 'Yamada (Design)', '佐藤(設計)': 'Sato (Design)', '鈴木(設計)': 'Suzuki (Design)',
    '田中(生技)': 'Tanaka (Prod. Eng.)', '高橋(設計)': 'Takahashi (Design)',
    '生技標準G': 'Prod. Eng. Standards', '設計標準G': 'Design Standards', '材料技術部': 'Materials Div.',
  },
  docs: {
    '強度検討報告書': 'Strength Study Report ', '設計変更連絡書': 'Design Change Notice ',
    '対策検討会議事録': 'Countermeasure Minutes ', '生技フィードバック票': 'Prod. Eng. Feedback ',
    '不具合報告書': 'Defect Report ', '軽量化検討書': 'Weight Reduction Study ',
    '材料変更検討書': 'Material Change Study ', '溶接標準': 'Welding Standard ',
    '設計標準': 'Design Standard ', '軽量化設計ガイド': 'Lightweight Design Guide ',
    '設計変更記録(自動生成)': 'Design change record (auto)',
  },
  operations: {
    '板厚変更': 'thickness change', 'Rダラし': 'fillet reduction', 'リブ追加': 'rib added',
    '穴位置変更': 'hole relocation', '逃がし形状追加': 'relief shape added', '材質変更': 'material change',
    '形状変更': 'shape change',
  },
};

let lang = 'ja';
const listeners = new Set();

export function getLang() { return lang; }

export function setLang(next) {
  if (next === lang) return;
  lang = next;
  localStorage.setItem('senpai-lang', lang);
  applyStatic();
  for (const fn of listeners) fn(lang);
}

export function onLangChange(fn) { listeners.add(fn); }

export function t(key, vars = {}) {
  let s = UI[key]?.[lang] ?? UI[key]?.ja ?? key;
  for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v));
  return s;
}

// 「2015モデル △1」→「2015 model △1」等、現場データの軽量トークン変換
// l を明示すると現在の表示言語に関わらずその言語で変換する(ラベル事前構築用)
export function tr(kind, value, l = lang) {
  if (value == null) return value;
  if (l === 'ja') return value;
  if (kind === 'rev') return String(value).replace('モデル', ' model');
  const map = TOKENS[kind] || {};
  for (const [ja, en] of Object.entries(map)) {
    if (String(value).startsWith(ja)) return String(value).replace(ja, en);
  }
  return map[value] ?? value;
}

export function applyStatic() {
  document.documentElement.lang = lang;
  for (const el of document.querySelectorAll('[data-i18n]')) {
    el.textContent = t(el.dataset.i18n);
  }
  for (const el of document.querySelectorAll('[data-i18n-title]')) {
    el.title = t(el.dataset.i18nTitle);
  }
  const toggle = document.getElementById('lang-toggle');
  if (toggle) toggle.textContent = lang === 'ja' ? 'EN' : '日本語';
}

export function initLang() {
  const fromUrl = new URLSearchParams(location.search).get('lang');
  const saved = localStorage.getItem('senpai-lang');
  lang = fromUrl === 'en' || (!fromUrl && saved === 'en') ? 'en' : 'ja';
  applyStatic();
}
