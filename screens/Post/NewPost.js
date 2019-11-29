import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
} from 'react-native';
import {Block, Button, Divider} from "../../components";
import {theme} from "../../constants";
import PickDate from "./PickDate";
import {DropDownList} from "./DropDownList";
import { withFirebase } from "../../components/Firebase";
import BottomBar from "../BottomBar";

class NewPostBase extends Component{

    state = {
        Select1: '',
        Select2: '',
        Summary: '',
        Description: '',
        serviceType: '',
        serviceDate: '',
        servicePrice: '',
        textArray:[],
    };

    componentDidMount() {
        this.checkExistedFields();
    }

    checkExistedFields() {
        if (!this.props.navigation.getParam('pid')) {
            return;
        }
        const type = this.props.navigation.getParam('service_type') === 'buying' ? 'buying_post_drafts' : 'selling_post_drafts';
        const ref = this.props.firebase.draft(type, this.props.navigation.getParam('pid'));
        const thisPost = this;
        ref.once('value', function (snap) {
            const post = snap.val();

            thisPost.setState(
                {
                    Select1: post.select_1, Select2: post.select_2, Summary: post.summary,
                    Description: post.description, date: post.service_date, price: post.service_price,
                    uid: post.uid, post_date: post.post_date
                },
                () => {
                    const user_ref = thisPost.props.firebase.user(thisPost.state.uid);

                    user_ref.once('value', function (snap) {
                        const user = snap.val();
                        let user_info = {};
                        user_info['username'] = user.username;
                        user_info['displayName'] = user.displayname;
                        user_info['email'] = user.email;
                        thisPost.setState({user_info: user_info}, () => {
                        });
                    });
                });
        });
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

    handlePost(draft) {
        // create a post object will new post can be added
        let ref;
        let cloud;
        if(draft){
            ref = this.state.serviceType === 'Tutor' ?  this.props.firebase.selling_post_drafts() : this.props.firebase.buying_post_drafts();
        }else {
            ref = this.state.serviceType === 'Tutor' ? this.props.firebase.selling_posts() : this.props.firebase.buying_posts();
        }
        const user = this.props.firebase.get_current_user();
        const posts = this.props.firebase.history_post_dir(this.state.serviceType === 'Student' ? 'buying' : 'selling', draft ? 'drafted' : 'posted', user.uid);
        const get_user = this.props.firebase.get_user_by_id(user.uid);


        // push new post to the post object
        ref.push({
            'service_type': this.state.serviceType,
            'select_1': this.state.Select1,
            'select_2': this.state.Select2,
            'summary': this.state.Summary,
            'description': this.state.Description,
            'service_date': this.state.serviceDate,
            'service_price': this.state.servicePrice,
            'post_status': draft ? 'drafted' : 'posted',
            'post_date': this.ShowCurrentDate(),
            'uid': user.uid,
        }).then((snap) => {
            posts.push( snap.key );

            //get data from firestore
            cloud = this.props.firebase.get_posts();
            let displayname;
            let that = this;
            get_user.once('value',function(snapshot) {
                const users = snapshot.val();
                displayname = users.displayname;

                console.log("The object inside is "+displayname);
                const combined_text = `${that.state.Description} ${that.state.Summary} ${that.state.Select1} ${that.state.Select2} ${displayname}`;
                let keywordsMapToAdd = that.generateKeywords(combined_text, true);
                cloud.add({
                    'service_type': that.state.serviceType,
                    'select_1': that.state.Select1,
                    'select_2': that.state.Select2,
                    'summary': that.state.Summary,
                    'description': that.state.Description,
                    'service_date': that.state.serviceDate,
                    'service_price': that.state.servicePrice,
                    'post_status': draft ? 'drafted' : 'posted',
                    'post_date': that.ShowCurrentDate(),
                    'uid': user.uid,
                    'keyword': keywordsMapToAdd,
                    'pid' : snap.key,
                });
            });
        });
    }

    generateKeywords(content, isPost)
        {
        // store lower case letters to enable case-insensitive search
        console.log("content is "+content);
        content = content.toLowerCase();

        // split by space and keep those words
        let keywords = [content];
        if (isPost)
        {
            keywords = content.split(' ');
        }
        let oldKeywords = keywords.slice();

        for(let word of oldKeywords)
        {
            let temp = '';
            for(let char of word)
            {
                temp += char;
                keywords.push(temp);
            }
        }

        // create a map so we can use query chaining
        let keywordsMap = {};
        for(let keyword of keywords) {
            keywordsMap[keyword] = true;
        }
        console.log("finish");
        return keywordsMap;
    }

    ShowCurrentDate(){
        const date = new Date().getDate();
        const month = new Date().getMonth() + 1;
        const year = new Date().getFullYear();

        return year + '-' + month + '-' + date
    }

    upload(navigation){
        this.handlePost(false);
        alert('Upload successfully!');
        navigation.navigate('Marketplace');
    }
    saveAsDraft(navigation){
        this.handlePost(true);
        alert('Saved as draft');
        navigation.navigate('Marketplace');
    }

    render() {
        const { navigation } = this.props;
        return (
            <Block >
                <Block flex={false} row space="between" style={styles.header}>
                    <Text style={{fontSize: 25, fontWeight: 'bold'}}>New Post</Text>
                </Block>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={"position"} >
                <ScrollView showsVerticalScrollIndicator={true}>
                    <Block style={styles.inputs}>
                        <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
                            <Block>
                                <Text style={{ marginBottom: 13, fontWeight: '600', fontSize: 17 }}>I am a</Text>
                            </Block>
                            <DropDownList parent={this}  label='serviceType' small={false} stype={true}/>
                        </Block>
                        <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
                            <Block>
                                <Text style={{ marginBottom: 13, fontWeight: '600', fontSize: 17 }}>Select 1</Text>
                            </Block>
                            <DropDownList parent={this}  label='Big Category' small={false} stype={false}/>
                        </Block>
                        <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
                            <Block>
                                <Text style={{ marginBottom: 13, fontWeight: '600', fontSize: 17 }}>Select 2</Text>
                            </Block>
                            <DropDownList parent={this} label={this.state.Select1} small={true} stype={false}/>
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

                <BottomBar navigation={this.props.navigation} active='NewPost'/>
            </Block>
        );
    }
}

// Wrap NewPostBase component in firebase component to use a same firebase agent.
const NewPost = withFirebase(NewPostBase);
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
});
