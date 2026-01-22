import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HeadersConfiguratorInterceptor } from './components/headers.configurator.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fastifyCookie from '@fastify/cookie';
import session from '@fastify/session';
import { GlobalExceptionFilter } from './components/global-exception.filter';
import * as os from 'os';
import { readFileSync, readFile, readdirSync } from 'fs';
import cluster from 'cluster';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import fmp from '@fastify/multipart';
import { randomBytes } from 'crypto';
import * as http from 'http';
import * as https from 'https';
import fastify from 'fastify';
import { fastifyStatic, ListRender } from '@fastify/static';
import { join, dirname } from 'path';
import rawbody from 'raw-body';

const renderDirList: ListRender = (dirs, files) => {
  const currDir = dirname((dirs[0] || files[0]).href);
  const parentDir = dirname(currDir);
  return `
    <head><title>Index of ${currDir}/</title></head>
    <html><body>
      <h1>Index of ${currDir}/</h1>
      <hr>
      <table style="width: max(450px, 50%);">
        <tr>
          <td>
            <a href="${parentDir}">../</a>
          </td>
          <td></td><td></td>
        </tr>
        ${dirs.map(
    (dir) =>
      `<tr>
              <td>
                <a href="${dir.href}">${dir.name}</a>
              </td>
              <td>
                ${dir.stats.ctime.toLocaleString()}
              </td>
              <td>
                -
              </td>
            </tr>`
  )}
        <br/>
        ${files.map(
    (file) =>
      `<tr>
              <td>
                <a href="${file.href}">${file.name}</a>
              </td>
              <td>
                ${file.stats.ctime.toLocaleString()}
              </td>
              <td>
                ${file.stats.size}
              </td>
            </tr>`
  )}
      </table>
      <hr>
    </body></html>
  `;
};

