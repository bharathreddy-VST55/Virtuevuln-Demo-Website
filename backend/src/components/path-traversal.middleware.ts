/**
 * INTENTIONAL VULNERABILITY - PATH TRAVERSAL SIMULATION
 * 
 * This middleware simulates a path traversal vulnerability for security testing purposes.
 * 
 * IMPORTANT SAFETY NOTES:
 * - This is a SIMULATED vulnerability - it does NOT access the real filesystem
 * - All file content returned is HARDCODED and FAKE
 * - No actual file system operations are performed
 * - This is safe for use in training/testing environments
 * 
 * SECURITY TESTING PURPOSE:
 * - Allows security scanners (like Nuclei) to detect path traversal patterns
 * - Returns realistic-looking fake /etc/passwd content
 * - Demonstrates how path traversal attacks work without actual risk
 * 
 * DETECTION PATTERNS:
 * - Detects: ../, ..\, %2e%2e, %2e%2f, %2e%2e%2f, etc.
 * - Detects: /etc/passwd, /etc/shadow, etc. in traversal paths
 * - Works with URL encoded and non-encoded patterns
 */

import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';

// FAKE /etc/passwd content - HARDCODED, NOT from filesystem
const FAKE_ETC_PASSWD = `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
`;

@Injectable()
export class PathTraversalMiddleware implements NestMiddleware {
  /**
   * Detects path traversal patterns in the request URL
   * Returns true if any traversal pattern is detected
   */
  private detectTraversalPattern(url: string): boolean {
    if (!url) return false;

    // Decode URL to catch encoded patterns
    const decodedUrl = decodeURIComponent(url);
    
    // Common path traversal patterns (case-insensitive)
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

    // Check for traversal patterns
    for (const pattern of traversalPatterns) {
      if (pattern.test(url) || pattern.test(decodedUrl)) {
        return true;
      }
    }

    // Check for common sensitive files in traversal context
    const sensitiveFiles = [
      /etc\/passwd/gi,
      /etc\/shadow/gi,
      /etc\/hosts/gi,
      /proc\/version/gi,
      /proc\/self\/environ/gi,
      /windows\/win\.ini/gi,
      /windows\/system32\/config\/sam/gi,
    ];

    // If URL contains traversal AND sensitive file, it's a traversal attempt
    const hasTraversal = traversalPatterns.some(p => p.test(url) || p.test(decodedUrl));
    const hasSensitiveFile = sensitiveFiles.some(p => p.test(url) || p.test(decodedUrl));

    return hasTraversal && hasSensitiveFile;
  }

  /**
   * Checks if the request is trying to access /etc/passwd via traversal
   */
  private isPasswdRequest(url: string): boolean {
    if (!url) return false;
    const decodedUrl = decodeURIComponent(url).toLowerCase();
    return decodedUrl.includes('passwd') || decodedUrl.includes('etc/passwd');
  }

  use(req: FastifyRequest, res: FastifyReply, next: () => void) {
    const url = req.url || '';

    // Check if this is a path traversal attempt
    if (this.detectTraversalPattern(url)) {
      // If it's requesting /etc/passwd, return fake content
      if (this.isPasswdRequest(url)) {
        // Set realistic headers for /etc/passwd response
        res.header('Content-Type', 'text/plain');
        res.header('Content-Length', FAKE_ETC_PASSWD.length.toString());
        res.status(200);
        res.send(FAKE_ETC_PASSWD);
        return; // Stop request processing - do not call next()
      }
    }

    // Not a traversal attempt, continue normally
    next();
  }
}

