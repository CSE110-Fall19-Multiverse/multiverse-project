import React, { Component } from 'react'
import { Animated, Image, Dimensions, StyleSheet, ScrollView, TouchableWithoutFeedback, TouchableOpacity, TouchableHighlight, Keyboard } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';

import { Input, Block, Text, Card } from '../components';
import { theme } from '../constants';
import { withFirebase } from "../components/Firebase"
import BottomBar from "./BottomBar";

const { width, height } = Dimensions.get('window');

class SearchBase extends Component {
  state = { 
    searchFocus: new Animated.Value(0.6),
    searchString: null,
    items: [],
    viewSearch: false
  }

  async handleSearchPost(e){
      var removed_ = e.replace(/\s{2,}/g," ");
      var keywords = removed_.split(' ');
      let temp = [];
      let that = this;
      for(let keyword of keywords)
      {
          temp.push(keyword.toLowerCase().replace(/[^\w\s]/gi, ''));
      } 
   
      // chain '==' queries in a loop to effectively obtain the intersection
      const ref = this.props.firebase.get_posts();
      let partialQueryResult = ref; // after the loop finish this will contain results
      for(let keyword of temp)
      {
           partialQueryResult = partialQueryResult.where(`keyword.${keyword}`, '==', true);
      } // type of partialQueryResult: Query
      // use get() which returns Promise<QuerySnapshot>
      let results = await partialQueryResult.get().catch(e => {
          console.log('Error thrown at get() in searchWithMultipleKeywords(): ');
          console.log(e);
      }); // now results should be a QuerySnapshot
   
      if(results.empty)
      {
          console.log('Did not find any results when searching for keywords:');
          console.log(keyword);
      }
      for(let doc of results.docs)
      {
        console.log('The document id is: ' + doc.id);
        console.log('The post description is: ' + doc.get('description'));
        let res = {};
        let user_res = {};
        let value = doc.data();
        console.log(value);
       
        const user_ref = that.props.firebase.user(value.uid);
        user_ref.once('value', function(snap){
          const user = snap.val();
          try{
            user_res['username'] = user.email;
            user_res['displayname'] = user.displayname;
            user_res['uid'] = value.uid;
          }catch (e) {}
    
          res['id'] = value.uid;
          res['summary'] = value.summary;
          res['description'] = value.description;
          res['select_1'] = value.select_1;
          res['select_2'] = value.select_2;
          res['service_type'] = value.service_type;
          res['service_date'] = value.service_date;
          res['service_price'] = value.service_price;
          res['user_info'] = user_res;
          res['pid'] = doc.id; 
          let temp = that.state.items;
          temp.push(res);
          that.setState({items: temp});
        })
      }
    /*
    let that = this;
    let temp = this.props.firebase.get_posts(); 
    var a = e.split(" ");
    console.log(a);
    for(var s of a){
    const snapshot = await temp.where('array', 'array-contains',s).get().catch(e=>{
      console.log("cannot find data");
      return;
    });
    console.log("this is"+s);
    snapshot.forEach(doc=>{
      let res = {};
      let user_res = {};
      let value = doc.data();
       
      const user_ref = that.props.firebase.user(value.uid);
          user_ref.once('value',function(snap){
          user_res['username'] = user_ref.email;
          user_res['displayname'] = user_ref.displayname;
          user_res['uid'] = value.uid;
      })
          res['id'] = value.uid;
          res['summary'] = value.summary;
          res['description'] = value.description;
          res['select_1'] = value.select_1;
          res['select_2'] = value.select_2;
          res['service_type'] = value.service_type;
          res['service_date'] = value.service_date;
          res['service_price'] = value.service_price;
          res['user_info'] = user_res;
          res['pid'] = doc.id; 
          let temp = that.state.items;
          temp.push(res);
          that.setState({items: temp});
    })
  }
/*
    temp.where('array','array-contains', e).get().then((snapshot)=>{
        snapshot.docs.forEach((doc) =>{
          let res = {};
          let user_res = {};
          let value = doc.data();
         
          // get user
          const user_ref = that.props.firebase.user(value.uid);
          user_ref.once('value',function(snap){
            user_res['username'] = user_ref.email;
            user_res['displayname'] = user_ref.displayname;
            user_res['uid'] = value.uid;
          })
          res['id'] = value.uid;
          res['summary'] = value.summary;
          res['description'] = value.description;
          res['select_1'] = value.select_1;
          res['select_2'] = value.select_2;
          res['service_type'] = value.service_type;
          res['service_date'] = value.service_date;
          res['service_price'] = value.service_price;
          res['user_info'] = user_res;
          res['pid'] = doc.id; 
          let temp = that.state.items;
          temp.push(res);
          that.setState({items: temp});
      });
    }).catch((error)=>{
      console.log("can't find data");
    })
*/

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
          onRightPress={() => isEditing ? (this.setState({ searchString: null }),
                        this.setState({viewSearch:false}), this.setState({items :[]})) : null }
          onSubmitEditing={ () => isEditing ? (this.handleSearchPost(searchString),this.setState({viewSearch:true}), this.setState({items:[]})) : null}
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

  renderSearchCategory(){
    const { searchString, viewSearch } = this.state;
    const inSearch = viewSearch && searchString;
    if(!inSearch){
    return (
      <Block>
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
    );
    }
  }

  renderSearchPost(){
    const { items } = this.state;
    //console.log("the length is"+items.length);
    const { searchString, viewSearch } = this.state;
    const inSearch = viewSearch && searchString;
    const {navigation} = this.props;
    if(inSearch)
    return (
    <ScrollView
    showsVerticalScrollIndicator={false}
    style={{ paddingVertical: theme.sizes.base * 2}}
  >
    <Block flex={false} row space="between" style={styles.items}>
      {items.map(item => (
          <TouchableOpacity
              key={item.id}
              onPress={() => alert('Enter person\'s profile')}
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
    );
  }

  render() {
    return (
      <Block>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <Block>
        <Block flex={false} row center space="between" style={styles.header}>
          <Text h1 bold>Search</Text>
          {this.renderSearch()}
        </Block>
           {this.renderSearchCategory()}
           {this.renderSearchPost()}
           </Block>
        </TouchableWithoutFeedback>
      </Block>
    );
  }
}

const Search = withFirebase(SearchBase);
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
