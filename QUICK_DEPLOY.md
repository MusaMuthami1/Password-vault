# Quick Deploy to Your DigitalOcean Droplet

## After creating your droplet, you'll get an IP address (e.g., 159.65.xxx.xxx)

### 1. Upload the deployment script:
```bash
scp deploy/deploy.sh root@YOUR_DROPLET_IP:/root/
```

### 2. SSH into your droplet:
```bash
ssh root@YOUR_DROPLET_IP
```

### 3. Run the automated deployment:
```bash
chmod +x deploy.sh
./deploy.sh
```

### 4. Configure your environment variables:
```bash
nano /var/www/password-vault/server/.env
```

Add these values:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
GITHUB_CLIENT_ID=Ov23li9991Hvb8GQtszI
GITHUB_CLIENT_SECRET=your_github_client_secret
EMAIL_SERVICE_ID=your_emailjs_service_id
EMAIL_TEMPLATE_ID=your_emailjs_template_id
EMAIL_PUBLIC_KEY=your_emailjs_public_key
```

### 5. Restart the application:
```bash
pm2 restart password-vault-api
```

### 6. Your app will be live at:
- http://YOUR_DROPLET_IP
- API: http://YOUR_DROPLET_IP/api

## Need help with any of these values? Let me know!
