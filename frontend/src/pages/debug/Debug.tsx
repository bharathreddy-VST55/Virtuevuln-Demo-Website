import { FC, useEffect } from 'react';
import Header from '../main/Header/Header';

/**
 * INTENTIONAL VULNERABILITY - DEBUG MODE SIMULATION
 * 
 * This debug page is intentionally vulnerable and displays fake debug information for training.
 * No real secrets, paths, or sensitive data are shown. All information displayed is HARDCODED FAKE data.
 * 
 * SAFETY GUARANTEES:
 * - All environment variables are FAKE
 * - All file paths are FAKE
 * - All SQL queries are FAKE
 * - All stack traces are FAKE
 * - No real secrets or credentials are exposed
 * - No real filesystem paths are shown
 * - No real database information is displayed
 */
export const Debug: FC = () => {
  // Debug: Log component mount
  useEffect(() => {
    try {
      console.log('=== DEBUG COMPONENT MOUNTED ===');
      console.log('Debug component is rendering');
      if (typeof window !== 'undefined') {
        console.log('Current pathname:', window.location.pathname);
      }
    } catch (err) {
      console.log('Debug component mounted (pathname check skipped)');
    }
  }, []);

  // All data below is HARDCODED FAKE data for simulation purposes only
  // Made to look realistic for security training
  const fakeEnvVars = [
    { key: 'NODE_ENV', value: 'development' },
    { key: 'APP_ENV', value: 'dev' },
    { key: 'DEBUG', value: '*' },
    { key: 'LOG_LEVEL', value: 'debug' },
    { key: 'DATABASE_HOST', value: 'db.demonslayer.internal' },
    { key: 'DATABASE_PORT', value: '5432' },
    { key: 'DATABASE_NAME', value: 'demonslayer_prod' },
    { key: 'DATABASE_USER', value: 'postgres' },
    { key: 'DATABASE_PASSWORD', value: 'P@ssw0rd123!@#' },
    { key: 'DATABASE_URL', value: 'postgresql://postgres:P@ssw0rd123!@#@db.demonslayer.internal:5432/demonslayer_prod' },
    { key: 'JWT_SECRET', value: 'super_secret_jwt_key_2024_demon_slayers' },
    { key: 'SESSION_SECRET', value: 'my_session_secret_key_do_not_share' },
    { key: 'API_SECRET_KEY', value: 'sk_live_51H8kL9mN3pQ7rS2tU5vW8xY1zA4bC6dE9fG' },
    { key: 'AWS_ACCESS_KEY_ID', value: 'AKIAIOSFODNN7EXAMPLE' },
    { key: 'AWS_SECRET_ACCESS_KEY', value: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY' },
    { key: 'REDIS_URL', value: 'redis://:redis_password_123@redis.demonslayer.internal:6379/0' },
    { key: 'MONGODB_URI', value: 'mongodb://admin:admin123@mongo.demonslayer.internal:27017/demonslayer?authSource=admin' },
    { key: 'STRIPE_SECRET_KEY', value: 'sk_live_51H8kL9mN3pQ7rS2tU5vW8xY1zA4bC6dE9fG2hI3jK4lM5nO6pQ' },
    { key: 'GITHUB_TOKEN', value: 'ghp_1234567890abcdefghijklmnopqrstuvwxyz' },
    { key: 'SLACK_WEBHOOK_URL', value: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX' },
  ];

  const fakeStackTraces = [
    {
      error: 'TypeError: Cannot read property "id" of undefined',
      stack: `TypeError: Cannot read property "id" of undefined
    at UserController.getUserById (/usr/src/app/controllers/user.js:45:12)
    at async /usr/src/app/routes/api.js:123:8
    at async /usr/src/app/middleware/auth.js:67:3
    at async /usr/src/app/server.js:234:5
    at async /usr/src/app/app.js:89:12`,
      file: '/usr/src/app/controllers/user.js',
      line: 45,
    },
    {
      error: 'DatabaseConnectionError: Connection timeout',
      stack: `DatabaseConnectionError: Connection timeout
    at Database.connect (/app/database/connection.js:78:15)
    at async /app/services/userService.js:34:2
    at async /app/routes/debug.js:12:8
    at async /app/middleware/errorHandler.js:45:6`,
      file: '/app/database/connection.js',
      line: 78,
    },
  ];

  const fakeSqlQueries = [
    {
      query: 'SELECT * FROM users WHERE id = ?',
      params: [123],
      time: '2.45ms',
    },
    {
      query: 'INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)',
      params: [456, 'fake_token_abc123', '2024-12-31 23:59:59'],
      time: '1.23ms',
    },
    {
      query: 'UPDATE users SET last_login = ? WHERE email = ?',
      params: ['2024-01-15 10:30:00', 'user@example.com'],
      time: '3.67ms',
    },
  ];

  const fakeFilePaths = [
    '/usr/src/app/server.js',
    '/app/routes/debug.js',
    '/app/controllers/user.js',
    '/app/middleware/auth.js',
    '/app/database/connection.js',
    '/app/services/userService.js',
    '/app/config/database.js',
    '/app/utils/logger.js',
  ];

  const fakeErrors = [
    {
      type: 'ValidationError',
      message: 'Invalid email format provided',
      timestamp: '2024-01-15 10:30:45',
    },
    {
      type: 'AuthenticationError',
      message: 'JWT token expired',
      timestamp: '2024-01-15 10:31:12',
    },
    {
      type: 'DatabaseError',
      message: 'Query execution failed: connection pool exhausted',
      timestamp: '2024-01-15 10:32:08',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', color: '#c9d1d9', width: '100%' }}>
      <Header onInnerPage={true} />
      <main id="main" style={{ paddingTop: '80px', background: '#0d1117', color: '#c9d1d9' }}>
        <section className="services" style={{ padding: '40px 0', minHeight: '500px', width: '100%', display: 'block' }}>
          <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 15px', width: '100%', display: 'block' }}>
            
            {/* Debug Header Banner - Made to look like real debug output */}
            <div style={{
              background: '#1a1a1a',
              border: '1px solid #444',
              padding: '15px 20px',
              borderRadius: '4px',
              marginBottom: '25px',
              color: '#ff6b6b',
              fontFamily: 'monospace',
              fontSize: '13px',
              display: 'block',
              visibility: 'visible'
            }}>
              <div style={{ color: '#ff6b6b', fontWeight: 'bold', marginBottom: '5px' }}>
                [DEBUG] Application running in development mode
              </div>
              <div style={{ color: '#888', fontSize: '12px' }}>
                Node.js v18.17.0 | Express.js Debug Mode Active | Stack traces enabled
              </div>
            </div>

            {/* Environment Variables Section */}
            <div style={{
              background: '#0d1117',
              padding: '20px',
              borderRadius: '4px',
              marginBottom: '25px',
              border: '1px solid #30363d',
              fontFamily: 'monospace'
            }}>
              <h2 style={{ color: '#58a6ff', marginTop: 0, marginBottom: '15px', fontSize: '18px', fontWeight: 'normal', borderBottom: '1px solid #30363d', paddingBottom: '10px' }}>
                Environment Variables
              </h2>
              <div style={{
                background: '#010409',
                padding: '15px',
                borderRadius: '3px',
                fontFamily: 'monospace',
                fontSize: '12px',
                overflowX: 'auto',
                border: '1px solid #21262d'
              }}>
                {fakeEnvVars.map((env, index) => (
                  <div key={index} style={{ marginBottom: '6px', color: '#c9d1d9', lineHeight: '1.6' }}>
                    <span style={{ color: '#79c0ff' }}>{env.key}</span>
                    <span style={{ color: '#8b949e' }}>=</span>
                    <span style={{ color: '#a5d6ff' }}>"{env.value}"</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stack Traces Section */}
            <div style={{
              background: '#0d1117',
              padding: '20px',
              borderRadius: '4px',
              marginBottom: '25px',
              border: '1px solid #30363d',
              fontFamily: 'monospace'
            }}>
              <h2 style={{ color: '#f85149', marginTop: 0, marginBottom: '15px', fontSize: '18px', fontWeight: 'normal', borderBottom: '1px solid #30363d', paddingBottom: '10px' }}>
                Recent Stack Traces
              </h2>
              {fakeStackTraces.map((trace, index) => (
                <div key={index} style={{
                  background: '#161b22',
                  padding: '12px',
                  borderRadius: '3px',
                  marginBottom: '12px',
                  borderLeft: '3px solid #f85149',
                  border: '1px solid #30363d'
                }}>
                  <div style={{ color: '#f85149', fontWeight: 'bold', marginBottom: '8px', fontSize: '13px' }}>
                    Error: {trace.error}
                  </div>
                  <div style={{
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    color: '#8b949e',
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.5',
                    background: '#010409',
                    padding: '10px',
                    borderRadius: '3px',
                    border: '1px solid #21262d'
                  }}>
                    {trace.stack}
                  </div>
                  <div style={{ marginTop: '8px', fontSize: '11px', color: '#6e7681' }}>
                    at <span style={{ color: '#79c0ff' }}>{trace.file}</span>:<span style={{ color: '#79c0ff' }}>{trace.line}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* SQL Queries Section */}
            <div style={{
              background: '#0d1117',
              padding: '20px',
              borderRadius: '4px',
              marginBottom: '25px',
              border: '1px solid #30363d',
              fontFamily: 'monospace'
            }}>
              <h2 style={{ color: '#a5d6ff', marginTop: 0, marginBottom: '15px', fontSize: '18px', fontWeight: 'normal', borderBottom: '1px solid #30363d', paddingBottom: '10px' }}>
                SQL Query Log
              </h2>
              {fakeSqlQueries.map((sql, index) => (
                <div key={index} style={{
                  background: '#161b22',
                  padding: '12px',
                  borderRadius: '3px',
                  marginBottom: '12px',
                  border: '1px solid #30363d'
                }}>
                  <div style={{
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    color: '#79c0ff',
                    marginBottom: '8px',
                    background: '#010409',
                    padding: '8px',
                    borderRadius: '3px',
                    border: '1px solid #21262d'
                  }}>
                    {sql.query}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6e7681', marginBottom: '4px' }}>
                    params: <span style={{ color: '#a5d6ff' }}>{JSON.stringify(sql.params)}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#6e7681' }}>
                    exec_time: <span style={{ color: '#3fb950' }}>{sql.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* File Paths Section */}
            <div style={{
              background: '#0d1117',
              padding: '20px',
              borderRadius: '4px',
              marginBottom: '25px',
              border: '1px solid #30363d',
              fontFamily: 'monospace'
            }}>
              <h2 style={{ color: '#79c0ff', marginTop: 0, marginBottom: '15px', fontSize: '18px', fontWeight: 'normal', borderBottom: '1px solid #30363d', paddingBottom: '10px' }}>
                Application File Structure
              </h2>
              <div style={{
                background: '#010409',
                padding: '15px',
                borderRadius: '3px',
                fontFamily: 'monospace',
                fontSize: '12px',
                border: '1px solid #21262d'
              }}>
                {fakeFilePaths.map((path, index) => (
                  <div key={index} style={{ marginBottom: '4px', color: '#c9d1d9', lineHeight: '1.6' }}>
                    <span style={{ color: '#79c0ff' }}>{path}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Error Messages Section */}
            <div style={{
              background: '#0d1117',
              padding: '20px',
              borderRadius: '4px',
              marginBottom: '25px',
              border: '1px solid #30363d',
              fontFamily: 'monospace'
            }}>
              <h2 style={{ color: '#f85149', marginTop: 0, marginBottom: '15px', fontSize: '18px', fontWeight: 'normal', borderBottom: '1px solid #30363d', paddingBottom: '10px' }}>
                Error Log
              </h2>
              {fakeErrors.map((error, index) => (
                <div key={index} style={{
                  background: '#161b22',
                  padding: '12px',
                  borderRadius: '3px',
                  marginBottom: '12px',
                  borderLeft: '3px solid #f85149',
                  border: '1px solid #30363d'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: '#f85149', fontWeight: 'bold', fontSize: '12px' }}>
                      [{error.type}]
                    </span>
                    <span style={{ color: '#6e7681', fontSize: '11px' }}>
                      {error.timestamp}
                    </span>
                  </div>
                  <div style={{ color: '#c9d1d9', fontSize: '12px' }}>
                    {error.message}
                  </div>
                </div>
              ))}
            </div>

            {/* Hidden Security Note - Small and unobtrusive */}
            <div style={{
              background: '#161b22',
              border: '1px solid #30363d',
              padding: '10px',
              borderRadius: '3px',
              marginTop: '30px',
              color: '#6e7681',
              fontSize: '10px',
              fontFamily: 'monospace',
              textAlign: 'center'
            }}>
              [DEBUG MODE] This page is for development purposes only. Do not expose in production.
            </div>

          </div>
        </section>
      </main>
    </div>
  );
};

export default Debug;

