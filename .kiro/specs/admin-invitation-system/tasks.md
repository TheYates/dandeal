# Implementation Plan: Admin Invitation System

## Overview

This implementation plan breaks down the Admin Invitation System into discrete, incremental coding tasks. The approach follows a bottom-up strategy: starting with backend data operations, then building the invitation flow, and finally integrating the UI components. Each task builds on previous work, with checkpoints to validate functionality.

## Tasks

- [x] 1. Set up Convex backend functions for invitation management
  - [x] 1.1 Implement invitation creation mutation
    - Create `convex/invitations.ts` with `create` mutation
    - Generate cryptographically secure tokens using `crypto.randomBytes(32).toString('hex')`
    - Validate email format and role values
    - Check for duplicate pending invitations and existing admin users
    - Set expiration to 7 days from creation (createdAt + 604800000ms)
    - Store invitation record with status "pending"
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 5.1, 5.2, 5.5, 5.6, 7.1, 7.2_
  
  - [ ]* 1.2 Write property tests for invitation creation
    - **Property 1: Token Uniqueness** - Test that multiple invitations generate unique tokens
    - **Property 2: Email Validation** - Test that invalid emails are rejected
    - **Property 3: Role Validation** - Test that invalid roles are rejected
    - **Property 4: Expiration Calculation** - Test that expiresAt = createdAt + 7 days
    - **Property 20: Duplicate Prevention** - Test that duplicate pending invitations are blocked
    - **Property 22: Existing User Prevention** - Test that invitations for existing users are blocked
    - **Validates: Requirements 1.1, 1.2, 1.3, 5.1, 5.2, 5.5, 5.6, 7.1, 7.2**
  
  - [x] 1.3 Implement invitation queries
    - Add `list` query to return all invitations ordered by createdAt descending
    - Add `stats` query to aggregate counts by status (total, pending, accepted, expired, revoked)
    - Add `getByToken` query using indexed lookup on token field
    - Add `checkEmail` query to check for pending invitations and existing users
    - _Requirements: 4.1, 4.2, 5.1, 5.5_
  
  - [ ]* 1.4 Write property tests for invitation queries
    - **Property 16: List Completeness** - Test that all invitations are returned with required fields
    - **Property 17: Statistics Accuracy** - Test that stats counts match actual invitation counts
    - **Validates: Requirements 4.1, 4.2**
  
  - [x] 1.5 Implement invitation acceptance mutation
    - Add `accept` mutation to validate token and create admin user
    - Validate token exists, status is "pending", and not expired
    - Hash password using bcrypt with 10 rounds
    - Create admin user with email, name, hashed password, and role from invitation
    - Update invitation status to "accepted" and set acceptedAt timestamp
    - Return success status and user ID
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.7_
  
  - [ ]* 1.6 Write property tests for invitation acceptance
    - **Property 10: Token Validation** - Test that invalid tokens are rejected
    - **Property 11: Status Validation** - Test that non-pending invitations cannot be accepted
    - **Property 12: Expiration Validation** - Test that expired invitations are rejected
    - **Property 13: User Creation** - Test that accepting creates admin user with correct data
    - **Property 14: Status Transition** - Test that accepted invitations update status and timestamp
    - **Property 15: Input Validation** - Test that missing name/password is rejected
    - **Property 26: Reuse Prevention** - Test that accepted invitations cannot be accepted again
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.7, 7.3**
  
  - [x] 1.7 Implement invitation management mutations
    - Add `resend` mutation to generate new token and update expiration
    - Add `revoke` mutation to update status to "revoked"
    - Add `remove` mutation to delete invitation record (only for non-pending)
    - _Requirements: 4.4, 4.5_
  
  - [ ]* 1.8 Write property tests for invitation management
    - **Property 18: Resend Token Regeneration** - Test that resend generates new token and updates expiration
    - **Property 19: Revocation Prevents Acceptance** - Test that revoked invitations cannot be accepted
    - **Validates: Requirements 4.4, 4.5, 7.4**

