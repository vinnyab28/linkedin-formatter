# Safari Extension Submission Guide

Safari extensions require a different submission process compared to Chrome and Firefox. This guide walks you through the process of packaging and submitting your LinkedIn Formatter extension for Safari.

## Prerequisites

1. macOS computer (required for Xcode)
2. Xcode installed (latest version recommended)
3. Apple Developer account ($99/year)
4. Basic knowledge of Xcode

## Step 1: Create a Safari Web Extension Project

1. Open Xcode
2. Select File > New > Project
3. Choose "Safari Extension App" template
4. Enter the following details:
    - Product Name: LinkedIn Formatter
    - Organization Identifier: com.yourdomain.linkedinformatter
    - Language: Swift
    - Select "Include Safari Web Extension"
    - Click "Next" and choose a location to save the project

## Step 2: Configure the Safari Web Extension

1. Copy your extension files to the Safari Web Extension folder:

    - Navigate to your Xcode project directory
    - Find the folder named "Safari Extension"
    - Replace the template files with your extension files from the `/src` folder

2. Update `Info.plist` in the Safari Web Extension folder:

    - Set bundle display name to "LinkedIn Formatter"
    - Ensure extension point is "com.apple.Safari.web-extension"
    - Set allowed domains to "linkedin.com"

3. Configure `manifest.json`:
    - Ensure it's compatible with Safari (similar to Chrome's manifest)
    - Check that icons are properly referenced

## Step 3: Configure the Host App

1. Update the app icon:

    - Select Assets.xcassets in the Project Navigator
    - Replace the AppIcon with your icon (multiple sizes required)

2. Update the app's `Info.plist`:

    - Set proper bundle name, version, etc.

3. Modify the main app interface (optional):
    - You can customize the app to provide instructions or information about the extension

## Step 4: Test the Extension

1. Build and run the project in Xcode
2. Enable the extension in Safari:
    - Safari > Preferences > Extensions
    - Check the box next to "LinkedIn Formatter"
3. Test functionality on LinkedIn

## Step 5: Prepare for App Store Submission

1. Create App Store Connect entry:

    - Log in to App Store Connect
    - Click "+" to create a new app
    - Select "macOS" as platform
    - Fill in required information

2. Configure App Store information:

    - App name: "LinkedIn Formatter"
    - Primary category: "Productivity" or "Social Networking"
    - Secondary category (optional)
    - Privacy policy URL (required)
    - Pricing: Free

3. Prepare screenshots:

    - Follow Apple's screenshot guidelines
    - Create screenshots showing the extension in action

4. Prepare app metadata:
    - Description (see safari-store-description.md)
    - Keywords
    - Support URL
    - Marketing URL (optional)

## Step 6: Upload and Submit

1. Archive your app in Xcode:

    - Select Product > Archive
    - Wait for archiving to complete

2. Upload to App Store:

    - In the Archives window, select your archive
    - Click "Distribute App"
    - Select "App Store Connect"
    - Follow the prompts to upload

3. Complete submission in App Store Connect:
    - Ensure all required fields are completed
    - Add screenshots and promotional material
    - Set up app review information
    - Submit for review

## Post-Submission

1. Monitor review status in App Store Connect
2. Be prepared to answer reviewer questions
3. Once approved, your extension will be available in the Mac App Store
4. Users will need to download the app, then enable the extension in Safari preferences

## Common Issues and Solutions

-   **Entitlement Issues**: Ensure you have proper entitlements configured in Xcode
-   **Sandbox Limitations**: Be aware of sandbox restrictions for Mac App Store apps
-   **Review Rejections**: Common reasons include missing privacy policy, unclear functionality, or performance issues
-   **Extension Not Working**: Check that users know how to enable the extension in Safari preferences

## Resources

-   [Apple Developer Documentation: Safari App Extensions](https://developer.apple.com/documentation/safariservices/safari_app_extensions)
-   [Safari Web Extensions Documentation](https://developer.apple.com/documentation/safariservices/safari_web_extensions)
-   [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
