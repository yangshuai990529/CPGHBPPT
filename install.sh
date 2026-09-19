#!/usr/bin/env sh
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)

if [ "$(uname -s)" != "Darwin" ]; then
  echo '当前自动安装脚本只在 macOS 验证。请手动安装 Node.js 22.13+、Python 3.11+ 和 Poppler 后运行 ./setup.sh。' >&2
  exit 1
fi

need_brew=0
command -v node >/dev/null 2>&1 || need_brew=1
if command -v node >/dev/null 2>&1; then
  node -e 'const [a,b]=process.versions.node.split(".").map(Number);process.exit(a>22||(a===22&&b>=13)?0:1)' || need_brew=1
fi
command -v python3 >/dev/null 2>&1 || need_brew=1
if command -v python3 >/dev/null 2>&1; then
  python3 -c 'import sys; raise SystemExit(0 if sys.version_info >= (3, 11) else 1)' || need_brew=1
fi
command -v pdftoppm >/dev/null 2>&1 || need_brew=1

if [ "$need_brew" -eq 1 ]; then
  command -v brew >/dev/null 2>&1 || {
    echo '缺少系统依赖且未找到 Homebrew。请先安装 Homebrew：https://brew.sh/，然后重新运行 ./install.sh。' >&2
    exit 1
  }
  if ! command -v node >/dev/null 2>&1 || ! node -e 'const [a,b]=process.versions.node.split(".").map(Number);process.exit(a>22||(a===22&&b>=13)?0:1)' >/dev/null 2>&1; then
    brew list node@22 >/dev/null 2>&1 || brew install node@22
    export PATH="$(brew --prefix node@22)/bin:$PATH"
  fi
  if ! command -v python3 >/dev/null 2>&1 || ! python3 -c 'import sys; raise SystemExit(0 if sys.version_info >= (3, 11) else 1)' >/dev/null 2>&1; then
    brew list python@3.12 >/dev/null 2>&1 || brew install python@3.12
    export PATH="$(brew --prefix python@3.12)/bin:$PATH"
  fi
  command -v pdftoppm >/dev/null 2>&1 || brew install poppler
fi

cd "$ROOT"
./setup.sh
./CPGHBPPT init

SYSTEM_CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
if [ ! -x "$SYSTEM_CHROME" ] && ! node -e "import('playwright').then(({chromium})=>require('fs').accessSync(chromium.executablePath()))" >/dev/null 2>&1; then
  echo '未找到系统 Chrome，正在安装 Playwright Chromium…'
  npx playwright install chromium
fi

./CPGHBPPT doctor
echo ''
echo 'CPGHBPPT 安装完成。示例：'
echo '  ./CPGHBPPT build examples/02-competitor-analysis/project.yaml'
