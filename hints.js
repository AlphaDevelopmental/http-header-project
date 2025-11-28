// ==========================================
// FILE: hints.js
// ==========================================
const express = require('express');
const router = express.Router();

const hints = {
  '1': {
    challenge: 'Challenge 1: Basic GET Request',
    difficulty: 'Beginner',
    hints: [
      {
        level: 1,
        hint: 'This challenge requires a GET request. Use curl or Postman, not a browser.'
      },
      {
        level: 2,
        hint: 'You need three headers: Accept, X-API-Version, and User-Agent (non-browser).'
      },
      {
        level: 3,
        hint: 'Set Accept: application/json and X-API-Version: v1'
      },
      {
        level: 4,
        hint: 'Full solution: curl -X GET http://localhost:3000/classwork1 -H "Accept: application/json" -H "X-API-Version: v1"'
      }
    ]
  },
  '2': {
    challenge: 'Challenge 2: POST with API Key',
    difficulty: 'Beginner',
    hints: [
      {
        level: 1,
        hint: 'This requires a POST request with JSON body and special headers.'
      },
      {
        level: 2,
        hint: 'You need Content-Type: application/json and a custom API key header.'
      },
      {
        level: 3,
        hint: 'The API key header is X-API-Key: ctf-api-key-2024'
      },
      {
        level: 4,
        hint: 'Body should be: {"action": "authenticate"}'
      },
      {
        level: 5,
        hint: 'Full solution: curl -X POST http://localhost:3000/classwork2 -H "Content-Type: application/json" -H "X-API-Key: ctf-api-key-2024" -d \'{"action": "authenticate"}\''
      }
    ]
  },
  '3': {
    challenge: 'Challenge 3: Multi-layer POST',
    difficulty: 'Beginner',
    hints: [
      {
        level: 1,
        hint: 'This challenge combines query parameters, multiple headers, and a JSON body.'
      },
      {
        level: 2,
        hint: 'Add a query parameter ?name=daniel or ?name=ibukunoluwa'
      },
      {
        level: 3,
        hint: 'Headers needed: Content-Type, Accept, X-Challenge-Token'
      },
      {
        level: 4,
        hint: 'X-Challenge-Token should be: ctf-challenge-2024'
      },
      {
        level: 5,
        hint: 'Body should contain: {"code": "ladiesfirst"}'
      },
      {
        level: 6,
        hint: 'Full solution: curl -X POST "http://localhost:3000/classwork3?name=daniel" -H "Content-Type: application/json" -H "Accept: application/json" -H "X-Challenge-Token: ctf-challenge-2024" -d \'{"code": "ladiesfirst"}\''
      }
    ]
  },
  '4': {
    challenge: 'Challenge 4: CORS Preflight (OPTIONS)',
    difficulty: 'Beginner',
    hints: [
      {
        level: 1,
        hint: 'This challenge teaches CORS preflight requests. Use the OPTIONS method.'
      },
      {
        level: 2,
        hint: 'You need Origin header and Access-Control-Request-Method header.'
      },
      {
        level: 3,
        hint: 'Origin can be: http://localhost:3000 or https://api.ctf.local'
      },
      {
        level: 4,
        hint: 'Access-Control-Request-Method should be: POST'
      },
      {
        level: 5,
        hint: 'Don\'t forget X-Options-Token: cors-preflight-2024'
      },
      {
        level: 6,
        hint: 'Full solution: curl -X OPTIONS http://localhost:3000/classwork4 -H "Content-Type: application/json" -H "X-Options-Token: cors-preflight-2024" -H "Origin: http://localhost:3000" -H "Access-Control-Request-Method: POST"'
      }
    ]
  },
  '5': {
    challenge: 'Challenge 5: JWT Authentication (PUT/PATCH/DELETE)',
    difficulty: 'Intermediate',
    hints: [
      {
        level: 1,
        hint: 'This challenge requires authentication. First, login at /login to get a token.'
      },
      {
        level: 2,
        hint: 'Login with: {"username": "admin", "password": "pass123"}'
      },
      {
        level: 3,
        hint: 'After login, use the token in Authorization: Bearer <token> header'
      },
      {
        level: 4,
        hint: 'You also need the sessionid cookie from login response'
      },
      {
        level: 5,
        hint: 'Add X-Custom-Header: secretvalue'
      },
      {
        level: 6,
        hint: 'This challenge has 3 flags! Try PUT, PATCH, and DELETE methods separately.'
      },
      {
        level: 7,
        hint: 'Full solution (PUT): curl -X PUT http://localhost:3000/classwork5 -H "Content-Type: application/json" -H "X-Custom-Header: secretvalue" -H "Authorization: Bearer <token>" --cookie "sessionid=<session>"'
      }
    ]
  },
  '6': {
    challenge: 'Challenge 6: Full Auth Stack (DELETE)',
    difficulty: 'Intermediate',
    hints: [
      {
        level: 1,
        hint: 'Similar to Challenge 5, but only DELETE method works here.'
      },
      {
        level: 2,
        hint: 'Make sure you have: JWT token, session cookie, custom header, and correct Content-Type.'
      },
      {
        level: 3,
        hint: 'If token expired, login again at /login'
      },
      {
        level: 4,
        hint: 'Full solution: curl -X DELETE http://localhost:3000/classwork6 -H "Content-Type: application/json" -H "X-Custom-Header: secretvalue" -H "Authorization: Bearer <token>" --cookie "sessionid=<session>"'
      }
    ]
  },
  '7': {
    challenge: 'Challenge 7: Pattern Matching',
    difficulty: 'Advanced',
    hints: [
      {
        level: 1,
        hint: 'This challenge uses OPTIONS method with complex header validation.'
      },
      {
        level: 2,
        hint: 'You need a query parameter: ?access=granted'
      },
      {
        level: 3,
        hint: 'X-Custom-Header needs a special value: QPD3f%opvalue (exact match including special chars)'
      },
      {
        level: 4,
        hint: 'X-Code-Name must match pattern: agent-### (e.g., agent-007, agent-123)'
      },
      {
        level: 5,
        hint: 'Referer must include: trusted-client.local'
      },
      {
        level: 6,
        hint: 'Body must be: {"name": "cyber", "level": 5}'
      },
      {
        level: 7,
        hint: 'Full solution: curl -X OPTIONS "http://localhost:3000/classwork7?access=granted" -H "Content-Type: application/json" -H "X-Custom-Header: QPD3f%opvalue" -H "X-Code-Name: agent-007" -H "Referer: https://trusted-client.local/dashboard" --cookie "sessionid=<session>" -d \'{"name": "cyber", "level": 5}\''
      }
    ]
  },
  '8': {
    challenge: 'Challenge 8: Cryptographic Challenge',
    difficulty: 'Advanced',
    hints: [
      {
        level: 1,
        hint: 'This is a two-step challenge. First, login at /classwork8/login to get a challenge token.'
      },
      {
        level: 2,
        hint: 'Login with student (pass123) or admin (admin123) credentials.'
      },
      {
        level: 3,
        hint: 'The login response contains a "challenge" value. You need to compute its MD5 hash.'
      },
      {
        level: 4,
        hint: 'Bash example: RESPONSE=$(echo -n "challenge_value" | md5sum | awk \'{print $1}\')'
      },
      {
        level: 5,
        hint: 'Create JSON body: {"challenge": "original_value", "response": "md5_hash"}'
      },
      {
        level: 6,
        hint: 'Generate HMAC-SHA256 signature of the entire JSON body using the SECRET_KEY.'
      },
      {
        level: 7,
        hint: 'Bash: SIGNATURE=$(echo -n \'{"challenge":"...","response":"..."}\' | openssl dgst -sha256 -hmac "ctf-secret-key-2025-do-not-share-in-production" | awk \'{print $2}\')'
      },
      {
        level: 8,
        hint: 'Add signature as X-Payload-Signature header in DELETE request.'
      },
      {
        level: 9,
        hint: 'Check the complete solution script at the end of this hint list.'
      }
    ]
  },
  '9': {
    challenge: 'Challenge 9: Rate Limit Bypass',
    difficulty: 'Expert',
    hints: [
      {
        level: 1,
        hint: 'This endpoint is rate-limited to 3 requests per minute.'
      },
      {
        level: 2,
        hint: 'Try making 4+ requests quickly to trigger the rate limit error.'
      },
      {
        level: 3,
        hint: 'The error message mentions looking for a special header to bypass.'
      },
      {
        level: 4,
        hint: 'The bypass header is: X-Bypass-Token: bypass-rate-limit-2025'
      },
      {
        level: 5,
        hint: 'Full solution: curl http://localhost:3000/classwork9 -H "X-Bypass-Token: bypass-rate-limit-2025"'
      }
    ]
  },
  '10': {
    challenge: 'Challenge 10: Header Ordering',
    difficulty: 'Expert',
    hints: [
      {
        level: 1,
        hint: 'This challenge is about the ORDER in which headers are sent, not just their presence.'
      },
      {
        level: 2,
        hint: 'You need four headers in a specific sequence: content-type, x-first, x-second, x-third'
      },
      {
        level: 3,
        hint: 'Header values: X-First: alpha, X-Second: beta, X-Third: gamma'
      },
      {
        level: 4,
        hint: 'In curl, headers are sent in the order you specify with -H flags.'
      },
      {
        level: 5,
        hint: 'Full solution: curl -X POST http://localhost:3000/classwork10 -H "Content-Type: application/json" -H "X-First: alpha" -H "X-Second: beta" -H "X-Third: gamma" -d \'{}\''
      }
    ]
  }
};

