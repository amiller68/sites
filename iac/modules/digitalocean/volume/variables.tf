variable "name" {
  description = "The name of the volume"
  type        = string
}

variable "region" {
  description = "The region where the volume will be created"
  type        = string
}

variable "size" {
  description = "The size of the volume in GB"
  type        = number
  default     = 10
}

variable "description" {
  description = "A description of the volume"
  type        = string
  default     = ""
}

variable "filesystem_type" {
  description = "The initial filesystem type for the volume"
  type        = string
  default     = "ext4"
}

variable "droplet_id" {
  description = "The ID of the droplet to attach the volume to"
  type        = string
}

variable "tags" {
  description = "A list of tags to apply to the volume"
  type        = list(string)
  default     = []
}
