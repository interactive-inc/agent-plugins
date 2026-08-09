# runtime — local runtime health

起動済みlocalhost環境を実際に操作し、静的検査では見えない破損を読み取り専用で確認する。

1. 対象URL、role、主要journey、実在route、利用可能な実dataを確認する
2. hardcoded IDを使わず、navigationまたはlist APIから実在対象を解決する
3. console error、未捕捉例外、4xx / 5xx、白画面、到達不能、権限不整合、視覚崩れを確認する
4. empty / populated、viewport、scroll、portal、一時UI、異なる実dataで反証する
5. 既知issue、data不整合、route不在、環境failureと製品bugを分ける

dev serverを起動・再起動・停止せず、Issueを作らない。利用可能なURLがなければ未検査として理由を報告する。
