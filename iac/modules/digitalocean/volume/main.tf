resource "digitalocean_volume" "main" {
  region                  = var.region
  name                    = var.name
  size                    = var.size
  description             = var.description
  initial_filesystem_type = var.filesystem_type

  tags = var.tags
}

resource "digitalocean_volume_attachment" "main" {
  droplet_id = var.droplet_id
  volume_id  = digitalocean_volume.main.id
}
