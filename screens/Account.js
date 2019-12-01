import React, { Component } from 'react'
import {Alert, Image, StyleSheet, ScrollView, TextInput, ActivityIndicator} from 'react-native'
import { withFirebase } from "../components/Firebase";
import * as ImagePicker from 'expo-image-picker';
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";

import { Divider, Button, Block, Text, Switch } from '../components';
import { theme, elements } from '../constants';
import BottomBar from "./BottomBar";
import { clientInfo } from "./ChatRoom";

class AccountBase extends Component {
  state = {
    editing: null,
    profile: {},
  };

  componentDidMount() {
    // read user name from realtime db
    const uid = this.props.firebase.auth.currentUser.uid;
    this.props.firebase.user(uid).once('value').then(snapshot => {
      const newProfile = {...this.state.profile};
      newProfile.uid = uid;
      newProfile.firstname = snapshot.val().firstname;
      newProfile.lastname  = snapshot.val().lastname;
      newProfile.displayname = snapshot.val().displayname;
      newProfile.email = snapshot.val().email;
      newProfile.avatar = elements.profile.avatar;
      this.setState({profile: newProfile});
    });

    this.props.firebase.avatar(uid).child("avatar").getDownloadURL().then(uri => {
      console.log('avatar found');

      const profile = this.state.profile;
      profile.avatar = {uri: uri};

      this.setState({profile: profile});
    }).catch(error => {
      console.log('avatar not found');
      console.log(error);

      const profile = this.state.profile;
      profile.avatar = elements.profile.avatar;
      this.setState({profile: profile});
    })
  }

  getPermissionAsync = async() => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Need camera permission');
      }
    }
  };

  // documentation: https://docs.expo.io/versions/latest/sdk/imagepicker/
  _pickImage = async() => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.cancelled) {
        const profile = this.state.profile;

        // now displaying using local uri. Alternatively, get url from ref
        profile['avatar'] = {uri: result.uri};
        this.setState({profile: profile});
        this.uploadImage(result.uri).then( (imageRef) => {
          console.log('upload success')
        }).catch( (error) => {
          console.log('ERROR!');
          console.log(error)
        });
    }
  };

  uploadImage = async(uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const ref = await this.props.firebase.avatar(this.state.profile['uid']).child("avatar");

    return ref.put(blob);
  };

  // in the real time database
  updateDatabase(name, updateObject)
  {
    const uid = this.props.firebase.auth.currentUser.uid;
    const user = this.props.firebase.user(uid);
    user.update(updateObject)
    .then(function() {
      alert(`Updated ${name} to ${updateObject[name]}.`);
    })
    .catch(function(error) {
      alert(`Failed to update ${name}.`);
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
    );

    this.toggleEdit(name);
  }

  updateField(name, newValue)
  {
    var updateObj = {};
    updateObj[name] = newValue;
    this.updateDatabase(name, updateObj);
  }

  restoreField(name, oldValue)
  {
    const { profile } = this.state;
    profile[name] = oldValue;

    this.setState({profile});
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
          <Button onPress={() => this.getPermissionAsync().then(this._pickImage())}>
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
            <Text darkBlue bold style={{ marginBottom: 10 }}
                  onPress={() => this.props.navigation.navigate('LikedPosts', {uid : profile['uid'], type : "liked"})}>
              My Favorite Posts
            </Text>
          </Block>
          <Block margin={[10, 0]} style={styles.history}>
            <Text darkBlue bold style={{ marginBottom: 10 }}
                  onPress={() => this.props.navigation.navigate('PostHistory', {uid : profile['uid'], type: "history"})}>
              My History Posts
            </Text>
          </Block>
          <Block margin={[10, 0]} style={styles.history}>
            <Text darkBlue bold style={{ marginBottom: 10 }}
                  onPress={() => this.props.navigation.navigate('Drafts', {uid : profile['uid'], type : "drafts"})}>
              My Drafts
            </Text>
          </Block>
          <Block margin={[10, 0]} style={styles.messaging}>
              <Text darkBlue bold style={{ marginBottom: 10 }} onPress={() => this.props.navigation.navigate('ChatRoom')}>
                My Messages
              </Text>
          </Block>
          <Block middle flex={0.6} margin={[0, theme.sizes.padding * 2]}>
            <Button shadow onPress={() => this.props.navigation.navigate('Welcome')}>
              <Text center semibold>Log Out</Text>
            </Button>
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
};

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
});
