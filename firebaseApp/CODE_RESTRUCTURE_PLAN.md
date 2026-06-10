# FitZone Code Restructure Plan

## Current Issues
- Mixed concerns in components
- No clear separation between UI and logic
- Constants scattered across files
- No centralized API service
- Styles mixed with components
- No proper type definitions

## New Structure

### Frontend Structure
```
src/
├── api/                    # API service layer
│   ├── admin.api.ts       # Admin API calls
│   ├── auth.api.ts        # Authentication API calls
│   ├── member.api.ts      # Member API calls
│   ├── workout.api.ts     # Workout API calls
│   ├── feedback.api.ts    # Feedback API calls
│   ├── ai.api.ts          # AI Assistant API calls
│   └── index.ts           # Export all APIs
├── components/            # Reusable components
│   ├── common/           # Common components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Loading.tsx
│   ├── admin/            # Admin-specific components
│   │   ├── StatCard.tsx
│   │   └── ActionButton.tsx
│   └── member/           # Member-specific components
│       ├── WorkoutCard.tsx
│       └── ExerciseCard.tsx
├── constants/            # App constants
│   ├── api.ts           # API URLs
│   ├── colors.ts        # Color palette
│   ├── routes.ts        # Route names
│   └── index.ts         # Export all constants
├── context/             # React contexts
│   ├── ThemeContext.tsx
│   ├── RoleContext.tsx
│   └── AuthContext.tsx
├── hooks/               # Custom hooks
│   ├── useAuth.ts
│   ├── useWorkouts.ts
│   ├── useStats.ts
│   └── index.ts
├── types/               # TypeScript types
│   ├── user.types.ts
│   ├── workout.types.ts
│   ├── admin.types.ts
│   └── index.ts
├── utils/               # Utility functions
│   ├── date.utils.ts
│   ├── format.utils.ts
│   ├── storage.utils.ts
│   └── index.ts
└── styles/              # Shared styles
    ├── theme.ts
    └── common.styles.ts
```

### Backend Structure
```
backend/
├── config/              # Configuration
│   ├── firebase.js
│   └── constants.js
├── controllers/         # Request handlers
│   ├── admin.controller.js
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── workout.controller.js
│   ├── feedback.controller.js
│   └── ai.controller.js
├── routes/              # Route definitions
│   ├── admin.routes.js
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── workout.routes.js
│   ├── feedback.routes.js
│   ├── ai.routes.js
│   └── index.js
├── services/            # Business logic
│   ├── firebase.service.js
│   ├── github.service.js
│   ├── groq.service.js
│   └── workout.service.js
├── middleware/          # Express middleware
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── validation.middleware.js
├── utils/               # Utility functions
│   ├── date.utils.js
│   ├── response.utils.js
│   └── validation.utils.js
├── models/              # Data models (if needed)
│   └── user.model.js
├── .env
├── index.js
└── package.json
```

## Implementation Steps

### Phase 1: Frontend Restructure
1. Create new folder structure
2. Extract API calls into service layer
3. Create reusable components
4. Define TypeScript types
5. Create custom hooks
6. Extract constants
7. Create utility functions
8. Update imports in screens

### Phase 2: Backend Restructure
1. Create service layer
2. Add middleware
3. Extract utilities
4. Improve error handling
5. Add validation
6. Update route organization

### Phase 3: Documentation
1. Add JSDoc comments
2. Create API documentation
3. Update README files
4. Add inline code comments

## Benefits
- ✅ Better code organization
- ✅ Easier to maintain
- ✅ Reusable components
- ✅ Type safety
- ✅ Centralized API calls
- ✅ Clear separation of concerns
- ✅ Easier testing
- ✅ Better developer experience
