import React, { Component } from 'react';
import { StatusBar, View } from 'react-native';
import { ApolloProvider } from 'react-apollo';
import { store } from './config/ReduxStore';
import { client } from './config/ApolloClient';
import AppNavigator from './config/NavigationController';
import { HEADER_COLOR } from '../assets/colors';

export default class App extends Component {
    render() {
        return (
            <ApolloProvider store={store} client={client}>
            <View style={{ flex: 1 }}>
            <StatusBar
                translucent
                backgroundColor={HEADER_COLOR} 
                barStyle='dark-content'
            />
                <AppNavigator />
            </View>
            </ApolloProvider>
        );
    }
}
