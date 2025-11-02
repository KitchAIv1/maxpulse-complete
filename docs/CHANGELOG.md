# MAXPULSE Platform - Changelog

All notable changes to the MAXPULSE platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.1.0] - 2025-01-03

### Added
- **TestFlight App Store Integration**: All activation code modals and purchase confirmation pages now link to TestFlight App Store (`https://apps.apple.com/us/app/testflight/id899247664`)
- **Enhanced Purchase State Persistence**: Purchase state now persists across page refreshes via localStorage with per-distributor isolation
- **Automatic Auth User Creation**: Supabase auth users are automatically created when activation codes are generated, with secure password generation and welcome emails
- **Database Migration**: `20250103000003_fix_ambiguous_user_id_in_clients.sql` - Fixes ambiguous `user_id` reference in `log_client_activity` function
- **Unified Button Styling**: Consistent design system with red-to-amber gradient for action buttons and dark gray for close buttons
- **Enhanced Activation Modal UX**: Two prominent TestFlight download buttons, security notice, and improved visual hierarchy

### Changed
- **Edge Function Auth Implementation**: Switched from `supabase-js` SDK `auth.admin` methods to direct REST API calls (compatibility with Deno Edge Function environment)
- **TestFlight Link Updates**: Replaced generic app download links with TestFlight App Store link throughout activation flow
- **Button Text**: Updated "Download MAXPULSE App" to "Download TestFlight App" for clarity
- **Close Button Design**: Changed from red gradient to dark gray (`#1f2937`) for better visual hierarchy

### Fixed
- **Ambiguous User ID Error**: Fixed database error `column reference "user_id" is ambiguous` during client record creation
- **Purchase State Persistence**: Users returning to CTA page after purchase now see "Already Purchased" state instead of "Activate My Plan" button
- **Modal State Management**: Improved modal visibility control to prevent unwanted re-opening after user closes it
- **Button Text Visibility**: Fixed white text on gradient buttons using inline styles with explicit color declarations

### Security
- **Service Role Key Rotation**: Rotated Supabase service role key after exposure in git history
- **Secret API Key Support**: Edge Functions now support both JWT `service_role` keys and new Secret API keys (`sb_secret_...`)
- **Edge Function Secrets**: All service role keys stored in Edge Function secrets only (never exposed to client)

### Documentation
- Updated `ACTIVATION_CODE_SYSTEM_IMPLEMENTATION.md` with recent UI changes and purchase state persistence
- Updated `SUPABASE_AUTH_INTEGRATION_COMPLETE.md` with REST API approach and database migrations
- Updated `README.md` with latest activation code and auth integration features
- Updated `FINAL_DEPLOYMENT_STEPS.md` with ambiguous user_id migration

---

## [2.0.0] - 2024-10-27

### Added
- Enterprise-grade activation code system with 8-character unique codes
- Seamless assessment-to-app data transfer with complete V2 analysis
- Purchase state persistence via localStorage
- Device-specific app download links
- Activation code modal with copy-to-clipboard functionality

### Changed
- Refactored activation code generation to integrate with auth user creation
- Enhanced error handling with transaction-like rollback on failures

---

For earlier versions, see archived documentation in `docs/archive/`.

