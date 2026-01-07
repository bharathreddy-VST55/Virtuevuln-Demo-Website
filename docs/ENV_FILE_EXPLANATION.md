# .env File Explanation

This document explains what each variable in the `.env` file does and why certain values were changed.

## Current .env File Contents

### Application URL
```bash
URL=http://localhost:3000
```
**Why it's there**: Base URL for the application. Used for generating absolute URLs.
**Why changed**: Previously was `https://brokencrystals.com` - this was an external production URL that doesn't exist. Changed to local development URL.

---

### Database Configuration
```bash
DATABASE_HOST=db
DATABASE_SCHEMA=bc
DATABASE_USER=bc
DATABASE_PASSWORD=bc
DATABASE_PORT=5432
DATABASE_DEBUG=true
```
**Why they're there**: PostgreSQL database connection settings.
- `DATABASE_HOST`: Service name in Docker Compose (the PostgreSQL container)
- `DATABASE_SCHEMA`: Database name
- `DATABASE_USER` & `DATABASE_PASSWORD`: Authentication credentials
- `DATABASE_PORT`: PostgreSQL default port
- `DATABASE_DEBUG`: When `true`, logs all SQL queries (useful for debugging)

**Note**: These are development defaults. Use strong passwords in production!

---

### AWS S3 Bucket
```bash
AWS_BUCKET=http://localhost:3000/api/storage
```
**Why it's there**: Used for file storage operations in the application.
**Why changed**: Previously was `https://neuralegion-open-bucket.s3.amazonaws.com` - this was an external AWS S3 bucket that we don't have access to. Changed to local storage endpoint.

---

### Google Maps API
```bash
GOOGLE_MAPS_API=DEMON_SLAYERS_MAPS_API_KEY
```
**Why it's there**: Would be used for Google Maps integration.
**Why changed**: Previously was a real API key `AIzaSyD2wIxpYCuNI0Zjt8kChs2hLTS5abVQfRQ` - this was an actual Google Maps API key that shouldn't be exposed. Changed to placeholder since Google Maps has been removed from the application.

**Note**: Google Maps functionality has been removed from the frontend, so this value is not actually used anymore.

---

### JWT Authentication Keys
```bash
JWT_PRIVATE_KEY_LOCATION=config/keys/jwtRS256.key
JWT_PUBLIC_KEY_LOCATION=config/keys/jwtRS256.key.pub.pem
JWT_SECRET_KEY=1234
```
**Why they're there**: JWT (JSON Web Token) authentication configuration.
- `JWT_PRIVATE_KEY_LOCATION`: Path to private key for signing tokens
- `JWT_PUBLIC_KEY_LOCATION`: Path to public key for verifying tokens
- `JWT_SECRET_KEY`: Secret key for HMAC-based JWT (intentionally weak for training)

**Security Note**: `JWT_SECRET_KEY=1234` is intentionally weak for vulnerability training purposes!

---

### JWK (JSON Web Key) Configuration
```bash
JWK_PRIVATE_KEY_LOCATION=config/keys/jwk.key.pem
JWK_PUBLIC_KEY_LOCATION=config/keys/jwk.pub.key.pem
JWK_PUBLIC_JSON=config/keys/jwk.pub.json
```
**Why they're there**: JWK-based JWT authentication (alternative to RSA keys).
**What they do**: Used for JWK rogue key vulnerability demonstrations.

---

### JKU and X5U URLs
```bash
JKU_URL=http://localhost:3000/api/auth/jku
X5U_URL=http://localhost:3000/api/auth/x5u
```
**Why they're there**: URLs for JWT key discovery endpoints.
**Why changed**: Previously pointed to GitHub:
- `https://raw.githubusercontent.com/NeuraLegion/brokencrystals/stable/config/keys/jku.json`
- `https://raw.githubusercontent.com/NeuraLegion/brokencrystals/stable/config/keys/x509.crt`

These external URLs were replaced with local endpoints that serve the keys from the application itself.

---

### Fastify Logger Configuration
```bash
FASTIFY_LOGGER=true
FASTIFY_LOG_LEVEL=warn
```
**Why they're there**: Control logging in the Fastify web server.
- `FASTIFY_LOGGER`: Enable/disable logging
- `FASTIFY_LOG_LEVEL`: Log level (warn, info, error, debug)

