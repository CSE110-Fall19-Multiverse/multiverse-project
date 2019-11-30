import React, {PureComponent} from 'react';
import {View, SafeAreaView, Text, TouchableOpacity} from 'react-native';
import {StreamChat} from 'stream-chat';
import {
    Chat,
    Channel,
    MessageList,
    MessageInput,
    ChannelPreviewMessenger,
    ChannelList,
} from 'stream-chat-expo';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import BottomBar from "./BottomBar";
import {Block} from "../components";
import {Avatar, IconBadge} from "stream-chat-react-native-core";
import {withFirebase} from "../components/Firebase";

export const clientInfo = {
    chatClient: new StreamChat('rc6yxksd5uam',
        {timeout: 3000,}),
    uid: '',
    token: ''
};

const {chatClient} = clientInfo;

class ChannelListScreen extends PureComponent {
    static navigationOptions = () => ({
        headerTitle: (
            <Text style={{fontWeight: 'bold'}}>Awesome Conversations</Text>
        ),
    });

    async componentWillMount() {
    }

    render() {
        return (
            <SafeAreaView>
                <Chat client={chatClient}>
                    <View style={{display: 'flex', height: '100%', padding: 10}}>
                        <ChannelList
                            filters={{type: 'messaging', members: {$in: [clientInfo.uid]}}}
                            sort={{last_message_at: -1}}
                            Preview={ChannelPreviewMessenger}
                            onSelect={(channel) => {
                                this.props.navigation.navigate('Channel', {
                                    channel,
                                });
                            }}
                        />
                    </View>
                </Chat>
            </SafeAreaView>
        );
    }
}

class ChannelScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        const channel = navigation.getParam('channel');
        return {
            // headerTitle: (
            //   <Text style={{ fontWeight: 'bold' }}>{channel.data.name}</Text>
            // ),
        };
    };

    render() {
        const {navigation} = this.props;
        const channel = navigation.getParam('channel');

        return (
            <Block>
                <Block>
                    <SafeAreaView>
                        <Chat client={chatClient}>
                            <Channel client={chatClient} channel={channel}>
                                <View style={{display: 'flex', height: '100%'}}>
                                    <MessageList/>
                                    <MessageInput/>
                                </View>
                            </Channel>
                        </Chat>
                    </SafeAreaView>
                </Block>
                {navigation.getParam('directMessage') &&
                <BottomBar navigation={this.props.navigation} active='ChatRoom'/>}
            </Block>
        );
    }
}

const RootStack = createStackNavigator(
    {
        ChannelList: {
            screen: ChannelListScreen,
        },
        Channel: {
            screen: ChannelScreen,
        },
    },
    {
        initialRouteName: 'ChannelList',
    },
);

const AppContainer = createAppContainer(RootStack);

class ChatRoomBase extends React.Component {
    render() {
        return (
            <Block>
                <AppContainer/>
                <BottomBar navigation={this.props.navigation} active='ChatRoom'/>
            </Block>
        );
    }
}

function createChannel(selfUid, otherUid) {
    // Codes to generate channel between users.
    const conversation = clientInfo.chatClient.channel('messaging', null,
        {
            name: 'Chat',
            image: 'http://bit.ly/2O35mws',
            // Sorting to make sure only one channel between every two users
            members: [selfUid, otherUid].sort(),
        });
    return conversation;
}

const ChatRoom = withFirebase(ChatRoomBase);
export default ChatRoom;
export {createChannel, ChannelScreen};