- [x] 2. Checkpoint - Ensure backend tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Implement email service integration
  - [x] 3.1 Update sendInvitationEmail action
    - Verify existing `convex/sendInvitationEmail.ts` action
    - Ensure it constructs invitation URL with token parameter using NEXT_PUBLIC_APP_URL
    - Verify HTML email includes token in URL, inviter name, role, and expiration timeframe
    - Verify plain text version is generated
    - Ensure error handling returns structured error object
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 9.2, 9.3, 9.4, 9.5_
  
  - [ ]* 3.2 Write property tests for email service
    - **Property 6: Email Trigger** - Test that email action is called with correct parameters
    - **Property 7: Email Content** - Test that email contains token, inviter name, role, and expiration
    - **Property 8: Email Format** - Test that both HTML and text versions are generated
    - **Property 9: Error Handling** - Test that email failures return error result
    - **Property 27: URL Construction** - Test that invitation URL uses correct base URL
    - **Validates: Requirements 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 9.3, 9.5**

- [x] 4. Implement role-based permission checking
  - [x] 4.1 Add permission validation to invitation creation
    - Add helper function to check if user can create invitation for specified role
    - Super admins can create any role
    - Admins can create admin and viewer roles only
    - Viewers cannot create invitations
    - Return permission error if validation fails
    - _Requirements: 6.1, 6.2, 6.3, 6.5_
  
  - [ ]* 4.2 Write property tests for permission checking
    - **Property 23: Super Admin Permissions** - Test that super admins can create all role types
    - **Property 24: Admin Restrictions** - Test that admins cannot create super_admin invitations
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.5**

- [x] 5. Checkpoint - Ensure all backend functionality works
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Create React hooks for invitation management
  - [x] 6.1 Update useInvitations hook
    - Verify existing `hooks/use-invitations.ts` hook
    - Ensure it subscribes to `list` and `stats` queries
    - Verify it returns invitations array, stats object, and loading state
    - _Requirements: 4.1, 4.2_
  
  - [x] 6.2 Update useInvitationMutations hook
    - Verify existing hook wraps create, resend, revoke, and delete mutations
    - Ensure create and resend automatically trigger email sending
    - Verify error handling and return combined result with email status
    - _Requirements: 1.5, 4.4, 4.5_
  
  - [x] 6.3 Update useInvitationByToken hook
    - Verify existing hook queries invitation by token
    - Ensure it computes isValid and isExpired based on status and expiration
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [x] 6.4 Update useAcceptInvitation hook
    - Verify existing hook wraps accept mutation
    - Ensure it handles password hashing on backend
    - _Requirements: 3.4, 3.5_
  
  - [ ]* 6.5 Write unit tests for React hooks
    - Test useInvitations returns correct data structure
    - Test useInvitationMutations calls correct backend functions
    - Test useInvitationByToken computes validity correctly
    - Test useAcceptInvitation handles acceptance flow
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2_

- [x] 7. Build invitation management UI components
  - [x] 7.1 Create InvitationManagement component
    - Create `components/admin/management/invitation-management.tsx`
    - Use useInvitations hook to fetch invitations and stats
    - Display stats cards showing total, pending, accepted, expired, revoked counts
    - Render InvitationTable component with invitations data
    - Add "Create Invitation" button that opens CreateInvitationDialog
    - Handle resend, revoke, and delete actions from table
    - Show toast notifications for success/error messages
    - _Requirements: 4.1, 4.2, 8.1, 8.2_
  
  - [x] 7.2 Create CreateInvitationDialog component
    - Create modal dialog component with email and role input fields
    - Add email format validation (RFC 5322 compliant)
    - Add role dropdown with super_admin, admin, viewer options
    - Disable super_admin option for non-super-admin users
    - Call useInvitationMutations().create() on form submission
    - Display validation errors inline
    - Show loading state during submission
    - Close dialog and refresh list on success
    - _Requirements: 1.2, 6.1, 6.2, 6.3, 8.3_
  
  - [x] 7.3 Create InvitationTable component
    - Create table component displaying invitations
    - Show columns: email, role, status, invited by, created date, expires date, actions
    - Use color-coded badges for status (pending: yellow, accepted: green, expired: gray, revoked: red)
    - Add sortable column headers
    - Show "Resend" and "Revoke" buttons for pending invitations
    - Show "Delete" button for non-pending invitations
    - Disable actions during processing
    - Match styling of existing admin tables (email-management.tsx)
    - _Requirements: 4.1, 4.3, 8.4, 8.5_
  
  - [ ]* 7.4 Write unit tests for UI components
    - Test InvitationManagement renders stats and table correctly
    - Test CreateInvitationDialog validates input and calls create mutation
    - Test InvitationTable displays invitations with correct status colors
    - Test action buttons call correct mutation functions
    - _Requirements: 4.1, 4.2, 8.2, 8.3, 8.4, 8.5_

