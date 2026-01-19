# Production environment variables
variable "project_name" {
  description = "The name of the project"
  type        = string
}

variable "services" {
  description = "Services configuration from .env.project (format: service:subdomain:domain)"
  type        = string
}

variable "dns_config" {
  description = "JSON-encoded DNS configuration mapping zones to their subdomains"
  type        = string
  # Example: {"krondor.org":"jax,dev","alexplain.me":"@"}
}
