# ピッチ資料 骨子（Pitch Outline）

> 対象: c0mpiled AI Hackathon 提出プレゼン（**英語必須 / 本番デモ90秒**）
> 出典: 承認済み [DESIGN-DOC.md](../docs/DESIGN-DOC.md) / [PREMISES.md](../docs/PREMISES.md) / [core-loop.md](../design/ux/core-loop.md) / [flange-revision-history.md](../design/mocks/flange-revision-history.md)
> 方針: 本ドキュメント（チーム共有用）は日本語、**スライド上の実コピーは英語**。
> 作成日: 2026-07-05

---

## 0. この資料が満たすべき条件

**提出必須4項目**:

1. 問題定義
2. プロダクト・技術・**ビジネス**概要
3. 90秒デモ
4. 市場観点

**狙う受賞軸3つ**:

- **Investable Startup**: 市場の大きさ、明確なSOM、データフライホイール、最初の顧客への近さ
- **UX-UI**: 「後ろで見てくれている先輩」という体験、デモの警告モーメント、ダークCAD基調
- **Biggest Engineering Lift**: 非構造知識をCompany Brain化し、設計イベントに対してLLMが証拠付きで指摘を発火する仕組み

**貫くストーリーの芯**:

「**後ろで見てくれている先輩**」が、危険な設計操作をした瞬間に、過去の根拠付きで割り込む。

---

## 1. 新しいピッチ構成（指定順）

> ユーザー指定の流れ:
> **1 課題 / 2 解決アプローチ / 3 プロダクト概要 / 4 技術概要 / 5 ビジネスモデル概要 / 6 競合比較 / 7 TAM/SAM/SOM**

### 1. 課題（Problem）

**目的**: 審査員に「これは本当に痛い」と即理解させる。

- 2015年、あるフランジで「板厚8mmは強度不足」と学んだ。
- 2020年、別の設計者がそれを知らず8mmに戻し、同じ失敗が再発した。
- 知見は消えていなかった。Excel / PPT / PDF / 人の頭 / **CAD図面の△改訂履歴**の中にあった。
- しかし設計操作の瞬間には見えなかった。
- 企業が大きくなるほど、設計変更の要因は多岐にわたる。軽量化、強度、原価、調達、加工性、品質、法規、顧客要求が部署をまたいで衝突し、なぜその変更をしたのかが追えなくなる。
- ベテラン退職で、知識を持つ人そのものが消えていく。

**英語コピー案**:

`The lesson existed. Nobody saw it when it mattered.`

**見せるもの**:

- 2015 → 2020 の再発タイムライン
- フランジの板厚変化、再発点を赤く表示
- 変更理由の分岐図（軽量化 / 強度 / 原価 / 調達 / 品質 / 法規）
- 「実際の設計現場で観測した痛み」と口頭で補足

---

### 2. 解決アプローチ（Solution Approach）

**目的**: 「検索を良くする」ではなく、企業の知識を設計操作の瞬間に働かせる発想の違いを伝える。

- 既存ツールは、すでに形式化された社内標準しかチェックできない。
- 本質的な未解決は、非構造な設計知見を「いまの設計操作」と接続できなかったこと。
- G-brainのようなCompany Brainに、△注記・報告書・レビューPPT・担当者・過去の設計判断を入れる。
- CAD上の操作を意味イベント化し、LLMがCompany Brainから証拠を取り出して「今、指摘すべきか」を判断する。
- 発火はルールベースではなく、**取得した証拠にgroundされたLLM判断**で行う。警告カードには必ず出典を出す。

**英語コピー案**:

`The knowledge was never missing. It just couldn't be executed — until now.`

**見せるもの**:

- `Design event → G-brain retrieval → evidence-grounded LLM trigger`
- `LLM does not guess; it interrupts only with retrieved company evidence`

---

### 3. プロダクト概要（Product）

**目的**: ユーザー体験を一発で想像させる。

