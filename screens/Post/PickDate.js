import React, { Component } from 'react'
import DatePicker from 'react-native-datepicker'
import moment from 'moment';

export default class PickDate extends Component {
    constructor(props){
        super(props)
        this.state = {date: ''}
    }

    handledate = (date) => {
        this.props.parent.setState({serviceDate: date});
        this.setState({date: date});
    };

    render(){
        return (
            <DatePicker
                style={{width: 200}}
                date={this.state.date}
                mode="date"
                placeholder="select date"
                format="YYYY-MM-DD"
                minDate={moment().format("YYYY-MM-DD")}
                maxDate="2050-06-01"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                    dateIcon: {
                        position: 'absolute',
                        left: 0,
                        top: 4,
                        marginLeft: 0
                    },
                    dateInput: {
                        position: 'absolute',
                        top: 4,
                        marginRight: 0
                    }
                }}
                onDateChange={this.handledate}
            />
        )
    }
}