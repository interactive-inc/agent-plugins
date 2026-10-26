#!/usr/bin/env bash
# 性能改善の視点ごとに、当てはまりうる箇所を機械的に列挙する。
# 字句で拾うので誤検知を含む。各候補は references/checks.md の確定条件で読んで判定する。
#
# 使い方: find-candidates.sh [対象パス...]   （既定はカレントディレクトリ）
# 環境変数: PERF_CANDIDATE_LIMIT  視点ごとの表示件数の上限（既定 40）

set -u

if ! command -v rg >/dev/null 2>&1; then
  echo "ripgrep (rg) が必要です" >&2
  exit 2
fi

if [ "$#" -eq 0 ]; then
  set -- .
fi
LIMIT="${PERF_CANDIDATE_LIMIT:-40}"

# テスト・生成物・migration・依存は対象外にする（本番の経路だけを見る）
EXCLUDES=(
  -g '!**/node_modules/**' -g '!**/dist/**' -g '!**/build/**' -g '!**/.output/**'
  -g '!**/*.test.*' -g '!**/*.spec.*' -g '!**/*.stories.*' -g '!**/*.bench.*'
  -g '!**/test/**' -g '!**/tests/**' -g '!**/__tests__/**' -g '!**/fixtures/**'
  -g '!**/generated/**' -g '!**/*.gen.*' -g '!**/drizzle/**' -g '!**/migrations/**'
  -g '!**/seed/**' -g '!**/scripts/**' -g '!**/*.d.ts' -g '!**/*.md'
)
CODE=(-g '*.{ts,tsx,js,jsx,mjs,cjs,sql}')

# ripgrep は後に書いた glob が優先されるので、対象の拡張子を先に、除外を後に渡す。
# --vimgrep は複数行にまたがる一致でも先頭行だけを出すので、1 一致 = 1 行で数えられる。
section() {
  local title="$1" note="$2"
  shift 2
  local out count
  out=$(rg --vimgrep --color never "${CODE[@]}" "${EXCLUDES[@]}" "$@" 2>/dev/null |
    sed -E 's/^([^:]+:[0-9]+):[0-9]+:/\1: /' | awk '!seen[$0]++')
  if [ -z "$out" ]; then
    count=0
  else
    count=$(printf '%s\n' "$out" | wc -l | tr -d ' ')
  fi
  printf '\n## %s（%s 件）\n\n%s\n\n' "$title" "$count" "$note"
  if [ -n "$out" ]; then
    printf '%s\n' "$out" | head -n "$LIMIT" | cut -c1-240
    if [ "$count" -gt "$LIMIT" ]; then
      printf '... ほか %s 件（PERF_CANDIDATE_LIMIT で増やせる）\n' "$((count - LIMIT))"
    fi
  fi
}

printf '# 性能改善の候補（%s）\n' "$*"
printf '\n誤検知を含む。checks.md の確定条件で 1 件ずつ判定し、確定したものだけを直す。\n'

section "述語: LIKE の前方一致" \
  "固定の接頭辞の LIKE。SQLite では大文字小文字の区別が要らない値なら GLOB で索引を範囲検索に使える" \
  -P -i -e "\blike\(\s*[^,]+,\s*['\"\`][^'\"\`%_]+%['\"\`]\s*\)" -e "\bLIKE\s+'[^'%_]+%'" "$@"

section "述語: 列に式をかけた条件" \
  "WHERE や JOIN の列に関数をかけると索引が使えない。範囲条件に書き換えられるか" \
  -g '!**/schema/**/*.sql' -P -i -e "\b(substr|strftime|lower|upper|date)\(\s*\\$\{" \
  -e "\b(where|and|on)\b[^;\n]*\b(substr|strftime|lower|upper|date)\(" "$@"

section "派生表: JOIN の右側のサブクエリ" \
  "外側の WHERE が派生表の内側へ効いているか。内側で全件を組み立てていないか" \
  -U -P -i -e "\b(left|inner|cross)\s+join\s*\(\s*select\b" -e "\.as\(\s*['\"][A-Za-z_]+['\"]\s*\)" "$@"

section "相関: SELECT の中のサブクエリ・生 SQL の展開" \
  "行ごとに実行される相関サブクエリの中で CTE・窓関数・集計をやり直していないか" \
  -P -i -e "sql\.raw\(" -e "sql\`[^\`]*\(\s*select\s" "$@"

