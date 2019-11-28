import React, { Component } from 'react';
import { Alert, ActivityIndicator, Keyboard, KeyboardAvoidingView, StyleSheet } from 'react-native';

import { Button, Block, Input, Text } from '../../components';
import { theme } from '../../constants';
import { withFirebase } from "../../components/Firebase";

const INITIAL_STATE = {
  email: null,
  username: null,
  password: null,
  errors: [],
  loading: false
};

class SignUpBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    this.setState({ loading: false });

    this.props.firebase.users().on('value', snapshot => {
      const usersObject = snapshot.val();
    })
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  handleSignUp() {
    const { navigation } = this.props;
    const { email, username, password } = this.state;
    const errors = [];

    Keyboard.dismiss();
    this.setState({ loading: true });

    // check with backend API or with some static data
    if (!email || !username || !password)    {
      Alert.alert('Sorry', 'Information Uncompleted...');
    } else {
      const displayname = username;

      this.props.firebase
          .doCreateUserWithEmailAndPassword(email, password)
          .then(authUser => {
            return this.props.firebase
                .user(authUser.user.uid)
                .set({
                  username,
                  email,
                  displayname,
                  'history_posts': {'drafted': {'buying': [0], 'selling': [0]}, 'posted': {'buying': [0], 'selling': [0]}},
                  'liked_posts': {'buying': [0], 'selling': [0]},
                });
          })
          .then(() => {
            this.setState({...INITIAL_STATE});
            navigation.navigate('Marketplace');
            console.log('success');
          })
          .catch(error => {
            errors.push(error);
            Alert.alert('Error!', error.toString());
          });
    }

    this.setState({ loading: false });
  }

  render() {
    const { navigation } = this.props;
    const { loading, errors } = this.state;
    const hasErrors = key => errors.includes(key) ? styles.hasErrors : null;

    return (
      <KeyboardAvoidingView style={styles.signup} behavior="padding">
        <Block padding={[0, theme.sizes.base * 2]}>
          <Text h1 bold>Sign Up</Text>
          <Block middle>
            <Input
              email
              label="Email"
              error={hasErrors('email')}
              style={[styles.input, hasErrors('email')]}
              defaultValue={this.state.email}
              onChangeText={text => this.setState({ email: text })}
            />
            <Input
              label="Username"
              error={hasErrors('username')}
              style={[styles.input, hasErrors('username')]}
              defaultValue={this.state.username}
              onChangeText={text => this.setState({ username: text })}
            />
            <Input
              secure
              label="Password"
              error={hasErrors('password')}
              style={[styles.input, hasErrors('password')]}
              defaultValue={this.state.password}
              onChangeText={text => this.setState({ password: text })}
            />
            <Button gradient onPress={() => this.handleSignUp()}>
              {loading ?
                <ActivityIndicator size="small" color="white" /> :
                <Text bold white center>Sign Up</Text>
              }
            </Button>

            <Button onPress={() => navigation.navigate('Login')}>
              <Text gray caption center style={{ textDecorationLine: 'underline' }}>
                Back to Login
              </Text>
            </Button>
          </Block>
        </Block>
      </KeyboardAvoidingView>
    )
  }
}

// wrap signup in firebase context
const SignUp = withFirebase(SignUpBase);

const styles = StyleSheet.create({
  signup: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    borderRadius: 0,
    borderWidth: 0,
    borderBottomColor: theme.colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  hasErrors: {
    borderBottomColor: theme.colors.accent,
  }
})

export default SignUp;