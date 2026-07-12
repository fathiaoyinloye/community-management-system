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

The Platform Administrator manages the Community Management System platform. This role is responsible for onboarding communities and assigning Community Administrators. The Platform Administrator does not participate in the day-to-day operations of any community.

Responsibilities

- Create Community
- View Communities
- View Community Details
- Update Community Information (when necessary)
- Assign Community Administrator


## Community Administrator

The Community Administrator is responsible for managing a specific community. This role oversees community operations by managing staff accounts and maintaining community information but does not perform daily operational tasks such as registering houses or verifying payments.

Responsibilities

- View Community Information
- Update Community Information
- Invite Community Staff
- View Community Staff
- Update Community Staff Role
- Remove Community Staff


## Community Staff

Community Staff perform the day-to-day operational activities within a community. They manage houses, create levies, verify payments, and maintain resident financial records.

Responsibilities

### House Management

- Register House
- Update House Information
- Search House
- View House Details

### Levy Management

- Create Levy

Creating a levy automatically generates the levy for every active house within the community.

### Payment Management

- Verify Payment
- Reject Payment

Residents submit proof of payment, and Community Staff review and verify or reject the submission.

### Financial Records

- View Payment Report
- View Outstanding Levies
- View House Account

The House Account provides:

- Responsible Resident
- Current Outstanding Balance
- Levy History
- Payment History


## Resident

A Resident represents the person responsible for a registered house. Each house has only one responsible resident.

Residents cannot modify community records or financial data. They can only access information relating to their own house.

Responsibilities

### Account Management

- Complete Account Setup
- Login
- Change Password

### Financial Activities

- View Outstanding Balance
- View Levy History
- View Payment History
- Upload Proof of Payment
- Download Receipt


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

Levy Management

- Create Levy
- View Levies
- View Outstanding Levies

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







