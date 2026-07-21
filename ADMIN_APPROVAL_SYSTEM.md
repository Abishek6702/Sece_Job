# Employer Admin Approval System - Implementation Guide

## Overview
This system ensures that only approved employers can login to the platform. After registration, employers must receive admin approval before they can access their account.

---

## Changes Made

### 1. **Backend - Database Model Updates**
**File:** `Job_Server/models/User.js`
- Added `isApproved` field (Boolean, default: true for non-employers, false for employers)
- Added `approvalRejectionReason` field to store rejection reasons

### 2. **Backend - Registration Logic**
**File:** `Job_Server/controllers/authController.js`
- Modified `registerUser()` function to set `isApproved: false` for employer registrations
- Employers remain in "pending" status until admin approval

### 3. **Backend - Login Logic**
**File:** `Job_Server/controllers/authController.js`
- Updated `login()` function to check employer approval status
- Returns status `403` with `PENDING_APPROVAL` flag if employer not approved
- Returns rejection reason if account was rejected

### 4. **Backend - Admin Approval Endpoints**
**File:** `Job_Server/controllers/authController.js`

New endpoints added:
- `GET /api/auth/admin/pending-employers` - Get all pending employer approvals
- `GET /api/auth/admin/approved-employers` - Get all approved employers
- `POST /api/auth/admin/approve-employer` - Approve an employer (sends email)
- `POST /api/auth/admin/reject-employer` - Reject an employer (sends email with reason)

### 5. **Backend - Admin Middleware**
**File:** `Job_Server/middlewares/authMiddleware.js`
- Added `verifyAdmin()` middleware to protect admin endpoints
- Ensures only admin users can approve/reject employers

### 6. **Backend - Routes Update**
**File:** `Job_Server/routes/authRoutes.js`
- Added admin approval routes with `verifyToken` and `verifyAdmin` middleware protection

### 7. **Backend - Email Templates**
**Files:** 
- `Job_Server/emails/templates/employer-approval.handlebars` - Approval notification email
- `Job_Server/emails/templates/employer-rejection.handlebars` - Rejection notification email

### 8. **Frontend - Login Component Update**
**File:** `Job_Client/src/components/LoginForm.jsx`
- Updated `handleLogin()` to check for `PENDING_APPROVAL` status
- Shows user-friendly message when approval is pending
- Displays toast notification for pending approval

### 9. **Frontend - Admin Approval Component**
**File:** `Job_Client/src/components/Admin/EmployerApprovals.jsx`
- New component for managing employer approvals
- Displays pending employers in a table
- Displays approved employers in a separate tab
- Approve button for quick approval
- Reject button with modal for rejection reason
- Email notifications are sent after approval/rejection

### 10. **Frontend - Admin Dashboard Update**
**File:** `Job_Client/src/pages/AdminDashboard.jsx`
- Added tab navigation with "Employer Approvals" section
- Integrates the EmployerApprovals component

---

## User Flow

### For Employers:
1. **Signup**: Employer completes registration form
2. **Email Verification**: Receives OTP, verifies email
3. **Status**: Account created with `isApproved: false`
4. **Waiting**: Employer cannot login until admin approves
5. **Admin Approval**: After admin approval, receives email notification
6. **Login**: Can now login to their dashboard

### For Admins:
1. **Login**: Admin logs in with their account
2. **Navigate**: Goes to Admin Dashboard → Employer Approvals tab
3. **Review**: Reviews pending employer applications
4. **Approve**: Click "Approve" button to approve employer
   - Employer receives approval email with login link
5. **Reject**: Click "Reject" button to reject with reason
   - Modal appears to enter rejection reason
   - Employer receives rejection email with reason

---

## API Endpoints

### Admin Endpoints (Protected with verifyToken + verifyAdmin)

```
GET /api/auth/admin/pending-employers
- Returns: { employers: [...] }

GET /api/auth/admin/approved-employers
- Returns: { employers: [...] }

POST /api/auth/admin/approve-employer
- Body: { employerId: "..." }
- Returns: { message, employer }

POST /api/auth/admin/reject-employer
- Body: { employerId: "...", reason: "..." }
- Returns: { message, employer }
```

### Updated Login Endpoint

```
POST /api/auth/login
- Body: { email, password }
- Response for pending approval:
  {
    "message": "Your account is pending admin approval",
    "status": "PENDING_APPROVAL",
    "rejectionReason": null or "reason"
  }
  (HTTP 403)
```

---

## Environment Variables

Make sure to have these set in your `.env` file:
```
ADMIN_EMAIL=your-admin-email@example.com
FRONTEND_URL=http://localhost:5173  # or your frontend URL
```

---

## Testing Checklist

- [ ] Employer signup creates account with `isApproved: false`
- [ ] Employer cannot login before approval
- [ ] Admin can view pending employers list
- [ ] Admin can approve employer
  - [ ] Employer receives approval email
  - [ ] Employer can now login
- [ ] Admin can reject employer
  - [ ] Modal for rejection reason appears
  - [ ] Employer receives rejection email with reason
  - [ ] Employer cannot login
- [ ] Approved employers can be viewed in "Approved" tab
- [ ] Employee and instructor registrations are not affected (auto-approved)

---

## Security Features

1. ✅ Admin endpoints protected with `verifyAdmin` middleware
2. ✅ Only admins can approve/reject employers
3. ✅ JWT tokens ensure secure authentication
4. ✅ Email notifications for transparency
5. ✅ Rejection reasons logged for audit trail

---

## Error Handling

| Status | Message | Meaning |
|--------|---------|---------|
| 403 | Account pending admin approval | Employer needs admin approval |
| 404 | Employer not found | Invalid employer ID |
| 401 | No token provided | Missing authentication |
| 403 | Unauthorized: Admin access required | Non-admin trying to access admin endpoints |

---

## Future Enhancements

- [ ] Add pagination to employer lists
- [ ] Add search/filter for employers
- [ ] Add bulk approval feature
- [ ] Add approval/rejection history logs
- [ ] Add notification for admins when new employers sign up
- [ ] Add expiry period for pending applications

