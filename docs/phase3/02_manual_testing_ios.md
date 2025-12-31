# מדריך לבדיקות ידניות iOS - Phase 3

## מטרת המשימה
ביצוע בדיקות ידניות מקיפות על מכשירי iOS (iPhone/iPad) לוידוא שהאפליקציה עובדת כראוי בסביבה הריאלית.

## דרישות מוקדמות
- מכשיר iOS (iPhone או iPad)
- הורדת האפליקציה מ-TestFlight או build מקומי
- חשבון משתמש לבדיקה

## שלבי הבדיקה

### 1. התקנה ראשונית
- ✅ הורד את האפליקציה מ-TestFlight
- ✅ וודא שהאפליקציה נפתחת בהצלחה
- ✅ בדוק שמסך הפתיחה (Splash Screen) מוצג כראוי
- ✅ וודא שההרשאות מתבקשות כראוי (נוטיפיקציות, מיקום אם רלוונטי)

### 2. הרשמה והתחברות
- ✅ צור משתמש חדש
- ✅ התנתק והתחבר שוב
- ✅ בדוק "שכחתי סיסמה"
- ✅ נסה התחברות עם Apple ID / Google (אם קיים)
- ✅ בדוק שמירת סשן - סגור את האפליקציה ופתח שוב

### 3. ממשק משתמש (UI)
- ✅ בדוק שכל המסכים מוצגים כראוי
- ✅ וודא שהגופנים קריאים
- ✅ בדוק שהצבעים תואמים את העיצוב
- ✅ בדוק responsive design על מסכים שונים (iPhone SE, iPhone Pro Max, iPad)
- ✅ בדוק Dark Mode / Light Mode

### 4. פונקציונליות ליבה
**רישום מצב רוח:**
- ✅ הוסף מצב רוח חדש
- ✅ ערוך מצב רוח קיים
- ✅ מחק מצב רוח
- ✅ בדוק שהנתונים מסתנכרנים עם השרת

**היסטוריה:**
- ✅ בדוק שמוצגת היסטוריה מלאה
- ✅ בדוק סינון לפי תאריכים
- ✅ בדוק חיפוש במצבי רוח

**גרפים וסטטיסטיקות:**
- ✅ בדוק שהגרפים מוצגים כראוי
- ✅ בדוק אינטראקציה עם הגרפים

### 5. ביצועים
- ✅ בדוק זמן טעינה של המסך הראשי < 2 שניות
- ✅ בדוק שהאפליקציה לא קורסת
- ✅ בדוק שאין lag בגלילה
- ✅ בדוק ניצול סוללה (השאר את האפליקציה פתוחה ל-10 דקות)

### 6. נוטיפיקציות
- ✅ בדוק שנוטיפיקציות מגיעות כראוי
- ✅ בדוק שלחיצה על נוטיפיקציה פותחת את המסך הנכון

### 7. מצבי קצה
- ✅ בדוק עבודה ללא אינטרנט (Offline Mode)
- ✅ בדוק עבודה עם אינטרנט איטי
- ✅ בדוק התנהגות כאשר האפליקציה ברקע
- ✅ בדוק שחזור מהרקע

### 8. הרשאות
- ✅ בדוק מה קורה כשמשתמש דוחה הרשאות
- ✅ בדוק שההרשאות ניתנות להפעלה מ-Settings

## דיווח באגים
כל באג שנמצא יש לתעד ב-GitHub Issues עם:
- 📱 מכשיר (דגם, גרסת iOS)
- 📝 תיאור הבעיה
- 🔄 שלבים לשחזור
- 📷 צילומי מסך

## קריטריונים להצלחה
- ✅ כל הפונקציות עובדות
- ✅ אין קריסות
- ✅ הביצועים תקינים
- ✅ ה-UI נראה טוב על כל המכשירים

---

# iOS Manual Testing Guide - Phase 3

## Task Objective
Perform comprehensive manual testing on iOS devices (iPhone/iPad) to ensure the app works properly in real-world conditions.

## Prerequisites
- iOS device (iPhone or iPad)
- App downloaded from TestFlight or local build
- Test user account

## Testing Steps

### 1. Initial Installation
- ✅ Download app from TestFlight
- ✅ Verify app opens successfully
- ✅ Check splash screen displays properly
- ✅ Verify permissions are requested correctly (notifications, location if relevant)

### 2. Registration and Login
- ✅ Create new user
- ✅ Logout and login again
- ✅ Test "forgot password"
- ✅ Try Apple ID / Google login (if available)
- ✅ Check session persistence - close app and reopen

### 3. User Interface (UI)
- ✅ Check all screens display correctly
- ✅ Verify fonts are readable
- ✅ Check colors match design
- ✅ Test responsive design on different screens (iPhone SE, iPhone Pro Max, iPad)
- ✅ Test Dark Mode / Light Mode

### 4. Core Functionality
**Mood Recording:**
- ✅ Add new mood
- ✅ Edit existing mood
- ✅ Delete mood
- ✅ Check data syncs with server

**History:**
- ✅ Check full history displays
- ✅ Test date filtering
- ✅ Test mood search

**Charts and Statistics:**
- ✅ Check charts display correctly
- ✅ Test chart interaction

### 5. Performance
- ✅ Check main screen load time < 2 seconds
- ✅ Verify app doesn't crash
- ✅ Check no lag when scrolling
- ✅ Check battery usage (leave app open for 10 minutes)

### 6. Notifications
- ✅ Verify notifications arrive correctly
- ✅ Check tapping notification opens correct screen

### 7. Edge Cases
- ✅ Test offline mode (no internet)
- ✅ Test with slow internet
- ✅ Check behavior when app is backgrounded
- ✅ Test recovery from background

### 8. Permissions
- ✅ Check what happens when user denies permissions
- ✅ Verify permissions can be enabled from Settings

## Bug Reporting
Document every bug found in GitHub Issues with:
- 📱 Device (model, iOS version)
- 📝 Problem description
- 🔄 Steps to reproduce
- 📷 Screenshots

## Success Criteria
- ✅ All functions work
- ✅ No crashes
- ✅ Performance is good
- ✅ UI looks good on all devices
