import React, { Component } from 'react';
import { 
    View, 
    TextInput, 
    Text,
    TouchableNativeFeedback,
    TouchableWithoutFeedback,
    TouchableHighlight,
    Platform,
    BackHandler,
    KeyboardAvoidingView,
    Switch,
    ActivityIndicator,
    Modal,
    Dimensions
} from 'react-native';
import { compose, graphql } from 'react-apollo';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { PRIMARY_COLOR, TINT_BLACK_COLOR, RED_COLOR, BACKGROUND_COLOR, LIGHT_GREY_COLOR, MEDIUM_GREY_COLOR, WHITE_COLOR } from '../../assets/colors';
import MyAccountHeader from '../components/MyAccountHeader';
import { createCustomerMutation } from '../myQueries';
import { firstNameChanged, lastNameChanged, emailChanged, passwordChanged, phonePrefixChanged, phonePostfixChanged, signupButtonPressed, marketingEmailToggleButton, handleCustomerCreateResponse, signupSuccessful, hideModel } from '../actions';

class Signup extends Component {

    static navigationOptions = ({ navigation }) => ({
        header: <MyAccountHeader goBack={navigation.goBack} showBackButton title={'Popnosh'.toUpperCase()} />
    })

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
    
    componentDidUpdate() {
        if (this.props.signup.readyToSendQuery) {
            const { firstName, lastName, email, password, phonePrefix, phonePostfix, acceptsMarketingEmail } = this.props.signup;
            this.props.mutate({
                variables: { input: {
                    firstName,
                    lastName,
                    email,
                    password,
                    phone: phonePrefix.concat(phonePostfix),
                    acceptsMarketing: acceptsMarketingEmail
                }
            }
            })
            .then(({ data }) => {
                if (data.customerCreate.userErrors.length > 0) {
                    this.props.handleCustomerCreateResponse(data.customerCreate.userErrors);
                } else {
                    this.props.signupSuccessful(data.customerCreate.customer);
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
        navigation.goBack();
        return true;
    };

    onFirstNameChanged(firstName) {
        this.props.firstNameChanged(firstName);
    }

    onLastNameChanged(lastName) {
        this.props.lastNameChanged(lastName);
    }

    onEmailChanged(email) {
        this.props.emailChanged(email);
    }

    onPasswordChanged(password) {
        this.props.passwordChanged(password);
    }

    onPhonePrefixChanged(phonePre) {
        this.props.phonePrefixChanged(phonePre);
    }

    onPhonePostfixChanged(phonePost) {
        this.props.phonePostfixChanged(phonePost);
    }

    onMarketingEmailButtonToggle(flag) {
        this.props.marketingEmailToggleButton(flag);
    }

    onSignupButtonPress() {
        const { firstName, lastName, email, password, phonePrefix, phonePostfix, readyToSendQuery } = this.props.signup;
        if (!readyToSendQuery) {
            this.props.signupButtonPressed({ firstName, lastName, email, password, phonePrefix, phonePostfix });
        }
    }

    moveBackToLoginScreen = () => {
        this.props.hideModel();
        this.props.navigation.goBack();
    }

    render() {
        const Touchable = (Platform.OS === 'android') ? TouchableNativeFeedback : TouchableHighlight;
        return (
            <KeyboardAvoidingView style={Styles.signupContainer} behavior='padding'>
                
                <Modal
                    animationType={Platform.OS === 'android' ? 'fade' : 'slide'}
                    transparent
                    visible={this.props.signup.signupModelVisibility}
                    onRequestClose={() => {
                        this.props.hideModel();
                        this.props.navigation.goBack();
                    }}
                >
                <TouchableWithoutFeedback onPress={this.moveBackToLoginScreen.bind(this)}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' }}>
                    <TouchableWithoutFeedback onPress={() => {}}>    
                        <View style={{ width: Dimensions.get('window').width * 0.70, backgroundColor: BACKGROUND_COLOR, borderRadius: 3, paddingLeft: 16, paddingRight: 16, paddingTop: 10, paddingBottom: 10, shadowColor: TINT_BLACK_COLOR, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, elevation: 2 }}>
                            <View style={{ alignItems: 'center' }}>
                                <Icon name='check-circle' size={60} color={PRIMARY_COLOR} />
                                <Text style={{ fontFamily: 'Raleway-Bold', fontSize: 16, color: PRIMARY_COLOR, marginTop: 8, marginBottom: 10, textAlign: 'center' }}>{'Signup Successful'.toUpperCase()}{' Please Signin Now'}</Text>
                            </View>
                            <View>
                                <Touchable
                                    onPress={this.moveBackToLoginScreen.bind(this)}
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
            
                <View style={Styles.headingTextViewStyle}>
                    <Text style={Styles.headingTextStyle}>{'Signup Using Your Email Address'}</Text>
                </View>

                <View style={Styles.signupFormContainer}>
                    <TextInput 
                        style={Styles.emailStyle}
                        onChangeText={this.onFirstNameChanged.bind(this)}
                        value={this.props.signup.firstName}
                        placeholder='FIRST NAME'
                        placeholderTextColor={MEDIUM_GREY_COLOR}
                        underlineColorAndroid="transparent"
                        selectionColor={PRIMARY_COLOR}
                        maxLength={30}
                    />
                    <View style={[Styles.separatorStyle, this.props.signup.firstNameError.length > 0 && Styles.redSeparator]} />
                    <Text style={Styles.errorTextStyle}>{this.props.signup.firstNameError}</Text>
                    <TextInput 
                        style={Styles.emailStyle}
                        onChangeText={this.onLastNameChanged.bind(this)}
                        value={this.props.signup.lastName}
                        placeholder='LAST NAME' 
                        placeholderTextColor={MEDIUM_GREY_COLOR}
                        underlineColorAndroid="transparent"
                        selectionColor={PRIMARY_COLOR}
                        maxLength={30}
                    />
                    <View style={[Styles.separatorStyle, this.props.signup.lastNameError.length > 0 && Styles.redSeparator]} />
                    <Text style={Styles.errorTextStyle}>{this.props.signup.lastNameError}</Text>
                    <TextInput 
                        style={Styles.emailStyle}
                        onChangeText={this.onEmailChanged.bind(this)}
                        value={this.props.signup.email}
                        placeholder='EMAIL' 
                        keyboardType='email-address'
                        placeholderTextColor={MEDIUM_GREY_COLOR}
                        underlineColorAndroid="transparent"
                        selectionColor={PRIMARY_COLOR}
                        maxLength={40}
                    />
                    <View style={[Styles.separatorStyle, this.props.signup.emailError.length > 0 && Styles.redSeparator]} />
                    <Text style={Styles.errorTextStyle}>{this.props.signup.emailError}</Text>
                    <TextInput 
                        style={Styles.emailStyle}
                        onChangeText={this.onPasswordChanged.bind(this)}
                        value={this.props.signup.password}
                        placeholder='PASSWORD' 
                        placeholderTextColor={MEDIUM_GREY_COLOR}
                        secureTextEntry
                        underlineColorAndroid="transparent"
                        selectionColor={PRIMARY_COLOR}
                        maxLength={20}
                    />
                    <View style={[Styles.separatorStyle, this.props.signup.passwordError.length > 0 && Styles.redSeparator]} />
                    <Text style={Styles.errorTextStyle}>{this.props.signup.passwordError}</Text>

                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 0.15, marginRight: 6 }}>
                            <TextInput 
                                style={Styles.emailStyle}
                                onChangeText={this.onPhonePrefixChanged.bind(this)}
                                value={this.props.signup.phonePrefix}
                                placeholder='+92'
                                placeholderTextColor={MEDIUM_GREY_COLOR}
                                keyboardType='phone-pad'
                                underlineColorAndroid="transparent"
                                selectionColor={PRIMARY_COLOR}
                                maxLength={4}
                            />
                            <View style={[Styles.separatorStyle, this.props.signup.phoneError.length > 0 && Styles.redSeparator]} />
                        </View>
                        <View style={{ flex: 0.85 }}>
                            <TextInput 
                                style={Styles.emailStyle}
                                onChangeText={this.onPhonePostfixChanged.bind(this)}
                                value={this.props.signup.phonePostfix}
                                placeholder='3227676674' 
                                placeholderTextColor={MEDIUM_GREY_COLOR}
                                keyboardType='phone-pad'
                                underlineColorAndroid="transparent"
                                selectionColor={PRIMARY_COLOR}
                                maxLength={15}
                            />
                            <View style={[Styles.separatorStyle, this.props.signup.phoneError.length > 0 && Styles.redSeparator]} />
                            <Text style={Styles.errorTextStyle}>{this.props.signup.phoneError}</Text>
                        </View>
                    </View>

                    <View style={{ marginTop: 6, flexDirection: 'row' }}>
                        <Switch
                            onValueChange={(value) => this.onMarketingEmailButtonToggle(value)}
                            onTintColor={PRIMARY_COLOR}
                            thumbTintColor={PRIMARY_COLOR}
                            tintColor={MEDIUM_GREY_COLOR}
                            value={this.props.signup.acceptsMarketingEmail}
                        />
                        <Text style={{ marginLeft: 10, fontFamily: 'Raleway-Regular', fontSize: 12, paddingTop: 5, color: TINT_BLACK_COLOR }}>Allow amazing discount offer emails</Text>
                    </View>

                    <Touchable
                        onPress={this.onSignupButtonPress.bind(this)}
                        background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>
                        <View style={Styles.signupButtonViewStyle}>
                            {
                                this.props.signup.loading ?
                                    <ActivityIndicator style={{ padding: 6 }} size='large' color={WHITE_COLOR} />
                                : //else show text
                                <Text style={Styles.signupButtonTextStyle}>{'sign up'.toUpperCase()}</Text>
                                
                            }
                        </View>
                    </Touchable>

                </View>
            </KeyboardAvoidingView>
        );
    }
}

const mapStateToProps = state => ({
    signup: state.signup
});

const Styles = {
    signupContainer: {
        flex: 1,
        // justifyContent: 'flex-start',
        backgroundColor: BACKGROUND_COLOR,
        paddingLeft: 12, 
        paddingRight: 12
    },
    headingTextViewStyle: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
        paddingLeft: 10,
        paddingRight: 10
    },
    headingTextStyle: {
        textAlign: 'center',
        fontSize: 18,
        fontFamily: 'Raleway-Medium',
        color: TINT_BLACK_COLOR
    },
    signupFormContainer: {
        paddingLeft: 10,
        paddingRight: 10
    },
    emailStyle: {
        fontSize: 18,
        fontFamily: 'Raleway-Regular',
        paddingLeft: 2,
        paddingBottom: 2
    },
    phonePrefixStyle: {
        flex: 0.1,
        fontSize: 18,
        fontFamily: 'Raleway-Regular',
        paddingLeft: 2,
        paddingBottom: 2
    },
    phonePostfixStyle: {
        flex: 0.9,
        fontSize: 18,
        fontFamily: 'Raleway-Regular',
        paddingLeft: 2,
        paddingBottom: 2
    },
    signupButtonViewStyle: {
        backgroundColor: PRIMARY_COLOR,
        alignItems: 'center',
        borderRadius: 4,
        marginTop: 24,
    },
    signupButtonTextStyle: {
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
};

export default compose(
    graphql(createCustomerMutation),
    connect(mapStateToProps, {
        firstNameChanged,
        lastNameChanged,
        emailChanged,
        passwordChanged,
        phonePrefixChanged,
        phonePostfixChanged,
        marketingEmailToggleButton,
        signupButtonPressed,
        handleCustomerCreateResponse,
        signupSuccessful,
        hideModel
    })
)(Signup);
