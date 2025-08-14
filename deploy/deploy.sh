#!/bin/bash
# Automated DigitalOcean Deployment Script
# Run this script on your DigitalOcean droplet

set -e  # Exit on any error

echo "🚀 Starting Password Vault deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run as root (use sudo)"
    exit 1
fi

print_status "Updating system packages..."
apt update && apt upgrade -y

print_status "Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

print_status "Installing required packages..."
apt install git nginx ufw certbot python3-certbot-nginx -y
npm install -g pm2

print_status "Creating application directory..."
mkdir -p /var/www/password-vault
cd /var/www/password-vault

print_status "Cloning repository..."
if [ -d ".git" ]; then
    print_warning "Repository already exists, pulling latest changes..."
    git pull origin main
else
    git clone https://github.com/MusaMuthami1/Password-vault.git .
fi

print_status "Installing server dependencies..."
cd server
npm install --production

print_status "Installing client dependencies and building..."
cd ../client
npm install
npm run build

print_status "Setting up environment file..."
cd ../server
if [ ! -f .env ]; then
    cat > .env << EOL
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/password-vault
JWT_SECRET=$(openssl rand -base64 32)
GITHUB_CLIENT_ID=Ov23li9991Hvb8GQtszI
GITHUB_CLIENT_SECRET=your_github_client_secret_here
EMAIL_SERVICE_ID=your_emailjs_service_id
EMAIL_TEMPLATE_ID=your_emailjs_template_id
EMAIL_PUBLIC_KEY=your_emailjs_public_key
EOL
    print_warning "Environment file created. Please edit /var/www/password-vault/server/.env with your actual values!"
fi

print_status "Starting application with PM2..."
pm2 delete password-vault-api 2>/dev/null || true
pm2 start index.js --name "password-vault-api"
pm2 save
pm2 startup ubuntu -u root --hp /root

print_status "Configuring Nginx..."
cat > /etc/nginx/sites-available/password-vault << 'EOL'
server {
    listen 80;
    server_name _;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

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
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
EOL

# Enable the site
ln -sf /etc/nginx/sites-available/password-vault /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
nginx -t
systemctl restart nginx
systemctl enable nginx

print_status "Configuring firewall..."
ufw --force enable
ufw allow OpenSSH
ufw allow 'Nginx Full'

print_status "Deployment completed successfully!"
echo ""
echo "🎉 Your Password Vault is now running!"
echo ""
echo "Next steps:"
echo "1. Point your domain to this server's IP address"
echo "2. Edit /var/www/password-vault/server/.env with your actual credentials"
echo "3. Run: pm2 restart password-vault-api"
echo "4. Set up SSL: certbot --nginx -d yourdomain.com"
echo ""
echo "Server IP: $(curl -s ifconfig.me)"
echo "Application URL: http://$(curl -s ifconfig.me)"
echo ""
echo "To check application status: pm2 status"
echo "To view logs: pm2 logs password-vault-api"
echo "To restart app: pm2 restart password-vault-api"
