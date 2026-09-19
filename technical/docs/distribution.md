# Distribution and operational limits (v0.5.0)

The public distribution target is `https://github.com/yangshuai990529/CPGHBPPT`. After cloning on macOS, run `./install.sh`; it installs missing system dependencies through an existing Homebrew installation, installs locked Node/Python dependencies, copies the published design template to the ignored runtime path, initializes the workspace, and runs the doctor checks. Node dependencies are locked in `technical/package-lock.json`; Python dependencies are pinned in `technical/requirements.txt`.

The repository owner explicitly approved publishing `PPT设计规范/产品PPT模板.pptx`. Do not publish historic libraries, user inputs, generated projects, cache, credentials or local knowledge. Template and third-party asset rights remain separate from the MIT source-code license; see `NOTICE.md`.

Project config precedence: `technical/config/organization.yaml` < optional local user config < project YAML. Custom Skills are discovered under `technical/skills/custom/` without executing arbitrary code. Template packages require compatible design tokens/layout registry and a real local master; adding a registry entry alone does not validate a new template.

`manifest.json` records stage signatures, skill versions and output paths; re-running an unchanged build reuses stages. Research invalidates daily at the application signature layer, then individual page cache has a separate TTL. Editing advanced Slide Spec JSON changes the render signature; editing a `storyline.md` summary alone does **not** regenerate Slide Specs. Only stored JSON + input hashes provide reproducibility; external web pages can change.

Checkpoints for `research_plan`, `storyline`, `final_preview` may be set in project YAML. `./CPGHBPPT approve` only records an explicit local acknowledgement. Automatic repair currently proposes fixes but does not loop through arbitrary repair attempts. Local logs and project manifests are not uploaded. Future external AI provider calls require separate privacy/provider policy.

Test commands: `cd technical && npm test && npm run validate`; user-facing diagnostics remain `./CPGHBPPT doctor` from the repository root. The public Renderer is `python-pptx`; proprietary Artifact Tool code and dependencies are not included. Golden snapshots are environment-sensitive and must be reviewed when fonts/template change.
