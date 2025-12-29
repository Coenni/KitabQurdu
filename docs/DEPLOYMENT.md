# Deployment Guide

This guide covers deploying KitabQurdu to production environments.

## Pre-Deployment Checklist

- [ ] Update all environment variables in `.env` for production
- [ ] Generate strong JWT secret (at least 256 bits)
- [ ] Configure OAuth2 credentials for production URLs
- [ ] Set up production database
- [ ] Configure email service
- [ ] Set up SSL/TLS certificates
- [ ] Configure domain and DNS
- [ ] Review security settings

## Production Environment Variables

Create a production `.env` file:

```bash
# Database
DB_HOST=your-db-host
DB_NAME=kitabqurdu_prod
DB_USERNAME=kitabqurdu_prod
DB_PASSWORD=<strong-password>

# JWT - MUST BE CHANGED!
JWT_SECRET=<generate-strong-256-bit-secret>

# OAuth2 Production
GOOGLE_CLIENT_ID=<your-production-google-client-id>
GOOGLE_CLIENT_SECRET=<your-production-google-secret>
FACEBOOK_CLIENT_ID=<your-production-facebook-client-id>
FACEBOOK_CLIENT_SECRET=<your-production-facebook-secret>

# Email
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=<your-email>
MAIL_PASSWORD=<app-password>

# URLs
ALLOWED_ORIGINS=https://yourdomain.com
APP_BASE_URL=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com

# Spring Profile
SPRING_PROFILE=prod
```

## Docker Deployment

### 1. Build and Deploy with Docker Compose

```bash
# Pull latest code
git pull origin main

# Build and start services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### 2. Production Docker Compose

For production, create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    networks:
      - kitabqurdu-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    restart: always
    environment:
      SPRING_PROFILE: prod
      DB_HOST: postgres
      # ... other env vars from .env
    depends_on:
      - postgres
    networks:
      - kitabqurdu-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    restart: always
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
    networks:
      - kitabqurdu-network
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro

networks:
  kitabqurdu-network:
    driver: bridge

volumes:
  postgres_data:
```

Deploy:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Cloud Deployment

### AWS Deployment

#### Option 1: EC2 with Docker

1. **Launch EC2 Instance**
   - Ubuntu 22.04 LTS
   - t3.medium or larger
   - Configure security groups (ports 80, 443, 22)

2. **Install Docker**
   ```bash
   sudo apt update
   sudo apt install docker.io docker-compose -y
   sudo usermod -aG docker $USER
   ```

3. **Deploy Application**
   ```bash
   git clone https://github.com/Coenni/KitabQurdu.git
   cd KitabQurdu
   cp .env.example .env
   # Edit .env with production values
   docker-compose -f docker-compose.prod.yml up -d
   ```

4. **Set up Nginx Reverse Proxy**
   ```bash
   sudo apt install nginx certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

#### Option 2: AWS ECS (Elastic Container Service)

1. Push images to ECR
2. Create ECS cluster
3. Define task definitions
4. Create services
5. Configure load balancer
6. Set up RDS for PostgreSQL

### Heroku Deployment

1. **Create Heroku Apps**
   ```bash
   heroku create kitabqurdu-api
   heroku create kitabqurdu-web
   ```

2. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:standard-0 -a kitabqurdu-api
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set JWT_SECRET=your-secret -a kitabqurdu-api
   # Set other env vars
   ```

4. **Deploy**
   ```bash
   # Backend
   git subtree push --prefix backend heroku main
   
   # Frontend
   git subtree push --prefix frontend heroku main
   ```

### DigitalOcean Deployment

1. **Create Droplet**
   - Ubuntu 22.04
   - 2 GB RAM minimum
   - Enable backups

2. **Install Docker**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   ```

3. **Deploy with Docker Compose**
   ```bash
   git clone https://github.com/Coenni/KitabQurdu.git
   cd KitabQurdu
   # Configure .env
   docker-compose -f docker-compose.prod.yml up -d
   ```

4. **Configure Firewall**
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

## SSL/TLS Configuration

### Using Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Nginx Configuration with SSL

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://frontend:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Database Backup

### Automated Backups

Create `backup.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
CONTAINER_NAME="kitabqurdu-postgres"

docker exec $CONTAINER_NAME pg_dump -U kitabqurdu kitabqurdu > $BACKUP_DIR/backup_$DATE.sql

# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.sql" -mtime +30 -delete
```

Add to crontab:
```bash
0 2 * * * /path/to/backup.sh
```

## Monitoring

### Application Monitoring

Access monitoring endpoints (secured in production):
- Health: `https://api.yourdomain.com/actuator/health`
- Metrics: `https://api.yourdomain.com/actuator/metrics`
- Prometheus: `https://api.yourdomain.com/actuator/prometheus`

### Set up Monitoring Stack

Use Prometheus + Grafana:

```yaml
# Add to docker-compose.prod.yml
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
```

## Scaling

### Horizontal Scaling

Update docker-compose for multiple instances:

```yaml
backend:
  deploy:
    replicas: 3
  # ... other config
```

### Load Balancing

Use Nginx as load balancer:

```nginx
upstream backend {
    server backend1:8080;
    server backend2:8080;
    server backend3:8080;
}

server {
    location /api {
        proxy_pass http://backend;
    }
}
```

## Troubleshooting

### Application Won't Start

```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend

# Check container status
docker-compose ps

# Restart services
docker-compose restart
```

### Database Connection Issues

```bash
# Check database is running
docker-compose ps postgres

# Connect to database
docker exec -it kitabqurdu-postgres psql -U kitabqurdu

# Check connections
SELECT * FROM pg_stat_activity;
```

### High Memory Usage

```bash
# Check resource usage
docker stats

# Limit resources in docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 1G
```

## Security Hardening

1. **Change Default Passwords**: Update all default passwords
2. **Enable Firewall**: Use UFW or iptables
3. **Regular Updates**: Keep system and packages updated
4. **Disable Root Login**: Use sudo instead
5. **Set up Fail2Ban**: Prevent brute force attacks
6. **Use Strong JWT Secret**: At least 256 bits
7. **Enable HTTPS Only**: Redirect HTTP to HTTPS
8. **Database Security**: Use strong passwords, limit access
9. **Regular Backups**: Automate and test backups
10. **Monitor Logs**: Set up log aggregation

## Rollback Strategy

```bash
# Tag releases
git tag -a v1.0.0 -m "Release 1.0.0"
git push origin v1.0.0

# Rollback to previous version
git checkout v1.0.0
docker-compose -f docker-compose.prod.yml up -d --build
```

## Health Checks

Configure Docker health checks:

```yaml
backend:
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
    interval: 30s
    timeout: 10s
    retries: 3
    start_period: 40s
```

## Support

For deployment issues:
- Check documentation: `/docs`
- GitHub Issues: https://github.com/Coenni/KitabQurdu/issues
- Contact: support@kitabqurdu.az
