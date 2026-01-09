---
agent: agent
---
You are a senior Node.js engineer and technical trainer.
Design and scaffold a simple Express.js frontend web application for a training module simulating a UK Passport adult application.

Purpose

Teach developers about progressive delivery concepts in the future

Keep the app simple and clear

Focus on adult applications only (16+)

Technical Requirements

Node.js + Express

Server-side rendered views using Nunjucks

GOV.UK Frontend for styling and components

Use express-session for session storage (no database)

Configuration

Create a config.json at the project root

The JSON must contain a featureFlags object

Include one example flag:

{
  "featureFlags": {
    "enabledChildRenewals": false
  }
}


Do not implement any feature flag functionality yet—just include it in the config for future use

User Journey (Adult Passport Application)

Implement these pages:

Date of Birth

GOV.UK date input component

Validate age 16 or older

Previous UK Passport

Yes / No radio buttons

Address Details

Address line 1 (required)

Address line 2 (optional)

Town / City

Postcode

Check Your Answers

Display all entered values

Submit button

Application Complete

Confirmation screen

Architecture

Use a clear, beginner-friendly structure:

src/
  controllers/
  routes/
  services/
  views/
  public/
config.json


Controllers should be testable

Keep logic separated from routes

Unit Testing

Add unit tests for controllers, validation, and form logic

Do not add feature flag tests yet

GOV.UK Frontend

Standard GOV.UK layouts and components

Minimal styling

Git Setup

Initialise a Git repository

Include a README explaining:

Purpose of the app

How to run it

How to run tests