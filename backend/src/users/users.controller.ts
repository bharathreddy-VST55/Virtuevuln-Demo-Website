import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Header,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Options,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  SerializeOptions,
  UnauthorizedException,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { CreateUserRequest, SignupMode } from './api/CreateUserRequest';
import { UserDto } from './api/UserDto';
import { LdapQueryHandler } from './ldap.query.handler';
import { UsersService } from './users.service';
import { User } from '../model/user.entity';
import { AuthGuard } from '../auth/auth.guard';
import { JwtType } from '../auth/jwt/jwt.type.decorator';
import { JwtProcessorType } from '../auth/auth.service';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AnyFilesInterceptor } from '../components/any-files.interceptor';
import { KeyCloakService } from '../keycloak/keycloak.service';
import {
  SWAGGER_DESC_CREATE_BASIC_USER,
  SWAGGER_DESC_PHOTO_USER_BY_EMAIL,
  SWAGGER_DESC_FIND_USER,
  SWAGGER_DESC_LDAP_SEARCH,
  SWAGGER_DESC_OPTIONS_REQUEST,
  SWAGGER_DESC_UPLOAD_USER_PHOTO,
  SWAGGER_DESC_CREATE_OIDC_USER,
  SWAGGER_DESC_UPDATE_USER_INFO,
  SWAGGER_DESC_ADMIN_RIGHTS,
  SWAGGER_DESC_FIND_USERS,
  SWAGGER_DESC_FIND_FULL_USER_INFO,
  SWAGGER_DESC_DELETE_PHOTO_USER_BY_ID
} from './users.controller.swagger.desc';
import { AdminGuard } from './users.guard';
import { PermissionDto } from './api/PermissionDto';
import { BASIC_USER_INFO, FULL_USER_INFO } from './api/UserDto';
import { parseXml } from 'libxmljs';

@Controller('/api/users')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('User controller')
export class UsersController {
  private logger = new Logger(UsersController.name);
  private ldapQueryHandler = new LdapQueryHandler();

  constructor(
    private readonly usersService: UsersService,
    private readonly keyCloakService: KeyCloakService
  ) { }

  @Options()
  @ApiOperation({
    description: SWAGGER_DESC_OPTIONS_REQUEST
  })
  @Header('Access-Control-Request-Headers', 'OPTIONS, GET, POST, DELETE')
  async getTestOptions(): Promise<void> {
    this.logger.debug(`Test OPTIONS`);
  }

