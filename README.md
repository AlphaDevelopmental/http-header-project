HTTP Header Challenge Project

💡 Objective:
To understand HTTP methods, headers, cookies, tokens, and their role in securing or unlocking resources. This Node.js/Express app is designed as a progressive learning lab with 7 challenges.
This project is a lab-based Node.js/Express app designed to teach students about HTTP methods, headers, content types, cookies, and tokens.


Each route (/classwork1 to /classwork7) introduces a different level of challenge requiring proper HTTP headers and methods to unlock hidden flags.
1. Clone the repository:
    git clone https://github.com/your-username/http-header-project.git
    cd http-header-project
    npm install
    node server.js
2. App will start on `http://localhost:3000`
3. Use `curl`, `Postman`, `HTTPie`, or browser with dev tools to test each challenge.


| Route         | Challenge                                               | Type                                     |
| ------------- | ------------------------------------------------------- | ---------------------------------------- |
| `/classwork1` | Must use correct HTTP method                            | GET only                                 |
| `/classwork2` | Requires method + Content-Type                          | GET + `application/json`                 |
| `/classwork3` | Requires custom header                                  | `x-custom-auth: letmein`                 |
| `/classwork4` | Requires a cookie                                       | `session=admin`                          |
| `/classwork5` | Requires Bearer token                                   | `Authorization: Bearer supersecrettoken` |
| `/classwork6` | Combines POST, Content-Type, token                      | POST + `x-access-token: chainedpass`     |
| `/classwork7` | Final boss: method, headers, cookie, token, query param | POST + cookie + bearer + query           |

## 🔢 Sample cURL Commands

``
# 1. Classwork 1
curl -X GET http://localhost:3000/classwork1

# 2. Classwork 2
curl -X GET http://localhost:3000/classwork2 \
  -H "Content-Type: application/json"

# 3. Classwork 3
curl -X GET http://localhost:3000/classwork3 \
  -H "x-custom-auth: letmein"

# 4. Classwork 4
curl -X GET http://localhost:3000/classwork4 \
  -H "Cookie: session=admin"

# 5. Classwork 5
curl -X GET http://localhost:3000/classwork5 \
  -H "Authorization: Bearer supersecrettoken"

# 6. Classwork 6
curl -X POST http://localhost:3000/classwork6 \
  -H "Content-Type: application/json" \
  -H "x-access-token: chainedpass"

# 7. Classwork 7
curl -X POST "http://localhost:3000/classwork7?key=unlockme" \
  -H "Cookie: session=admin" \
  -H "Authorization: Bearer supersecrettoken"
curl -X POST http://localhost:3000/classwork6 \
  -H "Content-Type: application/json" \
  -H "x-access-token: chainedpass"
  
 Tools to Use:

    Postman: For visually constructing and debugging HTTP requests.
    
    curl: For terminal-based quick testing.
    
    HTTPie: For human-friendly HTTP CLI testing.
    
    Chrome DevTools: Observe headers via the Network tab.

 Author / License
Alpha Developmental
GitHub: @AlphaDevelopmental

    Created for teaching HTTP fundamentals and request validation
    Use freely, modify for your class or CTF labs

