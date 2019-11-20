import React, { Component } from 'react'
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';

import { Block } from '../components';
import { theme } from '../constants';
import {withFirebase} from "../components/Firebase";

class BottomBarBase extends Component{
    state = {
        active : this.props.active
    };

    handleTab = tab => {
        const { navigation } = this.props;
        navigation.navigate(tab);
    };

    renderTab(tab) {
        const { active } = this.state;
        const isActive = active === tab;
        const m = new Map();
        const screenWidth = Dimensions.get('window').width;
        const screenHeight = Dimensions.get('window').height;
        m.set('Marketplace', 'home');
        m.set('Search', 'search');
        m.set('NewPost', 'plus-circle');
        m.set('ChatRoom', 'comment');
        m.set('Account', 'user');

        return (
            <TouchableOpacity
                key={`tab-${tab}`}
                onPress={() => this.handleTab(tab)}
                style={[
                    styles.tab
                ]}
            >
                <Icon
                    name={m.get(tab)}
                    size={screenWidth/WIDTH_DIVISOR}
                    style={[
                        styles.icons,
                        isActive ? styles.active : null
                    ]}
                />
            </TouchableOpacity>
        );
    }

    render() {
        const tabs = ['Marketplace', 'Search', 'NewPost', 'ChatRoom', 'Account'];
        return (
            <View
                style={[
                    styles.tabs
                ]}
            >
                {tabs.map(tab => this.renderTab(tab))}
            </View>
        );
    }
}

const BottomBar = withFirebase(BottomBarBase);
const WIDTH_DIVISOR = 13;
const HEIGHT_DIVISOR = 45;
export default BottomBar;

const styles = StyleSheet.create({
    tabs: {
        flexDirection: 'row',
        height: Dimensions.get('window').width/WIDTH_DIVISOR + 2*Dimensions.get('window').height/HEIGHT_DIVISOR,
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        borderTopColor: theme.colors.secondary,
        borderTopWidth: 0.75
    },
    tab: {
        flexGrow: 1,
        paddingBottom: Dimensions.get('window').height/HEIGHT_DIVISOR
    },
    active: {
        borderBottomColor: theme.colors.secondary,
        borderBottomWidth: 2,
    },
    icons: {
        alignSelf: 'center',
        color: theme.colors.secondary,
    }
});