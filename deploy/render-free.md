# Render Deployment Guide (100% FREE)

## Step 1: Create Render Account
1. Go to https://render.com/
2. Sign up with GitHub (connects directly to your repo)
3. Verify your email

## Step 2: Deploy Backend
1. Click "New +" → "Web Service"
2. Connect your GitHub repo: "Password-vault"
3. Configure settings:
   - **Name**: `ciphervault-api`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free` (0$/month)

## Step 3: Environment Variables
Add these in Render dashboard:
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/password-vault
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
GITHUB_CLIENT_ID=Ov23li9991Hvb8GQtszI
GITHUB_CLIENT_SECRET=your_github_client_secret_here
EMAIL_SERVICE_ID=your_emailjs_service_id
EMAIL_TEMPLATE_ID=your_emailjs_template_id
EMAIL_PUBLIC_KEY=your_emailjs_public_key
```

## Step 4: Your API will be live at:
`https://ciphervault-api.onrender.com`

## Step 5: Update Frontend
Update your frontend to use the new API URL:
```
REACT_APP_API_URL=https://ciphervault-api.onrender.com/api
```

## Benefits:
- ✅ 750 hours/month FREE (24/7 uptime)
- ✅ Automatic HTTPS
- ✅ Auto-deploy on Git push
- ✅ No authentication walls
- ✅ Custom domains supported
- ✅ Built-in monitoring
