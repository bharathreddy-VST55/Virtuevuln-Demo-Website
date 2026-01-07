# Project Structure

This document describes the organized project structure of the Demon Slayers application.

## Directory Layout

```
Virtuevulns/                    # Main project directory
│
├── 📱 frontend/                # Frontend application (React)
│   ├── src/                    # Source code
│   │   ├── api/                # API client functions
│   │   ├── components/          # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── router/             # Routing configuration
│   │   └── utils/              # Utility functions
│   ├── public/                 # Static assets
│   ├── cypress/                # E2E tests
│   ├── package.json            # Frontend dependencies
│   └── README.md               # Frontend documentation
│
├── ⚙️ backend/                 # Backend application (NestJS)
│   ├── src/                    # Source code
│   │   ├── auth/               # Authentication module
│   │   ├── chat/               # Chat/LLM integration
│   │   ├── email/              # Email service
│   │   ├── file/               # File operations
│   │   ├── users/              # User management
│   │   ├── products/           # Product management
│   │   ├── testimonials/       # Testimonials
│   │   ├── partners/           # Partner management
│   │   ├── model/              # Database entities
│   │   ├── orm/                # Database configuration
│   │   └── main.ts             # Application entry point
│   ├── test/                   # E2E tests
│   ├── package.json            # Backend dependencies
│   └── README.md               # Backend documentation
│
├── 🏗️ core/                    # Core Infrastructure & DevOps
│   ├── Dockerfile              # Multi-stage Docker build
│   ├── compose.yml             # Production Docker Compose
│   ├── compose.local.yml       # Development Docker Compose
│   ├── pg.sql                 # Database initialization
│   ├── config/                # Configuration files
│   │   ├── keys/              # JWT keys and certificates
│   │   └── products/          # Product images
│   ├── keycloak/              # Keycloak configuration
│   │   └── imports/           # Realm exports
│   ├── scripts/               # Utility scripts
│   ├── security/              # Security tools & templates
│   │   └── nuclei-templates/  # Nuclei scanning templates
│   └── README.md              # Infrastructure documentation
│
├── 📚 docs/                    # Documentation
│   ├── ARCHITECTURE.md        # System architecture
│   ├── SECURITY.md            # Security documentation
│   ├── REPRO_STEPS.md         # Vulnerability reproduction steps
│   └── DB_DESIGN.md           # Database design
│
├── README.md                   # Main project README
├── CHANGELOG.md                # Project changelog
└── LICENSE                     # License file
```

## Key Directories

### Frontend (`/frontend`)
- React 18 + TypeScript SPA
- Vite build tool
- React Router for navigation
- Axios for API communication
- Bootstrap for UI components

### Backend (`/backend`)
- NestJS framework
- Fastify HTTP server
- MikroORM for database
- JWT + Keycloak authentication
- REST and GraphQL APIs

### Core Infrastructure (`/core`)
- Docker and Docker Compose files
- Database initialization scripts
- Configuration files
- Keycloak setup
- Deployment configurations

### Documentation (`/docs`)
- Architecture documentation
- Security vulnerability reports
- Database design documents
- Testing procedures

## Benefits of This Structure

1. **Clear Separation**: Frontend, backend, and core infrastructure are clearly separated
2. **Easy Navigation**: Developers can quickly find relevant code
3. **Independent Development**: Teams can work on different parts independently
4. **Better Organization**: Related files are grouped together
5. **Scalability**: Easy to add new features or services

## Development Workflow

### Frontend Development
```bash
cd frontend
npm install
npm start
```

### Backend Development
```bash
cd backend
npm install
npm run start:dev
```

### Full Stack with Docker
```bash
# From project root
docker compose --file=core/compose.local.yml up -d
```

## File Path References

When referencing files across directories:

- **Backend → Frontend**: `../frontend/dist/` (for serving static files)
- **Dockerfile**: Uses build context from project root
- **Compose files**: Paths relative to project root
- **Import statements**: Use relative paths within same directory or absolute imports

## Migration Notes

This structure was reorganized from the original flat structure:
- `client/` → `frontend/`
- `src/` → `backend/src/`
- Docker files → `core/`
- Config files → `core/config/`

All path references have been updated to reflect the new structure.

