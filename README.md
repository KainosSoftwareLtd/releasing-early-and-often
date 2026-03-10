# Releasing Early and Often

This contains the starting base packages for the course on releasing early and often.

Included is also an optional setup and startup script, if you do not have the appropriate tools installed - namely node v24 and java 21.

Monorepo for the Passport training app, containing:

- `passport-backend` (Spring Boot API)
- `passport-frontend` (Express + Nunjucks web app)
- `passport-ui-tests` (Selenium UI tests)

## Tech

* Node v24
* Java 21

If you have working versions of these, feel free to ignore the setup scripts

## Prerequisites for setup script

* zsh: The scripts must be run in a zsh shell
* nvm - https://github.com/nvm-sh/nvm
* sdkman - https://get.sdkman.io

## Setup

Execute setup:

Make script executable
```shell
    chmod +x install.sh
```

Run setup script
```shell
    ./install.sh
```

This will use NVM & SDKman to install versions of node and java to use for this project, set them to the default and then run nvm install & maven install to get them up and running.

## Common issues
If on your project you connect to other repositories using node you might need to run the below command to clean out your cache:
```shell
    npm cache clean --force
```

If you use other tools for controlling java versions instead of SDKman you might have conflicts running maven - one such example is using jenv where you will need to run the below to use SDKman java versions through maven:
```shell
jenv disable-plugin maven
```

## Quick Start

Use the root startup script to run everything from one command.

```bash
    chmod +x startup.sh
    ./startup.sh
```

This starts:

- Backend on `http://localhost:8080`
- Frontend on `http://localhost:3000`

When run without flags, the script prompts whether to run UI tests after startup.

## Startup Script Options

```bash
    ./startup.sh --help
```

Available options:

- `--ui-tests` Run UI tests after services are up
- `--ui-tests-headless` Run UI tests in headless mode after services are up
- `--no-ui-tests` Skip UI tests and do not prompt
- `-h, --help` Show usage

Examples:

```bash
    ./startup.sh --ui-tests
    ./startup.sh --ui-tests-headless
    ./startup.sh --no-ui-tests
```

## What `startup.sh` Does

- Validates required tools (`mvn`, `npm`, `curl`)
- Verifies expected project directories exist
- Installs frontend dependencies if `node_modules` is missing
- Starts backend (`mvn spring-boot:run`) and frontend (`npm start`) in parallel
- Optionally waits for service health and runs UI tests
- Stops both services cleanly when you press `Ctrl+C`

## Prerequisites

Install these before running the script:

- Java 21+
- Maven 3.6+
- Node.js + npm
- Chrome browser (for UI tests)

## Useful URLs

- Frontend: `http://localhost:3000`
- Backend API docs (OpenAPI): `http://localhost:8080/v3/api-docs`
- Backend Swagger UI: `http://localhost:8080/swagger-ui.html`

## Run Components Manually

If needed, you can still run each module directly.

Backend:

```bash
    cd passport-backend
    mvn spring-boot:run
```

Frontend:

```bash
    cd passport-frontend
    npm install
    npm start
```

UI tests:

```bash
    cd passport-ui-tests
    npm install
    npm test
    # or
    npm run test:headless
```

## Troubleshooting

- If startup fails with missing command errors, install the missing tool and rerun.
- If ports are already in use (`8080` or `3000`), stop conflicting processes and rerun.
- If UI tests fail, keep services running and rerun tests manually from `passport-ui-tests` for debugging.


## AI Skill Usage

This repo also includes a local AI skill at [ai-skill/feature-flag-rollout-implementer/SKILL.md](/Users/taylor.crawford/Documents/Projects/kainos/release-early-web-app/ai-skill/feature-flag-rollout-implementer/SKILL.md) for feature-flag and staged-rollout work.

Feel free to explore the tasks with this if you want to adopt AI.
You can use to help with:

* gating routes or pages behind a flag
* rolling out API or service changes safely
* adding feature-flagged database or migration behavior
* validating both flag-off and flag-on paths with tests

When invoking it, refer to the skill by name:
```text
feature-flag-rollout-implementer
```

Example prompt:
```text
Use the feature-flag-rollout-implementer to add a release flag for a new child renewal flow, keep flag-off behaviour unchanged, and add tests for both states.
```