- プロダクト名: `SenpAI`（仮）
- コンセプト: **後ろで見てくれている先輩**
- 設計者が危険な操作をした瞬間に、AIが割り込む。
- 警告カードには以下を表示:
  - どの過去△に該当するか
  - どの報告書・PPTが根拠か
  - 誰が解決したか
  - 過去に再発した時に何が起きたか
  - 推奨アクション
- チャットボットでも検索でもない。ユーザーが質問する前に、設計操作そのものに反応する。

**英語コピー案**:

`Not search. Not a chatbot. A senior engineer watching your design operation.`

**90秒デモの位置づけ**:

- プロダクト概要の直後に実演してもよい。
- ただしスライド構成上は「Product」の中に短いデモ導入を置き、詳細デモは本番トークで吸収する。

**デモビート**:

| 秒 | ビート | 画面 |
|---|---|---|
| 0-15 | 2015の教訓が2020に再発 | 再発チェーン図 |
| 15-40 | 2025モデルでR5→R3、SenpAIが割り込む | 3Dビューア + 警告カード |
| 40-60 | 報告書を投入し、構造化レッスンを生成 | LLM抽出 |
| 60-80 | 推奨形状を適用し、確認質問にYes | 知識グラフにノード追加 |
| 80-90 | `Every factory needs this brain.` | QR / URL |

---

### 4. 技術概要（Technology）

**目的**: 「AIっぽいデモ」ではなく、製品として信頼できる構成だと示す。

**3層構成**:

1. **Observe: CAD Event Stream**
   - CAD上の変更を意味イベントとして取得
   - 例: `part: flange`, `region: fillet`, `operation: R5→R3`, `intent: weight reduction`

2. **Retrieve: G-brain / Company Brain**
   - △注記、報告書、レビューPPT、担当者、過去トラ、設計理由を横断検索
   - 検索結果を部品・変更理由・過去の再発履歴で再ランキング
   - ユーザー権限と部署文脈も反映する

3. **Reason: Evidence-Grounded LLM Trigger**
   - LLMが「この操作は過去の失敗と似ているか」「今割り込むべきか」を判断
   - 発火した場合は、根拠△、報告書、担当者、過去結果を必ず表示
   - 設計者の回答はCompany Brainへ書き戻される

**英語コピー案**:

`The company brain retrieves the evidence. The LLM decides when to interrupt.`

**口頭で補足すること**:

- 今日のデモはWeb擬似CAD。
- 実装経路はCATIA / NX / SolidWorksのアドインAPI。
- 重要なのはCADそのものではなく、設計操作をCompany Brainに接続し、LLMが文脈付きで発火できるアーキテクチャ。

---

### 5. ビジネスモデル概要（Business Model）

**目的**: 「便利ツール」ではなく、予算が付く買い方を示す。

**初期顧客**:

- 自動車OEM / Tier1の設計部門
- 特に製品設計、金型設計、生産技術、品質保証の間で再発防止コストが大きい部署

**売り方**:

- 部門単位SaaS
- 課金: 設計者席数 × 月額、または部門ライセンス
- PoCは1部品群 / 1部署 / 既存トラブル報告書セットから開始

**ROIロジック**:

- 1件の再発防止 = 手戻り工数、試作遅延、レビュー再実施、量産遅延リスクを削減
- 年間ライセンスは「再発1件を防ぐ」だけで回収可能という語り方にする

**フライホイール**:

- 設計者が推奨アクションを適用
- AIが1タップ確認: `Was this for interference?`
- 回答が次世代車種の構造化レッスンになる
- 使うほど顧客固有のCompany Brainが育つ

**英語コピー案**:

`Price against one prevented recurrence. Expand as the customer's brain grows.`

---

### 6. 競合比較（Competition）

**目的**: 「既存ツールと何が違うのか」を表で即答する。

