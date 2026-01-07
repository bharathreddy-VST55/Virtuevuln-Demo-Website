# Security Documentation

## ⚠️ CRITICAL WARNING

**This repository intentionally contains insecure code for security training purposes only.**

- **DO NOT** deploy this application to production
- **DO NOT** expose this application to the public internet
- **ONLY** use in isolated, offline lab environments
- All vulnerabilities are intentional and documented for educational purposes

## Vulnerability Summary

| Vulnerability | Severity | Affected Route/File | Description |
|--------------|----------|---------------------|-------------|
| SQL Injection | Critical | `/api/testimonials/count`, `/api/products/views` | Unsanitized SQL queries in query parameters and headers |
| Broken JWT Authentication | Critical | `/api/auth/login`, JWT validation | Multiple JWT bypass techniques (None algorithm, RSA to HMAC, invalid signature, KID manipulation, etc.) |
| Cross-Site Scripting (XSS) | High | Multiple endpoints | Reflected, stored, and DOM-based XSS vulnerabilities |
| Local File Inclusion (LFI) | High | `/api/file`, `/api/file/raw` | Unrestricted file access via path parameter |
| Server-Side Request Forgery (SSRF) | High | `/api/file` | Ability to make requests to internal/external resources |
| OS Command Injection | Critical | `/api/spawn`, GraphQL `getCommandResult` | Direct command execution via query parameters |
| Server-Side Template Injection (SSTI) | Critical | `/api/render` | doT template engine allows code execution |
| XML External Entity (XXE) | High | `/api/metadata` | XML processing with external entities enabled |
| Insecure File Upload | High | `/api/users/one/{email}/photo` | No validation on uploaded files |
| Broken Authentication | High | `/api/auth/login` | Weak passwords, brute force vulnerable |
| Insecure Direct Object Reference (IDOR) | Medium | `/api/users/id/:id` | User enumeration without authentication |
| Mass Assignment | High | `/api/users/basic`, `/api/users/one/{email}/info` | Hidden fields allow privilege escalation |
| Cross-Site Request Forgery (CSRF) | Medium | Multiple forms | Missing CSRF tokens, permissive CORS |
| Insecure CORS | Medium | All API endpoints | `Access-Control-Allow-Origin: *` |
| Cookie Security | Medium | Session cookies | Missing `Secure` and `HttpOnly` flags |
| Open Redirect | Low | `/api/goto` | Unvalidated redirects |
| Information Disclosure | Medium | Multiple endpoints | Exposed secrets, config, database strings, file paths |
| XPATH Injection | High | `/api/partners/*` | Unsanitized XPATH queries |
| Prototype Pollution | Medium | `/marketplace`, `/api/email/sendSupportEmail` | Client and server-side prototype pollution |
| Email Injection | Medium | `/api/email/sendSupportEmail` | Email header injection |
| Insecure Output Handling | High | `/chat` | LLM responses not sanitized |

## Remediation Guidance

### 1. SQL Injection

**Problem**: Direct string concatenation in SQL queries.

**Secure Pattern**:
```typescript
// BAD: String concatenation
const query = `SELECT * FROM users WHERE email = '${email}'`;

// GOOD: Parameterized queries
const result = await db.query(
  'SELECT * FROM users WHERE email = ?',
  [email]
);

// Using ORM (MikroORM)
const user = await em.findOne(User, { email });
```

**Additional Measures**:
- Use ORM query builders exclusively
- Validate and sanitize all input
- Implement input length limits
- Use prepared statements
- Enable database query logging for monitoring

### 2. Broken JWT Authentication

**Problem**: JWT validation accepts multiple bypass techniques.

**Secure Pattern**:
```typescript
// BAD: Accepting "none" algorithm
const decoded = jwt.verify(token, secret, { algorithms: ['HS256', 'none'] });

// GOOD: Strict algorithm validation
const decoded = jwt.verify(token, secret, { 
  algorithms: ['HS256'], // Only allow specific algorithms
  issuer: 'your-app',
  audience: 'your-audience'
});

// Validate KID against whitelist
if (!allowedKids.includes(decoded.header.kid)) {
  throw new Error('Invalid KID');
}
```

**Additional Measures**:
- Use strong, random secrets (minimum 256 bits)
- Implement token expiration and refresh tokens
- Validate issuer, audience, and expiration
- Use HTTPS only
- Implement rate limiting on authentication endpoints

### 3. Cross-Site Scripting (XSS)

**Problem**: User input reflected/stored without sanitization.

