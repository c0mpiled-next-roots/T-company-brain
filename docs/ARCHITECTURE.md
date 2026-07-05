# SenpAI — Technical Architecture

*How we structure design knowledge, and how the AI agent uses it.*

SenpAI is a proactive AI agent for manufacturing designers: while you design, it pulls
relevant past lessons — buried in drawing revision histories (△ marks), trouble
reports, and veterans' heads — and interrupts you **before** you repeat a known
failure. Like a senior engineer watching over your shoulder.

This document describes the production architecture. The hackathon demo implements
the full loop end-to-end with a web-based pseudo-CAD viewer; the production path
replaces the viewer with CAD add-ins (CATIA CAA / NX Open / SOLIDWORKS API — all
officially supported extension surfaces).

---

## 1. Design principle: LLMs compile, predicates decide

The core failure mode of an interrupting assistant is a false positive: **a senpai
who interrupts wrongly gets ignored forever.** Our architecture is built around one
asymmetry:

- **Recall failures (missed knowledge) are cheap** — the designer is no worse off
  than today.
- **Precision failures (wrong interruption) are fatal** — they destroy trust in the
  product.

Therefore: LLMs and semantic retrieval are responsible for **recall** (finding
candidate knowledge across messy, unstructured sources). The **decision to
interrupt** always passes a deterministic verification gate (machine-checkable
predicates over measured geometry). LLMs compile knowledge; predicates decide.

```
┌─ KNOWLEDGE PLANE (async, LLM-powered) ─────────────────────────────┐
│ Ingest: △ revision histories, trouble reports, PPT/Excel, minutes  │
│   → LLM compiler → structured lessons (stored in gbrain)           │
│   → lesson → executable check (predicate), human-approved          │
└────────────────────────────┬───────────────────────────────────────┘
                             ↓ compiled, versioned knowledge
┌─ DESIGN-TIME PLANE (seconds-scale, agentic via MCP) ───────────────┐
│ CAD add-in: geometric feature extraction (deterministic)           │
│   → agent: semantic retrieval (RAG) → verification gate            │
│   → HARD warning (predicate passed) or SOFT advisory (similarity)  │
│   → flywheel: capture the designer's decision as a new lesson      │
└────────────────────────────────────────────────────────────────────┘
```

---

## 2. Data model: the structured lesson

One lesson = one unit of executable design knowledge, stored as a **gbrain page**
(markdown body + structured frontmatter). Human-readable, machine-queryable,
git-auditable.

```yaml
# lesson frontmatter (schema v1)
id: L-2015-1
category: insufficient_strength      # taxonomy: strength / interference / manufacturability / ...
part_family: fastening_flange        # applicability by FEATURE CLASS, not part number
region_type: fastening_area          # geometric-semantic region
feature_type: plate
operation: thickness_change          # what design operation this lesson concerns
predicate: "region=fastening_area AND thickness_mm < 10"   # machine-checkable firing condition
severity: high
outcome: >
  FEM found stress concentration at the fastening area; 8mm plate failed
  fatigue criteria (SF 1.1 < 1.5). Fixed by 8→10mm (+120g).
provenance:
  source_rev: "2015 model △1"        # the revision mark this was learned from
  source_doc: "Strength Study Report FLG-2014-06"
  author: "Yamada (Design)"
  year: 2014
lifecycle:
  status: approved                    # draft → approved → superseded
  approved_by: "senior engineer"      # human gate before a lesson can HARD-interrupt
  valid_from: 2014-06
  superseded_by: null                 # bi-temporal: knowledge has generations too
confidence: verified                  # verified (predicate) / anecdotal (soft-only)
```

Key schema decisions:

- **Geometric signature** (`part_family`, `region_type`, `feature_type`,
  `operation`): lessons generalize by feature class, so knowledge learned on one
  flange applies to every fastening flange — not just the same part number.
