import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Header,
  HttpException,
  InternalServerErrorException,
  Logger,
  Options,
  Param,
  Post,
  Query,
  Redirect,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
  ParseIntPipe,
  DefaultValuePipe,
  HttpStatus,
  Req
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger';
import * as dotT from 'dot';
import { parseXml } from 'libxmljs';
import { AppConfig } from './app.config.api';
import {
  API_DESC_CONFIG_SERVER,
  API_DESC_LAUNCH_COMMAND,
  API_DESC_OPTIONS_REQUEST,
  API_DESC_REDIRECT_REQUEST,
  API_DESC_RENDER_REQUEST,
  API_DESC_XML_METADATA,
  SWAGGER_DESC_SECRETS,
  SWAGGER_DESC_NESTED_JSON
} from './app.controller.swagger.desc';
import { AuthGuard } from './auth/auth.guard';
import { JwtType } from './auth/jwt/jwt.type.decorator';
import { JwtProcessorType } from './auth/auth.service';
import { AppService } from './app.service';
import { BASIC_USER_INFO, UserDto } from './users/api/UserDto';
import { SWAGGER_DESC_FIND_USER } from './users/users.controller.swagger.desc';
import { AnyFilesInterceptor } from './components/any-files.interceptor';
import { FastifyRequest } from 'fastify';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