**Secure Pattern**:
```typescript
// BAD: Direct HTML injection
res.send(`<div>${userInput}</div>`);

// GOOD: Output encoding
import { escape } from 'html-escaper';
res.send(`<div>${escape(userInput)}</div>`);

// For React (already safe by default)
<div>{userInput}</div> // React escapes automatically

// For dangerouslySetInnerHTML (avoid if possible)
<div dangerouslySetInnerHTML={{ __html: sanitize(userInput) }} />
```

**Additional Measures**:
- Implement Content Security Policy (CSP)
- Use framework's built-in escaping
- Sanitize HTML with libraries like DOMPurify
- Validate and encode all user input
- Use HTTP-only cookies for sensitive data

### 4. Local File Inclusion (LFI) / Path Traversal

**Problem**: Unrestricted file path access.

**Secure Pattern**:
```typescript
// BAD: Direct path usage
const file = fs.readFileSync(userProvidedPath);

// GOOD: Path validation and whitelisting
import path from 'path';

const allowedBaseDir = path.resolve('/safe/directory');
const requestedPath = path.resolve(allowedBaseDir, userPath);
const normalizedPath = path.normalize(requestedPath);

if (!normalizedPath.startsWith(allowedBaseDir)) {
  throw new Error('Path traversal detected');
}

const file = fs.readFileSync(normalizedPath);
```

**Additional Measures**:
- Use whitelist of allowed files/directories
- Validate file extensions
- Use database to map IDs to file paths
- Implement file access logging
- Run application with minimal file system permissions

### 5. Server-Side Request Forgery (SSRF)

**Problem**: Ability to make requests to arbitrary URLs.

**Secure Pattern**:
```typescript
// BAD: Direct URL usage
const response = await axios.get(userProvidedUrl);

// GOOD: URL validation and whitelisting
const allowedHosts = ['trusted-api.example.com'];
const url = new URL(userProvidedUrl);

if (!allowedHosts.includes(url.hostname)) {
  throw new Error('Host not allowed');
}

// Block internal IPs
const isInternal = /^(127\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)/.test(url.hostname);
if (isInternal) {
  throw new Error('Internal IPs not allowed');
}

const response = await axios.get(url.toString(), {
  timeout: 5000,
  maxRedirects: 0
});
```

**Additional Measures**:
- Whitelist allowed hosts
- Block private/internal IP ranges
- Use DNS resolution validation
- Implement request timeouts
- Disable redirects or validate redirect targets

### 6. OS Command Injection

**Problem**: User input directly executed as system commands.

**Secure Pattern**:
```typescript
// BAD: Direct command execution
exec(userInput);

// GOOD: Use safe APIs instead
// Instead of shell commands, use library functions
import { readFile } from 'fs/promises';
const data = await readFile(filePath);

// If commands are necessary, use parameterized execution
import { spawn } from 'child_process';
const process = spawn('ls', ['-la', sanitizedPath], {
  stdio: 'pipe'
});
```

**Additional Measures**:
- Avoid command execution entirely when possible
- Use application-level APIs instead of shell commands
- If necessary, use whitelist of allowed commands
- Validate and sanitize all parameters
- Run with minimal system permissions

### 7. Server-Side Template Injection (SSTI)

**Problem**: User input processed by template engine.

**Secure Pattern**:
```typescript
// BAD: User input in templates
const template = doT.template(userInput);

// GOOD: Separate data from templates
const template = doT.template('Hello {{=it.name}}');
const result = template({ name: sanitize(userInput) });
```

**Additional Measures**:
- Never allow user input in template strings
- Use sandboxed template engines
- Validate template syntax before rendering
- Implement template caching
- Consider using JSON templates instead

### 8. XML External Entity (XXE)

**Problem**: XML processing with external entities enabled.

**Secure Pattern**:
```typescript
// BAD: Default XML parsing
const doc = libxmljs.parseXmlString(xmlString);

// GOOD: Disable external entities
const doc = libxmljs.parseXmlString(xmlString, {
  noent: false,      // Disable external entities
  noblanks: true,
  recover: false
});
```

**Additional Measures**:
- Disable external entity processing
- Use JSON or YAML instead of XML when possible
- Validate XML against strict schemas
- Implement XML size limits
- Use whitelist of allowed XML elements

### 9. Insecure File Upload

**Problem**: No validation on uploaded files.

