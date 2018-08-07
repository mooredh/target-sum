import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default class RandomNumber extends Component {    
    static propTypes = {
        number: PropTypes.number.isRequired,
        isDisabled: PropTypes.bool.isRequired,
        onPress: PropTypes.func.isRequired,
        id: PropTypes.number.isRequired,
        status: PropTypes.string.isRequired
    };

    handlePress() {
        if(this.props.status === 'PLAYING') {
            this.props.onPress(this.props.id)
        }   
    }

    render() {
        return (
            <TouchableOpacity onPress={() => this.handlePress()}>
                <Text style={[styles.random, this.props.isDisabled && styles.disabled]}>{this.props.number}</Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    random: {
        backgroundColor: '#999',
        width: 100,
        marginHorizontal: 15,
        marginVertical: 25,
        fontSize: 35,
        textAlign: 'center'
    },
    disabled: {
        opacity: 0.6
    }
})