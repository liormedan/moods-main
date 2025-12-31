"""
קובץ conftest.py עבור pytest
"""
import pytest
import os
from fastapi.testclient import TestClient

# Set environment to test
os.environ["TESTING"] = "true"

# Load environment variables from .env.test
try:
    from dotenv import load_dotenv
    env_path = os.path.join(os.path.dirname(__file__), "..", ".env.test")
    if os.path.exists(env_path):
        load_dotenv(env_path)
except ImportError:
    # python-dotenv not installed, skip loading .env.test
    pass

from app.main import app


@pytest.fixture
def client():
    """Create a test client"""
    return TestClient(app)
