variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "jwt_secret_value" {
  description = "The JWT secret value (leave empty for placeholder)"
  type        = string
  default     = ""
  sensitive   = true
}