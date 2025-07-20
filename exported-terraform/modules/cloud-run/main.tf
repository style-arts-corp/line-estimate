# Cloud Run service for the disposal estimate API
resource "google_cloud_run_v2_service" "disposal_estimate_api" {
  project  = var.project_id
  name     = var.service_name
  location = var.region

  template {
    scaling {
      min_instance_count = var.min_instances
      max_instance_count = var.max_instances
    }

    containers {
      # イメージが存在しない場合はデフォルトのイメージを使用
      image = var.initial_image != "" ? var.initial_image : "${var.artifact_registry_url}/${var.service_name}:latest"
      
      ports {
        container_port = 8080
      }

      env {
        name  = "GIN_MODE"
        value = var.gin_mode
      }

      env {
        name = "JWT_SECRET"
        value_source {
          secret_key_ref {
            secret  = var.jwt_secret_id
            version = "latest"
          }
        }
      }

      # Google Drive service account key from Secret Manager
      dynamic "env" {
        for_each = var.drive_service_key_secret_id != "" ? [1] : []
        content {
          name = "GOOGLE_SERVICE_ACCOUNT_KEY"
          value_source {
            secret_key_ref {
              secret  = "projects/${var.project_id}/secrets/${var.drive_service_key_secret_id}"
              version = "latest"
            }
          }
        }
      }

      # Google Drive folder ID from Secret Manager
      dynamic "env" {
        for_each = var.google_drive_folder_id_secret_id != "" ? [1] : []
        content {
          name = "GOOGLE_DRIVE_FOLDER_ID"
          value_source {
            secret_key_ref {
              secret  = var.google_drive_folder_id_secret_id
              version = "latest"
            }
          }
        }
      }

      # Save local PDF option
      env {
        name  = "SAVE_LOCAL_PDF"
        value = "false"
      }

      resources {
        limits = {
          cpu    = var.cpu_limit
          memory = var.memory_limit
        }
      }

      startup_probe {
        http_get {
          path = "/health"
          port = 8080
        }
        initial_delay_seconds = 30
        timeout_seconds       = 10
        period_seconds        = 15
        failure_threshold     = 5
      }

      liveness_probe {
        http_get {
          path = "/health"
          port = 8080
        }
        initial_delay_seconds = 60
        timeout_seconds       = 5
        period_seconds        = 30
        failure_threshold     = 3
      }
    }

    service_account = var.service_account_email != "" ? var.service_account_email : null
    
    timeout = "${var.request_timeout}s"
  }

  traffic {
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }

  labels = {
    app         = "disposal-estimate"
    environment = var.environment
  }
}

# IAM binding to allow public access
resource "google_cloud_run_service_iam_member" "public_access" {
  count = var.allow_public_access ? 1 : 0
  
  project  = var.project_id
  location = var.region
  service  = google_cloud_run_v2_service.disposal_estimate_api.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# IAM binding for authenticated access (if public access is disabled)
resource "google_cloud_run_service_iam_member" "authenticated_access" {
  count = var.allow_public_access ? 0 : 1
  
  project  = var.project_id
  location = var.region
  service  = google_cloud_run_v2_service.disposal_estimate_api.name
  role     = "roles/run.invoker"
  member   = "allAuthenticatedUsers"
}