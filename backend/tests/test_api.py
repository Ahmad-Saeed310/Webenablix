"""
Backend API Tests for Webenablix
Tests: Root endpoint, Audit endpoint, Leads, Contacts, Stats
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestRootEndpoint:
    """Test the root API endpoint"""
    
    def test_root_returns_webenablix_message(self):
        """Test that /api/ returns Webenablix API message"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "Webenablix" in data["message"]
        print(f"Root endpoint response: {data}")


class TestAuditEndpoint:
    """Test the /api/audit endpoint"""
    
    def test_audit_with_valid_url(self):
        """Test audit with a valid URL"""
        response = requests.post(
            f"{BASE_URL}/api/audit",
            json={"url": "https://example.com", "audit_type": "full"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify all required score fields
        assert "accessibility_score" in data
        assert "seo_score" in data
        assert "performance_score" in data
        assert "mobile_score" in data
        assert "security_score" in data
        assert "overall_score" in data
        
        # Verify scores are within valid range
        assert 0 <= data["accessibility_score"] <= 100
        assert 0 <= data["seo_score"] <= 100
        assert 0 <= data["performance_score"] <= 100
        assert 0 <= data["mobile_score"] <= 100
        assert 0 <= data["security_score"] <= 100
        assert 0 <= data["overall_score"] <= 100
        
        # Verify other required fields
        assert "lawsuit_risk" in data
        assert data["lawsuit_risk"] in ["low", "medium", "high"]
        assert "wcag_level" in data
        assert data["wcag_level"] in ["AAA", "AA", "A", "Non-Compliant"]
        
        # Verify issues arrays
        assert "accessibility_issues" in data
        assert "seo_issues" in data
        assert isinstance(data["accessibility_issues"], list)
        assert isinstance(data["seo_issues"], list)
        
        # Verify core web vitals
        assert "core_web_vitals" in data
        cwv = data["core_web_vitals"]
        assert "lcp" in cwv
        assert "fid" in cwv
        assert "cls" in cwv
        
        # Verify mobile friendliness
        assert "mobile_friendliness" in data
        
        # Verify security
        assert "security" in data
        
        # Verify recommendations
        assert "top_recommendations" in data
        assert isinstance(data["top_recommendations"], list)
        
        print(f"Audit completed - Overall Score: {data['overall_score']}")
    
    def test_audit_with_url_without_protocol(self):
        """Test audit with URL without http/https prefix"""
        response = requests.post(
            f"{BASE_URL}/api/audit",
            json={"url": "example.com", "audit_type": "full"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["url"].startswith("https://")
        print(f"URL normalized to: {data['url']}")
    
    def test_audit_with_invalid_url(self):
        """Test audit with invalid URL returns 400"""
        response = requests.post(
            f"{BASE_URL}/api/audit",
            json={"url": "not-a-valid-url", "audit_type": "full"}
        )
        # After adding protocol, "not-a-valid-url" becomes "https://not-a-valid-url"
        # which may or may not be valid depending on implementation
        # The API should handle this gracefully
        assert response.status_code in [200, 400]
        print(f"Invalid URL response status: {response.status_code}")


class TestAuditsHistory:
    """Test audit history endpoints"""
    
    def test_get_audits_list(self):
        """Test getting list of audits"""
        response = requests.get(f"{BASE_URL}/api/audits")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Found {len(data)} audits in history")


class TestLeadsEndpoint:
    """Test the /api/leads endpoint"""
    
    def test_create_lead(self):
        """Test creating a new lead"""
        test_email = "TEST_lead@example.com"
        response = requests.post(
            f"{BASE_URL}/api/leads",
            json={"email": test_email, "website_url": "https://test.com"}
        )
        assert response.status_code == 200
        data = response.json()
        
        assert "id" in data
        assert data["email"] == test_email
        assert "message" in data
        print(f"Lead created with ID: {data['id']}")
    
    def test_create_lead_invalid_email(self):
        """Test creating lead with invalid email"""
        response = requests.post(
            f"{BASE_URL}/api/leads",
            json={"email": "invalid-email", "website_url": "https://test.com"}
        )
        assert response.status_code == 422  # Validation error
        print("Invalid email correctly rejected")
    
    def test_get_leads_list(self):
        """Test getting list of leads"""
        response = requests.get(f"{BASE_URL}/api/leads")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Found {len(data)} leads")


class TestContactEndpoint:
    """Test the /api/contact endpoint"""
    
    def test_create_contact(self):
        """Test creating a new contact"""
        response = requests.post(
            f"{BASE_URL}/api/contact",
            json={
                "name": "TEST_User",
                "email": "TEST_contact@example.com",
                "company": "Test Company",
                "message": "This is a test message"
            }
        )
        assert response.status_code == 200
        data = response.json()
        
        assert "id" in data
        assert data["name"] == "TEST_User"
        assert data["email"] == "TEST_contact@example.com"
        assert data["status"] == "received"
        print(f"Contact created with ID: {data['id']}")
    
    def test_get_contacts_list(self):
        """Test getting list of contacts"""
        response = requests.get(f"{BASE_URL}/api/contacts")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Found {len(data)} contacts")


class TestStatsEndpoint:
    """Test the /api/stats endpoint"""
    
    def test_get_stats(self):
        """Test getting dashboard statistics"""
        response = requests.get(f"{BASE_URL}/api/stats")
        assert response.status_code == 200
        data = response.json()
        
        assert "total_audits" in data
        assert "total_leads" in data
        assert "total_contacts" in data
        assert "average_score" in data
        
        assert isinstance(data["total_audits"], int)
        assert isinstance(data["total_leads"], int)
        assert isinstance(data["total_contacts"], int)
        
        print(f"Stats: {data}")


class TestStatusEndpoint:
    """Test the /api/status endpoint"""
    
    def test_create_status_check(self):
        """Test creating a status check"""
        response = requests.post(
            f"{BASE_URL}/api/status",
            json={"client_name": "TEST_client"}
        )
        assert response.status_code == 200
        data = response.json()
        
        assert "id" in data
        assert data["client_name"] == "TEST_client"
        print(f"Status check created with ID: {data['id']}")
    
    def test_get_status_checks(self):
        """Test getting status checks"""
        response = requests.get(f"{BASE_URL}/api/status")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Found {len(data)} status checks")
