import React, { Component } from 'react';
import { 
    View, 
    TextInput, 
    Text,
    TouchableNativeFeedback,
    TouchableWithoutFeedback,
    TouchableHighlight,
    TouchableOpacity,
    Platform,
    BackHandler,
    ActivityIndicator,
    Modal,
    Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { PRIMARY_COLOR, TINT_BLACK_COLOR, RED_COLOR, BACKGROUND_COLOR, LIGHT_GREY_COLOR, MEDIUM_GREY_COLOR, WHITE_COLOR } from '../../assets/colors';
import MyAccountHeader from '../components/MyAccountHeader';
import { createCustomerAccessToken, getCustomerObject } from '../myQueries';
import { emailChanged, passwordChanged, signinButtonPressed, handleSignInErrors, handleSignInSuccess, hideModel, jumpToSignupScreen, jumpToMyAccountTab } from '../actions';

class Login extends Component {

    static navigationOptions = ({ navigation }) => ({
        header: <MyAccountHeader goBack={navigation.goBack} title={'my account'.toUpperCase()} />
    })

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
        // this.props.navigation.state.params.productTapStateCallback();
    }

    componentDidUpdate() {
        if (this.props.auth.readyToSendQuery) {
            const { signinEmail, signinPassword } = this.props.auth;
            this.props.mutate({
                variables: { input: {
                    email: signinEmail,
                    password: signinPassword
                }
            }
            })
            .then(({ data }) => {
                console.log('here is my data', data);
                // console.log('here is my data', data.customerAccessTokenCreate.customerAccessToken.accessToken);
                if (data.customerAccessTokenCreate.userErrors.length > 0) {
                    this.props.handleSignInErrors();
                } else {
                    this.props.handleSignInSuccess({
                        accessToken: data.customerAccessTokenCreate.customerAccessToken.accessToken,
                        expiresAt: data.customerAccessTokenCreate.customerAccessToken.expiresAt,
                        userEmail: signinEmail,
                        userPassword: signinPassword
                    });
                }
            }).catch((error) => {
                console.log('there was an error sending the query', error);
            });
        }
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress = () => {
        const { navigation } = this.props;
        console.log('going back', navigation);
        navigation.goBack();
        return true;
    };

    onEmailChanged(email) {
        this.props.emailChanged(email);
    }

    onPasswordChanged(password) {
        this.props.passwordChanged(password);
    }

    onSigninButtonPress = () => {
        const { signinEmail, signinPassword } = this.props.auth;
        if (signinEmail !== '' || signinPassword !== '') {
            this.props.signinButtonPressed();
        }
    }

    moveBackToFeedTab = () => {
        this.props.hideModel();
        this.props.navigation.goBack(null);
    }

    jumpToSignupScreen = () => {
        this.props.navigation.navigate('SignupScreen');
    }

    render() {
        const Touchable = (Platform.OS === 'android') ? TouchableNativeFeedback : TouchableHighlight;
        return (
            <View style={Styles.loginContainer}>

                {
                    this.props.auth.isLoggedIn &&
                    <Modal
                        animationType={Platform.OS === 'android' ? 'fade' : 'slide'}
                        transparent
                        visible
                        onRequestClose={() => {}}
                    >
                    <TouchableWithoutFeedback onPress={this.moveBackToFeedTab.bind(this)}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' }}>
                        <TouchableWithoutFeedback onPress={() => {}}>
                            <View style={{ width: Dimensions.get('window').width * 0.70, backgroundColor: BACKGROUND_COLOR, borderRadius: 3, paddingLeft: 16, paddingRight: 16, paddingTop: 10, paddingBottom: 10, shadowColor: TINT_BLACK_COLOR, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, elevation: 2 }}>
                                <View style={{ alignItems: 'center' }}>
                                    <Icon name='check-circle' size={60} color={PRIMARY_COLOR} />
                                    <Text style={{ fontFamily: 'Raleway-Bold', fontSize: 16, color: PRIMARY_COLOR, marginTop: 8, marginBottom: 10, textAlign: 'center' }}>{'Login Successful'.toUpperCase()}</Text>
                                </View>
                                <View>
                                    <Touchable
                                        onPress={this.moveBackToFeedTab.bind(this)}
                                        background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}
                                    >
                                        <View style={{ backgroundColor: PRIMARY_COLOR, alignItems: 'center', borderRadius: 2 }}>
                                            <Text style={{ fontFamily: 'Raleway-ExtraBold', fontSize: 16, color: WHITE_COLOR, paddingTop: 10, paddingBottom: 10 }}>{'ok'.toUpperCase()}</Text>
                                        </View>
                                    </Touchable>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                    </Modal>
                }

                <View style={Styles.headingTextViewStyle}>
                    <Text style={Styles.headingTextStyle}>{'Sign In With Email'}</Text>
                </View>
                <View style={Styles.loginFormContainer}>
                    <TextInput
                        style={Styles.emailStyle}
                        onChangeText={this.onEmailChanged.bind(this)}
                        value={this.props.auth.signinEmail}
                        placeholder='EMAIL' 
                        placeholderTextColor={MEDIUM_GREY_COLOR}
                        underlineColorAndroid="transparent"
                        keyboardType='email-address'
                        selectionColor={PRIMARY_COLOR}
                    />
                    <View style={[Styles.separatorStyle, this.props.auth.passwordError.length > 0 && Styles.redSeparator]} />
                    <Text style={Styles.errorTextStyle} />
                    <TextInput 
                        style={Styles.passwordStyle}
                        onChangeText={this.onPasswordChanged.bind(this)}
                        value={this.props.auth.signinPassword}
                        placeholder='PASSWORD' 
                        placeholderTextColor={MEDIUM_GREY_COLOR} secureTextEntry
                        underlineColorAndroid="transparent"
                        selectionColor={PRIMARY_COLOR}
                        secureTextEntry
                    />
                    <View style={[Styles.separatorStyle, this.props.auth.passwordError.length > 0 && Styles.redSeparator]} />
                    <Text style={Styles.errorTextStyle}>{this.props.auth.passwordError}</Text>

                    <Touchable
                        onPress={this.onSigninButtonPress.bind(this)}
                        background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>
                        <View style={Styles.loginButtonViewStyle}>
                        {
                            this.props.auth.loading ?
                                <ActivityIndicator style={{ padding: 6 }} size='large' color={WHITE_COLOR} />
                            :// else show sigin text
                            <Text style={Styles.loginButtonTextStyle}>{'sign in'.toUpperCase()}</Text>                            
                        }
                        </View>
                    </Touchable>
                </View>
                
                <View style={Styles.footerStyle}>
                    <View style={Styles.forgotPasswordViewContainer}>
                        <Touchable
                            onPress={() => {}}
                            background={Platform.OS === 'android' ? TouchableNativeFeedback.Ripple(PRIMARY_COLOR, false) : ''}
                        >
                                <Text style={Styles.linkTextStyle}>{'Forgotton password?'}</Text>
                        </Touchable>
                    </View>

                    <View style={Styles.separatorStyle} />

                    <Touchable
                        onPress={this.jumpToSignupScreen.bind(this)}
                        background={Platform.OS === 'android' ? TouchableNativeFeedback.Ripple(PRIMARY_COLOR, false) : ''}>
                        <View style={Styles.signupButtonViewStyle}>
                            <Text style={Styles.signupTextStyleOne}>{'Don\'t have an account?'}</Text>
                            <Text style={Styles.signupTextStyleTwo}>{'Sign Up Today.'}</Text>
                        </View>
                    </Touchable>
                </View>

            </View>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

const Styles = {
    loginContainer: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
        paddingLeft: 12, 
        paddingRight: 12
    },
    headingTextViewStyle: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20
    },
    headingTextStyle: {
        fontSize: 18,
        fontFamily: 'Raleway-Medium',
        color: TINT_BLACK_COLOR
    },
    loginFormContainer: {
        paddingLeft: 10,
        paddingRight: 10
    },
    emailStyle: {
        fontSize: 18,
        fontFamily: 'Raleway-Regular',
        paddingLeft: 2,
        paddingBottom: 2
    },
    passwordStyle: {
        fontSize: 18,
        fontFamily: 'Raleway-Regular',
        paddingLeft: 2,
        paddingBottom: 2
    },
    loginButtonViewStyle: {
        backgroundColor: PRIMARY_COLOR,
        alignItems: 'center',
        borderRadius: 4,
        marginTop: 20,
        marginBottom: 12
    },
    loginButtonTextStyle: {
        padding: 14,
        color: WHITE_COLOR,
        fontSize: 18,
        fontFamily: 'Raleway-ExtraBold'
    },
    separatorStyle: {
        height: 1, 
        backgroundColor: MEDIUM_GREY_COLOR, 
        marginBottom: 2
    },
    redSeparator: {
        backgroundColor: RED_COLOR, 
    },
    errorTextStyle: {
        color: RED_COLOR, 
        fontSize: 12, 
        fontFamily: 'Raleway-Regular'
    },
    footerStyle: {
        paddingLeft: 10,
        paddingRight: 10
    },
    forgotPasswordViewContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
        marginBottom: 8
    },
    linkTextStyle: {
        fontSize: 12,
        fontFamily: 'Raleway-Regular',
        color: TINT_BLACK_COLOR,
        textDecorationLine: 'underline'        
    },
    signupButtonViewStyle: {
        alignItems: 'center',
        marginTop: 8,
        borderRadius: 4
    },
    signupTextStyleOne: {
        padding: 2,
        color: TINT_BLACK_COLOR,
        fontSize: 14,
        fontFamily: 'Raleway-Regular',
    },
    signupTextStyleTwo: {
        padding: 2,
        color: TINT_BLACK_COLOR,
        fontSize: 14,
        fontFamily: 'Raleway-Regular',
        textDecorationLine: 'underline'
    }
};

export default compose(
    graphql(createCustomerAccessToken),
    connect(mapStateToProps, {
        emailChanged,
        passwordChanged,
        signinButtonPressed,
        handleSignInErrors,
        handleSignInSuccess,
        hideModel
    })
)(Login);
