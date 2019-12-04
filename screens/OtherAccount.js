import React, {Component} from 'react'
import {Alert, Image, StyleSheet, ScrollView, TextInput, ActivityIndicator} from 'react-native'
import {withFirebase} from "../components/Firebase";

import {Divider, Button, Block, Text} from '../components';
import {theme, elements} from '../constants';
import BottomBar from "./BottomBar";
import {clientInfo, createChannel} from "./ChatRoom";

class OtherAccountBase extends Component {
    state = {
        editing: null,
        profile: {},
        avatar: null,
    };
    componentDidMount() {
        const uid = this.props.navigation.getParam('uid');
        this.props.firebase.avatar(uid).child("avatar").getDownloadURL().then(uri => {
            console.log('other account load avatar success');
            this.setState({avatar: {uri: uri}});
        }).catch(error => this.setState({avatar: require('../assets/images/default_avatar.jpg')}));
    }

render() {
        const {profile, editing} = this.state;

        const {navigation} = this.props;
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
                            source={this.state.avatar}
                            style={styles.avatar}
                        />
                    </Button>
                </Block>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <Block row space="between" margin={[10, 0]} style={styles.header}>
                    </Block>

                    <Divider margin={[theme.sizes.base, theme.sizes.base * 2]}/>

                    <Block margin={[10, 0]} style={styles.history}>
                        <Text darkBlue bold style={{marginBottom: 10}}
                              onPress={() => this.props.navigation.navigate('PostHistory', {
                                  uid: uid,
                                  type: 'history'
                              })}>
                            View History Posts
                        </Text>
                    </Block>
                    <Block margin={[10, 0]} style={styles.messaging}>
                        <Text darkBlue bold style={{marginBottom: 10}}
                              onPress={() => {
                                  const channel = createChannel(clientInfo.uid, uid);
                                  channel.create().then(() => {
                                      console.log('channel created');
                                  });

                                  this.props.navigation.navigate('ChannelScreen', {
                                      channel,
                                      directMessage: true
                                  })
                              }}>Messaging</Text>
                    </Block>
                    <Block margin={[10, 0]} style={styles.messaging}>
                        <Text gray style={{marginBottom: 10}}>Certificates</Text>
                    </Block>

                    <Block margin={[10, 0]} style={styles.messaging}>
                        <Text gray style={{marginBottom: 10}}>Reviews</Text>
                    </Block>
                    <Divider/>

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
        height: theme.sizes.base * 3.2,
        width: theme.sizes.base * 3.2,
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
