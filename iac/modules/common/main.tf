# DigitalOcean Infrastructure Module

# random prefix for the project
resource "random_string" "project_prefix" {
  length  = 4
  special = false
  upper   = false
}

# Project
module "digitalocean_project" {
  source = "../digitalocean/project"

  name        = "${var.project_name}-${var.environment}-${random_string.project_prefix.result}-project"
  description = "Project for ${var.project_name} ${var.environment}"
  environment = var.environment
  resources   = [module.digitalocean_droplet.urn, module.digitalocean_volume.urn]
}


# SSH key which will get access to the droplet
module "digitalocean_ssh_key" {
  source = "../digitalocean/ssh_key"

  name = "${var.project_name}-${var.environment}-${random_string.project_prefix.result}-ssh-key"
}

# Droplet
module "digitalocean_droplet" {
  source = "../digitalocean/droplet"

  name = "${var.project_name}-${var.environment}-${random_string.project_prefix.result}-droplet"

  region = var.digitalocean.droplet.region
  tags   = ["${var.project_name}-${var.environment}"]

  # SSH configuration
  ssh_keys = [module.digitalocean_ssh_key.id]

  # Additional ports for services (e.g., P2P ports)
  additional_ports = var.digitalocean.droplet.additional_ports
}

# Volume
module "digitalocean_volume" {
  source = "../digitalocean/volume"

  name        = "${var.project_name}-${var.environment}-${random_string.project_prefix.result}-volume"
  region      = var.digitalocean.droplet.region
  size        = var.volume.size
  description = var.volume.description != "" ? var.volume.description : "Volume for ${var.project_name} ${var.environment}"
  droplet_id  = module.digitalocean_droplet.id
  tags        = ["${var.project_name}-${var.environment}"]
}