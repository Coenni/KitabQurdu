# KitabQurdu - Second-hand Book Marketplace 📚

A comprehensive web application for buying and selling second-hand books and book-related items, built with Spring Boot and Angular.

## Features

- 🔐 **User Authentication** - Register, login with email/password or OAuth2 (Google, Facebook)
- 📖 **Post Management** - Create, edit, and browse book listings
- 🔍 **Advanced Search** - Filter by title, author, genre, location, price, and condition
- 🌍 **Multi-language Support** - Available in Azerbaijani, English, and Russian
- 🔔 **Notifications** - Get notified about matching posts based on saved filters
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 💾 **Caching** - Optimized performance with intelligent caching
- 📊 **Monitoring** - Built-in health checks and metrics

## Technology Stack

### Backend
- **Spring Boot 3.2.1** - Modern Java framework
- **PostgreSQL** - Reliable relational database
- **Spring Security** - JWT authentication + OAuth2
- **Spring Data JPA** - Data persistence
- **Caffeine Cache** - High-performance caching
- **Open Library API** - Book and author autocomplete

### Frontend
- **Angular 17+** - Modern web framework
- **Bootstrap 5** - Responsive UI framework
- **Angular Material** - Material Design components
- **ngx-translate** - Internationalization support

### DevOps
- **Docker & Docker Compose** - Containerization
- **Spring Boot Actuator** - Monitoring and health checks
- **Nginx** - Reverse proxy and static file serving

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Coenni/KitabQurdu.git
cd KitabQurdu
```

2. **Create environment file**
```bash
cp .env.example .env
```

3. **Edit `.env` file** with your configuration:
   - Update `JWT_SECRET` with a strong secret key (at least 256 bits)
   - Add OAuth2 credentials for Google and Facebook (optional)
   - Configure email settings for notifications (optional)

4. **Start the application**
```bash
docker-compose up -d
```

5. **Access the application**
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:8080/api
   - API Health Check: http://localhost:8080/actuator/health

## Development Setup

### Backend Development

1. **Prerequisites**
   - Java 17 or higher
   - Maven 3.6+
   - PostgreSQL 16

2. **Setup Database**
```bash
createdb kitabqurdu
```

3. **Run Backend**
```bash
cd backend
mvn spring-boot:run
```

### Frontend Development

1. **Prerequisites**
   - Node.js 20+
   - npm 10+

2. **Install Dependencies**
```bash
cd frontend
npm install
```

3. **Run Frontend**
```bash
npm start
```

The frontend will be available at http://localhost:4200

## Environment Variables

See `.env.example` for all available configuration options:

- **Database**: Connection settings for PostgreSQL
- **JWT**: Secret key and token expiration times
- **OAuth2**: Client IDs and secrets for social login
- **Email**: SMTP configuration for notifications
- **CORS**: Allowed origins for API access

## API Documentation

### Authentication Endpoints

```
POST /api/auth/register  - Register new user
POST /api/auth/login     - Login with credentials
GET  /api/auth/oauth2/{provider} - OAuth2 login
```

### Post Endpoints

```
GET    /api/posts           - Get all posts (paginated)
GET    /api/posts/search    - Search posts with filters
GET    /api/posts/featured  - Get featured posts
GET    /api/posts/{id}      - Get post by ID
POST   /api/posts           - Create new post (auth required)
PUT    /api/posts/{id}      - Update post (auth required)
DELETE /api/posts/{id}      - Delete post (auth required)
```

### User Endpoints

```
GET /api/users/me      - Get current user profile (auth required)
GET /api/users/{id}    - Get user by ID
```

### Autocomplete Endpoints

```
GET /api/autocomplete/books?q={query}    - Search books
GET /api/autocomplete/authors?q={query}  - Search authors
```

## Project Structure

```
KitabQurdu/
├── backend/                    # Spring Boot application
│   ├── src/main/java/
│   │   └── com/kitabqurdu/
│   │       ├── config/         # Configuration classes
│   │       ├── controller/     # REST controllers
│   │       ├── service/        # Business logic
│   │       ├── repository/     # Data access
│   │       ├── model/          # JPA entities
│   │       ├── dto/            # Data transfer objects
│   │       ├── security/       # Security components
│   │       ├── integration/    # External API integrations
│   │       └── notification/   # Notification services
│   ├── src/main/resources/
│   │   ├── application.yml     # Main configuration
│   │   ├── application-dev.yml # Development config
│   │   └── application-prod.yml # Production config
│   └── Dockerfile
│
├── frontend/                   # Angular application
│   ├── src/app/
│   │   ├── core/              # Core services & guards
│   │   ├── shared/            # Shared components
│   │   ├── features/          # Feature modules
│   │   │   ├── auth/
│   │   │   ├── posts/
│   │   │   └── profile/
│   │   └── layouts/           # Layout components
│   ├── src/assets/i18n/       # Translation files
│   ├── Dockerfile
│   └── nginx.conf
│
├── docker-compose.yml          # Docker orchestration
├── .env.example               # Environment template
└── README.md
```

## Features in Detail

### User Authentication
- Local registration with email verification
- Social login via Google and Facebook OAuth2
- JWT-based stateless authentication
- Secure password hashing with BCrypt

### Post Management
- Create listings with:
  - Title and description
  - Author name (with autocomplete)
  - Book title (with autocomplete)
  - Genre/Domain
  - Price and condition
  - Location (city/area)
  - Multiple images
  - Contact information
- Edit and delete your own posts
- Mark posts as sold or archived

### Search & Filtering
- Full-text search across title, description, author, and book title
- Filter by:
  - Genre/Domain
  - City/Area
  - Price range
  - Condition
- Sort by newest, price, etc.
- Pagination support

### Internationalization
The application supports three languages:
- 🇦🇿 Azerbaijani (az)
- 🇬🇧 English (en)
- 🇷🇺 Russian (ru)

Switch languages using the dropdown in the navigation bar.

### Autocomplete Integration
- Integrated with Open Library API
- Autocomplete suggestions for book titles
- Autocomplete suggestions for author names
- Cached results for better performance
- Fallback to local database if API unavailable

## Monitoring & Health

Access monitoring endpoints:

- **Health**: `/actuator/health` - Application health status
- **Info**: `/actuator/info` - Application information
- **Metrics**: `/actuator/metrics` - Application metrics
- **Prometheus**: `/actuator/prometheus` - Prometheus metrics

## Security

- HTTPS enforced in production
- CSRF protection enabled
- XSS prevention
- SQL injection prevention with parameterized queries
- Rate limiting
- Input validation
- Secure password hashing (BCrypt)
- JWT token expiration and refresh
- OAuth2 secure flow

## Performance

- Database indexing on frequently queried fields
- Lazy loading for images
- Pagination for large datasets
- API response compression
- Database connection pooling
- Async processing for notifications
- Caffeine cache for autocomplete and frequently accessed data

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.

## Author

Built with ❤️ for book lovers in Azerbaijan