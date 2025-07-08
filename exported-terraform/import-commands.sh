#!/bin/bash

# 段階的にリソースをインポートするスクリプト

echo "=== GCPリソースの段階的インポート ==="

# 1. まずTerraformを初期化
echo "1. Terraformの初期化..."
terraform init

# 2. プロジェクトのインポート
echo "2. プロジェクトのインポート..."
terraform import module.project.google_project.disposal_estimate disposal-estimate

# 3. 状態を確認
echo "3. 現在の状態を確認..."
terraform plan

# 以下は個別に実行する必要があります（main.tfでコメントアウトを解除してから）

# 4. サービスアカウントのインポート（main.tfでmodule.service_accountsをアンコメント後）
# echo "4. サービスアカウントのインポート..."
# terraform import module.service_accounts.google_service_account.firebase_adminsdk_fbsvc projects/disposal-estimate/serviceAccounts/firebase-adminsdk-fbsvc@disposal-estimate.iam.gserviceaccount.com
# terraform import module.service_accounts.google_service_account.github_action_999236392 projects/disposal-estimate/serviceAccounts/github-action-999236392@disposal-estimate.iam.gserviceaccount.com

# 5. APIサービスのインポート（main.tfでmodule.apisをアンコメント後）
# echo "5. APIサービスのインポート..."
# # 必要なAPIを個別にインポート
# terraform import module.apis.google_project_service.bigquery_googleapis_com 458490939918/bigquery.googleapis.com
# terraform import module.apis.google_project_service.firestore_googleapis_com 458490939918/firestore.googleapis.com
# # 他のAPIも同様に...

echo "=== 完了 ==="
echo "次のステップ："
echo "1. terraform plan で差分を確認"
echo "2. 必要に応じてmain.tfのコメントを解除して追加のモジュールをインポート"