# Build APK for Play Store

## Quick Steps to Get Your APK:

### Step 1: Install Android Studio
1. Download Android Studio from: https://developer.android.com/studio
2. Install with default settings
3. Open Android Studio and let it download SDK components

### Step 2: Open Project in Android Studio
```bash
npx cap open android
```
This will open your Android project in Android Studio.

### Step 3: Generate Signed APK
1. In Android Studio: **Build** → **Generate Signed Bundle/APK**
2. Choose **APK** → **Next**
3. Create new keystore:
   - **Key store path**: `C:\Users\Admin\ciphervault-keystore.jks`
   - **Password**: Create a strong password (save it!)
   - **Key alias**: `ciphervault`
   - **Key password**: Same as keystore password
   - **Certificate info**: Fill your details
4. Choose **release** build variant
5. Click **Finish**

### Step 4: APK Location
Find your APK at:
```
C:\Users\Admin\Password vault\client\android\app\release\app-release.apk
```

## Alternative: Command Line Build

### Prerequisites:
1. Set ANDROID_HOME environment variable
2. Add Android SDK tools to PATH

### Commands:
```bash
cd android
./gradlew assembleRelease
```

## App Signing Information:
- **Package Name**: com.ciphervault.app
- **Version Code**: 1
- **Version Name**: 1.0.0
- **Min SDK**: 22 (Android 5.1)
- **Target SDK**: 34 (Android 14)

## For Play Store Upload:
1. The APK will be at: `android\app\build\outputs\apk\release\app-release.apk`
2. Upload this APK to Google Play Console
3. Fill in the store listing information
4. Add screenshots and description
5. Submit for review

## Important Notes:
- Keep your keystore file safe! You'll need it for updates
- Test the APK on a real device before uploading
- The first Play Store review can take 1-3 days

Ready to build? Run: `npx cap open android`
