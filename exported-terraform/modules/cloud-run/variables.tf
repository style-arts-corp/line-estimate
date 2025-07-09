variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "region" {
  description = "The GCP region"
  type        = string
}

variable "service_name" {
  description = "The name of the Cloud Run service"
  type        = string
  default     = "disposal-estimate-api"
}

variable "artifact_registry_url" {
  description = "The URL of the Artifact Registry repository"
  type        = string
}

variable "jwt_secret_id" {
  description = "The ID of the JWT secret in Secret Manager"
  type        = string
}

variable "environment" {
  description = "The environment (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "gin_mode" {
  description = "The Gin framework mode (debug, release)"
  type        = string
  default     = "release"
}

variable "min_instances" {
  description = "Minimum number of instances"
  type        = number
  default     = 0
}

variable "max_instances" {
  description = "Maximum number of instances"
  type        = number
  default     = 10
}

variable "cpu_limit" {
  description = "CPU limit"
  type        = string
  default     = "1000m"
}

variable "memory_limit" {
  description = "Memory limit"
  type        = string
  default     = "512Mi"
}

variable "request_timeout" {
  description = "Request timeout in seconds"
  type        = number
  default     = 300
}

variable "allow_public_access" {
  description = "Whether to allow public access to the service"
  type        = bool
  default     = true
}

variable "service_account_email" {
  description = "Service account email for the Cloud Run service"
  type        = string
  default     = ""
}

variable "initial_image" {
  description = "Initial image to use for Cloud Run service (for bootstrapping)"
  type        = string
  default     = ""
}