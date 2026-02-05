import requests
import sys
import time
from datetime import datetime

class SecurebookingAPITester:
    def __init__(self, base_url="https://new-retail-ui.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.agreement_id = None
        self.bankid_order_ref = None
        self.swish_payment_ref = None

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if not endpoint.startswith('http') else endpoint
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {str(response_data)[:200]}...")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_api_root(self):
        """Test API root endpoint"""
        return self.run_test("API Root", "GET", "", 200)

    def test_create_agreement(self):
        """Test creating a new agreement"""
        agreement_data = {
            "landlord": {
                "name": "Erik Andersson",
                "personnummer": "19850315-1234",
                "address": "Storgatan 123",
                "postal_code": "11122",
                "city": "Stockholm",
                "email": "erik@example.com",
                "phone": "0701234567"
            },
            "tenant": {
                "name": "Anna Svensson", 
                "personnummer": "19900520-5678",
                "address": "Lillgatan 456",
                "postal_code": "11133",
                "city": "Stockholm",
                "email": "anna@example.com",
                "phone": "0709876543"
            },
            "property": {
                "address": "Testgatan 789",
                "postal_code": "11144",
                "city": "Stockholm",
                "property_type": "lagenhet",
                "other_info": "2 rum och kök"
            },
            "rental_period": {
                "from_date": "2025-02-01",
                "to_date": "2025-08-31",
                "person_count": 2
            },
            "payment": {
                "rent_amount": 15000,
                "payment_method": "swish",
                "security_type": "deposition",
                "security_amount": "30000 SEK"
            },
            "other": {
                "cleaning": "hyresgast",
                "special_terms": "Husdjur tillåtna",
                "comments": "Test avtal för demo"
            }
        }
        
        success, response = self.run_test("Create Agreement", "POST", "agreements", 200, agreement_data)
        if success and 'id' in response:
            self.agreement_id = response['id']
            print(f"   Agreement ID: {self.agreement_id}")
        return success

    def test_get_agreement(self):
        """Test getting agreement details"""
        if not self.agreement_id:
            print("❌ No agreement ID available for testing")
            return False
            
        return self.run_test("Get Agreement", "GET", f"agreements/{self.agreement_id}", 200)

    def test_list_agreements(self):
        """Test listing all agreements"""
        return self.run_test("List Agreements", "GET", "agreements", 200)

    def test_start_bankid_tenant(self):
        """Test starting BankID signing for tenant"""
        if not self.agreement_id:
            print("❌ No agreement ID available for testing")
            return False
            
        bankid_data = {
            "personnummer": "19900520-5678",
            "signer_type": "tenant"
        }
        
        success, response = self.run_test("Start BankID Tenant", "POST", f"agreements/{self.agreement_id}/bankid/start", 200, bankid_data)
        if success and 'order_ref' in response:
            self.bankid_order_ref = response['order_ref']
            print(f"   BankID Order Ref: {self.bankid_order_ref}")
        return success

    def test_check_bankid_status_pending(self):
        """Test checking BankID status (should be pending initially)"""
        if not self.agreement_id or not self.bankid_order_ref:
            print("❌ No agreement ID or order ref available for testing")
            return False
            
        return self.run_test("Check BankID Status (Pending)", "GET", f"agreements/{self.agreement_id}/bankid/status/{self.bankid_order_ref}", 200)

    def test_check_bankid_status_complete(self):
        """Test checking BankID status until complete (after 2 checks)"""
        if not self.agreement_id or not self.bankid_order_ref:
            print("❌ No agreement ID or order ref available for testing")
            return False
            
        # First check (should be pending)
        success1, _ = self.run_test("Check BankID Status (1st)", "GET", f"agreements/{self.agreement_id}/bankid/status/{self.bankid_order_ref}", 200)
        
        # Second check (should be pending)
        success2, _ = self.run_test("Check BankID Status (2nd)", "GET", f"agreements/{self.agreement_id}/bankid/status/{self.bankid_order_ref}", 200)
        
        # Third check (should be complete)
        success3, response = self.run_test("Check BankID Status (3rd - Complete)", "GET", f"agreements/{self.agreement_id}/bankid/status/{self.bankid_order_ref}", 200)
        
        if success3 and response.get('status') == 'complete':
            print("✅ BankID signing completed as expected")
            return True
        else:
            print("❌ BankID signing did not complete after 3 checks")
            return False

    def test_start_bankid_landlord(self):
        """Test starting BankID signing for landlord"""
        if not self.agreement_id:
            print("❌ No agreement ID available for testing")
            return False
            
        bankid_data = {
            "personnummer": "19850315-1234",
            "signer_type": "landlord"
        }
        
        success, response = self.run_test("Start BankID Landlord", "POST", f"agreements/{self.agreement_id}/bankid/start", 200, bankid_data)
        if success and 'order_ref' in response:
            self.bankid_order_ref = response['order_ref']  # Update with landlord order ref
            print(f"   BankID Order Ref (Landlord): {self.bankid_order_ref}")
        return success

    def test_complete_landlord_signing(self):
        """Test completing landlord BankID signing"""
        if not self.agreement_id or not self.bankid_order_ref:
            print("❌ No agreement ID or order ref available for testing")
            return False
            
        # Check status multiple times to trigger completion
        for i in range(3):
            success, response = self.run_test(f"Check Landlord BankID Status ({i+1})", "GET", f"agreements/{self.agreement_id}/bankid/status/{self.bankid_order_ref}", 200)
            if response.get('status') == 'complete':
                print("✅ Landlord BankID signing completed")
                return True
                
        print("❌ Landlord BankID signing did not complete")
        return False

    def test_start_swish_payment(self):
        """Test starting Swish payment"""
        if not self.agreement_id:
            print("❌ No agreement ID available for testing")
            return False
            
        swish_data = {
            "phone_number": "0701234567",
            "amount": 15000
        }
        
        success, response = self.run_test("Start Swish Payment", "POST", f"agreements/{self.agreement_id}/swish/start", 200, swish_data)
        if success and 'payment_ref' in response:
            self.swish_payment_ref = response['payment_ref']
            print(f"   Swish Payment Ref: {self.swish_payment_ref}")
        return success

    def test_complete_swish_payment(self):
        """Test completing Swish payment"""
        if not self.agreement_id or not self.swish_payment_ref:
            print("❌ No agreement ID or payment ref available for testing")
            return False
            
        # Check status multiple times to trigger completion
        for i in range(3):
            success, response = self.run_test(f"Check Swish Status ({i+1})", "GET", f"agreements/{self.agreement_id}/swish/status/{self.swish_payment_ref}", 200)
            if response.get('status') == 'complete':
                print("✅ Swish payment completed")
                return True
                
        print("❌ Swish payment did not complete")
        return False

    def test_download_pdf(self):
        """Test downloading PDF"""
        if not self.agreement_id:
            print("❌ No agreement ID available for testing")
            return False
            
        url = f"{self.api_url}/agreements/{self.agreement_id}/pdf"
        print(f"\n🔍 Testing Download PDF...")
        print(f"   URL: {url}")
        
        try:
            response = requests.get(url, timeout=10)
            self.tests_run += 1
            
            if response.status_code == 200 and response.headers.get('content-type') == 'application/pdf':
                self.tests_passed += 1
                print(f"✅ Passed - PDF downloaded successfully ({len(response.content)} bytes)")
                return True
            else:
                print(f"❌ Failed - Status: {response.status_code}, Content-Type: {response.headers.get('content-type')}")
                return False
                
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False

def main():
    print("🚀 Starting Securebooking API Tests")
    print("=" * 50)
    
    tester = SecurebookingAPITester()
    
    # Test sequence following the complete flow
    tests = [
        ("API Root", tester.test_api_root),
        ("Create Agreement", tester.test_create_agreement),
        ("Get Agreement", tester.test_get_agreement),
        ("List Agreements", tester.test_list_agreements),
        ("Start BankID Tenant", tester.test_start_bankid_tenant),
        ("Complete Tenant Signing", tester.test_check_bankid_status_complete),
        ("Start BankID Landlord", tester.test_start_bankid_landlord),
        ("Complete Landlord Signing", tester.test_complete_landlord_signing),
        ("Start Swish Payment", tester.test_start_swish_payment),
        ("Complete Swish Payment", tester.test_complete_swish_payment),
        ("Download PDF", tester.test_download_pdf),
    ]
    
    failed_tests = []
    
    for test_name, test_func in tests:
        try:
            success = test_func()
            if not success:
                failed_tests.append(test_name)
        except Exception as e:
            print(f"❌ {test_name} - Exception: {str(e)}")
            failed_tests.append(test_name)
    
    # Print results
    print("\n" + "=" * 50)
    print("📊 TEST RESULTS")
    print("=" * 50)
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run*100):.1f}%")
    
    if failed_tests:
        print(f"\n❌ Failed tests: {', '.join(failed_tests)}")
        return 1
    else:
        print("\n✅ All tests passed!")
        return 0

if __name__ == "__main__":
    sys.exit(main())