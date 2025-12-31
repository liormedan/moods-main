"""
קובץ conftest.py עבור pytest
העתק את הקובץ הזה ל: moods-main/backend/tests/conftest.py
"""
import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    """Create a test client"""
    return TestClient(app)

