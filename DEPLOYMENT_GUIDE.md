# 🚀 CipherNest Password Vault - Deployment Guide

## 📱 Play Store Deployment Steps

### Phase 1: Prepare for Mobile App (Capacitor)

#### 1. Install Capacitor Dependencies
```bash
cd client
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
```

#### 2. Initialize Capacitor
```bash
npx cap init CipherNest com.ciphernest.vault
```

#### 3. Build the React App
```bash
npm run build
```

#### 4. Add Android Platform
```bash
npx cap add android
```

#### 5. Sync and Open Android Studio
```bash
npx cap sync
npx cap open android
```

### Phase 2: Production Server Setup

#### 1. Deploy Backend to Cloud
**Recommended Platforms:**
- **Heroku** (Easy deployment)
- **DigitalOcean** (Cost-effective)
- **AWS/Vercel** (Scalable)

#### 2. MongoDB Atlas (Already configured)
- Your connection string is set up
- Ensure IP whitelist includes production server

#### 3. Environment Variables for Production
```bash
# Backend (.env)
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-super-secure-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
GITHUB_CLIENT_ID=Ov23li9991Hvb8GQtszI
GITHUB_CLIENT_SECRET=your-github-secret
```

#### 4. Update Client API URL
```bash
# client/.env
REACT_APP_API_URL=https://your-production-domain.com/api
```

### Phase 3: Security & HTTPS for Production

#### 1. SSL Certificate (Production)
- Use **Let's Encrypt** for free SSL
- Or cloud provider SSL (Cloudflare, AWS Certificate Manager)

#### 2. Payment Security Requirements
- **PCI DSS Compliance** for card payments
- **HTTPS Only** for production
- **Stripe/PayPal** integration for real payments

### Phase 4: Android App Requirements

#### 1. Update Android Permissions (android/app/src/main/AndroidManifest.xml)
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.USE_BIOMETRIC" />
<uses-permission android:name="android.permission.USE_FINGERPRINT" />
```

#### 2. App Icons & Splash Screen
- Add app icons to `android/app/src/main/res/`
- Configure splash screen
- Update app name and package

#### 3. Build Signed APK
```bash
# In Android Studio
Build > Generate Signed Bundle/APK
```

### Phase 5: Play Store Submission

#### 1. Google Play Console Setup
- Create developer account ($25 one-time fee)
- Upload signed APK/AAB
- Fill out app listing

#### 2. Required Information
- **App Name**: CipherNest Password Vault
- **Category**: Productivity/Tools
- **Privacy Policy**: Required for Play Store
- **Content Rating**: PEGI 3+ (General audience)

#### 3. Store Listing Assets
- **Icon**: 512x512px
- **Feature Graphic**: 1024x500px
- **Screenshots**: Phone + Tablet screenshots
- **App Description**: SEO-optimized description

### Phase 6: Pre-Launch Checklist

#### ✅ App Functionality
- [ ] All features work offline
- [ ] Login/Register working
- [ ] Password vault CRUD operations
- [ ] Payment system functional
- [ ] GitHub OAuth working

#### ✅ Security
- [ ] HTTPS enabled in production
- [ ] JWT tokens secure
- [ ] Password encryption working
- [ ] No API keys exposed in client

#### ✅ Performance
- [ ] App loads < 3 seconds
- [ ] Smooth animations
- [ ] No memory leaks
- [ ] Optimized bundle size

#### ✅ Compliance
- [ ] Privacy policy published
- [ ] Terms of service
- [ ] GDPR compliance (if EU users)
- [ ] PCI DSS for payments

## 🔧 Quick Commands for Development

### Start Development Servers
```bash
# Start both servers
npm run dev

# Or individually
cd server && npm start
cd client && npm start
```

### Build for Production
```bash
# Build React app
npm run build

# Install Capacitor and build mobile
npm run install:capacitor
npm run init:capacitor
npm run build:android
```

### Generate SSL Certificates
```bash
npm run setup:ssl
npm run start:https
```

## 🌐 Production URLs

### Local Development
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **API**: http://localhost:5000/api

### Production (Update these)
- **Frontend**: https://your-domain.com
- **Backend**: https://api.your-domain.com
- **API**: https://api.your-domain.com/api

## 📋 Next Steps Summary

1. **Test Local App**: Ensure everything works at http://localhost:3000
2. **Install Capacitor**: Run `npm run install:capacitor`
3. **Initialize Mobile**: Run `npm run init:capacitor`
4. **Deploy Backend**: Choose hosting platform and deploy
5. **Configure Domain**: Set up custom domain with SSL
6. **Build Mobile App**: Use Android Studio to build APK
7. **Submit to Play Store**: Upload to Google Play Console

## 🚨 Important Notes

- **HTTPS Required**: Play Store requires HTTPS for all API calls
- **Real Payment Gateway**: Replace simulation with Stripe/PayPal
- **Privacy Policy**: Mandatory for Play Store submission
- **App Signing**: Use Google Play App Signing for security

Your app is now ready for the deployment process! 🎉
