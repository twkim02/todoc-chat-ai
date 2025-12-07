# Backend Integration Guide for Child Registration

## Overview

This guide explains how to integrate the child registration feature with your backend API once it's ready.

## Current Implementation

The child registration feature is fully implemented on the frontend with mock data storage. The system includes:

1. **ChildRegistrationScreen** - UI component for collecting child information
2. **childService.ts** - API service layer with placeholder functions
3. **App.tsx** - Flow management (Login → Child Registration → Main App)

## File Structure

```
src/
├── components/
│   └── ChildRegistrationScreen.tsx    # Registration form UI
├── services/
│   └── api/
│       └── childService.ts            # API service functions
└── App.tsx                            # Main app flow
```

---

## Backend Integration Steps

### Step 1: Update API Endpoints

Open `src/services/api/childService.ts` and replace the mock implementations with real API calls.

#### 1.1 Register Child Function

**Current Mock Implementation:**
```typescript
export async function registerChild(childData: ChildRegistrationData): Promise<void> {
  // Mock implementation using localStorage
  // ...
}
```

**Backend Integration:**
```typescript
export async function registerChild(childData: ChildRegistrationData): Promise<void> {
  const response = await fetch('/api/children', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify({
      name: childData.name,
      birth_date: format(childData.birthDate, 'yyyy-MM-dd'),
      gender: childData.gender === 'boy' ? 'male' : 'female', // Adjust based on your backend enum
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to register child');
  }

  const result = await response.json();
  return result;
}
```

**Expected Backend Response:**
```json
{
  "id": 1,
  "user_id": 123,
  "name": "Hajun",
  "birth_date": "2024-05-15",
  "gender": "male",
  "created_at": "2025-01-01T00:00:00Z"
}
```

#### 1.2 Check if Child is Registered

**Current Mock Implementation:**
```typescript
export async function hasChildRegistered(): Promise<boolean> {
  // Mock implementation
  // ...
}
```

**Backend Integration:**
```typescript
export async function hasChildRegistered(): Promise<boolean> {
  const response = await fetch('/api/children', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    return false;
  }

  const children = await response.json();
  return children && Array.isArray(children) && children.length > 0;
}
```

**Expected Backend Response:**
```json
[
  {
    "id": 1,
    "user_id": 123,
    "name": "Hajun",
    "birth_date": "2024-05-15",
    "gender": "male"
  }
]
```

#### 1.3 Get All Children

**Current Mock Implementation:**
```typescript
export async function getChildren(): Promise<any[]> {
  // Mock implementation
  // ...
}
```

**Backend Integration:**
```typescript
export async function getChildren(): Promise<any[]> {
  const response = await fetch('/api/children', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch children');
  }

  return response.json();
}
```

---

### Step 2: Authentication Integration

You'll need to implement authentication token management. Create a utility file:

**Create `src/utils/auth.ts`:**
```typescript
export function getAuthToken(): string | null {
  // Get token from localStorage, cookies, or context
  return localStorage.getItem('authToken');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('authToken', token);
}

export function removeAuthToken(): void {
  localStorage.removeItem('authToken');
}
```

Then import and use in `childService.ts`:
```typescript
import { getAuthToken } from '../../utils/auth';
```

---

### Step 3: API Base URL Configuration

Create a configuration file for API endpoints:

**Create `src/config/api.ts`:**
```typescript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
```

Update service functions to use the base URL:
```typescript
import { API_BASE_URL } from '../../config/api';

export async function registerChild(childData: ChildRegistrationData): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/children`, {
    // ... rest of the code
  });
}
```

---

### Step 4: Error Handling

Add proper error handling and user-friendly error messages:

```typescript
export async function registerChild(childData: ChildRegistrationData): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/children`, {
      // ... request config
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle specific error codes
      if (response.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      } else if (response.status === 400) {
        throw new Error(errorData.message || 'Invalid child data');
      } else if (response.status === 500) {
        throw new Error('Server error. Please try again later.');
      }
      
      throw new Error(errorData.message || 'Failed to register child');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
}
```

