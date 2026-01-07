# Getting Started Guide

This guide will help you get the Demon Slayers application up and running.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Docker** (version 20.10+) - [Download Docker](https://www.docker.com/get-started)
- **Docker Compose** (version 2.0+) - Usually included with Docker Desktop
- **Git** - [Download Git](https://git-scm.com/downloads)

### Optional (for local development without Docker):
- **Node.js** 18+ - [Download Node.js](https://nodejs.org/)
- **npm** 10+ (comes with Node.js)
- **PostgreSQL** 17+ (if running database locally)

---

## 🚀 Quick Start (Recommended - Docker)

The easiest way to run the project is using Docker Compose. This will set up all services automatically.

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Virtuevulns
```

### Step 2: Start All Services

From the project root directory, run:

```bash
docker compose up -d
```

This command will:
- Build the application containers
- Start PostgreSQL databases
- Start Keycloak (identity provider)
- Start MailCatcher (email testing)
- Start Ollama (LLM service)
- Start the main application

### Step 3: Wait for Services to Start

The first time you run this, it may take a few minutes to:
- Download Docker images
- Build the application
- Initialize databases

You can check the status with:

```bash
docker compose ps
```

All services should show as "healthy" or "running".

### Step 4: Access the Application

Once all services are running, access:

| Service | URL | Credentials |
|---------|-----|-------------|
| **Web Application** | http://localhost:3000 | See below |
| **API Documentation (Swagger)** | http://localhost:3000/swagger | - |
| **GraphQL Playground** | http://localhost:3000/graphiql | - |
| **MailCatcher (Email UI)** | http://localhost:1080 | - |
| **Keycloak Admin** | http://localhost:8080 | admin / Pa55w0rd |

### Default Login Credentials

⚠️ **Warning**: These are intentionally weak for lab purposes only!

- **Username**: `admin`
- **Password**: `admin`

---

## 🔄 Common Commands

### Stop All Services

```bash
docker compose down
```

### Stop and Remove Volumes (Clean Slate)

```bash
docker compose down -v
```

### Rebuild After Code Changes

```bash
docker compose up -d --build --force-recreate
```

### View Logs

```bash
# All services
docker compose logs -f

# Specific service (e.g., nodejs)
docker compose logs -f nodejs
```

### Check Service Status

```bash
docker compose ps
```

---

## 💻 Local Development (Without Docker)

If you prefer to run the application locally without Docker:

### Step 1: Set Up Backend

```bash
cd backend
npm install
```

### Step 2: Set Up Frontend

```bash
cd ../frontend
npm install
```

### Step 3: Set Up Database

You'll need a PostgreSQL database running. You can either:
- Use Docker just for the database: `docker run -d -p 5432:5432 -e POSTGRES_DB=bc -e POSTGRES_USER=bc -e POSTGRES_PASSWORD=bc postgres:17-alpine`
- Install PostgreSQL locally and create the database

Initialize the database:

```bash
psql -U bc -d bc -f ../core/pg.sql
```

### Step 4: Configure Environment

Create a `.env` file in the `core/` directory:

```env
NODE_ENV=development
URL=http://localhost:3000
CHAT_API_URL=http://localhost:11434/v1/chat/completions
CHAT_API_MODEL=smollm:135m
CHAT_API_TOKEN=
CHAT_API_MAX_TOKENS=200
```

### Step 5: Start Backend

```bash
cd backend
npm run start:dev
```

The backend will start on http://localhost:3000

### Step 6: Start Frontend (in a new terminal)

```bash
cd frontend
npm start
```

The frontend will start on http://localhost:3001 (or another port if 3001 is taken)

---

## 🐛 Troubleshooting

### Port Already in Use

If you get an error about ports being in use:

```bash
# Check what's using the port (Windows)
netstat -ano | findstr :3000

# Check what's using the port (Linux/Mac)
lsof -i :3000

# Stop the service using the port or change the port in compose files
```

### Docker Build Fails

```bash
# Clean Docker cache and rebuild
docker system prune -a
docker compose build --no-cache
```

### Database Connection Issues

```bash
# Check if database container is running
docker compose ps db

# Check database logs
docker compose logs db

# Restart database
docker compose restart db
```

### Application Not Starting

```bash
# Check application logs
docker compose logs nodejs

# Check if all dependencies are installed
docker compose exec nodejs npm list
```

### Frontend Not Loading

- Ensure the backend is running and accessible
- Check browser console for errors
- Verify API endpoints are responding: http://localhost:3000/api/config

### Keycloak Not Starting

```bash
# Check Keycloak logs
docker compose logs keycloak

# Wait longer - Keycloak can take 1-2 minutes to start
# Check health: http://localhost:8080/health
```

---

## 📊 Service Health Checks

You can verify services are healthy:

```bash
# Application health
curl http://localhost:3000/api/config

# Database health
docker compose exec db pg_isready

# Keycloak health
curl http://localhost:8080/health/ready
```

---

## 🔧 Development Workflow

### Making Code Changes

1. **Edit code** in `frontend/` or `backend/` directories
2. **Rebuild containers**:
   ```bash
   docker compose up -d --build
   ```
3. **Or use hot reload** (if configured):
   - Backend: Changes should auto-reload
   - Frontend: Rebuild required for changes

### Viewing Logs in Real-Time

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f nodejs
```

---

## 🧪 Testing

### Run Backend Tests

```bash
cd backend
npm test
```

### Run Frontend Tests

```bash
cd frontend
npm test
```

### Run E2E Tests

```bash
cd backend
npm run test:e2e
```

---

## 📚 Next Steps

Once the application is running:

1. **Explore the API**: Visit http://localhost:3000/swagger
2. **Try GraphQL**: Visit http://localhost:3000/graphiql
3. **Check Email**: Visit http://localhost:1080 to see emails sent by the app
4. **Read Documentation**: Check the `docs/` directory for:
   - Architecture details
   - Security vulnerabilities
   - Database design
   - Testing procedures

---

## ⚠️ Important Notes

- **This is a training lab** - Do not deploy to production
- **Use only in isolated environments** - Contains intentional vulnerabilities
- **Default credentials are weak** - Intentionally so for lab purposes
- **All vulnerabilities are documented** - See `docs/SECURITY.md`

---

## 🆘 Need Help?

- Check the logs: `docker compose --file=core/compose.local.yml logs`
- Review documentation in the `docs/` directory
- Check service status: `docker compose --file=core/compose.local.yml ps`
- Verify all prerequisites are installed correctly

---

## 🎯 Quick Reference

```bash
# Start everything
docker compose up -d

# Stop everything
docker compose down

# Rebuild after changes
docker compose up -d --build

# View logs
docker compose logs -f

# Check status
docker compose ps
```

Happy coding! 🚀

