import React, { Component } from 'react'
import {Alert, Image, StyleSheet, ScrollView, TextInput, ActivityIndicator} from 'react-native'
import { withFirebase } from "../components/Firebase";

import { Divider, Button, Block, Text } from '../components';
import { theme, elements } from '../constants';
import BottomBar from "./BottomBar";

class OtherAccountBase extends Component {
  state = {
    editing: null,
    profile: {},
  };

  render() {
    const { profile, editing } = this.state;

    const { navigation } = this.props;
    const uid = navigation.getParam('uid');
    this.props.firebase.user(uid).once('value').then(snapshot => {
      const newProfile = {...this.state.profile};
      newProfile.displayname = snapshot.val().displayname;
      this.setState({profile: newProfile});
    });

    return (
      <Block>
        <Block flex={false} row center space="between" style={styles.header}>
          <Text h1 bold> {profile['displayname']} </Text>
          <Button>
            <Image
              source={profile.avatar}
              style={styles.avatar}
            />
          </Button>
        </Block>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Block row space="between" margin={[10, 0]} style={styles.header}>
          </Block>

          <Divider margin={[theme.sizes.base, theme.sizes.base * 2]} />

          <Block margin={[10, 0]} style={styles.history}>
            <Text darkBlue bold style={{ marginBottom: 10 }}
                  onPress={() => this.props.navigation.navigate('PostHistory', {uid : uid, type : 'history'})}>
              View History Posts
            </Text>
          </Block>
          <Block margin={[10, 0]} style={styles.messaging}>
            <Text gray style={{ marginBottom: 10 }}>Messaging</Text>
          </Block>
          <Block margin={[10, 0]} style={styles.messaging}>
            <Text gray style={{ marginBottom: 10 }}>Certificates</Text>
          </Block>
          <Divider />

        </ScrollView>

        <BottomBar navigation={this.props.navigation} active='OtherAccount'/>
      </Block>
    )
  }
}

OtherAccountBase.defaultProps = {
  profile: elements.profile,
};

const OtherAccount = withFirebase(OtherAccountBase);

export default OtherAccount;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.sizes.base * 2,
  },
  avatar: {
    height: theme.sizes.base * 2.2,
    width: theme.sizes.base * 2.2,
  },
  history: {
    marginTop: theme.sizes.base * 0.7,
    paddingHorizontal: theme.sizes.base * 2,
  },
  messaging: {
    marginTop: theme.sizes.base * 0.7,
    paddingHorizontal: theme.sizes.base * 2,
  },
});
