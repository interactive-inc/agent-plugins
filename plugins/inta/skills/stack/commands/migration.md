# migration — framework / package移行ガイドを作る

`inta:stack migration <package> <current> <target>`は、公式の移行情報と対象リポジトリの実使用箇所を突合し、project固有の移行計画を作る。既定は読み取り専用。実装まで依頼された場合は`inta:dev`の変更として進める。

## 手順

1. manifestとlockfileから現在version、runtime、plugin / adapter、直接・間接依存を確認する。入力されたversionと異なれば両方を示す
2. target version時点の公式release notes、migration guide、compatibility matrixを確認する。第三者記事だけでbreaking changeを確定しない
3. removed / deprecated API、型、config、runtime minimum、build / test behavior、data migrationを抽出する
4. symbol検索だけで終えず、wrapper、re-export、generated config、workspace間依存を追い、影響箇所をconfirmed / possible / not usedへ分ける
5. dependency順に移行段階、rollback boundary、検証command、manual verificationを組む
6. package追加・更新、lockfile変更、migration実行は明示された`apply`または実装依頼がある場合だけ行う

## 出力

- current / targetと参照した公式source
- projectに影響するbreaking changeとsource path
- 段階的な変更順、各段階の検証、rollback条件
- 影響しないと確認した項目と未確認範囲
- package / generated file / config / dataへの想定差分

固定の`bun add`やtest commandを例からコピーせず、対象リポジトリのpackage managerと標準quality gateを使う。
