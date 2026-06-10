# ⚠️ CRITICAL: Backend Must Be Restarted!

## The Problem

Your backend is running the OLD code without admin routes. That's why you're getting:
```
Cannot POST /admin/login
```

## The Solution (2 Simple Steps)

### Step 1: Restart Backend

**In your backend terminal:**
1. Press `Ctrl+C` to stop the current backend
2. Run these commands:

```bash
cd backend
node index.js
```

**Wait for this message:**
```
✅ GITHUB_TOKEN is loaded
🚀 Server running at http://localhost:5000
```

### Step 2: Initialize Admin (First Time Only)

**In a NEW terminal**, run:

```bash
curl -X POST http://localhost:5000/admin/initialize
```

**Expected response:**
```json
{
  "success": true,
  "message": "Admin created successfully",
  "credentials": {
    "email": "fitzonefyp@gmail.com",
    "password": "junaid123"
  }
}
```

If you see "Admin already exists", that's fine!

### Step 3: Clear App Cache & Restart

**In your app terminal:**
1. Press `Ctrl+C` to stop Expo
2. Run:

```bash
npm start -- --clear
```

## ✅ Test It Works

1. Open app
2. Select "Admin / Trainer"  
3. Enter:
   - **Email**: `fitzonefyp@gmail.com`
   - **Password**: `junaid123`
4. Click "Admin Dashboard"

## 🎯 Why This Happened

The backend was started BEFORE we created the admin routes files. Node.js doesn't automatically reload code - you must restart it.

## 📝 Quick Check

To verify backend has admin routes, run:
```bash
./TEST_BACKEND.sh
```

If you see JSON response (not HTML), backend is ready!

---

**Do these 3 steps now and everything will work!** 🚀
