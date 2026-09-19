---
name: ai-agent-analysis
description: Distinguish TV voice assistance, automation and agent-like planning/execution by evidence-backed perception, memory, goal, action and user control.
---
# AI TV Agent Analysis
Version: 1.1.0

## Purpose
Determine which part of a claimed AI agent workflow is actually evidenced.

## When to Use
A TV product deck claims contextual AI assistance, planning, cross-device action or autonomous workflows.

## When NOT to Use
Do not treat a single voice request, search UI or chatbot demo as evidence of agent autonomy.

## Input
User goal, perception input, state/memory, reasoning/planning evidence, available actions, confirmation, failure, privacy and Source IDs.

## Reasoning Process
Map request → understanding → plan → authorized action → visible result → correction/reset. Distinguish one-shot assistant response from multi-step goal execution. Record whether memory is session-only or persistent and whether a user can inspect, approve or undo action. Mark unsupported stages unknown.

## Output
Capability-boundary table and safety/interaction questions, not a general `AI Agent ✓` verdict.

## Output Schema
Source/Evidence/Claim for facts; Product Reasoning Insight only with upstream evidence.

## Quality Criteria
Every stage in the table is attributed to a scoped source or explicitly unknown; privacy assertions are not inferred from UI labels.

## Common Mistakes
Do not infer cloud memory or cross-device execution from personalization marketing copy.

## Example
If evidence shows voice search and no planning or action proof, describe a voice-assisted search interaction, not an autonomous agent.