| 競合 | 主な価値 | 強い点 | SenpAIとの差分 |
|---|---|---|---|
| CoLab AutoReview | 3Dモデルに対する設計レビュー、社内標準違反の指摘 | 最も近い。CAD/設計レビュー文脈が強い | 形式化済み標準を読む。未形式知のコンパイルと設計時の書き込みループが弱い |
| Leo AI | PDM/PLM/CAD/PDF横断の知識レイヤー | 横断検索・ナレッジアクセス | ユーザーが探す前提。設計操作に対するプロアクティブ警告ではない |
| CADDi | 図面資産の検索・類似図面活用 | 図面データ化・調達文脈が強い | 図面を探す価値が中心。設計変更の瞬間にチェックを発火する製品ではない |
| DraftAid | 3Dモデルから図面生成 | 図面作成の自動化 | 再発防止・過去知識の実行化ではない |
| SenpAI | Company Brainを使い、設計時にLLMが証拠付きで警告 | △ / 報告書 / 設計操作を接続し、書き込みループを持つ | `retrieve + reason + interrupt + write-back` が差別化 |

**比較軸をスライドでは3つに絞る**:

|  | Formalized docs | Unformalized △ / reports | Writes knowledge at design time |
|---|---:|---:|---:|
| CoLab | Yes | No / limited | No |
| Leo AI | Yes | Partial | No |
| CADDi | Yes | Searchable assets | No |
| SenpAI | Yes | Yes | Yes |

**英語コピー案**:

`Others retrieve documents. SenpAI lets the company brain reason over the design edit — and write back new knowledge.`

---

### 7. TAM / SAM / SOM

**目的**: 市場の大きさを「大きい話」ではなく「取れる順番」で見せる。

> 注意: 数字は本番前に外部ソースで検証する。現時点のアウトラインでは、算出ロジックと必要な入力値を明示する。

#### TAM（Total Addressable Market）

**定義案**:

製造業全体の設計・生産技術・品質保証における、Company Brain / 設計知識再発防止ソフトウェア市場。

**計算式案**:

`TAM = 対象設計/技術者数 × 年間ソフトウェア単価`

**語り方**:

- Company Brainは最終的に全製造業の知識運用基盤になり得る。
- ただしピッチでは「全企業が必要」から始めない。
- 製造業の中でも、再発防止コストが高く、設計知識が世代継承される業界から入る。

#### SAM（Serviceable Available Market）

**定義案**:

自動車OEM / Tier1 / Tier2 の設計・生産技術・品質保証部門。

**計算式案**:

`SAM = 自動車関連の対象技術者数 × 年間単価`

**語り方**:

- 自動車は部品点数が多く、世代開発があり、過去トラ・設計変更・品質再発の痛みが大きい。
- ここで勝てれば、重工、産業機械、医療機器、電子機器へ横展開できる。

#### SOM（Serviceable Obtainable Market）

**定義案**:

最初の2-3年で狙う、日本の自動車設計部門・サプライヤー数社への部門導入。

**計算式案**:

`SOM = 初期導入部署数 × 1部署あたり年間契約額`

**仮説レンジ（要検証）**:

- 初期PoC: 1-3部署
- 初期商用: 5-20部署
- 契約単位: 部門ライセンス、または設計者席数課金

**英語コピー案**:

`SOM is not "all manufacturing." SOM is the first design departments where one prevented recurrence pays for the product.`

**本番前に埋めるべき入力値**:

- 対象企業数（日本自動車OEM / Tier1）
- 1部署あたり設計者数
- 年間単価レンジ
- 再発1件あたりの平均コストレンジ
- PoCから商用転換までの想定期間

---

## 2. 批判家レビュー（Pitch Critic）

### 指摘1: 課題は強いが、対象者が広がりすぎる

「製造業全体」「すべての会社」「Company Brain」と言うと大きく聞こえる一方、審査員には最初の顧客がぼやける。

**改善**:

- 冒頭から「自動車設計部門の再発防止」に絞る。
- TAMは最後に広げる。
- SOMは「最初の部署導入」として具体化する。

### 指摘2: 競合比較がやや都合よく見える

「競合は読むだけ」と言い切ると、CoLabやLeo AIが将来同じ方向に来た時の防御が弱く見える。

**改善**:

- 差分を「読む/読まない」だけにしない。
- `retrieve + reason + interrupt + write-back` の4点セットにする。
- 特に「設計操作から知識を書き戻す」点をモートとして強調する。

