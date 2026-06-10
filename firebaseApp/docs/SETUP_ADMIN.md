# 🚀 Quick Admin Setup

## Step-by-Step Setup

### 1. Start Backend
```bash
cd backend
node index.js
```

Wait for:
```
✅ GITHUB_TOKEN is loaded
🚀 Server running at http://localhost:5000
```

### 2. Initialize Admin Account

**Option A: Using curl (Linux/Mac)**
```bash
curl -X POST http://localhost:5000/admin/initialize
```

**Option B: Using PowerShell (Windows)**
```powershell
Invoke-WebRequest -Uri http://localhost:5000/admin/initialize -Method POST
```

**Option C: Using Browser**
Open this URL in your browser:
```
http://localhost:5000/admin/initialize
```

**Option D: Using Postman/Insomnia**
- Method: POST
- URL: `http://localhost:5000/admin/initialize`
- Click Send

### 3. Expected Response
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

### 4. Start the App
```bash
# In main project directory
npm start -- --clear
```

### 5. Login
1. Open app
2. Select "Admin / Trainer"
3. Enter:
   - Email: `fitzonefyp@gmail.com`
   - Password: `junaid123`
4. Click "Admin Dashboard"

## ✅ You're Done!

Now you can:
- View real-time dashboard stats
- Manage users
- View analytics
- Edit your profile
- Change password

## 🔄 If Admin Already Exists

If you see "Admin already exists", you're good to go! Just login with the credentials above.

## 🐛 Troubleshooting

### Backend not starting?
```bash
cd backend
npm install
node index.js
```

### Can't reach backend from app?
Update `BACKEND_URL` in these files:
- `app/(auth)/login-admin.tsx`
- `app/(admin)/dashboard.tsx`
- `app/(admin)/analytics.tsx`
- `app/(admin)/profile.tsx`
- `app/(admin)/members.tsx`

Change from `http://10.17.13.58:5000` to your IP address.

### How to find your IP?
**Linux/Mac:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Windows:**
```cmd
ipconfig
```

Look for "IPv4 Address" under your active network adapter.

---

**That's it! Your admin panel is ready to use!** 🎉
