# Safe Reproduction Steps for Vulnerabilities

## ⚠️ IMPORTANT SAFETY NOTICE

**These steps are for educational purposes in a controlled lab environment only.**

- Only test in isolated, offline environments
- Never test against production systems
- Do not use these techniques maliciously
- All testing should be done with proper authorization

## General Preconditions

Before testing any vulnerability:

1. Start the application using Docker Compose:
   ```bash
   docker compose --file=compose.local.yml up -d
   ```

2. Wait for all services to be healthy (check with `docker compose ps`)

3. Access the application at `http://localhost:3000`

4. Use a web browser or HTTP client (curl, Postman, Burp Suite) for testing

5. Use an intercepting proxy (Burp Suite, OWASP ZAP) to observe requests/responses

---

## 1. SQL Injection

### Affected Routes
- `/api/testimonials/count?query=...`
- `/api/products/views` (via `x-product-name` header)

### Preconditions
- Application running and accessible
- Database initialized with test data

### Reproduction Steps

#### Test 1: Time-Based SQL Injection
1. Open a web browser or HTTP client
2. Navigate to or send a GET request to:
   ```
   http://localhost:3000/api/testimonials/count?query=;SELECT PG_SLEEP(5)--
   ```
3. Observe the response time
4. Compare with a normal request (without the sleep command)

**Expected Evidence**: The request takes approximately 5 seconds longer than a normal request, indicating SQL execution.

#### Test 2: Information Disclosure
1. Send a GET request with a SQL query to extract schema information:
   ```
   http://localhost:3000/api/testimonials/count?query=SELECT COUNT(table_name) FROM information_schema.tables
   ```
2. Observe the response

**Expected Evidence**: The response contains a number representing the count of tables in the database schema.

#### Test 3: Header-Based SQL Injection
1. Send a GET request to `/api/products/views`
2. Include a header: `x-product-name: Opal'`
3. Observe the error response

**Expected Evidence**: The error message reveals SQL syntax and may include file path information.

### Recommended Remediation
- Use parameterized queries or ORM methods
- Validate and sanitize all input
- Implement input length limits
- See `docs/SECURITY.md` for code examples

---

## 2. Cross-Site Scripting (XSS)

### Affected Routes
- Landing page (`/?__dummy=...` or `/?maptitle=...`)
- `/api/testimonials/count?query=...`
- `/api/testimonials` (POST - stored XSS)
- `/api/subscriptions?email=...` (DOM XSS)
- `/api/metadata` (POST with XML/SVG)

### Preconditions
- Application running
- User authentication may be required for some endpoints

### Reproduction Steps

#### Test 1: Reflected XSS via Query Parameter
1. Open a web browser
2. Navigate to:
   ```
   http://localhost:3000/?__dummy=<script>alert('XSS')</script>
   ```
3. Observe the page behavior

**Expected Evidence**: A JavaScript alert dialog appears, or the script executes in the browser console.

#### Test 2: Stored XSS via Testimonials
1. Authenticate as a user
2. Navigate to the marketplace page
3. Submit a testimonial form with HTML/script content in the message field
4. View the testimonials section

**Expected Evidence**: The submitted script executes when the testimonials are displayed.

#### Test 3: DOM-Based XSS
1. Navigate to the landing page
2. Find the email subscription form
3. Enter HTML/script content in the email field
4. Submit the form
5. Observe the page response

**Expected Evidence**: The server response includes the script, which is then executed in the DOM.

### Recommended Remediation
- Encode all output (HTML, JavaScript, URL encoding)
- Use Content Security Policy (CSP)
- Sanitize user input before storage
- Use framework's built-in escaping (React escapes by default)

---

## 3. Local File Inclusion (LFI)

### Affected Routes
- `/api/file?path=...`
- `/api/file/raw?path=...`

### Preconditions
- Application running
- Access to file system (for testing)

### Reproduction Steps

#### Test 1: Access System Files
1. Send a GET request:
   ```
   http://localhost:3000/api/file/raw?path=/etc/hosts
   ```
2. Observe the response

**Expected Evidence**: The response contains the contents of `/etc/hosts` file, revealing internal network configuration.

#### Test 2: Path Traversal
1. Send a GET request with path traversal:
   ```
   http://localhost:3000/api/file?path=../../etc/passwd
   ```
2. Observe the response

**Expected Evidence**: The response may contain file contents from outside the intended directory.

### Recommended Remediation
- Implement path validation and whitelisting
- Use database to map IDs to safe file paths
- Validate file extensions
- Run application with minimal file system permissions

---

## 4. Server-Side Request Forgery (SSRF)

### Affected Routes
- `/api/file?path=...`

### Preconditions
- Application running
- Network access (for external requests)

### Reproduction Steps