- **`predicate`**: the "executable skill." A lesson without a predicate can still be
  retrieved and shown — but only as a soft advisory, never as a hard interruption.
- **`lifecycle` with supersession**: knowledge itself has revision history (a 2015
  steel-era lesson may be superseded by a 2022 aluminum guideline). gbrain's
  bi-temporal facts model supports this natively.
- **`provenance`**: every warning cites the △, the document, and the person. The
  agent never asserts knowledge it cannot attribute.

### Why gbrain as the knowledge store

We deliberately did not build a custom knowledge database:

| Need | gbrain provides |
|---|---|
| Structured + human-readable storage | Markdown pages with typed frontmatter |
| Semantic retrieval | Postgres + pgvector embedding search (proven stack) |
| Knowledge generations / supersession | Bi-temporal facts (`valid_from` / `superseded_by`) |
| Provenance graph (△ ⇄ docs ⇄ people) | Page links = the "living map" |
| **Agent access** | **Built-in MCP server (`gbrain serve`)** — no custom protocol work |
| Team sharing | Shared Postgres (Supabase) backend, already running for our team |

---

## 3. Knowledge plane: the compiler pipeline

```
raw documents ──→ [LLM extraction] ──→ draft lesson ──→ [human approval] ──→ approved lesson
 (△ tables,          Claude:              status:draft      senior engineer      predicate active,
  reports, PPT)      doc → schema                           reviews predicate    agent may interrupt
```

1. **Extraction (LLM, batch).** Claude reads a trouble report / revision table and
   emits a lesson in the schema above. This is the scene shown live in the demo
   ("Knowledge Compiler": Japanese report in, structured lesson out in seconds).
2. **Linking.** The △ mark acts as the **link key**: terse revision annotations
   ("△1 thickness +2mm for strength") point to the richer documents where causal
   knowledge lives. We compile the documents; the △ anchors them to geometry and
   generations.
3. **Human approval gate.** A lesson's predicate must be approved by a senior
   engineer before it can hard-interrupt anyone. AI proposes; humans certify. This
   is our structural answer to false-positive risk — and the review cost is minutes
   per lesson, not authorship from scratch.

---

## 4. Design-time plane: how the agent uses the brain

Designers think while they design; a few seconds of latency is acceptable. This lets
the runtime be **fully agentic**: the CAD add-in only extracts facts, and the SenpAI
agent orchestrates retrieval → verification → response via MCP.

### Stage ① Geometric feature extraction (deterministic, CAD-side)

Triggered on edit pauses (debounced). Produces a **design-context document**:
`{part_family, region, feature, operation, measured params, adjacent-part clearances}`.

Real-world CAD data is heterogeneous, so extraction is tiered:

| Model class | Method | Fidelity |
|---|---|---|
| **Parametric** (feature tree exists) | Feature tree + dimension APIs; parametric diff of the edit | High (exact) |
| **Dumb geometry** ("stitched surfaces", imported/legacy) | B-rep interrogation: curvature-based face classification (fillet detection), ray/midsurface sampling (effective thickness), hole/boss recognition | Medium (measured, approximate) |
| **Semantic labeling** (is this region a *fastening area*?) | Geometric heuristics (bolt-hole pattern + fastener contact) + LLM/VLM assist from context (part name, assembly neighbors, drawing notes); cached per part revision | Tagged with confidence |

B-rep interrogation on dumb geometry is proven territory — commercial DFM checkers
do exactly this today. Our novelty is not the geometry analysis; it is what the
analysis is checked *against*.

### Stage ② Semantic retrieval (RAG — this is where LLM/embeddings earn their keep)

The design-context document is embedded and matched against the lesson corpus in
gbrain (pgvector), with metadata filters (`part_family`, `region_type`,
`operation`). Shape semantics are fuzzy — "thinning a mounting plate" and
"reducing flange thickness" must retrieve the same lesson. Recall is won here.

### Stage ③ Verification gate (deterministic — precision is won here)

