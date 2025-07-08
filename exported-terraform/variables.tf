variable "project_id" {
  description = "GCP Project ID"
  type        = string
  default     = "disposal-estimate"
}

variable "region" {
  description = "Default region for resources"
  type        = string
  default     = "asia-northeast1"
}

variable "organization_id" {
  description = "GCP Organization ID"
  type        = string
  default     = "516907859942"
}

variable "billing_account" {
  description = "GCP Billing Account ID"
  type        = string
  default     = "01E194-E561F0-D8CB93"
}