# Demon Slayers Corps

## ⚠️ CRITICAL SAFETY WARNING

**This repository intentionally contains insecure code for security training purposes only.**

- **DO NOT** deploy this application to production
- **DO NOT** expose this application to the public internet  
- **ONLY** use in isolated, offline lab environments
- All vulnerabilities are intentional and documented for educational purposes

## Description

Demon Slayers is a benchmark application that uses modern technologies and implements a set of common security vulnerabilities. This application is designed for security training, vulnerability research, and educational purposes in controlled lab environments.

The application contains:

- React based web client & API: http://localhost:3000
- Node.js server that serves the React client and provides both OpenAPI and GraphQL endpoints.
  The full API documentation is available via swagger or GraphQL:
  - Swagger UI - http://localhost:3000/swagger
  - Swagger JSON file - http://localhost:3000/swagger-json
  - GraphiQL UI - http://localhost:3000/graphiql

> **Note**
> The GraphQL API does not yet support all the endpoints the REST API does.

## Quick Start

### Prerequisites
- **Docker** and **Docker Compose** installed ([Get Docker](https://www.docker.com/get-started))
- **Git** for cloning the repository
- **Node.js 18+** and **npm 10+** (optional, for local development without Docker)

### 🚀 Running with Docker (Recommended)

**Step 1:** Start all services:
```bash
docker compose up -d
```

**Step 2:** Wait for services to start (first time may take a few minutes)

**Step 3:** Access the application at http://localhost:3000

### 📍 Access Points

Once running, you can access:

| Service | URL | Description |
|---------|-----|-------------|
| **Web Application** | http://localhost:3000 | Main application |
| **API Documentation** | http://localhost:3000/swagger | Swagger UI |
| **GraphQL Playground** | http://localhost:3000/graphiql | GraphQL interface |
| **MailCatcher** | http://localhost:1080 | Email testing UI |
| **Keycloak Admin** | http://localhost:8080 | Identity management |

### 🔑 Default Credentials

⚠️ **Warning**: These are intentionally weak for lab purposes only!

- **Username**: `admin`
- **Password**: `admin`
- **Keycloak Admin**: `admin` / `Pa55w0rd`

### 🔄 Common Commands

```bash
# Stop all services
docker compose down

# Rebuild after code changes
docker compose up -d --build --force-recreate

# View logs
docker compose logs -f

# Check service status
docker compose ps
```

### 📖 Detailed Instructions

For comprehensive setup instructions, troubleshooting, and local development guide, see:
- **[Getting Started Guide](docs/GETTING_STARTED.md)** - Complete setup and troubleshooting guide

## Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[Architecture Documentation](docs/ARCHITECTURE.md)** - Tech stack, Docker architecture, and system design
- **[Security Documentation](docs/SECURITY.md)** - Vulnerability summary and remediation guidance
- **[Reproduction Steps](docs/REPRO_STEPS.md)** - Safe lab testing procedures for each vulnerability
- **[Database Design](docs/DB_DESIGN.md)** - Current schema and recommended redesign

