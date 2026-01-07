# Environment Variables Documentation

This document explains all environment variables used in the Demon Slayers application.

## Overview

Environment variables are configured in `compose.yml` and can also be set via a `.env` file (though the application works without one as all variables are set in the compose file).

## Environment Variables Reference

### Application Configuration

#### `URL`
- **Type**: String
- **Default**: `http://localhost:3000`
- **Description**: Base URL of the application
- **Usage**: Used for generating absolute URLs in the application
- **Example**: `URL=http://localhost:3000`

#### `NODE_ENV`
- **Type**: String
- **Default**: `production`
- **Description**: Node.js environment mode
- **Possible Values**: `development`, `production`, `test`
- **Usage**: Controls application behavior (logging, error handling, etc.)

---

### Database Configuration

#### `DATABASE_HOST`
- **Type**: String
- **Default**: `db`
- **Description**: PostgreSQL database hostname
- **Usage**: Used by MikroORM to connect to the database
- **Note**: In Docker, this is the service name from `compose.yml`

#### `DATABASE_SCHEMA`
- **Type**: String
- **Default**: `bc`
- **Description**: PostgreSQL database name/schema
- **Usage**: Database name to connect to

#### `DATABASE_USER`
- **Type**: String
- **Default**: `bc`
- **Description**: PostgreSQL database username
- **Usage**: Authentication credential for database connection

#### `DATABASE_PASSWORD`
- **Type**: String
- **Default**: `bc`
- **Description**: PostgreSQL database password
- **Usage**: Authentication credential for database connection
- **Security Note**: ⚠️ This is a default value for development only!

#### `DATABASE_PORT`
- **Type**: Number (as string)
- **Default**: `5432`
- **Description**: PostgreSQL database port
- **Usage**: Port number for database connection

#### `DATABASE_DEBUG`
- **Type**: String (boolean)
- **Default**: `'false'`
- **Description**: Enable/disable database query debugging
- **Possible Values**: `'true'`, `'false'`
- **Usage**: When `'true'`, logs all SQL queries to console

---

### JWT Authentication

#### `JWT_PRIVATE_KEY_LOCATION`
- **Type**: String (file path)
- **Default**: `./config/keys/jwtRS256.key`
- **Description**: Path to JWT private key file
- **Usage**: Used to sign JWT tokens
- **Note**: Path is relative to the application root in the container

#### `JWT_PUBLIC_KEY_LOCATION`
- **Type**: String (file path)
- **Default**: `./config/keys/jwtRS256.key.pub`
- **Description**: Path to JWT public key file
- **Usage**: Used to verify JWT tokens
- **Note**: Path is relative to the application root in the container

#### `JWT_SECRET_KEY`
- **Type**: String
- **Default**: `'123'`
- **Description**: Secret key for HMAC-based JWT signing
- **Usage**: Used for weak key JWT authentication (intentionally vulnerable)
- **Security Note**: ⚠️ This is intentionally weak for training purposes!

#### `JWK_PRIVATE_KEY_LOCATION`
- **Type**: String (file path)
- **Default**: `./config/keys/jwk.key.pem`
- **Description**: Path to JWK private key file
- **Usage**: Used for JWK-based JWT authentication

#### `JWK_PUBLIC_KEY_LOCATION`
- **Type**: String (file path)
- **Default**: `./config/keys/jwk.pub.key.pem`
- **Description**: Path to JWK public key file
- **Usage**: Used for JWK-based JWT authentication

#### `JWK_PUBLIC_JSON`
- **Type**: String (file path)
- **Default**: `./config/keys/jwk.pub.json`
- **Description**: Path to JWK public key in JSON format
- **Usage**: Used for JWK-based JWT authentication

#### `JKU_URL`
- **Type**: String (URL)
- **Default**: `http://localhost:3000/api/auth/jku`
- **Description**: URL endpoint that serves JWK keys
- **Usage**: Used for JKU (JSON Web Key Set URL) JWT authentication

#### `X5U_URL`
- **Type**: String (URL)
- **Default**: `http://localhost:3000/api/auth/x5u`
- **Description**: URL endpoint that serves X.509 certificates
- **Usage**: Used for X5U-based JWT authentication

---

### Keycloak Configuration

#### `KEYCLOAK_SERVER_URI`
- **Type**: String (URL)
- **Default**: `http://keycloak:8080`
- **Description**: Base URL of the Keycloak server
- **Usage**: Used to connect to Keycloak for OAuth/OIDC authentication
- **Note**: In Docker, this is the service name from `compose.yml`

#### `KEYCLOAK_REALM`
- **Type**: String
- **Default**: `demon-slayers`
- **Description**: Keycloak realm name
- **Usage**: Identifies which Keycloak realm to use

#### `KEYCLOAK_PUBLIC_CLIENT_ID`
- **Type**: String
- **Default**: `demon-slayers-client`
- **Description**: Keycloak client ID for public access
- **Usage**: Used for public-facing authentication flows

#### `KEYCLOAK_PUBLIC_CLIENT_SECRET`
- **Type**: String (UUID)
- **Default**: `4bfb5df6-4647-46dd-bad1-c8b8ffd7caf4`
- **Description**: Keycloak client secret for public client
- **Usage**: Authentication credential for public client
- **Security Note**: ⚠️ This is a default value for development only!

#### `KEYCLOAK_ADMIN_CLIENT_ID`
- **Type**: String
- **Default**: `admin-cli`
- **Description**: Keycloak client ID for admin operations
- **Usage**: Used for administrative Keycloak operations

