# KitabQurdu API Documentation

Base URL: `http://localhost:8080/api`

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Register

**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
  "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "provider": "LOCAL",
    "role": "USER"
  }
}
```

### Login

**POST** `/auth/login`

Login with username/email and password.

**Request Body:**
```json
{
  "usernameOrEmail": "johndoe",
  "password": "password123"
}
```

**Response:** Same as Register

## Posts

### Get All Posts

**GET** `/posts?page=0&size=20&sortBy=createdAt&sortDir=DESC`

Get paginated list of active posts.

**Query Parameters:**
- `page` (default: 0) - Page number
- `size` (default: 20) - Items per page
- `sortBy` (default: createdAt) - Sort field
- `sortDir` (default: DESC) - Sort direction

**Response:**
```json
{
  "content": [
    {
      "id": 1,
      "user": {...},
      "title": "Clean Code by Robert Martin",
      "description": "Great book on software craftsmanship",
      "authorName": "Robert C. Martin",
      "bookTitle": "Clean Code",
      "genre": "Technology",
      "price": 25.00,
      "condition": "VERY_GOOD",
      "city": "Baku",
      "area": "Nasimi",
      "contactPhone": "+994501234567",
      "images": [],
      "status": "ACTIVE",
      "createdAt": "2024-01-15T10:30:00",
      "updatedAt": "2024-01-15T10:30:00"
    }
  ],
  "totalElements": 100,
  "totalPages": 5,
  "size": 20,
  "number": 0
}
```

### Search Posts

**GET** `/posts/search`

Search and filter posts.

**Query Parameters:**
- `query` - Search term (searches in title, description, author, book title)
- `genre` - Filter by genre
- `city` - Filter by city
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `condition` - Book condition (NEW, LIKE_NEW, VERY_GOOD, GOOD, ACCEPTABLE)
- `page`, `size`, `sortBy`, `sortDir` - Pagination parameters

**Example:**
```
GET /posts/search?query=clean code&genre=Technology&city=Baku&minPrice=10&maxPrice=50
```

### Get Featured Posts

**GET** `/posts/featured`

Get top 10 most recent active posts.

### Get Post by ID

**GET** `/posts/{id}`

Get detailed information about a specific post.

### Create Post

**POST** `/posts` 🔒

Create a new post. Requires authentication.

**Request Body:**
```json
{
  "title": "Clean Code by Robert Martin",
  "description": "Great book on software craftsmanship. Like new condition.",
  "authorName": "Robert C. Martin",
  "bookTitle": "Clean Code",
  "genre": "Technology",
  "price": 25.00,
  "condition": "VERY_GOOD",
  "city": "Baku",
  "area": "Nasimi",
  "contactPhone": "+994501234567",
  "contactEmail": "seller@example.com",
  "images": []
}
```

### Update Post

**PUT** `/posts/{id}` 🔒

Update an existing post. Only the owner can update.

**Request Body:** Same as Create Post

### Delete Post

**DELETE** `/posts/{id}` 🔒

Archive a post. Only the owner can delete.

### Get User Posts

**GET** `/posts/user/{userId}?page=0&size=20`

Get all posts by a specific user.

## Users

### Get Current User

**GET** `/users/me` 🔒

Get the currently authenticated user's profile.

**Response:**
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+994501234567",
  "imageUrl": null,
  "provider": "LOCAL",
  "role": "USER"
}
```

### Get User by ID

**GET** `/users/{id}`

Get public profile of a user.

## Autocomplete

### Search Books

**GET** `/autocomplete/books?q=clean`

Search for book titles using Open Library API.

**Response:**
```json
[
  "Clean Code",
  "Clean Architecture",
  "The Clean Coder"
]
```

### Search Authors

**GET** `/autocomplete/authors?q=martin`

Search for author names using Open Library API.

**Response:**
```json
[
  "Robert C. Martin",
  "George R. R. Martin",
  "Martin Fowler"
]
```

## Error Responses

All endpoints may return error responses in the following format:

**Validation Error (400):**
```json
{
  "username": "Username is required",
  "email": "Email should be valid"
}
```

**Authentication Error (401):**
```json
{
  "error": "Invalid username or password"
}
```

**Not Found (404):**
```json
{
  "error": "Post not found"
}
```

**Server Error (500):**
```json
{
  "error": "Internal server error"
}
```

## Rate Limiting

To prevent abuse, the API implements rate limiting. Excessive requests may result in temporary blocking.

## Monitoring

### Health Check

**GET** `/actuator/health`

Check application health status.

### Metrics

**GET** `/actuator/metrics`

Get application metrics.

### Prometheus

**GET** `/actuator/prometheus`

Get metrics in Prometheus format.
