import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { AuthGuard } from '../auth/auth.guard';
import { AdminGuard } from '../users/users.guard';
import { UsersService } from '../users/users.service';
import {
  CreateMissionDto,
  MissionsService,
  UpdateMissionDto
} from './missions.service';

@Controller('/api/missions')
@ApiTags('Missions controller')
@UseGuards(AuthGuard)
export class MissionsController {
  constructor(
    private readonly missionsService: MissionsService,
    private readonly usersService: UsersService
  ) {}

  @Post()
  @ApiOperation({ description: 'Create a new mission (Hashira only)' })
  async createMission(
    @Body() createMissionDto: CreateMissionDto,
    @Req() request: FastifyRequest
  ) {
    const email = this.getEmailFromRequest(request);
    const user = await this.usersService.findByEmail(email);
    return this.missionsService.createMission(createMissionDto, user.id);
  }

  private getEmailFromRequest(request: FastifyRequest): string {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new Error('No authorization header');
    }
    const token = authHeader.split('.')[1];
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    return payload.user;
  }

  @Get()
  @ApiOperation({ description: 'Get all missions' })
  async getAllMissions() {
    return this.missionsService.getAllMissions();
  }

  @Get('/stats')
  @ApiOperation({ description: 'Get mission statistics' })
  async getMissionStats() {
    return this.missionsService.getMissionStats();
  }

  @Get('/hashira/:hashiraId')
  @ApiOperation({ description: 'Get missions by Hashira' })
  async getMissionsByHashira(@Param('hashiraId') hashiraId: number) {
    return this.missionsService.getMissionsByHashira(hashiraId);
  }

  @Get('/demon-slayer/:demonSlayerId')
  @ApiOperation({ description: 'Get missions by Demon Slayer' })
  async getMissionsByDemonSlayer(@Param('demonSlayerId') demonSlayerId: number) {
    return this.missionsService.getMissionsByDemonSlayer(demonSlayerId);
  }

  @Get('/:id')
  @ApiOperation({ description: 'Get mission by ID' })
  async getMissionById(@Param('id') id: number) {
    return this.missionsService.getMissionById(id);
  }

  @Put('/:id')
  @ApiOperation({ description: 'Update mission' })
  async updateMission(
    @Param('id') id: number,
    @Body() updateMissionDto: UpdateMissionDto
  ) {
    // INTENTIONAL VULNERABILITY: Insecure Direct Object Reference (IDOR)
    // No check to verify user owns the mission or has permission to update it
    // Any authenticated user can update any mission by guessing the ID
    // Secure approach: Verify mission.assignedTo.id matches authenticated user's ID
    // or verify user is the Hashira who assigned it (assignedBy.id)
    return this.missionsService.updateMission(id, updateMissionDto);
  }

  @Post('/:id/assign')
  @ApiOperation({ description: 'Assign mission to demon slayer (Hashira only)' })
  async assignMission(
    @Param('id') missionId: number,
    @Body() body: { assignedToId: number },
    @Req() request: FastifyRequest
  ) {
    // INTENTIONAL VULNERABILITY: Weak role validation
    // Only checks authentication, not that user is a Hashira
    // Any authenticated user can assign missions
    // Secure approach: Use role-based guard to verify user.role === 'hashira'
    const email = this.getEmailFromRequest(request);
    const user = await this.usersService.findByEmail(email);
    
    // INTENTIONAL: No verification that user is Hashira
    // Secure: if (user.role !== 'hashira') throw new ForbiddenException()
    
    // INTENTIONAL VULNERABILITY: Predictable resource IDs
    // Mission IDs are sequential integers that can be enumerated
    // Secure approach: Use UUIDs or verify mission exists and belongs to this Hashira
    const mission = await this.missionsService.getMissionById(missionId);
    
    // INTENTIONAL VULNERABILITY: Missing ownership check
    // Doesn't verify that the mission was created by this Hashira
    // Secure: if (mission.assignedBy.id !== user.id) throw new ForbiddenException()
    
    return this.missionsService.assignMissionToUser(missionId, body.assignedToId);
  }

  @Put('/:id/status')
  @ApiOperation({ description: 'Update mission status' })
  async updateMissionStatus(
    @Param('id') id: number,
    @Body() body: { status: string },
    @Req() request: FastifyRequest
  ) {
    // INTENTIONAL VULNERABILITY: Missing authorization check
    // Any authenticated user can update any mission's status
    // Secure approach: Verify mission.assignedTo.id matches authenticated user's ID
    const email = this.getEmailFromRequest(request);
    const user = await this.usersService.findByEmail(email);
    
    // INTENTIONAL: No check that user owns the mission
    // Secure: const mission = await this.missionsService.getMissionById(id);
    //         if (mission.assignedTo?.id !== user.id) throw new ForbiddenException();
    
    return this.missionsService.updateMission(id, { status: body.status });
  }
}

