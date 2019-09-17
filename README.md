#Multiverse
* Multiverse is a service on-demand app for UCSD people to provide and receive services from each other.
* Service examples: rides, tutoring, mock interview practice, dining hall food or any food delivery, advice/consultation on something, workout training, hang out/accompany, etc.

##Dev Environment SetUp (assuming you use MacOS)
Multiverse is a [React Native](https://facebook.github.io/react-native/docs/getting-started) project, using Expo.

1. Install [Node Latest LTS Version: 10.16.3 (includes npm 6.9.0)](https://nodejs.org/en/download/)
2. Install Expo CLI command line interface
   - `npm install -g expo-cli`
3. Install [homebrew](https://brew.sh/)
4. Install Yarn
   - `brew install yarn`
5. Install Watchman
   - `brew install watchman`

##Run App through Expo
* iOS Simulator: run `expo start --ios` inside the project folder,
and you should see Multiverse running in the iOS Simulator shortly.
  - * `Command + D` to open developer window
       - `Enable Live Reload` to allow automatic app reloading whenver changes are saved in code
  - * `Command + R` to reload the app
* Physical Device
   - See this [page](https://facebook.github.io/react-native/docs/getting-started) **Running your React Native application** section for instruction

Note: If you see "Error: node_modules directory is missing. Please run npm install in your project directory.", run `yarn install`.
