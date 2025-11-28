# 🚩 HTTP Header CTF Challenge

A comprehensive Capture The Flag challenge designed to teach HTTP methods, headers, authentication, and security concepts through progressive difficulty levels.

## 📋 Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Challenge Structure](#challenge-structure)
- [Detailed Solutions](#detailed-solutions)
- [Hints System](#hints-system)
- [Testing](#testing)
- [Learning Resources](#learning-resources)

---

## 🎯 Overview

This CTF consists of **10 challenges** progressing from beginner to expert level:

- **Beginner (1-4)**: HTTP basics, methods, headers
- **Intermediate (5-6)**: Authentication with JWT and cookies
- **Advanced (7-8)**: Complex validation and cryptography
- **Expert (9-10)**: Rate limiting and header ordering

**Total Flags**: 14 (some challenges have multiple flags)

---

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- npm
- curl (for testing)
- Optional: Postman or Thunder Client

### Setup

```bash
# Clone or download the project
cd http-header-project

# Install dependencies
npm install

# Start the server
npm start
```

Server will run on `http://localhost:3000`

---

## 🚀 Quick Start

### Test the Server

```bash
curl http://localhost:3000
```

You should see a welcome message with challenge overview.

### Try Your First Challenge

```bash
curl -X GET http://localhost:3000/classwork1 \
  -H "Accept: application/json" \
  -H "X-API-Version: v1"
```

Success! You'll get your first flag: `FLAG{http_get_with_headers_success!}`

---

## 🎓 Challenge Structure

### Level 1: Beginner

#### Challenge 1: Basic GET Request
**Endpoint**: `/classwork1`  
**Method**: `GET`  
**Concepts**: HTTP methods, Accept headers, API versioning

**Requirements**:
- GET method
- `Accept: application/json`
- `X-API-Version: v1`
- Non-browser user agent

**Solution**:
```bash
curl -X GET http://localhost:3000/classwork1 \
  -H "Accept: application/json" \
  -H "X-API-Version: v1"
```

**Flag**: `FLAG{http_get_with_headers_success!}`

---

#### Challenge 2: POST with API Key
**Endpoint**: `/classwork2`  
**Method**: `POST`  
**Concepts**: POST requests, API authentication, JSON bodies

**Requirements**:
- POST method
- `Content-Type: application/json`
- `X-API-Key: ctf-api-key-2024`
- Body: `{"action": "authenticate"}`

**Solution**:
```bash
curl -X POST http://localhost:3000/classwork2 \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ctf-api-key-2024" \
  -d '{"action": "authenticate"}'
```

**Flag**: `FLAG{post_api_key_body_validated!}`

---

#### Challenge 3: Multi-layer Validation
**Endpoint**: `/classwork3?name=daniel`  
**Method**: `POST`  
**Concepts**: Query parameters, multiple headers, request bodies

**Requirements**:
- POST method
- Query parameter: `?name=daniel` or `?name=ibukunoluwa`
- `Content-Type: application/json`
- `Accept: application/json`
- `X-Challenge-Token: ctf-challenge-2024`
- Body: `{"code": "ladiesfirst"}`

**Solution**:
```bash
curl -X POST "http://localhost:3000/classwork3?name=daniel" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "X-Challenge-Token: ctf-challenge-2024" \
  -d '{"code": "ladiesfirst"}'
```

**Flag**: `FLAG{post_query_headers_body_validated!}`

---

#### Challenge 4: CORS Preflight
**Endpoint**: `/classwork4`  
**Method**: `OPTIONS`  
**Concepts**: CORS, preflight requests, cross-origin security

**Requirements**:
- OPTIONS method
- `Content-Type: application/json`
- `X-Options-Token: cors-preflight-2024`
- `Origin: http://localhost:3000` or `https://api.ctf.local`
- `Access-Control-Request-Method: POST`

**Solution**:
```bash
curl -X OPTIONS http://localhost:3000/classwork4 \
  -H "Content-Type: application/json" \
  -H "X-Options-Token: cors-preflight-2024" \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST"
```

**Flag**: `FLAG{options_cors_preflight_mastered!}`

---

### Level 2: Intermediate

#### Challenge 5: JWT Authentication
**Endpoint**: `/classwork5`  
**Methods**: `PUT`, `PATCH`, `DELETE`  
**Concepts**: JWT tokens, session cookies, multiple HTTP methods

**Prerequisites**: Login first!

**Step 1 - Login**:
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "pass123"}'
```

Save the `token` and `sessionid` from the response.

**Step 2 - PUT Request**:
```bash
curl -X PUT http://localhost:3000/classwork5 \
  -H "Content-Type: application/json" \
  -H "X-Custom-Header: secretvalue" \
  -H "Authorization: Bearer <your_token>" \
  --cookie "sessionid=<your_session_id>"
```

**Step 3 - PATCH Request**:
```bash
curl -X PATCH http://localhost:3000/classwork5 \
  -H "Content-Type: application/json" \
  -H "X-Custom-Header: secretvalue" \
  -H "Authorization: Bearer <your_token>" \
  --cookie "sessionid=<your_session_id>"
```

**Step 4 - DELETE Request**:
```bash
curl -X DELETE http://localhost:3000/classwork5 \
  -H "Content-Type: application/json" \
  -H "X-Custom-Header: secretvalue" \
  -H "Authorization: Bearer <your_token>" \
  --cookie "sessionid=<your_session_id>"
```

**Flags** (3 total):
- `FLAG{put_with_headers_token_cookie_passed}`
- `FLAG{patch_authorized_header_cookie_check_success}`
- `FLAG{delete_header_cookie_jwt_validation_complete}`

---

#### Challenge 6: Full Auth Stack
**Endpoint**: `/classwork6`  
**Method**: `DELETE`  
**Concepts**: Complete authentication flow validation

Same as Challenge 5, but only DELETE method works.

**Solution**:
```bash
curl -X DELETE http://localhost:3000/classwork6 \
  -H "Content-Type: application/json" \
  -H "X-Custom-Header: secretvalue" \
  -H "Authorization: Bearer <your_token>" \
  --cookie "sessionid=<your_session_id>"
```

**Flag**: `FLAG{delete_protectedroute_verified_passed}`

---

### Level 3: Advanced

#### Challenge 7: Pattern Matching
**Endpoint**: `/classwork7?access=granted`  
**Method**: `OPTIONS`  
**Concepts**: Regex patterns, referer validation, complex headers

**Requirements**:
- OPTIONS method
- Query: `?access=granted`
- `Content-Type: application/json`
- `X-Custom-Header: QPD3f%opvalue` (exact match with special chars!)
- `X-Code-Name: agent-###` (e.g., agent-007, agent-123)
- `Referer:` must include `trusted-client.local`
- Session cookie
- Body: `{"name": "cyber", "level": 5}`

**Solution**:
```bash
curl -X OPTIONS "http://localhost:3000/classwork7?access=granted" \
  -H "Content-Type: application/json" \
  -H "X-Custom-Header: QPD3f%opvalue" \
  -H "X-Code-Name: agent-007" \
  -H "Referer: https://trusted-client.local/dashboard" \
  --cookie "sessionid=<your_session_id>" \
  -d '{"name": "cyber", "level": 5}'
```

**Flag**: `FLAG{multi-layered_http_master}`

---

#### Challenge 8: Cryptographic Challenge
**Endpoint**: `/classwork8`  
**Method**: `DELETE` (with separate `/login` endpoint)  
**Concepts**: HMAC signatures, MD5 hashing, challenge-response

This is a **two-step challenge** involving cryptographic operations.

**Step 1 - Login to get challenge**:
```bash
curl -X POST http://localhost:3000/classwork8/login \
  -H "Content-Type: application/json" \
  -d '{"username":"student","password":"pass123"}'
```

Response contains:
- `token`: JWT for authorization
- `challenge`: Random hex string to process

**Step 2 - Compute MD5 hash of challenge**:
```bash
CHALLENGE="<challenge_from_login>"
RESPONSE=$(echo -n "$CHALLENGE" | md5sum | awk '{print $1}')
```

**Step 3 - Create payload and generate HMAC signature**:
```bash
PAYLOAD='{"challenge":"'$CHALLENGE'","response":"'$RESPONSE'"}'
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "ctf-secret-key-2025-do-not-share-in-production" | awk '{print $2}')
```

**Step 4 - Send DELETE request**:
```bash
curl -X DELETE http://localhost:3000/classwork8 \
  -H "Content-Type: application/json" \
  -H "X-Custom-Header: secretvalue" \
  -H "Authorization: Bearer <token_from_login>" \
  -H "X-Payload-Signature: $SIGNATURE" \
  --cookie "sessionid=ctf-session-5u48p43c2piajum0e2ruu71vs1" \
  -d "$PAYLOAD"
```

**Complete Script**:
```bash
#!/bin/bash
# Login
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/classwork8/login \
  -H "Content-Type: application/json" \
  -d '{"username":"student","password":"pass123"}')

CHALLENGE=$(echo $LOGIN_RESPONSE | grep -o '"challenge":"[^"]*' | cut -d'"' -f4)
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Compute MD5
RESPONSE=$(echo -n "$CHALLENGE" | md5sum | awk '{print $1}')

# Generate signature
PAYLOAD='{"challenge":"'$CHALLENGE'","response":"'$RESPONSE'"}'
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "ctf-secret-key-2025-do-not-share-in-production" | awk '{print $2}')

# Final request
curl -X DELETE http://localhost:3000/classwork8 \
  -H "Content-Type: application/json" \
  -H "X-Custom-Header: secretvalue" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Payload-Signature: $SIGNATURE" \
  --cookie "sessionid=ctf-session-5u48p43c2piajum0e2ruu71vs1" \
  -d "$PAYLOAD"
```

**Flags** (role-based):
- `FLAG{student_solved_the_layers}` (student login)
- `FLAG{admin_mastermind_verified}` (admin login with password: admin123)

---

### Level 4: Expert

#### Challenge 9: Rate Limit Bypass
**Endpoint**: `/classwork9`  
**Method**: Any  
**Concepts**: Rate limiting, bypass mechanisms

**Requirements**:
- Make 4+ requests to trigger rate limit
- Find the bypass header to access endpoint

**Solution**:
```bash
# This will fail after 3 requests
curl http://localhost:3000/classwork9

# Use bypass token
curl http://localhost:3000/classwork9 \
  -H "X-Bypass-Token: bypass-rate-limit-2025"
```

**Flag**: `FLAG{rate_limit_bypass_discovered}`

---

#### Challenge 10: Header Ordering
**Endpoint**: `/classwork10`  
**Method**: `POST`  
**Concepts**: Header sequence, order sensitivity

**Requirements**:
- Headers must be sent in EXACT order:
  1. `Content-Type: application/json`
  2. `X-First: alpha`
  3. `X-Second: beta`
  4. `X-Third: gamma`

**Solution**:
```bash
curl -X POST http://localhost:3000/classwork10 \
  -H "Content-Type: application/json" \
  -H "X-First: alpha" \
  -H "X-Second: beta" \
  -H "X-Third: gamma" \
  -d '{}'
```

**Flag**: `FLAG{header_order_matters_expert}`

---

## 💡 Hints System

Access progressive hints for any challenge:

```bash
# Get first hint
curl http://localhost:3000/hints/1?level=1

# Get more hints
curl http://localhost:3000/hints/1?level=2
curl http://localhost:3000/hints/1?level=3
```

List all challenges with hints:
```bash
curl http://localhost:3000/hints
```

---

## 🧪 Testing

### Using the Test Script

Save the test script from `test-challenges.sh` and make it executable:

```bash
chmod +x test-challenges.sh
./test-challenges.sh
```

The script provides:
- Interactive menu
- Automated testing for all challenges
- Login helper
- Hints access
- Color-coded results

### Manual Testing

Test individual endpoints using curl commands provided in each challenge section.

---

## 📚 Learning Resources

### HTTP Methods
- **GET**: Retrieve data
- **POST**: Submit data
- **PUT**: Update entire resource
- **PATCH**: Partial update
- **DELETE**: Remove resource
- **OPTIONS**: Get allowed methods (CORS preflight)

### Important Headers
- **Accept**: Specifies expected response format
- **Content-Type**: Indicates request body format
- **Authorization**: Authentication credentials (Bearer tokens)
- **Cookie**: Session management
- **Origin**: CORS request origin
- **Referer**: Previous page URL
- **User-Agent**: Client identification

### Security Concepts
- **JWT (JSON Web Tokens)**: Stateless authentication
- **HMAC**: Hash-based message authentication
- **CORS**: Cross-Origin Resource Sharing
- **Rate Limiting**: Request throttling
- **Session Cookies**: Stateful authentication

---

## 🏆 All Flags Summary

| Challenge | Difficulty | Flag(s) |
|-----------|-----------|---------|
| 1 | Beginner | `FLAG{http_get_with_headers_success!}` |
| 2 | Beginner | `FLAG{post_api_key_body_validated!}` |
| 3 | Beginner | `FLAG{post_query_headers_body_validated!}` |
| 4 | Beginner | `FLAG{options_cors_preflight_mastered!}` |
| 5 | Intermediate | `FLAG{put_with_headers_token_cookie_passed}`<br>`FLAG{patch_authorized_header_cookie_check_success}`<br>`FLAG{delete_header_cookie_jwt_validation_complete}` |
| 6 | Intermediate | `FLAG{delete_protectedroute_verified_passed}` |
| 7 | Advanced | `FLAG{multi-layered_http_master}` |
| 8 | Advanced | `FLAG{student_solved_the_layers}`<br>`FLAG{admin_mastermind_verified}` |
| 9 | Expert | `FLAG{rate_limit_bypass_discovered}` |
| 10 | Expert | `FLAG{header_order_matters_expert}` |

**Total**: 14 flags

---

## 🐛 Troubleshooting

### "Browser Not Allowed" Error
Use curl, Postman, or Thunder Client instead of a web browser.

### "Invalid Token" Error
Your JWT token expired. Login again at `/login`.

### "Invalid Session Cookie" Error
Include the session cookie from login: `--cookie "sessionid=<value>"`

### Challenge 8 Signature Issues
- Ensure SECRET_KEY matches exactly
- Use `echo -n` (no newline) for hash generation
- Stringify JSON without extra spaces

### Rate Limit Hit
Wait 15 minutes or use the bypass token for Challenge 9.

---

## 🎉 Congratulations!

If you've completed all challenges, you've mastered:
- HTTP methods and headers
- API authentication (JWT, cookies, API keys)
- CORS and preflight requests
- Cryptographic operations (HMAC, MD5)
- Rate limiting and bypass techniques
- Advanced header manipulation

Share your achievement! 🚩

---

## 📄 License

This project is for educational purposes only.

## 👨‍💻 Contributors

Created for learning HTTP security concepts progressively.

Happy Hacking! 🎯