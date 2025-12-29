# Development Setup Guide

This guide will help you set up the KitabQurdu development environment on your local machine.

## Prerequisites

### Required Software
- **Java 17** or higher ([Download](https://adoptium.net/))
- **Node.js 20** or higher ([Download](https://nodejs.org/))
- **PostgreSQL 16** ([Download](https://www.postgresql.org/download/))
- **Maven 3.6+** ([Download](https://maven.apache.org/download.cgi))
- **Git** ([Download](https://git-scm.com/downloads))

### Optional but Recommended
- **Docker & Docker Compose** ([Download](https://www.docker.com/products/docker-desktop))
- **IntelliJ IDEA** or **VS Code** for development

## Backend Setup

### 1. Database Setup

Create a PostgreSQL database:

```bash
# Log into PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE kitabqurdu;
CREATE USER kitabqurdu WITH PASSWORD 'kitabqurdu';
GRANT ALL PRIVILEGES ON DATABASE kitabqurdu TO kitabqurdu;
\q
```

### 2. Configure Environment

Create a `.env` file in the project root (or set environment variables):

```bash
cp .env.example .env
```

Edit `.env` and update:
- `DB_PASSWORD` - Your PostgreSQL password
- `JWT_SECRET` - Generate a strong secret (at least 256 bits)

### 3. Run Backend

```bash
cd backend
mvn spring-boot:run
```

The backend will start at `http://localhost:8080`

### 4. Verify Backend

Check the health endpoint:
```bash
curl http://localhost:8080/actuator/health
```

Expected response:
```json
{
  "status": "UP"
}
```

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Run Frontend

```bash
npm start
```

The frontend will start at `http://localhost:4200` and automatically open in your browser.

### 3. Build for Production

```bash
npm run build
```

Built files will be in `frontend/dist/`.

## Running with Docker

### 1. Start All Services

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- Backend API on port 8080
- Frontend on port 4200

### 2. View Logs

```bash
docker-compose logs -f
```

### 3. Stop Services

```bash
docker-compose down
```

### 4. Rebuild Services

```bash
docker-compose up -d --build
```

## OAuth2 Setup (Optional)

### Google OAuth2

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Add authorized redirect URI: `http://localhost:8080/api/auth/oauth2/callback/google`
6. Copy Client ID and Client Secret to `.env`:
   ```
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

### Facebook OAuth2

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Configure OAuth redirect URI: `http://localhost:8080/api/auth/oauth2/callback/facebook`
5. Copy App ID and App Secret to `.env`:
   ```
   FACEBOOK_CLIENT_ID=your-app-id
   FACEBOOK_CLIENT_SECRET=your-app-secret
   ```

## Email Configuration (Optional)

For email notifications, configure SMTP in `.env`:

```
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

**Note**: For Gmail, you need to generate an [App Password](https://support.google.com/accounts/answer/185833).

## Development Workflow

### Backend Development

1. Make changes to Java code
2. Maven will auto-reload if using `spring-boot-devtools`
3. Or restart: `mvn spring-boot:run`

### Frontend Development

1. Make changes to TypeScript/HTML/CSS
2. Angular CLI will auto-reload
3. Changes appear instantly in browser

### Database Migrations

The application uses Hibernate's `ddl-auto: update` mode in development, which automatically creates/updates tables based on entity definitions.

For production, set `ddl-auto: validate` and use a migration tool like Flyway.

## Testing

### Backend Tests

```bash
cd backend
mvn test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Troubleshooting

### Port Already in Use

If ports 8080 or 4200 are in use:

**Backend:**
```bash
# Change in backend/src/main/resources/application.yml
server:
  port: 8081
```

**Frontend:**
```bash
# Run with custom port
ng serve --port 4201
```

### Database Connection Error

1. Check PostgreSQL is running:
   ```bash
   sudo service postgresql status
   ```

2. Verify credentials in `.env` match your PostgreSQL setup

3. Check database exists:
   ```bash
   psql -U postgres -l
   ```

### Maven Build Fails

Clear Maven cache:
```bash
rm -rf ~/.m2/repository
mvn clean install
```

### npm Install Fails

Clear npm cache:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## IDE Setup

### IntelliJ IDEA

1. Open `backend` folder as a Maven project
2. Set JDK to 17
3. Enable annotation processing for Lombok
4. Install Lombok plugin

### VS Code

1. Install extensions:
   - Java Extension Pack
   - Spring Boot Extension Pack
   - Angular Language Service
2. Open workspace with both `backend` and `frontend` folders

## Next Steps

- Read [API Documentation](API.md)
- Explore the codebase
- Check out open issues on GitHub
- Join our community discussions

## Getting Help

- **Issues**: [GitHub Issues](https://github.com/Coenni/KitabQurdu/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Coenni/KitabQurdu/discussions)
