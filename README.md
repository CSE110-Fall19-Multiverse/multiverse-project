# Multiverse
![alt text](./assets/icon.png)
* Multiverse is a service on-demand app for UCSD people to provide and receive services from each other.
* Service examples: rides, tutoring, mock interview practice, dining hall food or any food delivery, advice/consultation on something, workout training, hang out/accompany, etc.

## Dev Environment SetUp 
* Multiverse is a [React Native](https://facebook.github.io/react-native/docs/getting-started) project, using [Expo (SDK33)](https://docs.expo.io/versions/v33.0.0/).
* So far, Multiverse code base does not use any native iOS code (i.e it is fully React Native) so neither macOS nor Xcode is required. You can use any machine/OS or IDE/text editor of your choice.

### MacOS
1. Install [Node Latest LTS Version: 10.16.3 (includes npm 6.9.0)](https://nodejs.org/en/download/)
2. Install Expo CLI command line interface
   - `npm install -g expo-cli`
3. Install [Homebrew](https://brew.sh/)
4. Install Yarn
   - `brew install yarn`

### Windows
1. Install [Node Latest LTS Version: 10.16.3 (includes npm 6.9.0)](https://nodejs.org/en/download/)
2. Install Expo CLI command line interface
   - `npm install -g expo-cli`
3. Install [Chocolatey](https://chocolatey.org/install#installing-chocolatey)
4. Install Yarn
   - `choco install yarn`

## Run Multiverse App through Expo
### Option 1: Physical Mobile Device
- Install the **Expo client app** on your iOS or Android phone and connect to the same wireless network as your computer. Scan the QR code generated from your terminal with the Expo app (Android) or the Camera app (iOS).

### Option 2: iOS Simulator or Android Emulator
- **iOS Simulator**
  1. To use iOS Simulator (a tool part of Xcode), you need to have (Xcode)[https://apps.apple.com/us/app/xcode/id497799835?mt=12] **version 9.4 or newer** installed. This also means you need a **Mac** as Xcode only runs on macOS.
  2. Run `expo start --ios` inside the project folder, and you should see the app running in the iOS Simulator shortly. This starts a Node server and you can keep the server running while developing.
  3. On iOS Simulator, you can type
     - 'Command + D' to open developer window
       - Select * *Enable Live Reload* * to allow automatic app reloading whenver changes are saved in code
     - 'Command + R' to reload the app
- **Android Emulator**
  1. Similarly, you need to have **Android Studio** and **Android SDK** installed. Please refer to this (page)[https://facebook.github.io/react-native/docs/getting-started] **Android development environment** section for instruction.
  2. Run `expo start --android` inside the project folder.

* Note: When running app, if you see error message "Error: node_modules directory is missing...", run `yarn install`.

