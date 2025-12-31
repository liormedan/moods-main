# MOODS - Data Retention Policy

**Last Updated: January 1, 2026**
**Effective Date: January 1, 2026**

## 1. Introduction

This Data Retention Policy outlines how MOODS collects, stores, retains, and deletes user data. This policy is designed to comply with GDPR, applicable privacy laws, and industry best practices.

## 2. Purpose and Scope

### 2.1 Purpose
- Define retention periods for different data categories
- Ensure compliance with legal obligations
- Protect user privacy by not retaining data longer than necessary
- Enable users to understand how long their data is kept

### 2.2 Scope
This policy applies to:
- All personal data collected through the MOODS app
- Data stored in our systems (Firebase, Google Analytics)
- Backup and archived data
- Deleted data and account information

## 3. Data Categories and Retention Periods

### 3.1 User Account Data

#### Active Accounts
**Data Type:** Email address, username, account settings
**Retention Period:** Duration of account activity
**Reason:** Required for service provision
**Deletion:** Upon account deletion request

#### Deleted Accounts
**Data Type:** All personal identifiable information
**Retention Period:** 30 days (soft delete), then permanent deletion
**Reason:** Grace period for account recovery
**Notes:** After 30 days, all data is permanently and irreversibly deleted

### 3.2 Mood and Emotional Data

#### Active User Data
**Data Type:** Mood entries, emotional state tracking, notes
**Retention Period:** Duration of account activity
**Reason:** Core service functionality
**User Control:** Users can delete individual entries or all data at any time

#### Deleted Mood Data
**Data Type:** Individual mood entries deleted by user
**Retention Period:** Immediate permanent deletion
**Reason:** User request
**Notes:** No recovery possible after deletion

### 3.3 Technical and Usage Data

#### App Usage Analytics
**Data Type:** Screen views, feature usage, app performance
**Retention Period:** 14 months
**Reason:** Service improvement and bug fixing
**Processor:** Google Analytics for Firebase
**Anonymization:** IP addresses anonymized

#### Device Information
**Data Type:** Device model, OS version, app version
**Retention Period:** Duration of account activity
**Reason:** Technical support and compatibility
**Deletion:** Upon account deletion

#### Crash Reports and Error Logs
**Data Type:** Technical error data, crash logs
**Retention Period:** 90 days
**Reason:** Bug fixing and service stability
**Notes:** Contains no personally identifiable information

### 3.4 Communication Data

#### Support Tickets
**Data Type:** Customer support communications, email correspondence
**Retention Period:** 3 years
**Reason:** Legal compliance, quality assurance
**Notes:** Retained for business operations and potential disputes

#### In-App Messages
**Data Type:** System notifications, app messages
**Retention Period:** 90 days or until account deletion
**Reason:** User reference and support

### 3.5 Financial and Subscription Data

#### Payment Information
**Data Type:** Transaction IDs, subscription status
**Retention Period:** 7 years
**Reason:** Tax compliance, financial record-keeping
**Notes:** Actual payment details (credit cards) are never stored by MOODS
**Processor:** Apple App Store / Google Play Store

#### Subscription History
**Data Type:** Subscription start/end dates, pricing
**Retention Period:** 7 years
**Reason:** Financial and tax compliance

### 3.6 Authentication Data

#### Login Sessions
**Data Type:** Session tokens, last login date
**Retention Period:** 30 days after last activity, or until logout
**Reason:** Security and session management

#### Password Hashes
**Data Type:** Encrypted password data
**Retention Period:** Duration of account activity
**Reason:** Authentication
**Notes:** Passwords are never stored in plain text

### 3.7 Aggregate and Anonymous Data

#### Anonymized Analytics
**Data Type:** Anonymous usage patterns, aggregated statistics
**Retention Period:** Indefinite
**Reason:** Research, service improvement, trend analysis
**Notes:** Cannot be traced back to individual users
**Examples:** "Average mood rating per month", "Most used features"

## 4. Backup and Archive Retention

### 4.1 System Backups
**Frequency:** Daily
**Retention Period:** 90 days
**Purpose:** Disaster recovery, data integrity
**Deletion:** Deleted account data is purged from backups within 90 days

### 4.2 Archive Storage
**Use Case:** Legal hold, regulatory compliance
**Retention Period:** As required by law
**Access:** Restricted to authorized personnel only

## 5. Data Deletion Procedures

### 5.1 User-Initiated Deletion

#### Account Deletion
**Process:**
1. User selects "Delete Account" in app settings
2. Confirmation prompt displayed
3. 30-day grace period begins (account deactivated)
4. User can reactivate within 30 days
5. After 30 days, permanent deletion executed

**What Gets Deleted:**
- All personal identifiable information
- All mood data and entries
- All notes and custom data
- Account credentials
- Device associations
- Preferences and settings

**What Remains:**
- Anonymous aggregated statistics
- Transaction records (for 7 years, as legally required)
- Support tickets (anonymized after 30 days)

#### Individual Entry Deletion
**Process:** Immediate permanent deletion upon user request
**Recovery:** Not possible

