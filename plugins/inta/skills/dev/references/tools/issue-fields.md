# GitHub の属性操作

Issue Type や Priority / Effort の設定方法が必要なときだけ読む。通常の操作は導入済み `gh` の help を使う。対象リポジトリ・認証ユーザー・既存ラベルを確認し、ID や選択肢を固定しない。

```sh
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
OWNER=${REPO%%/*}
gh api user --jq .login
gh label list --repo "$REPO" --limit 100 --json name,description
```

## Issue Type

組織で有効な種類を取得し、`gh issue create --help` / `gh issue edit --help` で対応する指定方法を確認する。CLIが未対応なら公式APIを使う。

```sh
gh api "/orgs/$OWNER/issue-types" --jq '.[] | select(.is_enabled) | {id,name}'
gh api "/repos/$REPO/issues/$ISSUE_NUM" --jq '{number,type,labels,assignees}'
```

## Priority / Effort

組織の Issue フィールドを使い、現在のフィールド ID と選択肢を取得する。ID や選択肢名をハードコードしない。組織で別の尺度が定義されていればその定義を優先する。

```bash
gh api "/orgs/$OWNER/issue-fields" --jq '.[] | {id,name,data_type,options}'
gh api "/repos/$REPO/issues/$ISSUE_NUM/issue-field-values"
```

取得した Priority / Effort の ID と、実在する選択肢名で JSON ファイルを作り、`gh api --method POST --input` で送る。例の ID は取得した値に置き換える。

```json
{
  "issue_field_values": [
    { "field_id": 123, "value": "Medium" },
    { "field_id": 456, "value": "Low" }
  ]
}
```

```bash
gh api --method POST "/repos/$REPO/issues/$ISSUE_NUM/issue-field-values" --input /tmp/issue-field-values.json
gh api "/repos/$REPO/issues/$ISSUE_NUM/issue-field-values" \
  --jq '.[] | {issue_field_name,value,single_select_option}'
gh issue view "$ISSUE_NUM" --repo "$REPO" --json number,labels,assignees
```

POST は指定したフィールドだけを追加・更新する。PUT は他の既存フィールドも置換するため使わない。返却された選択肢名とラベルが見積もりどおりか確認してから設定完了とする。Priority / Effort は組織の Issue フィールドなので、Project の参照権限が無いことを理由に未設定にしない。

取得・更新が権限不足で失敗した、組織フィールドが無い、選択肢が対応しない場合は、その事実と未設定の項目を報告する。組織フィールドの新設や権限変更はこの手順の範囲に含めない。公式 API: [フィールド定義](https://docs.github.com/en/rest/orgs/issue-fields)、[Issue の値の更新](https://docs.github.com/en/rest/issues/issue-field-values)。
