# Role System Guide - Demon Slayers Application

## Overview

The Demon Slayers application implements a role-based access control (RBAC) system with four distinct user roles, each with specific permissions and responsibilities.

## User Roles

### 1. **Super Admin** (`super_admin`)
- **Full system access** - Can create, edit, and manage all users
- **Dashboard access** - Comprehensive admin dashboard with statistics
- **User management** - Create accounts for Hashiras and Demon Slayer Corps members
- **Mission monitoring** - View all missions and statistics
- **Default credentials:**
  - Email: `admin`
  - Password: `admin`
  - Role: `super_admin`

### 2. **Hashira** (`hashira`)
- **Mission assignment** - Can assign missions to Demon Slayer Corps members
- **Chat visibility** - Can see all chat messages between Demon Slayer Corps and People
- **Mission types:**
  - Kill Demon
  - Gather Intel
  - Protect Location
  - Investigate
- **Account creation:** Must be created by Super Admin

### 3. **Demon Slayer Corps** (`demon_slayer_corps`)
- **Mission reception** - Can receive and complete missions assigned by Hashiras
- **Chat participation** - Can participate in public and private chats
- **Mission tracking** - Can view assigned missions and update status
- **Account creation:** Must be created by Super Admin

### 4. **People** (`people`)
- **Public access** - Can view pages (Home, Hashiras, Demons, Characters, Shop)
- **Chat participation** - Can participate in public chats
- **Shop access** - Can browse and purchase items
- **Account creation:** Can self-register through the signup page
- **Default credentials (for testing):**
  - Email: `user`
  - Password: `user`
  - Role: `people`

## Login Credentials

### Default Accounts

1. **Super Admin Account**
   ```
   Email: admin
   Password: admin
   Role: super_admin
   ```

2. **People Account (for testing)**
   ```
   Email: user
   Password: user
   Role: people
   ```

### Creating New Accounts

#### For People (Self-Registration)
1. Navigate to the signup page (`/usersignup`)
2. Fill in the registration form
3. Submit to create account with `people` role

#### For Hashiras and Demon Slayer Corps (Admin Only)
1. Login as Super Admin (`admin` / `admin`)
2. Navigate to Dashboard (`/dashboard`)
3. Click on "Users" tab
4. Click "Create User" button
5. Fill in the form and select the appropriate role:
   - `hashira` for Hashira accounts
   - `demon_slayer_corps` for Demon Slayer Corps accounts
6. Submit to create the account

## Admin Dashboard Features

The Super Admin dashboard (`/dashboard`) provides:

### Overview Tab
- **User Statistics:**
  - Total users
  - Count by role (Super Admin, Hashira, Demon Slayer Corps, People)
- **Mission Statistics:**
  - Total missions
  - Missions by status (Pending, In Progress, Completed, Cancelled)
  - Missions by type

### Users Tab
- View all users with their roles
- Create new users with specific roles
- Filter and search users

### Missions Tab
- View all missions in the system
- See mission details:
  - Title and description
  - Mission type
  - Status
  - Assigned by (Hashira)
  - Assigned to (Demon Slayer Corps member)
  - Location

## API Endpoints

### Admin Endpoints (Super Admin Only)

#### Create User with Role
```
POST /api/users/admin/create
Body: {
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role: 'hashira' | 'demon_slayer_corps' | 'people' | 'super_admin',
  company: string,
  cardNumber: string,
  phoneNumber: string,
  op: 'basic'
}
```

#### Get User Statistics
```
GET /api/users/admin/stats
Returns: {
  total: number,
  superAdmin: number,
  hashira: number,
  demonSlayerCorps: number,
  people: number
}
```

#### Get All Users
```
GET /api/users/admin/all
Returns: Array of User objects with roles
```

#### Get Users by Role
```
GET /api/users/admin/by-role/:role
Returns: Array of User objects filtered by role
```

### Mission Endpoints

#### Get All Missions
```
GET /api/missions
Returns: Array of Mission objects
```

#### Get Mission Statistics
```
GET /api/missions/stats
Returns: {
  total: number,
  pending: number,
  inProgress: number,
  completed: number,
  cancelled: number,
  byType: Record<string, number>
}
```

#### Create Mission (Hashira Only)
```
POST /api/missions
Body: {
  title: string,
  description: string,
  missionType: 'kill_demon' | 'gather_intel' | 'protect_location' | 'investigate',
  assignedToId?: number,
  location?: string,
  notes?: string
}
```

## Navigation Structure

### Public Pages (No Login Required)
- Home (`/`)
- Hashiras (`/hashiras`)
- Demons (`/demons`)
- Characters (`/characters/tanjiro`)
- Shop (`/shop`)

### Login Required Pages
- Chat (`/chat`) - All logged-in users
- Edit User Data (`/userprofile`) - All logged-in users
- Admin Page (`/adminpage`) - Admin users only
- Dashboard (`/dashboard`) - Super Admin only

## Security Notes

⚠️ **This is a vulnerable application for VAPT training purposes.**

The application intentionally includes vulnerabilities for security testing:
- SQL Injection vulnerabilities
- XSS (Cross-Site Scripting) vulnerabilities
- Authentication bypass vulnerabilities
- Mass assignment vulnerabilities

**Note:** The application does NOT include:
- Remote Code Execution (RCE)
- Server-Side Template Injection (SSTI)
- System access vulnerabilities

## Database Schema

### User Table
```sql
CREATE TABLE "user" (
  "id" SERIAL PRIMARY KEY,
  "email" VARCHAR(255) NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "first_name" VARCHAR(255) NOT NULL,
  "last_name" VARCHAR(255) NOT NULL,
  "is_admin" BOOLEAN NOT NULL,
  "role" VARCHAR(50) NOT NULL DEFAULT 'people',
  ...
);
```

### Mission Table
```sql
CREATE TABLE "mission" (
  "id" SERIAL PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "description" TEXT NOT NULL,
  "mission_type" VARCHAR(50) NOT NULL DEFAULT 'kill_demon',
  "status" VARCHAR(50) NOT NULL DEFAULT 'pending',
  "assigned_by_id" INT NOT NULL,
  "assigned_to_id" INT NULL,
  "location" VARCHAR(255) NULL,
  "notes" TEXT NULL,
  "completed_at" TIMESTAMPTZ NULL,
  ...
);
```

## Troubleshooting

### Cannot Access Dashboard
- Ensure you are logged in as Super Admin
- Check that your account has `role = 'super_admin'` in the database
- Verify JWT token is valid

### Cannot Create Users
- Ensure you are logged in as Super Admin
- Check that the email doesn't already exist
- Verify all required fields are provided

### Missions Not Showing
- Ensure missions exist in the database
- Check that you have proper permissions
- Verify API endpoints are accessible

## Support

For issues or questions, refer to the main project documentation or contact the development team.

