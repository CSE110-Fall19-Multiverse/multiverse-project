import React, { Component } from 'react'
import { Dimensions, Image, StyleSheet, ScrollView, TouchableOpacity, TouchableHighlight, RefreshControl } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';

import { Card, Button, Block, Text } from '../components';
import { theme } from '../constants';
import {withFirebase} from "../components/Firebase";
import BottomBar from "./BottomBar";


const { width } = Dimensions.get('window');

class PostRecordBase extends Component {
  state = {
    items: [],
    type: 'buying', // the type of items being displayed, default buying

    buying: true,
    refreshing: false,
    first: true,

    isDraft: false,
    pageName: 'PostRecord'
  };

  componentDidMount(){
    this.setState({items: []});
    let ref;
    if (this.props.navigation.getParam('isDraft')){
      if(this.state.buying){
        ref = this.props.firebase.buying_post_drafts();
      }else{
        ref = this.props.firebase.selling_post_drafts();
      }
    } else{
      if(this.state.buying){
        ref = this.props.firebase.buying_posts();
      }else{
        ref = this.props.firebase.selling_posts();
      }
    }
    let thisComponent = this;
    // load posts from firebase once
    ref.once("value", function(snapshot) {
      snapshot.forEach(function (childSnapshot) {
        let res = {};
        let user_res = {};
        let value = childSnapshot.val();

        // get user info
        const user_ref = thisComponent.props.firebase.user(value.uid);
        user_ref.once('value', function(snap){
          const user = snap.val();

          // get post info
          res['id'] = childSnapshot.key;
          res['summary'] = value.summary;
          res['description'] = value.description;
          res['select_1'] = value.select_1;
          res['select_2'] = value.select_2;
          res['service_type'] = value.service_type;
          res['service_date'] = value.service_date;
          res['service_price'] = value.service_price;

          let temp = thisComponent.state.items;
          try{
            // Update only if uid is the same as current one
            user_res['username'] = user.email;
            user_res['displayname'] = user.displayname;
            user_res['uid'] = value.uid;
            res['user_info'] = user_res;

            if (user_res['uid'] === thisComponent.props.navigation.getParam('uid')) {
              temp.push(res);
            }
          }catch (e) {}

          thisComponent.setState({items: temp});
        });
      });
      let temp = thisComponent.state.items;
      temp.reverse();
      thisComponent.setState({items: temp});
    });
    console.log('finish display');
  }

  refresh = () => {
    this.setState({refreshing: true});
    // reload posts from firebase
    this.componentDidMount();
    this.setState({refreshing: false});
  };

  handleView = view => {
    this.setState({ type : view.toLowerCase() });
    if (view === 'Selling'){
      this.setState({buying: false},() => {this.componentDidMount()});
    }else{
      this.setState({buying: true}, () => {this.componentDidMount()});
    }
  };

  renderView(view)
  {
      const { type } = this.state;
      const isActive = type===view.toLowerCase();
      const displayTab = view==='Selling' ? 'As a Tutor' : 'As a Student';
      return (
        <TouchableOpacity
            key={`view-${view}`}
            onPress={() => this.handleView(view)}
            style={[
                styles.view,
                isActive ? styles.active : null
            ]}
        >
            <Text size={14} bold={!isActive} bold secondary={isActive}>{displayTab}</Text>
        </TouchableOpacity>
      );
  }

  render() {
    const { items } = this.state;
    const { navigation } = this.props;
    const marketViews = ['Buying', 'Selling'];
    return (
      <Block>
        <Block flex={false} row style={styles.tabs}>
          {marketViews.map(view => this.renderView(view))}
        </Block>

        <ScrollView
            refreshControl={
              <RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.refresh()} />
            }
            showsVerticalScrollIndicator={false}
            style={{ paddingVertical: theme.sizes.base * 2}}
        >
          <Block flex={false} row space="between" style={styles.items}>
            {items.map(item => (
                <TouchableOpacity
                    key={item.id}
                    onPress={() => alert('Hi')}
                >
                  <Card shadow style={styles.item}>
                    <Block flex={false} row>
                      <Block row>
                        <TouchableHighlight
                            onPress={() => alert('Enter screen of person\'s pic')}
                            underlayColor={'purple'}
                            activeOpacity={0.69}
                        >
                          <Image source={item.avi}/>
                        </TouchableHighlight>
                        <Block style={{ margin: theme.sizes.base / 4}}>
                          <TouchableHighlight
                              onPress={() => this.props.navigation.navigate('OtherAccount', {uid : item.user_info['uid']})}
                              underlayColor={'white'}
                              activeOpacity={0.5}
                              // style={styles.textContainer}
                          >
                            <Text bold caption>Author: {item.user_info.displayname}</Text>
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
                        //onPress={() => alert('Send message')}
                        onPress={() => navigation.navigate('ChatRoom')}
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
            ))}
          </Block>
        </ScrollView>
        <BottomBar  navigation={this.props.navigation} active={ this.state.pageName }/>
      </Block>
    )
  }
}

const PostHistory = withFirebase(PostRecordBase);
const Drafts = withFirebase(PostRecordBase);

export {PostHistory, Drafts};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.sizes.base * 2,
    textAlign: 'center'
  },
  tabs: {
    justifyContent: 'center',
    marginTop: theme.sizes.base * 1.5,
  },
  view: {
    marginHorizontal: theme.sizes.base,
    paddingBottom: theme.sizes.base / 2,
  },
  tabpic: {
    // flex: 1, 
    // height: undefined, 
    // width: undefined,  
    height: 20, 
    width: 20,
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
  item_avi: {
    //justifyContent: ''
  },
  textContainer: {
  }, 
  messaging: {
    color: theme.colors.lightBlue,
  }, 
  messagingContainer: {
    position: 'absolute', 
    bottom: theme.sizes.base * 2, 
    right: theme.sizes.base * 2,
  }

})
