import React, { Component } from 'react'
import { Dimensions, Image, StyleSheet, ScrollView, TouchableOpacity, TouchableHighlight } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';

import { Card, Button, Block, Text } from '../components';
import { theme, elements } from '../constants';

const { width } = Dimensions.get('window');

class Marketplace extends Component {
  state = {
    active: 'Marketplace', 
    items: [],
    type: 'buying', // the type of items being displayed, default buying
  }

  componentDidMount() {
    this.setState({ items: this.props.items });
  }

  handleTab = tab => {
    const { navigation } = this.props;
    const { items } = this.props;
    if (tab === 'Marketplace') {
      tab = 'Marketplace'; 
    }
    if (tab === 'Search') {
      navigation.navigate('Search');
      tab = 'Search';
    }
    if (tab === 'Add') {
      navigation.navigate('Add');
      tab = 'Add';
    }
    if (tab === 'Chat') {
      navigation.navigate('Chat');
      tab = 'Chat';
    }
    if (tab === 'Account') {
      navigation.navigate('Account');
      tab = 'Account';
    }
    this.setState({ active: tab });
  }

  handleView = view => {
    this.setState({ type : view.toLowerCase() }); 
  }

  renderTab(tab) {
    const { active } = this.state;
    const isActive = active === tab;
    const imagePath = '../assets/icons/marketplace.png'; // can't make it dynamic cus bad, can have source={{uri: ...}} but this doesn't seem to work for some reason 

    return (
      <TouchableOpacity
        key={`tab-${tab}`}
        onPress={() => this.handleTab(tab)}
        style={[
          styles.tab,
          isActive ? styles.active : null
        ]}
      >
        <Image 
            style={styles.tabpic} 
            source={require(imagePath)} 
            // resizeMode='contain'
        />
      </TouchableOpacity>
    );
  }

  renderView(view)
  {
      const { type } = this.state; 
      const isActive = type===view.toLowerCase(); 

      return (
        <TouchableOpacity
            onPress={() => this.handleView(view)}
            style={[
                styles.view, 
                isActive ? styles.active : null
            ]}
        > 
            <Text size={14} bold={!isActive} bold secondary={isActive}>{view}</Text>
        </TouchableOpacity>
      );
  }

  render() {
    const { navigation } = this.props;
    const { items } = this.state;
    const tabs = ['Marketplace', 'Search', 'Add', 'Chat', 'Account'];
    const marketViews = ['Buying', 'Selling']; 

    return (
      <Block>
        <Block flex={false} row space="between" style={styles.header}>
          <Text h1 bold>Multiverse</Text>
        </Block>

        <Block flex={false} row style={styles.tabs}>
          {marketViews.map(view => this.renderView(view))}
        </Block>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingVertical: theme.sizes.base * 2}}
        >
          <Block flex={false} row space="between" style={styles.items}>
            {items.map(item => item.type===this.state.type ? (
              <TouchableOpacity
                key={item.id}
                //onPress={() => navigation.navigate('Services', { item })}
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
                          <Text bold caption>{item.author}</Text>
                        </TouchableHighlight>
                        <Text caption gray>{item.date}</Text>
                      </Block>
                    </Block>
                    <Block>
                      <TouchableHighlight
                        onPress={() => alert('Filter by this category')}
                        underlayColor={'white'}
                        activeOpacity={0.5}
                        // style={styles.textContainer}
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
            ): null )}
          </Block>
        </ScrollView>
        {/* <Block>
          <TouchableOpacity
            onPress={() => alert('Create new listing')}
            style={styles.plusCircleContainer}
          > 
            <Icon 
              name={'plus-circle'} 
              size={theme.sizes.base * 4}
              style={styles.plusCircle}
            />
          </TouchableOpacity>
        </Block> */}
        <Block flex={false} row style={styles.tabs}>
          {tabs.map(tab => this.renderTab(tab))}
        </Block>
       
      </Block>
    )
  }
}

Marketplace.defaultProps = {
  items: elements.items,
}

export default Marketplace;

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
