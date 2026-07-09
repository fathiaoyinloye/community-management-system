# Community Management System Architecture

## Architecture Style

The Community Management System follows a **Modular Monolith Architecture** with **Event-Driven Communication** between modules.

The application is deployed as a single Spring Boot application while separating business domains into independent modules.

Each module owns its own:

- Controllers
- Services
- Entities
- Repositories
- DTOs
- Events

Modules communicate through **domain events** rather than directly depending on one another wherever appropriate.

---

# Why Modular Monolith?

This architecture was chosen because:

- Simpler deployment than microservices
- Easier development and debugging
- Single database
- Lower infrastructure cost
- Clear separation of business domains
- Future migration to microservices is easier due to module boundaries

---

# High-Level Architecture

```
React Frontend
       │
       │ HTTP/HTTPS
       ▼
Spring Boot Application
       │
       ├── Authentication Module
       ├── Community Module
       ├── House Module
       ├── Levy Module
       ├── Payment Module
       └── Notification Module
       │
       ▼
 PostgreSQL Database
```

---

# Application Modules

## Authentication Module

Responsibilities

- User Authentication
- JWT Generation
- JWT Validation
- Account Setup
- Password Management

Owns

- User
- Authentication Logic

---

## Community Module

Responsibilities

- Create Community
- Update Community
- Manage Community Information

Owns

- Community

---

## House Module

Responsibilities

- Register House
- Update House
- Search House
- Assign Responsible Resident

Owns

- House

---

## Levy Module

Responsibilities

- Create Levy Types
- Generate House Levies
- Calculate Outstanding Balances

Owns

- LevyType
- HouseLevy

---

## Payment Module

Responsibilities

- Upload Proof of Payment
- Verify Payments
- Record Payments

Owns

- Payment

---

## Notification Module

Responsibilities

- Notify Residents
- Payment Notifications
- Levy Notifications

---

# Event-Driven Communication

Modules communicate through domain events.

Example:

Payment Verified

↓

PaymentVerifiedEvent

↓

Levy Module updates outstanding balance

↓

Notification Module sends resident notification

This approach reduces direct dependencies between modules.

---

# Technology Stack

Backend

- Java 17
- Spring Boot 3.x
- Spring Security
- Spring Data JPA
- PostgreSQL
- JWT Authentication
- Maven

Frontend

- React

Architecture

- Modular Monolith
- Event-Driven Design
- REST API