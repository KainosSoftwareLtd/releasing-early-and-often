#!/usr/bin/env bash

# chmod +x startup.sh && bash -n startup.sh && ./startup.sh --help

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/passport-backend"
FRONTEND_DIR="$SCRIPT_DIR/passport-frontend"
UI_TEST_DIR="$SCRIPT_DIR/passport-ui-tests"

BACKEND_PID=""
FRONTEND_PID=""
RUN_UI_TESTS="prompt"

print_help() {
  cat <<'EOF'
Usage: ./startup.sh [options]

Starts the backend and frontend applications for this repository.
Optionally runs UI tests once both services are healthy.

Options:
  --ui-tests            Run UI tests after startup
  --ui-tests-headless   Run UI tests in headless mode after startup
  --no-ui-tests         Skip UI tests (no prompt)
  -h, --help            Show this help message
EOF
}

ensure_command() {
  local cmd="$1"
  local install_hint="$2"

  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Error: required command '$cmd' is not installed."
    echo "Hint: $install_hint"
    exit 1
  fi
}

ensure_node_dependencies() {
  local project_dir="$1"
  local project_name="$2"

  if [ ! -d "$project_dir/node_modules" ]; then
    echo "[$project_name] node_modules not found. Running npm install..."
    (cd "$project_dir" && npm install)
  fi
}

wait_for_url() {
  local url="$1"
  local service_name="$2"
  local timeout_seconds="${3:-120}"
  local elapsed=0

  echo "Waiting for $service_name at $url"
  until curl --silent --fail "$url" >/dev/null 2>&1; do
    sleep 2
    elapsed=$((elapsed + 2))

    if [ "$elapsed" -ge "$timeout_seconds" ]; then
      echo "Timed out waiting for $service_name after ${timeout_seconds}s"
      return 1
    fi
  done

  echo "$service_name is ready"
}

cleanup() {
  echo
  echo "Stopping services..."

  if [ -n "$FRONTEND_PID" ] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
    kill "$FRONTEND_PID" 2>/dev/null || true
  fi

  if [ -n "$BACKEND_PID" ] && kill -0 "$BACKEND_PID" 2>/dev/null; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi

  wait 2>/dev/null || true
}

run_ui_tests() {
  local headless="$1"

  ensure_node_dependencies "$UI_TEST_DIR" "ui-tests"

  wait_for_url "http://localhost:8080/v3/api-docs" "Backend API"
  wait_for_url "http://localhost:3000" "Frontend app"

  echo "Running UI tests..."
  set +e
  if [ "$headless" = "true" ]; then
    (cd "$UI_TEST_DIR" && npm run test:headless)
  else
    (cd "$UI_TEST_DIR" && npm test)
  fi
  local test_exit_code=$?
  set -e

  if [ "$test_exit_code" -ne 0 ]; then
    echo "UI tests failed with exit code $test_exit_code"
  else
    echo "UI tests passed"
  fi
}

start_backend() {
  echo "Starting backend on http://localhost:8080"
  (
    cd "$BACKEND_DIR"
    mvn spring-boot:run
  ) > >(sed 's/^/[backend] /') 2> >(sed 's/^/[backend] /' >&2) &

  BACKEND_PID=$!
}

start_frontend() {
  echo "Starting frontend on http://localhost:3000"
  (
    cd "$FRONTEND_DIR"
    npm start
  ) > >(sed 's/^/[frontend] /') 2> >(sed 's/^/[frontend] /' >&2) &

  FRONTEND_PID=$!
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --ui-tests)
      RUN_UI_TESTS="yes"
      ;;
    --ui-tests-headless)
      RUN_UI_TESTS="headless"
      ;;
    --no-ui-tests)
      RUN_UI_TESTS="no"
      ;;
    -h|--help)
      print_help
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      print_help
      exit 1
      ;;
  esac
  shift
done

if [ ! -d "$BACKEND_DIR" ] || [ ! -d "$FRONTEND_DIR" ] || [ ! -d "$UI_TEST_DIR" ]; then
  echo "Error: expected project directories not found."
  echo "Run this script from the repository root: $SCRIPT_DIR"
  exit 1
fi

ensure_command mvn "Install Maven (https://maven.apache.org/install.html)"
ensure_command npm "Install Node.js + npm (https://nodejs.org/)"
ensure_command curl "Install curl (available by default on macOS/Linux)"

if [ "$RUN_UI_TESTS" = "prompt" ] && [ -t 0 ]; then
  read -r -p "Run UI tests after startup? [y/N/h for headless]: " test_choice
  case "$test_choice" in
    [yY]|[yY][eE][sS])
      RUN_UI_TESTS="yes"
      ;;
    [hH]|headless|HEADLESS)
      RUN_UI_TESTS="headless"
      ;;
    *)
      RUN_UI_TESTS="no"
      ;;
  esac
elif [ "$RUN_UI_TESTS" = "prompt" ]; then
  RUN_UI_TESTS="no"
fi

ensure_node_dependencies "$FRONTEND_DIR" "frontend"

trap cleanup EXIT INT TERM

start_backend
start_frontend

echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"

if [ "$RUN_UI_TESTS" = "yes" ]; then
  run_ui_tests "false"
elif [ "$RUN_UI_TESTS" = "headless" ]; then
  run_ui_tests "true"
fi

echo "Services are running. Press Ctrl+C to stop both services."
wait "$BACKEND_PID" "$FRONTEND_PID"
