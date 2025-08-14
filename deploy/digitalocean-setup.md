# DigitalOcean Deployment Guide

## Step 1: Claim Your GitHub Student Pack Credits
1. Visit https://education.github.com/pack
2. Verify your student status
3. Claim $200 DigitalOcean credit (1+ year of hosting)

## Step 2: Create DigitalOcean Account
1. Go to https://www.digitalocean.com/
2. Sign up using your GitHub account
3. Apply the $200 credit from Student Pack

## Step 3: Create a Droplet (Virtual Server)
```bash
# Recommended configuration:
- Distribution: Ubuntu 22.04 LTS
- Plan: Basic ($6/month - will last 33+ months with $200 credit)
- CPU: 1 vCPU, 1GB RAM, 25GB SSD
- Datacenter: Choose closest to your users
- Authentication: SSH Key (recommended) or Password
```

## Step 4: Connect to Your Droplet
```bash
# If using SSH key:
ssh root@your_droplet_ip

# If using password:
# Use the password sent to your email
```

## Step 5: Server Setup Commands
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2 (Process Manager)
npm install -g pm2

# Install Git
apt install git -y

# Create app directory
mkdir /var/www/password-vault
cd /var/www/password-vault

# Clone your repository
git clone https://github.com/MusaMuthami1/Password-vault.git .

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
npm run build

# Set up environment variables
cd ../server
nano .env
```

## Step 6: Environment Variables (.env file)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_here
GITHUB_CLIENT_ID=Ov23li9991Hvb8GQtszI
GITHUB_CLIENT_SECRET=your_github_client_secret
EMAIL_SERVICE_ID=your_emailjs_service_id
EMAIL_TEMPLATE_ID=your_emailjs_template_id
EMAIL_PUBLIC_KEY=your_emailjs_public_key
```

## Step 7: Start the Application
```bash
# Navigate to server directory
cd /var/www/password-vault/server

# Start with PM2
pm2 start index.js --name "password-vault-api"

# Save PM2 configuration
pm2 save
pm2 startup

# Check status
pm2 status
```

## Step 8: Configure Nginx (Reverse Proxy)
```bash
# Install Nginx
apt install nginx -y

# Create site configuration
nano /etc/nginx/sites-available/password-vault
```

### Nginx Configuration:
```nginx
server {
    listen 80;
    server_name your_domain_or_ip;

    # API routes
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Serve React build files
    location / {
        root /var/www/password-vault/client/build;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
# Enable the site
ln -s /etc/nginx/sites-available/password-vault /etc/nginx/sites-enabled/

# Test configuration
nginx -t

# Restart Nginx
systemctl restart nginx

# Enable Nginx to start on boot
systemctl enable nginx
```

## Step 9: SSL Certificate (Free with Certbot)
```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get SSL certificate (replace with your domain)
certbot --nginx -d yourdomain.com

# Auto-renewal test
certbot renew --dry-run
```

## Step 10: Firewall Configuration
```bash
# Configure UFW firewall
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

Your backend will now be running at: https://yourdomain.com/api
