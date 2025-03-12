#!/bin/bash

# Install Sentry CLI
curl -sL https://sentry.io/get-cli/ | bash

# Setup configuration values
export SENTRY_AUTH_TOKEN="c44e3db895064ff5751297adcb16761b74e3a7a4d9f440638d950f6d294c4da5"
export SENTRY_ORG="gopetai"
export SENTRY_PROJECT="gopetai"

# Get the version
VERSION=$(sentry-cli releases propose-version)

# Create and manage the release
sentry-cli releases new "$VERSION"
sentry-cli releases set-commits "$VERSION" --auto
sentry-cli releases finalize "$VERSION"

echo "Successfully created and finalized Sentry release $VERSION"