# Architecture Documentation

## Overview

Demon Slayers is a full-stack web application designed as a vulnerable training lab for security education. The application demonstrates common security vulnerabilities in a controlled environment.

## Tech Stack

### 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  React 18 + TypeScript + Vite                             │  │
│  │  React Router + Axios + Bootstrap                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬──────────────────────────────────┘
                             │ HTTP/REST API
                             │ GraphQL
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SERVER (Node.js)                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  NestJS + Fastify + TypeScript                           │  │
│  │  MikroORM + JWT + Keycloak                               │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬──────────────────────────────────┘
                             │ SQL Queries
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (PostgreSQL)                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  PostgreSQL 17 (Alpine)                                  │  │
│  │  Users | Products | Testimonials                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              CORE INFRASTRUCTURE (Docker Containers)            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ Node.js │  │PostgreSQL│  │ Keycloak │  │ MailCatcher│     │
│  │  :3000  │  │  :5432   │  │  :8080   │  │   :1080   │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│  ┌──────────┐  ┌──────────┐                                   │
│  │  Ollama  │  │Watchtower│                                   │
│  │ :11434   │  │  (prod)  │                                   │
│  └──────────┘  └──────────┘                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

### 🎨 Frontend Layer

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Framework** | React | 18.x | UI component library |
| **Language** | TypeScript | Latest | Type-safe JavaScript |
| **Build Tool** | Vite | Latest | Fast build tool and dev server |
| **Routing** | React Router DOM | v6 | Client-side routing |
| **HTTP Client** | Axios | Latest | API communication |
| **UI Framework** | Bootstrap | 4.1 | CSS framework |
| **Styling** | Custom CSS | - | Theme and component styles |

**Frontend Architecture:**
- Single Page Application (SPA) architecture
- Component-based UI structure
- Client-side routing with React Router
- RESTful API integration via Axios
- Responsive design with Bootstrap

---

### ⚙️ Backend Layer

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Framework** | NestJS | Latest | Node.js framework |
| **Language** | TypeScript | Latest | Type-safe server code |
| **Runtime** | Node.js | 18+ | JavaScript runtime |
| **HTTP Server** | Fastify | Latest | High-performance HTTP server |
| **ORM** | MikroORM | Latest | Database abstraction layer |
| **Database** | PostgreSQL | 17 | Relational database |
| **Authentication** | JWT | - | Token-based authentication |
| **Identity Provider** | Keycloak | 26.1.2 | SSO and identity management |
| **Session** | Fastify Session | Latest | Server-side session management |
| **API Docs** | Swagger/OpenAPI | 3.0 | REST API documentation |
| **GraphQL** | Mercurius | Latest | GraphQL server implementation |

**Backend Architecture:**
- Modular architecture with NestJS modules
- RESTful API with OpenAPI documentation
- GraphQL endpoint for flexible queries
- JWT-based authentication with Keycloak integration
- Database operations via MikroORM
- Fastify for high-performance request handling

---

### 🏗️ Core Infrastructure & DevOps

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Containerization** | Docker | Latest | Application containerization |
| **Orchestration** | Docker Compose | Latest | Multi-container management |
| **Database** | PostgreSQL | 17 (Alpine) | Containerized database |
| **Email Testing** | MailCatcher | Latest | Email capture and testing |
| **LLM Service** | Ollama | Latest | Local LLM for chat features |
| **Auto-Updates** | Watchtower | Latest | Container update automation |

**Core Infrastructure Architecture:**
- Microservices architecture with Docker containers
- Service discovery via Docker networking
- Persistent data volumes for databases
- Health checks for all services
- Development and production configurations

---

### 🔧 Development Tools

| Tool | Purpose |
|------|---------|
| **TypeScript** | Type checking and enhanced IDE support |
| **ESLint** | Code linting and quality checks |
| **Prettier** | Code formatting |
| **Jest** | Unit and integration testing |
| **Cypress** | End-to-end testing |
| **Husky** | Git hooks for quality gates |

## Docker Architecture