@Controller('/api')
@ApiTags('App controller')
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Post('render')
  @ApiProduces('text/plain')
  @ApiConsumes('text/plain')
  @ApiOperation({
    description: API_DESC_RENDER_REQUEST
  })
  @ApiBody({ description: 'Write your text here' })
  @ApiCreatedResponse({
    description: 'Rendered result'
  })
  async renderTemplate(@Body() raw): Promise<string> {
    if (typeof raw === 'string' || Buffer.isBuffer(raw)) {
      const text = raw.toString().trim();
      const res = dotT.compile(text)();
      this.logger.debug(`Rendered template: ${res}`);
      return res;
    }
  }

  @Get('goto')
  @ApiQuery({ name: 'url', example: 'https://google.com', required: true })
  @ApiOperation({
    description: API_DESC_REDIRECT_REQUEST
  })
  @ApiOkResponse({
    description: 'Redirected'
  })
  @Redirect()
  async redirect(@Query('url') url: string) {
    return { url };
  }

  @Post('metadata')
  @ApiProduces('text/plain')
  @ApiConsumes('text/plain')
  @ApiBody({
    type: String,
    examples: {
      xml_doc: {
        summary: 'XML doc',
        value: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 915 585"><g stroke-width="3.45" fill="none"><path stroke="#000" d="M11.8 11.8h411v411l-411 .01v-411z"/><path stroke="#448" d="M489 11.7h415v411H489v-411z"/></g></svg>`
      }
    }
  })
  @ApiOperation({
    description: API_DESC_XML_METADATA
  })
  @ApiInternalServerErrorResponse({
    description: 'Invalid data'
  })
  @ApiCreatedResponse({
    description: 'XML passed successfully'
  })
  @Header('content-type', 'text/xml')
  async xml(@Body() xml: string): Promise<string> {
    const xmlDoc = parseXml(decodeURIComponent(xml), {
      noent: true,
      dtdvalid: true,
      recover: true
    });
    this.logger.debug(xmlDoc);
    this.logger.debug(xmlDoc.getDtd());

    return xmlDoc.toString(true);
  }

  @Options()
  @ApiOperation({
    description: API_DESC_OPTIONS_REQUEST
  })
  @Header('allow', 'OPTIONS, GET, HEAD, POST')
  async getTestOptions(): Promise<void> {
    this.logger.debug('Test OPTIONS');
  }

  @Get('spawn')
  @ApiQuery({ name: 'command', example: 'ls -la', required: true })
  @ApiOperation({
    description: API_DESC_LAUNCH_COMMAND
  })
  @ApiOkResponse({
    type: String
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      properties: { location: { type: 'string' } }
    }
  })
  async getCommandResult(@Query('command') command: string): Promise<string> {
    this.logger.debug(`launch ${command} command`);
    try {
      return await this.appService.launchCommand(command);
    } catch (err) {
      throw new InternalServerErrorException({
        error: err.message || err,
        location: __filename
      });
    }
  }

  @Get('/config')
  @ApiOperation({
    description: API_DESC_CONFIG_SERVER
  })
  @ApiOkResponse({
    type: AppConfig
  })
  getConfig(): AppConfig {
    const config = this.appService.getConfig();
    return config;
  }

  @Get('/debug/info')
  @ApiOperation({
    description: 'Debug endpoint - Information leakage vulnerability (for learning purposes)'
  })
  @ApiOkResponse({
    description: 'Returns debug information including sensitive data'
  })
  getDebugInfo(): Record<string, any> {
    // Information leakage vulnerability - exposing sensitive system information
    return {
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        hostname: require('os').hostname(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpus: require('os').cpus().length,
        env: {
          nodeEnv: process.env.NODE_ENV,
          // Exposing environment variables (vulnerability)
          databaseHost: process.env.DATABASE_HOST || 'localhost',
          databasePort: process.env.DATABASE_PORT || '5432',
          databaseName: process.env.DATABASE_SCHEMA || 'demon_slayers',
          databaseUser: process.env.DATABASE_USER || 'postgres'
        }
      },
      application: {
        pid: process.pid,
        workingDirectory: process.cwd(),
        execPath: process.execPath,
        version: require('../../package.json').version
      },
      security: {
        note: 'This endpoint exposes sensitive information for security testing purposes',
        warning: 'In production, this endpoint should be disabled or protected'
      }
    };
  }

  @Get('/debug/users')
  @ApiOperation({
    description: 'Debug endpoint - User information leakage (for learning purposes)'
  })
  @ApiOkResponse({
    description: 'Returns user statistics and information'
  })
  async getDebugUsers(): Promise<Record<string, any>> {
    // Information leakage - exposing user statistics
    try {
      const userService = this.appService['usersService'] || null;
      if (userService) {
        const stats = await userService.getUserStats();
        return {
          statistics: stats,
          note: 'User statistics exposed for security testing',
          vulnerability: 'Information disclosure - user data exposure'
        };
      }
      return {
        error: 'User service not available',
        note: 'This endpoint may expose sensitive user information'
      };
    } catch (error) {
      return {
        error: error.message,
        stack: error.stack?.split('\n').slice(0, 5), // Stack trace leakage
        note: 'Error information exposed for security testing'
      };
    }
  }

  @Get('/credentials')
  @ApiOperation({
    description: 'Information leakage vulnerability - Exposes credentials file (for learning purposes)'
  })
  @ApiOkResponse({
    description: 'Returns credentials file content',
    type: String
  })
  @Header('content-type', 'text/plain')
  async getCredentials(): Promise<string> {
    // Information leakage vulnerability - exposing credentials file
    const fs = require('fs');
    const path = require('path');
    try {
      const credentialsPath = path.join(__dirname, '..', 'credentials.txt');
      const content = await fs.promises.readFile(credentialsPath, 'utf8');
      return content;
    } catch (err) {
      // Fallback if file doesn't exist - still expose credentials
      return `Demon Slayers - Vulnerable Training Lab
===========================================

This endpoint is intentionally vulnerable for security testing purposes.

User Credentials:
-----------------
Email: user@demonslayer.com
Password: user123
Role: people

Admin Credentials:
------------------
Email: admin@demonslayer.com
Password: admin123
Role: super_admin

Note: This is an intentional information leakage vulnerability for learning purposes.
Error reading file: ${err.message}`;
    }
  }

  @Get('/secrets')
  @ApiOperation({
    description: SWAGGER_DESC_SECRETS
  })
  @ApiOkResponse({
    type: Object
  })
  getSecrets(): Record<string, string> {
    const secrets = {
      codeclimate:
        'CODECLIMATE_REPO_TOKEN=62864c476ade6ab9d10d0ce0901ae2c211924852a28c5f960ae5165c1fdfec73',
      facebook:
        'EAACEdEose0cBAHyDF5HI5o2auPWv3lPP3zNYuWWpjMrSaIhtSvX73lsLOcas5k8GhC5HgOXnbF3rXRTczOpsbNb54CQL8LcQEMhZAWAJzI0AzmL23hZByFAia5avB6Q4Xv4u2QVoAdH0mcJhYTFRpyJKIAyDKUEBzz0GgZDZD',
      google_b64: 'QUl6YhT6QXlEQnbTr2dSdEI1W7yL2mFCX3c4PPP5NlpkWE65NkZV',
      google_oauth:
        '188968487735-c7hh7k87juef6vv84697sinju2bet7gn.apps.googleusercontent.com',
      google_oauth_token:
        'ya29.a0TgU6SMDItdQQ9J7j3FVgJuByTTevl0FThTEkBs4pA4-9tFREyf2cfcL-_JU6Trg1O0NWwQKie4uGTrs35kmKlxohWgcAl8cg9DTxRx-UXFS-S1VYPLVtQLGYyNTfGp054Ad3ej73-FIHz3RZY43lcKSorbZEY4BI',
      heroku:
        'herokudev.staging.endosome.975138 pid=48751 request_id=0e9a8698-a4d2-4925-a1a5-113234af5f60',
      hockey_app: 'HockeySDK: 203d3af93f4a218bfb528de08ae5d30ff65e1cf',
      outlook:
        'https://outlook.office.com/webhook/7dd49fc6-1975-443d-806c-08ebe8f81146@a532313f-11ec-43a2-9a7a-d2e27f4f3478/IncomingWebhook/8436f62b50ab41b3b93ba1c0a50a0b88/eff4cd58-1bb8-4899-94de-795f656b4a18',
      paypal:
        'access_token$production$x0lb4r69dvmmnufd$3ea7cb281754b7da7dac131ef5783321',
      slack:
        'xoxo-175588824543-175748345725-176608801663-826315f84e553d482bb7e73e8322sdf3'
    };
    return secrets;
  }

  @Get('/v1/userinfo/:email')
  @ApiQuery({ name: 'email', example: 'john.doe@example.com', required: true })
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ groups: [BASIC_USER_INFO] })
  @ApiOperation({
    description: SWAGGER_DESC_FIND_USER
  })
  @ApiOkResponse({
    type: UserDto,
    description: 'Returns basic user info if it exists'
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' }
      }
    }
  })
  async getUserInfo(@Param('email') email: string): Promise<UserDto> {
    try {
      return await this.appService.getUserInfo(email);
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @Get('/v2/userinfo/:email')
  @ApiQuery({ name: 'email', example: 'john.doe@example.com', required: true })
  @UseGuards(AuthGuard)
  @JwtType(JwtProcessorType.RSA)
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ groups: [BASIC_USER_INFO] })
  @ApiOperation({
    description: SWAGGER_DESC_FIND_USER
  })
  @ApiOkResponse({
    type: UserDto,
    description: 'Returns basic user info if it exists'
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' }
      }
    }
  })
  async getUserInfoV2(@Param('email') email: string): Promise<UserDto> {
    try {
      return await this.appService.getUserInfo(email);
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @Get('nestedJson')
  @ApiOperation({
    description: SWAGGER_DESC_NESTED_JSON
  })
  @Header('content-type', 'application/json')
  async getNestedJson(
    @Query(
      'depth',
      new DefaultValuePipe(1),
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })
    )
    depth: number
  ): Promise<string> {
    if (depth < 1) {
      throw new HttpException(
        'JSON nesting depth is invalid',
        HttpStatus.BAD_REQUEST
      );
    }

    this.logger.debug(`Creating a JSON with a nesting depth of ${depth}`);

    let tmpObj = {};
    let jsonObj: Record<string, string> = { '0': 'Leaf' };
    for (let i = 1; i < depth; i++) {
      tmpObj = {};
      tmpObj[i.toString()] = Object.assign({}, jsonObj);
      jsonObj = Object.assign({}, tmpObj);
    }

    return JSON.stringify(jsonObj);
  }

  /**
   * INTENTIONAL VULNERABILITY - FILE UPLOAD SIMULATION
   * 
   * This endpoint is intentionally vulnerable for security training purposes.
   * 
   * SAFETY GUARANTEES:
   * - Files are stored ONLY in isolated temp folder (/tmp/uploads)
   * - Files are auto-deleted immediately after upload (0-10 second delay)
   * - NO file execution - files are never executed or processed
   * - NO public access - uploaded files are NOT served via URL
   * - NO filesystem access outside /tmp/uploads
   * - Upload directory is NOT mounted to host in Docker
   * 
   * This simulates a vulnerable file upload endpoint without creating real risk.
   */
  @Post('/upload')
  @UseInterceptors(AnyFilesInterceptor)
  @ApiOperation({
    description: 'INTENTIONAL VULNERABILITY - File upload endpoint for security training. Files are stored safely in isolated temp folder and immediately deleted. No files are executed.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  @ApiOkResponse({
    description: 'File upload response',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        filename: { type: 'string' },
        size: { type: 'number' },
        mimeType: { type: 'string' },
        warning: { type: 'string' }
      }
    }
  })
  async vulnerableUpload(@Req() req: FastifyRequest): Promise<any> {
    try {
      // Check if request is multipart
      if (!req.isMultipart()) {
        throw new HttpException('Request must be multipart/form-data', HttpStatus.BAD_REQUEST);
      }

      // Get uploaded file
      const file = await req.file();
      if (!file) {
        throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
      }

      const filename = file.filename;
      const fileBuffer = await file.toBuffer();
      const fileSize = fileBuffer.length;
      const mimeType = file.mimetype || 'application/octet-stream';

      // SAFETY: Create isolated temp directory if it doesn't exist
      const uploadDir = '/tmp/uploads';
      try {
        await fs.promises.mkdir(uploadDir, { recursive: true });
        // Ensure directory is not executable (chmod 755 -> 644 equivalent)
        await fs.promises.chmod(uploadDir, 0o755);
      } catch (err) {
        // Directory might already exist, that's okay
      }

      // SAFETY: Save file ONLY in isolated temp folder
      // Use sanitized filename to prevent path traversal
      const sanitizedFilename = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = path.join(uploadDir, sanitizedFilename);

      // Write file to isolated temp directory
      await fs.promises.writeFile(filePath, fileBuffer);
      
      // SAFETY: Set file permissions to non-executable (read/write only)
      await fs.promises.chmod(filePath, 0o644);

      // SAFETY: Auto-delete file after short delay (5 seconds)
      // This ensures files don't accumulate and are never accessible
      setTimeout(async () => {
        try {
          await fs.promises.unlink(filePath);
          this.logger.debug(`Auto-deleted uploaded file: ${filePath}`);
        } catch (err) {
          this.logger.warn(`Failed to auto-delete file ${filePath}: ${err.message}`);
        }
      }, 5000); // 5 second delay before deletion

      // Return fake success message (vulnerability simulation)
      return {
        success: true,
        message: 'File uploaded successfully — WARNING: This upload endpoint is intentionally vulnerable.',
        filename: sanitizedFilename,
        size: fileSize,
        mimeType: mimeType,
        warning: 'This endpoint is intentionally vulnerable for training. File uploads are stored safely in an isolated temp folder and immediately deleted. No uploaded file is executed.'
      };
    } catch (err) {
      this.logger.error(`Upload error: ${err.message}`);
      throw new HttpException(
        {
          success: false,
          error: err.message || 'File upload failed'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
