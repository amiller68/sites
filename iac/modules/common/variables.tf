locals {
  # Common tags for all resources
  common_tags = [
    "project:${var.project_name}",
    "env:${var.environment}",
    "managed-by:terraform"
  ]
}

variable "project_name" {
  description = "The name of the project"
  type        = string
}

variable "environment" {
  description = "Environment name (staging, production, etc.)"
  type        = string
  validation {
    # supported environments
    # TODO: support more environments
    condition     = contains(["production"], var.environment)
    error_message = "Environment must be one of: production"
  }
}

# DigitalOcean configuration
variable "digitalocean" {
  description = "Configuration for DigitalOcean infrastructure"
  type = object({
    droplet = object({
      region           = string
      additional_ports = optional(list(string), [])
    })
  })
}

# Volume configuration
variable "volume" {
  description = "Configuration for DigitalOcean volume"
  type = object({
    size        = optional(number, 10)
    description = optional(string, "")
  })
}