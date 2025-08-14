# GitHub OAuth Setup Instructions

Since you have GitHub Student Pack, follow these steps to set up real GitHub authentication:

## Step 1: Create a GitHub OAuth App

1. Go to GitHub.com and sign in
2. Go to Settings → Developer settings → OAuth Apps
3. Click "New OAuth App"
4. Fill in these details:
   - **Application name**: CipherNest Password Manager
   - **Homepage URL**: http://localhost:3000
   - **Authorization callback URL**: http://localhost:5000/api/auth/github/callback

## Step 2: Get Your Credentials

After creating the app, you'll get:
- **Client ID**: (copy this)
- **Client Secret**: (click "Generate a new client secret" and copy it)

## Step 3: Update Your .env File

Add these to your `server/.env` file:
```
GITHUB_CLIENT_ID=your_actual_client_id_here
GITHUB_CLIENT_SECRET=your_actual_client_secret_here
```

## Step 4: I'll Update the Code

Once you provide the credentials, I'll update the code to use real GitHub OAuth!

This will give you:
- ✅ Real GitHub authentication
- ✅ No mock authentication needed
- ✅ Professional OAuth flow
- ✅ Works with your Student Pack benefits
