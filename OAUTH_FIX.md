# 🚨 QUICK FIX: Add Missing Environment Variables

## PROBLEM:
Google OAuth strategy requires clientID even if not used.

## SOLUTION:
Add these additional environment variables to your Render service:

```
GOOGLE_CLIENT_ID=placeholder_not_configured
GOOGLE_CLIENT_SECRET=placeholder_not_configured
```

## OR Better Solution:
I've updated the passport.js to only initialize Google OAuth if credentials are provided.

## ADD TO RENDER:
1. Go to your Render service settings
2. Add these environment variables:
   - `GOOGLE_CLIENT_ID` = `placeholder_not_configured`
   - `GOOGLE_CLIENT_SECRET` = `placeholder_not_configured`

## THEN REDEPLOY:
The service will restart automatically with the new environment variables.

## WHAT WILL WORK:
- ✅ GitHub OAuth (fully configured)
- ✅ Regular email/password login  
- ✅ M-Pesa payments
- ⚠️ Google OAuth (disabled until credentials added)

The service should start successfully after adding these placeholders!
