import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';

export class DropDownList extends Component {
    constructor(props) {
        super(props);

        this.onChangeText = this.onChangeText.bind(this);

        this.state = {
            select1: '',
            contents: '',
        };
    }

    onChangeText(text) {
        this.setState({select1: text});
        if (this.props.small) {
            this.props.parent.setState({Select2: text});
        }else {
            this.props.parent.setState({Select1: text});
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Dropdown
                    onChangeText={this.onChangeText}
                    label={this.props.label}
                    data= {this.props.small ? subCatDict[this.props.label] : BigCate}
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
    },
};

const BigCate = [
    { value: 'CSE Course Tutoring' },
    { value: 'Interview Preparation' },
    { value: 'Languages Tutoring' },
];

const CSECourse = [
    { value: 'CSE 8A' },
    { value: 'CSE 8B' },
    { value: 'CSE 12' },
    { value: 'CSE 15L' },
    { value: 'CSE 21' },
    { value: 'CSE 30' },
    { value: 'CSE 100' },
    { value: 'CSE 101' },
    { value: 'CSE 110' },
    { value: 'CSE 140' },
    { value: 'CSE 158' },
];

const InterviewPrep = [
    { value: 'Resume rewrite' },
    { value: 'Mock interview' },
    { value: 'Referral' },
];

const Languages = [
    { value: 'Java' },
    { value: 'Python' },
    { value: 'C++' },
    { value: 'C' },
    { value: 'Javascript' },
    { value: 'JQuery' },
    { value: 'MySQL' },
    { value: 'React' },
    { value: 'R' },
    { value: 'HTML' },
    { value: 'CSS' },
];

const subCatDict = {
    'CSE Course Tutoring' : CSECourse,
    'Interview Preparation': InterviewPrep,
    'Languages Tutoring': Languages
};