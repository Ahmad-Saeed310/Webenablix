#!/usr/bin/env python3
"""
WebAbility Backend API Test Suite
Tests all backend endpoints for the WebAbility accessibility audit platform
"""

import requests
import json
import sys
from datetime import datetime
import time

# Backend URL from environment
BACKEND_URL = "https://webplatform-io.preview.emergentagent.com"

class WebAbilityAPITester:
    def __init__(self, base_url):
        self.base_url = base_url
        self.session = requests.Session()
        self.test_results = []
        
    def log_test(self, test_name, success, details="", response_data=None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat(),
            "response_data": response_data
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        if not success and response_data:
            print(f"   Response: {response_data}")
        print()

    def test_health_check(self):
        """Test GET /api/ - Health check endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/api/")
            
            if response.status_code == 200:
                data = response.json()
                if data.get("message") == "WebAbility API is running":
                    self.log_test("Health Check", True, "API is running correctly")
                    return True
                else:
                    self.log_test("Health Check", False, f"Unexpected response: {data}", data)
                    return False
            else:
                self.log_test("Health Check", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Health Check", False, f"Exception: {str(e)}")
            return False

    def test_audit_endpoint(self):
        """Test POST /api/audit - Website accessibility audit"""
        try:
            test_data = {"url": "https://google.com"}
            response = self.session.post(
                f"{self.base_url}/api/audit",
                json=test_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Check required fields
                required_fields = ["id", "url", "score", "issues", "lawsuit_risk", "wcag_level", "total_issues", "errors", "warnings", "created_at"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_test("Audit Endpoint", False, f"Missing fields: {missing_fields}", data)
                    return False
                
                # Validate data types and ranges
                if not isinstance(data["score"], int) or not (0 <= data["score"] <= 100):
                    self.log_test("Audit Endpoint", False, f"Invalid score: {data['score']}", data)
                    return False
                
                if data["lawsuit_risk"] not in ["low", "medium", "high"]:
                    self.log_test("Audit Endpoint", False, f"Invalid lawsuit_risk: {data['lawsuit_risk']}", data)
                    return False
                
                if data["wcag_level"] not in ["A", "AA", "AAA"]:
                    self.log_test("Audit Endpoint", False, f"Invalid wcag_level: {data['wcag_level']}", data)
                    return False
                
                if not isinstance(data["issues"], list):
                    self.log_test("Audit Endpoint", False, "Issues should be a list", data)
                    return False
                
                # Check if URL was normalized correctly
                if not data["url"].startswith("https://"):
                    self.log_test("Audit Endpoint", False, f"URL not normalized: {data['url']}", data)
                    return False
                
                self.log_test("Audit Endpoint", True, f"Audit completed - Score: {data['score']}, Issues: {data['total_issues']}, Risk: {data['lawsuit_risk']}")
                return True
                
            else:
                self.log_test("Audit Endpoint", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Audit Endpoint", False, f"Exception: {str(e)}")
            return False

    def test_leads_endpoint(self):
        """Test POST /api/leads - Lead capture for free report"""
        try:
            test_data = {
                "email": "test@example.com",
                "website_url": "https://example.com"
            }
            response = self.session.post(
                f"{self.base_url}/api/leads",
                json=test_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Check required fields
                required_fields = ["id", "email", "created_at", "message"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_test("Leads Endpoint", False, f"Missing fields: {missing_fields}", data)
                    return False
                
                # Validate email
                if data["email"] != test_data["email"]:
                    self.log_test("Leads Endpoint", False, f"Email mismatch: {data['email']}", data)
                    return False
                
                # Check success message
                if "success" not in data["message"].lower():
                    self.log_test("Leads Endpoint", False, f"Unexpected message: {data['message']}", data)
                    return False
                
                self.log_test("Leads Endpoint", True, f"Lead captured successfully - ID: {data['id']}")
                return True
                
            else:
                self.log_test("Leads Endpoint", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Leads Endpoint", False, f"Exception: {str(e)}")
            return False

    def test_contact_endpoint(self):
        """Test POST /api/contact - Contact form submission"""
        try:
            test_data = {
                "name": "John Doe",
                "email": "john@example.com",
                "company": "Test Inc",
                "message": "Hello, I'm interested in your accessibility services."
            }
            response = self.session.post(
                f"{self.base_url}/api/contact",
                json=test_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Check required fields
                required_fields = ["id", "name", "email", "message", "created_at", "status"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_test("Contact Endpoint", False, f"Missing fields: {missing_fields}", data)
                    return False
                
                # Validate data
                if data["name"] != test_data["name"]:
                    self.log_test("Contact Endpoint", False, f"Name mismatch: {data['name']}", data)
                    return False
                
                if data["email"] != test_data["email"]:
                    self.log_test("Contact Endpoint", False, f"Email mismatch: {data['email']}", data)
                    return False
                
                if data["status"] != "received":
                    self.log_test("Contact Endpoint", False, f"Unexpected status: {data['status']}", data)
                    return False
                
                self.log_test("Contact Endpoint", True, f"Contact form submitted successfully - ID: {data['id']}")
                return True
                
            else:
                self.log_test("Contact Endpoint", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Contact Endpoint", False, f"Exception: {str(e)}")
            return False

    def test_stats_endpoint(self):
        """Test GET /api/stats - Dashboard statistics"""
        try:
            response = self.session.get(f"{self.base_url}/api/stats")
            
            if response.status_code == 200:
                data = response.json()
                
                # Check required fields
                required_fields = ["total_audits", "total_leads", "total_contacts", "average_score"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_test("Stats Endpoint", False, f"Missing fields: {missing_fields}", data)
                    return False
                
                # Validate data types
                for field in ["total_audits", "total_leads", "total_contacts"]:
                    if not isinstance(data[field], int) or data[field] < 0:
                        self.log_test("Stats Endpoint", False, f"Invalid {field}: {data[field]}", data)
                        return False
                
                if not isinstance(data["average_score"], (int, float)) or not (0 <= data["average_score"] <= 100):
                    self.log_test("Stats Endpoint", False, f"Invalid average_score: {data['average_score']}", data)
                    return False
                
                self.log_test("Stats Endpoint", True, f"Stats retrieved - Audits: {data['total_audits']}, Leads: {data['total_leads']}, Contacts: {data['total_contacts']}, Avg Score: {data['average_score']}")
                return True
                
            else:
                self.log_test("Stats Endpoint", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Stats Endpoint", False, f"Exception: {str(e)}")
            return False

    def test_invalid_audit_url(self):
        """Test audit endpoint with invalid URL"""
        try:
            test_data = {"url": "https://"}
            response = self.session.post(
                f"{self.base_url}/api/audit",
                json=test_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 400:
                self.log_test("Invalid URL Handling", True, "Correctly rejected invalid URL")
                return True
            else:
                self.log_test("Invalid URL Handling", False, f"Expected 400, got {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Invalid URL Handling", False, f"Exception: {str(e)}")
            return False

    def test_invalid_email_leads(self):
        """Test leads endpoint with invalid email"""
        try:
            test_data = {
                "email": "invalid-email",
                "website_url": "https://example.com"
            }
            response = self.session.post(
                f"{self.base_url}/api/leads",
                json=test_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 422:  # Pydantic validation error
                self.log_test("Invalid Email Handling", True, "Correctly rejected invalid email")
                return True
            else:
                self.log_test("Invalid Email Handling", False, f"Expected 422, got {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Invalid Email Handling", False, f"Exception: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all tests"""
        print("=" * 60)
        print("WebAbility Backend API Test Suite")
        print("=" * 60)
        print(f"Testing backend at: {self.base_url}")
        print(f"Test started at: {datetime.now().isoformat()}")
        print()
        
        tests = [
            self.test_health_check,
            self.test_audit_endpoint,
            self.test_leads_endpoint,
            self.test_contact_endpoint,
            self.test_stats_endpoint,
            self.test_invalid_audit_url,
            self.test_invalid_email_leads
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            if test():
                passed += 1
            time.sleep(0.5)  # Small delay between tests
        
        print("=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        print()
        
        if passed == total:
            print("🎉 All tests passed! WebAbility API is working correctly.")
        else:
            print("⚠️  Some tests failed. Check the details above.")
            
        return passed == total

def main():
    """Main test runner"""
    tester = WebAbilityAPITester(BACKEND_URL)
    success = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/test_results_detailed.json', 'w') as f:
        json.dump(tester.test_results, f, indent=2)
    
    print(f"\nDetailed results saved to: /app/test_results_detailed.json")
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())