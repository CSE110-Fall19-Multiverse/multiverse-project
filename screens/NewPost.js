import React, { Component } from 'react';
import {StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView} from 'react-native';
import {Block, Button, Divider} from "../components";
import {theme} from "../constants";
import PickDate from "./PickDate";
import {DropDownList} from "./DropDownList";

class NewPost extends Component{
    state = {
        Select1: '',
        Select2: '',
        Summary: '',
        Description: ''
    };

    componentDidMount() {
    }

    handleSummary = (text) => {
        this.setState({Summary: text});
    };

    handleDescription = (text) => {
        this.setState({Description: text});
    };

    upload(navigation){
        //TODO: send this post information to database
        alert('Upload successfully!');
        navigation.navigate('Services');
    }

    render() {
        const { navigation } = this.props;
        return (
            <Block>
                <Block flex={false} row space="between" style={styles.header}>
                    <Text style={{fontSize: 25, fontWeight: 'bold'}}>New Post</Text>
                </Block>
                <ScrollView showsVerticalScrollIndicator={true}>
                    <Block style={styles.inputs}>
                        <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
                            <Block>
                                <Text style={{ marginBottom: 13, fontWeight: 'bold', fontSize: 17 }}>Select 1</Text>
                            </Block>
                            <DropDownList parent={this}  label='Big Category' small={false}/>
                        </Block>
                        <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
                            <Block>
                                <Text style={{ marginBottom: 13, fontWeight: 'bold', fontSize: 17 }}>Select 2</Text>
                            </Block>
                            <DropDownList parent={this} label='Small Category' small={true} />
                        </Block>
                        <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
                            <Block>
                                <Text style={{ marginBottom: 14 }}>Summary</Text>
                                <Block style={styles.border}>
                                <TextInput
                                    placeholder='Summarize your service here...'
                                    style={styles.summary}
                                    onChangeText = {this.handleSummary}
                                    multiline={true}
                                />
                                </Block>
                            </Block>
                        </Block>
                        <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
                            <Block>
                                <Text style={{ marginBottom: 14 }}>Description</Text>
                                <Block style={styles.border}>
                                <TextInput
                                    placeholder='Describe your service here...'
                                    style={styles.description}
                                    onChangeText = {this.handleDescription}
                                    multiline={true}
                                />
                                </Block>
                            </Block>
                        </Block>
                    </Block>

                    <Divider margin={[theme.sizes.base, theme.sizes.base * 2]} />

                    <Block margin={[10, 0]} style={styles.history}>
                        <Text gray style={{ marginBottom: 10 }}>Service Date</Text>
                        <PickDate />
                    </Block>
                    <Block margin={[10, 0]} style={styles.messaging}>
                        <Text gray style={{ marginBottom: 10 }}>Service Price</Text>
                        <TextInput placeholder='$' />
                    </Block>
                    <Block padding={[0, theme.sizes.base * 2]}>
                        <Button gradient onPress={() => this.upload(navigation)}>
                            <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center'}}>Upload</Text>
                        </Button>
                    </Block>
                    <Divider />
                </ScrollView>
            </Block>
        );
    }
}

export default NewPost;

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: theme.sizes.base * 2,
    },
    avatar: {
        height: theme.sizes.base * 2.2,
        width: theme.sizes.base * 2.2,
    },
    inputs: {
        marginTop: theme.sizes.base * 0.7,
        paddingHorizontal: theme.sizes.base * 2,
        textAlign: 'left',
    },
    border:{
        borderColor: '#d296e3',
        borderWidth: 1,
        shadowColor: '#d296e3',
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowRadius: 3,
        shadowOpacity: 1
    },
    summary: {
        height: 70,
        padding: 7,
    },
    description:{
        height: 180,
        padding: 7,
    },
    inputRow: {
        alignItems: 'flex-end',
    },
    history: {
        marginTop: theme.sizes.base * 0.7,
        paddingHorizontal: theme.sizes.base * 2,
    },
    messaging: {
        marginTop: theme.sizes.base * 0.7,
        paddingHorizontal: theme.sizes.base * 2,
    },
})
