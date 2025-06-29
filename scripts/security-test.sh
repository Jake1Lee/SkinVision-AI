#!/bin/bash
# SkinVision Security Test Script

echo "🔐 SkinVision AI Security Test Suite"
echo "======================================"
echo ""

# Test 1: HTTPS Redirect
echo "1. Testing HTTP to HTTPS redirect..."
HTTP_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://skinvisionai.com)
if [ "$HTTP_RESPONSE" = "301" ]; then
    echo "   ✅ HTTP redirects to HTTPS (301)"
else
    echo "   ❌ HTTP redirect failed (got $HTTP_RESPONSE)"
fi
echo ""

# Test 2: HTTPS Certificate
echo "2. Testing SSL certificate..."
SSL_CHECK=$(echo | openssl s_client -connect skinvisionai.com:443 -servername skinvisionai.com 2>/dev/null | grep "Verification: OK")
if [ ! -z "$SSL_CHECK" ]; then
    echo "   ✅ SSL certificate is valid"
else
    echo "   ❌ SSL certificate validation failed"
fi
echo ""

# Test 3: Security Headers
echo "3. Testing security headers..."
HEADERS=$(curl -s -I https://skinvisionai.com)

if echo "$HEADERS" | grep -q "strict-transport-security"; then
    echo "   ✅ HSTS header present"
else
    echo "   ❌ HSTS header missing"
fi

if echo "$HEADERS" | grep -q "x-frame-options"; then
    echo "   ✅ X-Frame-Options header present"
else
    echo "   ❌ X-Frame-Options header missing"
fi

if echo "$HEADERS" | grep -q "x-content-type-options"; then
    echo "   ✅ X-Content-Type-Options header present"
else
    echo "   ❌ X-Content-Type-Options header missing"
fi

if echo "$HEADERS" | grep -q "content-security-policy"; then
    echo "   ✅ Content Security Policy present"
else
    echo "   ❌ Content Security Policy missing"
fi
echo ""

# Test 4: API Endpoints
echo "4. Testing API endpoints over HTTPS..."
API_RESPONSE=$(curl -s -w "%{http_code}" https://skinvisionai.com/api/models -o /dev/null)
if [ "$API_RESPONSE" = "200" ]; then
    echo "   ✅ API endpoints accessible over HTTPS"
else
    echo "   ❌ API endpoints failed (got $API_RESPONSE)"
fi
echo ""

# Test 5: HTTP/2 Support
echo "5. Testing HTTP/2 support..."
if echo "$HEADERS" | grep -q "HTTP/2"; then
    echo "   ✅ HTTP/2 is enabled"
else
    echo "   ❌ HTTP/2 not detected"
fi
echo ""

# Test 6: CSP for Firebase
echo "6. Testing CSP allows Firebase domains..."
CSP_HEADER=$(curl -s -I https://skinvisionai.com | grep -i "content-security-policy")
if echo "$CSP_HEADER" | grep -q "apis.google.com"; then
    echo "   ✅ CSP allows Google APIs"
else
    echo "   ❌ CSP blocks Google APIs"
fi

if echo "$CSP_HEADER" | grep -q "firestore.googleapis.com"; then
    echo "   ✅ CSP allows Firestore"
else
    echo "   ❌ CSP blocks Firestore"
fi
echo ""

# Test 7: Certificate Expiry
echo "7. Checking certificate expiry..."
CERT_EXPIRY=$(echo | openssl s_client -connect skinvisionai.com:443 -servername skinvisionai.com 2>/dev/null | openssl x509 -noout -dates | grep "notAfter")
echo "   📅 Certificate expires: $CERT_EXPIRY"
echo ""

echo "🔐 Security test complete!"
echo ""
echo "For additional testing, you can use:"
echo "- SSL Labs test: https://www.ssllabs.com/ssltest/analyze.html?d=skinvisionai.com"
echo "- Security Headers: https://securityheaders.com/?q=skinvisionai.com"
echo "- Mozilla Observatory: https://observatory.mozilla.org/analyze/skinvisionai.com"