### 5.2 Automatic Deletion

#### Inactive Accounts
**Definition:** No login activity for 5 years
**Process:**
1. Email notification sent at 4.5 years of inactivity
2. Second notification at 4 years 11 months
3. Account deletion after 5 years if no response
4. 30-day grace period before permanent deletion

#### Expired Data
**Process:** Automated deletion based on retention schedules
**Frequency:** Weekly cleanup jobs
**Verification:** Deletion logs maintained for audit

### 5.3 Legal and Compliance Deletion

#### Right to Erasure (GDPR Article 17)
**Response Time:** Within 30 days of request
**Process:**
1. User submits deletion request
2. Identity verification
3. Deletion executed across all systems
4. Confirmation sent to user
5. Deletion logged for compliance

**Exceptions:**
- Data required for legal compliance (transaction records)
- Data needed for legal claims or disputes
- Anonymous aggregated data (cannot be traced to individual)

## 6. Data Retention Justification

### 6.1 Legal Requirements
- Financial records: 7 years (tax law compliance)
- Support communications: 3 years (consumer protection)
- Consent records: Duration of processing + 3 years

### 6.2 Business Purposes
- Service delivery and functionality
- Customer support and troubleshooting
- Security and fraud prevention
- Product improvement and analytics

### 6.3 User Benefit
- Historical mood data for insights
- Long-term trend analysis
- Personalized experience

## 7. Data Security During Retention

### 7.1 Encryption
- Data at rest: AES-256 encryption
- Data in transit: TLS 1.3
- Encryption keys rotated regularly

### 7.2 Access Controls
- Role-based access (RBAC)
- Multi-factor authentication for admin access
- Audit logs for all data access
- Principle of least privilege

### 7.3 Monitoring
- Continuous security monitoring
- Automated threat detection
- Regular security audits
- Penetration testing annually

## 8. Third-Party Data Retention

### 8.1 Firebase (Google Cloud)
**Retention:** Per MOODS policy and Google's terms
**Control:** MOODS maintains deletion control
**Compliance:** Google complies with data deletion requests

### 8.2 Google Analytics
**Retention:** 14 months for analytics data
**Anonymization:** IP anonymization enabled
**Control:** MOODS can request earlier deletion

### 8.3 App Store Providers
**Retention:** Per Apple/Google policies
**Scope:** Transaction data only
**Access:** MOODS has limited access to this data

## 9. User Rights and Controls

### 9.1 Access Your Data
- View all personal data in-app
- Export data in JSON/CSV format
- Request detailed data report

### 9.2 Delete Your Data
- Delete individual mood entries
- Delete account and all data
- Request specific data deletion

### 9.3 Modify Retention
- No ability to extend retention beyond policy
- Can request earlier deletion at any time
- Cannot prevent legally required retention

## 10. Changes to This Policy

### 10.1 Updates
- Policy reviewed annually
- Material changes require user notification
- Changes effective 30 days after notification

### 10.2 Notification Methods
- In-app notification
- Email to registered address
- Updated policy posted in app and website

## 11. Compliance and Auditing

### 11.1 Regular Reviews
- Quarterly retention policy compliance check
- Annual full data audit
- Regular training for staff on retention procedures

### 11.2 Documentation
- Deletion logs maintained for 7 years
- Retention schedule documentation
- User requests and responses logged

### 11.3 Reporting
- Annual compliance report prepared
- Data breach incidents reported per GDPR Article 33/34

## 12. Contact Information

**General Inquiries:**
support@moods-app.com

**Data Retention Questions:**
privacy@moods-app.com

**Data Deletion Requests:**
delete@moods-app.com

**Data Protection Officer:**
dpo@moods-app.com

**Response Time:** Within 30 days

## 13. Definitions

**Active Account:** Account with login activity within the past 5 years

**Soft Delete:** Data marked for deletion but recoverable for a grace period

**Hard Delete:** Permanent, irreversible data deletion

**Personal Data:** Any information relating to an identified or identifiable person

**Anonymous Data:** Data that cannot be attributed to a specific individual

**Retention Period:** The time data is kept before deletion

## 14. Legal Basis

This policy is designed to comply with:
- General Data Protection Regulation (GDPR)
- Israeli Privacy Protection Law
- California Consumer Privacy Act (CCPA)
- Other applicable data protection regulations

---

**Summary Table: Data Retention Periods**

| Data Type | Retention Period | Reason |
|-----------|-----------------|--------|
| Active account data | Duration of account | Service provision |
| Deleted accounts | 30 days grace + permanent deletion | Account recovery |
| Mood data (active) | Duration of account | Core functionality |
| Analytics data | 14 months | Service improvement |
| Crash logs | 90 days | Bug fixing |
| Support tickets | 3 years | Legal compliance |
| Financial records | 7 years | Tax compliance |
| Backups | 90 days | Disaster recovery |
| Anonymous data | Indefinite | Research |
| Inactive accounts | 5 years + 30 day notice | Storage optimization |

---

**This Data Retention Policy ensures MOODS handles user data responsibly, transparently, and in compliance with all applicable laws and regulations.**