section "全件: 絞り込みの無い読み取り" \
  "WHERE も LIMIT も無い読み取り。アプリ側で絞っていないか、件数だけで足りないか" \
  -U -P -e "\.select(?:Distinct)?\((?:[^()]|\((?:[^()]|\([^()]*\))*\))*\)\s*\.from\(\s*[A-Za-z_][\w.]*\s*\)(?![\s\S]{0,200}?\.(where|limit|innerJoin|leftJoin|rightJoin|fullJoin|groupBy)\()" \
  -e "\.findMany\(\s*\)" "$@"

section "bind: 件数に比例する IN と複数行 INSERT" \
  "配列の長さに上限が無いと 1 文の bind 上限（D1 は 100）を超える。チャンクや json_each にしているか" \
  -U -P -e "\b(?:not)?[iI]nArray\(\s*[^,]+,\s*[A-Za-z_][\w.]*\s*\)" \
  -e "\.insert\([^)]*\)\s*\.values\(\s*[A-Za-z_][\w.]*\s*\)" -e "(?i)\bIN\s*\(\s*\\$\{" "$@"

section "段数: 連続した await の代入" \
  "await が直列に並ぶ。互いに依存しないなら batch か並列で 1 段にできる" \
  -U -P -e "(?:^[ \t]*(?:const|let)\s+[^=\n]+=\s*await\s(?!import\()[^\n]*\n){2,}" "$@"

section "段数: 式の中の await" \
  "プロパティや引数の中の await も直列の段になる（employees: await ...、new X(await ...)）。同じ関数に複数あれば並べられないか" \
  -P -e "[:,(]\s*await\s(?!import\()" "$@"

# await の多いファイル。1 リクエストの直列段数が多い候補として、段数カウンタで実測する
awaits=$(rg --count-matches --color never "${CODE[@]}" "${EXCLUDES[@]}" -P -e "\bawait\s(?!import\()" "$@" 2>/dev/null |
  awk -F: '$NF >= 8 { print $0 }' | sort -t: -k2 -nr)
if [ -z "$awaits" ]; then
  acount=0
else
  acount=$(printf '%s\n' "$awaits" | wc -l | tr -d ' ')
fi
printf '\n## 段数: await の多いファイル（%s ファイル）\n\n%s\n\n' "$acount" \
  "8 個以上の await を持つファイル（ファイル:await の数）。API の経路なら段数カウンタで直列の段数を実測する"
if [ -n "$awaits" ]; then
  printf '%s\n' "$awaits" | head -n "$LIMIT"
fi

section "行ごと: ループ内の await・行ごとの非同期（N+1）" \
  "行ごとに DB を呼んでいないか。まとめて 1 回読むか batch にできるか" \
  -U -P -e "for\s*(await\s*)?\((?:const|let)\s[^)]*\)\s*\{[^{}]{0,400}?\bawait\b" -e "\.map\(\s*async\b" "$@"

section "連鎖: 前の取得結果を待って始まる取得" \
  "前段の data を待ってから次の要求を始めている。後段が要る値を軽く独立させられるか" \
  -P -e "enabled:\s*(!!|Boolean\()?\s*[A-Za-z_][\w.]*(\?\.|\.)data\b" -e "enabled:\s*[A-Za-z_][\w.]*\s*!==?\s*(undefined|null)" "$@"

section "入口: 重いライブラリの静的 import" \
  "入口から辿れるなら、使うハンドラの中で読み込めないか（初回起動とメモリ）" \
  -P -e "^import\s(?!type\b)[^;]*from\s+['\"](xlsx|xlsx-js-style|exceljs|pdf-lib|pdfkit|@react-pdf/renderer|jspdf|sharp|jszip|docx|pptxgenjs|mermaid|katex|shiki|highlight\.js|monaco-editor|chart\.js|echarts|@aws-sdk/[\w-]+)['\"/]" "$@"

# 1 つのコンポーネントで複数の取得を同じ境界で待つファイル（ファイル単位で数える）
boundary=$(rg --count --color never -g '*.{tsx,jsx}' "${EXCLUDES[@]}" -P -e "\buse\(\s*[A-Za-z_][\w.]*(?:\.promise|[pP]romise)\s*\)" -e "\buseSuspenseQuer(?:y|ies)\(" "$@" 2>/dev/null | awk -F: '$NF >= 2 { print $0 }' | sort -t: -k2 -nr)
if [ -z "$boundary" ]; then
  bcount=0
else
  bcount=$(printf '%s\n' "$boundary" | wc -l | tr -d ' ')
fi
printf '\n## 境界: 1 ファイルで 2 つ以上の取得を待つ（%s ファイル）\n\n%s\n\n' "$bcount" \
  "独立したデータを同じ待ちの境界で待っていないか。先に描ける区画を分けられるか（ファイル:取得の数）"
if [ -n "$boundary" ]; then
  printf '%s\n' "$boundary" | head -n "$LIMIT"
fi
