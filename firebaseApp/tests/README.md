# FitZone Tests

This folder contains all test files and scripts for the FitZone application.

## Structure

```
tests/
├── backend/          # Backend API tests
│   ├── test-ai-chat.js
│   ├── test-all-users-login.js
│   ├── test-login.js
│   ├── test-reports-data.js
│   ├── test-user-structure.js
│   ├── test-workout-apis.js
│   └── check-workout-structure.js
├── scripts/          # Utility scripts
│   ├── START_HERE.sh
│   ├── RESTART_BACKEND.sh
│   ├── TEST_BACKEND.sh
│   └── TEST_MEMBER_LOGIN.sh
└── README.md         # This file
```

## Backend Tests

### AI Chat Test
```bash
cd tests/backend
node test-ai-chat.js
```
Tests the AI assistant endpoint with sample messages.

### User Login Tests
```bash
cd tests/backend
node test-all-users-login.js
```
Tests login functionality for all existing users.

```bash
cd tests/backend
node test-login.js
```
Tests individual user login.

### Workout Tests
```bash
cd tests/backend
node test-workout-apis.js
```
Tests workout-related API endpoints.

```bash
cd tests/backend
node test-reports-data.js
```
Tests workout data retrieval for reports page.

```bash
cd tests/backend
node check-workout-structure.js
```
Checks the structure of workout data in Firestore.

### User Structure Test
```bash
cd tests/backend
node test-user-structure.js
```
Verifies user data structure in Firestore.

## Scripts

### Start Here
```bash
bash tests/scripts/START_HERE.sh
```
Initial setup and start script.

### Restart Backend
```bash
bash tests/scripts/RESTART_BACKEND.sh
```
Restarts the backend server.

### Test Backend
```bash
bash tests/scripts/TEST_BACKEND.sh
```
Runs backend connectivity tests.

### Test Member Login
```bash
bash tests/scripts/TEST_MEMBER_LOGIN.sh
```
Tests member login flow.

## Running Tests

### Prerequisites
- Backend server must be running on `http://10.17.13.58:5000`
- Firebase credentials configured in `backend/.env`
- Node.js and npm installed

### Run All Backend Tests
```bash
cd tests/backend
for file in test-*.js; do
    echo "Running $file..."
    node "$file"
    echo "---"
done
```

## Notes

- All test files use the backend URL: `http://10.17.13.58:5000`
- Tests require valid Firebase connection
- Some tests may require specific user data to exist in Firestore
- Check console output for detailed test results
