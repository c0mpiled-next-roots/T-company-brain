# ピッチ資料 骨子（Pitch Outline）

> 対象: c0mpiled AI Hackathon 提出プレゼン（**英語必須 / 本番デモ90秒**）
> 出典: 承認済み [DESIGN-DOC.md](../docs/DESIGN-DOC.md) / [PREMISES.md](../docs/PREMISES.md) / [core-loop.md](../design/ux/core-loop.md) / [flange-revision-history.md](../design/mocks/flange-revision-history.md)
> 方針: 本ドキュメント（チーム共有用）は日本語、**スライド上の実コピーは英語**。
> 作成日: 2026-07-05

---

## 0. この資料が満たすべき条件

**提出必須4項目**（すべてのスライドはこの4つのどれかに紐づく）:

1. 問題定義
2. プロダクト・技術・**ビジネス**概要
3. 90秒デモ
4. 市場観点

**狙う受賞軸3つ**（各スライドが「どの軸に効くか」を意識する）:

- 💰 **Investable Startup** … フライホイール（データ・モート）／市場／不公平な優位性
- 🎨 **UX-UI** … デモ体験そのもの＋スライドのビジュアル完成度（ダークCAD基調で製品と統一）
- 🛠 **Biggest Engineering Lift** … コンパイラ（非構造知識→実行可能ルール）＋知識グラフ

**貫くストーリーの芯**: 「**後ろで見てくれている先輩**」— 危険な設計操作をした瞬間に、根拠付きで割り込むAI。

---

## 1. 適用したベストプラクティス（調査結果の要約）

| 原則 | このピッチでの反映 |
|---|---|
| ハッカソンは6〜10枚、1スライド1メッセージ | 下記スライドは8枚コア＋付録。1枚1論点に絞る |
| 問題は審査員が即共感できる具体で | 「2015の教訓が2020に再発」の1本のストーリーで通す |
| デモが主役。コア価値を証明する所だけ見せる | 発火はR1/R2の2ルールのみ。偽陽性ゼロ |
| ライブは落ちる前提でバックアップ | ローカルビルド＋テザリング＋疑似アニメ退避 |
| 装飾より読みやすさ・信頼性 | 大きな寸法数値・等幅フォント・低輝度背景 |
| 記憶に残る一言で締める | "Every factory needs this brain." |
| 精緻な思考と統制された伝え方 | 決定的ルールマッチ採用の理由まで語れるようにする |

---

## 2. スライド骨子（コア8枚 + 付録）

> 各スライドに **【提出項目】** と **【効く受賞軸】** をタグ付け。英語コピーは下書き（team-facing）。

### Slide 1 — Title / Hook 【全体】【UX-UI】
- **英語コピー案**: `Senpai AI — the senior engineer who never leaves.`
  サブ: `A Company Brain for manufacturing: it turns drawing revision history into live design guidance.`
- チーム名 / メンバー / イベント / **ライブURL + QR**（右下に常設）
- ビジュアル: ダークCADワークスポースの断片＋先輩カードのチラ見せ

### Slide 2 — The Problem 【問題定義】【Investable】
- **1本のストーリーで語る**: 2015年、あるフランジで「板厚8mmは強度不足」と学んだ。2020年、別の設計者がそれを知らず8mmに戻し、**まったく同じ失敗を再発**。手戻り＋軽量化断念のコスト。
- 知見の在り処: Excel / PPT / PDF / **人の頭** / そして **CAD図面の△改訂履歴の中**
- 時限性: ベテラン退職で担い手が物理的に消える
- 一言: `The lesson existed. Nobody could see it at the moment it mattered.`
- ※「これはトヨタで実際に観測している痛み（仮説ではない）」と口頭で添える

### Slide 3 — Why Now / The Insight 【問題定義→解決】【Engineering Lift】
- 通説の反転（EUREKA）: 既存ツールが**形式化済み知識しか扱えない**のは、非構造文書→実行可能ルールの変換が技術的に不可能だったから。**LLMで初めて可能に**。
- 一言: `The knowledge was never missing. It just couldn't be executed — until now.`

### Slide 4 — The Solution 【プロダクト概要】【UX-UI】
- **後ろで見てくれている先輩**。危険な操作の瞬間にAIが割り込む:
  - どの過去△に該当するか / 出典文書は何か / 誰が解決したか / 過去に再発した時に何が起きたか
- チャットボットでも検索でもない → YC RFS「Company Brain / executable skills files」の文字通りの実装
- 一言: `Not a chatbot. Not search. A senpai watching your screen.`

