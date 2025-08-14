# Android Build Guide for Play Store

## Prerequisites
- Java 11 or higher
- Android Studio (for SDK)
- Node.js and npm

## Step 1: Install Required Dependencies

```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# Install additional plugins you might need
npm install @capacitor/app @capacitor/haptics @capacitor/keyboard @capacitor/status-bar
```

## Step 2: Initialize Capacitor

```bash
# Initialize Capacitor (run from project root)
npx cap init CipherVault com.ciphervault.app

# Add Android platform
npx cap add android
```

## Step 3: Build Your React App

```bash
# Navigate to client directory and build
cd client
npm run build

# Copy build files to Capacitor
npx cap copy android
```

## Step 4: Configure Android App

### Update capacitor.config.ts:
```typescript
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'com.ciphervault.app',
  appName: 'CipherVault',
  webDir: 'client/build',
  server: {
    androidScheme: 'https',
    url: 'https://your-domain.com', // Your production URL
    cleartext: false
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#1a1a1a",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
    }
  }
};

export default config;
```

## Step 5: Open in Android Studio

```bash
# Open the Android project in Android Studio
npx cap open android
```

## Step 6: Configure App Details in Android Studio

1. **Update app name and package**:
   - Open `android/app/src/main/res/values/strings.xml`
   - Update app name: `<string name="app_name">CipherVault</string>`

2. **Update package name**:
   - In Android Studio: Right-click on package → Refactor → Rename
   - Change to: `com.ciphervault.app`

3. **Add app icon**:
   - Create icons using https://icon.kitchen/
   - Replace files in `android/app/src/main/res/mipmap-*` directories

4. **Configure app permissions** in `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.USE_FINGERPRINT" />
<uses-permission android:name="android.permission.USE_BIOMETRIC" />
```

## Step 7: Generate Signing Key

```bash
# Generate a keystore file (keep this secure!)
keytool -genkey -v -keystore cipher-vault-release-key.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias cipher-vault-key
```

## Step 8: Configure Build for Release

1. Create `android/key.properties`:
```properties
storePassword=your_keystore_password
keyPassword=your_key_password
keyAlias=cipher-vault-key
storeFile=../cipher-vault-release-key.keystore
```

2. Update `android/app/build.gradle`:
```gradle
android {
    ...
    signingConfigs {
        release {
            if (project.hasProperty('CIPHER_UPLOAD_STORE_FILE')) {
                storeFile file(CIPHER_UPLOAD_STORE_FILE)
                storePassword CIPHER_UPLOAD_STORE_PASSWORD
                keyAlias CIPHER_UPLOAD_KEY_ALIAS
                keyPassword CIPHER_UPLOAD_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

## Step 9: Build Release APK/AAB

```bash
# Build APK (for testing)
cd android
./gradlew assembleRelease

# Build AAB (for Play Store)
./gradlew bundleRelease
```

## Step 10: Prepare for Play Store

1. **Create App Bundle** (AAB file):
   - Located at: `android/app/build/outputs/bundle/release/app-release.aab`

2. **Test on Device**:
   ```bash
   # Install APK for testing
   adb install android/app/build/outputs/apk/release/app-release.apk
   ```

3. **Create Play Store Assets**:
   - App icon (512x512 PNG)
   - Feature graphic (1024x500 PNG)
   - Screenshots (phone, tablet, wear)
   - App description and keywords

## Step 11: Upload to Play Store Console

1. Go to https://play.google.com/console/
2. Create new app
3. Upload AAB file
4. Fill out store listing details
5. Set content rating
6. Configure pricing and distribution
7. Submit for review

## Automated Build Script

Create `build-android.sh`:
```bash
#!/bin/bash
echo "Building CipherVault for Android..."

# Build React app
cd client
npm run build
cd ..

# Copy to Capacitor
npx cap copy android

# Build Android
cd android
./gradlew clean
./gradlew assembleRelease
./gradlew bundleRelease

echo "Build completed!"
echo "APK: android/app/build/outputs/apk/release/app-release.apk"
echo "AAB: android/app/build/outputs/bundle/release/app-release.aab"
```

## Important Notes

- **Keep your keystore file secure** - you'll need it for all future updates
- **Test thoroughly** on different devices before submitting
- **Follow Play Store policies** regarding security and privacy
- **Update your privacy policy** to include mobile app usage
