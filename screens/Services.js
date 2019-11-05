import React, { Component } from 'react'
import { Dimensions, Image, StyleSheet, ScrollView, TouchableOpacity, TouchableHighlight, FlatList } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';

import { Card, Button, Block, Text } from '../components';
import { theme, elements } from '../constants';
import {withFirebase} from "../components/Firebase";

const { width } = Dimensions.get('window');

class ServicesBase extends Component {
  state = {
    active: '', 
    items: [],
  };

  componentDidMount() {
    const ref = this.props.firebase.buying_posts();
    let that = this;
    ref.on("value", function(snapshot) {
      snapshot.forEach(function (childSnapshot) {
        let res = {};
        let value = childSnapshot.val();
        res['id'] = childSnapshot.key;
        res['summary'] = value.summary;
        res['description'] = value.description;
        console.log('key is '+childSnapshot.key);
        let temp = that.state.items;
        temp.push(res);
        that.setState({items: temp});
        console.log(that.state.items);
      });
    });
    console.log('finish display')
  }

  handleTab = tab => {
    const { navigation } = this.props;
    const { items } = this.props;
    const filtered = items.filter(
      item => item.type.includes(tab.toLowerCase())
    );
    if (tab === 'Account') {
      navigation.navigate('Account');
    }
    if (tab === 'Search') {
      navigation.navigate('Search');
    }
    this.setState({ active: tab, items: filtered});
  };

  test_child_added(){
    const ref = this.props.firebase.buying_posts();
    ref.on("child_added", function(snapshot) {
      const newPost = snapshot.val();
      console.log("Summary: " + newPost.summary);
      console.log("Description: " + newPost.description);
    });
  }

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
                  <Text semibold secondary>{item.summary}</Text>
                  <Text style={{ marginTop: theme.sizes.base, fontSize: 15}}>{item.description}</Text>
                </Card>
                </TouchableOpacity>
                /*
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
                        > 
                          <Text bold caption>{item.summary}</Text>
                        </TouchableHighlight>
                        <Text caption gray>{item.description}</Text>
                      </Block>
                    </Block>
                    <Block>
                      <TouchableHighlight
                        onPress={() => alert('Filter by this category')}
                        underlayColor={'white'}
                        activeOpacity={0.5}
                      > 
                        <Text right semibold secondary>{item.category}</Text>
                      </TouchableHighlight>
                      <TouchableHighlight
                        onPress={() => alert('item.price_negotiable ? {alert(\'price non-negotiable\')} : popup counteroffer screen')}
                        underlayColor={'white'}
                        activeOpacity={0.5}
                      >
                        <Text right semibold>${item.proposed_price}</Text>
                      </TouchableHighlight>
                    </Block>
                  </Block>
                  <Text style={{ marginTop: theme.sizes.base}}>{item.content}</Text>
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
              </TouchableOpacity>*/
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
