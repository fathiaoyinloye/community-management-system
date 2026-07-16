# Product Requirements Document (PRD)

# Community Management System (Working Title)

**Version:** 1.0  
**Status:** Draft  
**Author:** Fathia Oyinloye  
**Date:** July 2026

---

# Table of Contents

1. Executive Summary
2. Problem Statement
3. Product Goal
4. Objectives
5. Target Users
6. User Roles
7. MVP Scope
8. Functional Requirements
9. Business Rules
10. Non-Functional Requirements
11. Assumptions
12. Out of Scope
13. Future Scope

---

# 1. Executive Summary

The Community Management System is a web-based platform designed to help residential communities digitize the management of levies, payments, resident accounts, receipts, and notifications.

Many communities currently rely on notebooks, spreadsheets, WhatsApp groups, and paper receipts to manage financial records. These manual processes make it difficult to track payments, monitor outstanding balances, generate reports, and communicate efficiently with residents.

The system provides a centralized platform where community executives can manage houses, create levies, record payments, generate digital receipts, and communicate with residents. Residents are provided with a secure portal where they can view their bills, payment history, receipts, and notifications.

---

# 2. Problem Statement

Many residential communities still rely on manual processes for managing community levies and financial records.

These manual processes result in:

- Poor record keeping
- Difficulty tracking outstanding payments
- Lost or damaged receipts
- Delayed payment reminders
- Limited transparency for residents
- Time-consuming report generation
- Administrative inefficiencies

A centralized digital platform is required to simplify community administration while improving transparency and communication.

---

# 3. Product Goal

To provide communities with a centralized platform for managing houses, levies, payments, receipts, and resident communication while reducing administrative workload and improving financial transparency.

---

# 4. Objectives

The system aims to:

- Digitize community levy management.
- Eliminate paper-based records.
- Improve payment tracking.
- Automatically generate digital receipts.
- Improve communication between community executives and residents.
- Provide residents with self-service access to their accounts.
- Improve transparency in community financial management.

---

# 5. Target Users

The platform is designed for:

- Community Development Associations (CDAs)
- Residents Associations (RAs)
- Estate Management Committees
- Gated Communities
- Residential Estates

---

# 6. User Roles

## Platform Administrator

Responsible for managing the entire platform.

### Responsibilities

- Register communities
- Manage communities
- Create Community Administrator accounts
- Activate or deactivate communities
- Provide technical support

---

## Community Administrator

Responsible for managing a specific community.

This role may be assigned to the Chairman, Estate Manager, or any executive designated by the community.

### Responsibilities

- Manage community information
- Create community staff accounts
- Assign staff roles
- Manage levies
- View reports
- Monitor community activities

---

## Community Staff

Community staff are appointed by the Community Administrator.

Examples include:

- Secretary
- Treasurer
- Financial Secretary
- Estate Manager
- Committee Members

Depending on permissions, Community Staff can:

- Register houses
- Update house information
- Upload outstanding balances
- Record payments
- Generate receipts
- Send notifications
- View reports

---

## Resident

Represents the person responsible for a registered house.

Residents can:

- Activate account
- Login securely
- View outstanding balances
- View payment history
- Download receipts
- Receive notifications

Residents cannot modify community records.

---

# 7. MVP Scope

## Community Management

- Register Community
- Manage Community Information
- Create Community Staff

---

## House Management

- Register House
- Edit House
- Search House
- View House Details
- Archive House

Each house has a single account managed by one responsible resident.

---

## Levy Management

- Create Levy Types
- Edit Levy Types
- Assign Levies
- Upload Existing Outstanding Balances

---

## Billing

- Generate Bills
- View Outstanding Bills
- Update Bill Status

---

## Payment Management

- Record Payments
- Update Payment Status
- Automatically Update Outstanding Balance

---

## Receipt Management

- Automatically Generate Receipts
- Download Receipts
- Reprint Receipts