---

### Step 5: Data Type Mapping

Ensure data types match your backend schema:

**ChildRegistrationData Interface:**
```typescript
export interface ChildRegistrationData {
  name: string;
  birthDate: Date;  // Frontend uses Date object
  gender: 'boy' | 'girl';  // Frontend uses 'boy'/'girl'
}
```

**Backend Mapping:**
```typescript
// Transform for backend
const backendPayload = {
  name: childData.name,
  birth_date: format(childData.birthDate, 'yyyy-MM-dd'),  // Convert to ISO date string
  gender: childData.gender === 'boy' ? 'male' : 'female',  // Map to backend enum
};
```

**Response Mapping:**
```typescript
// Transform backend response to frontend format
const frontendChild = {
  id: backendChild.id,
  name: backendChild.name,
  birthDate: new Date(backendChild.birth_date),
  gender: backendChild.gender === 'male' ? 'boy' : 'girl',
};
```

---

## Backend API Requirements

### Required Endpoints

1. **POST `/api/children`** - Register a new child
   - **Request Body:**
     ```json
     {
       "name": "Hajun",
       "birth_date": "2024-05-15",
       "gender": "male"
     }
     ```
   - **Response:** Child object with ID and timestamps

2. **GET `/api/children`** - Get all children for current user
   - **Response:** Array of child objects

3. **Authentication:** All endpoints require Bearer token authentication

---

## Database Schema Reference

Based on the provided schema:

```sql
CREATE TABLE kids (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  birth_date DATE NOT NULL,
  gender VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Field Mappings:**
- `name` → `childData.name`
- `birth_date` → `format(childData.birthDate, 'yyyy-MM-dd')`
- `gender` → Map `'boy'/'girl'` to your backend enum/string
- `user_id` → Get from authentication token/session

---

## Testing Without Backend

The current implementation uses localStorage for development. To test:

1. Log in to the app
2. Complete child registration
3. Data is stored in localStorage under `'children'` key
4. Onboarding status is stored under `'hasCompletedOnboarding'` key

To reset for testing:
```javascript
localStorage.removeItem('children');
localStorage.removeItem('hasCompletedOnboarding');
```

---

## Flow Diagram

```
User Flow:
┌─────────────┐
│   Login     │
└──────┬──────┘
       │
       ▼
┌──────────────────┐
│ Check if child   │
│ is registered?   │
└──────┬───────────┘
       │
       ├─── NO ──► ┌──────────────────────┐
       │           │ Child Registration   │
       │           │ Screen               │
       │           └──────────┬───────────┘
       │                      │
       │                      ▼
       │           ┌──────────────────────┐
       │           │ Register Child       │
       │           │ (API Call)           │
       │           └──────────┬───────────┘
       │                      │
       └─── YES ──────────────┴───► ┌─────────────┐
                                    │  Main App   │
                                    └─────────────┘
```

---

## Troubleshooting

### Issue: Child registration doesn't redirect to main app
- **Solution:** Check that `onComplete()` callback is called after successful API response
- Verify `hasCompletedOnboarding` state is set to `true`

### Issue: Form validation errors
- **Solution:** Check that all required fields are validated
- Ensure date is not in the future
- Verify gender is selected

### Issue: API errors not displayed
- **Solution:** Check error handling in `registerChild` function
- Ensure error messages are properly caught and displayed in UI

---

## Next Steps After Backend Integration

1. Remove mock localStorage implementation
2. Add loading states during API calls
3. Implement error retry logic
4. Add success toast notifications
5. Update child list in Header component to fetch from API
6. Implement child editing/deletion if needed

---

## Support

For questions or issues during backend integration, refer to:
- `src/services/api/childService.ts` - API service functions
- `src/components/ChildRegistrationScreen.tsx` - UI component
- Database schema provided in project documentation

