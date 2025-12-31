# הוראות להוספת בדיקות ל-moods-backend

## 📋 מה לעשות

### שלב 1: יצירת תיקיית tests

```bash
cd moods-main/backend
mkdir tests
```

### שלב 2: העתקת הקבצים

העתק את הקבצים מתיקיית `backend_tests_files/` ל-`moods-main/backend/tests/`:

1. **`__init__.py`** → `moods-main/backend/tests/__init__.py`
2. **`conftest.py`** → `moods-main/backend/tests/conftest.py`
3. **`test_main.py`** → `moods-main/backend/tests/test_main.py`

### שלב 3: עדכון requirements.txt

הוסף ל-`moods-main/backend/requirements.txt`:

```
pytest==7.4.3
pytest-cov==4.1.0
httpx==0.25.2
```

**או** צור `requirements-dev.txt` נפרד והעתק את התוכן מ-`requirements-dev.txt` כאן.

### שלב 4: בדיקה מקומית (אופציונלי)

```bash
cd moods-main/backend
pip install -r requirements.txt
pytest tests/
```

### שלב 5: Commit ו-Push

```bash
cd moods-main
git add backend/tests/ backend/requirements.txt
git commit -m "Add backend tests with pytest"
git push
```

## ✅ אחרי זה

ה-CI יעבור אוטומטית על הבדיקות בכל push ל-`main`!

## 📝 הערות

- הבדיקות בודקות את endpoint `/health` שכבר קיים בבקאנד
- אם תרצה להוסיף עוד בדיקות, פשוט הוסף קבצי `test_*.py` נוספים בתיקיית `tests/`
- `pytest` יחפש אוטומטית קבצים שמתחילים ב-`test_` או מסתיימים ב-`_test.py`

