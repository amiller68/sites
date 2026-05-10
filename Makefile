.PHONY: help
help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_-]+:.*?##/ { printf "  %-20s %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

.PHONY: install
install: ## Install dependencies
	@pnpm install

.PHONY: dev
dev: ## Run development servers
	@pnpm dev

.PHONY: build
build: ## Build all apps
	@pnpm build

.PHONY: build-dev
build-dev: ## Build with dev secrets via confit
	@pnpm build:dev

.PHONY: test
test: ## Run tests
	@pnpm test

.PHONY: fmt
fmt: ## Format code
	@pnpm fmt

.PHONY: fmt-check
fmt-check: ## Check formatting
	@pnpm fmt:check

.PHONY: types
types: ## Type check
	@pnpm types

.PHONY: check
check: fmt-check types ## Run all checks

.PHONY: clean
clean: ## Clean build artifacts and node_modules
	@pnpm clean
	@rm -rf node_modules apps/*/node_modules packages/*/node_modules .turbo
