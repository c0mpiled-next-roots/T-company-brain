# デモ動画 ストーリーボード（90秒 / R1・板厚版）

> 対象: c0mpiled AI Hackathon 提出デモ動画（**英語必須 / 90秒以内**）
> 版: **R1版（物語の背骨＝板厚：軽量化→強度不足の再発）** ← ユーザー確定
> 出典: 承認済み [DESIGN-DOC.md](../../docs/DESIGN-DOC.md) / [core-loop.md](../ux/core-loop.md) / [flange-revision-history.md](../mocks/flange-revision-history.md) / [PITCH-OUTLINE.md](../../presentation/PITCH-OUTLINE.md)
> 方針: 本ドキュメントはチーム共有用のため日本語。**画面テロップ・ナレーションは英語**。デザインは既存ワイヤー準拠のダークCAD基調。
> 作成日: 2026-07-05

---

## 0. 設計方針（このストーリーボードの3つの判断）

1. **物語の背骨を「板厚」1本に統一する。**
   承認済みビート表は冒頭で板厚の再発を語り、ヒーロー警告では別スレッド（Rダラし=R2）を出しており、そこに物語の継ぎ目があった。動画は「**冒頭で語った失敗を、目の前で止める**」構造が最も強いので、ヒーロー警告を **R1（板厚 < 10mm）** に寄せる。R1は **2015 △1 と 2020 △2 で"2度"失敗**しているので「2度あったことを、3度目に止める」という最大の緊張が作れる。

2. **これは"動画"なので、ライブデモより演出を効かせる。**
   カット割り・寄り・テロップ・英語VOで90秒に情報を詰めつつ迷子にさせない。ただし**実際の製品画面のみ**で撮る（バラ色のモックにしない＝正直なデモ）。

3. **主役は「割り込みの瞬間」に27秒割く。**
   コンパイラ／フライホイールは「なぜ賢くなり続けるか」を各12〜15秒で見せる補強に徹する。押したら **S5（コンパイラ）から削る**（退避ラダーと同思想）。

---

## 1. 90秒 ストーリーボード

| # | 秒 | 画面（ショット） | 英語VO（ナレーション） | 画面テロップ（English） | 演出意図 |
|---|---|---|---|---|---|
| **S1** | 0–13 | 世代横断タイムライン。2015→2020の△が線でつながり、**同じ失敗が2回光る** | "2015 — an engineer thinned this flange for weight. It failed: not strong enough. They fixed it, and forgot. 2020 — a new engineer thinned it again. The exact same failure. Weeks of rework." | `2015 △1  10→8mm  ✕ STRENGTH FAIL`<br>`2020 △2  8→10mm  ← SAME FAILURE (recurred)` | 共感できる具体で掴む。再発を"目で"見せる |
| **S2** | 13–21 | タイムラインから、眠る△注記へズームイン → 製品UI（ダークCAD）へトランジション | "The lesson was always there — buried in a revision note no one could see when it mattered. So we built the senior engineer who never leaves." | `The lesson existed.`<br>`Nobody saw it in time.` | 問題→解決の反転。プロダクト名（Senpai AI）を最初に置く |
| **S3 ★HERO** | 21–48 | 設計者が2025モデルを開く。板厚スライダーを 10.0→8.0 にドラッグ →**10mmを割った瞬間、先輩カードがブロッキングで割り込む** | "2025. Same lightweighting pressure. She starts thinning the plate — and the moment it crosses ten millimeters… Senpai steps in. 'This failed twice — 2015, and again in 2020. Strength at the joint. Here's the report. Here's who fixed it.' No search. No chatbot. It just knew — at the exact moment it mattered." | 差分 `10.0 → 8.0 mm`（等幅・赤）<br>カード見出し: `⚠ SENPAI`<br>`Thickness < 10mm failed twice`<br>`2015 △1 Yamada`<br>`2020 △2 Suzuki — weight target abandoned`<br>+ 出典報告書チップ | **製品の生死＝この瞬間**。2秒以内に根拠付きで。寄りでカードの信頼感を魅せる |
| **S4** | 48–63 | 設計者が安全策を適用（板厚を薄くせず**材料変更＝アルミで軽量化**）→ AIが確認質問 →**知識グラフにノードが生える** | "She takes the safe path — aluminum, not a thinner plate. Then Senpai asks one thing: 'Reason — weight reduction?' One tap: yes. And the brain grows a new node, live. The more you design, the smarter it gets." | 確認チップ: `Reason: Weight reduction?  [Yes]`<br>グラフ: `+1 node` パルス | フライホイール＝データモート。投資家軸に直撃 |
| **S5** | 63–76 | 別ペインに古いトラブル報告書テキストを投入 → タイプライター風に**構造化JSONレッスンが生成** | "It learns from your documents too. Drop in an old trouble report — and it compiles messy tribal knowledge into an executable design rule. That's the engineering no one else has." | JSON整形演出:<br>`{ category: "strength",`<br>`  part: "joint", action: "thin",`<br>`  threshold: "<10mm",`<br>`  outcome: "fail" }` | 「非構造知識→実行可能ルール」＝ Engineering Lift軸 |
| **S6** | 76–90 | グラフ全景に引き → ロゴ／ライブURL／QR | "Every lesson, executable. Every engineer, backed by everyone who came before. The Company Brain for manufacturing. Every factory needs this brain." | `Every factory needs this brain.`<br>+ Live URL + QR | 記憶に残る一言で締め＋審査員が今すぐ触れる導線 |

