#!/bin/bash
set -e

export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export ANDROID_HOME=/opt/android-sdk
export PATH=$JAVA_HOME/bin:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH

echo "Accepting licenses..."
yes | sdkmanager --licenses || true

echo "Installing Android SDK packages..."
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

echo "Android SDK setup completed!"
