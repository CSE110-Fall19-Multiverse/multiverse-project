import React, { PureComponent } from 'react';
import { View, SafeAreaView, Text } from 'react-native';
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

const chatClient = new StreamChat('f8wwud5et5jd');
const userToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiZGl2aW5lLWZvZy0wIn0.Tn6VtnfgXOEpwEgjpB5jfyYRqy6jjHhXp8fGNATkZ-E';

const user = {
  id: 'divine-fog-0',
  name: 'Divine fog',
  image:
    'https://stepupandlive.files.wordpress.com/2014/09/3d-animated-frog-image.jpg',
};

chatClient.setUser(user, userToken);

class ChannelListScreen extends PureComponent {
  static navigationOptions = () => ({
    headerTitle: (
      <Text style={{ fontWeight: 'bold' }}>Awesome Conversations</Text>
    ),
  });

  render() {
    return (
      <SafeAreaView>
        <Chat client={chatClient}>
          <View style={{ display: 'flex', height: '100%', padding: 10 }}>
            <ChannelList
              filters={{ type: 'messaging', members: { $in: ['divine-fog-0'] } }}
              sort={{ last_message_at: -1 }}
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

export default class ChatRoom extends React.Component {
  render() {
    return(
    <Block>
      <AppContainer />
      <BottomBar navigation={this.props.navigation} active='ChatRoom'/>
    </Block>
    );
  }
}