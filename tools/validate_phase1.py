#!/usr/bin/env python3
"""Dependency-free validator for the Phase 1 repository contracts.

It validates the JSON Schema subset used by this project and cross-file
invariants. It is not intended to replace a full Draft 2020-12 validator in
production.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ERRORS: list[str] = []
CHECKS: list[str] = []


def load(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        ERRORS.append(f"{path.relative_to(ROOT)}: invalid JSON: {exc}")
        return None


def type_ok(value, expected) -> bool:
    mapping = {
        "object": dict,
        "array": list,
        "string": str,
        "integer": int,
        "number": (int, float),
        "boolean": bool,
        "null": type(None),
    }
    if expected == "integer":
        return isinstance(value, int) and not isinstance(value, bool)
    if expected == "number":
        return isinstance(value, (int, float)) and not isinstance(value, bool)
    return isinstance(value, mapping[expected])


def resolve_ref(schema, ref):
    if not ref.startswith("#/"):
        raise ValueError(f"unsupported external $ref: {ref}")
    node = schema
    for part in ref[2:].split("/"):
        node = node[part.replace("~1", "/").replace("~0", "~")]
    return node


def condition_matches(value, condition) -> bool:
    if not isinstance(value, dict):
        return False
    for key in condition.get("required", []):
        if key not in value:
            return False
    for key, rule in condition.get("properties", {}).items():
        if key not in value:
            continue
        if "const" in rule and value[key] != rule["const"]:
            return False
        if "enum" in rule and value[key] not in rule["enum"]:
            return False
    return True


def validate(value, rule, schema, where):
    if "$ref" in rule:
        return validate(value, resolve_ref(schema, rule["$ref"]), schema, where)

    expected = rule.get("type")
    if expected:
        choices = expected if isinstance(expected, list) else [expected]
        if not any(type_ok(value, choice) for choice in choices):
            ERRORS.append(f"{where}: expected {choices}, got {type(value).__name__}")
            return

    if "enum" in rule and value not in rule["enum"]:
        ERRORS.append(f"{where}: {value!r} is not in enum")
    if "const" in rule and value != rule["const"]:
        ERRORS.append(f"{where}: expected constant {rule['const']!r}")

    if isinstance(value, str):
        if len(value) < rule.get("minLength", 0):
            ERRORS.append(f"{where}: string is shorter than minLength")
        if "pattern" in rule and re.search(rule["pattern"], value) is None:
            ERRORS.append(f"{where}: {value!r} does not match {rule['pattern']}")

    if isinstance(value, (int, float)) and not isinstance(value, bool):
        if "minimum" in rule and value < rule["minimum"]:
            ERRORS.append(f"{where}: {value} is below minimum {rule['minimum']}")

    if isinstance(value, list):
        if len(value) < rule.get("minItems", 0):
            ERRORS.append(f"{where}: array is shorter than minItems")
        if rule.get("uniqueItems"):
            encoded = [json.dumps(item, sort_keys=True, ensure_ascii=False) for item in value]
            if len(encoded) != len(set(encoded)):
                ERRORS.append(f"{where}: array items are not unique")
        if "items" in rule:
            for index, item in enumerate(value):
                validate(item, rule["items"], schema, f"{where}[{index}]")

    if isinstance(value, dict):
        for key in rule.get("required", []):
            if key not in value:
                ERRORS.append(f"{where}: missing required property {key}")
        properties = rule.get("properties", {})
        for key, item in value.items():
            if key in properties:
                validate(item, properties[key], schema, f"{where}.{key}")
            elif rule.get("additionalProperties") is False:
                ERRORS.append(f"{where}: unexpected property {key}")

    for branch in rule.get("allOf", []):
        if "if" in branch and condition_matches(value, branch["if"]):
            validate(value, branch.get("then", {}), schema, where)
        elif "if" not in branch:
            validate(value, branch, schema, where)


def validate_instance(instance_path, schema_path, each=False):
    instance = load(instance_path)
    schema = load(schema_path)
    if instance is None or schema is None:
        return
    values = instance if each else [instance]
    for index, value in enumerate(values):
        suffix = f"[{index}]" if each else ""
        validate(value, schema, schema, f"{instance_path.relative_to(ROOT)}{suffix}")
    CHECKS.append(f"schema:{instance_path.relative_to(ROOT)}")


def validate_skills():
    required = [
        "## Purpose", "## When to Use", "## When NOT to Use", "## Input",
        "## Reasoning Process", "## Output", "## Output Schema",
        "## Quality Criteria", "## Common Mistakes", "## Example",
    ]
    files = sorted((ROOT / "skills").glob("*/*/SKILL.md"))
    if len(files) < 38:
        ERRORS.append(f"skills: expected at least 38 SKILL.md files, found {len(files)}")
    for path in files:
        text = path.read_text(encoding="utf-8")
        for heading in required:
            if heading not in text:
                ERRORS.append(f"{path.relative_to(ROOT)}: missing {heading}")
        if not text.startswith("---\n") or "name:" not in text.split("---", 2)[1]:
            ERRORS.append(f"{path.relative_to(ROOT)}: invalid or missing YAML frontmatter")
    CHECKS.append(f"skills:{len(files)}")


def validate_cross_references():
    deck = load(ROOT / "tests/ai-picture/deck-plan.json")
    slides = load(ROOT / "tests/ai-picture/slide-specs.json")
    sources = load(ROOT / "tests/ai-picture/sources.json")
    layouts = load(ROOT / "design-system/layout-registry.json")
    if None in (deck, slides, sources, layouts):
        return

    deck_ids = [item["slide_id"] for item in deck["slides"]]
    spec_ids = [item["slide_id"] for item in slides]
    if deck_ids != spec_ids:
        ERRORS.append("cross-ref: Deck Plan slide order does not match Slide Specs")
    if len(deck_ids) != len(set(deck_ids)):
        ERRORS.append("cross-ref: duplicate slide_id")

    valid_sources = {item["source_id"] for item in sources}
    valid_layouts = {item["layout_id"] for item in layouts["layouts"]}
    for slide in slides:
        if slide["layout"]["layout_id"] not in valid_layouts:
            ERRORS.append(f"{slide['slide_id']}: unknown layout_id")
        for source_id in slide["sources"]:
            if source_id not in valid_sources:
                ERRORS.append(f"{slide['slide_id']}: unknown source {source_id}")
        for evidence in slide["evidence"]:
            for source_id in evidence["source_ids"]:
                if source_id not in valid_sources:
                    ERRORS.append(f"{slide['slide_id']}: evidence references unknown source {source_id}")
        if slide["status"] == "ready_for_renderer" and any(ev["status"] == "needed" for ev in slide["evidence"]):
            ERRORS.append(f"{slide['slide_id']}: ready_for_renderer with needed evidence")
    CHECKS.append("cross-references")


def main():
    for schema_path in sorted((ROOT / "schemas").glob("*.schema.json")):
        data = load(schema_path)
        if data is not None and data.get("$schema") != "https://json-schema.org/draft/2020-12/schema":
            ERRORS.append(f"{schema_path.relative_to(ROOT)}: unexpected JSON Schema dialect")
    CHECKS.append("schema-json-syntax")

    validate_instance(ROOT / "tests/ai-picture/request.json", ROOT / "schemas/project.schema.json")
    validate_instance(ROOT / "tests/ai-picture/deck-plan.json", ROOT / "schemas/deck-plan.schema.json")
    validate_instance(ROOT / "tests/ai-picture/slide-specs.json", ROOT / "schemas/slide-spec.schema.json", each=True)
    validate_instance(ROOT / "tests/ai-picture/sources.json", ROOT / "schemas/source.schema.json", each=True)

    pattern_schema = ROOT / "schemas/pattern.schema.json"
    for pattern in sorted((ROOT / "knowledge/patterns").glob("*/*.json")):
        validate_instance(pattern, pattern_schema)

    for json_path in sorted(ROOT.rglob("*.json")):
        load(json_path)
    CHECKS.append("all-json-syntax")
    validate_skills()
    validate_cross_references()

    result = {"status": "pass" if not ERRORS else "fail", "checks": CHECKS, "errors": ERRORS}
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if not ERRORS else 1


if __name__ == "__main__":
    sys.exit(main())
