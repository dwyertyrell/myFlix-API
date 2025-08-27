# Authentication

myFlix API uses JWT (JSON Web Tokens) for authentication. Most endpoints require a valid token in the `Authorization` header.

## How to Authenticate

1. **Login**
   - Send a POST request to `/login` with your username and password.
   - On success, you will receive a JWT token.

2. **Using the Token**
   - Include the token in the `Authorization` header for all protected endpoints:
     ```http
     Authorization: Bearer <your_token>
     ```

## Example

```http
POST /login
Content-Type: application/json

{
  "username": "yourUsername",
  "password": "yourPassword"
}
```

**Response:**
```json
{
  "user": { ... },
  "token": "<jwt_token>"
}
```

## Token Expiry
Tokens are valid for 7 days. You must re-authenticate after expiry.

## Securing Endpoints
All user and movie endpoints require authentication except for registration and login.

For more details, see [api-endpoints.md](api-endpoints.md).
