import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';

export class DropDownList extends Component {
    constructor(props) {
        super(props);

        this.onChangeText = this.onChangeText.bind(this);

        this.typographyRef = this.updateRef.bind(this, 'typography');

        this.state = {
            select1: '',
        };
    }

    onChangeText(text) {
        this.setState({select1: text});
        ['name', 'code', 'sample', 'typography']
            .map((name) => ({ name, ref: this[name] }))
            .filter(({ ref }) => ref && ref.isFocused())
            .forEach(({ name, ref }) => {
                this.setState({ [name]: text });
            });
    }

    updateRef(name, ref) {
        this[name] = ref;
    }

    render() {
        let { typography, name, code, sample } = this.state;

        let textStyle = [
            styles.text,
            styles[typography],
            styles[name + code],
        ];

        return (
            <View style={styles.container}>
                <Dropdown
                    ref={this.typographyRef}
                    value={typography}
                    onChangeText={this.onChangeText}
                    label={this.props.label}
                    data={BigCate}
                />
            </View>
        );
    }
}

const styles = {
    container: {
        flex: 2,
        marginHorizontal: 4,
        marginVertical: 8,
        paddingHorizontal: 8,
        //backgroundColor: '#E8EAF6',
    },
};

const BigCate = [
    { value: 'CSE Course Tutoring' },
    { value: 'Interview Preparation' },
    { value: 'Languages Tutoring' },
];