import React, { Component } from 'react'
import { Image, StyleSheet, ScrollView, TextInput } from 'react-native'
//import Slider from 'react-native-slider';
import { withFirebase } from "../components/Firebase";

import { Divider, Button, Block, Text, Switch } from '../components';
import { theme, elements } from '../constants';
import {profile} from "../constants/elements";

class AccountBase extends Component {
  state = {
    editing: null,
    profile: {},
  }

  componentDidMount() {
    this.setState({ profile: this.props.profile });

    // read user name from realtime db
    const uid = this.props.firebase.auth.currentUser.uid;
    this.props.firebase.user(uid).once('value').then(snapshot => {
      const username = snapshot.val().username;
      const newProfile = {...this.state.profile};
      newProfile.firstname = username;
      newProfile.displayname = username;
      this.setState({profile: newProfile});
    })
  }

  handleEdit(name, text) {
    const { profile } = this.state;
    profile[name] = text;

    this.setState({ profile });
  }

  toggleEdit(name) {
    const { editing } = this.state;
    this.setState({ editing: !editing ? name : null });
  }

  renderEdit(name) {
    const { profile, editing } = this.state;

    if (editing === name) {
      return (
        <TextInput
          defaultValue={profile[name]}
          onChangeText={text => this.handleEdit([name], text)}
        />
      )
    }

    return <Text bold>{profile[name]}</Text>
  }

  render() {
    const { profile, editing } = this.state;

    return (
      <Block>
        <Block flex={false} row center space="between" style={styles.header}>
          <Text h1 bold>Account</Text>
          <Button>
            <Image
              source={profile.avatar}
              style={styles.avatar}
            />
          </Button>
        </Block>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Block style={styles.inputs}>
            <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
              <Block>
                <Text gray style={{ marginBottom: 10 }}>First Name</Text>
                {this.renderEdit('firstname')}
              </Block>
              <Text medium secondary onPress={() => this.toggleEdit('firstname')}>
                {editing === 'firstname' ? 'Save' : 'Edit'}
              </Text>
            </Block>
            <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
              <Block>
                <Text gray style={{ marginBottom: 10 }}>Last Name</Text>
                {this.renderEdit('lastname')}
              </Block>
              <Text medium secondary onPress={() => this.toggleEdit('lastname')}>
                {editing === 'lastname' ? 'Save' : 'Edit'}
              </Text>
            </Block>
            <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
              <Block>
                <Text gray style={{ marginBottom: 10 }}>Display Name</Text>
                {this.renderEdit('displayname')}
              </Block>
              <Text medium secondary onPress={() => this.toggleEdit('displayname')}>
                {editing === 'displayname' ? 'Save' : 'Edit'}
              </Text>
            </Block>
            <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
              <Block>
                <Text gray style={{ marginBottom: 10 }}>Email</Text>
                <Text bold>{profile.email}</Text>
              </Block>
            </Block>
            <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
              <Block>
                <Text gray style={{ marginBottom: 10 }}>Password</Text>
                {this.renderEdit('password')}
              </Block>
              <Text medium secondary onPress={() => this.toggleEdit('password')}>
                {editing === 'password' ? 'Save' : 'Edit'}
              </Text>
            </Block>
          </Block>

          <Divider margin={[theme.sizes.base, theme.sizes.base * 2]} />

          <Block margin={[10, 0]} style={styles.history}>
            <Text gray style={{ marginBottom: 10 }}>Transaction History</Text>
          </Block>
          <Block margin={[10, 0]} style={styles.messaging}>
            <Text gray style={{ marginBottom: 10 }}>Messaging</Text>
          </Block>

          <Divider />

        </ScrollView>
      </Block>
    )
  }
}

AccountBase.defaultProps = {
  profile: elements.profile,
}

const Account = withFirebase(AccountBase);

export default Account;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.sizes.base * 2,
  },
  avatar: {
    height: theme.sizes.base * 2.2,
    width: theme.sizes.base * 2.2,
  },
  inputs: {
    marginTop: theme.sizes.base * 0.7,
    paddingHorizontal: theme.sizes.base * 2,
  },
  inputRow: {
    alignItems: 'flex-end'
  },
  history: {
    marginTop: theme.sizes.base * 0.7,
    paddingHorizontal: theme.sizes.base * 2,
  },
  messaging: {
    marginTop: theme.sizes.base * 0.7,
    paddingHorizontal: theme.sizes.base * 2,
  },
})
