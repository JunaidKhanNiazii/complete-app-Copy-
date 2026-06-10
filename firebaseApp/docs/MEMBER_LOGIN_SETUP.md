# Member Login Setup & Testing Guide

## Step 1: Restart Backend Server

The backend needs to be restarted to load the new member authentication routes.

```bash
# Stop any running backend
pkill -f "node.*index.js"

# Start backend
cd backend
node index.js
```

Or use the script:
```bash
./RESTART_BACKEND.sh
```

You should see:
```
🚀 Server running at http://localhost:5000
✅ GITHUB_TOKEN is loaded
```

## Step 2: Check Existing Users

First, let's see what users exist in the system:

```bash
curl http://10.17.13.58:5000/users
```

This will show all registered users with their emails and passwords.

## Step 3: Test Member Login API

Test the member login endpoint directly:

```bash
# Replace with actual user email and password from your database
curl -X POST http://10.17.13.58:5000/member/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

Expected response:
```json
{
  "success": true,
  "user": {
    "userId": 1,
    "username": "testuser",
    "name": "Test User",
    "email": "user@example.com",
    "phone": "1234567890",
    "images": ["url1", "url2", "url3", "url4"],
    "joinDate": "2026-02-26",
    "id": "1"
  }
}
```

## Step 4: Create a Test User (If Needed)

If you don't have any users, create one using the registration endpoint:

```bash
curl -X POST http://10.17.13.58:5000/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testmember",
    "name": "Test Member",
    "email": "test@member.com",
    "password": "test123",
    "phone": "1234567890",
    "images": [
      "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
      "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
      "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
      "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
    ]
  }'
```

## Step 5: Test in Mobile App

1. Open the app on your device
2. Go to Member Login screen
3. Enter the email and password of an existing user
4. Tap "Login"

### Expected Behavior:
- ✅ Shows loading indicator
- ✅ If credentials are correct: Shows "Welcome back!" alert and redirects to dashboard
- ❌ If credentials are wrong: Shows "Invalid credentials" error

## Step 6: Verify Login Data

After successful login, the user data is stored in AsyncStorage. You can verify this in the member profile screen.

## Common Issues & Solutions

### Issue 1: "Invalid credentials" error
**Cause**: Backend not running or user doesn't exist
**Solution**: 
1. Restart backend: `cd backend && node index.js`
2. Check if user exists: `curl http://10.17.13.58:5000/users`
3. Verify email/password match exactly

### Issue 2: "Network Error"
**Cause**: Backend URL is wrong or backend not accessible
**Solution**:
1. Check backend is running on port 5000
2. Verify IP address in `login-member.tsx` matches your machine's IP
3. Test: `curl http://10.17.13.58:5000/users`

### Issue 3: Backend routes not found
**Cause**: Backend not restarted after adding new routes
**Solution**: Kill and restart backend server

## Testing Member Features

### 1. Test Member Profile
```bash
# Get member profile (replace 1 with actual userId)
curl http://10.17.13.58:5000/member/profile/1
```

### 2. Test Update Profile
```bash
curl -X PUT http://10.17.13.58:5000/member/profile/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "phone": "9876543210"
  }'
```

### 3. Test Create Workout
```bash
curl -X POST http://10.17.13.58:5000/workouts \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "date": "2026-02-26",
    "exercises": [
      {
        "name": "Bench Press",
        "sets": 3,
        "reps": [10, 8, 6],
        "weight": [50, 60, 70]
      },
      {
        "name": "Squats",
        "sets": 4,
        "reps": [12, 10, 8, 6],
        "weight": [80, 90, 100, 110]
      }
    ],
    "notes": "Great workout today!"
  }'
```

### 4. Test Get User Workouts
```bash
# Get all workouts for user 1
curl http://10.17.13.58:5000/workouts/user/1

# Get workouts for date range
curl "http://10.17.13.58:5000/workouts/user/1?startDate=2026-02-20&endDate=2026-02-26"
```

### 5. Test Workout Statistics
```bash
# Daily stats
curl http://10.17.13.58:5000/workouts/stats/1?period=daily

# Weekly stats
curl http://10.17.13.58:5000/workouts/stats/1?period=weekly

# Monthly stats
curl http://10.17.13.58:5000/workouts/stats/1?period=monthly
```

## Quick Test Commands

```bash
# 1. Check backend is running
curl http://10.17.13.58:5000/users

# 2. Test admin login (should work)
curl -X POST http://10.17.13.58:5000/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"fitzonefyp@gmail.com","password":"junaid123"}'

# 3. Test member login (use actual user credentials)
curl -X POST http://10.17.13.58:5000/member/login \
  -H "Content-Type: application/json" \
  -d '{"email":"USER_EMAIL","password":"USER_PASSWORD"}'
```

## Next Steps After Login Works

1. ✅ Member can login with email/password
2. 🔄 Update member dashboard to show real data
3. 🔄 Create workout entry screen
4. 🔄 Implement workout reports with charts
5. 🔄 Add workout history view
6. 🔄 Add exercise library

## Debug Mode

To see detailed logs, check the terminal where backend is running. You should see:
```
Member login error: Invalid credentials
```
or
```
Member logged in: user@example.com
```

## Support

If you're still having issues:
1. Check backend terminal for error messages
2. Check app console logs (in Expo)
3. Verify Firebase connection is working
4. Test with curl commands first before testing in app
