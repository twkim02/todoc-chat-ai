# Testing Guide: Child Registration Feature

## Quick Start

### Step 1: Start the Development Server

```bash
npm run dev
```

The server will start at `http://localhost:3000` (or another port if 3000 is busy).

---

## Testing the Complete Flow

### Test Scenario 1: New User Registration Flow

1. **Open the website**
   - Go to `http://localhost:3000`
   - You should see the Login Screen

2. **Log in** (any method)
   - Click any login button (Google, Kakao, Naver, or Email)
   - You'll briefly see a "Loading..." spinner

3. **Child Registration Screen appears**
   - After login, you should see the Child Registration Screen
   - Screen shows:
     - Title: "Register Your Child" (or "아이 정보 등록" in Korean)
     - Three form fields:
       - Child's Name
       - Date of Birth
       - Gender

4. **Fill out the form**
   - **Name**: Enter a name (e.g., "Hajun")
   - **Date of Birth**: Click the date field, select a date (must be in the past)
   - **Gender**: Select either "Boy" or "Girl"

5. **Submit the form**
   - Click the "Register" button
   - You'll see a brief loading state ("Registering...")
   - After ~500ms, you should be redirected to the Main App (Home Screen)

6. **Verify success**
   - You should now see the main app with:
     - Header at the top
     - Home screen content
     - Bottom navigation dial

---

### Test Scenario 2: Validation Testing

Test that form validation works correctly:

1. **Try submitting empty form**
   - Don't fill anything
   - Click "Register"
   - **Expected**: Error message appears (name is required)

2. **Test name only**
   - Enter only name
   - Click "Register"
   - **Expected**: Error message about date of birth

3. **Test name + date only**
   - Enter name and select date
   - Don't select gender
   - Click "Register"
   - **Expected**: Error message about gender

4. **Test future date**
   - Enter name
   - Select a date in the future
   - **Expected**: Date picker should prevent selecting future dates (disabled)

---

### Test Scenario 3: Language Testing

1. **Test in English**
   - Default language should be English
   - All labels should be in English

2. **Test in Korean**
   - Go to Settings (gear icon in header) after logging in
   - Change language to Korean
   - Log out and log in again
   - **Expected**: Child Registration Screen should display in Korean
   - Date format should be Korean format (e.g., "2024년 5월 15일")

---

### Test Scenario 4: Returning User (Skip Registration)

After completing registration once, test that returning users skip the registration:

1. **Complete registration** (follow Scenario 1)
2. **Log out** (click header menu → Logout)
3. **Log in again**
   - **Expected**: You should go directly to Main App (skip Child Registration Screen)

---

## How to Reset for Testing

To test the registration flow again, you need to clear the stored data:

### Method 1: Browser Console (Recommended)

1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Run these commands:

```javascript
// Clear child registration data
localStorage.removeItem('children');
localStorage.removeItem('hasCompletedOnboarding');

// Refresh the page
location.reload();
```

### Method 2: Browser DevTools Application Tab

1. Open Developer Tools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Expand **Local Storage**
4. Click on your website URL
5. Find and delete these keys:
   - `children`
   - `hasCompletedOnboarding`
6. Refresh the page

### Method 3: Clear All Site Data

1. Open Developer Tools (F12)
2. Go to **Application** tab
3. Click **Clear site data** or **Clear storage**
4. Refresh the page

---

## What to Verify

### ✅ Visual Checks

- [ ] Child Registration Screen appears after login
- [ ] All three form fields are visible
- [ ] Date picker opens when clicked
- [ ] Gender dropdown shows options
- [ ] Submit button is visible and enabled
- [ ] Loading spinner appears during submission
- [ ] Success: Redirects to main app after submission

### ✅ Functional Checks

- [ ] Form validation works (empty fields show errors)
- [ ] Future dates are disabled in date picker
- [ ] All fields are required
- [ ] Error messages display correctly
- [ ] Form submits successfully with valid data
- [ ] After registration, returning users skip this screen

### ✅ Data Checks

After successful registration, check localStorage:

1. Open Developer Tools (F12)
2. Go to Console tab
3. Run:

```javascript
// Check if onboarding is marked complete
console.log('Onboarding complete:', localStorage.getItem('hasCompletedOnboarding'));

// Check stored child data
console.log('Children:', JSON.parse(localStorage.getItem('children') || '[]'));
```

