import React, { Component } from 'react'
import DatePicker from 'react-native-datepicker'

export default class PickDate extends Component {
    constructor(props){
        super(props)
        this.state = {date:''}
    }

    render(){
        return (
            <DatePicker
                style={{width: 200}}
                date={this.state.date}
                mode="date"
                placeholder="select date"
                format="YYYY-MM-DD"
                minDate="2019-10-30"
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
                        position: 'right',
                    }
                }}
                onDateChange={(date) => {this.setState({date: date})}}
            />
        )
    }
}