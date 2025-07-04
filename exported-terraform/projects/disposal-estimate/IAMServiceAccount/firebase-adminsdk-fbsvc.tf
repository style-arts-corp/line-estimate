resource "google_service_account" "firebase_adminsdk_fbsvc" {
  account_id   = "firebase-adminsdk-fbsvc"
  description  = "Firebase Admin SDK Service Agent"
  display_name = "firebase-adminsdk"
  project      = "disposal-estimate"
}
# terraform import google_service_account.firebase_adminsdk_fbsvc projects/disposal-estimate/serviceAccounts/firebase-adminsdk-fbsvc@disposal-estimate.iam.gserviceaccount.com
