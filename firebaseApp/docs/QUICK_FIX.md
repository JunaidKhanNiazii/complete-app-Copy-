# 🔧 Quick Fix for Errors

## Error 1: "Cannot POST /admin/login"

**Problem**: Backend needs to be restarted to load new admin routes.

**Solution**:
```bash
# Stop the backend (Ctrl+C)
cd backend
node index.js
```

You should see:
```
✅ GITHUB_TOKEN is loaded
🚀 Server running at http://localhost:5000
```

## Error 2: Syntax Error in login-member.tsx

**Problem**: Metro bundler cache is stale.

**Solution**:
```bash
# Stop Expo (Ctrl+C)
npm start -- --clear
```

## Complete Fix (Do Both)

### Terminal 1 - Backend
```bash
cd backend
node index.js
```

### Terminal 2 - Initialize Admin (First Time Only)
```bash
curl -X POST http://localhost:5000/admin/initialize
```

Expected response:
```json
{
  "success": true,
  "message": "Admin created successfully"
}
```

### Terminal 3 - Start App
```bash
npm start -- --clear
```

## Test Login

1. Open app
2. Select "Admin / Trainer"
3. Enter:
   - Email: `fitzonefyp@gmail.com`
   - Password: `junaid123`
4. Click "Admin Dashboard"

## If Still Getting Errors

### Clear Everything
```bash
# Kill all processes
pkill -f "expo"
pkill -f "node"

# Clear caches
rm -rf node_modules/.cache
rm -rf .expo
rm -rf backend/node_modules/.cache

# Restart backend
cd backend
node index.js

# In new terminal, restart app
npm start -- --clear
```

## Verify Backend Routes

Test if admin routes are working:
```bash
curl -X POST http://localhost:5000/admin/initialize
```

If you get HTML error, backend isn't loading routes properly. Check:
1. `backend/routes/adminRoutes.js` exists
2. `backend/controllers/adminController.js` exists
3. Backend console shows no errors

## Success Indicators

✅ Backend shows: `🚀 Server running at http://localhost:5000`
✅ Initialize returns JSON (not HTML)
✅ App loads without syntax errors
✅ Login works and navigates to dashboard

---

**After these fixes, everything should work!** 🚀
