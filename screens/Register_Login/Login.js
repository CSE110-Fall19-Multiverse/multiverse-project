import React, { Component } from 'react'
import { Alert, ActivityIndicator, Keyboard, KeyboardAvoidingView, StyleSheet } from 'react-native'

import { Button, Block, Input, Text } from '../../components';
import { theme } from '../../constants';
import { withFirebase } from "../../components/Firebase";

const VALID_EMAIL = "smallgoose@aufish.com";
const VALID_PASSWORD = "666666";

const INITIAL_STATE = {
  email: VALID_EMAIL,
  password: VALID_PASSWORD,
  errors: [],
  loading: false,
};

class LoginBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  handleLogin() {
    const { navigation } = this.props;
    const { email, password } = this.state;
    const errors = [];

    Keyboard.dismiss();
    this.setState({ loading: true });

    // Better to strip leading and trailing white spaces in email.
    this.props.firebase
        .doSignInWithEmailAndPassword(email, password)
        .then( () => {
          this.setState({ ...INITIAL_STATE });
          navigation.navigate('Marketplace');
        })
        .catch(error => {
          errors.push(error);
          Alert.alert("Error!", error.toString());
        });

    this.setState({ errors, loading: false });
  }

  render() {
    const { navigation } = this.props;
    const { loading, errors } = this.state;
    const hasErrors = key => errors.includes(key) ? styles.hasErrors : null;

    return (
      <KeyboardAvoidingView style={styles.login} behavior="padding">
        <Block padding={[0, theme.sizes.base * 2]}>
          <Text h1 bold style={{textAlign: 'center'}}>Login</Text>
          <Block middle>
            <Input
              label="Email"
              error={hasErrors('email')}
              style={[styles.input, hasErrors('email')]}
              defaultValue={this.state.email}
              onChangeText={text => this.setState({ email: text })}
            />
            <Input
              secure
              label="Password"
              error={hasErrors('password')}
              style={[styles.input, hasErrors('password')]}
              defaultValue={this.state.password}
              onChangeText={text => this.setState({ password: text })}
            />
            <Button gradient onPress={() => this.handleLogin()}>
              {loading ?
                <ActivityIndicator size="small" color="white" /> : 
                <Text bold white center>Login</Text>
              }
            </Button>

            <Button onPress={() => navigation.navigate('SignUp')}>
              <Text gray caption center style={{ textDecorationLine: 'underline' }}>
                Back to Sign Up
              </Text>
            </Button>

            <Button onPress={() => navigation.navigate('Forgot')}>
              <Text gray caption center style={{ textDecorationLine: 'underline' }}>
                Forgot your password?
              </Text>
            </Button>
          </Block>
        </Block>
      </KeyboardAvoidingView>
    )
  }
}

// wrap login page in firebase context
const Login = withFirebase(LoginBase);

const styles = StyleSheet.create({
  login: {
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
});

export default Login;