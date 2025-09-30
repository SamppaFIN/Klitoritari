# 🔗 Document Relations Index

This index maps how Codex documents relate, reference, and depend on each other.

## Core Canon
- 00_CANONICAL_MVP_BASE_SCROLL.md → canonical scope and success gates
- 98_BRDC_Instructions.md → process for cross-check and tickets
- 99_BRDC_Success_Criteria.md → statuses, metrics, and tracking

## Architecture & Systems
- 13_System_Orchestra.md → subsystem boundaries; references 11_API_AI_Index.md, 15_Database_Schema_Reference.md
- 15_Database_Schema_Reference.md → tables for endpoints in 11_API_AI_Index.md
- 16_Workflows_Endpoints_DB_Map.md → binds 14_User_Interaction_Workflows.md to 11_API_AI_Index.md and 15_Database_Schema_Reference.md

## UX & Components
- Components/* → implement UI; consume 14_User_Interaction_Workflows.md
- 14_User_Interaction_Workflows.md → uses Moon/AEL/Reaction/Aura docs
- 18_Moon_Gradients_Tokens.md → theming used by Moon components
- 17_Monk_Muse_Sacred_Principles.md → global design ethos for all UI

## Delivery & Quality
- 12_MVP_Complete_Audit_Checklist.md → gap tracker; feeds BRDC tickets
- 02_DoubleCheck_Audit.md → validation against canonical
- Tests/Mobile/README.md → verifies 14_User_Interaction_Workflows.md on mobile

## Links
- Canon → Architecture → UX → Delivery → Tests
- Data model (15) underpins API (11); Workflows (16) traverse both
- Ethos (17) and Tokens (18) style Components/*
