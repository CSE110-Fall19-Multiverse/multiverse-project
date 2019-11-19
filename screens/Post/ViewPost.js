import React, { Component } from 'react';
import {Card, Button, Block, Text, Divider} from '../../components';
import { withFirebase } from "../../components/Firebase";
import { theme, elements } from '../../constants';
import {
    Image,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    View
} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import BottomBar from "../BottomBar";
//import Icon from "react-native-vector-icons/index";

class ViewPostBase extends Component {
    state = {
        Select1: null,
        Select2: null,
        Summary: null,
        Description: null,
        service_date: null,
        post_date: null,
        price: null,
        uid: null,
        pid: null,
        actor: null,
        user_info: {},
    };

    componentDidMount(){
        const post_id = this.props.navigation.state.params.pid;
        const service_type = this.props.navigation.state.params.service_type;
        this.setState({pid: post_id, actor: service_type}, () => {this.process_info()})
    }

    process_info(){
        const that = this;
        const type = this.state.actor === 'buying' ? 'buying_posts' : 'selling_posts';
        console.log('actor: '+type);
        console.log('pid: '+this.state.pid);
        const ref = this.props.firebase.post(type, this.state.pid);
        ref.once('value', function(snap){
            const post = snap.val();
            that.setState({Select1: post.select_1, Select2: post.select_2, Summary: post.summary, Description: post.description, date: post.service_date, price: post.service_price, uid: post.uid, post_date: post.post_date}, () => {
                console.log('Summary: ' + that.state.Summary);
                console.log('date: ' + that.state.date);
                const user_ref = that.props.firebase.user(that.state.uid);
                console.log('user is '+that.state.uid);
                user_ref.once('value', function(snap){
                    const user = snap.val();
                    let user_info = {};
                    user_info['username'] = user.username;
                    user_info['displayName'] = user.displayname;
                    user_info['email'] = user.email;
                    that.setState({user_info: user_info}, () => {
                        console.log('email: ' + user_info['email']);
                        console.log('display name: ' + user_info['displayName']);
                    });
                });
            });
        });
    }

    render(){
        const { navigation } = this.props;
        return(
            <Block>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={"position"} >
                    <ScrollView showsVerticalScrollIndicator={true}>
                        <Block style={styles.inputs}>
                            <Block flex={false} row>
                                <Block row>
                                    <TouchableHighlight
                                        onPress={() => alert('Enter screen of person\'s pic')}
                                        underlayColor={'purple'}
                                        activeOpacity={0.69}
                                    >
                                        <Image source={elements.profile.avatar}/>
                                    </TouchableHighlight>
                                    <Block style={{ margin: theme.sizes.base / 4}}>
                                        <TouchableHighlight
                                            onPress={() => alert('Enter person\'s profile')}
                                            underlayColor={'white'}
                                            activeOpacity={0.5}
                                            // style={styles.textContainer}
                                        >
                                            <Text bold caption styles={{fontSize: 13}}>{'\n'} {this.state.user_info.displayName}</Text>
                                        </TouchableHighlight>
                                        <Text caption gray>{this.state.post_date}</Text>
                                    </Block>
                                </Block>
                                <Block>
                                    <TouchableHighlight
                                        onPress={() => alert('Filter by this category')}
                                        underlayColor={'white'}
                                        activeOpacity={0.5}
                                    >
                                        <Text right semibold secondary style={{fontSize: 12}}> {`${this.state.Select1}\n${this.state.Select2}`} </Text>
                                    </TouchableHighlight>
                                    <TouchableHighlight
                                        onPress={() => alert('item.price_negotiable ? {alert(\'price non-negotiable\')} : popup counteroffer screen')}
                                        underlayColor={'white'}
                                        activeOpacity={0.5}
                                    >
                                        <Text right semibold>${this.state.price}</Text>
                                    </TouchableHighlight>
                                </Block>
                            </Block>
                            <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
                                <Block>
                                    <Text style={{marginTop: 14, marginBottom: 14, fontSize:22, fontWeight: "800"}}>{this.state.Summary}</Text>
                                </Block>
                            </Block>
                            <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
                                <Block>
                                    <Text style={{ marginBottom: 14 }}>{this.state.Description}</Text>
                                </Block>
                            </Block>
                        </Block>

                        <Divider margin={[theme.sizes.base, theme.sizes.base * 2]} />

                        <Block margin={[10, 0]} style={styles.history}>
                            <Text gray style={{ marginBottom: 13 }}>Service Date</Text>
                            <Text> {this.state.date} </Text>
                        </Block>
                        <Block margin={[10, 0]} style={styles.messaging}>
                            <Text gray style={{ marginBottom: 13 }}>Service Price</Text>
                            <Text> ${this.state.price} </Text>
                        </Block>
                        <Block padding={[0, theme.sizes.base * 2]}>
                            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                                <TouchableOpacity
                                    onPress={() => alert('Comment')}
                                >
                                    <Icon
                                        name={'comment'}
                                        size={theme.sizes.base * 1.7}
                                        style={styles.messaging}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => alert('Add to favorite')}
                                >
                                    <Icon
                                        name={'star'}
                                        size={theme.sizes.base * 1.7}
                                        style={styles.messaging}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => alert('Message the post maker')}
                                >
                                    <Icon
                                        name={'user'}
                                        size={theme.sizes.base * 1.7}
                                        style={styles.messaging}
                                    />
                                </TouchableOpacity>
                            </View>
                        </Block>
                        <Divider />
                        <Block>
                            <Text caption gray style={{textAlign: 'center'}}> There is no comment here yet. </Text>
                        </Block>
                    </ScrollView>
                </KeyboardAvoidingView>

                <BottomBar navigation={this.props.navigation} active='ViewPost'/>
            </Block>
        )
    }
}

// Wrap ViewPostBase component in firebase component to use a same firebase agent.
const ViewPost = withFirebase(ViewPostBase);
export default ViewPost;
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
        color: theme.colors.lightBlue,
    },
});
