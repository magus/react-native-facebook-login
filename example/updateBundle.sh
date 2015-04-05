#!/bin/sh

ROOT_GIT_DIR=$(git rev-parse --show-toplevel);
JS_BUNDLE="$ROOT_GIT_DIR/example/iOS/main.jsbundle";

echo
echo "Updating $JS_BUNDLE..."
echo

# Update the JS bundle
curl -s "http://localhost:8081/components/AppEntry.includeRequire.runModule.bundle?dev=false&minify=true" -o $JS_BUNDLE 1>/dev/null
