// SenpAI — 図面変更履歴(△)を実行可能な知見に変える製造業 Company Brain。
// デモの物語: 2025年モデルの設計者が2015年と同じ失敗をしかける瞬間、先輩AIが割り込む。
import data from './data/lessons.json';
import reportRaw from './data/trouble-report.md?raw';
import { createViewer } from './viewer.js';
import { createMatcher } from './matcher.js';
import { createSenpaiCard } from './senpai.js';
import { createGraph } from './graph.js';
import { createFlywheel } from './flywheel.js';
import { createCompiler } from './extract.js';

// ── 脳内レッスン数の表示 ─────────────────────
const brainCountEl = document.querySelector('#brain-count b');
let brainCount = data.lessons.length;
function bumpBrain() {
  brainCount += 1;
  brainCountEl.textContent = String(brainCount);
  toast(`🧠 脳が育ちました — レッスン ${brainCount} 件目`);
}
brainCountEl.textContent = String(brainCount);

// ── トースト ────────────────────────────────
let toastTimer = null;
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hidden'), 2600);
}

// ── コンポーネント組み立て ───────────────────
const viewer = createViewer(document.getElementById('viewer'));
const graph = createGraph(document.getElementById('graph'), data);

const senpai = createSenpaiCard(data, {
  onAction(rule) {
    if (rule.action?.type === 'relief') {
      viewer.applyRelief();
      // R3ボタンの見た目をR5に戻す(推奨に従った)
      setFilletButtons(5);
      flywheel.askAfterChange('R部のダラし(R5→R3)をやめて、ブラケット脇に逃がし形状を追加した');
    }
  },
});

const matcher = createMatcher(data.rules, {
  onFire(rule) {
    // 警告は2秒以内・完全ローカル(事前生成文言)
    senpai.show(rule);
    viewer.flashFillet();
  },
});

const flywheel = createFlywheel({ graph, onLessonAdded: bumpBrain });

createCompiler({ graph, onLessonAdded: bumpBrain, reportText: reportRaw });

// ── 操作UI ──────────────────────────────────
const thicknessInput = document.getElementById('thickness');
const thicknessValue = document.getElementById('thickness-value');
let prevThickness = Number(thicknessInput.value);

thicknessInput.addEventListener('change', () => {
  const v = Number(thicknessInput.value);
  thicknessValue.textContent = String(v);
  viewer.setThickness(v);
  matcher.evaluate({ parameter: 'thickness', value: v, prev: prevThickness });
  prevThickness = v;
});
thicknessInput.addEventListener('input', () => {
  thicknessValue.textContent = thicknessInput.value;
});

const r5 = document.getElementById('fillet-r5');
const r3 = document.getElementById('fillet-r3');
let prevFillet = 5;

function setFilletButtons(val) {
  r5.classList.toggle('active', val === 5);
  r3.classList.toggle('active', val === 3);
}

function changeFillet(val) {
  if (val === prevFillet) return;
  setFilletButtons(val);
  viewer.setFillet(val);
  matcher.evaluate({ parameter: 'fillet', value: val, prev: prevFillet });
  prevFillet = val;
}
r5.addEventListener('click', () => changeFillet(5));
r3.addEventListener('click', () => changeFillet(3));

// ── デモシード(URLパラメータ) ────────────────
// ?demo=1 : 2025年モデル △2 編集直前の状態(既定と同じだが明示)。
// リハーサル・審査員操作の起点を決定的にする。
const params = new URLSearchParams(location.search);
if (params.get('demo')) {
  // 状態は初期値(t=10, R5)のまま。編集コンテキスト表示のみ強調。
  document.getElementById('edit-context').textContent =
    '△2 編集中: 新規バッテリブラケットとの干渉回避を検討(R5→R3 を試そうとしている)';
}
