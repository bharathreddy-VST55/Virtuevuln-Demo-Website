# Super Admin Login Test Guide

## Test Credentials

**Email:** `admin@demonslayer.com`  
**Password:** `admin123`  
**Role:** `super_admin`

## Expected Behavior

1. **Login Process:**
   - Go to login page (`/userlogin` or `/newuserlogin`)
   - Enter email: `admin@demonslayer.com`
   - Enter password: `admin123`
   - After successful login, you should be **automatically redirected** to `/dashboard`

2. **After Login:**
   - You should see the **Admin Sidebar Layout** with:
     - Sidebar navigation on the left
     - Admin Dashboard content on the right
   - You should **NOT** see the public website header/navigation
   - You should **NOT** be able to access public pages (Home, Hashiras, Demons, Characters, Shop)

3. **Available Pages for Super Admin:**
   - `/dashboard` - Admin Dashboard (Overview, Users, Missions)
   - `/userprofile` - Edit Profile page

4. **If You Try to Access Public Pages:**
   - Accessing `/`, `/hashiras`, `/demons`, `/characters`, or `/shop` should automatically redirect you back to `/dashboard`

## Troubleshooting

### If redirect doesn't work:

1. **Check Browser Console:**
   - Open browser DevTools (F12)
   - Check Console tab for any errors
   - Look for messages like "User permissions:" or "Redirecting super admin to dashboard"

2. **Verify User Exists:**
   - The user should be created automatically when the database initializes
   - If not, check `infrastructure/pg.sql` for the INSERT statement

3. **Check API Response:**
   - After login, check Network tab in DevTools
   - Look for `/api/users/one/admin@demonslayer.com` response
   - Verify it includes `"role": "super_admin"`

4. **Manual Test:**
   - After login, manually navigate to `/dashboard`
   - You should see the admin interface

## Alternative Login Methods

### Method 1: Standard Login (`/userlogin`)
- Enter email and password
- Should redirect to dashboard automatically

### Method 2: Two-Step Login (`/newuserlogin`)
- Step 1: Enter email
- Step 2: Enter password
- Should redirect to dashboard automatically

## Verification Steps

1. ✅ Login with `admin@demonslayer.com` / `admin123`
2. ✅ Verify redirect to `/dashboard`
3. ✅ Verify admin sidebar is visible
4. ✅ Verify public header/navigation is hidden
5. ✅ Try accessing `/` - should redirect to dashboard
6. ✅ Check profile page - should show "⚔️ Super Admin" role
