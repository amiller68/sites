output "id" {
  description = "The ID of the volume"
  value       = digitalocean_volume.main.id
}

output "urn" {
  description = "The URN of the volume"
  value       = digitalocean_volume.main.urn
}

output "filesystem_label" {
  description = "The filesystem label of the volume"
  value       = digitalocean_volume.main.filesystem_label
}

output "droplet_ids" {
  description = "A list of droplet IDs the volume is attached to"
  value       = digitalocean_volume.main.droplet_ids
}