#### Test 1: External Resource Access
1. Send a GET request:
   ```
   http://localhost:3000/api/file?path=https://httpbin.org/get
   ```
2. Observe the response

**Expected Evidence**: The response contains JSON data from the external service, demonstrating the server can make outbound requests.

#### Test 2: Internal Network Access
1. Send a GET request to an internal metadata endpoint:
   ```
   http://localhost:3000/api/file?path=http://169.254.169.254/latest/meta-data/
   ```
   (Note: This may not work in all environments, but demonstrates the vulnerability)

**Expected Evidence**: If successful, the response contains internal metadata, potentially exposing sensitive cloud infrastructure information.

### Recommended Remediation
- Whitelist allowed hosts
- Block private/internal IP ranges
- Validate URLs before making requests
- Implement request timeouts and size limits

---

## 5. OS Command Injection

### Affected Routes
- `/api/spawn?command=...`
- GraphQL: `getCommandResult` query

### Preconditions
- Application running
- Access to system commands (for testing)

### Reproduction Steps

#### Test 1: Basic Command Execution
1. Send a GET request:
   ```
   http://localhost:3000/api/spawn?command=uname -a
   ```
2. Observe the response

**Expected Evidence**: The response contains the output of the `uname -a` command, showing system information.

#### Test 2: File System Access
1. Send a GET request:
   ```
   http://localhost:3000/api/spawn?command=ls -la /home
   ```
2. Observe the response

**Expected Evidence**: The response contains directory listing, demonstrating file system access.

### Recommended Remediation
- Avoid command execution entirely when possible
- Use application-level APIs instead of shell commands
- If necessary, use whitelist of allowed commands
- Validate and sanitize all parameters
- Run with minimal system permissions

---

## 6. Broken JWT Authentication

### Affected Routes
- `/api/auth/login`
- All protected endpoints using JWT

### Preconditions
- Application running
- Understanding of JWT structure

### Reproduction Steps

#### Test 1: None Algorithm Bypass
1. Obtain a valid JWT token from login
2. Decode the JWT (using online tools or libraries)
3. Modify the header to use algorithm "none"
4. Remove the signature
5. Use the modified token in an Authorization header
6. Access a protected endpoint

**Expected Evidence**: The request succeeds despite the invalid signature, demonstrating the vulnerability.

#### Test 2: Invalid Signature
1. Obtain a valid JWT token
2. Modify the signature to any random value
3. Use the modified token in an Authorization header
4. Access a protected endpoint

**Expected Evidence**: The request succeeds, showing signature validation is not properly enforced.

### Recommended Remediation
- Enforce strict algorithm validation
- Always verify signatures
- Use strong, random secrets
- Validate issuer, audience, and expiration
- Implement token blacklisting for revoked tokens

---

## 7. Insecure File Upload

### Affected Routes
- `/api/users/one/{email}/photo` (PUT)

### Preconditions
- Application running
- User authentication required

### Reproduction Steps

#### Test 1: Upload Non-Image File
1. Authenticate as a user
2. Send a PUT request to `/api/users/one/{email}/photo`
3. Upload a file with an image extension but non-image content (e.g., `.exe` file renamed to `.jpg`)
4. Observe the response

**Expected Evidence**: The upload succeeds without validation, and the file is stored on the server.

#### Test 2: Upload Large File
1. Attempt to upload a file exceeding reasonable size limits
2. Observe the response

**Expected Evidence**: The upload may succeed without size validation.

### Recommended Remediation
- Validate file type by content (magic bytes), not extension
- Implement file size limits
- Scan files for malware
- Store files outside web root
- Generate random filenames

---

## 8. Mass Assignment / Privilege Escalation

### Affected Routes
- `/api/users/basic` (POST)
- `/api/users/one/{email}/info` (PUT)

### Preconditions
- Application running
- User registration/update functionality

### Reproduction Steps

#### Test 1: Create User with Admin Privileges
1. Send a POST request to `/api/users/basic` with user data
2. Include a hidden field: `"isAdmin": true` in the request body
3. Complete user registration
4. Verify admin status via `/api/users/one/{email}/adminpermission`

**Expected Evidence**: The user is created with admin privileges despite not being authorized to set this field.

#### Test 2: Update User to Admin
1. Authenticate as a regular user
2. Send a PUT request to `/api/users/one/{email}/info`
3. Include `"isAdmin": true` in the request body
4. Verify admin status

**Expected Evidence**: The user's admin status is updated, allowing privilege escalation.

### Recommended Remediation
- Use whitelist of allowed fields for mass assignment
- Explicitly map request fields to model properties
- Implement role-based access control (RBAC)
- Validate user permissions before allowing field updates

---

## 9. Cross-Site Request Forgery (CSRF)

