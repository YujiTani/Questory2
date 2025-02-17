# Hono-Boilerplate
このボイラープレートは、TypeScript、Hono、Prismaを使用して構築されています。

## 機能

- 高速なRPC通信機能
- OpenAPIによるAPI仕様の自動生成
- Prismaによる直感的なDB管理

## セットアップ

### 必要条件

- Node.js (v23.8.0)
- Docker

### インストール

1. リポジトリをクローンします。

   ```bash
   git clone https://github.com/yourusername/Hono-Boilerplate.git
   cd Hono-Boilerplate
   ```

2. 必要なパッケージをインストールします。

   ```bash
   bun install
   ```

3. データベースをセットアップします。

   ```bash
   bun prisma:migrate
   ```

4. サーバーを起動します。

```bash
bun dev
```

## 使用方法

- APIドキュメントは`/doc`エンドポイントで確認できます。
- Swagger UIは`/ui`エンドポイントで利用可能です。

## 開発

### テスト

テストは以下のコマンドで実行できます。

```bash
bun test
```


### コードスタイル

- ESLintとPrettierを使用してコードスタイルを統一しています。
- コミット前に自動でコードの整形とチェックが行われます。

### デプロイ

Dockerを使用してアプリケーションをコンテナ化し、デプロイできます
