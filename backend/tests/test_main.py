"""
בדיקות עבור moods-backend
"""
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_check():
    """Test the /health endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert data["status"] == "ok"
    assert "app" in data


def test_health_check_returns_json():
    """Test that /health returns valid JSON"""
    response = client.get("/health")
    assert response.headers["content-type"] == "application/json"
