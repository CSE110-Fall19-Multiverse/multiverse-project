import React, { PureComponent } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  MessageList,
  MessageInput,
  ChannelPreviewMessenger,
  ChannelList,
} from 'stream-chat-expo';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import BottomBar from "./BottomBar";
import {Block} from "../components";
import {Avatar, IconBadge} from "stream-chat-react-native-core";
import {withFirebase} from "../components/Firebase";
import { clientInfo } from "./Marketplace";
//
// // Following information should be fetched from firebase dynamically when user logs in.
// const smallGooseToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOVBDeDc3NjdxaGJSOTd5b2NnRUFYbEZ1Mk1nMiJ9.8IHEpehxq1ZUWCAEye_hfkWb3M07s99nM3t5Sk114IM";
// const smallGooseUid   = "9PCx7767qhbR97yocgEAXlFu2Mg2";
// const littleGooseToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiWk01THBZb0hSSlc5OHpTWGZqT2RWVE02WjlUMiJ9.40wEvTO1_lPQHeJfbXoCtUgGB2NJ-IEC0L6UmB6XTmk";
// const littleGooseUid  = "ZM5LpYoHRJW98zSXfjOdVTM6Z9T2";
//
// chatClient.setUser(
//     {
//       id: littleGooseUid,
//       image: 'https://getstream.io/random_svg/?name=John',
//     },
//     littleGooseToken,
// );

// Codes to generate channel between users.
// const conversation = chatClient.channel('messaging', '9PCx7767qhbR97yocgEAXlFu2Mg2_ZM5LpYoHRJW98zSXfjOdVTM6Z9T2',
//     {
//       name: 'Founder Chat',
//       image: 'http://bit.ly/2O35mws',
//       members: ['9PCx7767qhbR97yocgEAXlFu2Mg2',
//         'ZM5LpYoHRJW98zSXfjOdVTM6Z9T2'],
//     });
// conversation.create();

const { chatClient } = clientInfo;

class ChannelListScreen extends PureComponent {
  static navigationOptions = () => ({
    headerTitle: (
      <Text style={{ fontWeight: 'bold' }}>Awesome Conversations</Text>
    ),
  });

  async componentWillMount() {
  }

  render() {
    return (
      <SafeAreaView>
        <Chat client={chatClient}>
          <View style={{ display: 'flex', height: '100%', padding: 10 }}>
            <ChannelList
              filters={{ type: 'messaging', members: { $in: [clientInfo.uid]}  }}
              sort={{ last_message_at: -1 }}
              Preview={ ChannelPreviewMessenger }
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
  static navigationOptions = ({ navigation }) => {
    const channel = navigation.getParam('channel');
    return {
      headerTitle: (
        <Text style={{ fontWeight: 'bold' }}>{channel.data.name}</Text>
      ),
    };
  };

  render() {
    const { navigation } = this.props;
    const channel = navigation.getParam('channel');

    return (
      <Block>
        <SafeAreaView>
          <Chat client={chatClient}>
            <Channel client={chatClient} channel={channel}>
              <View style={{ display: 'flex', height: '100%' }}>
                <MessageList />
                <MessageInput />
              </View>
            </Channel>
          </Chat>
        </SafeAreaView>

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
    return(
    <Block>
      <AppContainer />
      <BottomBar navigation={this.props.navigation} active='ChatRoom'/>
    </Block>
    );
  }
}

const ChatRoom = withFirebase(ChatRoomBase);
export default ChatRoom;