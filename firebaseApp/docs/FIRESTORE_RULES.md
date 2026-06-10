# Deploying Firestore Security Rules

## Current Rules

The `firestore.rules` file contains **open access rules for development**:

```
allow read, write: if true;
```

⚠️ **WARNING:** These rules allow anyone to read/write to your database. Only use for development!

## How to Deploy Rules

### Option 1: Firebase Console (Recommended for now)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **fypapp-21f79**
3. Navigate to **Firestore Database** in the left sidebar
4. Click on the **Rules** tab
5. Copy the contents of `firestore.rules` file
6. Paste into the rules editor
7. Click **Publish**

### Option 2: Firebase CLI (For later)

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

## When to Update Rules

Before deploying to production, you should:
- Add authentication requirements
- Restrict access based on user roles
- Validate data before writes
- Implement proper security

For now, the open rules allow you to develop and test freely.
