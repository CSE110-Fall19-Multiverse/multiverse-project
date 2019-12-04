import {
    Dimensions,
    Image,
    StyleSheet,
    TouchableHighlight,
    TouchableOpacity
} from "react-native";
import {AsyncStorage} from 'react-native';
import React, { Component } from 'react';
import {theme} from "../../constants";
import {withFirebase} from "../../components/Firebase";
import {Block, Card, Text} from "../../components";
import Icon from 'react-native-vector-icons/FontAwesome';
import {clientInfo, createChannel} from "../ChatRoom";
const {width} = Dimensions.get('window');

class PostBase extends Component {
    state = {
        item: null,
        uid: null,
        avatar: null,
    };

    componentDidMount() {
        this.setState({item: this.props.item, uid: this.props.item.user_info['uid']},
            () => {
                this.retrieveData();
            });
    }

    retrieveData() {
        this.retrieveItem(this.state.uid).then((result) => {
            //this callback is executed when your Promise is resolved
            if(result === null) throw TypeError;
            this.setState({avatar: result});
        }).catch((error) => {
            //this callback is executed when your Promise is rejected
            console.log('Promise is rejected');
            let avatarData;
            this.props.firebase.avatar(this.state.uid).child("avatar").getDownloadURL().then(uri => {
                avatarData = {uri: uri};
                AsyncStorage.setItem(this.state.uid, JSON.stringify(avatarData),
                    () => console.log('save avatar data for user: '+this.state.uid));
                this.setState({avatar: avatarData});
            }).catch(error => {
                avatarData = require('../../assets/images/default_avatar.jpg');
                AsyncStorage.setItem(this.state.uid, JSON.stringify(avatarData),
                    () => console.log('save avatar data for user: '+this.state.uid));
                this.setState({avatar: avatarData});
            });
        });
    }

    //the functionality of the retrieveItem is shown below
    async retrieveItem(key) {
        try {
            const retrievedItem =  await AsyncStorage.getItem(key);
            const item = JSON.parse(retrievedItem);
            return item;
        } catch (error) {
            throw error;
        }
    }

    render() {
        const {navigation, item} = this.props;
        return (
            <TouchableOpacity
                key={item.id}
                onPress={() => {
                    navigation.navigate('ViewPost', {
                        pid: item.id,
                        service_type: item.service_type === 'Student' ? 'buying' : 'selling',
                    })}}
            >
                <Card shadow style={styles.item}>
                    <Block flex={false} row>
                        <Block row>
                            <TouchableHighlight
                                onPress={() => alert('Enter screen of person\'s pic')}
                                underlayColor={'purple'}
                                activeOpacity={0.69}
                            >
                                <Image source={this.state.avatar} style={styles.avatar}/>
                            </TouchableHighlight>
                            <Block style={{ margin: theme.sizes.base / 4}}>
                                <TouchableHighlight
                                    onPress={() => navigation.navigate('OtherAccount', {uid : item.user_info['uid']})}
                                    underlayColor={'white'}
                                    activeOpacity={0.5}
                                    // style={styles.textContainer}
                                >
                                    <Text bold caption>{item.user_info.displayname}</Text>
                                </TouchableHighlight>
                                <Text caption gray>{item.service_date}</Text>
                            </Block>
                        </Block>
                        <Block>
                            <TouchableHighlight
                                onPress={() => alert('Filter by this category')}
                                underlayColor={'white'}
                                activeOpacity={0.5}
                            >
                                <Text right semibold secondary style={{fontSize: 12}}> {`${item.select_1}\n${item.select_2}`} </Text>
                            </TouchableHighlight>
                            <TouchableHighlight
                                onPress={() => alert('item.price_negotiable ? {alert(\'price non-negotiable\')} : popup counteroffer screen')}
                                underlayColor={'white'}
                                activeOpacity={0.5}
                            >
                                <Text right semibold>${item.service_price}</Text>
                            </TouchableHighlight>
                        </Block>
                    </Block>
                    <Text bold style={{ marginTop: theme.sizes.base}}>{item.summary}</Text>
                    <Text style={{ marginTop: theme.sizes.base}}>{item.description}</Text>
                    <TouchableOpacity
                        onPress={() => {
                        const channel =
                            createChannel(clientInfo.uid, item.user_info['uid'], clientInfo.displayName, item.user_info.displayname);
                        console.log(channel);
                        try {
                            channel.create().then(() => {
                                console.log('channel created');
                            });
                            this.props.navigation.navigate('ChannelScreen', {
                                channel,
                                directMessage: true
                            })
                        } catch (e) {
                            console.log(e);
                            this.props.navigation.navigate('ChatRoom');
                        }
                    }}
                     style={styles.messagingContainer}
                    >
                        <Icon
                            name={'comment'}
                            size={theme.sizes.base * 1.7}
                            style={styles.messaging}
                        />
                    </TouchableOpacity>
                </Card>
            </TouchableOpacity>
        )
    }
}

const Post = withFirebase(PostBase);
export default Post;

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: theme.sizes.base * 2,
        justifyContent: 'center',
        textAlign: 'center',
    },
    tabs: {
        justifyContent: 'center',
        marginTop: theme.sizes.base * 1.5,
    },
    view: {
        marginHorizontal: theme.sizes.base,
        paddingBottom: theme.sizes.base / 2,
    },
    items: {
        flexWrap: 'wrap',
        paddingHorizontal: theme.sizes.base * 2,
        marginBottom: theme.sizes.base * 4,
    },
    item: {
        // this should be dynamic based on screen width
        minWidth: (width - (theme.sizes.padding * 2) - theme.sizes.base),
        maxWidth: (width - (theme.sizes.padding * 2) - theme.sizes.base),
        minHeight: (width - (theme.sizes.padding * 2) - theme.sizes.base) / 1.5,
    },
    avatar: {
        height: theme.sizes.base * 2.2,
        width: theme.sizes.base * 2.2,
    },
    textContainer: {},
    messaging: {
        color: theme.colors.lightBlue,
    },
    messagingContainer: {
        position: 'absolute',
        bottom: theme.sizes.base * 2,
        right: theme.sizes.base * 2,
    }
});