**尺配分の原則**: S3（ヒーロー）は削らない。押したら S5→短縮/カット。S5なし版は S3を+8s、S4を+4sに再配分。

---

## 2. R1版に必要な「既存R2素材からの差分」

既存 [hero-cad-workspace.html](../wireframes/hero-cad-workspace.html) は R2（Rダラし）のモーダルで作り込まれている。R1版では以下を差し替える。

| 対象 | 既存（R2） | R1版に差し替え |
|---|---|---|
| 発火操作 | R fillet `R5 → R3` | **Thickness スライダー `10.0 → 8.0 mm`** |
| モーダル見出し | `Risky change · R fillet R5→R3` | `Risky change · Thickness < 10mm` |
| 過去△の根拠 | 2015 △2 → △3（剛性低下・リブ手戻り） | **2015 △1（山田・応力集中）／2020 △2（鈴木・軽量化断念）** の"2度失敗" |
| 推奨案 | 逃がし形状（2020 △3で成功） | **板厚10mmを維持 or 材料変更（アルミ）で軽量化** |
| 相談先ボタン | `Ask 佐藤` | `Ask 山田`（2015 △1の担当） |
| フライホイール確認質問 | "…to avoid interference, right?" | **"Reason — weight reduction, right?"** |
| 追加される新ノード | 2025 △2: 干渉回避 | **2025 △: 材料変更による軽量化（アルミ）** |
| 3D表現 | R（フィレット）の擬似差し替え | **板厚の断面コールアウト**（薄くなったのを見せる） |

**知識JSON**: `lesson_2015_001`（板厚・threshold_min:10・evidence 2件）を主役ルールに。既存の R2 レッスンは残置（発火はさせない＝偽陽性ゼロを維持）。

---

## 3. 撮影・制作メモ（動画ならではの詰め）

- **可読性**: 板厚変化は3Dだと見えにくい。**フランジ断面のコールアウト＋等幅の数値 `10.0→8.0` を赤で大写し**にして「薄くした」を確実に伝える。
- **警告カードは事前生成の静的文言で撮る**（DESIGN-DOC準拠＝ネットワーク非依存・幻覚ゼロ）。動画なので「2秒以内表示」も編集で担保できるが、実挙動どおりに録るのが誠実。
- **VOは英語・テロップも英語**（提出要件）。数値・差分は等幅フォント。
- **音**: BGMは低め。警告の瞬間だけSEで"間"を作る。
- **カット数/モーション**: S1に再発が"2回光る"モーション、S3の割り込みに軽いズームイン、S4のノード追加にパルス。過度な装飾は避けダーク基調で統一。
- **配色（既存トークン）**: ベース `#16191d` / パネル `#1e2228` / 警告 `#e0574d` / AI確認 `#3fb6a8` / 記録済み `#57b284`。

---

## 4. 退避ラダー（動画版）

尺・素材が押した場合の段階的降格:

1. **フル**（S1–S6 全部）
2. S5（コンパイラ）を短縮 or カット → S3/S4に再配分
3. S4のグラフ演出を静止画＋ノード点灯のみに簡略化
4. 最悪、S1（問題）＋S3（警告）＋S6（締め）の3シーンで**警告の瞬間だけは死守**

---

## 5. 次アクション

- [ ] 本ストーリーボードのチームレビュー・合意
- [ ] §2 の差分を [hero-cad-workspace.html](../wireframes/hero-cad-workspace.html) に反映（R1モーダル化）
- [ ] S3 先輩カードの絵コンテ（レイアウト確定 / 別途SVG or HTML）
- [ ] 英語VO・テロップのネイティブチェック
- [ ] 収録 → 編集（尺90秒厳守・退避ラダー判断）
