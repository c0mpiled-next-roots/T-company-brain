# CLAUDE.md

Claude Code 向けのプロジェクトガイド。

## プロジェクト概要

T-company-brain — ハッカソン用プロジェクト。

## ディレクトリ構成

- `presentation/` — プレゼン資料（HTMLスライド）
- `design/` — デザイン検討（カラーパレット・モックアップ・コンポーネント）

## 作業ルール

- ユーザーへの応答・コメントは日本語で書く
- HTMLは静的ファイルとして、ブラウザで直接開いて確認できる形を保つ
- 各ディレクトリの用途は各READMEを参照する

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
- Author a backlog-ready spec/issue → invoke /spec
