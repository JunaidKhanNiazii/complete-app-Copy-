# Level System - How to Use

## For Users (Junaid, Zaheer, etc.)

### How to Complete Levels

1. **Do your workout** as normal (Bicep Curl, Lateral Raise, or Squat)
2. **Go to Levels tab** in the app
3. **Tap "Check Latest Workout"** button
4. System will check if your workout meets the current level requirements
5. If complete, you'll get a congratulations message and move to next level!

### Level Requirements

- **Level 1**: 10 Bicep Curl reps
- **Level 2**: 20 Bicep Curl reps  
- **Level 3**: 15 Lateral Raise reps
- **Level 4**: 25 reps each (Bicep Curl + Lateral Raise)
- **Level 5**: 20 Squat reps
- **Level 6**: 30 reps each (Bicep Curl + Squat)
- **Level 7**: 35 reps each (Lateral Raise + Squat)
- **Level 8**: 40 reps each (All 3 exercises)
- **Level 9**: 50 reps each (All 3 exercises)
- **Level 10**: 60 reps each (All 3 exercises)

### Important Notes

- **No time limit** - Complete levels at your own pace
- **One workout at a time** - System checks your latest workout
- **Must meet ALL requirements** - For multi-exercise levels, you need to complete all exercises in one workout
- **Reps count** - Total reps across all sets for that exercise

### Example

If you're on Level 4 (need 25 Bicep Curl + 25 Lateral Raise):
- Do a workout with:
  - Bicep Curl: 30 reps (meets requirement ✅)
  - Lateral Raise: 28 reps (meets requirement ✅)
- Tap "Check Latest Workout"
- Level 4 Complete! Move to Level 5

## Troubleshooting

**Q: I did the exercise but level didn't complete?**
A: Tap the "Check Latest Workout" button on the Levels page

**Q: It says I need more reps?**
A: Check the requirements - you need to meet ALL exercise requirements in ONE workout

**Q: Can I complete a level over multiple days?**
A: No, you need to complete all requirements in a single workout session

**Q: Backend not running?**
A: Restart backend: `cd backend && node index.js`

## For Developers

### Backend Restart Required
After implementing the level system, restart the backend:
```bash
cd backend
node index.js
```

### API Endpoints
- `GET /member/level?userId=X` - Get user's level data
- `POST /member/level/check` - Check if workout completes level
- `GET /member/level/history?userId=X` - Get completed levels

### Database Structure
Users now have a `gamification` field with:
- currentLevel
- totalPoints
- levelProgress
- completedLevels
- exerciseStats
