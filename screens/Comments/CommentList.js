import React, { Component } from 'react';
import { TextInput, StyleSheet, Text, View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import {withFirebase} from "../../components/Firebase";
import {theme} from "../../constants";
import Comment from "../Comments/Comment";
import CommentInput from "../Comments/CommentInput";

class CommentListBase extends Component {
    state = {
        refreshing: false,
        comments: [],
        pid: null,
        type: null,
    };

    componentDidMount() {
        this.setState({comments: []});
        let that = this;
        this.setState({pid: this.props.pid});
        const com_dir = this.props.firebase.comments_dir(this.props.type === 'buying' ? 'buying_posts' : 'selling_posts', this.props.pid);

        com_dir.once('value', function(snap){
            snap.forEach(function (childSnap) {
                let cid = childSnap.val();
                let temp = that.state.comments;
                temp.push(cid);
                that.setState({comments: temp});
            });
        });
    }

    refresh = () => {
        this.setState({refreshing: true});
        // reload posts from firebase
        this.componentDidMount();
        this.setState({refreshing: false});
    };

    handleSubmit(content, type, pid, uid){
        const com = this.props.firebase.comments();
        const com_dir = this.props.firebase.comments_dir(type === 'buying' ? 'buying_posts' : 'selling_posts', pid);
        com.push({
            'uid': uid,
            'content': content,
            'created': this.get_time(),
        }).then((snap) => {
            com_dir.push( snap.key );
        });
        alert('Submitted!');
        this.componentDidMount();
    }

    get_time(){
        const da = new Date();
        const date = da.getDate();
        const month = da.getMonth() + 1;
        const year = da.getFullYear();
        const hour = da.getHours();
        let min = da.getMinutes();
        let sec = da.getSeconds();
        if(min < 10) min = '0' + min;
        if(sec < 10) sec = '0' + sec;
        const time = year + '-' + month + '-' + date+'T'+hour+':'+min+':'+sec;
        console.log(time);
        return time;
    }

    render() {
        const { comments } = this.state;
        return (
            <View style={styles.container}>
                {/* Scrollable list */}
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.refresh()} />
                    }
                    showsVerticalScrollIndicator={true}
                    style={{ paddingVertical: theme.sizes.base * 2}}
                >
                    {/* Render each comment with Comment component */}
                    {comments.map(comment => <Comment cid={comment} />)}
                </ScrollView>
                {/* Comment input box */}
                <CommentInput ref={input => this.comment_input = input} pid = {this.props.pid} type = {this.props.type} typing = {this.props.typing} parent={this}/>
            </View>
        );
    }
}

const CommentList = withFirebase(CommentListBase);
export default CommentList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingTop: 20,
    }
});