### Container Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Compose Stack                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Node.js    │  │  PostgreSQL  │  │  Keycloak    │     │
│  │  (App)       │◄─┤  (Main DB)    │  │  (Auth)      │     │
│  │  Port: 3000  │  │  Port: 5432  │  │  Port: 8080  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                  │                  │             │
│         │                  │                  │             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ MailCatcher  │  │   Ollama     │  │ Keycloak DB  │     │
│  │ Port: 1080   │  │ Port: 11434  │  │ (PostgreSQL) │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Container Details

#### 1. **nodejs** (Application Container)
- **Image**: `demon-slayers (built from Dockerfile)` (production) or built from Dockerfile (local)
- **Port**: 3000 (HTTP)
- **Purpose**: Serves the React frontend and provides REST/GraphQL APIs
- **Environment Variables**:
  - `NODE_ENV`: production/development
  - `CHAT_API_URL`: Ollama API endpoint
  - `CHAT_API_MODEL`: LLM model name
  - `URL`: Application base URL
- **Dependencies**: db, mailcatcher, keycloak, ollama
- **Health Check**: HTTP GET to `/api/config`

#### 2. **db** (PostgreSQL - Main Database)
- **Image**: `postgres:17-alpine`
- **Port**: 5432
- **Database**: `bc`
- **User**: `bc` / Password: `bc`
- **Volumes**: 
  - `./pg.sql`: Initialization script
  - `.data/nodejs`: Persistent data (production)
- **Purpose**: Stores application data (users, products, testimonials)

#### 3. **keycloak-db** (PostgreSQL - Keycloak Database)
- **Image**: `postgres:17-alpine`
- **Database**: `keycloak`
- **User**: `keycloak` / Password: `password`
- **Volumes**: `.data/keycloak`: Persistent data
- **Purpose**: Stores Keycloak identity and access management data

#### 4. **keycloak** (Identity Provider)
- **Image**: `quay.io/keycloak/keycloak:26.1.2`
- **Port**: 8080
- **Purpose**: Provides SSO and identity management
- **Admin**: username `admin`, password `Pa55w0rd`
- **Realm Import**: `./keycloak/imports/realm-export.json`

#### 5. **mailcatcher** (Email Testing)
- **Image**: `sj26/mailcatcher`
- **Ports**: 1080 (web UI), 1025 (SMTP)
- **Purpose**: Catches and displays all outgoing emails for testing

