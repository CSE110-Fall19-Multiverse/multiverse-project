import React, { Component } from 'react'
import { Dimensions, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';

import { Card, Button, Block, Text } from '../components';
import { theme, elements } from '../constants';

const { width } = Dimensions.get('window');

class Services extends Component {
  state = {
    active: '', 
    items: [],
  }

  componentDidMount() {
    this.setState({ items: this.props.items });
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
    //const { navigation } = this.props;
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
                //onPress={() => navigation.navigate('Services', { item })}
              >
                <Card shadow style={styles.item}>
                  <Block flex={false} row>
                    <Block row>
                      <Image source={item.avi}/>
                      <Block style={{ margin: theme.sizes.base / 4}}>
                        <Text bold caption>{item.author}</Text>
                        <Text gray caption>{item.date}</Text>
                      </Block>
                    </Block>
                    <Block>
                      <Text right semibold secondary>{item.category}</Text>
                      <Text right semibold>${item.proposed_price}</Text>
                    </Block>
                  </Block>
                  <Text style={{ marginTop: theme.sizes.base}}>{item.content}</Text>
                  <Icon 
                    name={'comment'} 
                    size={theme.sizes.base * 1.7}
                    style={styles.messaging}
                  />
                </Card>
              </TouchableOpacity>
            ))}
          </Block>
          
        </ScrollView>
        <Block>
          <Icon 
              name={'plus-circle'} 
              size={theme.sizes.base * 4}
              style={styles.plusCircle}
          />
          </Block>
         <Block flex={false} row style={styles.tabs}>
          {tabs.map(tab => this.renderTab(tab))}
        </Block>
       
      </Block>
    )
  }
}

Services.defaultProps = {
  items: elements.items,
}

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
    position: 'absolute',
    bottom: theme.sizes.base,
    right: theme.sizes.base * 2,
    color: theme.colors.lightBlue,
  },
  messaging: {
    position: 'absolute',
    bottom: theme.sizes.base * 2,
    right: theme.sizes.base * 2,
    color: theme.colors.lightBlue,
    //transform: [{ rotateY: '180deg' }]
  }

})
