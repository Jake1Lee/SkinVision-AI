import requests
import json

def test_backend():
    """Test if the Flask backend is running and responding correctly"""
    
    try:
        # Test the models endpoint
        response = requests.get('http://localhost:5000/api/models', timeout=5)
        
        if response.status_code == 200:
            models = response.json()
            print("✅ Backend is running successfully!")
            print(f"✅ Found {len(models)} models available:")
            for model in models:
                print(f"   - {model['name']} ({model['id']}) - {model['accuracy']}")
            return True
        else:
            print(f"❌ Backend responded with status code: {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend server at http://localhost:5000")
        print("   Make sure to start the Flask server with: python app.py")
        return False
    except requests.exceptions.Timeout:
        print("❌ Backend server is not responding (timeout)")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    print("Testing SkinVision-AI Backend Server...")
    print("=" * 50)
    
    backend_ok = test_backend()
    
    print("\n" + "=" * 50)
    if backend_ok:
        print("🎉 Backend test passed! You can now use the full application.")
        print("   Frontend: http://localhost:3000")
        print("   Backend:  http://localhost:5000")
    else:
        print("🚨 Backend test failed! Please start the Flask server:")
        print("   1. Open terminal in the backend folder")
        print("   2. Run: pip install -r requirements.txt")
        print("   3. Run: python app.py")
        print("   4. Run this test again")
