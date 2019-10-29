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
        Description: '',
        serviceDate: '',
        servicePrice: '',
    };

    componentDidMount() {
    }

    handleSummary = (text) => {
        this.setState({Summary: text});
    };

    handleDescription = (text) => {
        this.setState({Description: text});
    };

    servicePrice = (text) => {
        text = text.replace('$','');
        this.setState({servicePrice: text});
    };

    upload(navigation){
        //TODO: send this post information to database
        alert('Upload successfully!');
        navigation.navigate('Services');
    }
    saveAsDraft(navigation){
        //TODO: save this post information to the draft box pf this user
        alert('Saved as draft');
        navigation.navigate('Services');
    }

    render() {
        const { navigation } = this.props;
        return (
            <Block>
                <Block flex={false} row space="between" style={styles.header}>
                    <Text style={{fontSize: 25, fontWeight: 'bold'}}>New Post</Text>
                </Block>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={"position"} >
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
                                <Block>
                                <View elevation={5} style={styles.container}>
                                <TextInput
                                    placeholder='Summarize your service here...'
                                    style={styles.summary}
                                    onChangeText = {this.handleSummary}
                                    multiline={true}
                                />
                                </View>
                                </Block>
                        </Block>
                     </Block>
                        <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
                            <Block>
                                <Text style={{ marginBottom: 14 }}>Description</Text>
                                <Block>
                                 <View elevation={5} style={styles.container}>
                                <TextInput
                                    placeholder='Describe your service here...'
                                    style={styles.description}
                                    onChangeText = {this.handleDescription}
                                    multiline={true}
                                />
                                 </View>
                                </Block>
                            </Block>
                        </Block>
                    </Block>

                    <Divider margin={[theme.sizes.base, theme.sizes.base * 2]} />

                    <Block margin={[10, 0]} style={styles.history}>
                        <Text gray style={{ marginBottom: 13 }}>Service Date</Text>
                        <PickDate parent={this} />
                    </Block>
                    <Block margin={[10, 0]} style={styles.messaging}>
                        <Text gray style={{ marginBottom: 13 }}>Service Price</Text>
                        <TextInput
                            keyboardType='numeric'
                            maxLength={5}
                            placeholder='$'
                            onChangeText={this.servicePrice}
                            value={"$" + this.state.servicePrice}
                        />
                    </Block>
                    <Block padding={[0, theme.sizes.base * 2]}>
                        <Button gradient onPress={() => this.upload(navigation)}>
                            <Text style={{ color: 'white', fontWeight: '600', textAlign: 'center'}}>Upload</Text>
                        </Button>
                        <Button style={styles.border} onPress={() => this.saveAsDraft(navigation)}>
                            <Text style={{ color: 'black', fontWeight: '600', textAlign: 'center'}}>Save as Draft</Text>
                        </Button>
                    </Block>
                    <Divider />
                </ScrollView>
                </KeyboardAvoidingView>
            </Block>
        );
    }
}

export default NewPost;

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: theme.sizes.base * 2,
    },
    container:{
        padding: 7,
        backgroundColor:'white',
        borderColor: 'gray',
        shadowColor: "gray",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1
        }
    },
    inputs: {
        marginTop: theme.sizes.base * 0.7,
        paddingHorizontal: theme.sizes.base * 2,
        textAlign: 'left',
    },
    border:{
        borderColor: '#e8e8e8',
        borderWidth: 1,
        shadowColor: 'gray',
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowRadius: 3,
        shadowOpacity: 1
    },
    summary: {
        height: 70,
    },
    description:{
        height: 180,
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
