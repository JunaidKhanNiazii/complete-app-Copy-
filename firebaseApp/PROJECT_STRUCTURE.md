# FitZone Project Structure

Clean and organized project structure for the FitZone gym management application.

## Root Directory Structure

```
firebaseApp/
├── app/                    # React Native app screens
│   ├── (admin)/           # Admin screens
│   ├── (auth)/            # Authentication screens
│   ├── (member)/          # Member screens
│   └── _layout.tsx        # Root layout
├── assets/                # Images and static assets
├── backend/               # Node.js/Express backend
│   ├── config/           # Firebase configuration
│   ├── controllers/      # API controllers
│   ├── routes/           # API routes
│   └── services/         # External services
├── docs/                  # 📚 All documentation files
│   ├── README.md         # Documentation index
│   ├── AI_ASSISTANT_IMPLEMENTATION.md
│   ├── ADMIN_FEATURES_COMPLETE.md
│   ├── MEMBER_FEATURES_COMPLETE.md
│   └── ... (all .md files)
├── src/                   # Shared source code
│   └── context/          # React contexts
├── tests/                 # 🧪 All test files
│   ├── backend/          # Backend tests
│   ├── scripts/          # Test scripts
│   └── README.md         # Test documentation
├── design/                # Design prototypes (legacy)
├── .expo/                 # Expo configuration
├── node_modules/          # Dependencies
├── app.json              # Expo app configuration
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── tailwind.config.js    # Tailwind CSS config
├── README.md             # Main project README
└── PROJECT_STRUCTURE.md  # This file
```

## Key Directories

### `/app` - Application Screens
React Native screens organized by user role:
- `(admin)/` - Admin dashboard, analytics, members, etc.
- `(auth)/` - Login and registration screens
- `(member)/` - Member dashboard, workouts, AI assistant, etc.

### `/backend` - Backend API
Node.js/Express server with Firebase:
- `config/` - Firebase admin SDK setup
- `controllers/` - Business logic for each feature
- `routes/` - API endpoint definitions
- `services/` - External service integrations (GitHub, Groq AI)

### `/docs` - Documentation
All project documentation in one place:
- Implementation guides
- Setup instructions
- Fix documentation
- System guides
- Quick references

### `/tests` - Testing
All test files and scripts:
- `backend/` - API endpoint tests
- `scripts/` - Utility scripts for testing and setup

### `/src` - Shared Code
Reusable code across the app:
- `context/` - React Context providers (Theme, Role)

## Important Files

### Configuration
- `app.json` - Expo app configuration
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS styling
- `metro.config.js` - Metro bundler config
- `babel.config.js` - Babel transpiler config

### Backend
- `backend/.env` - Environment variables (API keys, tokens)
- `backend/index.js` - Express server entry point
- `backend/firebase.json` - Firebase project config

### Documentation
- `README.md` - Main project overview
- `docs/README.md` - Documentation index
- `tests/README.md` - Testing guide

## File Organization Rules

### ✅ DO
- Keep test files in `/tests`
- Keep documentation in `/docs`
- Use descriptive folder names
- Group related files together
- Keep root directory clean

### ❌ DON'T
- Put test files in root directory
- Scatter documentation everywhere
- Mix test and production code
- Create unnecessary nested folders

## Quick Navigation

### Starting Development
```bash
# Frontend
npm start -- --clear

# Backend
cd backend && npm start
```

### Running Tests
```bash
# See tests/README.md for details
cd tests/backend
node test-ai-chat.js
```

### Reading Documentation
```bash
# See docs/README.md for index
cd docs
cat QUICK_START.md
```

## Maintenance

### Adding New Features
1. Create feature files in appropriate `/app` folder
2. Add backend routes/controllers if needed
3. Write tests in `/tests/backend`
4. Document in `/docs`

### Cleaning Up
- Old test files → `/tests/backend`
- Documentation → `/docs`
- Temporary files → Delete or `.gitignore`
- Unused code → Remove completely

## Benefits of This Structure

✅ **Clean Root** - Easy to find main files
✅ **Organized Tests** - All tests in one place
✅ **Centralized Docs** - Easy to find information
✅ **Scalable** - Easy to add new features
✅ **Professional** - Industry-standard structure
✅ **Maintainable** - Clear separation of concerns

## Related Documentation

- [Main README](../README.md) - Project overview
- [Documentation Index](../docs/README.md) - All documentation
- [Test Guide](../tests/README.md) - Testing instructions
- [Quick Start](../docs/QUICK_START.md) - Getting started
