# Layout and Rendering Architecture

## Pipeline

`Deck Plan + Slide Specs -> Spec Normalization -> Density Analysis -> Layout Selection -> Component Planning -> Constraint Layout -> Corporate Master -> PPTX Rendering -> Preview Provider -> Rule QA -> Auto Repair -> Re-render -> Finalizer`

## Layer boundaries

- Thinking Skill determines what the slide says.
- Visualization Skill determines which relationship should be visualized.
- Layout Selector chooses a content pattern inside the safe area.
- Constraint Layout calculates component frames.
- Component Renderer creates editable PowerPoint objects from tokens.
- Master Renderer preserves imported corporate layouts and locked areas.
- QA evaluates geometry and evidence presentation; it does not change product logic.
- Repair may reflow, switch layout, restore image aspect ratio or request a split. It may not invent content.

## Runtime modules

- `engine/design/`: loads registries and resolves tokens.
- `engine/components/`: reusable PowerPoint components.
- `engine/layout/`: selection and density decisions.
- `engine/layouts/`: 20 safe-area layout patterns.
- `engine/visualizations/`: editable visualization renderers.
- `engine/assets/`: contain, cover and crop image handling.
- `engine/renderer/`: deck, slide, component, chart, image and master orchestration.
- `engine/preview/`: provider-neutral preview interface; macOS uses QuickLook plus Chrome/Chromium, while LibreOffice is the cross-platform fallback.
- `engine/qa/`: rule-based geometry, density, source and image QA.
- `engine/repair/`: bounded repair policies.
- `engine/bin/`: build entrypoint.

## Corporate Master composition

The renderer imports `产品PPT模板.pptx`, duplicates the supplied cover, content and ending slides, and adds authored objects only to editable regions. It does not redraw the TCL logo, Olympic partner mark, bird artwork, red brand block, page number or ending-page artwork.

`Final Slide = Imported Corporate Master/Layout + Safe-area Content Layout + Editable Components`

## Units

The imported deck uses a 1280 × 720 design canvas corresponding to 13.333 × 7.5 inches. Layout tokens are normalized to this coordinate system and converted to native PowerPoint units by the `python-pptx` renderer. The OOXML source size remains 12192000 × 6858000 EMU.

## Build contract

```bash
node engine/bin/build-python.mjs \
  --deck tests/fixtures/render-test/deck-plan.json \
  --slides tests/fixtures/render-test/slide-specs.json \
  --template templates/tcl-product/master.pptx \
  --output output/AI-Picture
```

The application uses `engine/bin/build-python.mjs` with the MIT `python-pptx` provider and writes intermediate artifacts under the ignored project/cache directories. Preview output comes from the selected preview provider. The project output also contains the final PPTX, QA report, repair report and build manifest.