**Expected Output:**
```javascript
Onboarding complete: "true"
Children: [
  {
    id: "1234567890",
    name: "Hajun",
    birthDate: "2024-05-15T00:00:00.000Z",
    gender: "boy"
  }
]
```

---

## Testing Checklist

### First Time User Flow
- [ ] Login screen appears
- [ ] After login, loading spinner shows
- [ ] Child Registration Screen appears
- [ ] All form fields are functional
- [ ] Validation errors work
- [ ] Successful submission redirects to main app

### Validation Testing
- [ ] Empty name shows error
- [ ] Missing date shows error
- [ ] Missing gender shows error
- [ ] Future date cannot be selected
- [ ] All errors clear when fields are filled

### Returning User Flow
- [ ] After registration, logout works
- [ ] After login again, Child Registration is skipped
- [ ] Main app loads directly

### Data Persistence
- [ ] Child data is stored in localStorage
- [ ] Onboarding status is stored
- [ ] Data persists after page refresh

### UI/UX Testing
- [ ] Mobile-responsive design works
- [ ] Dark mode works (if enabled)
- [ ] Form looks good in both themes
- [ ] Loading states are visible
- [ ] Error messages are clear

---

## Common Issues & Solutions

### Issue: Child Registration Screen doesn't appear after login

**Possible Causes:**
- Onboarding was already completed (data in localStorage)

**Solution:**
```javascript
// Clear localStorage in browser console
localStorage.removeItem('hasCompletedOnboarding');
location.reload();
```

### Issue: Form doesn't submit

**Possible Causes:**
- Validation errors (check error messages)
- Network error (check browser console)

**Solution:**
- Check browser console for errors
- Verify all fields are filled correctly
- Ensure date is not in the future

### Issue: Date picker doesn't open

**Possible Causes:**
- Missing dependencies

**Solution:**
```bash
npm install
npm run dev
```

### Issue: Translation not working

**Possible Causes:**
- Missing translation keys

**Solution:**
- Check `src/locales/translations.ts` for all `childRegistration.*` keys
- Verify LanguageContext is working

---

## Testing Different Scenarios

### Scenario A: Valid Registration
```
Name: "Hajun"
Date: May 15, 2024
Gender: Boy
Expected: ✅ Success → Main App
```

### Scenario B: Missing Name
```
Name: (empty)
Date: May 15, 2024
Gender: Boy
Expected: ❌ Error: "Please enter your child's name."
```

### Scenario C: Missing Date
```
Name: "Hajun"
Date: (not selected)
Gender: Boy
Expected: ❌ Error: "Please select the date of birth."
```

### Scenario D: Missing Gender
```
Name: "Hajun"
Date: May 15, 2024
Gender: (not selected)
Expected: ❌ Error: "Please select gender."
```

---

## Browser Compatibility

Test in these browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if on Mac)
- [ ] Mobile browsers (Chrome Mobile, Safari Mobile)

---

## Mobile Testing

1. **Open DevTools** (F12)
2. **Toggle device toolbar** (Ctrl+Shift+M or Cmd+Shift+M)
3. **Select a device** (iPhone 12 Pro, etc.)
4. **Test the registration form**
   - Verify form is readable
   - Check date picker works on mobile
   - Verify submit button is accessible

---

## Quick Test Commands

### Reset Everything
```javascript
localStorage.clear();
location.reload();
```

### Check Current State
```javascript
console.log('Logged in:', localStorage.getItem('isLoggedIn'));
console.log('Onboarding:', localStorage.getItem('hasCompletedOnboarding'));
console.log('Children:', JSON.parse(localStorage.getItem('children') || '[]'));
```

### Simulate New User
```javascript
localStorage.removeItem('hasCompletedOnboarding');
localStorage.removeItem('children');
location.reload();
```

---

## Expected Console Output

When you successfully register a child, you should see in the browser console:

```
Child registered (mock): {
  name: "Hajun",
  birthDate: Date,
  gender: "boy"
}
```

This confirms the mock API function is working.

---

## Next Steps After Testing

1. ✅ Verify all test cases pass
2. ✅ Check that data is stored correctly
3. ✅ Test error scenarios
4. ✅ Verify UI looks good on mobile
5. ✅ Test in both languages (Korean/English)

Once everything works correctly, the feature is ready for backend integration!

---

## Need Help?

- Check browser console for errors
- Verify all files are saved
- Clear browser cache if issues persist
- Check `BACKEND_INTEGRATION_GUIDE.md` for integration details

