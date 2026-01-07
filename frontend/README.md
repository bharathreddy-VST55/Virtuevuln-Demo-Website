# Frontend

React-based single-page application (SPA) for the Demon Slayers training lab.

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **UI Framework**: Bootstrap 4.1

## Project Structure

```
frontend/
├── src/
│   ├── api/              # API client functions
│   ├── components/       # Reusable React components
│   ├── interfaces/       # TypeScript interfaces
│   ├── pages/            # Page components
│   ├── router/           # React Router configuration
│   └── utils/            # Utility functions
├── public/               # Static assets
├── cypress/              # E2E tests
└── package.json          # Dependencies and scripts
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Pages

- `/` - Home page
- `/hashiras` - Hashira character profiles
- `/demons` - Demon threat descriptions
- `/characters/tanjiro` - Character profiles
- `/marketplace` - Marketplace and products
- `/chat` - Chat interface
- `/userlogin` - Login page
- `/usersignup` - Registration page

## API Integration

The frontend communicates with the backend API via Axios. API endpoints are defined in `src/api/`.

## Build Output

Production builds are output to `frontend/dist/` and served by the backend server.
