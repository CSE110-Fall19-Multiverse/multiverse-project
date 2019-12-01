import React, { Component } from 'react';
import { Text, View, StyleSheet,Image } from 'react-native';
import {withFirebase} from "../../components/Firebase";
import moment from 'moment';


class CommentBase extends Component {
   state = {
       uid: null,
       cid: null,
       content: null,
       avatar: null,
       username: null,
       created: null,
   };

   componentDidMount() {
        this.setState({cid: this.props.cid}, () => {this.process_info()});
   }

   process_info(){
       const com_ref = this.props.firebase.comment(this.state.cid);
       let that = this;
       com_ref.once('value', function(snap){
          const com = snap.val();
          that.setState({uid: com.uid, content: com.content, created: com.created}, () => {that.get_user_info()});
       });
   }

   get_user_info(){
       const user_ref = this.props.firebase.user(this.state.uid);
       let that = this;
       user_ref.once('value', function(snap){
           const user = snap.val();
           that.setState({username: user.displayname});
       });
       this.props.firebase.avatar(this.state.uid).child("avatar").getDownloadURL().then(uri => {
           const avatar = {uri: uri};
           this.setState({avatar: avatar});
       }).catch(e => this.setState({avatar: require('../../assets/images/default_avatar.jpg')}))
   }

   render(){
       const { content, username, created, avatar} = this.state;

       return (
           <View style={styles.container}>
               <View style={styles.avatarContainer}>
                   {avatar && <Image
                       resizeMode='contain'
                       style={styles.avatar}
                       source={avatar}
                   />}
               </View>
               <View style={styles.contentContainer}>
                   <Text>
                       <Text style={[styles.text, styles.name]}>{username}</Text>
                       {' '}
                       <Text style={styles.text}>{content}</Text>
                   </Text>
                   <Text style={[styles.text, styles.created]}>{moment(created).fromNow()}</Text>
               </View>
           </View>
       );
   }
}

const Comment = withFirebase(CommentBase);
export default Comment;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    avatarContainer: {
        alignItems: 'center',
        marginLeft: 5,
        paddingTop: 10,
        width: 40,
    },
    contentContainer: {
        flex: 1,
        borderBottomWidth: 1,
        borderColor: '#EEE',
        padding: 5,
    },
    avatar: {
        borderWidth: 1,
        borderColor: '#EEE',
        borderRadius: 13,
        width: 26,
        height: 26,
    },
    text: {
        color: '#000',
        fontFamily: 'Avenir',
        fontSize: 15,
    },
    name: {
        fontWeight: 'bold',
    },
    created: {
        color: '#BBB',
    },
});