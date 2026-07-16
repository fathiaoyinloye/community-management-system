# API Tests — Community Management System

Two formats are provided:

| File | Best For |
|------|----------|
| `api.http` | VS Code REST Client / IntelliJ — click-to-run, interactive |
| `api-runner.js` | Terminal — automated, sequential, colour-coded summary |

---

## Quick Start

### Option 1 — VS Code REST Client

1. Install the **REST Client** extension (`humao.rest-client`)
2. Open `tests/api.http`
3. Click **Send Request** above any `###` block
4. Tokens and IDs are captured automatically via `@name` annotations

### Option 2 — Node.js runner (automated)

Requires Node ≥ 18 (uses built-in `fetch`).

```bash
# Default target: http://localhost:8080/api/v1
node tests/api-runner.js

# Custom backend host
BASE_URL=http://192.168.1.10:8080/api/v1 node tests/api-runner.js

# Custom credentials
PLATFORM_ADMIN_EMAIL=me@example.com \
PLATFORM_ADMIN_PASSWORD=secret \
node tests/api-runner.js
```

Or via npm (from repo root):

```bash
npm run test:api
```

---

## Environment Variables

| Variable | Default |
|----------|---------|
| `BASE_URL` | `http://localhost:8080/api/v1` |
| `PLATFORM_ADMIN_EMAIL` | `platform@communitytrust.com` |
| `PLATFORM_ADMIN_PASSWORD` | `Password123` |
| `COMMUNITY_ADMIN_EMAIL` | `admin@greenestate.com` |
| `COMMUNITY_ADMIN_PASSWORD` | `Password123` |
| `RESIDENT_EMAIL` | `john@email.com` |
| `RESIDENT_PASSWORD` | `Password123` |

---

## Test Coverage

| Module | Tests |
|--------|-------|
| Authentication | Login (3 roles), invalid creds, missing fields, logout |
| Community | Create, get all, get by ID, 404, update, 401, 400 |
| Community Staff | Invite, duplicate (409), get all, update role |
| Houses | Register, duplicate (409), missing fields (400), get all, search, get by ID, 404, update |
| Levy Types | Create, create second, missing fields (400), get all, update, 404 |
| Levies | Generate, get all, get by ID, 404 |
| Payments | Upload proof, missing fields (400), get all, verify, double-verify (409), reject, 401, 404 |
| Resident Portal | Dashboard, 401, outstanding levies, payment history, receipt, 404 |
| Notifications | Get all, mark as read |

**Total: ~38 test cases**
