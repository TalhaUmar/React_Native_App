import React, { Component } from 'react';
import { 
    View,
    Text,
    Platform,
    TouchableNativeFeedback,
    TouchableHighlight
 } from 'react-native';
import { BACKGROUND_COLOR, PRIMARY_COLOR, TINT_BLACK_COLOR, PRIMARY_LIGHT_COLOR, LIGHT_GREY_COLOR } from '../../assets/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';

class LoginRegisterHeader extends Component {

    handleBackPress = () => this.props.goBack(null);

    render() {
        const Touchable = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableHighlight;
        return (
            <View style={Styles.headerContainer}>
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
        );
    }
}

const Styles = {
    headerContainer: {
        flexDirection: 'row', 
        borderBottomWidth: 1, 
        marginBottom: 2, 
        borderBottomColor: LIGHT_GREY_COLOR, 
        height: 48,
    },
    backIconContainer: {
        paddingLeft: 22,
        paddingTop: 12,
        paddingRight: 18,
        paddingBottom: 12
    },
    headerTitle: {
        fontSize: 16,
        fontFamily: 'Raleway-Bold',
        color: TINT_BLACK_COLOR,
        paddingTop: 14,
        marginLeft: 16
    }
};

export default LoginRegisterHeader;
