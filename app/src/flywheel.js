// フライホイール — 書き込みパス。
// 変更適用 → AIの確認質問(Claude API、失敗時は静的文言) → ワンタップ回答 →
// 構造化レッスンが増える(グラフに新ノード)。「脳が今、育った」の瞬間。
import { getLang, t } from './i18n.js';

export function createFlywheel({ graph, onLessonAdded }) {
  const panel = document.getElementById('flywheel');
  const questionEl = document.getElementById('flywheel-question');
  const yesBtn = document.getElementById('flywheel-yes');
  const noBtn = document.getElementById('flywheel-no');

  let pending = null;

  async function askAfterChange(changeDescription) {
    // 質問文の生成だけLLM(遅延・失敗時は即静的文言にフォールバック)
    let question = t('fly.fallback');
    try {
      const resp = await Promise.race([
        fetch('/api/claude', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ task: 'flywheel', text: changeDescription, lang: getLang() }),
        }).then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status))))),
        new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 4000)),
      ]);
      if (resp.text?.trim()) question = resp.text.trim();
    } catch {
      /* 静的文言で続行 — デモを止めない */
    }

    pending = {
      id: 'L-2025-2',
      category: '干渉',
      region: 'ブラケット脇',
      operation: '逃がし形状追加',
      parameter: '逃がし形状',
      threshold: '干渉回避はRダラしではなく逃がし形状で行う',
      outcome: 'バッテリブラケット干渉を逃がし形状で回避(Rダラし再発を先輩AIが阻止)',
      source_doc: '設計変更記録(自動生成)',
      source_rev: '2025モデル △2',
      author: '高橋(設計)',
      year: 2025,
      generation: 'C',
    };
    questionEl.textContent = `🧑‍🏭 ${question}`;
    panel.classList.remove('hidden');
  }

  yesBtn.addEventListener('click', () => {
    panel.classList.add('hidden');
    if (!pending) return;
    graph.addLessonNode(pending);
    onLessonAdded(pending);
    pending = null;
  });

  noBtn.addEventListener('click', () => {
    // 「いいえ」なら理由の選択肢を出す(デモでは簡略化して閉じるのみ)
    panel.classList.add('hidden');
    pending = null;
  });

  return { askAfterChange };
}
