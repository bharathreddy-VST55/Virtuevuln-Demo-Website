# Core Infrastructure & DevOps

This directory contains all infrastructure, deployment, and DevOps-related files.

## Directory Structure

```
core/
├── Dockerfile              # Multi-stage Docker build for application
├── compose.yml            # Production Docker Compose configuration
├── compose.local.yml      # Local development Docker Compose configuration
├── pg.sql                 # PostgreSQL database initialization script
├── config/                # Application configuration files
│   ├── keys/              # JWT keys and certificates
│   └── products/          # Product images
└── keycloak/              # Keycloak identity provider configuration
    └── imports/           # Keycloak realm exports
```

## Docker Compose Files

### `compose.local.yml` (Development)
- Builds application from source
- Exposes all ports to host
- Includes development tools
- Uses local Dockerfile build

### `compose.yml` (Production)
- Uses pre-built Docker image
- Includes Watchtower for auto-updates
- Persistent volumes for data
- Resource limits configured

## Usage

### Local Development
```bash
# From project root
docker compose --file=core/compose.local.yml up -d
```

### Production
```bash
# From project root
docker compose --file=core/compose.yml up -d
```

## Services

- **nodejs**: Main application container (backend + frontend)
- **db**: PostgreSQL database (main application data)
- **keycloak-db**: PostgreSQL database (Keycloak data)
- **keycloak**: Identity and access management
- **mailcatcher**: Email testing service
- **ollama**: Local LLM for chat functionality
- **watchtower**: Container auto-update service (production only)

## Configuration Files

- **pg.sql**: Database schema and initial data
- **config/**: Application configuration and keys
- **keycloak/imports/**: Keycloak realm configuration

## Notes

- All paths in Dockerfile and compose files are relative to project root
- Build context is set to project root (`..` from core directory)
- Environment variables should be in `.env` file in core directory

