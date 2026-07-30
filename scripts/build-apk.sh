#!/bin/bash
set -e

if [ ! -d /opt/android-sdk ] || [ ! -f /opt/gradle/gradle-8.14.3/bin/gradle ] || ! command -v java &>/dev/null; then
  echo "=== Running Android SDK and Toolchain Setup ==="
  chmod +x ./scripts/setup-android-sdk.sh
  ./scripts/setup-android-sdk.sh
fi

echo "=== Building MoviyFly Web App Assets ==="
npm run build

echo "=== Syncing Capacitor Assets to Android ==="
npx cap sync android

echo "=== Building Real Android Debug APK with Gradle ==="
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
export ANDROID_HOME=/opt/android-sdk
export PATH=$JAVA_HOME/bin:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH

cd android
/opt/gradle/gradle-8.14.3/bin/gradle wrapper
/opt/gradle/gradle-8.14.3/bin/gradle assembleDebug --no-daemon

echo "=== Copying Built APK to Target Output Directories ==="
cd ..
mkdir -p .build-outputs
mkdir -p APK_DOWNLOAD

cp android/app/build/outputs/apk/debug/app-debug.apk .build-outputs/app-debug.apk
cp android/app/build/outputs/apk/debug/app-debug.apk APK_DOWNLOAD/app-debug.apk

echo "=== Verification ==="
ls -lh .build-outputs/app-debug.apk
ls -lh APK_DOWNLOAD/app-debug.apk

echo "=== Build Completed Successfully! ==="
