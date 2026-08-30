# vite.config.ts の正本

リポジトリルートに 1 本置く vite-plus 設定の標準形。fmt / lint / staged の 3 点を必ず持つ。

```ts
import { spawn } from "node:child_process"
import { existsSync } from "node:fs"
import { defineConfig } from "vite-plus"

function runCommand(command: string, args: readonly string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: __dirname, stdio: "inherit" })

    child.once("error", reject)
    child.once("exit", (code, signal) => {
      if (code === 0) {
        resolve()
        return
      }

      const reason = signal === null ? `exit code ${code ?? "unknown"}` : `signal ${signal}`
      reject(new Error(`${command} failed with ${reason}`))
    })
  })
}

async function checkStagedFiles(stagedFileNames: readonly string[]): Promise<void> {
  // 生成物（/generated/ 配下と *.gen.ts）は整形しない。生成器の出力とバイト一致を検査する
  // チェックがあるリポジトリでは、hook が整形すると検査が恒久的に stale になる。
  const existingFileNames = stagedFileNames
    .filter(existsSync)
    .filter((fileName) => !fileName.includes("/generated/") && !fileName.endsWith(".gen.ts"))

  if (existingFileNames.length > 0) {
    await runCommand("vp", ["check", "--fix", ...existingFileNames])
  }

  if (stagedFileNames.some((fileName) => fileName.endsWith(".ts") || fileName.endsWith(".tsx"))) {
    await runCommand("bun", ["test", "--bail"])
  }
}

export default defineConfig({
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  staged: {
    "*": {
      title: "Check staged files and run Bun tests",
      task: checkStagedFiles,
    },
  },
  fmt: {
    semi: false,
  },
})
```

# 譲れない点と理由

- `fmt.semi: false`: セミコロンなしが標準。エディタや prettier の癖で復活させない
- `lint.options.typeAware / typeCheck: true`: vp check に型検査まで担わせ、tsc の別走を不要にする
- `staged` は必ず**オブジェクト形式タスク**にする。文字列タスク（`"*": "bun test"` のような形）にすると staged ファイル名がコマンド末尾に追加され、bun がテストパスの絞り込みとして解釈して「実装ファイルの変更でテスト 0 件のまま成功」する
- `staged` の設定は**モノレポのルート**に置く。サブディレクトリに置くと兄弟ワークスペースだけを変更したコミットが対象外になる
- 生成物の除外パターン（`/generated/`・`*.gen.ts`）はリポジトリの実態に合わせて増やしてよい。型検査が構造上通らないパス（tsconfig exclude 配下など）は `vp fmt --write` だけに落とす分岐を足す
