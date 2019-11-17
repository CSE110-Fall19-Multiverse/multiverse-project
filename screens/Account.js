import React, { Component } from 'react'
import { Alert, Image, StyleSheet, ScrollView, TextInput } from 'react-native'
//import Slider from 'react-native-slider';
import { withFirebase } from "../components/Firebase";

import { Divider, Button, Block, Text, Switch } from '../components';
import { theme, elements } from '../constants';
import {profile} from "../constants/elements";
import BottomBar from "./BottomBar";

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
      const displayname = snapshot.val().displayname; 
      const email = snapshot.val().email; 
      const newProfile = {...this.state.profile};
      newProfile.firstname = username;
      newProfile.displayname = displayname;
      newProfile.email = email; 
      this.setState({profile: newProfile});
    })
  }

  // in the real time database
  updateDatabase(name, updateObject)
  {
    const uid = this.props.firebase.auth.currentUser.uid;
    var user = this.props.firebase.user(uid);
    user.update(updateObject)
    .then(function() {
      alert(`Updated ${name} to ${updateObject[name]}.`);
    })
    .catch(function(error) {
      alert(`Failed to update ${name}.`);
    });
  }

  // in the auth system, for displayName and/or photoURL
  updateProfile(updateObject)
  {
    var user = this.firebase.auth.currentUser; 
    user.updateProfile(updateObject)
    .then(function() {
      alert(`Successfully updated!`)
    }).catch(function(error) {
      alert(`Failed to update.`)
    });
  }

  updateConfirmation(name, oldValue, newValue)
  {
    Alert.alert(
      `Confirm change of ${name}`, 
      `Are you sure you want to update your ${name}?`,
      [
        {
          text: 'Change', onPress: () => this.updateField(name, newValue)
        }, 
        {
          text: "Don't change", onPress: () =>  this.restoreField(name, oldValue)
        }
      ],
      { cancelable: true }
    )
    
    this.toggleEdit(name);  
  }

  updateField(name, newValue)
  {
    var updateObj = {}
    updateObj[name] = newValue; 
    this.updateDatabase(name, updateObj);
  }

  restoreField(name, oldValue)
  {
    const { profile } = this.state; 
    profile[name] = oldValue; 

    this.setState({profile}); 
  }

  updateEmail(newEmail)
  {
    this.updateDatabase('email', {email: newEmail}); 
    this.props.firebase.auth.currentUser.updateEmail(newEmail).then(function() {
      alert(`Successfully updated Profile.`)
    }).catch(function(error) {
      alert(`Failed to update Profile.`)
    });
    
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
              <Text medium secondary onPress={() => (editing === 'firstname' ? this.updateConfirmation('firstname', profile['firstname'], profile['firstname']) : this.toggleEdit('firstname'))}>
                {editing === 'firstname' ? 'Save' : 'Edit'}
              </Text>
            </Block>
            <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
              <Block>
                <Text gray style={{ marginBottom: 10 }}>Last Name</Text>
                {this.renderEdit('lastname')}
              </Block>
              <Text medium secondary onPress={() =>(editing === 'lastname' ? this.updateConfirmation('lastname', profile['lastname'], profile['lastname']) :  this.toggleEdit('lastname'))}>
                {editing === 'lastname' ? 'Save' : 'Edit'}
              </Text>
            </Block>
            <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
              <Block>
                <Text gray style={{ marginBottom: 10 }}>Display Name</Text>
                {this.renderEdit('displayname')}
              </Block>
              <Text medium secondary onPress={() => (editing === 'displayname' ? this.updateConfirmation('displayname', profile['displayname'], profile['displayname']) : this.toggleEdit('displayname'))}>
                {editing === 'displayname' ? 'Save' : 'Edit'}
              </Text>
            </Block>
            <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
              <Block>
                <Text gray style={{ marginBottom: 10 }}>Email</Text>
                {this.renderEdit('email')}
              </Block>
              <Text medium secondary onPress={() => (editing === 'email' ? this.updateConfirmation('email', profile['email'], profile['email']) : this.toggleEdit('email'))}>
                {editing === 'email' ? 'Save' : 'Edit'}
              </Text>
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

        <BottomBar navigation={this.props.navigation} active='Account'/>
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
