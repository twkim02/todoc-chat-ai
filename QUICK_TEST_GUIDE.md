# Quick Test Guide - Child Registration

## 🚀 Quick Start

### 1. Start the Server
```bash
npm run dev
```

### 2. Open Browser
Go to `http://localhost:3000`

---

## 📝 Step-by-Step Test

### Step 1: Login
- Click any login button (Google, Kakao, Naver, or Email)
- Wait for loading spinner

### Step 2: Child Registration Screen
- You should see a form with:
  - 👶 Icon at the top
  - Title: "Register Your Child"
  - Three fields to fill

### Step 3: Fill the Form
- **Name**: Type a name (e.g., "Hajun")
- **Date**: Click date field → Select a past date
- **Gender**: Select "Boy" or "Girl"

### Step 4: Submit
- Click "Register" button
- Wait ~0.5 seconds
- ✅ You should see the main app (Home screen)

---

## 🔄 Reset to Test Again

Open browser console (F12) and run:

```javascript
localStorage.removeItem('hasCompletedOnboarding');
localStorage.removeItem('children');
location.reload();
```

Then log in again to see the registration screen.

---

## ✅ What Should Happen

1. ✅ After login → Child Registration Screen appears
2. ✅ Fill form → Click Register
3. ✅ After registration → Main App appears
4. ✅ Log out and log in again → Skips registration (goes to Main App)

---

## ❌ Test Validation

Try submitting with:
- Empty name → Should show error
- No date selected → Should show error  
- No gender selected → Should show error

---

## 📱 Mobile Test

1. Open DevTools (F12)
2. Press `Ctrl+Shift+M` (or `Cmd+Shift+M` on Mac)
3. Select a mobile device
4. Test the form

---

## 🐛 Troubleshooting

**Problem**: Registration screen doesn't appear
**Solution**: Clear localStorage (see reset instructions above)

**Problem**: Form won't submit
**Solution**: Check that all fields are filled and date is in the past

**Problem**: Page won't load
**Solution**: 
```bash
npm install
npm run dev
```

---

## 📊 Check Stored Data

In browser console (F12):

```javascript
// See if registration was saved
console.log(localStorage.getItem('hasCompletedOnboarding'));
console.log(JSON.parse(localStorage.getItem('children') || '[]'));
```

---

## 🎯 Test Checklist

- [ ] Registration screen appears after login
- [ ] Form fields work correctly
- [ ] Validation errors appear for empty fields
- [ ] Successful submission redirects to main app
- [ ] After logout/login, registration is skipped
- [ ] Works on mobile viewport

---

For detailed testing instructions, see `TESTING_GUIDE.md`

