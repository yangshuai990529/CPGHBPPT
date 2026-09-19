# Product PPT quality rubric (local review, not employee scoring)

Each dimension is `rule_checked`, `needs_review`, or `not_assessed`; no synthetic total grade. Automated QA only checks the machine-observable subset. Human review remains required for strategic truth and visual persuasion.

| Dimension | Main question | Automated boundary |
|---|---|---|
| Product Logic | Problem → evidence → insight → opportunity → strategy → feature connected? | Upstream IDs, not causal validity |
| Evidence Quality | Does each Claim trace to a timely, appropriately scoped Source? | References and missing IDs, not factual truth |
| Insight Strength | More than one fact, meaningful So What? | Supporting IDs; strength needs human assessment |
| Storyline Coherence | Does the story answer the decision in a sensible order? | Duplicate message and count only |
| Executive Clarity | Can the title convey a defensible conclusion quickly? | Length/vague terms; cannot read a leader's mind |
| Visual Hierarchy | Is the focus readable and appropriately positioned? | Existing layout QA only; imported PPT visuals unassessed |
| Readability | Is text concise and terminology consistent? | Title and body length checks |
| Data Integrity | Are unit, period, region and population comparable? | Not assessed until structured data present |
| Brand Compliance | Corporate safe areas, logo, fonts? | Existing renderer QA for generated slides only |
| Actionability | Are decision/action and owner clear? | Not automatically assessed |

Critic → issue → suggested repair → optional recheck, at most **3** repair cycles. Current implementation produces suggestions and a review report; it does not silently rewrite user content or claim an image-based visual inspection. Scores never rank people.
