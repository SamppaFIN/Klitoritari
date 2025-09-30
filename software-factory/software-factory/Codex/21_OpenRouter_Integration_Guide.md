---
brdc:
  id: AASF-OPENROUTER-021
  title: OpenRouter Integration Guide — Multi-Model Routing
  owner: 🌸 Aurora (AI)
  status: draft
  version: 1.0.0
  last_updated: 2025-09-30
---

# Objectives
- Use free/low-cost models first; auto-fallback to stronger models by risk.
- Route by task: generation vs. verification vs. planning vs. code-diff.
- Enforce cost, latency, and quality budgets.

# Setup
Env
- OPENROUTER_API_KEY=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
- OPENROUTER_BASE=https://openrouter.ai/api/v1

Routing Policy (YAML sketch)
```
policy_version: 1
budgets:
  max_cost_usd_per_day: 1.00
  max_latency_ms_p95: 40000
tiers:
  - name: free_first
    models: [openai/gpt-4o-mini, google/gemini-flash-1.5, anthropic/claude-3-haiku]
    fallback: tier_medium
    use_for: [summaries, search, scaffolding]
  - name: tier_medium
    models: [qwen/qwen-2.5-72b-instruct, mistralai/mixtral-8x7b-instruct]
    fallback: tier_heavy
    use_for: [test-authoring, static-analysis]
  - name: tier_heavy
    models: [anthropic/claude-3.5-sonnet, openai/gpt-4o, google/gemini-1.5-pro]
    use_for: [security-review, refactors, complex planning]
```

Task→Tier
- RED tests: free_first → tier_medium if coverage/risk unmet.
- GREEN fixes: tier_medium; escalate if diffs > N lines or lints fail.
- Security/Perf review: tier_heavy only.

Client Sketch
- Build a thin client: route(task, payload, budgets) → call OpenRouter
- Retry on rate-limit; rotate model; persist trace + cost

Verification
- Cross-verify: generate with free tier, verify with a different model.
- Require verifier agreement score ≥ threshold to proceed.
