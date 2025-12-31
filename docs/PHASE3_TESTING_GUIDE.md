# MOODS - Phase 3 Testing & QA Guide
## מדריך בדיקות ובקרת איכות - שלב 3

**תאריך עדכון: 31 בדצמבר 2025**
**Timeline: 3-4 שבועות (7 במרץ - 4 באפריל 2026)**

---

## 📊 סטטוס משימות Phase 3

### ✅ הושלם
1. ✅ Write unit tests for core features - יש `backend/tests/test_main.py`
2. ✅ Setup automated testing in CI/CD - מוגדר ב-`moods-platform-pipeline-DevOps`

### ❌ נותר לביצוע
3. ❌ Write integration tests
4. ❌ Manual testing on iOS devices (iPhone models)
5. ❌ Manual testing on Android devices (various manufacturers)
6. ❌ Performance testing and optimization
7. ❌ Security testing and penetration testing
8. ❌ Setup TestFlight for iOS beta
9. ❌ Setup Google Play Beta for Android
10. ❌ Recruit beta testers (20-50 users)
11. ❌ Collect and analyze beta feedback
12. ❌ Fix critical bugs from beta

---

## 📋 משימה 3: Write Integration Tests

### מה זה?
בדיקות אינטגרציה בודקות שמרכיבים שונים של האפליקציה עובדים ביחד נכון.

### איפה לכתוב?
`backend/tests/test_integration.py`

### מה לבדוק?

#### 1. Firebase Integration
```python
# test_integration.py
import pytest
from app.firebase import db

@pytest.mark.integration
def test_firebase_connection():
    """Test Firebase database connection"""
    # בדוק חיבור ל-Firebase
    pass

@pytest.mark.integration  
def test_user_creation_flow():
    """Test complete user creation process"""
    # צור משתמש חדש
    # בדוק שהנתונים נשמרים ב-Firebase
    # בדוק שהמשתמש יכול להתחבר
    pass
```

#### 2. API Integration
```python
@pytest.mark.integration
def test_mood_entry_api():
    """Test mood entry creation via API"""
    # POST /api/moods
    # בדוק שהרשומה נוצרה
    # GET /api/moods
    # בדוק שהרשומה מוחזרת
    pass
```

#### 3. Authentication Flow
```python
@pytest.mark.integration
def test_auth_flow():
    """Test complete authentication flow"""
    # Register → Login → Get Protected Resource
    pass
```

### הרצת Integration Tests
```bash
cd backend
pytest -v -m integration
```

### זמן משוער: 2-3 ימים

---

## 📋 משימה 4-5: Manual Testing

### למה צריך בדיקות ידניות?
- בדיקת UX/UI על מכשירים אמיתיים
- בדיקת ביצועים על חומרות שונות
- בדיקת תאימות לגרסאות OS שונות

### iOS Testing (משימה 4)

#### מכשירים לבדיקה:
- ✅ iPhone SE (מכשיר קטן)
- ✅ iPhone 13/14 (מכשיר רגיל)
- ✅ iPhone 13 Pro Max (מכשיר גדול)
- ✅ iOS 16.0+

#### איפה לבדוק?
1. **TestFlight** (לאחר הגדרת TestFlight)
2. **Xcode Simulator** (בינתיים)
3. **מכשיר פיזי** (המומלץ ביותר)

#### מה לבדוק?
- ✓ התקנה והסרה
- ✓ רישום והתחברות
- ✓ יצירת ועריכת mood entries
- ✓ ניווט בין מסכים
- ✓ Notifications (אם קיימות)
- ✓ ביצועים (מהירות, קריסות)
- ✓ כיוון מסך (Portrait/Landscape)
- ✓ Dark Mode / Light Mode

### Android Testing (משימה 5)

#### מכשירים לבדיקה:
- ✅ Samsung Galaxy (OneUI)
- ✅ Google Pixel (Stock Android)
- ✅ Xiaomi/OnePlus (Custom ROMs)
- ✅ Android 12.0+

#### איפה לבדוק?
1. **Google Play Beta** (לאחר הגדרה)
2. **Android Studio Emulator** (בינתיים)
3. **מכשירים פיזיים** (רצוי)

#### מה לבדוק?
- אותם סעיפים כמו iOS
- **בנוסף:** בדוק על מכשירים בגדלי מסך שונים

### מסמך בדיקה
צור קובץ: `docs/MANUAL_TESTING_CHECKLIST.md`

```markdown
# Manual Testing Checklist

## iOS
- [ ] iPhone SE - iOS 16
- [ ] iPhone 14 - iOS 17
- [ ] Registration flow works
- [ ] Login works
- [ ] Create mood entry
...

## Android  
- [ ] Samsung Galaxy S22 - Android 13
- [ ] Google Pixel 7 - Android 14
- [ ] Registration flow works
...
```

### זמן משוער: 3-5 ימים לכל פלטפורמה

---

## 📋 משימה 6: Performance Testing

### מה לבדוק?

#### 1. App Startup Time
```javascript
// Measure app launch time
const start = performance.now();
// App loads...
const end = performance.now();
console.log(`Startup time: ${end - start}ms`);
// Target: < 2 seconds
```

#### 2. Database Query Performance
```python
import time

def test_mood_query_performance():
    start = time.time()
    moods = get_user_moods(user_id)
    end = time.time()
    assert (end - start) < 1.0  # < 1 second
```

