resource "google_service_account" "github_action_999236392" {
  account_id   = "github-action-999236392"
  description  = "A service account with permission to deploy to Firebase Hosting and Cloud Functions for the GitHub repository style-arts-corp/line-estimate"
  display_name = "GitHub Actions (style-arts-corp/line-estimate)"
  project      = "disposal-estimate"
}
# terraform import google_service_account.github_action_999236392 projects/disposal-estimate/serviceAccounts/github-action-999236392@disposal-estimate.iam.gserviceaccount.com
