# UK Passport Application Training Module

A simple Express.js web application simulating a UK adult passport application. This project is designed to teach developers about progressive delivery concepts.

## Purpose

This training module demonstrates:
- A basic GOV.UK-style application flow
- Session-based form handling
- Server-side validation
- Progressive delivery foundation (feature flags configuration included for future use)

The application handles adult passport applications only (age 16+).

## Technology Stack

- **Node.js** with Express framework
- **Nunjucks** for server-side rendering
- **GOV.UK Frontend** for styling and components
- **express-session** for session storage (no database required)
- **Jest** for unit testing

## Project Structure

```
release-early-web-app/
├── config.json               # Configuration including feature flags
├── src/
│   ├── app.js               # Express application setup
│   ├── routes/              # Route definitions
│   ├── controllers/         # Request handlers
│   ├── services/            # Business logic (validation)
│   ├── views/               # Nunjucks templates
│   │   ├── layout.njk       # Base layout with GOV.UK Frontend
│   │   ├── template.njk     # Page template
│   │   └── pages/           # Individual page templates
│   └── __tests__/           # Unit tests
├── package.json
└── README.md
```

## User Journey

The application implements the following pages:

1. **Date of Birth** - GOV.UK date input with age validation (16+)
2. **Previous UK Passport** - Yes/No radio buttons
3. **Address Details** - Address form with validation
4. **Check Your Answers** - Summary page with change links
5. **Application Complete** - Confirmation screen

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

The `config.json` file contains feature flags for future progressive delivery exercises:

```json
{
  "featureFlags": {
    "enabledChildRenewals": false
  }
}
```

**Note:** Feature flag functionality is not yet implemented - the configuration is included for future training modules.

## Development Notes

- Controllers are separated from routes for testability
- Validation logic is in the services layer
- All user data is stored in express-session (memory)
- No database is required
- GOV.UK Frontend components are used throughout

## Testing Coverage

Unit tests include:
- Validation service (date of birth, previous passport, address)
- Controller logic (all form handlers)
- Edge cases and error handling

## Future Enhancements

This is a training module. Future iterations will cover:
- Feature flag implementation
- A/B testing scenarios
- Progressive rollout strategies
- Canary deployments

## License

MIT