- [x] 8. Build invitation acceptance page
  - [x] 8.1 Create AcceptInvitationPage component
    - Create `app/accept-invite/page.tsx` as public route
    - Extract token from URL query parameter
    - Use useInvitationByToken hook to validate token on page load
    - Display loading state while validating token
    - Show error message if token is invalid, expired, or already used
    - Render acceptance form if token is valid
    - _Requirements: 3.1, 3.2, 3.3, 3.6_
  
  - [x] 8.2 Implement acceptance form
    - Add input fields for name, password, and confirm password
    - Validate name (min 2 characters)
    - Validate password strength (min 8 characters, uppercase, lowercase, number)
    - Validate password confirmation matches
    - Call useAcceptInvitation().accept() on form submission
    - Show loading state during submission
    - Redirect to login page on success
    - Display error message on failure
    - _Requirements: 3.4, 3.5, 3.7_
  
  - [ ]* 8.3 Write unit tests for acceptance page
    - Test page validates token on load
    - Test form validates input fields
    - Test form calls accept mutation with correct data
    - Test error states display correctly
    - Test success redirects to login
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

- [x] 9. Checkpoint - Ensure all UI components work
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Add invitation management to admin navigation
  - [x] 10.1 Update admin navigation menu
    - Add "Invitations" link to admin panel navigation
    - Place it in the management section alongside email management
    - Ensure only admins and super admins can see the link
    - _Requirements: 8.1_
  
  - [x] 10.2 Create invitation management page route
    - Create `app/admin/invitations/page.tsx`
    - Render InvitationManagement component
    - Add page title and description
    - Ensure route is protected (requires admin or super_admin role)
    - _Requirements: 8.1_

- [x] 11. Implement automatic expiration checking
  - [x] 11.1 Add expiration logic to token validation
    - Update getByToken query to check if current time > expiresAt
    - Update accept mutation to reject expired invitations
    - Update stats query to count expired invitations dynamically
    - _Requirements: 3.3, 4.6, 10.1, 10.4_
  
  - [ ]* 11.2 Write property tests for expiration
    - **Property 12: Expiration Validation** - Test that expired invitations are rejected
    - **Validates: Requirements 3.3, 10.2, 10.4**

- [x] 12. Add error handling and logging
  - [x] 12.1 Implement structured error responses
    - Define error codes (INVALID_EMAIL, DUPLICATE_INVITATION, etc.)
    - Update all mutations to return structured error objects
    - Add error logging to console for debugging
    - _Requirements: 2.5_
  
  - [x] 12.2 Add email logging
    - Verify email attempts are logged to emailLogs table
    - Log success and failure cases with error messages
    - _Requirements: 2.5_
  
  - [ ]* 12.3 Write unit tests for error handling
    - Test all error codes are returned correctly
    - Test error messages are user-friendly
    - Test email failures are logged
    - _Requirements: 2.5_

- [x] 13. Final integration and polish
  - [x] 13.1 Add real-time updates to invitation list
    - Verify useInvitations hook subscribes to real-time Convex updates
    - Test that invitation list updates when status changes
    - _Requirements: 8.6_
  
  - [x] 13.2 Add loading states and optimistic updates
    - Add skeleton loaders to invitation table while loading
    - Add loading spinners to action buttons during processing
    - Disable form inputs during submission
    - _Requirements: 8.2, 8.3_
  
  - [x] 13.3 Polish UI styling and responsiveness
    - Ensure all components match existing admin panel styling
    - Test responsive design on mobile and tablet
    - Add hover states and transitions
    - Ensure accessibility (ARIA labels, keyboard navigation)
    - _Requirements: 8.4_
  
  - [ ]* 13.4 Write integration tests
    - Test complete invitation flow (create → email → accept)
    - Test resend flow (resend → new email → accept with new token)
    - Test revoke flow (revoke → cannot accept)
    - Test duplicate prevention (create → attempt duplicate → blocked)
    - _Requirements: 1.1, 1.5, 2.1, 3.1, 3.4, 4.4, 4.5, 5.1_

- [x] 14. Final checkpoint - Complete system validation
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties using fast-check library
- Unit tests validate specific examples and edge cases
- The implementation leverages existing infrastructure (Convex, Resend, Clerk, React hooks)
- All components should match the styling and patterns of existing admin management pages
