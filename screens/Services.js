import React, { Component } from 'react'
import { Dimensions, Image, StyleSheet, ScrollView, TouchableOpacity, TouchableHighlight, RefreshControl } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';

import { Card, Button, Block, Text } from '../components';
import { theme, elements } from '../constants';
import {withFirebase} from "../components/Firebase";

const { width } = Dimensions.get('window');

class ServicesBase extends Component {
  state = {
    buying: false,
    active: 'Selling',
    items: [],
    refreshing: false,
    first: true,
  };

  componentDidMount(){
    this.setState({items: []});
    let ref;
    if(this.state.buying){
      ref = this.props.firebase.selling_posts();
    }else{
      ref = this.props.firebase.buying_posts();
    }
    let that = this;
    // load posts from firebase once
    ref.once("value", function(snapshot) {
      snapshot.forEach(function (childSnapshot) {
        let res = {};
        let user_res = {};
        let value = childSnapshot.val();

        // get user info
        /*const user_ref = that.props.firebase.user(value.uid);
        user_ref.once('value', function(snap){
          const user = snap.val();
          user_res['username'] = user.email;
          user_res['password'] = user.username;
          console.log('snap username: '+user_res['username']);
          console.log('snap password: '+user_res['password']);
        });*/

        // get post info
        res['id'] = childSnapshot.key;
        res['summary'] = value.summary;
        res['description'] = value.description;
        res['select_1'] = value.select_1;
        res['select_2'] = value.select_2;
        res['service_type'] = value.service_type;
        res['service_date'] = value.service_date;
        res['service_price'] = value.service_price;
        res['user_info'] = user_res;
        console.log('user_res: '+user_res['user_username']);

        let temp = that.state.items;
        temp.push(res);
        that.setState({items: temp});
        console.log(that.state.items);
      });
      let temp = that.state.items;
      temp.reverse();
      that.setState({items: temp});
    });
    console.log('finish display');
  }

    refresh = () => {
        this.setState({refreshing: true});
        const temp = this.state.buying;
        // reload posts from firebase
        this.componentDidMount();
        this.setState({refreshing: false, buying: temp});
    };

  handleTab = tab => {
    const { navigation } = this.props;
    if (tab === 'Account') {
      navigation.navigate('Account');
    }else if (tab === 'Search') {
      navigation.navigate('Search');
    }else if (tab === 'Selling'){
      this.setState({buying: false});
      this.componentDidMount();
    }else{
      this.setState({buying: true});
      this.componentDidMount();
    }
    this.setState({ active: tab});
  };

  renderTab(tab) {
    const { active } = this.state;
    const isActive = active === tab;

    return (
      <TouchableOpacity
        key={`tab-${tab}`}
        onPress={() => this.handleTab(tab)}
        style={[
          styles.tab,
          isActive ? styles.active : null
        ]}
      >
        <Text size={14} bold={!isActive} bold secondary={isActive}>{tab}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    const { navigation } = this.props;
    const { items } = this.state;
    const tabs = ['Selling', 'Buying', 'Search', 'Account'];

    return (
      <Block>
        <Block flex={false} row space="between" style={styles.header}>
          <Text h1 bold>Services</Text>
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
                              onPress={() => alert('Enter person\'s profile')}
                              underlayColor={'white'}
                              activeOpacity={0.5}
                              // style={styles.textContainer}
                          >
                            <Text bold caption>Author: {item.user_info.username}</Text>
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
                        onPress={() => alert('Send message')}
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
        <Block>
          <TouchableOpacity
            onPress={() => navigation.navigate('NewPost')}
            style={styles.plusCircleContainer}
          > 
            <Icon 
              name={'plus-circle'} 
              size={theme.sizes.base * 4}
              style={styles.plusCircle}
            />
          </TouchableOpacity>
        </Block>
        <Block flex={false} row style={styles.tabs}>
          {tabs.map(tab => this.renderTab(tab))}
        </Block>
       
      </Block>
    )
  }
}

ServicesBase.defaultProps = {
  //items: elements.items,
};

// Wrap ServicesBase component in firebase component to use a same firebase agent.
const Services = withFirebase(ServicesBase);
export default Services;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.sizes.base * 2,
  },
  tabs: {
    borderTopColor: theme.colors.black,
    borderTopWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    paddingVertical: theme.sizes.base * 1.5,
  },
  tab: {
    marginHorizontal: theme.sizes.base,
    paddingBottom: theme.sizes.base / 2,
  },
  active: {
    borderBottomColor: theme.colors.secondary,
    borderBottomWidth: 3,
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
  plusCircle: {
    color: theme.colors.lightBlue,
  },
  plusCircleContainer: {
    position: 'absolute',
    bottom: theme.sizes.base,
    right: theme.sizes.base * 2,
    alignItems: 'center',
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
