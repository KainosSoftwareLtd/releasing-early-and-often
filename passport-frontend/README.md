# UK Passport Application Training Module

A simple Express.js web application simulating a UK adult passport application. This project is designed to teach developers about progressive delivery concepts.

## Purpose

This training module demonstrates:
- A basic GOV.UK-style application flow
- Session-based form handling
- Server-side validation
- API integration with backend services
- Feature flags for progressive delivery
- Quick fill functionality for testing and development

The application handles adult passport applications only (age 16+).

## Technology Stack

- **Node.js** with Express framework
- **Nunjucks** for server-side rendering
- **GOV.UK Frontend** for styling and components
- **express-session** for session storage (no database required)
- **Axios** for HTTP client (backend API calls)
- **Mocha** with **Chai** and **Sinon** for unit testing

## Project Structure

```
release-early-web-app/
├── app.js                   # Express application setup
├── config/
│   └── config.json          # Configuration including feature flags
├── public/                  # Static assets
│   ├── css/                 # Custom CSS files
│   └── js/                  # Client-side JavaScript
├── src/
│   ├── routes/              # Route definitions
│   ├── controllers/         # Request handlers
│   ├── services/            # Business logic (validation)
│   ├── views/               # Nunjucks templates
│   │   ├── layout.njk       # Base layout with GOV.UK Frontend
│   │   ├── template.njk     # Page template
│   │   └── pages/           # Individual page templates
├── test/
│   └── unit/                # Mocha unit tests
│       ├── helper.js        # Test setup (Chai, Sinon)
│       └── spec.*.js        # Test files
├── package.json
└── README.md
```

## User Journey

The application implements the following pages:

1. **Date of Birth** - GOV.UK date input with age validation (16+)
2. **Previous UK Passport** - Yes/No radio buttons
3. **Address Details** - Address form with validation
4. **Check Your Answers** - Summary page with change links
5. **Application Complete** - Confirmation screen with reference number

## Quick Fill Feature

For testing and development purposes, every page includes a "Fill" button that:
- Populates all form fields with realistic dummy data
- Automatically proceeds to the next page
- Can be activated by clicking the blue "Fill" button (top right) or pressing **ESC** key

A tooltip appears on the first page explaining this functionality (auto-dismisses after 5 seconds).

## Backend Integration

The application integrates with a Spring Boot backend service to:
- Create new passport applications
- Generate unique reference numbers (UUIDs)
- Store application data persistently

### Backend Service
The companion backend service is available at: `../passport-backend/`
- **Default URL**: `http://localhost:8080/api`
- **Endpoint**: `POST /applications`
- **Documentation**: Swagger UI at `http://localhost:8080/swagger-ui.html`

## How to Run

### Installation

```bash
npm install
```

### Start the Application

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## How to Run Tests

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Configuration

The `config/config.json` file contains feature flags and backend settings:

```json
{
  "featureFlags": {
    "enabledChildRenewals": false,
    "enableBackendServiceCalls": true
  },
  "backend": {
    "apiUrl": "http://localhost:8080/api"
  }
}
```

### Feature Flags

- **`enableBackendServiceCalls`**: Controls whether the application makes real API calls to the backend
  - `true`: Makes HTTP requests to backend service, uses real UUIDs as reference numbers
  - `false`: Generates fake reference numbers locally (format: `REF-XXXXXXXXX`)
  - **Fallback**: If backend call fails, generates temporary reference number (format: `TEMP-XXXXXXXXX`)

- **`enabledChildRenewals`**: Placeholder for future functionality

### Backend Configuration

- **`apiUrl`**: Base URL for the backend REST API
- Easily configurable for different environments (development, staging, production)

## Development Notes

- Controllers are separated from routes for testability
- Validation logic is in the services layer
- All user data is stored in express-session (memory) and sent to backend API
- Backend integration uses configurable feature flags
- Quick fill functionality for rapid testing and development
- Static assets (CSS/JS) served from `public/` directory
- GOV.UK Frontend components are used throughout

## Testing Coverage

Unit tests include:
- Validation service (date of birth, previous passport, address)
- Controller logic (all form handlers)
- API integration (backend service calls)
- Feature flag functionality
- Edge cases and error handling

Tests use:
- **Mocha** as the test runner
- **Chai** for assertions
- **Sinon** for stubs and spies (including axios mocking)
- **Supertest** for HTTP testing (available but not yet used)

## Future Enhancements

This is a training module. Future iterations will cover:
- Advanced feature flag implementation
- A/B testing scenarios
- Progressive rollout strategies
- Canary deployments
- Database integration
- Enhanced API error handling
- User authentication and authorization

## License

MIT
