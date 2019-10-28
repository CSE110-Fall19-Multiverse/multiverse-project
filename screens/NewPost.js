import React, { Component } from 'react';
import {StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView} from 'react-native';
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

    handleSelect1 = () => {

    };

    handleSelect2 = () => {

    };

    handleSummary = () => {

    };

    handleDescription = () => {

    };

    render() {
        return (
            <Block>
                <Block flex={false} row space="between" style={styles.header}>
                    <Text style={{fontSize: 25, fontWeight: 'bold'}}>New Post</Text>
                </Block>

                <ScrollView showsVerticalScrollIndicator={true}>
                    <Block style={styles.inputs}>
                        <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
                            <Block>
                                <Text style={{ marginBottom: 10, fontWeight: 'bold', fontSize: 16 }}>Select 1</Text>
                            </Block>
                            const res1 = <DropDownList label='Big Category' />
                            this.setState({Select1: res1.select1})
                        </Block>
                        <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
                            <Block>
                                <Text h2 bold style={{ marginBottom: 10, fontWeight: 'bold', fontSize: 16 }}>Select 2</Text>
                            </Block>
                            <DropDownList label={'Small Category'} />
                        </Block>
                        <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
                            <Block>
                                <Text h2 bold style={{ marginBottom: 10 }}>Summary</Text>
                            </Block>
                            <TextInput placeholder='Summarize your service here...' style={{borderColor: '#aaaaaa' , borderWidth: 1}} />
                        </Block>
                        <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
                            <Block>
                                <Text h3 bold style={{ marginBottom: 10 }}>Description</Text>
                            </Block>
                            <TextInput placeholder='Describe your service here...' style={{borderColor: '#aaaaaa', borderWidth: 1}} />
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
    },
    textinputs: {
        borderColor: 'gray',
        borderWidth: 1,
    },
    inputRow: {
        alignItems: 'flex-end'
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
