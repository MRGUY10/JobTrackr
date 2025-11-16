# Deploy JobTrackr to Azure VM

## Prerequisites
- Azure account with active subscription
- Docker Hub account (or Azure Container Registry)

## Step 1: Push Images to Docker Hub

### 1.1 Login to Docker Hub
```powershell
docker login
```

### 1.2 Tag Your Images
```powershell
# Replace 'yourusername' with your Docker Hub username
docker tag jobtrackr-backend:latest yourusername/jobtrackr-backend:latest
docker tag jobtrackr-frontend:latest yourusername/jobtrackr-frontend:latest
```

### 1.3 Push Images to Docker Hub
```powershell
docker push yourusername/jobtrackr-backend:latest
docker push yourusername/jobtrackr-frontend:latest
```

## Step 2: Create Azure VM

### 2.1 Create VM via Azure Portal
1. Go to Azure Portal (https://portal.azure.com)
2. Click "Create a resource" → "Virtual Machine"
3. Configure:
   - **OS**: Ubuntu 22.04 LTS
   - **Size**: Standard B2s (2 vCPUs, 4 GB RAM) - minimum
   - **Authentication**: SSH public key
   - **Inbound ports**: 22 (SSH), 80 (HTTP), 443 (HTTPS), 5173, 8080, 8081
4. Click "Review + Create"

### 2.2 Create VM via Azure CLI
```bash
# Login to Azure
az login

# Create resource group
az group create --name JobTrackr-RG --location eastus

# Create VM
az vm create \
  --resource-group JobTrackr-RG \
  --name JobTrackr-VM \
  --image Ubuntu2204 \
  --size Standard_B2s \
  --admin-username azureuser \
  --generate-ssh-keys \
  --public-ip-sku Standard

# Open required ports
az vm open-port --port 80 --resource-group JobTrackr-RG --name JobTrackr-VM --priority 1001
az vm open-port --port 443 --resource-group JobTrackr-RG --name JobTrackr-VM --priority 1002
az vm open-port --port 5173 --resource-group JobTrackr-RG --name JobTrackr-VM --priority 1003
az vm open-port --port 8080 --resource-group JobTrackr-RG --name JobTrackr-VM --priority 1004
az vm open-port --port 8081 --resource-group JobTrackr-RG --name JobTrackr-VM --priority 1005

# Get VM public IP
az vm show -d --resource-group JobTrackr-RG --name JobTrackr-VM --query publicIps -o tsv
```

## Step 3: Connect to Azure VM

```powershell
# SSH to your VM (replace with your VM's public IP)
ssh azureuser@<YOUR_VM_PUBLIC_IP>
```

## Step 4: Install Docker on Azure VM

```bash
# Update package list
sudo apt update

# Install Docker dependencies
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker $USER

# Verify installation
docker --version
docker-compose --version

# Logout and login again for group changes to take effect
exit
```

## Step 5: Deploy Application on Azure VM

### 5.1 Create Project Directory
```bash
# SSH back to VM
ssh azureuser@<YOUR_VM_PUBLIC_IP>

# Create project directory
mkdir -p ~/jobtrackr
cd ~/jobtrackr
```

### 5.2 Create docker-compose.yml for Azure

```bash
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: jobtrackr-mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: your_secure_root_password
      MYSQL_DATABASE: jobtrackr
      MYSQL_USER: jobtrackr_user
      MYSQL_PASSWORD: your_secure_password
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"
    networks:
      - jobtrackr-network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      timeout: 20s
      retries: 10

  phpmyadmin:
    image: phpmyadmin:latest
    container_name: jobtrackr-phpmyadmin
    restart: always
    environment:
      PMA_HOST: mysql
      PMA_PORT: 3306
      PMA_USER: jobtrackr_user
      PMA_PASSWORD: your_secure_password
    ports:
      - "8081:80"
    networks:
      - jobtrackr-network
    depends_on:
      - mysql

  backend:
    image: yourusername/jobtrackr-backend:latest
    container_name: jobtrackr-backend
    restart: always
    ports:
      - "8080:8080"
    environment:
      DB_HOST: mysql
      DB_PORT: 3306
      DB_DATABASE: jobtrackr
      DB_USERNAME: jobtrackr_user
      DB_PASSWORD: your_secure_password
    networks:
      - jobtrackr-network
    depends_on:
      mysql:
        condition: service_healthy
    volumes:
      - backend_storage:/var/www/html/storage

  frontend:
    image: yourusername/jobtrackr-frontend:latest
    container_name: jobtrackr-frontend
    restart: always
    ports:
      - "5173:80"
    networks:
      - jobtrackr-network
    depends_on:
      - backend

volumes:
  mysql_data:
  backend_storage:

networks:
  jobtrackr-network:
    driver: bridge
EOF
```

**Important**: Replace:
- `yourusername` with your Docker Hub username
- `your_secure_root_password` with a strong password
- `your_secure_password` with a strong password

### 5.3 Update Frontend API URL for Azure

If you want to use the VM's public IP:

```bash
# Get your VM's public IP
VM_IP=$(curl -s ifconfig.me)
echo "Your VM IP: $VM_IP"

# You'll need to rebuild the frontend image with this IP
# Or use a domain name if you have one
```

### 5.4 Start the Application

```bash
# Pull images from Docker Hub
docker-compose pull

# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f
```

## Step 6: Access Your Application

Once deployed, access your application at:
- **Frontend**: `http://<YOUR_VM_PUBLIC_IP>:5173`
- **Backend API**: `http://<YOUR_VM_PUBLIC_IP>:8080/api`
- **phpMyAdmin**: `http://<YOUR_VM_PUBLIC_IP>:8081`

## Step 7: Setup Domain Name (Optional)

### 7.1 Configure Azure DNS or Use Your Domain

1. Go to Azure Portal → Your VM → Networking → Public IP address
2. Click on your public IP → Configuration
3. Set DNS name label (e.g., `jobtrackr`)
4. Your domain will be: `jobtrackr.region.cloudapp.azure.com`

### 7.2 Update Frontend with Domain

You'll need to rebuild your frontend image with the domain:

```bash
# On your local machine
cd E:\Project\JobTrackr

# Update Dockerfile.frontend to use domain
# ENV VITE_API_BASE_URL=http://jobtrackr.eastus.cloudapp.azure.com:8080/api

# Rebuild and push
docker build -f Dockerfile.frontend -t yourusername/jobtrackr-frontend:latest .
docker push yourusername/jobtrackr-frontend:latest

# On Azure VM, pull the updated image
docker-compose pull frontend
docker-compose up -d frontend
```

## Step 8: Setup SSL/HTTPS with Nginx (Optional but Recommended)

### 8.1 Install Nginx Reverse Proxy

```bash
sudo apt install -y nginx certbot python3-certbot-nginx

# Configure Nginx as reverse proxy
sudo nano /etc/nginx/sites-available/jobtrackr

# Add this configuration:
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/jobtrackr /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d your-domain.com
```

## Step 9: Monitoring and Maintenance

### View Logs
```bash
docker-compose logs -f
docker-compose logs backend
docker-compose logs frontend
```

### Restart Services
```bash
docker-compose restart
docker-compose restart backend
docker-compose restart frontend
```

### Update Application
```bash
# Pull latest images
docker-compose pull

# Restart with new images
docker-compose down
docker-compose up -d
```

### Backup Database
```bash
# Backup
docker exec jobtrackr-mysql mysqldump -u jobtrackr_user -pyour_secure_password jobtrackr > backup.sql

# Restore
docker exec -i jobtrackr-mysql mysql -u jobtrackr_user -pyour_secure_password jobtrackr < backup.sql
```

## Cost Estimate

**Standard B2s VM** (2 vCPUs, 4 GB RAM):
- **Pay-as-you-go**: ~$60/month
- **Reserved (1 year)**: ~$35/month
- **Reserved (3 years)**: ~$20/month

**Additional Costs**:
- Storage: ~$5/month for 128 GB SSD
- Network: First 100 GB free, then ~$0.087/GB
- Public IP: ~$3.50/month

**Total**: ~$40-70/month depending on usage

## Troubleshooting

### Port Issues
```bash
# Check if ports are open
sudo netstat -tuln | grep -E '5173|8080|8081|3306'

# Check firewall
sudo ufw status
sudo ufw allow 5173
sudo ufw allow 8080
sudo ufw allow 8081
```

### Container Issues
```bash
# Check container status
docker ps -a

# Check container logs
docker logs jobtrackr-backend
docker logs jobtrackr-frontend

# Restart specific container
docker restart jobtrackr-backend
```

### Database Connection Issues
```bash
# Test MySQL connection
docker exec -it jobtrackr-mysql mysql -u jobtrackr_user -p

# Check MySQL logs
docker logs jobtrackr-mysql
```

## Security Recommendations

1. **Change default passwords** in docker-compose.yml
2. **Setup firewall** to restrict access
3. **Enable SSL/HTTPS** with Let's Encrypt
4. **Regular backups** of the database
5. **Keep Docker images updated**
6. **Use Azure Key Vault** for secrets
7. **Setup monitoring** with Azure Monitor

## Next Steps

1. Push your images to Docker Hub
2. Create Azure VM
3. Install Docker on VM
4. Deploy with docker-compose
5. Configure domain and SSL
6. Setup automated backups
7. Configure monitoring
