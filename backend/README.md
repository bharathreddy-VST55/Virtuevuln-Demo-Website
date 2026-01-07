# Backend

NestJS-based REST and GraphQL API server for the Demon Slayers training lab.

## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Runtime**: Node.js 18+
- **HTTP Server**: Fastify
- **ORM**: MikroORM
- **Database**: PostgreSQL 17
- **Authentication**: JWT, Keycloak
- **API Docs**: Swagger/OpenAPI 3.0, GraphQL

## Project Structure

```
backend/
├── src/
│   ├── auth/             # Authentication module
│   ├── chat/             # Chat/LLM integration
│   ├── email/            # Email service
│   ├── file/             # File operations
│   ├── users/            # User management
│   ├── products/         # Product management
│   ├── testimonials/     # Testimonials
│   ├── partners/         # Partner management
│   ├── model/            # Database entities
│   ├── orm/              # Database configuration
│   └── main.ts           # Application entry point
├── test/                 # E2E tests
└── package.json          # Dependencies and scripts
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run start:dev

# Build for production
npm run build

# Run tests
npm test
```

## API Endpoints

- **REST API**: `http://localhost:3000/api`
- **Swagger UI**: `http://localhost:3000/swagger`
- **GraphQL**: `http://localhost:3000/graphql`
- **GraphiQL**: `http://localhost:3000/graphiql`

## Database

The backend uses PostgreSQL with MikroORM. Database configuration is in `src/orm/`.

## Security Note

⚠️ This application intentionally contains vulnerabilities for training purposes. See `docs/SECURITY.md` for details.

