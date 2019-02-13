import React, { Component } from 'react';
import {
    View,
    Text,
    Linking,
    Platform,
    TouchableNativeFeedback,
    TouchableHighlight,
    BackHandler
} from 'react-native';
import { PRIMARY_COLOR, TINT_BLACK_COLOR, RED_COLOR, BACKGROUND_COLOR, DARK_GREY_COLOR, MEDIUM_GREY_COLOR, WHITE_COLOR } from '../../assets/colors';
import MyAccountHeader from '../components/MyAccountHeader';

class ContactUs extends Component {

    static navigationOptions = ({ navigation }) => ({
        header: <MyAccountHeader goBack={navigation.goBack} title={'Contact Us'.toUpperCase()} showBackButton />,
    })

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress = () => {
        const { navigation } = this.props;
        navigation.goBack(null);
        return true;
    };

    render() {
        const Touchable = (Platform.OS === 'android') ? TouchableNativeFeedback : TouchableHighlight;
        return (
            <View style={Styles.containerStyle}>
                <Touchable
                    onPress={() => Linking.openURL('tel:+92 322 7676674')}
                    background={Platform.OS === 'android' ? TouchableNativeFeedback.Ripple(PRIMARY_COLOR, false) : ''}
                >
                    <View style={Styles.buttonStyle}>
                        <View style={Styles.textHolderView}>
                            <Text style={Styles.textOneStyle}>{'Call +92 322 7676674'}</Text>
                            <Text style={Styles.textTwoStyle}>{'Monday to Friday from 9:00 am to 10:00 pm'}</Text>
                        </View>
                    </View>
                </Touchable>

                <Touchable
                    onPress={() => Linking.openURL('https://www.facebook.com/popnosh/')}
                    background={Platform.OS === 'android' ? TouchableNativeFeedback.Ripple(PRIMARY_COLOR, false) : ''}
                >
                    <View style={Styles.buttonStyle}>
                        <View style={Styles.textHolderView}>
                            <Text style={Styles.textOneStyle}>{'Facebook'}</Text>
                            <Text style={Styles.textTwoStyle}>{'popnosh'}</Text>
                        </View>
                    </View>
                </Touchable>

            <Touchable
                onPress={() => Linking.openURL('https://www.instagram.com/pop.nosh/')}
                background={Platform.OS === 'android' ? TouchableNativeFeedback.Ripple(PRIMARY_COLOR, false) : ''}
            >
                <View style={Styles.buttonStyle}>
                    <View style={Styles.textHolderView}>
                        <Text style={Styles.textOneStyle}>{'Instagram'}</Text>
                        <Text style={Styles.textTwoStyle}>{'@pop.nosh'}</Text>
                    </View>
                </View>
            </Touchable>
            </View>
        );
    }
}

const Styles = {
    containerStyle: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
        paddingTop: 16
    },
    buttonStyle: {
        padding: 16,
        marginBottom: 12,
        justifyContent: 'center',
    },
    textOneStyle: {
        fontSize: 16,
        fontFamily: 'Raleway-Bold',
        color: TINT_BLACK_COLOR,
    },
    textTwoStyle: {
        marginTop: 4,
        fontSize: 14,
        fontFamily: 'Raleway-Regular',
        color: DARK_GREY_COLOR,
    }
};


export default ContactUs;
