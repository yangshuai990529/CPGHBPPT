#!/usr/bin/env sh
set -eu
TECH=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ROOT=$(CDPATH= cd -- "$TECH/.." && pwd)

command -v node >/dev/null || { echo '需要 Node.js 22+' >&2; exit 1; }
node -e 'const [a,b]=process.versions.node.split(".").map(Number);if(a<22||(a===22&&b<13))process.exit(1)' || { echo '需要 Node.js 22.13+' >&2; exit 1; }
command -v python3 >/dev/null || { echo '需要 Python 3.11+' >&2; exit 1; }
python3 -c 'import sys; raise SystemExit(0 if sys.version_info >= (3, 11) else 1)' || { echo '需要 Python 3.11+' >&2; exit 1; }

mkdir -p "$ROOT/input" "$ROOT/projects" "$ROOT/output" "$ROOT/cache" "$ROOT/feedback/reviews" \
  "$ROOT/workspace/旧PPT库" "$ROOT/workspace/input" "$ROOT/workspace/projects" \
  "$ROOT/workspace/personal-knowledge" "$ROOT/workspace/personal-patterns" "$ROOT/workspace/config"

link_runtime_dir() {
  name=$1
  target="../$name"
  link="$TECH/$name"
  if [ -L "$link" ]; then
    [ "$(readlink "$link")" = "$target" ] || { echo "运行时链接错误：$link" >&2; exit 1; }
  elif [ -e "$link" ]; then
    echo "技术目录中存在不应提交的运行时路径：$link" >&2
    exit 1
  else
    ln -s "$target" "$link"
  fi
}

for name in input projects output cache feedback workspace examples PPT设计规范; do
  link_runtime_dir "$name"
done

[ -f "$TECH/templates/tcl-product/master.pptx" ] || {
  [ -f "$ROOT/PPT设计规范/产品PPT模板.pptx" ] || { echo '缺少 PPT设计规范/产品PPT模板.pptx' >&2; exit 1; }
  cp "$ROOT/PPT设计规范/产品PPT模板.pptx" "$TECH/templates/tcl-product/master.pptx"
}

[ -d "$TECH/node_modules" ] || (cd "$TECH" && PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm ci)
[ -x "$TECH/.venv/bin/python3" ] || python3 -m venv "$TECH/.venv"
"$TECH/.venv/bin/python3" -m pip install -r "$TECH/requirements.txt"

"$ROOT/CPGHBPPT" doctor
echo '安装检查完成。下一步运行 ./CPGHBPPT init。'
