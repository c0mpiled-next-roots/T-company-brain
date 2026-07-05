// 生きた地図 — vis-network(npmバンドル)。固定座標・物理オフ、探索UIなし。
// フライホイール/コンパイラで新ノードが「育つ」演出だけを持つ。
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';

const C = {
  part: { background: '#1f3a5f', border: '#58a6ff', font: '#e6edf3' },
  gen: { background: '#242c38', border: '#8b98a9', font: '#c9d4e0' },
  rev: { background: '#3a2a18', border: '#f0883e', font: '#ffd0a8' },
  doc: { background: '#16301f', border: '#3fb950', font: '#a8e6c0' },
  person: { background: '#2d2440', border: '#d2a8ff', font: '#e3d2ff' },
  new: { background: '#0e3a2f', border: '#2ee6a8', font: '#b4ffe4' },
};

function node(id, label, kind, x, y, extra = {}) {
  return {
    id, label, x, y,
    fixed: true,
    shape: kind === 'part' ? 'ellipse' : 'box',
    color: { background: C[kind].background, border: C[kind].border },
    font: { color: C[kind].font, size: kind === 'part' ? 16 : 11, face: 'Hiragino Sans' },
    margin: 8,
    borderWidth: kind === 'part' ? 2.5 : 1.5,
    ...extra,
  };
}

export function createGraph(container, data) {
  const nodes = new DataSet();
  const edges = new DataSet();

  // ── 固定レイアウト(手置き) ──────────────────
  nodes.add(node('part', 'FLG-SUS-001\nマウントフランジ', 'part', 0, 0));

  nodes.add(node('genA', '2015年モデル', 'gen', -260, -140));
  nodes.add(node('genB', '2020年モデル', 'gen', 0, -220));
  nodes.add(node('genC', '2025年モデル\n(開発中)', 'gen', 260, -140));
  edges.add([
    { from: 'part', to: 'genA' }, { from: 'part', to: 'genB' }, { from: 'part', to: 'genC' },
  ]);

  // △改訂ノード(主要なもの)
  const revs = [
    ['revA1', '△1 板厚8→10\n(強度不足)', -390, -240, 'genA'],
    ['revA2', '△2 Rダラし\n(干渉)', -300, -300, 'genA'],
    ['revA3', '△3 リブ追加\n(手戻り)', -180, -300, 'genA'],
    ['revB1', '△1 板厚10→8\n(軽量化)', -90, -330, 'genB'],
    ['revB2', '△2 板厚8→10\n(強度不足 再発🔴)', 30, -360, 'genB'],
    ['revB3', '△3 逃がし形状\n(成功例)', 150, -300, 'genB'],
    ['revC1', '△1 鋼→アルミ', 330, -260, 'genC'],
  ];
  for (const [id, label, x, y, gen] of revs) {
    nodes.add(node(id, label, 'rev', x, y));
    edges.add({ from: gen, to: id });
  }
  // 再発の赤い線(2015△1 → 2020△2)
  edges.add({
    from: 'revA1', to: 'revB2',
    color: { color: '#f85149' }, dashes: true, width: 2,
    label: '同一失敗の再発', font: { color: '#f85149', size: 10, strokeWidth: 0 },
  });

  // 文書・人(代表)
  nodes.add(node('doc1', '📄 強度検討報告書\nFLG-2014-06', 'doc', -440, -120));
  nodes.add(node('doc2', '📄 不具合報告書\nFLG-2019-10', 'doc', 120, -450));
  nodes.add(node('p-yamada', '👤 山田(設計)', 'person', -440, 0));
  nodes.add(node('p-sato', '👤 佐藤(設計)', 'person', 240, -380));
  nodes.add(node('p-suzuki', '👤 鈴木(設計)', 'person', -60, -450));
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

  let newCount = 0;

  // 「脳が育つ」演出 — 新しいレッスンノードを追加してフォーカス
  function addLessonNode(lesson, { linkTo = 'genC' } = {}) {
    newCount += 1;
    const id = `new-${newCount}`;
    const x = 380 + (newCount - 1) * 60;
    const y = -40 + (newCount - 1) * 70;
    nodes.add(node(id, `✦ ${lesson.source_rev ?? lesson.id}\n${lesson.category}: ${lesson.operation}`, 'new', x, y, { borderWidth: 2.5 }));
    edges.add({ from: linkTo, to: id, color: { color: '#2ee6a8' }, width: 2 });
    if (lesson.author) {
      const pid = `newp-${newCount}`;
      const known = lesson.author.includes('佐藤') ? 'p-sato' : lesson.author.includes('山田') ? 'p-yamada' : null;
      if (known) edges.add({ from: id, to: known, color: { color: '#2ee6a8' }, dashes: true });
      else {
        nodes.add(node(pid, `👤 ${lesson.author}`, 'person', x + 90, y + 60));
        edges.add({ from: id, to: pid, color: { color: '#2ee6a8' }, dashes: true });
      }
    }
    network.focus(id, { scale: 1.0, animation: { duration: 700, easingFunction: 'easeInOutQuad' } });
    setTimeout(() => fitAll(true), 1800);
    return id;
  }

  return { addLessonNode };
}
