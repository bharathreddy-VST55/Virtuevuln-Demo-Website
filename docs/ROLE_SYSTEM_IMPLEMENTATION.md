# Role System Implementation Guide

## Overview
This document outlines the implementation of the role-based system for the Demon Slayers application.

## User Roles

1. **SUPER_ADMIN** - Can create all types of users, edit rights, see stats
2. **HASHIRA** - Can assign missions to Demon Slayers, see chat between Demon Slayer Corps and People
3. **DEMON_SLAYER_CORPS** - Can receive missions, participate in chat
4. **PEOPLE** - Can view pages and shop, participate in chat (intentionally vulnerable for VAPT)

## Database Schema Changes

### User Entity
- Added `role` field (enum: super_admin, hashira, demon_slayer_corps, people)
- Default role: `people`

### Mission Entity (New)
- `title`, `description`, `missionType`, `status`
- `assignedBy` (Hashira), `assignedTo` (Demon Slayer Corps)
- `location`, `notes`, `completedAt`

### ChatMessage Entity (New)
- `message`, `sender`, `senderRole`
- `recipientId` (for direct messages)
- `isPublic` (visible to Hashiras)
- `hashiraImage` (path to Hashira image)

## Implementation Status

### Completed
- ✅ User entity updated with role field
- ✅ Mission entity created
- ✅ ChatMessage entity created
- ✅ ORM module updated
- ✅ UsersService updated with role methods
- ✅ Navigation structure updated

### Pending
- ⏳ Database migration script
- ⏳ Mission service and controller
- ⏳ Chat service and controller (with Hashira images)
- ⏳ Frontend role-based UI
- ⏳ Super Admin dashboard
- ⏳ Intentional vulnerabilities (SQL injection, XSS, auth bypass)

## Next Steps

1. Create database migration to add role column
2. Create MissionService and MissionController
3. Update ChatService to support role-based chat with Hashira images
4. Create Super Admin dashboard component
5. Add intentional vulnerabilities for VAPT training