For each candidate lesson, its `predicate` is evaluated against Stage ①'s measured
values. The warning tier follows one rule:

> **warning tier = min(knowledge confidence, extraction fidelity)**

| Predicate passes on high-fidelity measurement | 🔴 **HARD warning** — the senpai interrupts, with provenance |
|---|---|
| Predicate passes on approximate measurement (dumb geometry) | 🟡 SOFT advisory — "worth checking: measured ~8mm here" |
| No predicate, but high semantic similarity | 🟡 SOFT advisory — "a similar case exists: 2015 △2" |
| Neither | silence |

A false positive on a soft advisory costs nothing (ignore it); a hard interrupt is
reserved for verified knowledge on reliable measurements. Trust is preserved by
construction, on both the knowledge side and the geometry side.

### Stage ④ Response composition (LLM)

The agent composes the senpai-voice message from the verified lesson: what happened,
which △, which document, who solved it, what the proven alternative is. The LLM
writes the *prose*, never the *facts* — all facts come from the matched lesson.

### MCP surface

The agent reaches the brain through MCP — gbrain's built-in server plus a thin
product layer (4 tools):

| Tool | Plane | Role |
|---|---|---|
| `check_design(context)` | design-time | Stage ②+③: retrieve candidates, evaluate predicates, return tiered findings |
| `explain_warning(lesson_id)` | knowledge | Deep provenance: △ → documents → people (the living map) |
| `capture_decision(change, reason)` | write path | Flywheel: persist a confirmed design decision as a draft lesson |
| `compile_lessons(doc)` | knowledge | Batch compilation: document → draft lessons |

---

## 5. The flywheel: knowledge that grows as you design

When a designer accepts a change (e.g., applies the recommended relief shape), the
agent asks **one confirmation question** ("The reason is clearing the battery
bracket, correct?"). One tap, and a new structured lesson — with geometry context,
operation, reason, author, and generation — lands in the brain as a draft.

This is the moat: every existing tool (CoLab AutoReview, Leo AI, CADDi) **reads**
formalized knowledge. None **capture** it at the moment of design. With SenpAI, the
act of designing itself feeds the next generation's brain — the map stays alive, and
the customer's switching cost compounds with every design session.

---

## 6. What the demo shows vs. the production path

| Component | Demo (today) | Production |
|---|---|---|
| CAD surface | Web pseudo-CAD (three.js), named parameters | CAD add-ins (CATIA CAA / NX Open / SW API), tiered extraction (§4-①) |
| Matching | 2 predicate rules (R1/R2), local, zero false positives | Full 3-stage pipeline (retrieve → verify → compose) |
| Warning text | Pre-generated (demo determinism) | LLM-composed from matched lessons (§4-④) |
| Knowledge store | lessons.json | gbrain (Supabase Postgres + pgvector), shared team brain |
| Compiler scene | Live: Japanese report → structured lesson JSON | Same pipeline, batch + human approval gate |
| Flywheel | Live: confirm → graph node appears | Same, writes draft lessons via MCP |

Everything in the demo is a truthful, working miniature of this architecture: the
warning moment, the compiler, and the flywheel all execute end-to-end today.

---

## 7. Why this is credible

1. **No magic in the hot decision.** Interruptions require deterministic predicate
   passes on measured geometry. LLM hallucination cannot produce a hard warning.
2. **Boring, proven infrastructure.** B-rep feature interrogation (DFM-proven),
   Postgres + pgvector, markdown + git audit trail, MCP as the agent protocol.
3. **Honest about messy reality.** Tiered extraction assumes real factories have
   both parametric models and stitched-surface legacy data — and degrades warning
   strength instead of guessing.
4. **Humans certify what interrupts humans.** AI compiles at near-zero cost; a
   senior engineer approves in minutes. Quality control is a feature, not overhead.
5. **The team lives this problem.** We work inside a major automotive OEM; the
   recurrence chain in our demo data mirrors what we see at work.
