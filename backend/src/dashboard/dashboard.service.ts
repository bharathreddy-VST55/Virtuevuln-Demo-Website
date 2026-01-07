import { Injectable, Logger } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { User } from '../model/user.entity';

@Injectable()
export class DashboardService {
    private readonly logger = new Logger(DashboardService.name);

    constructor(
        @InjectRepository(User)
        private readonly usersRepository: EntityRepository<User>,
        private readonly em: EntityManager,
    ) { }

    async getDashboardStats() {
        const totalUsers = await this.usersRepository.count();
        const activeUsers = await this.usersRepository.count({ isActive: true });

        return {
            totalUsers,
            activeUsers,
            systemStatus: 'Operational',
            lastBackup: new Date().toISOString(),
        };
    }

    // INTENTIONAL VULNERABILITY: Read-Only SQL Injection
    // This method uses raw SQL with unsanitized input for the search query.
    // It is intended for training purposes to demonstrate SQL injection.
    // Secure version should use parameterized queries or the ORM's query builder.
    async getSystemLogs(search: string = '') {
        this.logger.debug(`Fetching system logs with search: ${search}`);

        // Vulnerable query construction
        // We try to restrict it to SELECT only to prevent data modification,
        // but this is still a major vulnerability.
        let query = `SELECT * FROM system_logs`;

        if (search) {
            query += ` WHERE message LIKE '%${search}%'`;
        }

        query += ` ORDER BY created_at DESC LIMIT 50`;

        try {
            // Using the entity manager to execute raw SQL
            const connection = this.em.getConnection();
            const results = await connection.execute(query);
            return results;
        } catch (error) {
            this.logger.error(`Error executing log query: ${error.message}`);
            // Return the error to the user to help with SQLi exploitation (training)
            return { error: error.message, query };
        }
    }

    async getRecentActivities() {
        // Mock data for now, would normally come from a real logs table
        return [
            { id: 1, user: 'admin', action: 'Login', timestamp: new Date() },
            { id: 2, user: 'hashira1', action: 'Viewed Profile', timestamp: new Date() },
            { id: 3, user: 'demon_hunter', action: 'Updated Status', timestamp: new Date() },
        ];
    }
}
