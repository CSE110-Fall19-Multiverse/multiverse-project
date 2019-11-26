import React, { Component } from 'react';
import { TextInput, Text, View, ScrollView, TouchableOpacity, RefreshControl, StyleSheet,  KeyboardAvoidingView } from 'react-native';
import {withFirebase} from "../../components/Firebase";
import {Block} from "../../components";

class CommentInputBase extends Component {
    state = {
        pid: '',
        uid: '',
        type: null,
        content: '',
        created: null,
    };

    componentDidMount() {
        console.log('inside componentdidmount: '+this.props.pid);
        const user_ref = this.props.firebase.get_current_user();
        this.setState({pid: this.props.pid, uid: user_ref.uid, type: this.props.type});
    }

    // Update state when input changes
    onChangeText = (text) => this.setState({ content: text });

    onSubmitEditing = ({ nativeEvent: { text } }) => this.setState({ content: text }, this.submit);

    // Call this.props.onSubmit handler and pass the comment
    submit = () => {
        const { content } = this.state;
        if (content) {
            this.setState({ content: '' }, () => this.handleSubmit(content));
        } else {
            alert('Please enter your comment first');
        }
    };

    handleSubmit(content){
        const com = this.props.firebase.comments();
        const com_dir = this.props.firebase.comments_dir(this.props.type === 'buying' ? 'buying_posts' : 'selling_posts', this.props.pid);
        com.push({
            'uid': this.state.uid,
            'content': content,
            'created': this.get_time(),
        }).then((snap) => {
                com_dir.push( snap.key );
            });
        alert('Submitted!');
    }

    get_time(){
        const da = new Date();
        const date = da.getDate();
        const month = da.getMonth() + 1;
        const year = da.getFullYear();
        const hour = da.getHours();
        const min = da.getMinutes();
        const sec = da.getSeconds();
        const time = year + '-' + month + '-' + date+'T'+hour+':'+min+':'+sec;
        console.log(time);
        return time;
    }

    render(){
        return (
            // This moves children view with input field and submit button
            // up above the keyboard when it's active
            <KeyboardAvoidingView
                behavior='position'
            >
                <View style={styles.container}>
                    {/* Comment input field */}
                    <TextInput
                        placeholder="Add a comment..."
                        keyboardType="twitter" // keyboard with no return button
                        autoFocus={true} // focus and show the keyboard
                        style={styles.input}
                        value={this.state.text}
                        onChangeText={this.onChangeText} // handle input changes
                        onSubmitEditing={this.onSubmitEditing} // handle submit event
                    />
                    {/* Post button */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={this.submit}
                    >
                        {/* Apply inactive style if no input */}
                        <Text style={[styles.text, !this.state.text ? styles.inactive : []]}>Post</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        );
    }
}

const CommentInput = withFirebase(CommentInputBase);
export default CommentInput;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        flexDirection: 'row',
        borderTopWidth: 1,
        borderColor: '#EEE',
        alignItems: 'center',
        paddingLeft: 15,
    },
    input: {
        flex: 1,
        height: 40,
        fontSize: 15,
    },
    button: {
        height: 40,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inactive: {
        color: '#CCC',
    },
    text: {
        color: '#3F51B5',
        fontWeight: 'bold',
        fontFamily: 'Avenir',
        textAlign: 'center',
        fontSize: 15,
    },
});