#### 6. **ollama** (LLM Service)
- **Image**: `brightsec/brokencrystals-ollama:smollm135m` (external image - note: name unchanged as it's a pre-built image)
- **Port**: 11434
- **Purpose**: Provides local LLM for chat functionality
- **Model**: smollm:135m

#### 7. **watchtower** (Production Only)
- **Image**: `containrrr/watchtower`
- **Purpose**: Automatically updates containers
- **Interval**: 300 seconds
- **Volume**: `/var/run/docker.sock` (Docker socket access)

### Network Architecture

All containers communicate via Docker's default bridge network. Services reference each other by service name (e.g., `db`, `keycloak`, `ollama`).

### Volume Management

- **Database Data**: Persisted in `.data/` directories (local) or named volumes (production)
- **Application Code**: Built into container images
- **Static Assets**: Served from `client/dist` directory

### Port Mapping

| Service    | Internal Port | External Port | Purpose           |
|------------|---------------|---------------|-------------------|
| nodejs     | 3000          | 3000          | Web application   |
| db         | 5432          | 5432          | PostgreSQL        |
| keycloak   | 8080          | 8080          | Keycloak admin    |
| mailcatcher| 1080          | 1080          | Email web UI      |
| mailcatcher| 1025          | 1025          | SMTP              |
| ollama     | 11434         | 11434         | LLM API           |

## Application Structure

### 📁 Backend Structure (`src/`)

```
src/
│
├── 🔐 auth/                    # Authentication & Authorization
│   ├── api/                    # Auth API definitions
│   ├── jwt/                     # JWT token handling
│   ├── auth.controller.ts       # Auth endpoints
│   ├── auth.service.ts          # Auth business logic
│   └── auth.guard.ts           # Route protection guards
│
├── 💬 chat/                     # Chat & LLM Integration
│   ├── api/                     # Chat API definitions
│   ├── chat.controller.ts       # Chat endpoints
│   └── chat.service.ts          # LLM integration logic
│
├── 📧 email/                    # Email Service
│   ├── email.controller.ts      # Email endpoints
│   └── email.service.ts         # Email sending logic
│
├── 📁 file/                     # File Operations
│   ├── file.controller.ts       # File endpoints (⚠️ LFI/SSRF vulnerable)
│   └── file.service.ts          # File handling logic
│
├── 👥 users/                    # User Management
│   ├── users.controller.ts      # User CRUD endpoints
│   └── users.service.ts         # User business logic
│
├── 🛍️ products/                 # Product Management
│   ├── api/                     # Product API definitions
│   ├── products.controller.ts   # Product endpoints
│   └── products.service.ts      # Product business logic
│
├── 💬 testimonials/             # Testimonials (⚠️ XSS vulnerable)
│   ├── testimonials.controller.ts
│   └── testimonials.service.ts
│
├── 🤝 partners/                 # Partner Management (⚠️ XPATH injection)
│   ├── partners.controller.ts
│   └── partners.service.ts
│
├── 📊 model/                     # Database Entities
│   ├── user.entity.ts           # User model
│   ├── product.entity.ts        # Product model
│   └── testimonial.entity.ts    # Testimonial model
│
├── 🗄️ orm/                      # Database Configuration
│   ├── orm.module.ts            # MikroORM module setup
│   └── orm.config.factory.ts    # Database connection config
│
├── 🔧 components/                # Global Components
│   ├── global-exception.filter.ts    # Error handling
│   ├── headers.configurator.interceptor.ts  # Security headers
│   └── trace.middleware.ts      # Request tracing
│
├── 🔑 keycloak/                  # Keycloak Integration
│   ├── keycloak.module.ts
│   └── keycloak.service.ts
│
└── 🚀 main.ts                    # Application Entry Point
```

**Backend Module Organization:**
- Each feature is a self-contained NestJS module
- Shared components in `components/` directory
- Database models separated in `model/` directory
- Configuration centralized in module config files

---

### 🎨 Frontend Structure (`client/src/`)

```
client/src/
│
├── 📡 api/                       # API Communication Layer
│   ├── httpClient.ts             # Axios instance & helpers
│   └── ApiUrl.ts                 # API endpoint definitions
│
├── 🧩 components/                 # Reusable Components
│   └── InnerHtml.tsx             # HTML rendering component
│
├── 📄 pages/                     # Page Components
│   │
│   ├── 🔐 auth/                  # Authentication Pages
│   │   ├── Login/                # Login page
│   │   ├── LoginNew/             # New login page
│   │   ├── Register/             # Registration page
│   │   ├── AdminPage.tsx          # Admin dashboard
│   │   └── Dashboard.tsx         # User dashboard
│   │
│   ├── 💬 chat/                   # Chat Interface
│   │   ├── Chat.tsx               # Main chat page
│   │   └── ChatWidget.tsx        # Chat widget component
│   │
│   ├── 🏠 main/                   # Main Pages
│   │   ├── Main.tsx               # Home page
│   │   ├── Header/                # Site header
│   │   │   ├── Header.tsx
│   │   │   ├── Nav.tsx            # Navigation menu
│   │   │   └── Sign.tsx           # Sign in/out
│   │   ├── Footer.tsx             # Site footer
│   │   ├── Hero.tsx               # Hero section
│   │   ├── Contact.tsx            # Contact form
│   │   └── Userprofile.tsx        # User profile page
│   │
│   ├── 🛍️ marketplace/            # Marketplace Pages
│   │   ├── Marketplace.tsx       # Main marketplace
│   │   ├── ProductView.tsx       # Product details
│   │   ├── Testimonials/          # Testimonials section
│   │   │   ├── Testimonials.tsx
│   │   │   ├── TestimonialsForm.tsx
│   │   │   └── TestimonialsItems.tsx
│   │   └── Partners/              # Partners section
│   │
│   ├── ⚔️ hashiras/              # Hashiras Page (NEW)
│   │   └── Hashiras.tsx           # Hashira character profiles
│   │
│   ├── 👹 demons/                 # Demons Page (NEW)
│   │   └── Demons.tsx             # Demon threat descriptions
│   │
│   └── 👥 characters/             # Characters Page (NEW)
│       └── Characters.tsx         # Character profiles
│
├── 🛣️ router/                    # Routing Configuration
│   ├── RoutePath.ts               # Route path constants
│   └── AppRoutes.tsx              # Route definitions
│
├── 📋 interfaces/                # TypeScript Interfaces
│   ├── Product.ts                 # Product interface
│   └── User.ts                    # User interface
│
└── 🛠️ utils/                      # Utility Functions
    └── url.ts                     # URL parsing utilities
```

**Frontend Architecture:**
- Component-based React architecture
- Pages organized by feature/domain
- Shared components in `components/` directory
- API layer abstracts backend communication
- Type-safe interfaces for all data models

## API Endpoints

### REST API
- **Base URL**: `http://localhost:3000/api`
- **Documentation**: `http://localhost:3000/swagger`
- **OpenAPI JSON**: `http://localhost:3000/swagger-json`

### GraphQL API
- **Endpoint**: `http://localhost:3000/graphql`
- **Playground**: `http://localhost:3000/graphiql`

### Key Endpoints
- `/api/auth/*` - Authentication (JWT, Keycloak)
- `/api/users/*` - User management
- `/api/products/*` - Product management
- `/api/testimonials/*` - Testimonials (XSS vulnerable)
- `/api/file/*` - File operations (LFI/SSRF vulnerable)
- `/api/email/*` - Email operations
- `/api/chat/*` - Chat/LLM integration

## Database Schema

### Current Schema

**user** table:
- `id` (serial, primary key)
- `created_at`, `updated_at` (timestamps)
- `email` (varchar, indexed)
- `password` (varchar, hashed with Argon2)
- `first_name`, `last_name` (varchar)
- `is_admin` (boolean)
- `photo` (bytea, nullable)
- `company`, `card_number`, `phone_number` (varchar)
- `is_basic` (boolean)

**product** table:
- `id` (serial, primary key)
- `created_at` (timestamp)
- `name`, `category`, `description` (varchar)
- `photo_url` (varchar)
- `views_count` (integer)

**testimonial** table:
- `id` (serial, primary key)
- `created_at`, `updated_at` (timestamps)
- `name`, `title`, `message` (varchar)

See `docs/DB_DESIGN.md` for recommended schema improvements.

## Security Architecture

### Authentication Flow
1. User submits credentials via `/api/auth/login`
2. Server validates credentials (vulnerable to multiple JWT bypasses)
3. JWT token generated and returned
4. Client stores token and includes in `Authorization` header

### Session Management
- Fastify Session with cookies
- **Vulnerability**: Cookies lack `Secure` and `HttpOnly` flags
- Session secret: Random 32-byte hex string (per instance)

### CORS Configuration
- **Vulnerability**: `Access-Control-Allow-Origin: *` (allows all origins)
- Configurable via `main.ts`

## Deployment Considerations

### Development (compose.local.yml)
- Builds application from Dockerfile
- Exposes all ports to host
- No persistent volumes for database (uses init script)
- Includes development tools

### Production (compose.yml)
- Uses pre-built image: `demon-slayers (built from Dockerfile)`
- Includes Watchtower for auto-updates
- Persistent database volumes
- Resource limits configured
- Logging configured (max 5 files, 10MB each)

### Security Recommendations
1. **Never deploy to production** - This is a training lab only
2. Use secrets management (Docker secrets, environment variables)
3. Run containers as non-root user (already implemented)
4. Use read-only filesystems where possible
5. Limit container capabilities
6. Use Docker networks to isolate services
7. Enable TLS/HTTPS in production (currently only in production mode)

## Monitoring and Logging

- **Application Logs**: Via Docker logging driver
- **Health Checks**: Configured for all services
- **Database**: PostgreSQL logs via Docker
- **Email**: Viewable via MailCatcher web UI

## Scaling Considerations

The application uses Node.js clustering in production mode:
- Primary process forks workers (one per CPU core)
- Workers handle HTTP requests
- Automatic worker restart on failure

For horizontal scaling:
- Use a reverse proxy (nginx, Traefik)
- Implement session storage (Redis) for shared sessions
- Use database connection pooling
- Consider read replicas for database

