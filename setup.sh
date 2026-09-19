#!/usr/bin/env sh
set -eu
ROOT=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
command -v node >/dev/null || { echo '需要 Node.js 22+' >&2; exit 1; }
node -e 'const [a,b]=process.versions.node.split(".").map(Number);if(a<22||(a===22&&b<13))process.exit(1)' || { echo '需要 Node.js 22.13+' >&2; exit 1; }
command -v python3 >/dev/null || { echo '需要 Python 3.11+' >&2; exit 1; }
python3 -c 'import sys; raise SystemExit(0 if sys.version_info >= (3, 11) else 1)' || { echo '需要 Python 3.11+' >&2; exit 1; }
mkdir -p "$ROOT/input" "$ROOT/projects" "$ROOT/output" "$ROOT/workspace/旧PPT库" "$ROOT/workspace/input" "$ROOT/workspace/projects" "$ROOT/workspace/personal-knowledge" "$ROOT/workspace/personal-patterns" "$ROOT/workspace/config"
[ -f "$ROOT/templates/tcl-product/master.pptx" ] || {
  [ -f "$ROOT/PPT设计规范/产品PPT模板.pptx" ] || { echo '缺少 PPT设计规范/产品PPT模板.pptx' >&2; exit 1; }
  cp "$ROOT/PPT设计规范/产品PPT模板.pptx" "$ROOT/templates/tcl-product/master.pptx"
}
[ -d "$ROOT/node_modules" ] || (cd "$ROOT" && PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm ci)
[ -x "$ROOT/.venv/bin/python3" ] || python3 -m venv "$ROOT/.venv"
"$ROOT/.venv/bin/python3" -m pip install -r "$ROOT/requirements.txt"
"$ROOT/ppt" doctor
echo '安装检查完成。请运行 ./CPGHBPPT init，然后在 Agent 中使用 /CPGHBPPT。'
