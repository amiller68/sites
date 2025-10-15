# Production Infrastructure - Simplified Digital Ocean Droplet

locals {
  environment  = "production"
}

module "common" {
  source = "../../modules/common"

  project_name = var.project_name
  environment  = local.environment
  subdomains   = var.subdomains
  digitalocean = {
    droplet = {
      region           = "nyc3"
      additional_ports = ["9000"]
    }
  }
  cloudflare   = {
    ttl           = 300
    proxied       = false
    dns_root_zone = var.dns_root_zone
  }
  volume = {
    size        = 20
    description = "Persistent storage for Jax node configuration and data"
  }
}