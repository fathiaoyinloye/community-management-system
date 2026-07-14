# Community Management System API Specification

**Version:** 1.0 (MVP — Phases 1–6)
**Base URL:** `http://localhost:8080/api/v1` (dev)

---

## ⚠️ Authentication — read this first

This API does **NOT** use a Bearer token in headers. Auth is via an **HttpOnly cookie** named `jwt`, set automatically on login.

**What this means for the frontend:**
- Do not store any token in localStorage/sessionStorage — there isn't one to store. The browser handles it.
- Every request to a protected endpoint must include credentials:
  - fetch: `fetch(url, { credentials: 'include', ... })`
  - axios: `axios.defaults.withCredentials = true;` (or per-request `{ withCredentials: true }`)
- No manual `Authorization` header needed anywhere.
- In dev, the cookie is not `Secure` (works over plain `http://localhost`). In production it will be `Secure` + `SameSite=Strict` (HTTPS only).

---

## Standard Error Shape

Every error (validation, auth, not-found, conflict, server error) returns this shape:

```json
{
  "status": 401,
  "message": "Authentication required",
  "timestamp": "2026-07-14T07:25:59.013"
}
```

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Resource Created |
| 204 | No Content |
| 400 | Validation error / malformed request |
| 401 | Not authenticated (missing/invalid/expired cookie) |
| 403 | Authenticated but not permitted (wrong role) |
| 404 | Resource not found |
| 409 | Conflict (duplicate, already-processed, business rule) |
| 500 | Unexpected server error |

---

# Auth

## Login
`POST /auth/login` — Auth: none

Request:
```json
{ "username": "admin", "password": "Password123" }
```

Response `200`:
```json
{
  "id": "UUID",
  "username": "admin",
  "firstName": "Platform",
  "lastName": "Admin",
  "role": "PLATFORM_ADMIN"
}
```
Also sets the `jwt` HttpOnly cookie. No token appears in the JSON body — intentional. Login is by **username**, not email.

## Complete Account Setup (Activation)
`POST /auth/activate` — Auth: none (uses one-time token from invite)

Request:
```json
{
  "token": "activation-token-from-invite",
  "password": "Password123",
  "confirmPassword": "Password123"
}
```

Response `200`:
```json
{ "username": "bola.adeyemi", "message": "Account activated successfully. You may now log in." }
```
Same endpoint/shape for Community Admin, Community Staff, and Resident — no separate flows.

## Logout
`POST /auth/logout` — Auth: cookie
Response `204 No Content`. Clears the `jwt` cookie.

---

# Community

## Create Community
`POST /communities` — Auth: **PLATFORM_ADMIN** only

Request:
```json
{
  "name": "Green Estate",
  "type": "Residential Estate",
  "address": "12 Palm Street, Lekki",
  "lga": "Eti-Osa",
  "state": "Lagos",
  "phone": "08011112222",
  "email": "info@greenestate.com",
  "description": "optional"
}
```

Response `201`:
```json
{
  "id": "UUID",
  "name": "Green Estate",
  "type": "Residential Estate",
  "address": "12 Palm Street, Lekki",
  "lga": "Eti-Osa",
  "state": "Lagos",
  "phone": "08011112222",
  "email": "info@greenestate.com",
  "description": "optional",
  "createdAt": "2026-07-14T07:25:59.013"
}
```

## Assign Community Administrator
`POST /communities/{communityId}/assign-admin` — Auth: **PLATFORM_ADMIN** only

Request:
```json
{
  "firstName": "Bola",
  "lastName": "Adeyemi",
  "phone": "08033334444",
  "email": "bola@example.com"
}
```
`phone` mandatory, `email` optional.

Response `201`:
```json
{
  "userId": "UUID",
  "email": "bola@example.com",
  "username": "bola.adeyemi",
  "role": "COMMUNITY_ADMIN",
  "activationLink": "http://localhost:5173/activate-account?token=...",
  "expiresAt": "2026-07-15T07:25:59.013"
}
```
⚠️ Email sending is **mocked** — the link is logged to the backend console, not actually emailed yet.

## Invite Community Staff
`POST /communities/staff/invite` — Auth: **COMMUNITY_ADMIN** only

Request:
```json
{
  "firstName": "Tunde",
  "lastName": "Bello",
  "phone": "08012345678",
  "email": "tunde@example.com"
}
```
No `communityId` in the body — derived from the logged-in admin's own community.

Response `201`: same shape as Assign Community Administrator above.

