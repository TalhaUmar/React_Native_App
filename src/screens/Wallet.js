import React, { Component } from 'react';
import { View, Text, TouchableNativeFeedback } from 'react-native';
import { graphql, compose } from 'react-apollo';
import { getCurrencyCode } from '../myQueries';

class Wallet extends Component {
    
    render() {
        return (
                <View>
                {
                    console.log(this.props.data)
                }
                </View>
        );
    }
}

export default compose(
    graphql(getCurrencyCode)
)(Wallet);

// ({ collectionName }) => ((collectionName === null || collectionName === '') ? { variables: { handle: 'all' } } : { variables: { handle: collectionName } })