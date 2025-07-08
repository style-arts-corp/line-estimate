resource "google_project_service" "cloudtrace_googleapis_com" {
  project = "disposal-estimate"
  service = "cloudtrace.googleapis.com"
}
# terraform import google_project_service.cloudtrace_googleapis_com disposal-estimate/cloudtrace.googleapis.com
