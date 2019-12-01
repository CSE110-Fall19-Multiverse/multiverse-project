import React, { Component } from 'react';
import { Text, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import {withFirebaseAndRef} from "../../components/Firebase/context";
import { Animated, Dimensions, Keyboard, StyleSheet, TextInput, UIManager } from 'react-native';

const { State: TextInputState } = TextInput;

class CommentInputBase extends Component {
    state = {
        pid: '',
        uid: '',
        type: null,
        content: '',
        created: null,
        shift: new Animated.Value(0),
    };

    componentDidMount() {
        const user_ref = this.props.firebase.get_current_user();
        this.setState({pid: this.props.pid, uid: user_ref.uid, type: this.props.type});
    }

    componentWillMount() {
        this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
        this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
    }

    handleKeyboardDidShow = (event) => {
        const { height: windowHeight } = Dimensions.get('window');
        const keyboardHeight = event.endCoordinates.height;
        const currentlyFocusedField = TextInputState.currentlyFocusedField();
        UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
            const fieldHeight = height;
            const fieldTop = pageY;
            const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight);
            if (gap >= 0) {
                return;
            }
            Animated.timing(
                this.state.shift,
                {
                    toValue: gap,
                    duration: 0,
                    useNativeDriver: true,
                }
            ).start();
        });
    };

    handleKeyboardDidHide = () => {
        Animated.timing(
            this.state.shift,
            {
                toValue: 0,
                duration: 0,
                useNativeDriver: true,
            }
        ).start();
    };

    componentWillUnmount() {
        this.keyboardDidShowSub.remove();
        this.keyboardDidHideSub.remove();
    }

    // Update state when input changes
    onChangeText = (text) => this.setState({ content: text });

    onSubmitEditing = ({ nativeEvent: { text } }) => this.setState({ content: text }, this.submit);

    // Call this.props.onSubmit handler and pass the comment
    submit = () => {
        const { content } = this.state;
        this.text_input.setNativeProps({ text: ' ' });
        if (content) {
            this.setState({ content: '' }, () => this.props.parent.handleSubmit(content, this.props.type, this.props.pid, this.state.uid));
        } else {
            alert('Please enter your comment first');
        }
    };

    render(){
        const { shift } = this.state;
        return (
            // This moves children view with input field and submit button
            // up above the keyboard when it's active
            <KeyboardAvoidingView
                style={{position: 'absolute', left: 0, right: 0, bottom: 0}}
                behavior="position"
            >
                <Animated.View style={[styles.container, { transform: [{translateY: shift}] }]}>
                    {/* Comment input field */}
                    <TextInput
                        ref={input => this.text_input = input}
                        placeholder="Add a comment..."
                        autoFocus = {false}// focus and show the keyboard
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
                </Animated.View>
            </KeyboardAvoidingView>
        );
    }
}

const CommentInput = withFirebaseAndRef(CommentInputBase);
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