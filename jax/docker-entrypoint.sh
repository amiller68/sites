#!/bin/bash
set -e

JAX_DIR="${CONFIG_PATH}/.jax"

# Check if already initialized (jax checks for directory existence)
if [ ! -f "${JAX_DIR}/config.toml" ]; then
    echo "Initializing JAX node at ${JAX_DIR}..."
    # Clean any stale state so jax init doesn't complain
    rm -rf "${JAX_DIR}"
    jax --config-path "${JAX_DIR}" init \
        --api-port "${API_PORT}" \
        --gateway-port "${GATEWAY_PORT}" \
        --peer-port "${PEER_PORT}" \
        --blob-store filesystem
    echo "Node initialized successfully"
else
    echo "Using existing configuration at ${JAX_DIR}"
fi

# Start the service
echo "Starting JAX service..."
exec jax --config-path "${JAX_DIR}" "$@"
