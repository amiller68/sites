# Production Infrastructure - Simplified Digital Ocean Droplet

locals {
  environment = "production"
  # Parse DNS configuration from JSON
  # Format: {"krondor.org":"jax,dev","alexplain.me":"@"}
  dns_config = jsondecode(var.dns_config)
}

module "common" {
  source = "../../modules/common"

  project_name = var.project_name
  environment  = local.environment
  digitalocean = {
    droplet = {
      region           = "nyc3"
      additional_ports = ["9000"]
    }
  }
  volume = {
    size        = 20
    description = "Persistent storage for Jax node configuration and data"
  }
}

# DNS records for each zone
module "cloudflare_dns" {
  for_each = local.dns_config
  source   = "../../modules/cloudflare/dns"

  environment        = local.environment
  dns_root_zone      = each.key
  droplet_ip         = module.common.digitalocean_droplet_ip
  domain_slugs       = [for s in split(",", each.value) : s if s != "@"]
  create_root_record = contains(split(",", each.value), "@")
  ttl                = 300
  proxied            = false
}
