import React, { Component } from 'react';
import { 
    View,
    Text,
    AsyncStorage,
    Platform,
    TouchableNativeFeedback,
    TouchableHighlight
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import OcticonIcon from 'react-native-vector-icons/Octicons';
import MyAccountHeader from '../components/MyAccountHeader';
import { debounce } from '../utilities/AppUtils';
import { PRIMARY_COLOR, TINT_BLACK_COLOR, RED_COLOR, BACKGROUND_COLOR, LIGHT_GREY_COLOR, MEDIUM_GREY_COLOR, WHITE_COLOR } from '../../assets/colors';


class MyProfile extends Component {

    static navigationOptions = ({ navigation }) => ({
        header: <MyAccountHeader goBack={navigation.goBack} title={'my account'.toUpperCase()} showBackButton={false} />,
        // tabBarOnPress: (scene, jumpToIndex) => {
        //     console.log(scene, scene.index);
        //   AsyncStorage.getItem('@customerAccessToken')
        //   .then((token) => {
        //         if (!token) {
        //             navigation.navigate('LoginSignupScreenStack');
        //         } else {
        //             AsyncStorage.getItem('@accessTokenExpiry')
        //             .then((expirydate) => {
        //                 const tokenExpiryDate = new Date(expirydate);
        //                 const currentDate = new Date();
        //                 if (currentDate >= tokenExpiryDate) {
        //                     AsyncStorage.removeItem('@customerAccessToken');
        //                     AsyncStorage.removeItem('@accessTokenExpiry');
        //                     AsyncStorage.removeItem('@loggedInCustomer');
        //                     navigation.navigate('LoginSignupScreenStack');
        //                 } else {
        //                     console.log('jumping to profile tab');
        //                     jumpToIndex(scene.index);
        //                 }
        //             })
        //             .catch((error) => {
        //                 //error
        //             });
        //         }
        //   })
        //   .catch((error) => {
        //       //error
        //   });
        // }
    })

    jumpToShippingAddressScreen = () => {
        AsyncStorage.getItem('@customerAccessToken')
        .then((token) => {
            this.props.navigation.navigate('ShippingAddressScreen', { accessToken: token });
        })
        .catch((error) => {
            //error
        });
    }

    jumpToEditProfileScreen = () => {
        AsyncStorage.getItem('@customerAccessToken')
        .then((token) => {
            this.props.navigation.navigate('EditProfileScreen', { accessToken: token });
        })
        .catch((error) => {
            //error
        });
    }

    jumpToContactUsScreen = () => {
        this.props.navigation.navigate('ContactUsScreen');
    }

    jumpToMyOrdersScreen = () => {
        AsyncStorage.getItem('@customerAccessToken')
        .then((token) => {
            this.props.navigation.navigate('MyOrdersScreen', { accessToken: token });
        })
        .catch((error) => {
            //error
        });
    }

    render() {
        const Touchable = (Platform.OS === 'android') ? TouchableNativeFeedback : TouchableHighlight;
        return (
            <View style={Styles.containerStyle}>
                <View style={Styles.contentStyle}>

                    <Touchable
                        onPress={debounce(this.jumpToShippingAddressScreen.bind(this), 500)}
                        background={Platform.OS === 'android' ? TouchableNativeFeedback.Ripple(PRIMARY_COLOR, false) : ''}
                    >
                        <View style={Styles.buttonStyle}>
                            <Icon name='local-shipping' color={PRIMARY_COLOR} size={34} />
                            <View style={Styles.textHolderView}>
                                <Text style={Styles.textStyle}>{'Shipping Address'}</Text>
                            </View>
                        </View>
                    </Touchable>
                    <View style={Styles.separatorStyle} />

                    <Touchable
                        onPress={debounce(this.jumpToEditProfileScreen.bind(this), 500)}
                        background={Platform.OS === 'android' ? TouchableNativeFeedback.Ripple(PRIMARY_COLOR, false) : ''}
                    >
                        <View style={Styles.buttonStyle}>
                            <Icon name='person' color={PRIMARY_COLOR} size={34} />
                            <View style={Styles.textHolderView}>
                                <Text style={Styles.textStyle}>{'Personal Details'}</Text>
                            </View>
                        </View>
                    </Touchable>
                    <View style={Styles.separatorStyle} />

                    <Touchable
                        onPress={debounce(this.jumpToContactUsScreen.bind(this), 500)}
                        background={Platform.OS === 'android' ? TouchableNativeFeedback.Ripple(PRIMARY_COLOR, false) : ''}
                    >
                        <View style={Styles.buttonStyle}>
                            <Icon name='contact-phone' color={PRIMARY_COLOR} size={34} />
                            <View style={Styles.textHolderView}>
                                <Text style={Styles.textStyle}>{'Contact Us'}</Text>
                            </View>
                        </View>
                    </Touchable>
                    <View style={Styles.separatorStyle} />

                    <Touchable
                        // onPress={this.jumpToMyOrdersScreen.bind(this)}
                        background={Platform.OS === 'android' ? TouchableNativeFeedback.Ripple(PRIMARY_COLOR, false) : ''}
                    >
                        <View style={Styles.buttonStyle}>
                            <OcticonIcon name='package' color={PRIMARY_COLOR} size={34} />
                            <View style={Styles.textHolderView}>
                                <Text style={Styles.textStyle}>{'Orders Placed'}</Text>
                            </View>
                        </View>
                    </Touchable>
                    <View style={Styles.separatorStyle} />

                </View>
                <View style={Styles.footerStyle}>
                <View style={Styles.separatorStyle} />
                        <Touchable>
                        <View style={Styles.footerButtonStyle}>
                            <Icon name='power-settings-new' color={PRIMARY_COLOR} size={24} />
                            <View style={{ marginLeft: 8 }}>
                                <Text style={Styles.textStyle}>{'Logout'}</Text>
                            </View>
                        </View>
                    </Touchable>
                </View>
            </View>
        );
    }
}

const Styles = {
    containerStyle: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
        justifyContent: 'space-between'
    },
    contentStyle: {
        flex: 0.85,
    },
    buttonStyle: {
        paddingLeft: 16,
        paddingTop: 24,
        paddingBottom: 24,
        flexDirection: 'row'
    },
    textHolderView: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 22
    },
    textStyle: {
        fontSize: 16,
        fontFamily: 'Raleway-Bold',
        color: TINT_BLACK_COLOR,
    },
    separatorStyle: {
        height: 1, 
        backgroundColor: MEDIUM_GREY_COLOR, 
    },
    footerStyle: {
        flex: 0.15,
    },
    footerButtonStyle: {
        paddingTop: 24,
        paddingBottom: 24,
        flexDirection: 'row',
        justifyContent: 'center',
        // alignItems: 'center'
    },
};

export default MyProfile;
