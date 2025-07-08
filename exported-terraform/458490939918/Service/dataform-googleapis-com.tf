resource "google_project_service" "dataform_googleapis_com" {
  project = "disposal-estimate"
  service = "dataform.googleapis.com"
}
# terraform import google_project_service.dataform_googleapis_com disposal-estimate/dataform.googleapis.com