#### `KEYCLOAK_ADMIN_CLIENT_SECRET`
- **Type**: String (UUID)
- **Default**: `3abff4a7-6649-4bae-a105-9bd1fb52a2cd`
- **Description**: Keycloak client secret for admin client
- **Usage**: Authentication credential for admin client
- **Security Note**: ⚠️ This is a default value for development only!

---

### Chat API Configuration (Ollama)

#### `CHAT_API_URL`
- **Type**: String (URL)
- **Default**: `http://ollama:11434/v1/chat/completions`
- **Description**: URL endpoint for the chat/LLM API
- **Usage**: Used by the chat service to send requests to Ollama
- **Note**: In Docker, this is the service name from `compose.yml`

#### `CHAT_API_MODEL`
- **Type**: String
- **Default**: `smollm:135m`
- **Description**: Name of the LLM model to use
- **Usage**: Specifies which model Ollama should use for chat completions

#### `CHAT_API_TOKEN`
- **Type**: String
- **Default**: `''` (empty string)
- **Description**: API token for external chat services
- **Usage**: Required for external services (OpenAI, etc.), optional for Ollama
- **Note**: Can be empty for local Ollama instances

#### `CHAT_API_MAX_TOKENS`
- **Type**: Number (as string)
- **Default**: `200`
- **Description**: Maximum number of tokens in the chat response
- **Usage**: Limits the length of chat responses

---

### External Services

#### `AWS_BUCKET`
- **Type**: String (URL)
- **Default**: `http://localhost:3000/api/storage`
- **Description**: URL for AWS S3 bucket or local storage endpoint
- **Usage**: Used for file storage operations
- **Note**: Replaced with local storage endpoint (no actual AWS S3 required)

#### `GOOGLE_MAPS_API`
- **Type**: String
- **Default**: `DEMON_SLAYERS_MAPS_API_KEY`
- **Description**: Google Maps API key (placeholder)
- **Usage**: Would be used for Google Maps integration (currently removed)
- **Note**: This is a placeholder - Google Maps has been removed from the application

---

## Environment Variable Groups

### Required for Basic Operation
- `DATABASE_HOST`
- `DATABASE_SCHEMA`
- `DATABASE_USER`
- `DATABASE_PASSWORD`
- `DATABASE_PORT`
- `KEYCLOAK_SERVER_URI`
- `KEYCLOAK_REALM`
- `KEYCLOAK_PUBLIC_CLIENT_ID`
- `KEYCLOAK_PUBLIC_CLIENT_SECRET`
- `KEYCLOAK_ADMIN_CLIENT_ID`
- `KEYCLOAK_ADMIN_CLIENT_SECRET`

### Required for Chat Functionality
- `CHAT_API_URL`
- `CHAT_API_MODEL`
- `CHAT_API_MAX_TOKENS`

### Optional (Have Defaults)
- `URL`
- `NODE_ENV`
- `DATABASE_DEBUG`
- `JWT_SECRET_KEY`
- `CHAT_API_TOKEN`
- `AWS_BUCKET`
- `GOOGLE_MAPS_API`

---

## Security Notes

⚠️ **IMPORTANT**: This application is intentionally vulnerable for training purposes. The following defaults are insecure:

1. **Weak JWT Secret**: `JWT_SECRET_KEY='123'` - This is intentionally weak
2. **Default Database Credentials**: `bc/bc` - Use strong passwords in production
3. **Default Keycloak Secrets**: Hardcoded UUIDs - Generate new secrets for production
4. **No HTTPS by Default**: Application runs on HTTP in development

**DO NOT** use these default values in production environments!

---

## How to Override Environment Variables

### Method 1: Docker Compose File
Edit `compose.yml` and modify the `environment` section under the `nodejs` service.

### Method 2: .env File (Optional)
Create a `.env` file in the project root (though not required as all variables are in `compose.yml`):

```bash
# Database
DATABASE_HOST=db
DATABASE_SCHEMA=bc
DATABASE_USER=bc
DATABASE_PASSWORD=bc
DATABASE_PORT=5432

# Keycloak
KEYCLOAK_SERVER_URI=http://keycloak:8080
KEYCLOAK_REALM=demon-slayers
# ... etc
```

### Method 3: Environment Variables at Runtime
Set environment variables when running Docker:

```bash
docker compose run -e DATABASE_PASSWORD=mynewpassword nodejs
```

---

## Troubleshooting

### Database Connection Issues
- Check `DATABASE_HOST` matches the service name in `compose.yml`
- Verify `DATABASE_USER` and `DATABASE_PASSWORD` match PostgreSQL configuration
- Ensure `DATABASE_PORT` is `5432` (default PostgreSQL port)

### Keycloak Connection Issues
- Verify `KEYCLOAK_SERVER_URI` is accessible from the container
- Check that `KEYCLOAK_REALM` exists in Keycloak
- Ensure client IDs and secrets match Keycloak configuration

### Chat API Issues
- Verify `CHAT_API_URL` is correct (for Ollama: `http://ollama:11434/v1/chat/completions`)
- Check that `CHAT_API_MODEL` is available in Ollama
- Ensure Ollama service is running and healthy

---

## Related Documentation

- [Architecture Documentation](./ARCHITECTURE.md)
- [Security Documentation](./SECURITY.md)
- [Getting Started Guide](./GETTING_STARTED.md)