async function bootstrap() {
  http.globalAgent.maxSockets = Infinity;
  https.globalAgent.maxSockets = Infinity;

  const server = fastify({
    logger:
      process.env.FASTIFY_LOGGER === 'true'
        ? { level: process.env.FASTIFY_LOG_LEVEL || 'warn' }
        : false,
    trustProxy: true,
    onProtoPoisoning: 'ignore',
    https:
      process.env.NODE_ENV === 'production' &&
        process.env.USE_HTTPS === 'true'
        ? (() => {
          try {
            return {
              cert: readFileSync(
                '/etc/letsencrypt/live/demon-slayers.local/fullchain.pem'
              ),
              key: readFileSync(
                '/etc/letsencrypt/live/demon-slayers.local/privkey.pem'
              )
            };
          } catch (err) {
            console.warn(
              'HTTPS certificates not found, falling back to HTTP'
            );
            return null;
          }
        })()
        : null
  });

  /**
   * INTENTIONAL VULNERABILITY - PATH TRAVERSAL SIMULATION
   * 
   * This Fastify hook intercepts path traversal attempts BEFORE routes are processed.
   * This ensures traversal patterns are caught at the lowest level.
   * 
   * SAFETY: Returns HARDCODED fake /etc/passwd content - NO filesystem access.
   */
  const FAKE_ETC_PASSWD = `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
`;

  // Register hook to intercept path traversal attempts BEFORE Fastify normalizes URLs
  // This hook runs FIRST, before any route matching or URL normalization
  server.addHook('onRequest', async (request, reply) => {
    // Get raw URL from the HTTP request object BEFORE Fastify normalizes it
    // This is critical - Fastify normalizes ../ sequences, so we must check raw URL
    const rawUrl = request.raw.url || (request as any).url || '';
    const normalizedUrl = request.url || '';

    // Try to decode URL (may fail if already decoded)
    let decodedUrl = rawUrl;
    try {
      decodedUrl = decodeURIComponent(rawUrl);
    } catch (e) {
      decodedUrl = rawUrl;
    }

    // Also check normalized URL in case raw URL is not available
    const urlToCheck = rawUrl || normalizedUrl;

    // Path traversal patterns (case-insensitive)
    // Matches: ../, ..\, %2e%2e%2f, %2e%2e/, etc.
    const traversalPatterns = [
      /\.\.\//gi,           // ../
      /\.\.\\/gi,           // ..\
      /%2e%2e%2f/gi,        // %2e%2e%2f (encoded ../)
      /%2e%2e\//gi,         // %2e%2e/ (encoded ..)
      /%2e%2e%5c/gi,        // %2e%2e%5c (encoded ..\)
      /\.\.%2f/gi,          // ..%2f
      /\.\.%5c/gi,          // ..%5c
      /\.\.%252f/gi,        // Double encoded ..%2f
      /\.\.%252e/gi,        // Double encoded ..%2e
      /%252e%252e%252f/gi,  // Triple encoded
      /\.\.%2F/gi,          // ..%2F (uppercase)
      /%2E%2E%2F/gi,        // %2E%2E%2F (uppercase)
      /\.\.%5C/gi,          // ..%5C (uppercase backslash)
    ];

    // Check for traversal patterns in raw URL (before normalization)
    // Also check normalized URL in case it still contains patterns
    const hasTraversal = traversalPatterns.some(
      pattern => pattern.test(rawUrl) || pattern.test(decodedUrl) ||
        pattern.test(normalizedUrl) || pattern.test(urlToCheck)
    );

    // Check if requesting /etc/passwd (case-insensitive)
    // Check both raw and normalized URLs, and also check if normalized URL is /etc/passwd
    // (Fastify normalizes ../../etc/passwd to /etc/passwd)
    const isPasswdRequest =
      /passwd|etc[\/\\]passwd/gi.test(rawUrl) ||
      /passwd|etc[\/\\]passwd/gi.test(decodedUrl) ||
      /passwd|etc[\/\\]passwd/gi.test(normalizedUrl) ||
      /passwd|etc[\/\\]passwd/gi.test(urlToCheck) ||
      normalizedUrl.includes('/etc/passwd') ||
      normalizedUrl.includes('passwd') ||
      normalizedUrl === '/etc/passwd' ||
      rawUrl.includes('/etc/passwd') ||
      decodedUrl.includes('/etc/passwd') ||
      decodedUrl.includes('passwd');

    // ENHANCED: Also check if the request starts from root (/) with traversal
    // This catches cases like: /../../etc/passwd, /..%2F..%2Fetc%2Fpasswd, etc.
    const startsFromRoot = rawUrl.startsWith('/') || normalizedUrl.startsWith('/');
    const hasRootTraversal = startsFromRoot && (
      rawUrl.match(/^\/\.\./i) ||
      decodedUrl.match(/^\/\.\./i) ||
      normalizedUrl === '/etc/passwd' ||
      normalizedUrl.startsWith('/etc/')
    );

    // If traversal pattern detected AND requesting passwd, OR normalized URL is /etc/passwd,
    // OR root path with traversal to /etc/passwd, return fake content
    // Also check if normalized URL is exactly /etc/passwd (Fastify normalizes ../../etc/passwd to this)
    if ((hasTraversal && isPasswdRequest) ||
      normalizedUrl === '/etc/passwd' ||
      normalizedUrl.toLowerCase() === '/etc/passwd' ||
      (hasRootTraversal && isPasswdRequest) ||
      (normalizedUrl && normalizedUrl.includes('passwd'))) {
      reply.header('Content-Type', 'text/plain');
      reply.header('Content-Length', FAKE_ETC_PASSWD.length.toString());
      reply.status(200);
      reply.send(FAKE_ETC_PASSWD);
      return; // Stop request processing - don't call next handlers
    }
  });

  // INTENTIONAL VULNERABILITY - Direct route handlers for path traversal
  // These catch normalized URLs (Fastify normalizes ../../etc/passwd to /etc/passwd)
  // Registered here but will be re-registered after NestJS app creation to ensure proper order

  // NOTE: The onRequest hook above handles path traversal patterns
  // We don't need a server.get('*') route here as it would block normal routes
  // The setDefaultRoute below will serve index.html for all non-API routes

  server.setDefaultRoute((req, res) => {
    if (req.url && req.url.startsWith('/api')) {
      res.statusCode = 404;
      return res.end(
        JSON.stringify({
          success: false,
          error: {
            kind: 'user_input',
            message: 'Not Found'
          }
        })
      );
    }

    readFile(
      join(__dirname, '..', 'frontend', 'dist', 'index.html'),
      'utf8',
      (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end('Internal Server Error');
          return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(data);
      }
    );
  });

  // INTENTIONAL VULNERABILITY - Serve credentials.txt file directly
  // This simulates a common information leakage vulnerability where sensitive files are exposed
  server.get('/credentials.txt', async (request, reply) => {
    try {
      const fs = require('fs');
      const path = require('path');
      const credentialsPath = path.join(__dirname, '..', 'credentials.txt');
      const content = await fs.promises.readFile(credentialsPath, 'utf8');

      // Remove header and warning lines from content
      const lines = content.split('\n');
      const filteredLines = lines.filter(line => {
        const trimmed = line.trim();
        // Filter out header, warnings, and notes
        return !trimmed.includes('Demon Slayers - Vulnerable Training Lab') &&
          !trimmed.includes('===========================================') &&
          !trimmed.includes('This file contains credentials for security testing purposes') &&
          !trimmed.includes('WARNING: This is an intentional vulnerability') &&
          !trimmed.includes('Note: This file is intentionally exposed') &&
          !trimmed.includes('In a production environment') &&
          !trimmed.includes('Error reading file:');
      });

      reply.type('text/plain');
      reply.send(filteredLines.join('\n'));
    } catch (err) {
      // Fallback - return hardcoded credentials if file doesn't exist
      const fallbackContent = `User Credentials:
-----------------
Email: user@demonslayer.com
Password: user123
Role: people

Admin Credentials:
------------------
Email: admin@demonslayer.com
Password: admin123
Role: super_admin

Database Connection:
--------------------
Host: localhost
Port: 5432
Database: demon_slayers
User: postgres
Password: (check environment variables)

API Endpoints:
--------------
Login: POST /api/auth/login
Admin Status: GET /api/users/one/:email/adminpermission
User Search: GET /api/users/search/:name
Debug Info: GET /api/debug/info
Debug Users: GET /api/debug/users
Credentials API: GET /api/credentials

Session Configuration:
----------------------
Cookie Name: connect.sid
HttpOnly: false
Secure: false

JWT Configuration:
-------------------
Types: RSA, HMAC
Algorithm: RS256, HS256

Additional Demo Credentials:
-----------------------------
Hashira Account:
  Email: hashira@demonslayer.com
  Password: hashira123
  Role: hashira

Demon Slayer Corps Account:
  Email: corps@demonslayer.com
  Password: corps123
  Role: demon_slayer_corps`;
      reply.type('text/plain');
      reply.send(fallbackContent);
    }
  });

  await server.register(fastifyStatic, {
    root: join(__dirname, '..', 'frontend', 'dist'),
    prefix: `/`,
    decorateReply: false,
    redirect: false,
    wildcard: false,
    serveDotFiles: true
  });

  try {
    const vcsPath = join(__dirname, '..', 'frontend', 'vcs');
    if (readdirSync) {
      const vcsDirs = readdirSync(vcsPath);
      for (const dir of vcsDirs) {
        await server.register(fastifyStatic, {
          root: join(vcsPath, dir),
          prefix: `/.${dir}`,
          decorateReply: false,
          redirect: true,
          index: false,
          list: {
            format: 'html',
            render: renderDirList
          },
          serveDotFiles: true
        });
      }
    }
  } catch (err) {
    // VCS directory doesn't exist or can't be read - this is okay
    console.warn('VCS directory not found, skipping VCS file serving');
  }

  await server.register(fastifyStatic, {
    root: join(__dirname, '..', 'frontend', 'dist', 'vendor'),
    prefix: `/vendor`,
    decorateReply: false,
    redirect: true,
    index: false,
    list: {
      format: 'html',
      render: renderDirList
    },
    serveDotFiles: true
  });

  // INTENTIONAL VULNERABILITY - Register path traversal routes BEFORE NestJS app creation
  // Direct /etc/passwd route (catches normalized traversal: ../../etc/passwd → /etc/passwd)
  server.get('/etc/passwd', async (request, reply) => {
    reply.header('Content-Type', 'text/plain');
    reply.header('Content-Length', FAKE_ETC_PASSWD.length.toString());
    reply.status(200);
    reply.send(FAKE_ETC_PASSWD);
  });

  const app: NestFastifyApplication = await NestFactory.create(
    AppModule,
    new FastifyAdapter(server),
    {
      logger:
        process.env.NODE_ENV === 'production'
          ? ['error']
          : ['debug', 'log', 'warn', 'error']
    }
  );

  await server.register(fastifyCookie);
  await server.register(fmp);
  await server.register(session, {
    secret: randomBytes(32).toString('hex').slice(0, 32),
    cookieName: 'connect.sid',
    cookie: {
      secure: false,
      httpOnly: false
    }
  });
  server.addContentTypeParser('*', (req) => rawbody(req.raw));

  const httpAdapter = app.getHttpAdapter();

  app
    .useGlobalInterceptors(new HeadersConfiguratorInterceptor())
    .useGlobalFilters(new GlobalExceptionFilter(httpAdapter));

  const options = new DocumentBuilder()
    .setTitle('Demon Slayers')
    .setDescription(
      `
  ![DS logo](/assets/img/logo_blue_small.png)

  This is the _Demon Slayers_ REST API.

  _Demon Slayers_ is a benchmark application that uses modern technologies and implements a set of common security vulnerabilities.

  ## Available endpoints

  * [App](#/App%20controller) - common operations

  * [Auth](#/Auth%20controller) - operations with authentication methods

  * [User](#/User%20controller) - operations with users(creation, searching)

  * [Files](#/Files%20controller) - operations with files

  * [Subscriptions](#/Subscriptions%20controller) - operations with subscriptions

  * [Testimonials](#/Testimonials%20controller) - operations with testimonials

  * [Products](#/Products%20controller) — operations with products

  * [Partners](#/Partners%20controller) — operations with partners

  * [Emails](#/Emails%20controller) — operations with emails
  
  * [Chat](#/Chat%20controller) — operations with chat


  `
    )
    .setVersion('1.0')
    .addServer(process.env.URL)
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('swagger', app, document);

  // Add additional /swagger.json endpoint to serve the Swagger JSON
  server.get('/swagger.json', async (request, reply) => {
    reply.header('Content-Type', 'application/json');
    reply.send(document);
  });

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  await app.listen(port, '0.0.0.0');
}

if (cluster.isPrimary && process.env.NODE_ENV === 'production') {
  console.log(`Primary ${process.pid} is running`);

  const numCPUs = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} died with code ${code} and signal ${signal}`
    );
    console.log('Starting a new worker');
    cluster.fork();
  });
} else {
  bootstrap();
  console.log(`Worker ${process.pid} started`);
}
