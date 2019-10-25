import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';

import Navigation from './navigation';
import { Block } from './components';
import Firebase, { FirebaseContext } from "./components/Firebase";

// import all used images for cache
const images = [
  //TODO: cache all newly uploaded images automatically (now hardcoded)
  require('./assets/images/illustration_1.png'),
  require('./assets/images/illustration_2.png'),
  require('./assets/images/illustration_3.png'),
  require('./assets/images/avatar.png'),
  require('./assets/images/madeline.png'),
  require('./assets/images/charles.png'),
  require('./assets/images/cheng.png'),
  require('./assets/images/gary.png'),
  require('./assets/images/paul.png'),
  require('./assets/images/jessica.png'),
  require('./assets/icons/back.png'),
];

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  }

  handleResourcesAsync = async () => {
    // we're caching all the images
    // for better performance on the app

    const cacheImages = images.map(image => {
      return Asset.fromModule(image).downloadAsync();
    });

    return Promise.all(cacheImages);
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this.handleResourcesAsync}
          onError={error => console.warn(error)}
          onFinish={() => this.setState({ isLoadingComplete: true })}
        />
      )
    }

    return (
      <FirebaseContext.Provider value={new Firebase()}>
        <Block white>
          <Navigation />
        </Block>
      </FirebaseContext.Provider>
    );
  }
}

const styles = StyleSheet.create({
});
