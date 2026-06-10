# Reports Page Data Display Fix

## Problem
The reports page was loading workout data initially but then the data would disappear automatically. The issue occurred across all three filters (Daily, Weekly, Monthly).

## Root Causes Identified

### 1. Date Range Calculation Issues
- The Weekly and Monthly filters weren't setting the start time to midnight (00:00:00)
- This could cause inconsistent date comparisons with the backend

### 2. State Management
- The `expanded` state wasn't being reset when filters changed
- No auto-expansion of the first date when data loaded
- React wasn't properly tracking which items should be expanded

### 3. Insufficient Logging
- Limited console logging made it difficult to debug data flow
- Couldn't see what the API was returning vs what was being displayed

## Changes Made

### 1. Enhanced Date Range Calculation (`app/(member)/reports.tsx`)
```typescript
if (timeFilter === 'Daily') {
    // For daily, get today's date only
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
} else if (timeFilter === 'Weekly') {
    startDate.setDate(endDate.getDate() - 7);
    startDate.setHours(0, 0, 0, 0);  // ← Added
} else if (timeFilter === 'Monthly') {
    startDate.setDate(endDate.getDate() - 30);
    startDate.setHours(0, 0, 0, 0);  // ← Added
}
```

### 2. Comprehensive Logging
Added detailed console logs to track:
- Which filter is active
- Date range being queried
- User ID being used
- API response data
- Number of workouts found
- Workout dates returned

```typescript
console.log(`[Reports] Fetching workouts for ${timeFilter}`);
console.log(`[Reports] Date range: ${startDateStr} to ${endDateStr}`);
console.log(`[Reports] User ID: ${userData.userId || userData.id}`);
console.log(`[Reports] API Response:`, response.data);
console.log(`[Reports] Found ${workouts.length} workouts for ${timeFilter}`);
console.log(`[Reports] Workout dates:`, workouts.map(w => w.date));
```

### 3. Auto-Expand First Date
Added a useEffect to automatically expand the first (most recent) date when workouts load:

```typescript
// Auto-expand first date when workouts load or filter changes
useEffect(() => {
    if (workoutsData.length > 0) {
        const dates = Object.keys(groupedWorkouts).sort().reverse();
        if (dates.length > 0) {
            setExpanded(dates[0]);
        }
    } else {
        setExpanded(null);
    }
}, [workoutsData, timeFilter]);
```

### 4. Removed Auto-Expand for Daily Filter
Changed this line to ensure consistent behavior across all filters:
```typescript
// Before:
const isExpanded = expanded === date || timeFilter === 'Daily';

// After:
const isExpanded = expanded === date;
```

## Testing Instructions

### 1. Start the Backend
```bash
cd backend
npm start
```

### 2. Start the Frontend
```bash
npm start -- --clear
```

### 3. Test Each Filter

#### Daily Filter Test:
1. Login as a member (e.g., junaidameerkhan555@gmail.com)
2. Go to Reports tab
3. Select "Daily" filter
4. Check console logs for:
   - `[Reports] Fetching workouts for Daily`
   - `[Reports] Date range: 2026-02-27 to 2026-02-27` (today's date)
   - `[Reports] Found X workouts for Daily`
5. Verify workouts are displayed and stay visible
6. The most recent date should be auto-expanded

#### Weekly Filter Test:
1. Select "Weekly" filter
2. Check console logs for:
   - `[Reports] Fetching workouts for Weekly`
   - `[Reports] Date range: 2026-02-20 to 2026-02-27` (7 days ago to today)
   - `[Reports] Found X workouts for Weekly`
3. Verify all workouts from the past 7 days are shown
4. Verify the line chart displays correctly
5. The most recent date should be auto-expanded

#### Monthly Filter Test:
1. Select "Monthly" filter
2. Check console logs for:
   - `[Reports] Fetching workouts for Monthly`
   - `[Reports] Date range: 2026-01-28 to 2026-02-27` (30 days ago to today)
   - `[Reports] Found X workouts for Monthly`
3. Verify all workouts from the past 30 days are shown
4. The most recent date should be auto-expanded

### 4. Test Data Persistence
1. Switch between filters multiple times
2. Verify data doesn't disappear after switching
3. Check that the correct date range is queried each time
4. Verify the expanded state resets appropriately

## Backend Test Script

A test script has been created to verify backend data:

```bash
cd backend
node test-reports-data.js
```

This will test all three date ranges and show:
- Number of workouts found
- Workout dates
- Sample workout structure

## Expected Console Output

When working correctly, you should see logs like:

```
[Reports] Fetching workouts for Daily
[Reports] Date range: 2026-02-27 to 2026-02-27
[Reports] User ID: 3
[Reports] API Response: { success: true, workouts: [...], count: 2 }
[Reports] Found 2 workouts for Daily
[Reports] Workout dates: ["2026-02-27", "2026-02-27"]
```

## Troubleshooting

### If data still disappears:

1. **Check Backend Connection**
   - Verify backend is running on `http://10.17.13.58:5000`
   - Test with: `curl http://10.17.13.58:5000/workouts/user/3?startDate=2026-02-27&endDate=2026-02-27`

2. **Check User ID**
   - Verify the logged-in user has a valid `userId` or `id` field
   - Check console for: `[Reports] User ID: X`

3. **Check Workout Data Structure**
   - Workouts should be in subcollections: `users/{userId}/workouts/{workoutId}`
   - Each workout should have a `date` field in format: `YYYY-MM-DD`

4. **Check Date Ranges**
   - Verify the date range in console logs matches expected dates
   - Ensure workout dates fall within the queried range

5. **Clear Metro Cache**
   ```bash
   npm start -- --clear
   ```

### If no workouts are found:

1. Check if the user actually has workouts in Firebase
2. Verify the workout dates match the filter date range
3. Check if Firestore indexes are created (see backend logs)
4. Test with the backend test script to isolate frontend vs backend issues

## Files Modified

- `app/(member)/reports.tsx` - Enhanced logging, fixed date ranges, added auto-expand
- `backend/test-reports-data.js` - New test script for backend verification

## Next Steps

After testing, if issues persist:
1. Share the console logs showing the `[Reports]` messages
2. Verify what data is actually in Firebase for the test user
3. Check if the issue is with data fetching or data display
4. Test with different users to see if it's user-specific
