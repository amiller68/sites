# Geney - Static public site
# Minimal Makefile for docker builds

.PHONY: help
help:
	@echo "Geney - Static public site"
	@echo ""
	@echo "Targets:"
	@echo "  dev          - Serve locally with Python HTTP server"
	@echo "  docker-build - Build Docker image"
	@echo "  clean        - Remove Docker image"

.PHONY: dev
dev: ## Serve locally for development
	@echo "Serving at http://localhost:8080"
	@python3 -m http.server 8080

.PHONY: docker-build
docker-build: ## Build Docker image
	docker build -t geney .

.PHONY: clean
clean: ## Remove Docker image
	docker rmi geney 2>/dev/null || true

# No-op targets for compatibility with root Makefile
.PHONY: install check build test lint fmt fmt-check types styles styles-watch
install check build test lint fmt fmt-check types styles styles-watch:
	@echo "No-op for static site"