### 指摘3: TAM/SAM/SOMの数字がないと投資家向けには弱い

市場観点を入れても、数字なしでは「市場の大きさを考えた」証明が弱い。

**改善**:

- 本番前に数字を外部ソースで検証する。
- ただし今のアウトラインでは、計算式と入力値を先に固定する。
- 数字は大きく見せるより、SOMの現実味を優先する。

### 指摘4: 技術概要が高度だが、ビジネスとの接続が弱くなりがち

G-brain検索やLLM発火は面白いが、それだけだと技術デモに見える。

**改善**:

- 技術説明の最後を必ず「だから証拠付きで割り込める」「出典があるから現場が信頼できる」に接続する。
- ビジネスモデルでは「1件の再発防止で回収」を繰り返す。

### 指摘5: デモが強いので、スライド構成がデモを邪魔する可能性がある

7章構成を忠実にやりすぎると、90秒デモの熱量が下がる。

**改善**:

- プロダクト概要の直後にデモを入れる。
- 残りの技術・ビジネス・競合・TAMは、デモで見たものの意味づけとして話す。
- スライド順は指定の7章を保ちつつ、Product章内にデモビートを含める。

---

## 3. 批判反映後の推奨スライド順

> 7章構成を守りながら、ピッチとしての熱量を落とさない実装順。

### Slide 1 — Title / Hook

- `SenpAI — the senior engineer who never leaves.`
- サブ: `A Company Brain for automotive design recurrence prevention.`
- QR / Live URL

### Slide 2 — 1. 課題

- 2015 → 2020 再発ストーリー
- `The lesson existed. Nobody saw it when it mattered.`

### Slide 3 — 2. 解決アプローチ

- 設計イベント → G-brain検索 → 証拠付きLLM発火
- `Company brain retrieves evidence. The LLM decides when to interrupt.`

### Slide 4 — 3. プロダクト概要 + Demo Transition

- 後ろで見てくれている先輩
- `Not search. Not a chatbot. It interrupts the risky edit.`
- ここから90秒デモへ

### Slide 5 — 4. 技術概要

- CAD Event Stream
- G-brain Retrieval
- Evidence-Grounded LLM Trigger
- `Every warning shows the source: △, report, owner, outcome.`

### Slide 6 — 5. ビジネスモデル概要

- 部門単位SaaS
- PoC → 部門導入 → サプライチェーン展開
- `One prevented recurrence pays for the annual license.`

### Slide 7 — 6. 競合比較

- CoLab / Leo AI / CADDi / DraftAid
- 比較軸は `retrieve / reason / interrupt / write-back`

### Slide 8 — 7. TAM/SAM/SOM

- TAM: 製造業のCompany Brain / 設計知識基盤
- SAM: 自動車OEM / Tier1 / Tier2の技術部門
- SOM: 最初の数部署への部門導入
- `Start narrow. Win the recurrence wedge. Expand to the factory brain.`

### Slide 9 — Close / Ask

- `Every factory needs this brain.`
- QR / live URL / 次のPoC募集

---

## 4. 未確定・次アクション

- [ ] TAM/SAM/SOMの外部ソース調査と数字入力
- [ ] 1部署あたり年間契約額の仮説を決める
- [ ] 再発1件あたりのコストレンジを、手戻り工数・試作遅延・レビュー工数で見積もる
- [ ] 競合比較の表現を英語スライド用に短文化
- [ ] `presentation/index.html` または `presentation/pitch-b.html` を新構成へ反映
- [ ] 90秒デモの位置をSlide 4直後に固定し、リハーサルで時間配分を確認

---

## 5. 出典・前提

- YC Company Brain RFS の「living map / executable skills files」文脈
- [PREMISES.md](../docs/PREMISES.md) の競合ランドスケープ
- [DESIGN-DOC.md](../docs/DESIGN-DOC.md) のThe Assignment
- [DEMO-OPS.md](../docs/DEMO-OPS.md) のデモ運用方針
- 市場規模の具体数字は未入力。必ず外部ソースで検証してから本番スライドへ入れる。
