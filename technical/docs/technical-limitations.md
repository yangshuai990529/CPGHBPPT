# Technical Limitations

## Renderer choice

The default provider is `python-pptx` 1.0.2 (MIT). It opens the authorized local corporate master, retains its master/layout/media package, and writes native editable text boxes, pictures and charts from approved Slide Specs. The current 10-page regression opened in WPS Office and exposed a selected title as an editable text object.

Artifact Tool is not included in the public repository because its proprietary license does not authorize public distribution. PptxGenJS remains an unintegrated future adapter for code-defined masters.

## Verified capability matrix

| Capability | python-pptx | Artifact Tool | Current decision |
| --- | --- | --- | --- |
| Slide Master | Opens and retains supplied master/layout package | Imports and reuses existing master/layout | python-pptx |
| Editable shapes/text | Verified in WPS | Supported | python-pptx |
| Charts/tables | Native chart verified; table path not yet covered | Supported | python-pptx with per-layout tests |
| SVG | Not used by current provider | Supported | Raster official assets only |
| Image contain | Verified, hash/entity/resolution gated | Supported | python-pptx |
| Custom fonts | References installed fonts; does not embed them | Same | Font preflight required |
| Speaker notes | Supported | Supported | python-pptx |
| Existing corporate PPTX import | Verified on supplied template | Verified | python-pptx |

## Known limitations

- The source template contains fonts not all available in every environment. Authored content currently uses `Arial Unicode MS` with East Asian declarations. LibreOffice headless conversion on this Mac substitutes some Chinese glyphs incorrectly even though WPS and macOS QuickLook render correctly. Primary preview uses QuickLook+Chrome; Microsoft PowerPoint verification remains required.
- The template has two layouts without example slides. The renderer uses only verified cover, content and ending slides in the mock deck.
- LibreOffice rendering is a preview provider, not proof of identical PowerPoint rendering.
- Native charts are editable, but cross-application chart behavior may vary.
- Rule-based QA estimates text fit from geometry and character counts. It detects risk, not typographic truth.
- Vision Critic is an optional interface only and is not a hard dependency.
- Automatic slide splitting returns a repair recommendation. The current build does not silently change the requested slide count.
- Mock data in `tests/fixtures/render-test/` is intentionally fictional and must never be reused as product evidence.
