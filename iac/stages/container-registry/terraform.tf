terraform {
  cloud {
    organization = "krondor-sites-org"

    workspaces {
      name = "krondor-sites-container-registry"
    }
  }
}
