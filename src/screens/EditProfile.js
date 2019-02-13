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
    Dimensions,
    AsyncStorage
} from 'react-native';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NavigationActions } from 'react-navigation';
import { PRIMARY_COLOR, TINT_BLACK_COLOR, RED_COLOR, BACKGROUND_COLOR, LIGHT_GREY_COLOR, MEDIUM_GREY_COLOR, WHITE_COLOR } from '../../assets/colors';
import MyAccountHeader from '../components/MyAccountHeader';
import { updateCustomerMutation, createCustomerAccessToken } from '../myQueries';
import { firstNameChanged, lastNameChanged, emailChanged, passwordChanged, phonePrefixChanged, phonePostfixChanged, buttonPressed, marketingEmailToggleButton, handleErrorMessages, profileUpdatedSuccessfully, hideModel, preLoadScreenWithData } from '../actions';

class EditProfile extends Component {

    static navigationOptions = ({ navigation }) => ({
        header: <MyAccountHeader goBack={navigation.goBack} title={'Profile'.toUpperCase()} showBackButton />,
    })

    componentWillMount() {
        AsyncStorage.getItem('@loggedInCustomer')
        .then((customer) => {
            console.log(JSON.parse(customer).email);
            AsyncStorage.getItem('@loginCredential')
            .then((credential) => {
                this.props.preLoadScreenWithData({
                    fName: JSON.parse(customer).firstName,
                    lName: JSON.parse(customer).lastName,
                    email: JSON.parse(customer).email,
                    password: JSON.parse(credential).userPassword,
                    phone: JSON.parse(customer).phone,
                    acceptsMarketing: JSON.parse(customer).acceptsMarketing
                });
            }).catch((error) => {});
        })
        .catch((error) => {
            //error
        });
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
    
    componentDidUpdate() {
        if (this.props.editProfile.readyToSendQuery) {
            const { firstName, lastName, email, password, phonePrefix, phonePostfix, acceptsMarketingEmail } = this.props.editProfile;
            console.log('my access token for edit profile', this.props.navigation.state.params.accessToken);
            this.props.updateMutation({
                variables: { customerAccessToken: this.props.navigation.state.params.accessToken,
                    customer: {
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        password: password,
                        phone: phonePrefix.concat(phonePostfix),
                        acceptsMarketing: acceptsMarketingEmail
                    }
                }
            })
            .then(({ data }) => {
                console.log(data.customerUpdate);
                if (data.customerUpdate.userErrors.length > 0) {
                    this.props.handleErrorMessages(data.customerUpdate.userErrors);
                } else {
                    this.props.profileUpdatedSuccessfully({ customer: data.customerUpdate.customer, newPassword: password });
                    // this.props.renewMutation({
                    //     variables: { input: {
                    //         email: 'mtalha@devfactori.com',
                    //         password: '123456'
                    //         }
                    //     }
                    // }).then((response) => { console.log(response); }).catch((error) => { console.log(error); });
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
        navigation.goBack(null);
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

    onButtonPress() {
        const { firstName, lastName, email, password, phonePrefix, phonePostfix, readyToSendQuery } = this.props.editProfile;
        if (!readyToSendQuery) {
            this.props.buttonPressed({ firstName, lastName, email, password, phonePrefix, phonePostfix });
        }
    }

    moveBack = () => {
        this.props.hideModel();
        this.props.navigation.dispatch(NavigationActions.back(null));
    }

    render() {
        const Touchable = (Platform.OS === 'android') ? TouchableNativeFeedback : TouchableHighlight;
        return (
            <KeyboardAvoidingView behavior='padding' style={Styles.signupContainer}>
            
            <Modal
                animationType={Platform.OS === 'android' ? 'fade' : 'slide'}
                transparent
                visible={this.props.editProfile.modalVisibility}
                onRequestClose={() => {
                    this.props.hideModel();
                    this.props.navigation.dispatch(NavigationActions.back(null));
                }}
            >
            <TouchableWithoutFeedback onPress={() => {this.props.hideModel()}}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' }}>
                <TouchableWithoutFeedback onPress={() => {}}>
                    <View style={{ width: Dimensions.get('window').width * 0.70, backgroundColor: BACKGROUND_COLOR, borderRadius: 3, paddingLeft: 16, paddingRight: 16, paddingTop: 10, paddingBottom: 10, shadowColor: TINT_BLACK_COLOR, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, elevation: 2 }}>
                        <View style={{ alignItems: 'center' }}>
                            <Icon name='check-circle' size={60} color={PRIMARY_COLOR} />
                            <Text style={{ fontFamily: 'Raleway-Bold', fontSize: 16, color: PRIMARY_COLOR, marginTop: 8, marginBottom: 10, textAlign: 'center' }}>{'updated Successfully'.toUpperCase()}</Text>
                        </View>
                        <View>
                            <Touchable
                                onPress={this.moveBack.bind(this)}
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

            <View style={Styles.signupFormContainer}>
                <TextInput 
                    style={Styles.emailStyle}
                    onChangeText={this.onFirstNameChanged.bind(this)}
                    value={this.props.editProfile.firstName}
                    placeholder='FIRST NAME'
                    placeholderTextColor={MEDIUM_GREY_COLOR}
                    underlineColorAndroid="transparent"
                    selectionColor={PRIMARY_COLOR}
                    maxLength={30}
                />
                <View style={[Styles.separatorStyle, this.props.editProfile.firstNameError.length > 0 && Styles.redSeparator]} />
                <Text style={Styles.errorTextStyle}>{this.props.editProfile.firstNameError}</Text>
                <TextInput 
                    style={Styles.emailStyle}
                    onChangeText={this.onLastNameChanged.bind(this)}
                    value={this.props.editProfile.lastName}
                    placeholder='LAST NAME' 
                    placeholderTextColor={MEDIUM_GREY_COLOR}
                    underlineColorAndroid="transparent"
                    selectionColor={PRIMARY_COLOR}
                    maxLength={30}
                />
                <View style={[Styles.separatorStyle, this.props.editProfile.lastNameError.length > 0 && Styles.redSeparator]} />
                <Text style={Styles.errorTextStyle}>{this.props.editProfile.lastNameError}</Text>
                <TextInput 
                    style={Styles.emailStyle}
                    onChangeText={this.onEmailChanged.bind(this)}
                    value={this.props.editProfile.email}
                    placeholder='EMAIL' 
                    keyboardType='email-address'
                    placeholderTextColor={MEDIUM_GREY_COLOR}
                    underlineColorAndroid="transparent"
                    selectionColor={PRIMARY_COLOR}
                    maxLength={40}
                />
                <View style={[Styles.separatorStyle, this.props.editProfile.emailError.length > 0 && Styles.redSeparator]} />
                <Text style={Styles.errorTextStyle}>{this.props.editProfile.emailError}</Text>
                <TextInput 
                    style={Styles.emailStyle}
                    onChangeText={this.onPasswordChanged.bind(this)}
                    value={this.props.editProfile.password}
                    placeholder='PASSWORD' 
                    placeholderTextColor={MEDIUM_GREY_COLOR}
                    secureTextEntry
                    underlineColorAndroid="transparent"
                    selectionColor={PRIMARY_COLOR}
                    maxLength={20}
                />
                <View style={[Styles.separatorStyle, this.props.editProfile.passwordError.length > 0 && Styles.redSeparator]} />
                <Text style={Styles.errorTextStyle}>{this.props.editProfile.passwordError}</Text>

                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 0.15, marginRight: 6 }}>
                        <TextInput 
                            style={Styles.emailStyle}
                            onChangeText={this.onPhonePrefixChanged.bind(this)}
                            value={this.props.editProfile.phonePrefix}
                            placeholder='+92'
                            placeholderTextColor={MEDIUM_GREY_COLOR}
                            keyboardType='phone-pad'
                            underlineColorAndroid="transparent"
                            selectionColor={PRIMARY_COLOR}
                            maxLength={4}
                        />
                        <View style={[Styles.separatorStyle, this.props.editProfile.phoneError.length > 0 && Styles.redSeparator]} />
                    </View>
                    <View style={{ flex: 0.85 }}>
                        <TextInput 
                            style={Styles.emailStyle}
                            onChangeText={this.onPhonePostfixChanged.bind(this)}
                            value={this.props.editProfile.phonePostfix}
                            placeholder='3227676674' 
                            placeholderTextColor={MEDIUM_GREY_COLOR}
                            keyboardType='phone-pad'
                            underlineColorAndroid="transparent"
                            selectionColor={PRIMARY_COLOR}
                            maxLength={15}
                        />
                        <View style={[Styles.separatorStyle, this.props.editProfile.phoneError.length > 0 && Styles.redSeparator]} />
                        <Text style={Styles.errorTextStyle}>{this.props.editProfile.phoneError}</Text>
                    </View>
                </View>

                <View style={{ marginTop: 6, flexDirection: 'row' }}>
                    <Switch
                        onValueChange={(value) => this.onMarketingEmailButtonToggle(value)}
                        onTintColor={PRIMARY_COLOR}
                        thumbTintColor={PRIMARY_COLOR}
                        tintColor={MEDIUM_GREY_COLOR}
                        value={this.props.editProfile.acceptsMarketingEmail}
                    />
                    <Text style={{ marginLeft: 10, fontFamily: 'Raleway-Regular', fontSize: 12, paddingTop: 5, color: TINT_BLACK_COLOR }}>Allow amazing discount offer emails</Text>
                </View>

                <Touchable
                    onPress={this.onButtonPress.bind(this)}
                    background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>
                    <View style={Styles.signupButtonViewStyle}>
                        {
                            this.props.editProfile.loading ?
                                <ActivityIndicator style={{ padding: 6 }} size='large' color={WHITE_COLOR} />
                            : //else show text
                            <Text style={Styles.signupButtonTextStyle}>{'Update'.toUpperCase()}</Text>
                            
                        }
                    </View>
                </Touchable>

            </View>
        </KeyboardAvoidingView>
        );
    }
}

const Styles = {
    signupContainer: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
    },
    signupFormContainer: {
        paddingLeft: 16,
        paddingRight: 16
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

const mapStateToProps = state => ({
    editProfile: state.editProfile
});

export default compose(
    graphql(updateCustomerMutation, { name: 'updateMutation' }),
    graphql(createCustomerAccessToken, { name: 'renewMutation' }),
    connect(mapStateToProps, {
        firstNameChanged,
        lastNameChanged,
        emailChanged,
        passwordChanged,
        phonePrefixChanged,
        phonePostfixChanged,
        marketingEmailToggleButton,
        buttonPressed,
        handleErrorMessages,
        profileUpdatedSuccessfully,
        hideModel,
        preLoadScreenWithData
    })
)(EditProfile);