---

### Keycloak Configuration
```bash
KEYCLOAK_SERVER_URI=http://keycloak:8080
KEYCLOAK_REALM=demon-slayers
KEYCLOAK_ADMIN_CLIENT_ID=admin-cli
KEYCLOAK_ADMIN_CLIENT_SECRET=3abff4a7-6649-4bae-a105-9bd1fb52a2cd
KEYCLOAK_PUBLIC_CLIENT_ID=demon-slayers-client
KEYCLOAK_PUBLIC_CLIENT_SECRET=4bfb5df6-4647-46dd-bad1-c8b8ffd7caf4
```
**Why they're there**: Keycloak OAuth/OIDC authentication server configuration.
- `KEYCLOAK_SERVER_URI`: Keycloak server URL (Docker service name)
- `KEYCLOAK_REALM`: Realm name (changed from `brokencrystals` to `demon-slayers`)
- `KEYCLOAK_PUBLIC_CLIENT_ID`: Client ID for public access (changed from `brokencrystals-client` to `demon-slayers-client`)
- Client secrets: Authentication credentials for Keycloak clients

**Why changed**: Updated to match the new "demon-slayers" theme.

---

### Bright Security Configuration
```bash
BRIGHT_TOKEN=
SEC_TESTER_TARGET=http://localhost:3000
```
**Why they're there**: Configuration for Bright Security testing tool (optional).
- `BRIGHT_TOKEN`: API token (empty = not configured)
- `SEC_TESTER_TARGET`: Target URL for security testing

**Note**: 
- `BRIGHT_CLUSTER` was removed - it was only used in e2e test files (`.e2e-spec.ts`) for automated security testing. Since these tests are optional and not part of the main application, this variable has been removed from the `.env` file.
- These variables are optional and only used if Bright Security is configured for automated testing.

---

### Chat API Configuration (Ollama)
```bash
CHAT_API_URL=http://ollama:11434/v1/chat/completions
CHAT_API_MODEL=smollm:135m
CHAT_API_TOKEN=
CHAT_API_MAX_TOKENS=200
```
**Why they're there**: Configuration for the chat/LLM functionality.
- `CHAT_API_URL`: Ollama API endpoint (Docker service name)
- `CHAT_API_MODEL`: LLM model to use
- `CHAT_API_TOKEN`: API token (empty for local Ollama)
- `CHAT_API_MAX_TOKENS`: Maximum response length

---

## Summary of Changes Made

### Removed/Changed External URLs:
1. ✅ `URL=https://brokencrystals.com` → `URL=http://localhost:3000`
   - **Reason**: External production URL doesn't exist, changed to local development URL

2. ✅ `AWS_BUCKET=https://neuralegion-open-bucket.s3.amazonaws.com` → `AWS_BUCKET=http://localhost:3000/api/storage`
   - **Reason**: External AWS S3 bucket we don't have access to, changed to local storage endpoint

3. ✅ `GOOGLE_MAPS_API=AIzaSyD2wIxpYCuNI0Zjt8kChs2hLTS5abVQfRQ` → `GOOGLE_MAPS_API=DEMON_SLAYERS_MAPS_API_KEY`
   - **Reason**: Real API key exposed, replaced with placeholder (Google Maps removed from app)

4. ✅ `JKU_URL` and `X5U_URL` GitHub URLs → Local endpoints
   - **Reason**: External dependencies removed, using local endpoints

5. ✅ `KEYCLOAK_REALM=brokencrystals` → `KEYCLOAK_REALM=demon-slayers`
   - **Reason**: Updated to match new theme

6. ✅ `KEYCLOAK_PUBLIC_CLIENT_ID=brokencrystals-client` → `KEYCLOAK_PUBLIC_CLIENT_ID=demon-slayers-client`
   - **Reason**: Updated to match new theme

---

## Important Notes

⚠️ **Security Warning**: This `.env` file contains development defaults. For production:
- Use strong, unique passwords
- Generate new Keycloak client secrets
- Use a strong JWT secret key
- Never commit real API keys to version control
- Use environment-specific configuration

✅ **All external dependencies removed**: The application now works completely locally without requiring:
- External AWS S3 bucket
- Google Maps API
- External GitHub repositories
- Production URLs

