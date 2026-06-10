# Exercise-Based Level System

## Overview
Users progress through 10 levels by completing specific exercises with increasing rep requirements.

---

## 📊 Level Requirements

### Available Exercises
1. **Bicep Curl**
2. **Lateral Raise**
3. **Squat**

### Level Progression Table

| Level | Exercise Required | Total Reps Required | Points Awarded |
|-------|------------------|---------------------|----------------|
| 1 | Bicep Curl | 10 reps | 10 |
| 2 | Bicep Curl | 20 reps | 20 |
| 3 | Lateral Raise | 15 reps | 30 |
| 4 | Bicep Curl + Lateral Raise | 25 reps each | 50 |
| 5 | Squat | 20 reps | 70 |
| 6 | Bicep Curl + Squat | 30 reps each | 100 |
| 7 | Lateral Raise + Squat | 35 reps each | 140 |
| 8 | All 3 exercises | 40 reps each | 200 |
| 9 | All 3 exercises | 50 reps each | 300 |
| 10 | All 3 exercises | 60 reps each | 500 |

---

## 🎯 How It Works

### Level Completion Logic

1. **User completes workout** with exercises
2. **System checks** if workout meets current level requirements
3. **If requirements met**:
   - Award points
   - Unlock next level
   - Show congratulations
4. **If not met**:
   - Show progress toward current level
   - Display what's needed

### Example: Level 1
```
Requirement: Complete 10 Bicep Curl reps
User's workout: 
  - Bicep Curl: 12 reps ✅
Result: Level 1 Complete! → Move to Level 2
```

### Example: Level 4
```
Requirement: Complete 25 reps each of Bicep Curl + Lateral Raise
User's workout:
  - Bicep Curl: 30 reps ✅
  - Lateral Raise: 20 reps ❌ (need 5 more)
Result: Level 4 Incomplete - Need 5 more Lateral Raise reps
```

---

## 🗄️ Database Schema

### User Gamification Field
```javascript
{
  userId: 4,
  username: "sarfraz",
  
  gamification: {
    currentLevel: 1,
    totalPoints: 0,
    
    levelProgress: {
      level: 1,
      required: {
        "Bicep Curl": 10
      },
      completed: {
        "Bicep Curl": 0
      },
      isComplete: false
    },
    
    completedLevels: [
      // Will store completed levels
      // {
      //   level: 1,
      //   completedAt: "2026-03-02",
      //   pointsEarned: 10
      // }
    ],
    
    exerciseStats: {
      "Bicep Curl": {
        totalReps: 0,
        bestSession: 0,
        lastPerformed: null
      },
      "Lateral Raise": {
        totalReps: 0,
        bestSession: 0,
        lastPerformed: null
      },
      "Squat": {
        totalReps: 0,
        bestSession: 0,
        lastPerformed: null
      }
    }
  }
}
```

---

## 🔧 Implementation Files

### 1. Level Configuration (`backend/config/levelConfig.js`)
```javascript
const LEVEL_REQUIREMENTS = {
  1: {
    exercises: { "Bicep Curl": 10 },
    points: 10,
    badge: "Beginner"
  },
  2: {
    exercises: { "Bicep Curl": 20 },
    points: 20,
    badge: "Novice"
  },
  3: {
    exercises: { "Lateral Raise": 15 },
    points: 30,
    badge: "Learner"
  },
  4: {
    exercises: { "Bicep Curl": 25, "Lateral Raise": 25 },
    points: 50,
    badge: "Intermediate"
  },
  5: {
    exercises: { "Squat": 20 },
    points: 70,
    badge: "Advanced"
  },
  6: {
    exercises: { "Bicep Curl": 30, "Squat": 30 },
    points: 100,
    badge: "Expert"
  },
  7: {
    exercises: { "Lateral Raise": 35, "Squat": 35 },
    points: 140,
    badge: "Master"
  },
  8: {
    exercises: { "Bicep Curl": 40, "Lateral Raise": 40, "Squat": 40 },
    points: 200,
    badge: "Elite"
  },
  9: {
    exercises: { "Bicep Curl": 50, "Lateral Raise": 50, "Squat": 50 },
    points: 300,
    badge: "Champion"
  },
  10: {
    exercises: { "Bicep Curl": 60, "Lateral Raise": 60, "Squat": 60 },
    points: 500,
    badge: "Legend"
  }
};
```

