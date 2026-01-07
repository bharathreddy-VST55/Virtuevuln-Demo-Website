import {
  EntityManager,
  EntityRepository
} from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Mission, MissionStatus, MissionType } from '../model/mission.entity';
import { User } from '../model/user.entity';

export interface CreateMissionDto {
  title: string;
  description: string;
  missionType: string;
  assignedToId?: number;
  location?: string;
  notes?: string;
}

export interface UpdateMissionDto {
  title?: string;
  description?: string;
  status?: string;
  location?: string;
  notes?: string;
  completedAt?: Date;
}

@Injectable()
export class MissionsService {
  private log: Logger = new Logger(MissionsService.name);

  constructor(
    @InjectRepository(Mission)
    private readonly missionsRepository: EntityRepository<Mission>,
    private readonly em: EntityManager
  ) {}

  async createMission(
    createMissionDto: CreateMissionDto,
    assignedById: number
  ): Promise<Mission> {
    this.log.debug(`Called createMission by user ${assignedById}`);

    const assignedBy = await this.em.findOne(User, { id: assignedById });
    if (!assignedBy) {
      throw new NotFoundException('Hashira not found');
    }

    const mission = new Mission();
    mission.title = createMissionDto.title;
    mission.description = createMissionDto.description;
    mission.missionType = createMissionDto.missionType || MissionType.KILL_DEMON;
    mission.status = MissionStatus.PENDING;
    mission.assignedBy = assignedBy;
    mission.location = createMissionDto.location || null;
    mission.notes = createMissionDto.notes || null;

    if (createMissionDto.assignedToId) {
      const assignedTo = await this.em.findOne(User, {
        id: createMissionDto.assignedToId
      });
      if (assignedTo) {
        mission.assignedTo = assignedTo;
      }
    }

    await this.em.persistAndFlush(mission);
    this.log.debug(`Saved new mission`);
    return mission;
  }

  async getAllMissions(): Promise<Mission[]> {
    this.log.debug(`Called getAllMissions`);
    return this.missionsRepository.findAll({
      populate: ['assignedBy', 'assignedTo']
    });
  }

  async getMissionsByHashira(hashiraId: number): Promise<Mission[]> {
    this.log.debug(`Called getMissionsByHashira ${hashiraId}`);
    return this.missionsRepository.find(
      { assignedBy: { id: hashiraId } },
      { populate: ['assignedBy', 'assignedTo'] }
    );
  }

  async getMissionsByDemonSlayer(demonSlayerId: number): Promise<Mission[]> {
    this.log.debug(`Called getMissionsByDemonSlayer ${demonSlayerId}`);
    return this.missionsRepository.find(
      { assignedTo: { id: demonSlayerId } },
      { populate: ['assignedBy', 'assignedTo'] }
    );
  }

  async getMissionById(id: number): Promise<Mission> {
    this.log.debug(`Called getMissionById ${id}`);
    const mission = await this.missionsRepository.findOne(
      { id },
      { populate: ['assignedBy', 'assignedTo'] }
    );
    if (!mission) {
      throw new NotFoundException('Mission not found');
    }
    return mission;
  }

  async updateMission(
    id: number,
    updateMissionDto: UpdateMissionDto
  ): Promise<Mission> {
    this.log.debug(`Called updateMission ${id}`);
    const mission = await this.getMissionById(id);

    if (updateMissionDto.title) mission.title = updateMissionDto.title;
    if (updateMissionDto.description)
      mission.description = updateMissionDto.description;
    if (updateMissionDto.status) mission.status = updateMissionDto.status;
    if (updateMissionDto.location) mission.location = updateMissionDto.location;
    if (updateMissionDto.notes) mission.notes = updateMissionDto.notes;
    if (updateMissionDto.completedAt)
      mission.completedAt = updateMissionDto.completedAt;

    await this.em.persistAndFlush(mission);
    return mission;
  }

  async getMissionStats(): Promise<{
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    byType: Record<string, number>;
  }> {
    const allMissions = await this.getAllMissions();
    const stats = {
      total: allMissions.length,
      pending: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0,
      byType: {} as Record<string, number>
    };

    allMissions.forEach((mission) => {
      if (mission.status === MissionStatus.PENDING) stats.pending++;
      else if (mission.status === MissionStatus.IN_PROGRESS)
        stats.inProgress++;
      else if (mission.status === MissionStatus.COMPLETED) stats.completed++;
      else if (mission.status === MissionStatus.CANCELLED) stats.cancelled++;

      stats.byType[mission.missionType] =
        (stats.byType[mission.missionType] || 0) + 1;
    });

    return stats;
  }

  async assignMissionToUser(missionId: number, assignedToId: number): Promise<Mission> {
    this.log.debug(`Called assignMissionToUser ${missionId} to ${assignedToId}`);
    const mission = await this.getMissionById(missionId);
    
    // INTENTIONAL VULNERABILITY: Missing validation
    // Doesn't verify that assignedToId is a demon_slayer_corps user
    // Secure: Verify user.role === 'demon_slayer_corps' before assigning
    const assignedTo = await this.em.findOne(User, { id: assignedToId });
    if (!assignedTo) {
      throw new NotFoundException('User not found');
    }

    mission.assignedTo = assignedTo;
    mission.status = MissionStatus.PENDING;
    await this.em.persistAndFlush(mission);
    return mission;
  }
}