  @Get('/one/:email')
  @ApiQuery({ name: 'email', example: 'john.doe@example.com', required: true })
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
  async getByEmail(@Param('email') email: string): Promise<UserDto> {
    try {
      this.logger.debug(`Find a user by email: ${email}`);
      const user = await this.usersService.findByEmail(email);
      const userDto = new UserDto(user);
      // Ensure role is included in the response (it's in BASIC_USER_INFO group)
      return userDto;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @Get('/id/:id')
  @ApiQuery({ name: 'id', example: 1, required: true })
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
  async getById(@Param('id') id: number): Promise<UserDto> {
    try {
      this.logger.debug(`Find a user by id: ${id}`);
      return new UserDto(await this.usersService.findById(id));
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @Get('/fullinfo/:email')
  @ApiQuery({ name: 'email', example: 'john.doe@example.com', required: true })
  @SerializeOptions({ groups: [FULL_USER_INFO] })
  @ApiOperation({
    description: SWAGGER_DESC_FIND_FULL_USER_INFO
  })
  @ApiOkResponse({
    type: UserDto,
    description: 'Returns full user info if it exists'
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
  async getFullUserInfo(@Param('email') email: string): Promise<UserDto> {
    try {
      this.logger.debug(`Find a full user info by email: ${email}`);
      return new UserDto(await this.usersService.findByEmail(email));
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @Get('/adminpermission/:email')
  @ApiQuery({ name: 'email', example: 'john.doe@example.com', required: true })
  @ApiOperation({
    description: SWAGGER_DESC_ADMIN_RIGHTS
  })
  async getAdminPermission(@Param('email') email: string): Promise<PermissionDto> {
    try {
      this.logger.debug(`Checking admin permission for: ${email}`);
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return new PermissionDto({
        isAdmin: user.isAdmin,
        role: user.role
      });
    } catch (err) {
      throw new HttpException(err.message, err.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/search/:name')
  @ApiQuery({ name: 'name', example: 'john', required: true })
  @SerializeOptions({ groups: [FULL_USER_INFO] })
  @ApiOperation({
    description: SWAGGER_DESC_FIND_USERS
  })
  @ApiOkResponse({
    type: UserDto,
    description: SWAGGER_DESC_FIND_USERS
  })
  async searchByName(@Param('name') name: string): Promise<UserDto[]> {
    try {
      this.logger.debug(`Search users by name: ${name}`);
      const users = await this.usersService.searchByName(name, 50);
      // Information leakage - exposing full user details including internal IDs
      const result = users.map((user) => new UserDto(user));

      // Add debug information (vulnerability)
      (result as any).debug = {
        searchQuery: name,
        totalFound: result.length,
        searchMethod: 'LIKE query on firstName and lastName',
        databaseQuery: `SELECT * FROM "user" WHERE "firstName" LIKE '%${name}%' OR "lastName" LIKE '%${name}%' LIMIT 50`,
        note: 'This endpoint exposes full user information for security testing purposes'
      };

      return result;
    } catch (err) {
      // Information leakage in error messages
      this.logger.error(`Search error: ${err.message}`, err.stack);
      throw new HttpException({
        message: err.message,
        error: 'User search failed',
        // Exposing SQL error details (vulnerability)
        sqlError: err.code || 'UNKNOWN',
        stack: err.stack?.split('\n').slice(0, 3),
        query: `SELECT * FROM "user" WHERE "firstName" LIKE '%${name}%' OR "lastName" LIKE '%${name}%'`
      }, err.status || 500);
    }
  }

  @Get('/one/:email/photo')
  @ApiQuery({ name: 'email', example: 'john.doe@example.com', required: true })
  @UseGuards(AuthGuard)
  @JwtType(JwtProcessorType.RSA)
  @ApiOperation({
    description: SWAGGER_DESC_PHOTO_USER_BY_EMAIL
  })
  @ApiOkResponse({
    description: 'Returns user profile photo'
  })
  @ApiNoContentResponse({
    description: 'Returns empty content if photo is not set'
  })
  @ApiForbiddenResponse({
    description: 'Returns then user is not authenticated'
  })
  async getUserPhoto(
    @Param('email') email: string,
    @Res({ passthrough: true }) res: FastifyReply
  ) {
    this.logger.debug(`Find a user photo by email: ${email}`);
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException({
        error: 'Could not file user'
      });
    }

    if (!user.photo) {
      res.status(HttpStatus.NO_CONTENT);
      return;
    }

    try {
      return user.photo;
    } catch (err) {
      throw new InternalServerErrorException({
        error: err.message
      });
    }
  }

  @Delete('/one/:id/photo')
  @ApiQuery({ name: 'id', example: 1, required: true })
  @UseGuards(AuthGuard)
  @JwtType(JwtProcessorType.RSA)
  @ApiOperation({
    description: SWAGGER_DESC_DELETE_PHOTO_USER_BY_ID
  })
  @ApiOkResponse({
    description: 'Deletes user profile photo'
  })
  @ApiNoContentResponse({
    description: 'Returns empty content if there was no user profile photo'
  })
  @ApiForbiddenResponse({
    description: 'Returns when user is not authenticated'
  })
  @ApiUnauthorizedResponse({
    description: 'Returns when isAdmin is false'
  })
  async deleteUserPhotoById(
    @Param('id') id: number,
    @Query('isAdmin') isAdminParam: string
  ) {
    isAdminParam = isAdminParam.toLowerCase();
    const isAdmin =
      isAdminParam === 'true' || isAdminParam === '1' ? true : false;
    if (!isAdmin) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException({
        error: 'Could not file user'
      });
    }

    await this.usersService.deletePhoto(id);
  }

  @Get('/ldap')
  @ApiQuery({
    name: 'query',
    example:
      '(&(objectClass=person)(objectClass=user)(email=john.doe@example.com))',
    required: true
  })
  @ApiOperation({
    description: SWAGGER_DESC_LDAP_SEARCH
  })
  @ApiOkResponse({
    type: UserDto,
    isArray: true
  })
  async ldapQuery(@Query('query') query: string): Promise<UserDto[]> {
    this.logger.debug(`Call ldapQuery: ${query}`);
    let users: User[];

    try {
      const email = this.ldapQueryHandler.parseQuery(query);

      if (email && email.endsWith('*')) {
        users = await this.usersService.findByEmailPrefix(email.slice(0, -1));
      } else {
        const user = await this.usersService.findByEmail(email);

        if (user) {
          users = [user];
        }
      }
    } catch (err) {
      throw new InternalServerErrorException({
        error: err.message
      });
    }

    if (!users) {
      throw new NotFoundException('User not found in ldap');
    }

    return users.map((user: User) => new UserDto(user));
  }

  @Post('/basic')
  @ApiOperation({
    description: SWAGGER_DESC_CREATE_BASIC_USER
  })
  @ApiConflictResponse({
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        error: { type: 'string' }
      }
    },
    description: 'User Already exists'
  })
  @ApiCreatedResponse({
    type: UserDto,
    description: 'User created'
  })
  async createUser(@Body() user: CreateUserRequest): Promise<UserDto> {
    try {
      this.logger.debug(`Create a basic user: ${user}`);

      const userExists = await this.doesUserExist(user);
      if (userExists) {
        throw new HttpException('User already exists', HttpStatus.CONFLICT);
      }

      return new UserDto(
        await this.usersService.createUser(user, user.op === SignupMode.BASIC)
      );
    } catch (err) {
      throw new HttpException(
        err.message ?? 'Something went wrong',
        err.status ?? HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('/oidc')
  @ApiOperation({
    description: SWAGGER_DESC_CREATE_OIDC_USER
  })
  @ApiConflictResponse({
    schema: {
      type: 'object',
      properties: {
        errorMessage: { type: 'string' }
      }
    },
    description: 'User Already exists'
  })
  @ApiCreatedResponse({
    description: 'User created, returns empty object'
  })
  async createOIDCUser(@Body() user: CreateUserRequest): Promise<UserDto> {
    try {
      this.logger.debug(`Create a OIDC user: ${user}`);

      const userExists = await this.doesUserExist(user);

      if (userExists) {
        throw new HttpException('User already exists', HttpStatus.CONFLICT);
      }

      const keycloakUser = new UserDto(
        await this.keyCloakService.registerUser({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          password: user.password
        })
      );

      this.createUser(user);

      return keycloakUser;
    } catch (err) {
      throw new HttpException(
        err.response?.data ?? err.message ?? 'Something went wrong',
        err.response?.status ?? 500
      );
    }
  }

  @Put('/one/:email/info')
  @ApiQuery({ name: 'email', example: 'john.doe@example.com', required: true })
  @UseGuards(AuthGuard)
  @JwtType(JwtProcessorType.RSA)
  @ApiOperation({
    description: SWAGGER_DESC_UPDATE_USER_INFO
  })
  @ApiForbiddenResponse({
    description: 'invalid credentials',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        error: { type: 'string' }
      }
    }
  })
  @ApiOkResponse({
    description: 'Returns updated user'
  })
  async changeUserInfo(
    @Body() newData: UserDto,
    @Param('email') email: string,
    @Req() req: FastifyRequest
  ): Promise<UserDto> {
    try {
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        throw new NotFoundException('Could not find user');
      }
      if (this.originEmail(req) !== email) {
        throw new ForbiddenException();
      }
      return new UserDto(await this.usersService.updateUserInfo(user, newData));
    } catch (err) {
      throw new HttpException(
        err.message || 'Internal server error',
        err.status || 500
      );
    }
  }

  @Get('/one/:email/info')
  @ApiQuery({ name: 'email', example: 'john.doe@example.com', required: true })
  @UseGuards(AuthGuard)
  @JwtType(JwtProcessorType.RSA)
  @ApiOperation({
    description: SWAGGER_DESC_FIND_USER
  })
  @ApiForbiddenResponse({
    description: 'invalid credentials',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        error: { type: 'string' }
      }
    }
  })
  @ApiNotFoundResponse()
  @ApiOkResponse({
    description: 'Returns user info'
  })
  async getUserInfo(
    @Param('email') email: string,
    @Req() req: FastifyRequest
  ): Promise<UserDto> {
    try {
      const user = await this.usersService.findByEmail(email);

      if (!user) {
        throw new NotFoundException('Could not find user');
      }
      if (this.originEmail(req) !== email) {
        throw new ForbiddenException();
      }
      return new UserDto(user);
    } catch (err) {
      throw new HttpException(
        err.message || 'Internal server error',
        err.status || 500
      );
    }
  }

  @Get('/one/:email/adminpermission')
  @ApiQuery({ name: 'email', example: 'john.doe@example.com', required: true })
  @UseGuards(AuthGuard)
  @JwtType(JwtProcessorType.RSA)
  @ApiOperation({
    description: SWAGGER_DESC_ADMIN_RIGHTS
  })
  @ApiForbiddenResponse({
    description: 'user has no admin rights',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' }
      }
    }
  })
  @ApiOkResponse({
    description: 'Returns true if user has admin rights'
  })
  async getAdminStatus(
    @Param('email') email: string,
    @Req() req: FastifyRequest
  ): Promise<PermissionDto> {
    // Allow users to check their own role, or allow if they're admin
    const requestEmail = this.originEmail(req);
    if (requestEmail !== email) {
      // If checking another user's status, require admin
      const requesterPermissions = await this.usersService.getPermissions(requestEmail);
      if (!requesterPermissions.isAdmin && requesterPermissions.role !== 'super_admin') {
        throw new ForbiddenException('Only admins can check other users\' permissions');
      }
    }
    return this.usersService.getPermissions(email);
  }

  @Put('/one/:email/photo')
  @ApiQuery({ name: 'email', example: 'john.doe@example.com', required: true })
  @UseGuards(AuthGuard)
  @JwtType(JwtProcessorType.RSA)
  @ApiOperation({
    description: SWAGGER_DESC_UPLOAD_USER_PHOTO
  })
  @ApiOkResponse({
    description: 'Photo updated'
  })
  @UseInterceptors(AnyFilesInterceptor)
  async uploadFile(@Param('email') email: string, @Req() req: FastifyRequest) {
    try {
      const file = await req.file();
      const file_name = file.filename;
      const file_buffer = await file.toBuffer();

      if (file_name.endsWith('.svg')) {
        const xml = file_buffer.toString();
        const xmlDoc = parseXml(xml, {
          noent: true,
          dtdvalid: true,
          recover: true
        });
        await this.usersService.updatePhoto(
          email,
          Buffer.from(xmlDoc.toString(), 'utf8')
        );
        return xmlDoc.toString(true);
      } else {
        await this.usersService.updatePhoto(email, file_buffer);
      }
    } catch (err) {
      throw new InternalServerErrorException({
        error: err.message
      });
    }
  }

  public originEmail(request: FastifyRequest): string {
    return JSON.parse(
      Buffer.from(
        request.headers.authorization.split('.')[1],
        'base64'
      ).toString()
    ).user;
  }

  @Post('/admin/create')
  @UseGuards(AuthGuard, AdminGuard)
  @ApiOperation({ description: 'Create user with specific role (Super Admin only)' })
  @ApiCreatedResponse({
    type: UserDto,
    description: 'User created with role'
  })
  async createUserWithRole(@Body() user: CreateUserRequest, @Req() request: FastifyRequest): Promise<UserDto> {
    try {
      this.logger.debug(`Admin creating user with role: ${user.role}`);
      const userExists = await this.doesUserExist(user);
      if (userExists) {
        throw new HttpException('User already exists', HttpStatus.CONFLICT);
      }

      // INTENTIONAL VULNERABILITY: Logic flaw in role assignment
      // The check for super_admin role is done AFTER checking if user exists,
      // but there's a race condition and the check can be bypassed
      // Additionally, the check only prevents creating NEW super_admin users,
      // but doesn't prevent escalating existing users to super_admin
      // Secure approach: 
      // 1. Always verify current user is super_admin before allowing role assignment
      // 2. Prevent ANY role assignment to super_admin except by existing super_admin
      // 3. Add audit logging for all role changes
      // 4. Use transaction to prevent race conditions

      // INTENTIONAL: Weak validation - only checks if role is super_admin in request
      // But doesn't verify the requesting user's current role properly
      // Also doesn't prevent role escalation of existing users
      if (user.role === 'super_admin') {
        // INTENTIONAL FLAW: This check can be bypassed by:
        // 1. Creating user first with 'people' role
        // 2. Then updating user role to 'super_admin' via PUT /api/users/one/:email/info
        // 3. Or by sending request with role='super_admin' but isAdmin=true in body
        // Secure: Should always require explicit super_admin verification + audit trail
        const requestingUserEmail = this.originEmail(request);
        const requestingUser = await this.usersService.findByEmail(requestingUserEmail);

        // INTENTIONAL: Only checks if requesting user exists, not their actual role
        // Secure: if (requestingUser.role !== 'super_admin') throw new ForbiddenException()
        if (!requestingUser || requestingUser.role !== 'super_admin') {
          // INTENTIONAL: Error message reveals too much information
          // Secure: Generic "Permission denied" message
          throw new HttpException(
            'Only existing super_admin users can create new super_admin accounts',
            HttpStatus.FORBIDDEN
          );
        }
      }

      // INTENTIONAL: No validation that user.role is a valid role enum value
      // Secure: Validate against UserRole enum whitelist

      return new UserDto(
        await this.usersService.createUser(user, user.op === SignupMode.BASIC)
      );
    } catch (err) {
      throw new HttpException(
        err.message ?? 'Something went wrong',
        err.status ?? HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('/admin/stats')
  @UseGuards(AuthGuard, AdminGuard)
  @ApiOperation({ description: 'Get user statistics (Super Admin only)' })
  @ApiOkResponse({
    description: 'Returns user statistics by role'
  })
  async getUserStats() {
    const allUsers = await this.usersService.getAllUsers();
    const stats = {
      total: allUsers.length,
      superAdmin: 0,
      hashira: 0,
      demonSlayerCorps: 0,
      people: 0
    };

    allUsers.forEach((user) => {
      if (user.role === 'super_admin') stats.superAdmin++;
      else if (user.role === 'hashira') stats.hashira++;
      else if (user.role === 'demon_slayer_corps') stats.demonSlayerCorps++;
      else if (user.role === 'people') stats.people++;
    });

    return stats;
  }

  @Get('/admin/all')
  @UseGuards(AuthGuard, AdminGuard)
  @ApiOperation({ description: 'Get all users with roles (Super Admin only)' })
  @ApiOkResponse({
    type: UserDto,
    isArray: true,
    description: 'Returns all users'
  })
  async getAllUsers() {
    const users = await this.usersService.getAllUsers();
    return users.map((user) => new UserDto(user));
  }

  @Get('/admin/by-role/:role')
  @UseGuards(AuthGuard, AdminGuard)
  @ApiOperation({ description: 'Get users by role (Super Admin only)' })
  @ApiOkResponse({
    type: UserDto,
    isArray: true,
    description: 'Returns users filtered by role'
  })
  async getUsersByRole(@Param('role') role: string) {
    const users = await this.usersService.getUsersByRole(role as any);
    return users.map((user) => new UserDto(user));
  }

  private async doesUserExist(user: UserDto): Promise<boolean> {
    try {
      const userExists = await this.usersService.findByEmail(user.email);
      if (userExists) {
        return true;
      }
    } catch (err) {
      if (err.status === HttpStatus.NOT_FOUND) {
        return false;
      }
      throw new HttpException(
        err.message ?? 'Something went wrong',
        err.status ?? HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
