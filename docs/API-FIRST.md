# API-First Development Guide

## Overview

KitabQurdu uses an API-first approach with OpenAPI 3.0 specification to ensure consistency between frontend and backend.

## OpenAPI Specification

The API specification is located at `api-spec/openapi.yaml`. This file defines:
- All API endpoints
- Request/response schemas
- Authentication requirements
- Server configurations for local, stage, and prod environments

## Code Generation

### Backend (Spring Boot)

The backend uses `openapi-generator-maven-plugin` to generate:
- API interface definitions
- Model classes (DTOs)

**Generate backend code:**
```bash
cd backend
mvn clean compile
```

Generated code location: `backend/target/generated-sources/openapi/`

Controllers implement the generated interfaces:
```java
@RestController
public class AuthControllerImpl implements AuthenticationApi {
    @Override
    public ResponseEntity<AuthResponse> register(RegisterRequest request) {
        // Implementation
    }
}
```

### Frontend (Angular)

The frontend uses `@openapitools/openapi-generator-cli` to generate:
- TypeScript service classes
- Model interfaces

**Generate frontend code:**
```bash
cd frontend
npm run generate:api
```

Generated code location: `frontend/src/app/generated/`

## State Management with Signals

The frontend uses Angular signals for reactive state management:

```typescript
import { StateService } from './core/services/state.service';

@Component({...})
export class MyComponent {
  constructor(private state: StateService) {}
  
  // Access computed values
  posts = this.state.posts;
  isAuthenticated = this.state.isAuthenticated;
  
  // Update state
  addPost(post: Post) {
    this.state.addPost(post);
  }
}
```

### State Service Features

- **Signals**: Reactive state updates
- **Computed values**: Derived state (isAuthenticated, postsCount)
- **Type-safe**: Full TypeScript support
- **Immutable updates**: State changes through actions only

## Environments

### Local Development
- Backend: `http://localhost:8080/api`
- Frontend: `http://localhost:4200`
- Profile: `dev`

### Staging
- Backend: `https://stage-api.kitabqurdu.az/api`
- Frontend: `https://stage.kitabqurdu.az`
- Profile: `stage`
- Docker: `docker-compose.stage.yml`

### Production
- Backend: `https://api.kitabqurdu.az/api`
- Frontend: `https://kitabqurdu.az`
- Profile: `prod`
- Docker: `docker-compose.prod.yml`

## GitHub Actions Deployment

The project includes automated deployment to VPS via GitHub Actions.

### Required Secrets

Configure these secrets in your GitHub repository:
- `VPS_HOST`: Your VPS hostname or IP
- `VPS_USERNAME`: SSH username
- `VPS_SSH_KEY`: Private SSH key for authentication

### Deployment Flow

1. **Push to branch**:
   - `main` → Production deployment
   - `stage` → Staging deployment

2. **GitHub Actions**:
   - Builds Docker images
   - Pushes to GitHub Container Registry
   - SSHs to VPS
   - Pulls latest images
   - Restarts services with docker-compose

3. **Verification**:
   - Checks service status
   - Validates health endpoints

### Manual Deployment

Trigger deployment manually:
```bash
# Via GitHub UI: Actions → Deploy to VPS → Run workflow

# Or using gh CLI
gh workflow run deploy.yml --ref main
```

## VPS Setup

### Initial Setup

On your VPS, create directory structure:
```bash
# For production
sudo mkdir -p /opt/kitabqurdu/prod
cd /opt/kitabqurdu/prod

# Clone repo or copy docker-compose.prod.yml
curl -O https://raw.githubusercontent.com/Coenni/KitabQurdu/main/docker-compose.prod.yml
curl -O https://raw.githubusercontent.com/Coenni/KitabQurdu/main/.env.example
cp .env.example .env

# Edit .env with production values
nano .env

# For staging
sudo mkdir -p /opt/kitabqurdu/stage
# Repeat above steps with docker-compose.stage.yml
```

### Install Docker

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### Login to GitHub Container Registry

```bash
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin
```

## Development Workflow

### 1. Update OpenAPI Spec

Edit `api-spec/openapi.yaml` to add/modify endpoints.

### 2. Generate Code

**Backend:**
```bash
cd backend
mvn clean compile
```

**Frontend:**
```bash
cd frontend
npm run generate:api
```

### 3. Implement

Backend: Implement generated interfaces
Frontend: Use generated services

### 4. Test

```bash
# Backend
cd backend
mvn test

# Frontend
cd frontend
npm test
```

### 5. Deploy

Push to appropriate branch:
```bash
git push origin stage  # Staging
git push origin main   # Production
```

## API Documentation

### Interactive Docs

Swagger UI is available at:
- Local: `http://localhost:8080/swagger-ui.html`
- Stage: `https://stage-api.kitabqurdu.az/swagger-ui.html`
- Prod: `https://api.kitabqurdu.az/swagger-ui.html`

### OpenAPI JSON

Raw OpenAPI spec:
- `/v3/api-docs`
- `/v3/api-docs.yaml`

## Benefits of API-First Approach

1. **Contract-First**: API contract defined before implementation
2. **Consistency**: Frontend and backend always in sync
3. **Type Safety**: Generated types prevent errors
4. **Documentation**: Auto-generated, always up-to-date
5. **Mock APIs**: Can generate mock servers for testing
6. **Client Libraries**: Easy to generate clients for mobile apps
7. **Validation**: Request/response validation from spec

## Troubleshooting

### Backend code generation fails

```bash
# Clean and rebuild
cd backend
mvn clean
mvn compile
```

### Frontend code generation fails

```bash
# Ensure OpenAPI CLI is installed
cd frontend
npm install
npm run generate:api
```

### State not updating

Check if you're calling state actions:
```typescript
// ❌ Wrong
this.state.posts().push(newPost);

// ✅ Correct
this.state.addPost(newPost);
```

## Best Practices

1. **Always update OpenAPI spec first** before coding
2. **Regenerate code** after spec changes
3. **Use signals** for all state management
4. **Test with multiple environments** (local, stage, prod)
5. **Version your API** when making breaking changes
6. **Document changes** in OpenAPI descriptions
7. **Use feature branches** for development
8. **Test deployment** on staging before production

## Resources

- [OpenAPI Specification](https://swagger.io/specification/)
- [OpenAPI Generator](https://openapi-generator.tech/)
- [Angular Signals](https://angular.io/guide/signals)
- [Docker Compose](https://docs.docker.com/compose/)
- [GitHub Actions](https://docs.github.com/en/actions)
