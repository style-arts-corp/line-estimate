# GitHub ActionsサービスアカウントにCloud Run管理権限を付与
resource "google_project_iam_member" "github_actions_run_admin" {
  project = var.project_id
  role    = "roles/run.admin"
  member  = "serviceAccount:github-action-999236392@${var.project_id}.iam.gserviceaccount.com"
}

# GitHub ActionsサービスアカウントにService Account User権限を付与
# これにより、他のサービスアカウントとして実行する権限を持つ
resource "google_project_iam_member" "github_actions_service_account_user" {
  project = var.project_id
  role    = "roles/iam.serviceAccountUser"
  member  = "serviceAccount:github-action-999236392@${var.project_id}.iam.gserviceaccount.com"
}