---

## Notification Management

- Notify residents when new levies are created
- Send payment reminders
- Notify residents of overdue payments
- Notify residents when payments are recorded
- Notify residents when receipts are generated

---

## Resident Portal

Residents can:

- Login
- View Dashboard
- View Outstanding Bills
- View Payment History
- Download Receipts
- View Notifications

---

## Reports

Community executives can view:

- Total Amount Collected
- Outstanding Balances
- Payment History
- House Summary
- Levy Summary

---

# 8. Functional Requirements

## Module 1 — Community Management

### FR-CM-001 Register Community

The Platform Administrator shall be able to create a new community.

Required Information:

- Community Name
- Community Type
- Address
- Local Government Area
- State
- Primary Contact Name
- Primary Contact Phone Number
- Primary Contact Email (Optional)

---

### FR-CM-002 Update Community

The Community Administrator shall be able to update community information.

Editable Information:

- Community Name
- Address
- Phone Number
- Email
- Logo
- Description

---

### FR-CM-003 Invite Community Staff

The Community Administrator shall be able to invite community staff.

Required Information:

- Full Name
- Email
- Phone Number
- Assigned Role

---

### FR-CM-004 Assign Roles

The Community Administrator shall assign permissions to staff members.

Examples:

- Treasurer
- Secretary
- Financial Secretary
- Estate Manager

---

### FR-CM-005 View Dashboard

The Community Administrator shall view community statistics including:

- Total Houses
- Outstanding Balance
- Total Amount Collected
- Recent Payments
- Recent Notifications

---

## Module 2 — House Management

### FR-HM-001 Register House

Community Staff shall register a house.

Required Information:

- House Number
- Street
- Responsible Person
- Phone Number
- Email (Optional)
- Outstanding Balance (Optional)
- Status

---

### FR-HM-002 Update House

Community Staff shall update house information.

---

### FR-HM-003 Search House

Community Staff shall search for a house using:

- House Number
- Responsible Person
- Phone Number

---

### FR-HM-004 Archive House

Community Staff shall archive inactive houses.

---

## Module 3 — Levy Management

### FR-LM-001 Create Levy

Community Administrator shall create levy types.

Examples:

- Security Levy
- Environmental Levy
- Development Levy

Each levy contains:

- Name
- Description
- Amount
- Due Date
- Frequency

---

### FR-LM-002 Assign Levy

Assign levy to one or multiple houses.

---

### FR-LM-003 Edit Levy

Update levy information.

---

## Module 4 — Billing

### FR-BM-001 Generate Bills

Bills shall automatically be generated when a levy is assigned.

Each bill contains:

- House
- Levy
- Amount
- Due Date
- Outstanding Balance
- Status

---

### FR-BM-002 Update Bill

Update bill status.

---

## Module 5 — Payments

### FR-PM-001 Record Payment

Community Staff shall record payments.

Required Information:

- House
- Levy
- Amount
- Payment Method
- Date Paid
- Reference Number

---

### FR-PM-002 Update Balance

System automatically updates outstanding balance after payment.

---

## Module 6 — Receipt Management

### FR-RM-001 Generate Receipt

The system shall automatically generate a receipt after payment.

Receipt contains:

- Receipt Number
- Community Name
- House Number
- Responsible Person
- Levy
- Amount
- Date Paid

---

### FR-RM-002 Download Receipt

Residents and Community Staff can download receipts.

---

## Module 7 — Notification Management

The system shall notify residents when:

- A new levy is created.
- Payment is due.
- Payment is overdue.
- Payment is recorded.
- Receipt is generated.

---

## Module 8 — Resident Portal

Residents shall be able to:

- Activate Account
- Login
- View Dashboard
- View Outstanding Bills
- View Payment History
- Download Receipts
- View Notifications

---

## Module 9 — Reports

Community executives shall generate reports including:

