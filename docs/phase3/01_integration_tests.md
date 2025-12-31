# מדריך לבדיקות אינטגרציה - Phase 3

## מטרת המשימה
ביצוע בדיקות אינטגרציה מקיפות למערכת MOODS כולה, כולל בדיקת תקשורת בין Frontend ל-Backend, חיבור ל-Firebase, ובדיקת זרימות משתמש מקצה לקצה.

## שלבי ביצוע

### 1. הכנת סביבת הבדיקה
- ודא שסביבת הפיתוח פועלת: `npm run dev`
- ודא שה-Backend פועל ומחובר ל-Firebase
- בדוק שקיימות משתנים סביבה נכונים ב-`.env.local`

### 2. בדיקות API
- בדוק את כל ה-endpoints ב-`/api/`:
  - `/api/moods` - קריאה וכתיבה של מצבי רוח
  - `/api/users` - ניהול משתמשים
  - `/api/analytics` - נתוני אנליטיקס
- ודא שכל הבקשות מחזירות סטטוס קוד 200/201 במקרה של הצלחה
- בדוק טיפול בשגיאות (400, 401, 404, 500)

### 3. בדיקות זרימת משתמש
- **הרשמה והתחברות:**
  - צור משתמש חדש
  - התחבר עם המשתמש
  - בדוק שמירת טוקן authentication
  - בדוק התנתקות
- **זרימת מצבי רוח:**
  - הוסף מצב רוח חדש
  - ערוך מצב רוח קיים
  - מחק מצב רוח
  - בדוק סינכרון עם Firebase

### 4. בדיקות Firebase
- ודא שהנתונים נשמרים ב-Firestore
- בדוק שהאנליטיקס עובד (Firebase Analytics)
- בדוק אבטחה: Rules של Firestore

### 5. בדיקות ביצועים בסיסיות
- זמן טעינה של דף ראשי < 2 שניות
- זמן תגובה של API < 500ms
- בדוק שאין memory leaks

## הרצת הבדיקות
```bash
# בדיקות אינטגרציה
npm run test:integration

# בדיקות E2E עם Playwright
npm run test:e2e
```

## קריטריונים להצלחה
- ✅ כל הבדיקות עוברות בהצלחה
- ✅ אין שגיאות בקונסול
- ✅ הנתונים נשמרים ומסתנכרנים כראוי
- ✅ זמני תגובה תקינים

---

# Integration Testing Guide - Phase 3

## Task Objective
Perform comprehensive integration testing for the entire MOODS system, including Frontend-Backend communication, Firebase connectivity, and end-to-end user flows.

## Execution Steps

### 1. Test Environment Setup
- Ensure development environment is running: `npm run dev`
- Verify Backend is running and connected to Firebase
- Check that correct environment variables exist in `.env.local`

### 2. API Testing
- Test all endpoints in `/api/`:
  - `/api/moods` - Read and write mood states
  - `/api/users` - User management
  - `/api/analytics` - Analytics data
- Ensure all requests return status code 200/201 on success
- Test error handling (400, 401, 404, 500)

### 3. User Flow Testing
- **Registration and Login:**
  - Create new user
  - Login with user
  - Check authentication token storage
  - Test logout
- **Mood Flow:**
  - Add new mood
  - Edit existing mood
  - Delete mood
  - Check Firebase synchronization

### 4. Firebase Testing
- Ensure data is saved to Firestore
- Check analytics is working (Firebase Analytics)
- Test security: Firestore Rules

### 5. Basic Performance Testing
- Main page load time < 2 seconds
- API response time < 500ms
- Check for memory leaks

## Running Tests
```bash
# Integration tests
npm run test:integration

# E2E tests with Playwright
npm run test:e2e
```

## Success Criteria
- ✅ All tests pass successfully
- ✅ No console errors
- ✅ Data saves and syncs properly
- ✅ Response times are acceptable
