# EmailJS Setup Guide for CipherNest

## Overview
EmailJS enables client-side email sending without a backend email server. This guide explains how to set up EmailJS for OTP email functionality in CipherNest.

## Why EmailJS?
- ✅ No backend email server required
- ✅ Free tier available (200 emails/month)
- ✅ Easy integration with React
- ✅ No email authentication issues like with Gmail SMTP
- ✅ Works from localhost and production

## Setup Steps

### 1. Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Add Email Service
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the connection steps
5. Note your **Service ID** (e.g., `service_abc123`)

### 3. Create Email Template
1. Go to "Email Templates" in dashboard
2. Click "Create New Template"
3. Use this template content:

**Template Name:** CipherNest OTP
**Subject:** Your CipherNest OTP Code
**Content:**
```
Hello,

Your verification code for CipherNest is: {{otp_code}}

This code will expire in 10 minutes for security reasons.

If you didn't request this code, please ignore this email.

Best regards,
The CipherNest Team
```

4. Note your **Template ID** (e.g., `template_xyz789`)

### 4. Get Public Key
1. Go to "Account" → "General"
2. Copy your **Public Key** (e.g., `user_abc123def456`)

### 5. Update Configuration
Edit `client/src/utils/emailService.js`:

```javascript
const EMAILJS_SERVICE_ID = 'your_service_id_here';
const EMAILJS_TEMPLATE_ID = 'your_template_id_here';
const EMAILJS_PUBLIC_KEY = 'your_public_key_here';
```

## Testing

### Mock Testing (Current)
- Currently using `sendOTPEmailMock()` function
- Shows OTP in browser alert for testing
- No actual email sent

### Production Testing
1. Replace configuration values
2. Change Register.js to use `sendOTPEmail()` instead of `sendOTPEmailMock()`
3. Test with real email address

## Current Status
✅ EmailJS package installed
✅ Email service utility created
✅ Mock email function working
✅ Registration flow updated
⏳ EmailJS configuration needed for production

## Security Notes
- Public key is safe to expose in client-side code
- EmailJS has built-in spam protection
- Rate limiting: 200 emails/month (free tier)
- Upgrade to paid plan for higher limits

## Template Variables
The following variables are sent to EmailJS template:
- `to_email`: Recipient email address
- `otp_code`: 6-digit OTP code
- `app_name`: "CipherNest"
- `from_name`: "CipherNest Security"

## Troubleshooting
- **Service connection failed**: Check email service configuration
- **Template not found**: Verify template ID
- **Public key invalid**: Check account settings
- **Quota exceeded**: Check usage in EmailJS dashboard

## Alternative Approach
If EmailJS doesn't work, consider:
1. SendGrid API
2. Twilio SendGrid
3. AWS SES
4. Backend email service with proper Gmail App Password