- Collection Report
- Outstanding Balance Report
- Payment Report
- Levy Report
- House Report

---

# 9. Business Rules

- Only Platform Administrators can register communities.
- Every community must have one Community Administrator.
- Every house shall have only one account.
- Every house shall have one responsible resident.
- Every payment must generate a receipt.
- Outstanding balances shall automatically reduce after payment.
- Residents cannot edit community records.
- Community Staff permissions depend on assigned roles.

---

# 10. Non-Functional Requirements

### Performance

- Dashboard should load within 3 seconds.
- Search results should be returned within 2 seconds.

### Security

- Authentication required for all users.
- Passwords must be encrypted.
- Role-based authorization.
- Audit logs for administrative activities.

### Availability

- System should be available 99% of the time.

### Usability

- Mobile-friendly interface.
- Simple navigation.
- Easy-to-understand dashboards.

---

# 11. Assumptions

- Every community has one designated Community Administrator.
- Every house has one responsible resident.
- Community executives maintain accurate records.
- Internet access is available during system use.

---

# 12. Out of Scope (Version 1)

The following features are excluded from the MVP:

- Visitor Management
- Complaint Management
- Facility Booking
- Maintenance Requests
- Housing Search
- Rental Listings
- Community Marketplace
- Service Provider Directory
- Housing Analytics

---

# 13. Future Scope

Potential future enhancements include:

- Visitor Management
- Complaint Management
- Maintenance Requests
- Community Announcements
- Housing Registry
- Vacant House Tracking
- Rental Transparency
- Community Analytics
- Housing Search
- Digital Community Directory
Community Management Platform (Frontend) — Product Requirements Document (PRD)

Version: 1.0
Product: Community Management Platform (Frontend)
Project Type: MVP
Target Demo: Tomorrow
Audience: Frontend Developer (React + TypeScript)

1. Overview

The Community Management Platform is a web application designed to help residential communities digitize their daily operations.

For the MVP, the focus is on allowing community administrators to:

Manage communities
Register houses
Create custom levy types
Generate monthly levies
Verify resident payments
Allow residents to view and pay their levies

The frontend should be built using mock data first, with the ability to switch seamlessly to backend APIs as they become available.

2. Goal

Deliver a working frontend that demonstrates the complete user journey during the MVP demo.

The backend will be integrated incrementally.

3. User Roles
Community Admin

Responsible for managing the community.

Capabilities:

Manage community profile
Register houses
Create levy types
Generate monthly levies
Community Staff

Responsible for payment verification.

Capabilities:

View submitted payments
Verify payment
Reject payment
Resident

Responsible for paying levies.

Capabilities:

Login
View dashboard
View outstanding levies
Upload payment proof
View payment history
Download receipts
4. Functional Requirements
Module 1 — Authentication
Screens
Login

Features

Email
Password
Login button
Validation messages
Loading state

API

POST /api/v1/auth/login
Complete Account Setup

Features

New Password
Confirm Password
Submit

API

POST /api/v1/auth/complete-account-setup
Authentication Requirements
Store JWT securely
Store authenticated user
Redirect based on role
Logout
Protected routes
Module 2 — Community Management
Screen
Create Community

Fields

Community Name
State
LGA
Address
Description

API

POST /api/v1/communities
Community Details

Display

Community Name
Address
State
LGA
Description

API

GET /api/v1/communities/{id}
Edit Community

Same fields as Create

API

PUT /api/v1/communities/{id}
Module 3 — House Management
Register House

Fields

House Number
Street
Property Type
Occupancy Status
Owner Name
Resident Name

API

POST /api/v1/houses
House List

Display

House Number
Street
Resident
Occupancy
Actions

API

GET /api/v1/houses
Search House

Search by

House Number
Resident Name

API

GET /api/v1/houses/search
House Details

Display

Complete house information

API

GET /api/v1/houses/{id}
Edit House

API

