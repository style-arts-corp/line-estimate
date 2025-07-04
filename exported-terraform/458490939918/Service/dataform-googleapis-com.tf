resource "google_project_service" "dataform_googleapis_com" {
  project = "458490939918"
  service = "dataform.googleapis.com"
}
# terraform import google_project_service.dataform_googleapis_com 458490939918/dataform.googleapis.com
