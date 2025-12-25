# Pull Request Instructions

## PR Details

**Title:** Migrate authentication from Supabase to Clerk

**Base Branch:** `main`
**Head Branch:** `clerk-authentication`

## PR Description

```markdown
## Summary
This PR migrates the authentication system from Supabase Auth to Clerk.

## Changes
- ✅ Replaced all Supabase Auth calls with Clerk authentication
- ✅ Updated middleware to use Clerk
- ✅ Updated all components to use Clerk hooks (`useUser`, `useSignIn`, `useSignUp`)
- ✅ Removed unused Supabase middleware file
- ✅ Added environment variables audit documentation

## Components Updated
- `app/api/send-email/route.ts`
- `components/login-form.tsx`
- `components/signup-form.tsx`
- `components/mood-tracker-form.tsx`
- `components/dashboard-overview.tsx`
- `components/settings-tab.tsx`
- `components/emergency-contact-tab.tsx`
- `components/analytics-tab.tsx`
- `app/auth/reset-password/page.tsx`
- `middleware.ts`

## Environment Variables Required
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (Required)
- `CLERK_SECRET_KEY` (Required)
- `NEXT_PUBLIC_SUPABASE_URL` (Optional - for database)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Optional - for database)
- `RESEND_API_KEY` (Optional - for email)

## Testing Checklist
- [ ] Test login flow
- [ ] Test signup flow
- [ ] Test Google OAuth
- [ ] Test password reset
- [ ] Test protected routes
- [ ] Test database operations (still use Supabase for data)

## Notes
- Supabase is still used for database operations (not authentication)
- All authentication now handled by Clerk
- See `ENV_AUDIT.md` for environment variables documentation
```

## How to Create PR

1. Go to: https://github.com/liormedan/v0-moods-enter/compare/main...clerk-authentication
2. Click "Create Pull Request"
3. Copy the description above
4. Review the changes
5. Create the PR

## Commits Included

- `3aa4d0a` - chore: Remove unused Supabase middleware file and add environment audit
- `262b813` - Replace all Supabase auth with Clerk - all components now use Clerk for authentication
- `124d21a` - Fix: Remove Supabase dependencies from auth flow, use Clerk only
- `98f4074` - Migrate authentication from Supabase to Clerk