PUT /api/v1/houses/{id}
Module 4 — Levy Management
Create Levy Type

Fields

Levy Name
Amount
Frequency
Description

API

POST /api/v1/levy-types
Levy Type List

Display

Levy Name
Amount
Frequency

API

GET /api/v1/levy-types
Generate Monthly Levies

Fields

Levy Type
Month
Year

API

POST /api/v1/levies/generate
Generated Levies

Display

Resident
House
Levy Type
Amount
Status

API

GET /api/v1/levies
Module 5 — Payment Management
Resident Upload Payment

Fields

Levy
Payment Amount
Payment Proof (Image/PDF)

API

POST /api/v1/payments
Pending Payments

Display

Resident
House
Amount
Payment Proof
Status

API

GET /api/v1/payments
Verify Payment

API

PUT /api/v1/payments/{id}/verify
Reject Payment

API

PUT /api/v1/payments/{id}/reject
Module 6 — Resident Portal
Dashboard

Cards

Outstanding Levies
Total Paid
Pending Payments
Notifications

API

GET /api/v1/resident/dashboard
Outstanding Levies

Display

Levy Name
Amount
Due Date
Status

API

GET /api/v1/resident/levies
Payment History

Display

Date
Amount
Status

API

GET /api/v1/resident/payments
Download Receipt

API

GET /api/v1/resident/payments/{paymentId}/receipt
Notifications

Display

Title
Message
Date

API

GET /api/v1/notifications
5. Navigation
Community Admin
Dashboard

Community
 ├── View
 └── Edit

Houses
 ├── Register
 ├── List
 └── Search

Levies
 ├── Levy Types
 ├── Generate Levies
 └── Generated Levies

Payments
Community Staff
Dashboard

Payments
 ├── Pending
 ├── Verify
 └── Reject
Resident
Dashboard

Outstanding Levies

Payment History

Notifications

Profile
6. UI Components

Reusable components should include:

Button
Input
Select
Modal
Data Table
Pagination
Card
Badge
Alert
Empty State
Loading Spinner
Toast Notifications
Confirmation Dialog
7. Validation

Forms should validate:

Required fields
Email format
Password confirmation
Numeric amounts
File type (payment proof)
File size
8. Error Handling

Handle:

Network errors
Unauthorized requests
Validation errors
Empty states
Loading states
API failures
9. Mock Data Strategy

Until backend APIs are available:

Use static JSON or Mock Service Worker (MSW).
Match the expected API response shape.
Replace mock services with live API calls as each endpoint becomes available.
Keep service interfaces unchanged to minimize integration work.
10. API Integration Order
Priority	Module	Status
1	Authentication	🔄 First Integration
2	Community Management	Pending
3	House Management	Pending
4	Levy Management	Pending
5	Payment Management	Pending
6	Resident Portal	Pending
11. Suggested Frontend Folder Structure
src/
│
├── api/
│   ├── auth.ts
│   ├── community.ts
│   ├── house.ts
│   ├── levy.ts
│   ├── payment.ts
│   └── resident.ts
│
├── components/
│
├── layouts/
│
├── pages/
│   ├── auth/
│   ├── community/
│   ├── houses/
│   ├── levies/
│   ├── payments/
│   └── resident/
│
├── hooks/
│
├── services/
│
├── store/
│
├── types/
│
├── mocks/
│
├── routes/
│
└── utils/
12. MVP Success Criteria

The demo will be considered successful if the frontend demonstrates the following end-to-end flow:

User logs in and is redirected based on their role.
A Community Admin can create or update community information.
A Community Admin can register and manage houses.
A Community Admin can create levy types and generate monthly levies.
A Resident can view outstanding levies and submit a payment proof.
Community Staff can review submitted payments and verify or reject them.
A Resident can view payment history, download receipts, and receive notifications.

The application should function seamlessly with mock data initially and allow each module to transition to live backend APIs without requiring UI changes as integration progresses.






