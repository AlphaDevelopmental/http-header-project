HTTP Header Challenge Project

This project is a lab-based Node.js/Express app designed to teach students about HTTP methods, headers, content types, cookies, and tokens.

Each route (/classwork1 to /classwork7) introduces a different level of challenge requiring proper HTTP headers and methods to unlock hidden flags.

git clone https://github.com/your-username/http-header-project.git
cd http-header-project
npm install
node server.js
| Route         | Challenge                                               | Type                                     |
| ------------- | ------------------------------------------------------- | ---------------------------------------- |
| `/classwork1` | Must use correct HTTP method                            | GET only                                 |
| `/classwork2` | Requires method + Content-Type                          | GET + `application/json`                 |
| `/classwork3` | Requires custom header                                  | `x-custom-auth: letmein`                 |
| `/classwork4` | Requires a cookie                                       | `session=admin`                          |
| `/classwork5` | Requires Bearer token                                   | `Authorization: Bearer supersecrettoken` |
| `/classwork6` | Combines POST, Content-Type, token                      | POST + `x-access-token: chainedpass`     |
| `/classwork7` | Final boss: method, headers, cookie, token, query param | POST + cookie + bearer + query           |

curl -X GET http://localhost:3000/classwork1
curl -X GET http://localhost:3000/classwork2 -H "Content-Type: application/json"
curl -X GET http://localhost:3000/classwork3 -H "x-custom-auth: letmein"
curl -X GET http://localhost:3000/classwork4 -H "Cookie: session=admin"
curl -X GET http://localhost:3000/classwork5 -H "Authorization: Bearer supersecrettoken"

curl -X POST http://localhost:3000/classwork6 \
  -H "Content-Type: application/json" \
  -H "x-access-token: chainedpass"


 Author / License

    Created for teaching HTTP fundamentals and request validation
    Use freely, modify for your class or CTF labs

