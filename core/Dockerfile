###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine AS build

WORKDIR /usr/src/app

# Copy and build NestJS backend project
COPY --chown=node:node backend/package*.json ./
COPY --chown=node:node backend/tsconfig.build.json ./
COPY --chown=node:node backend/tsconfig.json ./
COPY --chown=node:node backend/nest-cli.fast.json ./
COPY --chown=node:node backend/nest-cli.json ./
# Create default .env if it doesn't exist (environment variables can also be set via compose file)
RUN echo "NODE_ENV=production" > .env || true
COPY --chown=node:node core/config ./config
COPY --chown=node:node core/keycloak ./keycloak
COPY --chown=node:node backend/src ./src

ENV NPM_CONFIG_LOGLEVEL=error
RUN npm ci --no-audit
RUN npm run build:fast
RUN npm prune --production

# Copy and build frontend project
COPY --chown=node:node frontend/package*.json ./frontend/
COPY --chown=node:node frontend/src ./frontend/src
COPY --chown=node:node frontend/public ./frontend/public
COPY --chown=node:node frontend/typings ./frontend/typings
COPY --chown=node:node frontend/vcs ./frontend/vcs
COPY --chown=node:node frontend/tsconfig.json ./frontend/tsconfig.json
COPY --chown=node:node frontend/vite.config.ts ./frontend/vite.config.ts
COPY --chown=node:node frontend/index.html ./frontend/index.html

ENV CYPRESS_INSTALL_BINARY=0
RUN npm ci --prefix=frontend --no-audit
RUN npm run build --prefix=frontend

USER node

###################
# PRODUCTION
###################

FROM node:18-alpine AS production

WORKDIR /usr/src/app

# Create default .env (environment variables are set via compose file)
RUN echo "NODE_ENV=production" > .env || true
COPY --chown=node:node core/config ./config
COPY --chown=node:node core/keycloak ./keycloak

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/package*.json ./
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

COPY --chown=node:node --from=build /usr/src/app/frontend/dist ./frontend/dist
COPY --chown=node:node --from=build /usr/src/app/frontend/vcs ./frontend/vcs

CMD ["npm", "run", "start:prod"]
