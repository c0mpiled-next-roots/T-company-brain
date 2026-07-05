# CLAUDE.md

Claude Code 向けのプロジェクトガイド。

## プロジェクト概要

T-company-brain — ハッカソン用プロジェクト。

## ディレクトリ構成

- `presentation/` — プレゼン資料（HTMLスライド）
- `design/` — デザイン検討（カラーパレット・モックアップ・コンポーネント）
- `docs/` — 企画ドキュメント（DESIGN-DOC.md=承認済み設計書 / PREMISES.md=前提 / APPROACHES.md=実装アプローチ比較）
- `references/` / `transcripts/` — 参考資料・企画メモ

## 作業ルール

- ユーザーへの応答・コメントは日本語で書く
- HTMLは静的ファイルとして、ブラウザで直接開いて確認できる形を保つ
- 各ディレクトリの用途は各READMEを参照する

## GBrain Configuration (configured by /setup-gbrain)
- Mode: local-stdio
- Engine: postgres (Supabase, shared team brain)
- Database: Session pooler at aws-0-ap-northeast-1.pooler.supabase.com:5432 (project ref: whymjsmhntghdlkzjcrk)
- Config file: ~/.gbrain/config.json (mode 0600 — holds the connection URL; never commit)
- Setup date: 2026-07-05 (migrated from PGLite same day; 47 pages transferred)
- MCP registered: yes (user scope, with GBRAIN_DISABLE_DIRECT_POOL=1)
- Artifacts sync: full
- Current repo policy: read-write

Team onboarding: get the connection URL from the brain owner via a password
manager (never plaintext chat), then run `/setup-gbrain` and pick "Supabase,
I already have a connection string". Choose trust policy "shared".

Machine note (IPv4-only networks): Supabase direct-connection hosts
(db.*.supabase.co) are IPv6-only. Set `GBRAIN_DISABLE_DIRECT_POOL=1` for all
gbrain processes (shell profile + MCP registration env), otherwise
migrate/schema operations fail with `getaddrinfo ENOTFOUND`.

**Version pin (important for all members): the shared brain is at schema
v119 → your gbrain CLI must be ≤ v0.42.54** (e.g. `git -C ~/gbrain checkout
814258dd` = v0.42.53.0). Newer CLIs (v0.42.55+) auto-run migration 120+ on
init, which fails over the Session Pooler on IPv4-only networks
(wedged-pooler partial-commit; direct connection is IPv6-only). Do NOT
migrate the shared brain solo — when we upgrade, the brain owner migrates
on an IPv6 network and everyone checks out the matching version together.

Embedding: the brain uses `zeroentropyai:zembed-1` (1280d). Each member
needs `ZEROENTROPY_API_KEY` in their shell profile (get it from the brain
owner via password manager). Without it, reads/keyword search work but
semantic search and import/embed don't.

## GBrain Search Guidance (configured by /sync-gbrain)
<!-- gstack-gbrain-search-guidance:start -->

GBrain is set up and synced on this machine. The agent should prefer gbrain
over Grep when the question is semantic or when you don't know the exact
identifier yet. Two indexed corpora available via the `gbrain` CLI:
- This repo's code (registered as `gstack-code-t-company-brain` source).
- `~/.gstack/` curated memory (registered as `gstack-artifacts-nakajimakazunor`
  source via the existing federation pipeline).

Prefer gbrain when:
- "Where is X handled?" / semantic intent, no exact string yet:
    `gbrain search "<terms>"` or `gbrain query "<question>"`
- "Where is symbol Y defined?" / symbol-based code questions:
    `gbrain code-def <symbol>` or `gbrain code-refs <symbol>`
- "What calls Y?" / "What does Y depend on?":
    `gbrain code-callers <symbol>` / `gbrain code-callees <symbol>`
- "What did we decide last time?" / past plans, retros, learnings:
    `gbrain search "<terms>" --source gstack-artifacts-nakajimakazunor`

Grep is still right for known exact strings, regex, multiline patterns, and
file globs. The brain auto-syncs incrementally on every gstack skill start.
Run `/sync-gbrain` to force-refresh, `/sync-gbrain --full` for full reindex.

<!-- gstack-gbrain-search-guidance:end -->

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