**Secure Pattern**:
```typescript
// GOOD: Comprehensive file validation
import { fileTypeFromBuffer } from 'file-type';

const allowedMimeTypes = ['image/jpeg', 'image/png'];
const maxFileSize = 5 * 1024 * 1024; // 5MB

if (file.size > maxFileSize) {
  throw new Error('File too large');
}

const fileType = await fileTypeFromBuffer(file.buffer);
if (!fileType || !allowedMimeTypes.includes(fileType.mime)) {
  throw new Error('Invalid file type');
}

// Generate safe filename
const safeFilename = `${uuidv4()}.${fileType.ext}`;
const filePath = path.join(uploadDir, safeFilename);

await fs.writeFile(filePath, file.buffer);
```

**Additional Measures**:
- Validate file type by content (magic bytes), not extension
- Implement file size limits
- Scan files for malware
- Store files outside web root
- Generate random filenames
- Implement virus scanning

### 10. Cookie Security

**Problem**: Missing security flags on cookies.

**Secure Pattern**:
```typescript
// BAD: Insecure cookies
cookie: {
  secure: false,
  httpOnly: false
}

// GOOD: Secure cookies
cookie: {
  secure: true,        // HTTPS only
  httpOnly: true,      // No JavaScript access
  sameSite: 'strict',  // CSRF protection
  maxAge: 3600000,     // Expiration
  path: '/',
  domain: 'yourdomain.com'
}
```

### 11. CORS Configuration

**Problem**: Permissive CORS policy.

**Secure Pattern**:
```typescript
// BAD: Allow all origins
app.enableCors({
  origin: '*'
});

// GOOD: Whitelist specific origins
app.enableCors({
  origin: ['https://trusted-app.com', 'https://admin.trusted-app.com'],
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
});
```

### 12. Input Validation

**General Principles**:
```typescript
// Validate all input
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(100),
  age: z.number().int().min(0).max(120)
});

const validated = userSchema.parse(userInput);
```

## Docker/Container Hardening

### Security Best Practices

1. **Run as Non-Root User**
   ```dockerfile
   USER node
   ```

2. **Use Minimal Base Images**
   ```dockerfile
   FROM node:18-alpine  # Alpine is smaller and has fewer attack surfaces
   ```

3. **Limit Container Capabilities**
   ```yaml
   services:
     app:
       cap_drop:
         - ALL
       cap_add:
         - NET_BIND_SERVICE
   ```

4. **Use Read-Only Filesystems**
   ```yaml
   services:
     app:
       read_only: true
       tmpfs:
         - /tmp
         - /var/cache
   ```

5. **Secrets Management**
   ```yaml
   # Use Docker secrets or environment variables (not hardcoded)
   services:
     app:
       secrets:
         - db_password
       environment:
         - DB_PASSWORD_FILE=/run/secrets/db_password
   ```

6. **Network Isolation**
   ```yaml
   networks:
     frontend:
       driver: bridge
     backend:
       driver: bridge
       internal: true  # No external access
   ```

7. **Resource Limits**
   ```yaml
   services:
     app:
       deploy:
         resources:
           limits:
             cpus: '1.0'
             memory: 512M
   ```

8. **Regular Updates**
   - Keep base images updated
   - Scan images for vulnerabilities
   - Use automated update tools (Watchtower) with caution

## Secure Configuration Checklist

- [ ] Enable HTTPS/TLS
- [ ] Set secure cookie flags (`Secure`, `HttpOnly`, `SameSite`)
- [ ] Implement Content Security Policy (CSP)
- [ ] Set `X-Frame-Options: DENY`
- [ ] Set `X-Content-Type-Options: nosniff`
- [ ] Configure strict CORS whitelist
- [ ] Implement strong password policies
- [ ] Disable debug mode in production
- [ ] Disable directory listing
- [ ] Remove default credentials
- [ ] Implement rate limiting
- [ ] Enable request logging and monitoring
- [ ] Use parameterized queries everywhere
- [ ] Validate and sanitize all input
- [ ] Implement proper error handling (no information disclosure)
- [ ] Use secrets management (no hardcoded secrets)
- [ ] Run containers as non-root
- [ ] Limit container capabilities
- [ ] Use read-only filesystems where possible
- [ ] Implement network segmentation
- [ ] Regular security audits and dependency updates

## Testing Security Fixes

After implementing fixes:

1. **Input Validation**: Submit unexpected input - should return validation errors, not internal errors
2. **SQL Injection**: Attempt SQL injection - should be sanitized or rejected
3. **XSS**: Submit script tags - should be escaped in output
4. **Authentication**: Test JWT bypass attempts - should all be rejected
5. **File Access**: Attempt path traversal - should be blocked
6. **CORS**: Test from unauthorized origins - should be blocked
7. **Cookies**: Inspect cookies - should have security flags set

Use automated security scanning tools (OWASP ZAP, Burp Suite, etc.) to verify fixes.