### Slide 5 — Live Demo（主役）【90秒デモ】【UX-UI / Engineering Lift】
- ここで実機へ。**ビート表は DESIGN-DOC 準拠**（下に再掲）。
- スライド自体は「DEMO」＋URL/QRのみの繋ぎ。喋りと画面が主役。

  | 秒 | ビート | 画面 |
  |---|---|---|
  | 0–15 | 問題提起: 2015の教訓が2020に再発、知見は△の中で眠る | 再発チェーン図 |
  | 15–40 | **警告の瞬間**: 2025モデルでR5→R3 → 先輩カードが割り込む(R2) | 3Dビューア＋先輩カード |
  | 40–60 | コンパイラ: 報告書テキスト投入 → 構造化JSONが生成 | ライブ抽出シーン |
  | 60–80 | フライホイール: 逃がし形状を適用 → 「理由は干渉回避ですよね？」→ はい → グラフにノード追加 | 知識グラフ |
  | 80–90 | 締め: `Every factory needs this brain.` ＋ QR | ライブURL/QR |

### Slide 6 — How It Works / Tech 【技術概要】【Engineering Lift】
- 3層で説明:
  1. **決定的ルールマッチ**で照合（幻覚ゼロ・遅延ゼロ・偽陽性ゼロ = 製品の生死）
  2. **LLMはコンパイラ**として使用（報告書/△ → 実行可能な構造化レッスン）＋説明生成
  3. **知識グラフ** = 部品⇄△⇄文書⇄人を結ぶ「生きた地図」
- 一言: `A compiler from tribal knowledge to executable design checks.`

### Slide 7 — The Flywheel / Moat 【ビジネス／差別化】【Investable】
- **書き込みパス**: 設計変更の瞬間にAIが確認質問 → ワンタップ回答 → 次車種のための構造化データが貯まる
- 使うほど・設計するほど脳が育つ = **データ・フライホイール = 投資家向けのモート**
- 競合（CoLab / Leo / CADDi）は全て「読むだけ」。書き込みループを持つのはうちだけ
- 一言: `The more you design, the smarter it gets. That's the moat.`

### Slide 8 — Market & Business & Ask 【市場観点／ビジネス概要】【Investable】
- **狭いくさびから語る**: 製造業 × 設計知見の再発防止 → 自動車サプライチェーン → 製造業全体
- **不公平な優位性**: チームはトヨタの中の人間。課題解像度と最初の顧客への人脈
- **どう売るか**: 部門単位SaaS（設計者数×月額）。ROIの物差し = 過去トラ再発1件の防止コストで年間ライセンスを回収
- **Ask / Close**: `Every factory needs this brain.` ＋ ライブURL/QR ＋（YCオフィスアワー・受賞への布石）

### 付録（質疑用・スライドには出さない）
- 「実CADに組み込めるの？」→ CADプラグインAPI経由（CATIA/NX/SolidWorksはアドインAPIを持つ）。今日はスコープ外と明言
- 「偽陽性は？」→ デモはR1/R2のみ発火、照合は決定的。的外れ警告は一度も出さない設計
- ランドスケープ: CoLab AutoReview（最も近い競合・読むだけ）/ Leo AI / CADDi / DraftAid
- The Assignment（実図面50枚での検証計画）— 起業の分水嶺として語れる

---

## 3. スライド設計トークン（UX-UI賞を意識）

- **製品と同じダークCAD基調**で統一（プレゼンと製品の世界観を一致させる）
- ベース: ダークグレー低輝度 / アクセント: 警告=レッド、AI/確認=ティール or パープル、記録済み=グリーン
- 寸法・差分（`R5 → R3`）は**等幅フォント**で強調
- 1スライド1メッセージ。大きな見出し＋最小限のサポートテキスト
- 既存 [presentation/index.html](index.html) の雛形（日本語5枚）は本骨子（英語8枚）で置き換える前提

---

## 4. 未確定・次アクション

- [ ] 本骨子のチームレビュー・合意（特にスライド枚数8で握れるか）
- [ ] 各スライドの英語コピー確定（ネイティブチェック）
- [ ] タイトル/プロダクト名の最終決定（`Senpai AI` は仮）
- [ ] Slide 5 とデモ実機の接続確認（URL/QRの発行）
- [ ] `presentation/index.html` をこの骨子で英語8枚に作り替え
- [ ] デモのバックアップ手順書（ローカル＋テザリング＋疑似アニメ）をスライド外に用意

---

## 5. 出典（ベストプラクティス調査）

- YC — How to build your seed round pitch deck / How to design a better pitch deck
- Hackathon pitch guides（TAIKAI / SlideModel / Devpost demo video tips）
- 要点: 6〜10枚・1スライド1メッセージ・問題は共感できる具体で・デモは主役かつバックアップ必須・記憶に残る締め
