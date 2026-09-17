import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.database import init_db

client = TestClient(app)

def setup_module(module):
    init_db()

def test_login_demo_user():
    response = client.post("/api/auth/login", json={
        "email": "officer@sahayya.ai",
        "password": "sahayya123"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "token" in data
    assert data["user"]["email"] == "officer@sahayya.ai"
    assert data["user"]["role"] == "Disaster Management Officer"

def test_login_invalid_password():
    response = client.post("/api/auth/login", json={
        "email": "officer@sahayya.ai",
        "password": "wrongpassword"
    })
    assert response.status_code == 401

def test_register_new_user():
    import uuid
    rand_email = f"user_{uuid.uuid4().hex[:6]}@example.com"
    response = client.post("/api/auth/register", json={
        "name": "Test User",
        "email": rand_email,
        "password": "securepassword123",
        "role": "Municipal Ward Officer",
        "ward": "Hadapsar"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["user"]["email"] == rand_email
    assert data["user"]["name"] == "Test User"

def test_forgot_password():
    response = client.post("/api/auth/forgot-password", json={
        "email": "officer@sahayya.ai"
    })
    assert response.status_code == 200
    assert response.json()["status"] == "success"
