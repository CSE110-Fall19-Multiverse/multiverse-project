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
                    size={theme.sizes.base * 1.7}
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
export default BottomBar;

const styles = StyleSheet.create({
    tabs: {
        flexDirection: 'row', 
        height: theme.sizes.base * 2.5, 
        justifyContent: 'space-around', 
        alignItems: 'flex-end', 
        borderTopColor: theme.colors.secondary, 
        borderTopWidth: 1
    },
    tab: {
        flexGrow: 1, 
        //marginHorizontal: theme.sizes.base,
        paddingBottom: theme.sizes.base / 2,
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