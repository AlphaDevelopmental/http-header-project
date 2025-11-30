#!/bin/bash

# HTTP Header CTF Testing Script (Simple Version - No jq required)

SERVER="http://localhost:3000"
TOKEN=""
SESSION_ID=""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  HTTP Header CTF Testing Script       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Menu
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
    echo ""
    echo "L. Login (Get Token)"
    echo "A. Test All (1-4)"
    echo "Q. Quit"
    echo ""
}

# Login
login() {
    echo -e "${BLUE}[*] Logging in...${NC}"
    RESPONSE=$(curl -s -X POST "$SERVER/login" \
        -H "Content-Type: application/json" \
        -d '{"username": "admin", "password": "pass123"}' \
        -c cookies.txt)
    
    echo "$RESPONSE"
    
    TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    
    if [ -f cookies.txt ]; then
        SESSION_ID=$(cat cookies.txt | grep sessionid | awk '{print $7}')
    fi
    
    if [ -z "$TOKEN" ]; then
        echo -e "${RED}[✗] Login failed!${NC}"
    else
        echo -e "${GREEN}[✓] Login successful!${NC}"
        echo "Token: ${TOKEN:0:30}..."
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
    
    echo "$RESPONSE"
    
    if echo $RESPONSE | grep -q "FLAG{"; then
        echo -e "${GREEN}[✓] Challenge 1 PASSED!${NC}"
    else
        echo -e "${RED}[✗] Challenge 1 FAILED!${NC}"
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
    
    echo "$RESPONSE"
    
    if echo $RESPONSE | grep -q "FLAG{"; then
        echo -e "${GREEN}[✓] Challenge 2 PASSED!${NC}"
    else
        echo -e "${RED}[✗] Challenge 2 FAILED!${NC}"
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
    
    echo "$RESPONSE"
    
    if echo $RESPONSE | grep -q "FLAG{"; then
        echo -e "${GREEN}[✓] Challenge 3 PASSED!${NC}"
    else
        echo -e "${RED}[✗] Challenge 3 FAILED!${NC}"
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
    
    echo "$RESPONSE"
    
    if echo $RESPONSE | grep -q "FLAG{"; then
        echo -e "${GREEN}[✓] Challenge 4 PASSED!${NC}"
    else
        echo -e "${RED}[✗] Challenge 4 FAILED!${NC}"
    fi
    echo ""
}

# Challenge 5
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
    
    echo "$RESPONSE"
    
    if echo $RESPONSE | grep -q "FLAG{"; then
        echo -e "${GREEN}[✓] Challenge 5 PUT PASSED!${NC}"
    else
        echo -e "${RED}[✗] Challenge 5 PUT FAILED!${NC}"
    fi
    echo ""
}

# Challenge 8
test_challenge8() {
    echo -e "${BLUE}[*] Testing Challenge 8 (Cryptographic)...${NC}"
    
    echo -e "${BLUE}[*] Step 1: Logging in to get challenge...${NC}"
    LOGIN_RESPONSE=$(curl -s -X POST "$SERVER/classwork8/login" \
        -H "Content-Type: application/json" \
        -d '{"username":"student","password":"pass123"}')
    
    echo "$LOGIN_RESPONSE"
    
    CHALLENGE=$(echo $LOGIN_RESPONSE | grep -o '"challenge":"[^"]*' | cut -d'"' -f4)
    TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    
    echo "Challenge: $CHALLENGE"
    echo "Token: ${TOKEN:0:30}..."
    
    echo -e "${BLUE}[*] Step 2: Computing MD5 response...${NC}"
    RESPONSE=$(echo -n "$CHALLENGE" | md5sum | awk '{print $1}')
    echo "MD5 Response: $RESPONSE"
    
    echo -e "${BLUE}[*] Step 3: Generating HMAC signature...${NC}"
    PAYLOAD='{"challenge":"'$CHALLENGE'","response":"'$RESPONSE'"}'
    SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "ctf-secret-key-2025-do-not-share-in-production" | awk '{print $2}')
    echo "Signature: ${SIGNATURE:0:30}..."
    
    echo -e "${BLUE}[*] Step 4: Sending DELETE request...${NC}"
    FINAL_RESPONSE=$(curl -s -X DELETE "$SERVER/classwork8" \
        -H "Content-Type: application/json" \
        -H "X-Custom-Header: secretvalue" \
        -H "Authorization: Bearer $TOKEN" \
        -H "X-Payload-Signature: $SIGNATURE" \
        --cookie "sessionid=ctf-session-5u48p43c2piajum0e2ruu71vs1" \
        -d "$PAYLOAD")
    
    echo "$FINAL_RESPONSE"
    
    if echo $FINAL_RESPONSE | grep -q "FLAG{"; then
        echo -e "${GREEN}[✓] Challenge 8 PASSED!${NC}"
    else
        echo -e "${RED}[✗] Challenge 8 FAILED!${NC}"
    fi
    echo ""
}

# Test all
test_all() {
    echo -e "${BLUE}[*] Running all basic tests...${NC}\n"
    login
    test_challenge1
    test_challenge2
    test_challenge3
    test_challenge4
    echo -e "${GREEN}[✓] Basic tests complete!${NC}"
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
        A|a) test_all ;;
        Q|q) echo "Goodbye!"; exit 0 ;;
        *) echo -e "${RED}Invalid choice!${NC}\n" ;;
    esac
done