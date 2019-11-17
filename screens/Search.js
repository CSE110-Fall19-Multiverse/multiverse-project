import React, { Component } from 'react'
import { Animated, Dimensions, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';

import { Input, Block, Text } from '../components';
import { theme } from '../constants';
import BottomBar from "./BottomBar";

const { width, height } = Dimensions.get('window');

class Search extends Component {
  state = { 
    searchFocus: new Animated.Value(0.6),
    searchString: null,
  }

  handleSearchFocus(status) {
    Animated.timing(
      this.state.searchFocus,
      {
        toValue: status ? 0.8 : 0.6, // increase flex size when status is true
        duration: 150, // ms
      }
    ).start();
  }

  renderSearch() {
    const { searchString, searchFocus } = this.state;
    const isEditing = searchFocus && searchString;

    return (
      <Block animated middle flex={searchFocus} style={styles.search}>
        <Input
          placeholder="Search"
          placeholderTextColor={theme.colors.gray}
          style={styles.searchInput}
          onFocus={() => this.handleSearchFocus(true)}
          onBlur={() => this.handleSearchFocus(false)}
          onChangeText={text => this.setState({ searchString: text })}
          value={searchString}
          onRightPress={() => isEditing ? this.setState({ searchString: null }) : null}
          rightStyle={styles.searchRight}
          rightLabel={
            <Icon
              name={isEditing ? "close" : "search"}
              size={theme.sizes.base / 1.6}
              color={theme.colors.gray}
              style={styles.searchIcon}
            />
          }
        />
      </Block>
    )
  }

  render() {
    return (
      <Block>
        <Block flex={false} row center space="between" style={styles.header}>
          <Text h1 bold>Search</Text>
          {this.renderSearch()}
        </Block>
        <Block style={styles.category}>
          <Text bold lightBlue style={{ marginBottom: theme.sizes.base * 1.5}}>CATEGORY</Text>
          <Text bold secondary style={{ marginBottom: theme.sizes.base * 1.5}}>Learning and Skills</Text>
          <Text bold secondary style={{ marginBottom: theme.sizes.base * 1.5}}>Career</Text>
          <Text bold secondary style={{ marginBottom: theme.sizes.base * 1.5}}>Food Delivery</Text>
          <Text bold secondary style={{ marginBottom: theme.sizes.base * 1.5}}>Transportation</Text>
          <Text bold secondary style={{ marginBottom: theme.sizes.base * 1.5}}>Social</Text>
          <Text bold secondary style={{ marginBottom: theme.sizes.base * 1.5}}>Other</Text>
        </Block>

        <BottomBar navigation={this.props.navigation} active='Search'/>
      </Block>
    )
  }
}

Search.defaultProps = {
};

export default Search;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.sizes.base * 2,
    paddingBottom: theme.sizes.base * 2
  },
  search: {
    height: theme.sizes.base * 2,
    width: width - theme.sizes.base * 1.5,
  },
  searchInput: {
    fontSize: theme.sizes.body,
    height: theme.sizes.base * 2,
    backgroundColor: 'rgba(142, 142, 147, 0.06)',
    borderColor: 'rgba(142, 142, 147, 0.06)',
    paddingLeft: theme.sizes.base / 1.333,
    paddingRight: theme.sizes.base * 1.5,
  },
  searchRight: {
    top: 0,
    marginVertical: 0,
    backgroundColor: 'transparent'
  },
  searchIcon: {
    position: 'absolute',
    right: theme.sizes.base / 1.333,
    top: theme.sizes.base / 1.6,
  },
  category: {
    paddingHorizontal: theme.sizes.base * 2,
  },
})
