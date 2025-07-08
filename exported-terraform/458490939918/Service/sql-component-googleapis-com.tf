resource "google_project_service" "sql_component_googleapis_com" {
  project = "disposal-estimate"
  service = "sql-component.googleapis.com"
}
# terraform import google_project_service.sql_component_googleapis_com disposal-estimate/sql-component.googleapis.com
