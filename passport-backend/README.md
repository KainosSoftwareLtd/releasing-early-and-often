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

### Database Migrations

This project uses [Flyway](https://flywaydb.org/) for database schema migrations. Migrations run automatically on application startup.

#### Migration Files

Migration scripts are located in `src/main/resources/db/migration/` and follow the naming convention:

```
V{version}__{description}.sql
```

For example: `V1__create_passport_applications_table.sql`

#### Adding a New Migration

1. Create a new SQL file in `src/main/resources/db/migration/`
2. Name it with the next version number (e.g., `V2__add_new_column.sql`)
3. Write your SQL migration script using PostgreSQL-compatible syntax
4. Restart the application - the migration will run automatically

#### Important Notes

- Migrations are versioned and run in order
- Once applied, migration files should **never** be modified
- The H2 database runs in PostgreSQL compatibility mode, so use PostgreSQL-compatible SQL
- Migration history is tracked in the `flyway_schema_history` table

### Unit Tests

The project includes comprehensive unit and integration tests using JUnit 5, Mockito, and AssertJ.

#### Running Tests

```bash
mvn test
```

#### Test Structure

| Test Class | Description |
|------------|-------------|
| `PassportApplicationServiceTest` | Unit tests for service layer logic |
| `PassportApplicationControllerTest` | Unit tests for controller response handling |
| `ApplicationMapperTest` | Unit tests for DTO mapping |
| `PassportApplicationIntegrationTest` | Integration tests with full Spring context and database |

#### Test Coverage

- **Service Layer**: Application creation, status setting, timestamp handling
- **Controller Layer**: HTTP response codes, error handling, request validation
- **Mapper**: Request-to-entity and entity-to-response transformations
- **Integration**: End-to-end flow with database persistence

### Manual Testing

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