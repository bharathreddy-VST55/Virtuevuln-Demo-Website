import { Controller, Get, UseGuards, Query, Param, HttpException, HttpStatus, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { DashboardService } from './dashboard.service';
import { FastifyRequest } from 'fastify';

@ApiTags('Dashboard')
@Controller('api/dashboard')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get('stats')
    @ApiOperation({ summary: 'Get dashboard statistics' })
    async getStats() {
        return this.dashboardService.getDashboardStats();
    }

    @Get('logs')
    @ApiOperation({ summary: 'Get system logs (Vulnerable to SQLi)' })
    @ApiQuery({ name: 'search', required: false, description: 'Search term for logs' })
    async getLogs(@Query('search') search: string) {
        return this.dashboardService.getSystemLogs(search);
    }

    @Get('activities')
    @ApiOperation({ summary: 'Get recent activities' })
    async getActivities() {
        return this.dashboardService.getRecentActivities();
    }

    // INTENTIONAL VULNERABILITY: IDOR (Insecure Direct Object Reference)
    // Allows accessing any user's private notes by ID without checking ownership.
    // Secure version should check if the requesting user owns the note or has admin privileges.
    @Get('notes/:id')
    @ApiOperation({ summary: 'Get user note by ID (Vulnerable to IDOR)' })
    async getUserNote(@Param('id') id: string) {
        // Mocking a database lookup
        const notes = {
            '1': { userId: 1, content: 'Admin secret note: The treasure is hidden in the cave.' },
            '2': { userId: 2, content: 'User 2 note: I need to buy milk.' },
            '3': { userId: 3, content: 'User 3 note: Meeting at 5 PM.' },
        };

        const note = notes[id];
        if (!note) {
            throw new HttpException('Note not found', HttpStatus.NOT_FOUND);
        }

        // VULNERABILITY: No check if the current user owns this note!
        return note;
    }

    // INTENTIONAL VULNERABILITY: Weak Role Check
    // Checks for a custom header 'X-Role' instead of the actual JWT role claim.
    // This allows anyone to bypass role restrictions by simply setting this header.
    @Get('admin-data')
    @ApiOperation({ summary: 'Get admin specific data (Vulnerable to Header Manipulation)' })
    async getAdminData(@Req() req: FastifyRequest) {
        const roleHeader = req.headers['x-role'];

        // VULNERABILITY: Trusting client-provided header for authorization
        if (roleHeader !== 'super_admin') {
            // We still return some data, but maybe less? Or just throw a weak error?
            // Let's throw an error to simulate a "check", but a weak one.
            throw new HttpException('Access denied. Requires X-Role: super_admin header.', HttpStatus.FORBIDDEN);
        }

        return {
            secretData: 'This is top secret admin data.',
            adminCodes: [1234, 5678, 9012],
        };
    }
}
