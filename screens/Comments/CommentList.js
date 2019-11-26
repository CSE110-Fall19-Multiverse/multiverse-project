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
        console.log('inside List: '+this.props.pid);
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

    render() {
        const { comments } = this.state;
        return (
            <View style={styles.container}>
                {/* Scrollable list */}
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.refresh()} />
                    }
                    showsVerticalScrollIndicator={false}
                    style={{ paddingVertical: theme.sizes.base * 2}}
                >
                    {/* Render each comment with Comment component */}
                    {comments.map(comment => <Comment cid={comment} />)}
                </ScrollView>
                {/* Comment input box */}
                <CommentInput pid = {this.props.pid} type = {this.props.type}/>
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