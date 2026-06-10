# Gamification System - Level & Rewards Plan

## Overview
A 10-level progression system where users earn points through workouts and unlock rewards at each level.

---

## 📊 Level System Structure

### Level Progression Table

| Level | Points Required | Total Points | Workouts Needed* | Reward |
|-------|----------------|--------------|------------------|---------|
| 1 | 0 | 0 | 0 | Welcome Badge |
| 2 | 100 | 100 | 10 | Bronze Badge |
| 3 | 250 | 350 | 25 | Workout Streak Tracker |
| 4 | 400 | 750 | 50 | Silver Badge |
| 5 | 600 | 1,350 | 90 | Custom Avatar Frame |
| 6 | 800 | 2,150 | 140 | Gold Badge |
| 7 | 1,000 | 3,150 | 200 | Advanced Stats Unlock |
| 8 | 1,500 | 4,650 | 300 | Platinum Badge |
| 9 | 2,000 | 6,650 | 430 | VIP Member Status |
| 10 | 3,000 | 9,650 | 630 | Diamond Badge + Champion Title |

*Assuming 10 points per workout (can be adjusted)

---

## 🎯 Points System

### How Users Earn Points

1. **Workout Completion**: 10 points
2. **Workout Duration Bonus**:
   - 30+ minutes: +5 points
   - 60+ minutes: +10 points
3. **Streak Bonuses**:
   - 3 days streak: +20 points
   - 7 days streak: +50 points
   - 30 days streak: +200 points
4. **Exercise Variety**: +5 points (if 5+ different exercises)
5. **Personal Best**: +15 points (beat previous record)
6. **Daily Goal**: +10 points (complete daily target)

### Point Calculation Example
```
Base workout: 10 points
Duration 45 min: +5 points
5 exercises: +5 points
Total: 20 points per workout
```

---

## 🎁 Rewards System

### Level 1: Welcome Badge
- **Unlock**: Start
- **Reward**: Welcome badge, tutorial access

### Level 2: Bronze Badge
- **Unlock**: 100 points
- **Reward**: Bronze badge, basic stats

### Level 3: Workout Streak Tracker
- **Unlock**: 350 points
- **Reward**: Streak counter, calendar view

### Level 4: Silver Badge
- **Unlock**: 750 points
- **Reward**: Silver badge, workout history

### Level 5: Custom Avatar Frame
- **Unlock**: 1,350 points
- **Reward**: 3 avatar frames to choose from

### Level 6: Gold Badge
- **Unlock**: 2,150 points
- **Reward**: Gold badge, advanced charts

### Level 7: Advanced Stats Unlock
- **Unlock**: 3,150 points
- **Reward**: Muscle group analysis, progress predictions

### Level 8: Platinum Badge
- **Unlock**: 4,650 points
- **Reward**: Platinum badge, workout recommendations

### Level 9: VIP Member Status
- **Unlock**: 6,650 points
- **Reward**: VIP badge, priority support, exclusive features

### Level 10: Diamond Badge + Champion Title
- **Unlock**: 9,650 points
- **Reward**: Diamond badge, "Champion" title, leaderboard highlight

---

## 🗄️ Database Schema

### User Profile Updates
```javascript
{
  userId: 4,
  username: "sarfraz",
  email: "sarfraz@gmail.com",
  
  // NEW FIELDS
  gamification: {
    level: 1,
    currentPoints: 0,
    totalPoints: 0,
    pointsToNextLevel: 100,
    
    badges: [
      {
        id: "welcome",
        name: "Welcome Badge",
        earnedAt: "2026-03-02",
        level: 1
      }
    ],
    
    rewards: [
      {
        id: "welcome_badge",
        type: "badge",
        unlockedAt: "2026-03-02"
      }
    ],
    
    streaks: {
      current: 3,
      longest: 7,
      lastWorkoutDate: "2026-03-02"
    },
    
    achievements: [
      {
        id: "first_workout",
        name: "First Step",
        description: "Complete your first workout",
        earnedAt: "2026-02-24"
      }
    ]
  }
}
```

---

## 🔧 Implementation Plan

### Phase 1: Backend Setup (Day 1-2)

1. **Update User Schema**
   - Add gamification fields to user documents
   - Create default values for new users

2. **Create Points Service** (`backend/services/pointsService.js`)
   - Calculate points for workouts
   - Handle level progression
   - Award badges and rewards

3. **Create Gamification Routes** (`backend/routes/gamificationRoutes.js`)
   - GET `/member/gamification` - Get user level & points
   - POST `/member/points/calculate` - Calculate points for workout
   - GET `/member/badges` - Get all badges
   - GET `/member/rewards` - Get unlocked rewards