### 2. Level Service (`backend/services/levelService.js`)
- Check if workout completes current level
- Calculate progress
- Award points and unlock next level
- Fetch user's exercise history from database

### 3. Level Routes (`backend/routes/levelRoutes.js`)
- GET `/member/level` - Get current level & progress
- POST `/member/level/check` - Check if workout completes level
- GET `/member/level/history` - Get completed levels

### 4. Frontend Level Page (`app/(member)/levels.tsx`)
- Display current level
- Show requirements
- Display progress bars
- Show all 10 levels (locked/unlocked)
- Show total points

---

## 📱 UI Design

### Level Page Layout
```
┌─────────────────────────────────────┐
│  Your Level Progress                │
├─────────────────────────────────────┤
│                                     │
│  Current Level: 3                   │
│  Total Points: 60                   │
│  Badge: Learner 🎓                  │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Level 3 Requirements       │   │
│  │  Lateral Raise: 15 reps     │   │
│  │  ████████░░ 12/15 reps      │   │
│  │  Need 3 more reps!          │   │
│  └─────────────────────────────┘   │
│                                     │
│  All Levels:                        │
│  ✅ Level 1 - Beginner (10 pts)    │
│  ✅ Level 2 - Novice (20 pts)      │
│  🔄 Level 3 - Learner (30 pts)     │
│  🔒 Level 4 - Intermediate         │
│  🔒 Level 5 - Advanced             │
│  🔒 Level 6 - Expert               │
│  🔒 Level 7 - Master               │
│  🔒 Level 8 - Elite                │
│  🔒 Level 9 - Champion             │
│  🔒 Level 10 - Legend              │
│                                     │
└─────────────────────────────────────┘
```

---

## 🔄 Workflow

### When User Completes Workout

1. **Workout saved** to database
   ```javascript
   {
     exercises: [
       { name: "Bicep Curl", reps: 12 },
       { name: "Lateral Raise", reps: 8 }
     ]
   }
   ```

2. **Backend checks** current level requirements
   - User is on Level 3
   - Requires: Lateral Raise 15 reps
   - User did: Lateral Raise 8 reps
   - Result: Not complete (need 7 more)

3. **Update progress** in database
   ```javascript
   levelProgress: {
     level: 3,
     completed: { "Lateral Raise": 8 },
     required: { "Lateral Raise": 15 }
   }
   ```

4. **Show feedback** to user
   - "Great work! 7 more Lateral Raise reps to complete Level 3!"

### When Level is Completed

1. **Award points** (30 for Level 3)
2. **Unlock next level** (Level 4)
3. **Show celebration** animation
4. **Update badge** (Learner → Intermediate)

---

## 🚀 Implementation Steps

### Step 1: Backend Setup (2-3 hours)
1. Create `backend/config/levelConfig.js`
2. Create `backend/services/levelService.js`
3. Create `backend/routes/levelRoutes.js`
4. Update `backend/index.js` to include routes
5. Add gamification field to existing users

### Step 2: Frontend Page (2-3 hours)
1. Create `app/(member)/levels.tsx`
2. Add navigation tab/button
3. Create level card components
4. Add progress bars
5. Add animations

### Step 3: Integration (1-2 hours)
1. Call level check after workout save
2. Show level-up notification
3. Update dashboard with level widget
4. Test with real workout data

---

## ✅ Quick Start Checklist

- [ ] Create level configuration file
- [ ] Create level service (check requirements)
- [ ] Create API routes
- [ ] Create frontend levels page
- [ ] Add navigation to levels page
- [ ] Test with existing workout data
- [ ] Add level-up notifications

---

**Total Implementation Time**: 5-8 hours
**Complexity**: Medium
**Dependencies**: Existing workout data in Firebase

Ready to implement? I'll start with the backend!
