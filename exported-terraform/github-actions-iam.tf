# GitHub ActionsサービスアカウントのIAM権限設定
# このファイルは、GitHub ActionsがCloud Runへのデプロイを実行するために必要な権限を定義します

# Cloud Run Admin権限
# Cloud Runサービスの作成、更新、削除を行うために必要
resource "google_project_iam_member" "github_actions_run_admin" {
  project = var.project_id
  role    = "roles/run.admin"
  member  = "serviceAccount:github-action-999236392@${var.project_id}.iam.gserviceaccount.com"
}

# Service Account User権限
# 他のサービスアカウントとして実行する権限（actAs）を付与
resource "google_project_iam_member" "github_actions_service_account_user" {
  project = var.project_id
  role    = "roles/iam.serviceAccountUser"
  member  = "serviceAccount:github-action-999236392@${var.project_id}.iam.gserviceaccount.com"
}

# Cloud Run Developer権限（オプション）
# より制限された権限セットで、サービスの更新のみを許可
# resource "google_project_iam_member" "github_actions_run_developer" {
#   project = var.project_id
#   role    = "roles/run.developer"
#   member  = "serviceAccount:github-action-999236392@${var.project_id}.iam.gserviceaccount.com"
# }