4. **Update Workout Controller**
   - Auto-calculate points when workout is saved
   - Update user level if threshold reached
   - Award badges automatically

### Phase 2: Frontend UI (Day 3-4)

1. **Create Level Display Component**
   - Progress bar showing current level
   - Points to next level
   - Current level badge

2. **Create Badges Screen** (`app/(member)/badges.tsx`)
   - Display all 10 levels
   - Show locked/unlocked badges
   - Show rewards for each level

3. **Update Dashboard**
   - Add level widget at top
   - Show recent achievements
   - Display current streak

4. **Create Rewards Screen** (`app/(member)/rewards.tsx`)
   - Show unlocked rewards
   - Display available avatar frames
   - Show achievement history

### Phase 3: Gamification Logic (Day 5)

1. **Points Calculation**
   - Implement point rules
   - Add bonus calculations
   - Handle streak tracking

2. **Level Progression**
   - Auto-level up when threshold reached
   - Show level-up animation
   - Award rewards automatically

3. **Notifications**
   - Level up notification
   - Badge earned notification
   - Streak milestone notification

---

## 📱 UI/UX Design

### Dashboard Widget
```
┌─────────────────────────────────┐
│  Level 3 - Rising Star          │
│  ████████░░░░░░░░░░ 350/750 pts │
│  🥉 Bronze Badge                │
└─────────────────────────────────┘
```

### Badges Screen
```
┌─────────────────────────────────┐
│  Your Progress                   │
│                                  │
│  ✅ Level 1 - Welcome Badge      │
│  ✅ Level 2 - Bronze Badge       │
│  ✅ Level 3 - Streak Tracker     │
│  🔒 Level 4 - Silver Badge       │
│      Need 400 more points        │
│  🔒 Level 5 - Avatar Frame       │
│  🔒 Level 6 - Gold Badge         │
│  ...                             │
└─────────────────────────────────┘
```

---

## 🎨 Visual Assets Needed

1. **Badge Icons**
   - Welcome badge (🎯)
   - Bronze badge (🥉)
   - Silver badge (🥈)
   - Gold badge (🥇)
   - Platinum badge (💎)
   - Diamond badge (💠)

2. **Level Icons**
   - Progress bars
   - Level up animation
   - Confetti effect

3. **Avatar Frames**
   - 3 frame designs for Level 5

---

## 🔄 User Flow

### Workout Completion Flow
```
1. User completes workout
   ↓
2. Backend calculates points
   - Base points: 10
   - Duration bonus: +5
   - Variety bonus: +5
   - Total: 20 points
   ↓
3. Add points to user total
   - Current: 330 points
   - New: 350 points
   ↓
4. Check level threshold
   - Level 3 requires 350 points ✅
   ↓
5. Level up!
   - Update level: 2 → 3
   - Award badge: Streak Tracker
   - Show notification
   ↓
6. Return to dashboard
   - Show level up animation
   - Display new badge
```

---

## 📊 Analytics & Tracking

### Admin Dashboard Additions
- Average user level
- Points distribution chart
- Badge unlock rates
- Most active users (by level)
- Level progression timeline

---

## 🚀 Future Enhancements

1. **Leaderboards**
   - Weekly top performers
   - Monthly champions
   - All-time leaders

2. **Challenges**
   - Weekly challenges (50 points)
   - Monthly challenges (200 points)
   - Special event challenges

3. **Social Features**
   - Share achievements
   - Challenge friends
   - Team competitions

4. **Premium Rewards**
   - Exclusive badges
   - Custom themes
   - Advanced analytics

---

## ✅ Implementation Checklist

### Backend
- [ ] Update user schema with gamification fields
- [ ] Create pointsService.js
- [ ] Create gamificationRoutes.js
- [ ] Update workoutController.js
- [ ] Add level calculation logic
- [ ] Add badge awarding logic
- [ ] Create migration script for existing users

### Frontend
- [ ] Create Level component
- [ ] Create Badges screen
- [ ] Create Rewards screen
- [ ] Update Dashboard with level widget
- [ ] Add level-up animation
- [ ] Add badge notification
- [ ] Create progress bar component

### Testing
- [ ] Test point calculation
- [ ] Test level progression
- [ ] Test badge awarding
- [ ] Test streak tracking
- [ ] Test with existing users

---

## 📝 Notes

- Start with simple point system, add complexity later
- Make sure existing users get retroactive points
- Keep UI simple and motivating
- Test thoroughly before launch
- Consider soft launch with beta users

---

**Estimated Development Time**: 5-7 days
**Priority**: Medium-High (Great for user engagement)
**Complexity**: Medium

Would you like me to start implementing this system?