#### 3. Memory Usage
- השתמש ב-Xcode Instruments (iOS)
- השתמש ב-Android Profiler (Android)
- Target: < 100MB RAM

#### 4. Battery Usage
- השתמש ב-Xcode Energy Log
- Target: Low impact

### כלים:
- **iOS:** Xcode Instruments
- **Android:** Android Profiler
- **Backend:** pytest-benchmark

### זמן משוער: 2-3 ימים

---

## 📋 משימה 7: Security Testing

### מה לבדוק?

#### 1. Authentication Security
- ✓ Passwords מוצפנים
- ✓ Tokens מוצפנים
- ✓ Session timeout works
- ✓ Cannot access protected routes without auth

#### 2. Data Security
- ✓ נתונים מוצפנים ב-transit (HTTPS)
- ✓ נתונים מוצפנים ב-rest (Firebase Encryption)
- ✓ Cannot read other users' data

#### 3. API Security
- ✓ Rate limiting
- ✓ Input validation
- ✓ SQL Injection protection
- ✓ XSS protection

### כלים:
- **OWASP ZAP** - Penetration testing
- **Burp Suite** - Security scanning  
- **npm audit** / **pip-audit** - Dependency vulnerabilities

### הרצת Security Checks
```bash
# Backend
cd backend
pip install safety
safety check

# Frontend (if applicable)
cd app
npm audit
```

### זמן משוער: 2-3 ימים

---

## 📋 משימה 8: Setup TestFlight (iOS Beta)

### דרישות מוקדמות:
- ✅ Apple Developer Account ($99/year) - **Phase 2**
- ✅ App Store Connect access

### שלבים:

#### 1. הכן Build ל-TestFlight
```bash
# ב-Xcode
1. Product → Archive
2. Distribute App → App Store Connect
3. Upload
```

#### 2. הגדר ב-App Store Connect
1. גש ל: https://appstoreconnect.apple.com
2. My Apps → [MOODS] → TestFlight
3. לחץ על Build שהעלית
4. מלא:
   - **What to Test**: "Initial beta release for testing mood tracking features"
   - **Test Information**: הוסף הערות לבודקים

#### 3. הוסף Beta Testers
**Internal Testing** (עד 100 testers):
- הוסף משתמשים לפי Apple ID
- אין צורך באישור App Review

**External Testing** (עד 10,000 testers):
- צריך אישור App Review (2-3 ימים)
- שלח לאישור

#### 4. שלח הזמנות
- TestFlight שולח מייל אוטומטי
- או: שלח את הקוד הציבורי

### זמן משוער: 1-2 ימים + זמן אישור

---

## 📋 משימה 9: Setup Google Play Beta (Android)

### דרישות מוקדמות:
- ✅ Google Play Console account ($25 one-time) - **Phase 2**

### שלבים:

#### 1. הכן APK/AAB
```bash
# Android Studio
1. Build → Generate Signed Bundle/APK
2. בחר Android App Bundle (AAB)
3. Upload signing key
```

#### 2. העלה ל-Play Console
1. https://play.google.com/console
2. [MOODS] → Testing → Internal testing
3. Create new release
4. Upload AAB
5. Release notes: "Initial beta release"

#### 3. צור Beta Track
**Internal Testing** (עד 100 testers):
- מהיר, ללא אישור
- הוסף testers לפי email

**Closed Testing** (Open/Closed beta):
- זמין למספר מוגבל
- צריך אישור (כמה שעות)

**Open Testing**:
- פתוח לכולם
- צריך אישור מלא

#### 4. שלח הזמנות
- Play Console שולח מייל
- או: שתף opt-in link

### זמן משוער: 1-2 ימים

---

## 📋 משימה 10: Recruit Beta Testers (20-50 users)

### איפה למצוא בודקי בטא?

#### 1. משפחה וחברים (5-10 אנשים)
- הקל ביותר
- פידבק כנה
- מגוון מכשירים

#### 2. קהילות מקוונות (10-20 אנשים)
- **Reddit:** r/testflightbeta, r/androidapps
- **Discord:** Beta testing communities
- **Facebook Groups:** Beta testers

#### 3. פלטפורמות ייעודיות (10-20 אנשים)
- **BetaList:** https://betalist.com
- **Product Hunt Ship:** https://www.producthunt.com/ship
- **UserTesting:** https://www.usertesting.com

#### 4. משתמשים פוטנציאליים
- פרסם ב-LinkedIn
- פרסם בקבוצות בריאות נפשית
- צור landing page עם טופס הרשמה

### מסר גיוס:
```markdown
🎉 Looking for Beta Testers!

We're launching MOODS - a mood tracking app that helps you understand your emotional patterns.

As a beta tester, you'll:
- Get FREE access (6 months)\n- Test new features first\n- Help shape the product\n- Your feedback matters!\n\nInterested? Sign up here: [link]\n```\n\n### זמן משוער: 1 שבוע

---

## סיכום

מסמך זה מספק הוראות מפורטות לכל משימה שנותרה ב-Phase 3. 

**מה כבר נעשה:**
- ✅ Unit tests קיימים
- ✅ CI/CD מוגדר ב-DevOps repo

**מה נותר לעשות:**
- ❌ Integration tests
- ❌ Manual testing (iOS + Android)
- ❌ Performance testing
- ❌ Security testing
- ❌ TestFlight + Google Play Beta setup
- ❌ Beta testers recruitment
- ❌ Feedback collection & bug fixes

**זמן כולל משוער: 3-4 שבועות**
