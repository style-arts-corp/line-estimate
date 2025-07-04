resource "google_project" "disposal_estimate" {
  auto_create_network = true
  billing_account     = "01E194-E561F0-D8CB93"

  labels = {
    firebase      = "enabled"
    firebase-core = "disabled"
  }

  name       = "disposal-estimate"
  org_id     = "516907859942"
  project_id = "disposal-estimate"
}
# terraform import google_project.disposal_estimate projects/disposal-estimate