// Get hints for a specific challenge
router.get('/:challenge', (req, res) => {
  const challengeNum = req.params.challenge;
  const level = parseInt(req.query.level) || 1;

  if (!hints[challengeNum]) {
    return res.status(404).json({
      error: 'Challenge not found',
      availableChallenges: Object.keys(hints),
      usage: 'GET /hints/:challenge?level=1'
    });
  }

  const challengeHints = hints[challengeNum];
  
  if (level < 1 || level > challengeHints.hints.length) {
    return res.json({
      challenge: challengeHints.challenge,
      difficulty: challengeHints.difficulty,
      totalHints: challengeHints.hints.length,
      error: `Invalid hint level. Choose between 1 and ${challengeHints.hints.length}`,
      usage: `GET /hints/${challengeNum}?level=1`
    });
  }

  // Return hints up to requested level
  const revealedHints = challengeHints.hints.slice(0, level);

  res.json({
    challenge: challengeHints.challenge,
    difficulty: challengeHints.difficulty,
    currentLevel: level,
    totalHints: challengeHints.hints.length,
    hints: revealedHints,
    nextHint: level < challengeHints.hints.length ? `/hints/${challengeNum}?level=${level + 1}` : null
  });
});

// List all available challenges
router.get('/', (req, res) => {
  const challengeList = Object.entries(hints).map(([num, data]) => ({
    challenge: num,
    name: data.challenge,
    difficulty: data.difficulty,
    totalHints: data.hints.length,
    url: `/hints/${num}`
  }));

  res.json({
    message: 'HTTP Header CTF Hints System',
    usage: 'GET /hints/:challenge?level=1',
    challenges: challengeList
  });
});

