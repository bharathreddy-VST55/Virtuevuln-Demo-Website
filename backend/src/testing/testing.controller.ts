import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';

/**
 * Testing Controller - Dummy endpoints for security testing
 * 
 * This controller provides dummy endpoints that can be enabled/disabled via environment variables.
 * These endpoints are useful for testing tools like httpx, nikto, etc.
 * 
 * To enable/disable these endpoints, set the following environment variable:
 * ENABLE_TESTING_ENDPOINTS=true (to enable)
 * ENABLE_TESTING_ENDPOINTS=false (to disable, default)
 */
@Controller('/api/testing')
@ApiTags('Testing controller')
export class TestingController {
    private readonly isEnabled: boolean;

    constructor() {
        // Check environment variable to enable/disable these endpoints
        this.isEnabled = process.env.ENABLE_TESTING_ENDPOINTS === 'true';
    }

    /**
     * Helper method to check if testing endpoints are enabled
     */
    private checkEnabled(reply: FastifyReply): boolean {
        if (!this.isEnabled) {
            reply.status(HttpStatus.NOT_FOUND).send({
                statusCode: 404,
                message: 'Testing endpoints are disabled. Set ENABLE_TESTING_ENDPOINTS=true to enable.',
                error: 'Not Found'
            });
            return false;
        }
        return true;
    }

    @Get('/bharath')
    @ApiOperation({
        description: 'Dummy endpoint - Returns 200 OK. For testing purposes only.'
    })
    @ApiOkResponse({
        description: 'Success response',
        schema: {
            type: 'object',
            properties: {
                endpoint: { type: 'string' },
                status: { type: 'string' },
                message: { type: 'string' },
                timestamp: { type: 'string' }
            }
        }
    })
    async bharath(@Res({ passthrough: true }) reply: FastifyReply) {
        if (!this.checkEnabled(reply)) return;

        reply.status(HttpStatus.OK);
        return {
            endpoint: 'bharath',
            status: 'success',
            message: 'Bharath endpoint - 200 OK',
            timestamp: new Date().toISOString()
        };
    }

    @Get('/sravan')
    @ApiOperation({
        description: 'Dummy endpoint - Returns 302 Found with redirect. For testing purposes only.'
    })
    @ApiResponse({
        status: 302,
        description: 'Redirect response'
    })
    async sravan(@Res({ passthrough: true }) reply: FastifyReply) {
        if (!this.checkEnabled(reply)) return;

        reply.status(HttpStatus.FOUND);
        reply.header('Location', '/api/testing/bharath');
        return {
            endpoint: 'sravan',
            status: 'redirect',
            message: 'Sravan endpoint - 302 Found',
            redirectTo: '/api/testing/bharath',
            timestamp: new Date().toISOString()
        };
    }

    @Get('/demon')
    @ApiOperation({
        description: 'Dummy endpoint - Returns 200 OK with demon-themed response. For testing purposes only.'
    })
    @ApiOkResponse({
        description: 'Success response with demon theme',
        schema: {
            type: 'object',
            properties: {
                endpoint: { type: 'string' },
                status: { type: 'string' },
                theme: { type: 'string' },
                message: { type: 'string' },
                timestamp: { type: 'string' }
            }
        }
    })
    async demon(@Res({ passthrough: true }) reply: FastifyReply) {
        if (!this.checkEnabled(reply)) return;

        reply.status(HttpStatus.OK);
        return {
            endpoint: 'demon',
            status: 'success',
            theme: 'demon-slayer',
            message: 'Demon endpoint - 200 OK - A powerful demon has appeared!',
            timestamp: new Date().toISOString()
        };
    }

    @Get('/katana')
    @ApiOperation({
        description: 'Dummy endpoint - Returns 302 Found with redirect to demon endpoint. For testing purposes only.'
    })
    @ApiResponse({
        status: 302,
        description: 'Redirect to demon endpoint'
    })
    async katana(@Res({ passthrough: true }) reply: FastifyReply) {
        if (!this.checkEnabled(reply)) return;

        reply.status(HttpStatus.FOUND);
        reply.header('Location', '/api/testing/demon');
        return {
            endpoint: 'katana',
            status: 'redirect',
            theme: 'demon-slayer',
            message: 'Katana endpoint - 302 Found - Strike with the demon blade!',
            redirectTo: '/api/testing/demon',
            timestamp: new Date().toISOString()
        };
    }

    @Get('/status')
    @ApiOperation({
        description: 'Check if testing endpoints are enabled'
    })
    @ApiOkResponse({
        description: 'Testing endpoints status',
        schema: {
            type: 'object',
            properties: {
                enabled: { type: 'boolean' },
                message: { type: 'string' }
            }
        }
    })
    async getStatus() {
        return {
            enabled: this.isEnabled,
            message: this.isEnabled
                ? 'Testing endpoints are enabled'
                : 'Testing endpoints are disabled. Set ENABLE_TESTING_ENDPOINTS=true to enable.'
        };
    }
}
