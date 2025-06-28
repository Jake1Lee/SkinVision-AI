#!/usr/bin/env python3
"""
Quick test script to verify all Flask endpoints are working properly.
"""
import requests
import json

def test_endpoint(url, method='GET', data=None, files=None):
    """Test an endpoint and return results"""
    try:
        if method == 'GET':
            response = requests.get(url)
        elif method == 'POST':
            response = requests.post(url, json=data, files=files)
        
        print(f"✅ {method} {url} - Status: {response.status_code}")
        if response.status_code == 200:
            try:
                result = response.json()
                print(f"   Response: {json.dumps(result, indent=2)[:200]}...")
            except:
                print(f"   Response: {response.text[:200]}...")
        else:
            print(f"   Error: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ {method} {url} - Error: {e}")
        return False

def main():
    base_url = "http://localhost:5000"
    
    print("🧪 Testing Flask Backend Endpoints...")
    print("=" * 50)
    
    # Test models endpoint
    test_endpoint(f"{base_url}/api/models")
    
    # Test analyze endpoint with sample data
    print("\n🔍 Testing analyze endpoint...")
    analyze_data = {
        "filename": "test_image.jpg",
        "model": "resnet50"
    }
    test_endpoint(f"{base_url}/api/analyze", "POST", analyze_data)
    
    print("\n🎯 Testing CORS headers...")
    try:
        response = requests.options(f"{base_url}/api/models", headers={
            'Origin': 'http://localhost:3000',
            'Access-Control-Request-Method': 'GET'
        })
        print(f"✅ OPTIONS /api/models - Status: {response.status_code}")
        cors_headers = {k: v for k, v in response.headers.items() if 'access-control' in k.lower()}
        print(f"   CORS Headers: {cors_headers}")
    except Exception as e:
        print(f"❌ CORS test failed: {e}")
    
    print("\n" + "=" * 50)
    print("🏁 Endpoint testing complete!")

if __name__ == "__main__":
    main()
