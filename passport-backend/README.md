# Passport Backend Service

A Spring Boot REST API for the UK Passport Application system.

## Getting Started

### Prerequisites
- Java 21 or later
- Maven 3.6 or later

### Running the Application

1. Navigate to the project directory:
   ```bash
   cd passport-backend
   ```

2. Run the application:
   ```bash
   mvn spring-boot:run
   ```

3. The API will be available at: `http://localhost:8080`

### API Documentation

- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`

### API Endpoints

#### Create New Application
- **POST** `/api/applications`
- **Description**: Creates a new passport application and returns an application ID
- **Response**:
  ```json
  {
    "applicationId": "uuid-string",
    "status": "IN_PROGRESS",
    "createdAt": "2026-01-15T10:30:00"
  }
  ```

### Database

The application uses an in-memory H2 database for development.
- **H2 Console**: `http://localhost:8080/h2-console`
- **JDBC URL**: `jdbc:h2:mem:passport_applications;MODE=PostgreSQL`
- **Username**: `sa`
- **Password**: `password`

### Testing

You can test the API using curl:

```bash
curl -X POST http://localhost:8080/api/applications \
  -H "Content-Type: application/json" \
  -H "X-API-Version: 1.0" \
  -d '{
    "dateOfBirth": "1990-05-15",
    "previousPassport": "yes",
    "addressLine1": "123 Main Street",
    "addressLine2": "Apt 4B",
    "townCity": "London",
    "postcode": "SW1A 1AA"
  }' \
  -v
```