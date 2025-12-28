# Production-Ready Features Guide

## Overview

This document covers the production-ready features implemented in KitabQurdu, including comprehensive monitoring, notifications, real-time chat, email services, and admin panel.

## Table of Contents

1. [Monitoring & Logging](#monitoring--logging)
2. [Notification System](#notification-system)
3. [Real-Time Chat](#real-time-chat)
4. [Email Service](#email-service)
5. [Admin Panel](#admin-panel)
6. [Setup Instructions](#setup-instructions)

---

## Monitoring & Logging

### Architecture

The monitoring stack includes:
- **Grafana**: Visualization and dashboards
- **Prometheus**: Metrics collection and storage
- **Loki**: Log aggregation
- **Promtail**: Log collector

### Starting Monitoring Stack

```bash
docker-compose -f docker-compose.monitoring.yml up -d
```

### Access Points

- **Grafana**: http://localhost:3000 (admin/admin)
- **Prometheus**: http://localhost:9090
- **Loki**: http://localhost:3100

### Metrics Exposed

Spring Boot Actuator exposes metrics at `/actuator/prometheus`:
- JVM metrics (heap, threads, GC)
- HTTP request metrics
- Database connection pool metrics
- Custom application metrics

### Log Levels

Configured in `application.yml`:
```yaml
logging:
  level:
    root: INFO
    com.kitabqurdu: DEBUG
    org.springframework.security: DEBUG
    org.hibernate.SQL: DEBUG
```

### Viewing Logs in Grafana

1. Open Grafana (http://localhost:3000)
2. Navigate to Explore
3. Select "Loki" datasource
4. Query logs: `{container="kitabqurdu-backend"}`

### Custom Dashboards

Import pre-built dashboards:
- Spring Boot Dashboard (ID: 12900)
- JVM Dashboard (ID: 4701)
- PostgreSQL Dashboard (ID: 9628)

---

## Notification System

### Features

- Real-time notifications via WebSocket
- Persistent notification storage
- Mark as read functionality
- Notification types: POST_MATCH, NEW_MESSAGE, SYSTEM

### API Endpoints

**Get all notifications:**
```bash
GET /api/notifications
Authorization: Bearer <token>
```

**Get unread notifications:**
```bash
GET /api/notifications/unread
Authorization: Bearer <token>
```

**Mark notification as read:**
```bash
PUT /api/notifications/{id}/read
Authorization: Bearer <token>
```

**Mark all as read:**
```bash
PUT /api/notifications/read-all
Authorization: Bearer <token>
```

### WebSocket Integration

Notifications are pushed in real-time to connected clients:

```javascript
// Frontend WebSocket subscription
stompClient.subscribe('/user/queue/notifications', (notification) => {
  console.log('New notification:', notification);
  // Update UI
});
```

### Creating Notifications (Backend)

```java
@Autowired
private NotificationService notificationService;

// Create notification
notificationService.createNotification(
  user,
  "POST_MATCH",
  "New book matches your saved filter!"
);
```

---

## Real-Time Chat

### Features

- One-to-one messaging
- Real-time message delivery via WebSocket
- Message read status
- Conversation history
- Message persistence

### WebSocket Endpoint

Connect to: `ws://localhost:8080/ws`

### Sending Messages

**Via WebSocket:**
```javascript
stompClient.send('/app/chat.send', {}, JSON.stringify({
  recipientId: 123,
  content: 'Hello!'
}));
```

### API Endpoints

**Get conversations:**
```bash
GET /api/chat/conversations
Authorization: Bearer <token>
```

**Get conversation with user:**
```bash
GET /api/chat/messages/{userId}
Authorization: Bearer <token>
```

**Get unread messages:**
```bash
GET /api/chat/unread
Authorization: Bearer <token>
```

**Mark message as read:**
```bash
PUT /api/chat/messages/{id}/read
Authorization: Bearer <token>
```

### Receiving Messages

```javascript
// Subscribe to incoming messages
stompClient.subscribe('/user/queue/messages', (message) => {
  console.log('New message:', message);
  // Update chat UI
});
```

---

## Email Service

### Features

- Async email sending (non-blocking)
- HTML email templates
- Welcome emails
- Password reset emails
- Post notification emails

### Configuration

Set environment variables:
```bash
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833).

### Email Types

**Welcome Email:**
```java
emailService.sendWelcomeEmail(
  "user@example.com",
  "John Doe"
);
```

**Password Reset:**
```java
emailService.sendPasswordResetEmail(
  "user@example.com",
  "reset-token-123"
);
```

**Post Notification:**
```java
emailService.sendNewPostNotification(
  "user@example.com",
  "1984",
  "George Orwell"
);
```

### Custom Templates

Emails support Thymeleaf templates. Create templates in:
```
backend/src/main/resources/templates/email/
```

---

## Admin Panel

### Features

- User management (suspend/activate)
- System announcements
- User statistics
- Content moderation

### API Endpoints

All admin endpoints require `ADMIN` role.

**Get all users:**
```bash
GET /api/admin/users?page=0&size=20
Authorization: Bearer <admin-token>
```

**Suspend user:**
```bash
PUT /api/admin/users/{id}/suspend
Authorization: Bearer <admin-token>
```

**Activate user:**
```bash
PUT /api/admin/users/{id}/activate
Authorization: Bearer <admin-token>
```

**Create announcement:**
```bash
POST /api/admin/announcements
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "message": "System maintenance on Dec 30",
  "expiresAt": "2024-12-30T00:00:00"
}
```

**Get announcements:**
```bash
GET /api/admin/announcements
Authorization: Bearer <admin-token>
```

**Deactivate announcement:**
```bash
PUT /api/admin/announcements/{id}/deactivate
Authorization: Bearer <admin-token>
```

**Get system stats:**
```bash
GET /api/admin/stats
Authorization: Bearer <admin-token>
```

Response:
```json
{
  "totalUsers": 1250,
  "activeUsers": 1180
}
```

---

## Setup Instructions

### 1. Complete Setup

Start all services including monitoring:

```bash
# Start monitoring stack
docker-compose -f docker-compose.monitoring.yml up -d

# View logs
docker-compose -f docker-compose.monitoring.yml logs -f
```

### 2. Configure Email

Edit `.env`:
```bash
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### 3. Access Services

- **Application**: http://localhost:8080
- **Frontend**: http://localhost:4200
- **Grafana**: http://localhost:3000
- **Prometheus**: http://localhost:9090
- **Swagger UI**: http://localhost:8080/swagger-ui.html

### 4. Configure Grafana

1. Login to Grafana (admin/admin)
2. Change password
3. Datasources are auto-configured
4. Import dashboards from Grafana.com

### 5. Test WebSocket

```javascript
// Connect to WebSocket
const socket = new SockJS('http://localhost:8080/ws');
const stompClient = Stomp.over(socket);

stompClient.connect({
  Authorization: 'Bearer ' + token
}, (frame) => {
  console.log('Connected:', frame);
  
  // Subscribe to notifications
  stompClient.subscribe('/user/queue/notifications', (msg) => {
    console.log('Notification:', JSON.parse(msg.body));
  });
  
  // Subscribe to messages
  stompClient.subscribe('/user/queue/messages', (msg) => {
    console.log('Message:', JSON.parse(msg.body));
  });
});
```

---

## Troubleshooting

### Grafana can't connect to Prometheus

Check network connectivity:
```bash
docker exec -it kitabqurdu-grafana ping prometheus
```

### Logs not appearing in Loki

Check Promtail status:
```bash
docker logs kitabqurdu-promtail
```

### WebSocket connection fails

Ensure CORS is configured in `application.yml`:
```yaml
app:
  cors:
    allowed-origins: http://localhost:4200
```

### Emails not sending

Check mail configuration:
```bash
docker logs kitabqurdu-backend | grep mail
```

Enable debug logging:
```yaml
logging:
  level:
    org.springframework.mail: DEBUG
```

---

## Security Considerations

1. **Admin Access**: Restrict admin endpoints to trusted IPs
2. **WebSocket Auth**: Tokens validated on connection
3. **Email**: Use app-specific passwords, not account passwords
4. **Monitoring**: Restrict Grafana access in production
5. **Rate Limiting**: Consider adding for notification/chat APIs

---

## Performance Tips

1. **Database Indexing**: Indexes on chat_messages and notifications tables
2. **Caching**: Caffeine cache for frequently accessed data
3. **Async**: Email and notifications processed asynchronously
4. **WebSocket**: Uses STOMP for efficient messaging
5. **Log Rotation**: Configure in production to prevent disk fill

---

## Next Steps

1. Create custom Grafana dashboards for business metrics
2. Add image upload functionality
3. Implement saved filters with notifications
4. Add chat message attachments
5. Create email templates with Thymeleaf
6. Add SMS notifications (optional)
7. Implement push notifications (optional)

---

## Support

For issues or questions:
- Check logs in Grafana
- Review Prometheus metrics
- Contact support@kitabqurdu.az
