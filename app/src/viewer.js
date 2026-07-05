// 疑似CADビューア — three.js プリミティブ合成のプロシージャルフランジ。
// 設計判断(DESIGN-DOC): STL調達はしない。R表現はセグメント差し替えの擬似表現。
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const COLORS = {
  steel: 0x7d8da1,
  steelEdge: 0x9fb2c8,
  highlight: 0xf85149,
  relief: 0x3fb950,
};

export function createViewer(container) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0d1117);

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 2000);
  camera.position.set(180, 140, 220);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0, 25, 0);

  // 照明
  scene.add(new THREE.HemisphereLight(0xbfd4ff, 0x1a2030, 1.1));
  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(120, 200, 80);
  scene.add(key);

  // CAD風グリッド
  const grid = new THREE.GridHelper(400, 20, 0x2d3748, 0x1c2333);
  scene.add(grid);

  // ── フランジ本体(パラメトリック) ─────────────────
  const part = new THREE.Group();
  scene.add(part);

  const state = { thickness: 10, fillet: 5, relief: false };
  let filletMesh = null; // 警告時にハイライトする対象

  function steelMat() {
    return new THREE.MeshStandardMaterial({ color: COLORS.steel, metalness: 0.55, roughness: 0.42 });
  }

  function addEdges(mesh, color = COLORS.steelEdge) {
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(mesh.geometry, 24),
      new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.5 })
    );
    mesh.add(edges);
  }

  function rebuild() {
    part.clear();
    const t = state.thickness; // 板厚(mm)

    // ベースプレート(円盤フランジ)
    const base = new THREE.Mesh(new THREE.CylinderGeometry(70, 70, t, 48), steelMat());
    base.position.y = t / 2;
    addEdges(base);
    part.add(base);

    // ボルト穴(4つ・見た目表現)
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2 + Math.PI / 4;
      const hole = new THREE.Mesh(
        new THREE.CylinderGeometry(7, 7, t + 0.6, 24),
        new THREE.MeshStandardMaterial({ color: 0x0d1117, metalness: 0.1, roughness: 0.9 })
      );
      hole.position.set(Math.cos(a) * 48, t / 2, Math.sin(a) * 48);
      part.add(hole);
    }

    // 起立ブラケット(サスアーム取付側)
    const bracketH = 70;
    const bracket = new THREE.Mesh(new THREE.BoxGeometry(64, bracketH, t), steelMat());
    bracket.position.set(0, t + bracketH / 2, 0);
    addEdges(bracket);
    part.add(bracket);

    // ブラケット上部の取付穴
    const topHole = new THREE.Mesh(
      new THREE.CylinderGeometry(9, 9, t + 0.6, 28),
      new THREE.MeshStandardMaterial({ color: 0x0d1117, roughness: 0.9 })
    );
    topHole.rotation.x = Math.PI / 2;
    topHole.position.set(0, t + bracketH - 16, 0);
    part.add(topHole);

    // R部(フィレット) — ブラケット根元に沿う円柱ビードの擬似表現。R値で太さが変わる
    const r = state.fillet;
    filletMesh = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.3, r * 1.3, 64, 20), steelMat());
    filletMesh.rotation.z = Math.PI / 2; // X軸に沿って寝かせる
    filletMesh.position.set(0, t + r * 0.6, t / 2 + r * 0.6);
    part.add(filletMesh);
    const filletBack = filletMesh.clone();
    filletBack.material = filletMesh.material; // 点滅ハイライトを共有
    filletBack.position.z = -(t / 2 + r * 0.6);
    part.add(filletBack);

    // 逃がし形状(適用後のみ) — ブラケット脇のノッチ
    if (state.relief) {
      const relief = new THREE.Mesh(
        new THREE.BoxGeometry(20, 26, t + 1.2),
        new THREE.MeshStandardMaterial({
          color: COLORS.relief, metalness: 0.3, roughness: 0.5,
          transparent: true, opacity: 0.85,
        })
      );
      relief.position.set(32, t + 20, 0);
      addEdges(relief, COLORS.relief);
      part.add(relief);

      const label = makeLabel('逃がし形状', '#3fb950');
      label.position.set(58, t + 44, 0);
      part.add(label);
    }

    // 寸法ラベル(CAD風)
    const dim = makeLabel(`t=${t}mm / R${state.fillet}`, '#8b98a9');
    dim.position.set(-80, t + 8, 40);
    part.add(dim);
  }

  function makeLabel(text, color) {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 96;
    const ctx = canvas.getContext('2d');
    ctx.font = 'bold 44px "Hiragino Sans", sans-serif';
    ctx.fillStyle = color;
    ctx.fillText(text, 8, 60);
    const tex = new THREE.CanvasTexture(canvas);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
    sprite.scale.set(64, 12, 1);
    return sprite;
  }

  // 警告時のハイライト(R部を赤く点滅)
  let flashUntil = 0;
  function flashFillet() {
    flashUntil = performance.now() + 2600;
  }

  function resize() {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  new ResizeObserver(resize).observe(container);
  resize();

  renderer.setAnimationLoop(() => {
    controls.update();
    if (filletMesh) {
      const now = performance.now();
      if (now < flashUntil) {
        const pulse = 0.5 + 0.5 * Math.sin(now / 110);
        filletMesh.material.color.lerpColors(
          new THREE.Color(COLORS.steel), new THREE.Color(COLORS.highlight), pulse
        );
      } else {
        filletMesh.material.color.setHex(COLORS.steel);
      }
    }
    renderer.render(scene, camera);
  });

  rebuild();

  return {
    setThickness(v) { state.thickness = v; rebuild(); },
    setFillet(v) { state.fillet = v; rebuild(); },
    applyRelief() { state.relief = true; state.fillet = 5; rebuild(); },
    flashFillet,
    get state() { return { ...state }; },
  };
}