### Affected Routes
- Email subscription forms
- Testimonial submission forms
- User update forms

### Preconditions
- Application running
- Understanding of CSRF attack vectors

### Reproduction Steps

#### Test 1: Missing CSRF Token
1. Inspect a form submission (e.g., email subscription)
2. Check if a CSRF token is present in the form or request
3. Attempt to submit the form from an external site

**Expected Evidence**: The form can be submitted without a CSRF token, and the request succeeds.

#### Test 2: Permissive CORS
1. Send a request from a browser console on a different origin
2. Include credentials in the request
3. Observe CORS headers in the response

**Expected Evidence**: The response includes `Access-Control-Allow-Origin: *`, allowing requests from any origin.

### Recommended Remediation
- Implement CSRF tokens for state-changing operations
- Use SameSite cookie attribute
- Configure strict CORS policy
- Validate Origin header

---

## 10. Information Disclosure

### Affected Routes
- `/api/config`
- `/api/secrets`
- Error messages

### Preconditions
- Application running

### Reproduction Steps

#### Test 1: Configuration Exposure
1. Send a GET request to `/api/config`
2. Observe the response

**Expected Evidence**: The response contains database connection strings, API keys, and other sensitive configuration.

#### Test 2: Secrets Endpoint
1. Send a GET request to `/api/secrets`
2. Observe the response

**Expected Evidence**: The response contains various API keys, tokens, and credentials.

#### Test 3: Error Message Disclosure
1. Trigger an error (e.g., SQL injection with invalid syntax)
2. Observe the error response

**Expected Evidence**: The error message reveals internal file paths, SQL queries, or stack traces.

### Recommended Remediation
- Remove or restrict access to configuration endpoints
- Use environment variables for secrets
- Implement generic error messages in production
- Log detailed errors server-side only
- Use secrets management systems

---

## 11. XPATH Injection

### Affected Routes
- `/api/partners/partnerLogin`
- `/api/partners/searchPartners`
- `/api/partners/query`

### Preconditions
- Application running
- Partner data in XML format

### Reproduction Steps

#### Test 1: Boolean-Based XPATH Injection
1. Send a GET request to `/api/partners/partnerLogin`
2. Use a payload like: `?user=anyuser&password=' or '1'='1`
3. Observe the response

**Expected Evidence**: The response contains data for multiple users, demonstrating the XPATH injection bypasses authentication.

#### Test 2: String Detection
1. Send a GET request to `/api/partners/searchPartners`
2. Use a payload like: `?query=')] | //password%00//`
3. Observe the response

**Expected Evidence**: The response may contain password information or other sensitive data.

### Recommended Remediation
- Use parameterized XPATH queries
- Validate and sanitize XPATH input
- Use application-level data access instead of XPATH when possible
- Implement input validation and whitelisting

---

## 12. Prototype Pollution

### Affected Routes
- `/marketplace?__proto__[key]=value`
- `/api/email/sendSupportEmail?__proto__[key]=value`

### Preconditions
- Application running
- Understanding of JavaScript prototype chain

### Reproduction Steps

#### Test 1: Client-Side Prototype Pollution
1. Navigate to `/marketplace?__proto__[TestKey]=TestValue`
2. Open browser developer console
3. Check `Object.TestKey`

**Expected Evidence**: The property `TestKey` exists on the Object prototype, demonstrating prototype pollution.

#### Test 2: Server-Side Prototype Pollution
1. Send a GET request to `/api/email/sendSupportEmail`
2. Include `__proto__[status]=222` in query parameters
3. Observe the response

**Expected Evidence**: The response status or behavior is affected by the prototype pollution.

### Recommended Remediation
- Use `Object.create(null)` for user-controlled objects
- Validate object keys (reject `__proto__`, `constructor`, `prototype`)
- Use Map instead of plain objects for user data
- Implement input sanitization for object keys

---

## Testing Tools Recommendations

For comprehensive testing:

1. **Burp Suite** - Intercept and modify HTTP requests
2. **OWASP ZAP** - Automated security scanning
3. **Postman** - API testing and request construction
4. **Browser DevTools** - Inspect network traffic and console
5. **SQLMap** - Automated SQL injection testing (use with caution)
6. **JWT.io** - JWT token inspection and modification

## General Testing Workflow

1. **Reconnaissance**: Map all endpoints and functionality
2. **Input Testing**: Test all user inputs with various payloads
3. **Authentication Testing**: Test authentication and authorization
4. **Error Handling**: Trigger errors and observe responses
5. **Configuration Review**: Check for exposed configuration/secrets
6. **Dependency Scanning**: Check for known vulnerabilities in dependencies

## After Testing

1. Document all findings
2. Verify fixes using the same test cases
3. Implement automated security tests
4. Regular security audits
5. Keep dependencies updated

