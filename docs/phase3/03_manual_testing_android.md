# מדריך לבדיקות ידניות Android - Phase 3

## מטרת המשימה
ביצוע בדיקות ידניות מקיפות על מכשירי Android לוידוא שהאפליקציה עובדת כראוי בסביבה הריאלית.

## דרישות מוקדמות
- מכשיר Android
- הורדת האפליקציה מ-Google Play (בטא) או APK build
- חשבון משתמש לבדיקה

## שלבי הבדיקה

### 1. התקנה ראשונית
- ✅ הורד את האפליקציה
- ✅ וודא שהאפליקציה נפתחת בהצלחה
- ✅ בדוק שמסך הפתיחה מוצג כראוי
- ✅ וודא שההרשאות מתבקשות כראוי

### 2. הרשמה והתחברות
- ✅ צור משתמש חדש
- ✅ התנתק והתחבר שוב
- ✅ בדוק "שכחתי סיסמה"
- ✅ נסה התחברות עם Google (אם קיים)
- ✅ בדוק שמירת סשן

### 3. ממשק משתמש (UI)
- ✅ בדוק שכל המסכים מוצגים כראוי
- ✅ וודא שהגופנים קריאים
- ✅ בדוק שהצבעים תואמים את העיצוב
- ✅ בדוק responsive design על מכשירים שונים
- ✅ בדוק Dark Mode / Light Mode
- ✅ בדוק rotation (לאורך/לרוחב)

### 4. פונקציונליות ליבה
**רישום מצב רוח:**
- ✅ הוסף מצב רוח חדש
- ✅ ערוך מצב רוח קיים
- ✅ מחק מצב רוח
- ✅ בדוק סינכרון עם השרת

**היסטוריה:**
- ✅ בדוק שמוצגת היסטוריה מלאה
- ✅ בדוק סינון לפי תאריכים
- ✅ בדוק חיפוש במצבי רוח

**גרפים וסטטיסטיקות:**
- ✅ בדוק שהגרפים מוצגים כראוי
- ✅ בדוק אינטראקציה עם הגרפים

### 5. ביצועים
- ✅ בדוק זמן טעינה < 2 שניות
- ✅ בדוק שהאפליקציה לא קורסת
- ✅ בדוק שאין lag בגלילה
- ✅ בדוק ניצול סוללה
- ✅ בדוק ניצול זיכרון

### 6. נוטיפיקציות
- ✅ בדוק שנוטיפיקציות מגיעות כראוי
- ✅ בדוק שלחיצה על נוטיפיקציה פותחת את המסך הנכון
- ✅ בדוק notification channels

### 7. מצבי קצה
- ✅ בדוק עבודה ללא אינטרנט
- ✅ בדוק עבודה עם אינטרנט איטי
- ✅ בדוק התנהגות כאשר האפליקציה ברקע
- ✅ בדוק שחזור מהרקע
- ✅ בדוק התנהגות עם זיכרון נמוך

### 8. הרשאות
- ✅ בדוק מה קורה כשמשתמש דוחה הרשאות
- ✅ בדוק שההרשאות ניתנות להפעלה מ-Settings

### 9. ספציפי ל-Android
- ✅ בדוק Back button navigation
- ✅ בדוק התנהגות עם Recent Apps
- ✅ בדוק שיתוף לאפליקציות אחרות
- ✅ בדוק Widgets (אם קיימים)
- ✅ בדוק התנהגות עם גרסאות Android שונות

## דיווח באגים
כל באג שנמצא יש לתעד ב-GitHub Issues עם:
- 📱 מכשיר (דגם, גרסת Android)
- 📝 תיאור הבעיה
- 🔄 שלבים לשחזור
- 📷 צילומי מסך
- 📊 Logcat (אם רלוונטי)

## קריטריונים להצלחה
- ✅ כל הפונקציות עובדות
- ✅ אין קריסות
- ✅ הביצועים תקינים
- ✅ ה-UI נראה טוב על כל המכשירים
- ✅ Navigation תקין

---

# Android Manual Testing Guide - Phase 3

## Task Objective
Perform comprehensive manual testing on Android devices to ensure the app works properly in real-world conditions.

## Prerequisites
- Android device
- App downloaded from Google Play (beta) or APK build
- Test user account

## Testing Steps

### 1. Initial Installation
- ✅ Download app
- ✅ Verify app opens successfully
- ✅ Check splash screen displays properly
- ✅ Verify permissions are requested correctly

### 2. Registration and Login
- ✅ Create new user
- ✅ Logout and login again
- ✅ Test "forgot password"
- ✅ Try Google login (if available)
- ✅ Check session persistence

### 3. User Interface (UI)
- ✅ Check all screens display correctly
- ✅ Verify fonts are readable
- ✅ Check colors match design
- ✅ Test responsive design on different devices
- ✅ Test Dark Mode / Light Mode
- ✅ Test rotation (portrait/landscape)

### 4. Core Functionality
**Mood Recording:**
- ✅ Add new mood
- ✅ Edit existing mood
- ✅ Delete mood
- ✅ Check sync with server

**History:**
- ✅ Check full history displays
- ✅ Test date filtering
- ✅ Test mood search

**Charts and Statistics:**
- ✅ Check charts display correctly
- ✅ Test chart interaction

### 5. Performance
- ✅ Check load time < 2 seconds
- ✅ Verify app doesn't crash
- ✅ Check no lag when scrolling
- ✅ Check battery usage
- ✅ Check memory usage

### 6. Notifications
- ✅ Verify notifications arrive correctly
- ✅ Check tapping notification opens correct screen
- ✅ Check notification channels

### 7. Edge Cases
- ✅ Test offline mode
- ✅ Test with slow internet
- ✅ Check behavior when app is backgrounded
- ✅ Test recovery from background
- ✅ Test behavior with low memory

### 8. Permissions
- ✅ Check what happens when user denies permissions
- ✅ Verify permissions can be enabled from Settings

### 9. Android-Specific
- ✅ Test Back button navigation
- ✅ Test behavior with Recent Apps
- ✅ Test sharing to other apps
- ✅ Test Widgets (if available)
- ✅ Test behavior with different Android versions

## Bug Reporting
Document every bug found in GitHub Issues with:
- 📱 Device (model, Android version)
- 📝 Problem description
- 🔄 Steps to reproduce
- 📷 Screenshots
- 📊 Logcat (if relevant)

## Success Criteria
- ✅ All functions work
- ✅ No crashes
- ✅ Performance is good
- ✅ UI looks good on all devices
- ✅ Navigation is correct