---

# Houses

## Register House
`POST /houses` — Auth: **COMMUNITY_STAFF** only

Request:
```json
{ "houseNumber": "Block A, House 12", "street": "Palm Street" }
```
No `communityId` needed — derived from the logged-in staff member's community.

Response `201`:
```json
{
  "id": "UUID",
  "communityId": "UUID",
  "residentId": null,
  "houseNumber": "Block A, House 12",
  "street": "Palm Street",
  "createdAt": "2026-07-14T07:25:59.013"
}
```

## Assign Responsible Resident
`POST /houses/{houseId}/assign-resident` — Auth: **COMMUNITY_STAFF** only

Request:
```json
{
  "firstName": "Chidi",
  "lastName": "Nwosu",
  "phone": "08055556666",
  "email": "chidi@example.com"
}
```

Response `201`: same shape as invite/assign-admin (activation link + username). Returns `409` if the house already has a resident.

---

# Levies

## Create Levy
`POST /levies` — Auth: **COMMUNITY_STAFF** only

Request:
```json
{ "name": "Security Levy", "amount": 15000, "frequency": "MONTHLY" }
```
`frequency`: `ONE_TIME` | `MONTHLY` | `QUARTERLY` | `ANNUALLY`

Response `201`:
```json
{ "id": "UUID", "name": "Security Levy", "amount": 15000, "frequency": "MONTHLY", "housesBilled": 4 }
```
Creating a levy **automatically bills every house currently registered** in that community — no separate "generate" step.

## View My Outstanding Balance
`GET /levies/my-balance` — Auth: **RESIDENT** only

Response `200`:
```json
[
  {
    "id": "UUID",
    "levyName": "Security Levy",
    "amount": 15000,
    "balance": 15000,
    "dueDate": "2026-08-13",
    "status": "PENDING"
  }
]
```
`status`: `PENDING` | `PARTIALLY_PAID` | `PAID` | `OVERDUE`

---

# Payments

## Upload Proof of Payment
`POST /payments` — Auth: **RESIDENT** only

Request:
```json
{
  "houseLevyId": "UUID",
  "amount": 15000,
  "paymentReference": "TXN-882910",
  "proofOfPaymentUrl": "https://example.com/proof.jpg"
}
```

Response `201`:
```json
{
  "id": "UUID",
  "houseLevyId": "UUID",
  "amount": 15000,
  "paymentReference": "TXN-882910",
  "status": "PENDING_REVIEW",
  "remarks": null,
  "paymentDate": "2026-07-14T07:25:59.013",
  "verifiedDate": null
}
```

## Verify Payment
`POST /payments/{paymentId}/verify` — Auth: **COMMUNITY_STAFF** only

No request body. Response `200` — returns the generated receipt directly:
```json
{
  "id": "UUID",
  "receiptNumber": "RCT-1752480000000",
  "communityName": "Green Estate",
  "houseNumber": "Block A, House 12",
  "residentName": "Chidi Nwosu",
  "levyName": "Security Levy",
  "amount": 15000,
  "datePaid": "2026-07-14T07:25:59.013"
}
```
Also updates the house levy's balance/status and logs a mock notification to the resident. Returns `409` if already processed.

## Reject Payment
`POST /payments/{paymentId}/reject` — Auth: **COMMUNITY_STAFF** only

Request:
```json
{ "remarks": "Proof of payment image is unreadable" }
```

Response `200`: same shape as payment upload, with `status: "REJECTED"` and `remarks` populated.

## Download Receipt
`GET /payments/{paymentId}/receipt` — Auth: **RESIDENT** or **COMMUNITY_STAFF**

Response `200`: same shape as the receipt from Verify Payment.

Note: returns receipt **data as JSON**, not a rendered PDF — PDF generation is post-MVP.

---

# Not Yet Implemented (don't wire the frontend to these yet)

- `GET /communities`, `GET /communities/{id}`, `PUT /communities/{id}`
- `GET /communities/{communityId}/staff`, `PUT .../staff/{staffId}`
- `GET /houses`, `GET /houses/search`, `GET /houses/{id}`, `PUT /houses/{id}`
- `GET /levy-types`, `PUT /levy-types/{id}`
- `GET /payments` (list all)
- `/resident/dashboard`, `/resident/levies`, `/resident/payments`
- `/notifications`, `/notifications/{id}/read` — notifications are logged to the console only, not persisted

Flag it if the frontend needs any of these for the demo — some are quick additions.