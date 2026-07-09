# Community Management System

A web-based Community Management System that helps residential communities digitize the management of houses, levies, payments, and resident accounts.

The system replaces manual record keeping with a centralized platform that enables community executives to manage financial operations while giving residents access to their levy information and payment history.

---

## Project Goals

- Digitize community administration
- Improve levy and payment tracking
- Eliminate paper-based records
- Generate digital receipts
- Improve transparency
- Provide a resident self-service portal

---

## Core Features

### Authentication & Authorization

- JWT Authentication
- Role-based Authorization
- Secure Login
- Account Setup

### Community Management

- Create Community
- Update Community Information
- Invite Community Staff
- Assign Community Administrator

### House Management

- Register House
- Assign Responsible Resident
- Search House
- Update House Information

### Levy Management

- Create Levy Types
- Automatically Generate House Levies

### Payment Management

- Upload Proof of Payment
- Verify Payments
- Record Payments
- Automatically Update Outstanding Balance

### Resident Portal

Residents can:

- View Outstanding Balance
- View Payment History
- Download Receipts
- View Notifications

---

## Tech Stack

### Backend

- Java 17
- Spring Boot 3.x
- Spring Security
- JWT Authentication
- Spring Data JPA
- PostgreSQL
- Maven

### Architecture

- Modular Monolith
- Event-Driven Communication
- REST API

### Frontend

Built separately using the backend REST APIs.

---

## Project Structure

```text
community-management-system
│
├── backend
│
├── frontend
│
├── docs
│   ├── PRD.md
│   ├── diagrams
│   │   ├── use-case-diagram.puml
│   │   ├── class-diagram.puml
│   │   └── erd.puml
│   └── architecture.md
│
└── README.md
```

---

## User Roles

- Platform Administrator
- Community Administrator
- Community Staff
- Resident

---

## Architecture

The backend follows a Modular Monolith architecture where each module owns its own domain, services, repositories, controllers, and events.

Planned modules include:

- Authentication
- Community
- House
- Levy
- Payment
- Notification

---

## Documentation

The project documentation includes:

- Product Requirements Document (PRD)
- Use Case Diagram
- Class Diagram
- Entity Relationship Diagram (ERD)
- Architecture Diagram

---

## Current Status

- Product Requirements Complete
- Use Case Diagram Complete
- Class Diagram Complete
- ERD In Progress
- Backend Development Pending

---

## Authors

Backend Developer

- Your Name

Frontend Developer

- Partner