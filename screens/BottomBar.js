import React, { Component } from 'react'
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native'
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
        m.set('Marketplace', 'building-o');
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
                    size={theme.sizes.base * 1.7}
                    style={styles.messaging}
                />
            </TouchableOpacity>
        );
    }

    render() {
        const tabs = ['Marketplace', 'Search', 'NewPost', 'ChatRoom', 'Account'];
        return (
            <Block flex={false} row style={styles.tabs}>
                {tabs.map(tab => this.renderTab(tab))}
            </Block>
        );
    }
}

const BottomBar = withFirebase(BottomBarBase);
export default BottomBar;

const styles = StyleSheet.create({
    tabs: {
        borderTopColor: theme.colors.black,
        borderTopWidth: StyleSheet.hairlineWidth,
        justifyContent: 'center',
        paddingVertical: theme.sizes.base * 1.5,
    },
    tab: {
        marginHorizontal: theme.sizes.base,
        paddingBottom: theme.sizes.base / 2,
    },
    active: {
        borderBottomColor: theme.colors.secondary,
        borderBottomWidth: 3,
    },
    messaging: {
        color: theme.colors.lightBlue,
    }
});