# Firebase Expo Application

A clean, minimal Firebase + Expo application that checks Firebase and Firestore connections.

## Project Structure

```
firebaseApp/
├── src/
│   ├── config/
│   │   └── firebase.ts          # Firebase & Firestore configuration
│   └── utils/                    # Utility functions (for future use)
├── app/
│   ├── _layout.tsx               # Expo Router layout
│   └── index.tsx                 # Main screen - Firebase status
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── app.json                      # Expo configuration
└── README.md                     # This file
```

## Features

- ✅ Firebase initialization
- ✅ Firestore connection verification
- ✅ Expo + React Native
- ✅ TypeScript support
- ✅ Clean folder structure
- ✅ Visual status display

## Getting Started

### Prerequisites

- Node.js installed
- npm installed
- Expo CLI (will be installed automatically)
- Firebase project created

### Installation

```bash
npm install
```

### Running the Application

Start the Expo development server:

```bash
npm start
```

Then choose your platform:
- Press `a` for Android
- Press `i` for iOS
- Press `w` for web

Or use platform-specific commands:

```bash
npm run android  # Run on Android
npm run ios      # Run on iOS
npm run web      # Run on web
```

## What It Does

The application displays a visual status screen showing:

1. **Firebase Connection Status** - Shows if Firebase app is initialized
2. **Firebase Project Info** - Displays Project ID and Auth Domain
3. **Firestore Connection Status** - Verifies Firestore database connection
4. **Security Rules Status** - Indicates if Firestore security rules are configured

## Expected Output

The app will display a clean status screen with:

### ✅ All Connected (with security rules):
- Firebase App: ✓ Connected
- Project ID and Auth Domain displayed
- Firestore: ✓ Connected
- Message: "Firestore connected with proper security rules"
- Footer: "🎉 Application Ready!"

### ✅ Connected (security rules need configuration):
- Firebase App: ✓ Connected
- Project ID and Auth Domain displayed
- Firestore: ✓ Connected
- Message: "Firestore connected (security rules need configuration)"
- Footer: "🎉 Application Ready!"

## Firebase Configuration

The Firebase configuration is located in `src/config/firebase.ts`. It includes:

- Firebase app initialization
- Firestore database initialization
- Exported instances for use throughout the application

## Folder Organization

- **`src/config/`** - Configuration files (Firebase, etc.)
- **`src/utils/`** - Utility functions (for future use)
- **`app/`** - Expo Router screens and layouts

## Next Steps

To build upon this foundation:

1. Add authentication (Firebase Auth)
2. Create data models in `src/models/`
3. Add utility functions in `src/utils/`
4. Add more screens in `app/`
5. Implement your application logic
6. Configure Firestore security rules in Firebase Console

## Firestore Security Rules

To configure Firestore security rules:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `fypapp-21f79`
3. Navigate to **Firestore Database** > **Rules**
4. Update the rules as needed for your application

Example rules for development (⚠️ Not for production):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## License

This project is private.
hello 
