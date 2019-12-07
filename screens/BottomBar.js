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
                    styles.tab,
                    isActive ? styles.active : null
                ]}
            >
                <Icon
                    name={m.get(tab)}
                    size={iconSize}
                    style={[
                        styles.icons,
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
const WIDTH_DIVISOR = 15;
const HEIGHT_DIVISOR = 45;
const iconSize = Dimensions.get('window').width/WIDTH_DIVISOR;
const iconPadding = Dimensions.get('window').height/HEIGHT_DIVISOR;
export default BottomBar;

const styles = StyleSheet.create({
    tabs: {
        flexDirection: 'row',
        height: iconSize + 3.1*iconPadding,
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        borderTopColor: theme.colors.gray2,
        borderTopWidth: 0.45
    },
    tab: {
        flexGrow: 1,
        paddingBottom: iconPadding
    },
    active: {
        borderTopColor: theme.colors.secondary,
        borderTopWidth: 2.3,
        paddingTop: 0.68*iconSize,
    },
    icons: {
        alignSelf: 'center',
        color: theme.colors.secondary,
        height: iconSize + 1*iconPadding,
    },
});