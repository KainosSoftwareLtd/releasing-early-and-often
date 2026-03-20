#!/usr/bin/env zsh

###############################################
# CONFIGURATION
###############################################

# Versions
NODE_VERSION=24.13.0

JAVA_VERSION=21.0.9-amzn

# Directories relative to where this script is located
NODE_PROJECT_DIRS=(
  "/passport-frontend"
  "/passport-ui-tests"
)

MAVEN_PROJECT_DIRS=(
  "/passport-backend"
)

###############################################
# SCRIPT START
###############################################

# Resolve script root directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Script running from: $SCRIPT_DIR"

###############################################
# Check for nvm
###############################################
if [[ -z "$NVM_DIR" && ! -d "$HOME/.nvm" ]]; then
  echo "❌ nvm not found. Please install nvm first:"
  echo "   https://github.com/nvm-sh/nvm"
  exit 1
fi

export NVM_DIR="$HOME/.nvm"
[[ -s "$NVM_DIR/nvm.sh" ]] && source "$NVM_DIR/nvm.sh"
echo "✔️ nvm loaded"

###############################################
# Install latest Node version & set default
###############################################

echo "⬇️ Installing Node $NODE_VERSION..."
nvm install $NODE_VERSION
nvm alias default $NODE_VERSION
nvm use default

echo "✔️ Node version set to default: $(node -v)"

###############################################
# Check for SDKMAN
###############################################
if [[ ! -s "$HOME/.sdkman/bin/sdkman-init.sh" ]]; then
  echo "❌ SDKMAN not found. Please install via:"
  echo "   curl -s 'https://get.sdkman.io' | bash"
  exit 1
fi

source "$HOME/.sdkman/bin/sdkman-init.sh"
echo "✔️ SDKMAN loaded"

###############################################
# Install Java
###############################################
echo "⬇️ Installing latest Java $JAVA_VERSION..."
sdk install java $JAVA_VERSION
sdk default java $JAVA_VERSION

echo "✔️ Java version set to: $(java -version 2>&1 | head -1)"

# Point Maven to the correct JVM
export JAVA_HOME="$SDKMAN_CANDIDATES_DIR/java/current"
export PATH="$JAVA_HOME/bin:$PATH"

echo "✔️ Java $JAVA_VERSION active: $(java -version 2>&1 | head -1)"

echo "🔧 Ensuring Maven uses Java $JAVA_VERSION:"
mvn -version

###############################################
# Run npm install in directories
###############################################
echo "\n📦 Running npm installs..."
for dir in "${NODE_PROJECT_DIRS[@]}"; do
  TARGET="$SCRIPT_DIR/$dir"
  if [[ -d "$TARGET" ]]; then
    echo "➡️ npm install in: $TARGET"
    cd "$TARGET" && npm install
  else
    echo "⚠️ Directory not found: $TARGET"
  fi
done

###############################################
# Run mvn clean install in directories
###############################################
echo "\n🛠️ Running Maven builds..."
for dir in "${MAVEN_PROJECT_DIRS[@]}"; do
  TARGET="$SCRIPT_DIR/$dir"
  if [[ -d "$TARGET" ]]; then
    echo "➡️ mvn clean install in: $TARGET"
    cd "$TARGET" && mvn clean install
  else
    echo "⚠️ Directory not found: $TARGET"
  fi
done

echo "\n🎉 All tasks completed successfully!"