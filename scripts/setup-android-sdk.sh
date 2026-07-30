#!/bin/bash
set -e

echo "=== Installing Java 21 and Unzip ==="
if ! command -v java &>/dev/null || [ ! -d /usr/lib/jvm/java-21-openjdk-amd64 ]; then
  DEBIAN_FRONTEND=noninteractive apt-get update -q
  DEBIAN_FRONTEND=noninteractive apt-get install -y -q -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" --no-install-recommends openjdk-21-jdk-headless unzip curl
fi

echo "=== Installing Gradle 8.14.3 ==="
if [ ! -f /opt/gradle/gradle-8.14.3/bin/gradle ]; then
  mkdir -p /opt/gradle
  cd /tmp
  curl -sSL "https://services.gradle.org/distributions/gradle-8.14.3-bin.zip" -o gradle-8.14.3-bin.zip
  unzip -q -o gradle-8.14.3-bin.zip -d /opt/gradle
  rm -f gradle-8.14.3-bin.zip
fi

echo "=== Installing Android SDK to /opt/android-sdk ==="
if [ ! -d /opt/android-sdk/cmdline-tools/latest ]; then
  mkdir -p /opt/android-sdk/cmdline-tools/latest
  cd /tmp
  rm -f cmdline.zip
  curl -sSL "https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip" -o cmdline.zip
  unzip -q -o cmdline.zip -d /tmp/cmdline-out
  mv /tmp/cmdline-out/cmdline-tools/* /opt/android-sdk/cmdline-tools/latest/
  rm -rf /tmp/cmdline-out /tmp/cmdline.zip
fi

export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
export ANDROID_HOME=/opt/android-sdk
export PATH=$JAVA_HOME/bin:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH

echo "=== Accepting Android SDK Licenses ==="
yes | sdkmanager --licenses || true

echo "=== Installing SDK Packages ==="
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

echo "=== Creating local.properties ==="
echo "sdk.dir=/opt/android-sdk" > /app/applet/android/local.properties || echo "sdk.dir=/opt/android-sdk" > android/local.properties

echo "=== Android SDK Setup Complete ==="
