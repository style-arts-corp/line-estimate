output "jwt_secret_id" {
  description = "The ID of the JWT secret"
  value       = google_secret_manager_secret.jwt_secret.secret_id
}

output "jwt_secret_name" {
  description = "The full name of the JWT secret"
  value       = google_secret_manager_secret.jwt_secret.name
}