module.exports = router;

// ==========================================
// FILE: test-challenges.sh (Testing Script)
// ==========================================
/*
#!/bin/bash

# HTTP Header CTF Testing Script
# This script helps you test all challenges

SERVER="http://localhost:3000"
TOKEN=""
SESSION_ID=""
CHALLENGE=""
RESPONSE=""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  HTTP Header CTF Testing Script       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Function to display menu
show_menu() {
    echo -e "${YELLOW}Select a challenge to test:${NC}"
    echo "1.  Challenge 1 (Beginner - GET)"
    echo "2.  Challenge 2 (Beginner - POST + API Key)"
    echo "3.  Challenge 3 (Beginner - Multi-layer)"
    echo "4.  Challenge 4 (Beginner - CORS OPTIONS)"
    echo "5.  Challenge 5 (Intermediate - PUT/PATCH/DELETE)"
    echo "6.  Challenge 6 (Intermediate - DELETE Auth)"
    echo "7.  Challenge 7 (Advanced - Pattern Match)"
    echo "8.  Challenge 8 (Advanced - Crypto)"
    echo "9.  Challenge 9 (Expert - Rate Limit)"
    echo "10. Challenge 10 (Expert - Header Order)"
    echo ""
    echo "L. Login (Get Token)"
    echo "H. Get Hints"
    echo "A. Test All Challenges"
    echo "Q. Quit"
    echo ""
}

# Login function
login() {
    echo -e "${BLUE}[*] Logging in...${NC}"
    RESPONSE=$(curl -s -X POST "$SERVER/login" \
        -H "Content-Type: application/json" \
        -d '{"username": "admin", "password": "pass123"}' \
        -c cookies.txt)
    
    TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    SESSION_ID=$(cat cookies.txt | grep sessionid | awk '{print $7}')
    
    if [ -z "$TOKEN" ]; then
        echo -e "${RED}[✗] Login failed!${NC}"
        echo $RESPONSE | jq '.'
    else
        echo -e "${GREEN}[✓] Login successful!${NC}"
        echo "Token: ${TOKEN:0:20}..."
        echo "Session: $SESSION_ID"
    fi
    echo ""
}

# Challenge 1
test_challenge1() {
    echo -e "${BLUE}[*] Testing Challenge 1...${NC}"
    RESPONSE=$(curl -s -X GET "$SERVER/classwork1" \
        -H "Accept: application/json" \
        -H "X-API-Version: v1")
    
    if echo $RESPONSE | grep -q "FLAG{"; then
        echo -e "${GREEN}[✓] Challenge 1 PASSED!${NC}"
        echo $RESPONSE | jq '.flag, .message'
    else
        echo -e "${RED}[✗] Challenge 1 FAILED!${NC}"
        echo $RESPONSE | jq '.'
    fi
    echo ""
}

# Challenge 2
test_challenge2() {
    echo -e "${BLUE}[*] Testing Challenge 2...${NC}"
    RESPONSE=$(curl -s -X POST "$SERVER/classwork2" \
        -H "Content-Type: application/json" \
        -H "X-API-Key: ctf-api-key-2024" \
        -d '{"action": "authenticate"}')
    
    if echo $RESPONSE | grep -q "FLAG{"; then
        echo -e "${GREEN}[✓] Challenge 2 PASSED!${NC}"
        echo $RESPONSE | jq '.flag, .message'
    else
        echo -e "${RED}[✗] Challenge 2 FAILED!${NC}"
        echo $RESPONSE | jq '.'
    fi
    echo ""
}

# Challenge 3
test_challenge3() {
    echo -e "${BLUE}[*] Testing Challenge 3...${NC}"
    RESPONSE=$(curl -s -X POST "$SERVER/classwork3?name=daniel" \
        -H "Content-Type: application/json" \
        -H "Accept: application/json" \
        -H "X-Challenge-Token: ctf-challenge-2024" \
        -d '{"code": "ladiesfirst"}')
    
    if echo $RESPONSE | grep -q "FLAG{"; then
        echo -e "${GREEN}[✓] Challenge 3 PASSED!${NC}"
        echo $RESPONSE | jq '.flag, .message'
    else
        echo -e "${RED}[✗] Challenge 3 FAILED!${NC}"
        echo $RESPONSE | jq '.'
    fi
    echo ""
}

# Challenge 4
test_challenge4() {
    echo -e "${BLUE}[*] Testing Challenge 4...${NC}"
    RESPONSE=$(curl -s -X OPTIONS "$SERVER/classwork4" \
        -H "Content-Type: application/json" \
        -H "X-Options-Token: cors-preflight-2024" \
        -H "Origin: http://localhost:3000" \
        -H "Access-Control-Request-Method: POST")
    
    if echo $RESPONSE | grep -q "FLAG{"; then
        echo -e "${GREEN}[✓] Challenge 4 PASSED!${NC}"
        echo $RESPONSE | jq '.flag, .message'
    else
        echo -e "${RED}[✗] Challenge 4 FAILED!${NC}"
        echo $RESPONSE | jq '.'
    fi
    echo ""
}

# Challenge 5 (all three methods)
test_challenge5() {
    if [ -z "$TOKEN" ]; then
        echo -e "${YELLOW}[!] Need to login first. Running login...${NC}"
        login
    fi
    
    echo -e "${BLUE}[*] Testing Challenge 5 (PUT)...${NC}"
    RESPONSE=$(curl -s -X PUT "$SERVER/classwork5" \
        -H "Content-Type: application/json" \
        -H "X-Custom-Header: secretvalue" \
        -H "Authorization: Bearer $TOKEN" \
        --cookie "sessionid=$SESSION_ID")
    
    if echo $RESPONSE | grep -q "FLAG{"; then
        echo -e "${GREEN}[✓] Challenge 5 PUT PASSED!${NC}"
        echo $RESPONSE | jq '.flag'
    else
        echo -e "${RED}[✗] Challenge 5 PUT FAILED!${NC}"
        echo $RESPONSE | jq '.'
    fi
    
    echo -e "${BLUE}[*] Testing Challenge 5 (PATCH)...${NC}"
    RESPONSE=$(curl -s -X PATCH "$SERVER/classwork5" \
        -H "Content-Type: application/json" \
        -H "X-Custom-Header: secretvalue" \
        -H "Authorization: Bearer $TOKEN" \
        --cookie "sessionid=$SESSION_ID")
    
    if echo $RESPONSE | grep -q "FLAG{"; then
        echo -e "${GREEN}[✓] Challenge 5 PATCH PASSED!${NC}"
        echo $RESPONSE | jq '.flag'
    else
        echo -e "${RED}[✗] Challenge 5 PATCH FAILED!${NC}"
    fi
    
    echo -e "${BLUE}[*] Testing Challenge 5 (DELETE)...${NC}"
    RESPONSE=$(curl -s -X DELETE "$SERVER/classwork5" \
        -H "Content-Type: application/json" \
        -H "X-Custom-Header: secretvalue" \
        -H "Authorization: Bearer $TOKEN" \
        --cookie "sessionid=$SESSION_ID")
    
    if echo $RESPONSE | grep -q "FLAG{"; then
        echo -e "${GREEN}[✓] Challenge 5 DELETE PASSED!${NC}"
        echo $RESPONSE | jq '.flag'
    else
        echo -e "${RED}[✗] Challenge 5 DELETE FAILED!${NC}"
    fi
    echo ""
}

# Challenge 8 (Crypto challenge)
test_challenge8() {
    echo -e "${BLUE}[*] Testing Challenge 8 (Cryptographic)...${NC}"
    
    # Step 1: Login to get challenge
    echo -e "${BLUE}[*] Step 1: Logging in to get challenge...${NC}"
    LOGIN_RESPONSE=$(curl -s -X POST "$SERVER/classwork8/login" \
        -H "Content-Type: application/json" \
        -d '{"username":"student","password":"pass123"}')
    
    CHALLENGE=$(echo $LOGIN_RESPONSE | grep -o '"challenge":"[^"]*' | cut -d'"' -f4)
    TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    
    echo "Challenge: $CHALLENGE"
    echo "Token: ${TOKEN:0:20}..."
    
    # Step 2: Compute MD5 response
    echo -e "${BLUE}[*] Step 2: Computing MD5 response...${NC}"
    RESPONSE=$(echo -n "$CHALLENGE" | md5sum | awk '{print $1}')
    echo "MD5 Response: $RESPONSE"
    
    # Step 3: Generate payload and signature
    echo -e "${BLUE}[*] Step 3: Generating HMAC signature...${NC}"
    PAYLOAD='{"challenge":"'$CHALLENGE'","response":"'$RESPONSE'"}'
    SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "ctf-secret-key-2025-do-not-share-in-production" | awk '{print $2}')
    echo "Signature: ${SIGNATURE:0:20}..."
    
    # Step 4: Send DELETE request
    echo -e "${BLUE}[*] Step 4: Sending DELETE request...${NC}"
    FINAL_RESPONSE=$(curl -s -X DELETE "$SERVER/classwork8" \
        -H "Content-Type: application/json" \
        -H "X-Custom-Header: secretvalue" \
        -H "Authorization: Bearer $TOKEN" \
        -H "X-Payload-Signature: $SIGNATURE" \
        --cookie "sessionid=ctf-session-5u48p43c2piajum0e2ruu71vs1" \
        -d "$PAYLOAD")
    
    if echo $FINAL_RESPONSE | grep -q "FLAG{"; then
        echo -e "${GREEN}[✓] Challenge 8 PASSED!${NC}"
        echo $FINAL_RESPONSE | jq '.flag, .message'
    else
        echo -e "${RED}[✗] Challenge 8 FAILED!${NC}"
        echo $FINAL_RESPONSE | jq '.'
    fi
    echo ""
}

# Get hints
get_hints() {
    echo -e "${YELLOW}Enter challenge number (1-10):${NC} "
    read challenge_num
    echo -e "${YELLOW}Enter hint level (1-?):${NC} "
    read hint_level
    
    curl -s "$SERVER/hints/$challenge_num?level=$hint_level" | jq '.'
    echo ""
}

# Test all challenges
test_all() {
    echo -e "${BLUE}[*] Running all tests...${NC}\n"
    login
    test_challenge1
    test_challenge2
    test_challenge3
    test_challenge4
    test_challenge5
    echo -e "${YELLOW}[!] Skipping 6, 7 for brevity. Try them individually.${NC}"
    test_challenge8
    echo -e "${GREEN}[✓] Testing complete!${NC}"
}

# Main loop
while true; do
    show_menu
    read -p "Enter your choice: " choice
    echo ""
    
    case $choice in
        1) test_challenge1 ;;
        2) test_challenge2 ;;
        3) test_challenge3 ;;
        4) test_challenge4 ;;
        5) test_challenge5 ;;
        8) test_challenge8 ;;
        L|l) login ;;
        H|h) get_hints ;;
        A|a) test_all ;;
        Q|q) echo "Goodbye!"; exit 0 ;;
        *) echo -e "${RED}Invalid choice!${NC}\n" ;;
    esac
done
*/