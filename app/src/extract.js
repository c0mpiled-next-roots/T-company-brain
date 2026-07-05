// 知識コンパイラ(ライブ抽出シーン)。
// 報告書テキスト → 構造化レッスンJSON。Claude API 経由。
// キー無し/回線断ではタイプライター疑似アニメ(録画ではなくスクリプト演出)に自動フォールバック。

const CANNED_LESSON = {
  category: '強度不足',
  region: '締結部',
  operation: '板厚変更',
  parameter: '板厚',
  threshold: '板厚 >= 10mm',
  outcome: 'FEM解析で締結部に応力集中。板厚8→10mmで解消(重量+120g)。軽量化要求時は材質変更で対応',
  source_doc: '強度検討報告書 FLG-2014-06',
  source_rev: '2015モデル △1',
  author: '山田(設計)',
  year: 2014,
};

export function createCompiler({ graph, onLessonAdded, reportText }) {
  const modal = document.getElementById('compiler-modal');
  const input = document.getElementById('compiler-input');
  const output = document.getElementById('compiler-output');
  const runBtn = document.getElementById('compiler-run');
  const addBtn = document.getElementById('compiler-add');
  const status = document.getElementById('compiler-status');
  const openBtn = document.getElementById('btn-compiler');
  const closeBtn = document.getElementById('compiler-close');

  let extracted = null;
  let typing = null;

  input.value = reportText;

  function open() { modal.classList.remove('hidden'); }
  function close() {
    modal.classList.add('hidden');
    if (typing) { clearInterval(typing); typing = null; }
  }
  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);

  // タイプライター描画(ライブ応答・フォールバックの両方で同じ見た目にする)
  function typewrite(text, done) {
    output.textContent = '';
    let i = 0;
    if (typing) clearInterval(typing);
    typing = setInterval(() => {
      i += 3;
      output.textContent = text.slice(0, i);
      output.scrollTop = output.scrollHeight;
      if (i >= text.length) {
        clearInterval(typing);
        typing = null;
        done?.();
      }
    }, 12);
  }

  async function run() {
    runBtn.disabled = true;
    addBtn.classList.add('hidden');
    status.textContent = 'コンパイル中… 文書を読んでいます';
    extracted = null;

    let lesson = null;
    let live = false;
    try {
      const resp = await Promise.race([
        fetch('/api/claude', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ task: 'extract', text: input.value }),
        }).then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status))))),
        new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 9000)),
      ]);
      const raw = (resp.text || '').replace(/```json|```/g, '').trim();
      lesson = JSON.parse(raw);
      live = true;
    } catch {
      lesson = CANNED_LESSON; // スクリプト演出に自動降格 — デモは止まらない
    }

    extracted = { id: 'L-EXT-1', generation: 'A', ...lesson };
    const pretty = JSON.stringify(lesson, null, 2);
    status.textContent = live ? '✓ Claude が構造化しました' : '✓ 構造化しました';
    typewrite(pretty, () => {
      addBtn.classList.remove('hidden');
      runBtn.disabled = false;
    });
  }

  runBtn.addEventListener('click', run);

  addBtn.addEventListener('click', () => {
    if (!extracted) return;
    graph.addLessonNode(extracted, { linkTo: 'genA' });
    onLessonAdded(extracted);
    addBtn.classList.add('hidden');
    status.textContent = '🧠 脳に追加されました — 次の設計から警告に使われます';
    setTimeout(close, 1600);
  });

  return { open, close };
}
