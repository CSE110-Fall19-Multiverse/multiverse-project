import React, { Component } from 'react'
import { Dimensions, Image, StyleSheet, ScrollView, TouchableOpacity, TouchableHighlight, RefreshControl } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';

import { Card, Block, Text } from '../../components';
import { theme } from '../../constants';
import {withFirebase} from "../../components/Firebase";
import BottomBar from "../BottomBar";
import Post from "./Post";


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

  addToItems ( values, user_res, temp_items ){
    // Base case
    if (! (Array.isArray(values) && values.length) ) {
      temp_items.reverse();
      this.setState({items : temp_items});
    } else {
      // Recursive call
      let pid = values[0];
      let res = {};
      const post_ref_generator = this.props.navigation.getParam('isDraft') ?
          this.props.firebase.draft : this.props.firebase.post;
      const post_ref = post_ref_generator(this.state.buying, pid);
      let thisComponent = this;
      post_ref.once("value", function (snap) {
        // get post info
        if (pid !== 0) {
          const value = snap.val();
          res['id'] = snap.key;
          try {
            res['summary'] = value.summary;
            res['description'] = value.description;
            res['select_1'] = value.select_1;
            res['select_2'] = value.select_2;
            res['service_type'] = value.service_type;
            res['service_date'] = value.service_date;
            res['service_price'] = value.service_price;
          } catch (e) {
            console.log(e);
          }
          res['user_info'] = user_res;
          temp_items.push(res);
        }
        values.splice(0, 1);
        thisComponent.addToItems(values, user_res, temp_items);
      });
    }
  };

  componentDidMount(){
    this.setState({items: []});
    let ref;
    switch (this.props.navigation.getParam('type')) {
      case 'liked' :
        ref = this.props.firebase.liked_post_dir(this.state.buying ? 'buying' : 'selling', this.props.navigation.getParam('uid'));
        break;
      case 'history' :
        ref = this.props.firebase.history_post_dir(this.state.buying ? 'buying' : 'selling', 'posted',
            this.props.navigation.getParam('uid'));
        break;
      case 'drafts' :
        ref = this.props.firebase.history_post_dir(this.state.buying ? 'buying' : 'selling', 'drafted',
            this.props.navigation.getParam('uid'));
        break;
      default:
        break;
    }
    let thisComponent = this;

    // load posts from firebase once
    ref.once("value", function(snapshot) {
      // get user info
      const user_ref = thisComponent.props.firebase.user(thisComponent.props.navigation.getParam('uid'));
      let user_res = {};
      user_ref.once('value', function(snap) {
        const user = snap.val();
        try{
          user_res['username'] = user.email;
          user_res['displayname'] = user.displayname;

          thisComponent.addToItems(Object.values(snapshot.val()), user_res, []);
        }catch (e) {
          console.log(e);
        }
      });
    });
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
    const { items }      = this.state;
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

            {items.length === 0 ? null : items.map(item => (
                <Post item={item} navigation={this.props.navigation} />
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
const LikedPosts = withFirebase(PostRecordBase);

export {PostHistory, Drafts, LikedPosts};

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

});
