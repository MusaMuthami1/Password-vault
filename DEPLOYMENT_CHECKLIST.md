# 🚀 Deployment Checklist for CipherVault

## Phase 1: GitHub Student Pack Setup ✅
- [x] Repository created and pushed to GitHub
- [ ] GitHub Student Pack benefits claimed ($600+ value)
- [ ] DigitalOcean $200 credit claimed
- [ ] Free domain claimed (if desired)

## Phase 2: Backend Deployment (DigitalOcean)
- [ ] Create DigitalOcean account with Student Pack credit
- [ ] Create Ubuntu 22.04 droplet ($6/month = 33+ months free)
- [ ] Configure environment variables in server/.env
- [ ] Run deployment script: `bash deploy/deploy.sh`
- [ ] Point domain to droplet IP (if using custom domain)
- [ ] Set up SSL certificate with certbot
- [ ] Test API endpoints

### Quick Deploy Commands:
```bash
# 1. Upload deployment script to droplet
scp deploy/deploy.sh root@YOUR_DROPLET_IP:/root/

# 2. SSH into droplet and run
ssh root@YOUR_DROPLET_IP
chmod +x deploy.sh
./deploy.sh

# 3. Configure environment variables
nano /var/www/password-vault/server/.env
pm2 restart password-vault-api
```

## Phase 3: Frontend Deployment Options

### Option A: Serve from Same Server (Included in deploy.sh)
- [x] Nginx configured to serve React build
- [x] API proxy setup at /api
- [x] Static files cached properly

### Option B: Vercel (Free with Student Pack Pro)
- [ ] Install Vercel CLI: `npm i -g vercel`
- [ ] Deploy: `cd client && vercel --prod`
- [ ] Configure environment variables in Vercel dashboard
- [ ] Update CORS settings in server

## Phase 4: Mobile App (Android)
- [ ] Install Android Studio and Java 11+
- [ ] Install Capacitor: `npm run install:capacitor`
- [ ] Initialize mobile project: `npm run init:capacitor`
- [ ] Add Android platform: `npm run add:android`
- [ ] Update client/.env with production API URL
- [ ] Build and test: `npm run build:android`
- [ ] Open in Android Studio: `npm run open:android`

### Android Release Steps:
- [ ] Generate signing key (keep secure!)
- [ ] Configure signing in Android Studio
- [ ] Build release APK: `npm run release:android`
- [ ] Build App Bundle: `npm run bundle:android`
- [ ] Test on physical device
- [ ] Create Play Store assets (icons, screenshots)
- [ ] Upload to Play Store Console

## Phase 5: Testing & Security
- [ ] Test all features in production environment
- [ ] Verify HTTPS/SSL certificate
- [ ] Test payment integration (M-Pesa, PayPal)
- [ ] Test GitHub OAuth with production URLs
- [ ] Verify email notifications work
- [ ] Test mobile app on different devices
- [ ] Run security scan
- [ ] Performance testing

## Phase 6: Go Live
- [ ] Update DNS records (if using custom domain)
- [ ] Monitor application logs
- [ ] Set up monitoring alerts
- [ ] Submit Android app for review
- [ ] Update documentation
- [ ] Announce launch! 🎉

## Environment Variables Needed

### Server (.env):
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/password-vault
JWT_SECRET=your_32_character_secret
GITHUB_CLIENT_ID=Ov23li9991Hvb8GQtszI
GITHUB_CLIENT_SECRET=your_github_secret
EMAIL_SERVICE_ID=your_emailjs_service_id
EMAIL_TEMPLATE_ID=your_emailjs_template_id
EMAIL_PUBLIC_KEY=your_emailjs_public_key
```

### Client (.env):
```env
REACT_APP_API_URL=https://yourdomain.com/api
REACT_APP_GITHUB_CLIENT_ID=Ov23li9991Hvb8GQtszI
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
```

## Student Pack Benefits to Claim:
- ✅ GitHub Copilot
- [ ] DigitalOcean $200 credit
- [ ] Vercel Pro (worth $20/month)
- [ ] Name.com free domain
- [ ] JetBrains IDEs
- [ ] Stripe fee reduction
- [ ] MongoDB Atlas credits
- [ ] Heroku dyno credits

## Support Resources:
- DigitalOcean Documentation: https://docs.digitalocean.com/
- Capacitor Docs: https://capacitorjs.com/docs
- Play Store Guidelines: https://developer.android.com/distribute/google-play
- GitHub Student Pack: https://education.github.com/pack
