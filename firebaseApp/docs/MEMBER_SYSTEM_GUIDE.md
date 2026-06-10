# Member Authentication & Workout Tracking System

## Overview
Complete member authentication system with workout tracking, profile management, and reporting features.

## Firebase Structure

### 1. Users Collection (`users`)
```
users/
  {userId}/
    - userId: number (auto-increment)
    - username: string
    - name: string
    - email: string (unique, used for login)
    - password: string
    - phone: string
    - images: array[4] (profile images from GitHub)
    - joinDate: string (YYYY-MM-DD)
    - createdAt: timestamp
    - updatedAt: timestamp
```

### 2. Workouts Collection (`workouts`)
```
workouts/
  {workoutId}/
    - userId: number (reference to user)
    - date: string (YYYY-MM-DD)
    - exercises: array [
        {
          name: string (e.g., "Bench Press")
          sets: number
          reps: array (e.g., [10, 8, 6])
          weight: array (e.g., [50, 60, 70])
        }
      ]
    - notes: string
    - totalSets: number (calculated)
    - totalExercises: number (calculated)
    - createdAt: timestamp
    - updatedAt: timestamp
```

## Backend API Endpoints

### Member Authentication
```
POST /member/login
Body: { email, password }
Response: { success: true, user: {...} }

GET /member/profile/:userId
Response: { success: true, user: {...} }

PUT /member/profile/:userId
Body: { name, email, phone, password, images }
Response: { success: true, message: "Profile updated" }
```

### Workout Management
```
POST /workouts
Body: { userId, date, exercises: [...], notes }
Response: { success: true, workoutId: "..." }

GET /workouts/user/:userId?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
Response: { success: true, workouts: [...], count: number }

GET /workouts/:workoutId
Response: { success: true, workout: {...} }

PUT /workouts/:workoutId
Body: { exercises: [...], notes }
Response: { success: true, message: "Workout updated" }

DELETE /workouts/:workoutId
Response: { success: true, message: "Workout deleted" }

GET /workouts/stats/:userId?period=daily|weekly|monthly
Response: {
  success: true,
  period: "weekly",
  stats: {
    totalWorkouts: number,
    totalExercises: number,
    totalSets: number,
    workoutsByDate: {...},
    exerciseFrequency: {...}
  }
}
```

## Frontend Implementation

### 1. Member Login
- File: `app/(auth)/login-member.tsx`
- Features:
  - Email/password authentication
  - Show/hide password toggle
  - Stores user data in AsyncStorage
  - Redirects to member dashboard on success

### 2. Member Profile
- File: `app/(member)/profile.tsx`
- Features:
  - View profile information
  - Edit profile (name, email, phone, password)
  - Upload/update profile images
  - Theme toggle (light/dark mode)
  - Logout functionality

### 3. Member Dashboard
- File: `app/(member)/dashboard.tsx`
- Features to implement:
  - Display today's workout
  - Show workout streak
  - Quick stats (total workouts, exercises)
  - Recent workout history
  - Quick action buttons (Start Workout, View Reports)

### 4. Workout Reports
- File: `app/(member)/reports.tsx`
- Features to implement:
  - Daily report: Today's workout details
  - Weekly report: Last 7 days summary with chart
  - Monthly report: Last 30 days summary with chart
  - Exercise frequency chart
  - Progress tracking

## Example Workout Data Structure

```javascript
// Creating a workout
{
  userId: 1,
  date: "2026-02-26",
  exercises: [
    {
      name: "Bench Press",
      sets: 3,
      reps: [10, 8, 6],
      weight: [50, 60, 70]
    },
    {
      name: "Squats",
      sets: 4,
      reps: [12, 10, 8, 6],
      weight: [80, 90, 100, 110]
    }
  ],
  notes: "Good workout, felt strong today"
}
```

## Usage Flow

### Member Registration (Already Implemented)
1. User fills registration form with 4 images
2. Images uploaded to GitHub
3. User created in Firestore with auto-increment userId
4. User can now login with email/password

### Member Login
1. User enters email and password
2. Backend validates credentials
3. User data stored in AsyncStorage
4. Redirect to member dashboard

### Creating a Workout
1. Member logs in
2. Navigates to workout screen
3. Selects exercises and enters sets/reps/weight
4. Saves workout to Firestore
5. Workout appears in dashboard and reports

### Viewing Reports
1. Member navigates to reports screen
2. Selects period (daily/weekly/monthly)
3. Backend fetches workouts for period
4. Frontend displays statistics and charts
5. Shows exercise frequency and progress

## Next Steps

1. **Update Member Dashboard**: Display real workout data
2. **Create Workout Entry Screen**: Allow members to log workouts
3. **Implement Reports Screen**: Show daily/weekly/monthly statistics
4. **Add Charts**: Use react-native-chart-kit for visual reports
5. **Add Workout History**: List all past workouts
6. **Add Exercise Library**: Predefined exercises to choose from

## Testing

### Test Member Login
```bash
curl -X POST http://localhost:5000/member/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Test Create Workout
```bash
curl -X POST http://localhost:5000/workouts \
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
      }
    ],
    "notes": "Good workout"
  }'
```

### Test Get Workout Stats
```bash
curl http://localhost:5000/workouts/stats/1?period=weekly
```

## Security Notes

- Passwords are currently stored in plain text (should use bcrypt in production)
- No JWT tokens implemented (should add for production)
- No rate limiting (should add for production)
- Images stored in public GitHub repo (consider private storage for production)
