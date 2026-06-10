# Network Configuration Guide

## How to Update Backend IP Address

When your network changes (WiFi, location, etc.), you need to update the backend IP address.

### Step 1: Find Your IP Address

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" under your active network adapter.

**Mac/Linux:**
```bash
ifconfig
# or
ip addr
```
Look for "inet" address (usually starts with 192.168.x.x or 10.x.x.x).

### Step 2: Update Configuration Files

**Option 1: Update .env file (Recommended)**
Edit the `.env` file in the root directory:
```
EXPO_PUBLIC_BACKEND_IP=YOUR_NEW_IP_HERE
EXPO_PUBLIC_BACKEND_PORT=5000
```

**Option 2: Update app.config.env.ts directly**
Edit `app.config.env.ts` and change the IP_ADDRESS value.

**Option 3: Update backend/.env**
Edit `backend/.env` and change the BACKEND_IP value.

### Step 3: Restart Services

1. **Restart Backend Server:**
   ```bash
   cd backend
   node index.js
   ```
   
2. **Restart Expo (if needed):**
   ```bash
   npm start -- --clear
   ```

### Current Configuration

- **Frontend .env**: `.env` (EXPO_PUBLIC_BACKEND_IP)
- **Backend .env**: `backend/.env` (BACKEND_IP)
- **Config File**: `app.config.env.ts`
- **API Constants**: `src/constants/api.ts`

All app files now import from `app.config.env.ts`, so you only need to update the IP in one place!

### Troubleshooting

**Network Error on Login:**
- Make sure backend server is running
- Verify IP address matches your current network
- Check firewall isn't blocking port 5000
- Ensure phone/emulator is on same network as computer

**Backend Not Accessible:**
- Backend must listen on `0.0.0.0` (already configured)
- Check `backend/index.js` shows correct network IP on startup
