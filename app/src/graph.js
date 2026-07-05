// 生きた地図 — vis-network(npmバンドル)。固定座標・物理オフ、探索UIなし。
// フライホイール/コンパイラで新ノードが「育つ」演出と、ja/en ラベル切り替えを持つ。
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import { getLang, onLangChange, tr } from './i18n.js';

const C = {
  part: { background: '#1f3a5f', border: '#58a6ff', font: '#e6edf3' },
  gen: { background: '#242c38', border: '#8b98a9', font: '#c9d4e0' },
  rev: { background: '#3a2a18', border: '#f0883e', font: '#ffd0a8' },
  doc: { background: '#16301f', border: '#3fb950', font: '#a8e6c0' },
  person: { background: '#2d2440', border: '#d2a8ff', font: '#e3d2ff' },
  new: { background: '#0e3a2f', border: '#2ee6a8', font: '#b4ffe4' },
};

export function createGraph(container, data) {
  const nodes = new DataSet();
  const edges = new DataSet();
  const labels = new Map(); // id -> { ja, en }

  function addNode(id, ja, en, kind, x, y, extra = {}) {
    labels.set(id, { ja, en });
    nodes.add({
      id, x, y,
      label: getLang() === 'en' ? en : ja,
      fixed: true,
      shape: kind === 'part' ? 'ellipse' : 'box',
      color: { background: C[kind].background, border: C[kind].border },
      font: { color: C[kind].font, size: kind === 'part' ? 16 : 11, face: 'Hiragino Sans' },
      margin: 8,
      borderWidth: kind === 'part' ? 2.5 : 1.5,
      ...extra,
    });
  }

  // ── 固定レイアウト(手置き) ──────────────────
  addNode('part', 'FLG-SUS-001\nマウントフランジ', 'FLG-SUS-001\nMount Flange', 'part', 0, 0);

  addNode('genA', '2015年モデル', '2015 model', 'gen', -260, -140);
  addNode('genB', '2020年モデル', '2020 model', 'gen', 0, -220);
  addNode('genC', '2025年モデル\n(開発中)', '2025 model\n(in dev)', 'gen', 260, -140);
  edges.add([
    { from: 'part', to: 'genA' }, { from: 'part', to: 'genB' }, { from: 'part', to: 'genC' },
  ]);

  // △改訂ノード(主要なもの)
  const revs = [
    ['revA1', '△1 板厚8→10\n(強度不足)', '△1 t8→10\n(strength)', -390, -240, 'genA'],
    ['revA2', '△2 Rダラし\n(干渉)', '△2 fillet cut\n(interference)', -300, -300, 'genA'],
    ['revA3', '△3 リブ追加\n(手戻り)', '△3 rib added\n(rework)', -180, -300, 'genA'],
    ['revB1', '△1 板厚10→8\n(軽量化)', '△1 t10→8\n(weight cut)', -90, -330, 'genB'],
    ['revB2', '△2 板厚8→10\n(強度不足 再発🔴)', '△2 t8→10\n(recurred 🔴)', 30, -360, 'genB'],
    ['revB3', '△3 逃がし形状\n(成功例)', '△3 relief shape\n(success)', 150, -300, 'genB'],
    ['revC1', '△1 鋼→アルミ', '△1 steel→alum.', 330, -260, 'genC'],
  ];
  for (const [id, ja, en, x, y, gen] of revs) {
    addNode(id, ja, en, 'rev', x, y);
    edges.add({ from: gen, to: id });
  }
  // 再発の赤い線(2015△1 → 2020△2)
  edges.add({
    id: 'recur-edge',
    from: 'revA1', to: 'revB2',
    color: { color: '#f85149' }, dashes: true, width: 2,
    label: getLang() === 'en' ? 'same failure recurred' : '同一失敗の再発',
    font: { color: '#f85149', size: 10, strokeWidth: 0 },
  });

  // 文書・人(代表)
  addNode('doc1', '📄 強度検討報告書\nFLG-2014-06', '📄 Strength report\nFLG-2014-06', 'doc', -440, -120);
  addNode('doc2', '📄 不具合報告書\nFLG-2019-10', '📄 Defect report\nFLG-2019-10', 'doc', 120, -450);
  addNode('p-yamada', '👤 山田(設計)', '👤 Yamada (Design)', 'person', -440, 0);
  addNode('p-sato', '👤 佐藤(設計)', '👤 Sato (Design)', 'person', 240, -380);
  addNode('p-suzuki', '👤 鈴木(設計)', '👤 Suzuki (Design)', 'person', -60, -450);
  edges.add([
    { from: 'revA1', to: 'doc1' }, { from: 'doc1', to: 'p-yamada' },
    { from: 'revB2', to: 'doc2' }, { from: 'doc2', to: 'p-suzuki' },
    { from: 'revA2', to: 'p-sato' }, { from: 'revB3', to: 'p-sato' },
  ]);

  const network = new Network(container, { nodes, edges }, {
    physics: false,
    interaction: { dragNodes: false, zoomView: true, dragView: true, selectable: false },
    edges: {
      color: { color: '#39465a' },
      smooth: { type: 'continuous' },
      width: 1,
    },
  });

  function fitAll(animate = false) {
    network.fit({ padding: 24, animation: animate ? { duration: 700, easingFunction: 'easeInOutQuad' } : false });
  }
  setTimeout(() => fitAll(false), 60); // レイアウト確定後にフィット
  new ResizeObserver(() => fitAll(false)).observe(container);

  // 言語切り替え: 全ノードラベル+再発エッジを更新
  onLangChange((lang) => {
    const updates = [];
    for (const [id, pair] of labels) updates.push({ id, label: pair[lang] });
    nodes.update(updates);
    edges.update({ id: 'recur-edge', label: lang === 'en' ? 'same failure recurred' : '同一失敗の再発' });
  });

  let newCount = 0;

  // 「脳が育つ」演出 — 新しいレッスンノードを追加してフォーカス
  function addLessonNode(lesson, { linkTo = 'genC' } = {}) {
    newCount += 1;
    const id = `new-${newCount}`;
    const x = 380 + (newCount - 1) * 60;
    const y = -40 + (newCount - 1) * 70;
    const rev = lesson.source_rev ?? lesson.id;
    const ja = `✦ ${rev}\n${lesson.category}: ${lesson.operation}`;
    const en = `✦ ${tr('rev', rev, 'en')}\n${tr('categories', lesson.category, 'en')}: ${tr('operations', lesson.operation, 'en')}`;
    addNode(id, ja, en, 'new', x, y, { borderWidth: 2.5 });
    edges.add({ from: linkTo, to: id, color: { color: '#2ee6a8' }, width: 2 });
    if (lesson.author) {
      const known = lesson.author.includes('佐藤') ? 'p-sato' : lesson.author.includes('山田') ? 'p-yamada' : null;
      if (known) edges.add({ from: id, to: known, color: { color: '#2ee6a8' }, dashes: true });
      else {
        const pid = `newp-${newCount}`;
        addNode(pid, `👤 ${lesson.author}`, `👤 ${tr('authors', lesson.author, 'en')}`, 'person', x + 90, y + 60);
        edges.add({ from: id, to: pid, color: { color: '#2ee6a8' }, dashes: true });
      }
    }
    network.focus(id, { scale: 1.0, animation: { duration: 700, easingFunction: 'easeInOutQuad' } });
    setTimeout(() => fitAll(true), 1800);
    return id;
  }

  return { addLessonNode };
}
