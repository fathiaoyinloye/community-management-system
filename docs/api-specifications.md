# Community Management System API Specification

**Version:** 1.0 (MVP)

**Base URL**

```
/api/v1
```

---

# Authentication

## Login

| Method | Endpoint |
|---------|----------|
| POST | /auth/login |

Description

Authenticate a user and return a JWT.

Authentication

None

Request

```json
{
  "email": "admin@example.com",
  "password": "Password123"
}
```

Response

```json
{
  "accessToken": "jwt-token",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "role": "COMMUNITY_ADMIN"
}
```

Status Codes

- 200 OK
- 400 Bad Request
- 401 Unauthorized

---

## Complete Account Setup

| Method | Endpoint |
|---------|----------|
| POST | /auth/complete-account-setup |

Authentication

None (Invitation Token)

Request

```json
{
  "token": "invitation-token",
  "password": "Password123"
}
```

Response

```json
{
  "message": "Account setup completed successfully."
}
```

---

## Logout

| Method | Endpoint |
|---------|----------|
| POST | /auth/logout |

Authentication

Bearer Token

---

# Community

## Create Community

POST

```
/communities
```

Authentication

Platform Administrator

Request

```json
{
  "name": "Green Estate",
  "type": "Residential Estate",
  "address": "Lekki",
  "lga": "Eti-Osa",
  "state": "Lagos",
  "phone": "08012345678",
  "email": "admin@greenestate.com"
}
```

Response

```json
{
  "id": "UUID",
  "message": "Community created successfully."
}
```

---

## Get Communities

GET

```
/communities
```

---

## Get Community

GET

```
/communities/{id}
```

---

## Update Community

PUT

```
/communities/{id}
```

---

# Community Staff

## Invite Staff

POST

```
/communities/{communityId}/staff
```

---

## Get Staff

GET

```
/communities/{communityId}/staff
```

---

## Update Staff Role

PUT

```
/communities/{communityId}/staff/{staffId}
```

---

# Houses

## Register House

POST

```
/houses
```

Request

```json
{
  "communityId":"UUID",
  "houseNumber":"A12",
  "street":"Main Street",
  "resident":{
      "firstName":"John",
      "lastName":"Doe",
      "email":"john@email.com",
      "phone":"08012345678"
  }
}
```

---

## Get Houses

GET

```
/houses
```

---

## Search House

GET

```
/houses/search?keyword=A12
```

---

## Get House

GET

```
/houses/{id}
```

---

## Update House

PUT

```
/houses/{id}
```

---

# Levy Types

## Create Levy Type

POST

```
/levy-types
```

Request

```json
{
  "name":"Security Levy",
  "amount":5000,
  "frequency":"MONTHLY"
}
```

---

## Get Levy Types

GET

```
/levy-types
```

---

## Update Levy Type

PUT

```
/levy-types/{id}
```

---

## Generate House Levies

POST

```
/levies/generate
```

Description

Generate levies for all active houses within a community.

---

## Get House Levies

GET

```
/levies
```

---

## Get House Levy

GET

```
/levies/{id}
```

---

# Payments

## Upload Payment Proof

POST

```
/payments
```

Request

```json
{
    "houseLevyId":"UUID",
    "amount":5000,
    "paymentReference":"ABC123XYZ",
    "proofOfPaymentUrl":"https://..."
}
```

---

## Get Payments

GET

```
/payments
```

---

## Verify Payment

PUT

```
/payments/{paymentId}/verify
```

---

## Reject Payment

PUT

```
/payments/{paymentId}/reject
```

---

# Resident Portal

## View Dashboard

GET

```
/resident/dashboard
```

Returns

- Outstanding Balance
- Recent Payments
- Active Levies

---

## View Outstanding Levies

GET

```
/resident/levies
```

---

## View Payment History

GET

```
/resident/payments
```

---

## Download Receipt

GET

```
/resident/payments/{paymentId}/receipt
```

---

# Notifications

## Get Notifications

GET

```
/notifications
```

---

## Mark Notification As Read

PUT

```
/notifications/{id}/read
```

---

# Standard Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Resource Created |
| 204 | No Content |
| 400 | Validation Error |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Resource Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |