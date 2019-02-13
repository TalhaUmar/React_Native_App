import React, { Component } from 'react';
import { View, Text, Platform, Dimensions, TouchableNativeFeedback, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TINT_BLACK_COLOR, HEADER_COLOR, BACKGROUND_COLOR } from '../../assets/colors';

class MyAccountHeader extends Component {

    handleBackPress = () => this.props.goBack(null);

    render() {
        const Touchable = (Platform.OS === 'android') ? TouchableNativeFeedback : TouchableHighlight;
        return (
            <View style={Styles.headerContainer}>
            {
                (!this.props.showBackButton) ?
                
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={Styles.titleStyle}>{this.props.title}</Text>
                </View>

                ://else statement
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Touchable
                        onPress={this.handleBackPress.bind(this)}
                        background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}
                    >
                            <View style={Styles.backIconContainer}>
                                <Icon 
                                    name={Platform.OS === 'android' ? 'arrow-back' : 'keyboard-arrow-left'} 
                                    size={24} 
                                    color={Platform.OS === 'android' ? TINT_BLACK_COLOR : '#448AFF'}
                                />
                            </View>
                    </Touchable>
                    <Text style={Styles.headerTitle}>{this.props.title}</Text>
                </View>
            }
               
            </View>
        );
    }
}

const Styles = {
    headerContainer: {
        marginTop: 20,
        // width: Dimensions.get('window').width,
        height: 50,
        flexDirection: 'row',
        backgroundColor: HEADER_COLOR,
        shadowColor: TINT_BLACK_COLOR,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 4,
    },
    backIconContainer: {
        paddingLeft: 18,
        paddingTop: 12,
        paddingRight: 18,
        paddingBottom: 12,
    },
    titleStyle: {
        fontSize: 16,
        fontFamily: 'Raleway-Bold',
        color: TINT_BLACK_COLOR,
    },
    headerTitle: {
        fontSize: 16,
        fontFamily: 'Raleway-Bold',
        color: TINT_BLACK_COLOR,
        paddingTop: 15,
        marginLeft: 20,

    },
};

export default MyAccountHeader;
