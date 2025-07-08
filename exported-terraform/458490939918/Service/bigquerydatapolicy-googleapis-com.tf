resource "google_project_service" "bigquerydatapolicy_googleapis_com" {
  project = "disposal-estimate"
  service = "bigquerydatapolicy.googleapis.com"
}
# terraform import google_project_service.bigquerydatapolicy_googleapis_com disposal-estimate/bigquerydatapolicy.googleapis.com
