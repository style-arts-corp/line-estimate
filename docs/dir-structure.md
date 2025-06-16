# Golangクリーンアーキテクチャ ディレクトリ構成

## クリーンアーキテクチャとは

クリーンアーキテクチャは、Robert C. Martin（Uncle Bob）によって提唱されたソフトウェアアーキテクチャです。このアーキテクチャの主な目的は、以下の通りです：

### 主要な原則

1. **依存関係の逆転（Dependency Inversion）**
   - 内側の層は外側の層に依存しない
   - 抽象に依存し、具象に依存しない

2. **関心の分離（Separation of Concerns）**
   - 各層は明確に定義された責任を持つ
   - ビジネスロジックとインフラストラクチャの分離

3. **テスタビリティの向上**
   - 各層を独立してテスト可能
   - モックやスタブを使いやすい構造

4. **フレームワーク非依存**
   - 特定のフレームワークに縛られない
   - 変更や交換が容易

## 提案するディレクトリ構成

```
backend/
├── cmd/
│   └── server/
│       └── main.go                 # アプリケーションエントリーポイント
├── internal/
│   ├── domain/                     # ドメイン層（最内側）
│   │   ├── entity/                 # エンティティ
│   │   │   ├── user.go
│   │   │   └── estimate.go
│   │   ├── repository/             # リポジトリインターフェース
│   │   │   ├── user_repository.go
│   │   │   └── estimate_repository.go
│   │   └── service/                # ドメインサービス
│   │       ├── user_service.go
│   │       └── estimate_service.go
│   ├── usecase/                    # ユースケース層（アプリケーション層）
│   │   ├── user_usecase.go
│   │   ├── estimate_usecase.go
│   │   └── interfaces/             # ユースケースインターフェース
│   │       ├── user_usecase_interface.go
│   │       └── estimate_usecase_interface.go
│   ├── interface/                  # インターフェース層
│   │   ├── handler/                # HTTPハンドラー
│   │   │   ├── user_handler.go
│   │   │   ├── estimate_handler.go
│   │   │   └── health_handler.go
│   │   ├── middleware/             # ミドルウェア
│   │   │   ├── auth.go
│   │   │   ├── cors.go
│   │   │   └── logger.go
│   │   └── dto/                    # データ転送オブジェクト
│   │       ├── user_dto.go
│   │       └── estimate_dto.go
│   └── infrastructure/             # インフラストラクチャ層（最外側）
│       ├── database/               # データベース実装
│       │   ├── user_repository_impl.go
│       │   ├── estimate_repository_impl.go
│       │   └── connection.go
│       ├── external/               # 外部API
│       │   └── email_service.go
│       └── config/                 # 設定関連
│           └── config.go
├── pkg/                           # 公開可能なパッケージ
│   ├── logger/
│   │   └── logger.go
│   ├── validator/
│   │   └── validator.go
│   └── utils/
│       └── response.go
├── test/                          # テスト関連
│   ├── integration/               # 統合テスト
│   ├── unit/                      # ユニットテスト
│   └── fixture/                   # テストデータ
├── config/                        # 設定ファイル
│   ├── local.yaml
│   └── production.yaml
├── docker/                        # Docker関連
│   ├── Dockerfile
│   └── docker-compose.yml
├── go.mod
├── go.sum
└── README.md
```

## 各層の詳細説明

### 1. Domain層（ドメイン層）
**役割**: ビジネスロジックの核心部分
**依存関係**: 他の層に依存しない

- **Entity**: ビジネスの核となるオブジェクト
- **Repository Interface**: データアクセスの抽象化
- **Domain Service**: エンティティでは表現できない複雑なビジネスルール

### 2. Usecase層（ユースケース層）
**役割**: アプリケーション固有のビジネスルール
**依存関係**: Domain層にのみ依存

- **Usecase**: アプリケーションの機能を実装
- **Interfaces**: ユースケースの抽象化

### 3. Interface層（インターフェース層）
**役割**: 外部とのやり取りを管理
**依存関係**: UseCase層とDomain層に依存

- **Handler**: HTTPリクエストの処理
- **Middleware**: 横断的関心事の処理
- **DTO**: データの入出力形式定義

### 4. Infrastructure層（インフラストラクチャ層）
**役割**: 外部システムとの統合
**依存関係**: 全ての層に依存可能

- **Database**: データベースアクセスの具体実装
- **External**: 外部APIとの連携
- **Config**: アプリケーション設定

## なぜこのディレクトリ構成にしたのか

### 1. 依存関係の明確化
- 内側の層は外側の層を知らない
- Domain層は純粋なビジネスロジックのみ
- Infrastructure層が具体的な実装を担当

### 2. テストのしやすさ
- 各層を独立してテスト可能
- モックを使った単体テストが容易
- ビジネスロジックをデータベースなしでテスト可能

### 3. 変更に強い設計
- 外部システムの変更が内部に影響しない
- データベースの種類を変更してもビジネスロジックは影響を受けない
- フロントエンドの変更がバックエンドに影響しない

### 4. Go言語の慣習に従った構成
- `internal/`ディレクトリでパッケージの可視性を制御
- `cmd/`ディレクトリでアプリケーションエントリーポイントを明確化
- `pkg/`ディレクトリで再利用可能なパッケージを分離

### 5. チーム開発における利点
- 責任の範囲が明確
- 並行開発がしやすい
- コードレビューの焦点が絞りやすい

## 移行計画

現在のディレクトリ構成から段階的に移行することを推奨します：

### Phase 1: 基本構造の作成
- `internal/`配下の基本ディレクトリを作成
- エンティティの分離

### Phase 2: インターフェースの定義
- リポジトリインターフェースの作成
- ユースケースインターフェースの作成

### Phase 3: 実装の移行
- 既存コードを各層に適切に配置
- 依存関係の整理

### Phase 4: テストの充実
- 各層のユニットテスト作成
- 統合テストの実装

この構成により、保守性、テスタビリティ、拡張性に優れたGoアプリケーションを構築できます。