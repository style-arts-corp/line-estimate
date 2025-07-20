# Google Sheets API の有効化
resource "google_project_service" "sheets_api" {
  project = var.project_id
  service = "sheets.googleapis.com"
  
  disable_dependent_services = false
  disable_on_destroy        = false
}