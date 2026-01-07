# Setup Fixes Applied

This document lists all the fixes applied to make the project run successfully.

## Issues Fixed

### 1. ✅ Frontend Path References in Backend
**Problem**: The backend `main.ts` was using incorrect paths to serve frontend files after compilation.

**Fix**: Updated all frontend path references from `join(__dirname, '..', '..', 'frontend', ...)` to `join(__dirname, '..', 'frontend', ...)` because:
- After compilation, `__dirname` = `/usr/src/app/dist`
- Going up one level (`..`) = `/usr/src/app`
- Then `frontend/dist` = `/usr/src/app/frontend/dist` ✓

**Files Changed**:
- `backend/src/main.ts` - Fixed 4 path references

### 2. ✅ Missing .env File
**Problem**: Dockerfile tried to copy `.env` file that didn't exist, causing build failures.

**Fix**: 
- Created `infrastructure/.env` with default values
- Updated Dockerfile to create a default `.env` if it doesn't exist
- Environment variables are also set via `compose.yml` environment section

**Files Changed**:
- `infrastructure/Dockerfile` - Made .env optional with fallback
- Created `infrastructure/.env` with default configuration

### 3. ✅ VCS Directory Error Handling
**Problem**: Code tried to read VCS directory without error handling, could crash if directory doesn't exist.

**Fix**: Added try-catch block around VCS directory reading with graceful fallback.

**Files Changed**:
- `backend/src/main.ts` - Added error handling for VCS directory

### 4. ✅ Docker Compose Dependencies
**Problem**: Some services had incorrect dependency conditions.

**Fix**: Updated dependency conditions:
- `mailcatcher`: Changed to `service_started` (no healthcheck needed)
- `ollama`: Changed to `service_started` (healthcheck exists but start_period is long)

**Files Changed**:
- `compose.yml` - Updated dependency conditions

### 5. ✅ Simplified Docker Compose Commands
**Problem**: Users had to specify `--file=infrastructure/compose.local.yml` every time.

**Fix**: Created `compose.yml` in project root so users can run `docker compose up -d` directly.

**Files Changed**:
- Created `compose.yml` in root directory
- Updated all documentation to use simple commands

### 6. ✅ Keycloak Environment Variables Not Loading
**Problem**: Keycloak environment variables were defined in `compose.yml` but not being passed to the container, causing the application to crash with `AssertionError: "realm" is not defined`.

**Fix**: 
- Rebuilt the container with `docker compose up -d --build --force-recreate nodejs` to ensure environment variables are properly injected
- Verified all Keycloak environment variables are now accessible:
  - `KEYCLOAK_SERVER_URI: http://keycloak:8080`
  - `KEYCLOAK_REALM: demon-slayers`
  - `KEYCLOAK_PUBLIC_CLIENT_ID: demon-slayers-client`
  - `KEYCLOAK_PUBLIC_CLIENT_SECRET: 4bfb5df6-4647-46dd-bad1-c8b8ffd7caf4`
  - `KEYCLOAK_ADMIN_CLIENT_ID: admin-cli`
  - `KEYCLOAK_ADMIN_CLIENT_SECRET: 3abff4a7-6649-4bae-a105-9bd1fb52a2cd`

**Files Changed**:
- No code changes needed - environment variables were already correctly defined in `compose.yml`
- Container rebuild was required to apply the environment variables

## Current Status

✅ All path references fixed
✅ .env file handling improved
✅ Error handling added
✅ Docker Compose commands simplified
✅ Keycloak environment variables working
✅ All containers healthy and running
✅ API responding correctly
✅ Documentation updated

## To Run the Project

1. **Start Docker Desktop** (if not already running)

2. **Run from project root**:
   ```bash
   docker compose up -d
   ```

3. **Wait for services to start** (first time may take a few minutes)

4. **Access the application**:
   - Web App: http://localhost:3000
   - Swagger: http://localhost:3000/swagger
   - MailCatcher: http://localhost:1080

## Known Requirements

- Docker Desktop must be running
- Ports 3000, 5432, 8080, 1080, 11434 should be available
- Sufficient disk space for Docker images (~2-3GB)

## If You Still Encounter Issues

1. **Check Docker is running**:
   ```bash
   docker ps
   ```

2. **Check service logs**:
   ```bash
   docker compose logs -f nodejs
   ```

3. **Rebuild from scratch**:
   ```bash
   docker compose down -v
   docker compose up -d --build
   ```

4. **Check port availability**:
   - Windows: `netstat -ano | findstr :3000`
   - Linux/Mac: `lsof -i :3000`

