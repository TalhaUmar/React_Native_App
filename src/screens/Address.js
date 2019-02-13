import React, { Component } from 'react';
import { 
    View,
    Text,
    TextInput,
    Platform,
    TouchableNativeFeedback,
    TouchableHighlight,
    KeyboardAvoidingView,
    ActivityIndicator,
    BackHandler,
    TouchableWithoutFeedback,
    Dimensions,
    Modal
 } from 'react-native';
 import Icon from 'react-native-vector-icons/MaterialIcons';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { BACKGROUND_COLOR, PRIMARY_COLOR, TINT_BLACK_COLOR, LIGHT_GREY_COLOR, WHITE_COLOR, MEDIUM_GREY_COLOR, RED_COLOR } from '../../assets/colors';
import MyAccountHeader from '../components/MyAccountHeader';
import { firstNameChanged, lastNameChanged, phonePrefixChanged, phonePostfixChanged, addressOneChanged, addressTwoChanged, provinceChanged, cityChanged, submitButtonPressed, handleErrorMessages, hideModel, callSuccessful, preLoadScreenWithData } from '../actions';
import { createCustomerAddress, updateCustomerAddress } from '../myQueries';

class Address extends Component {

    static navigationOptions = ({ navigation }) => ({
        header: <MyAccountHeader goBack={navigation.goBack} title={navigation.state.params.addressToEdit ? 'Edit Shipping Address'.toUpperCase() : 'Add Shipping Address'.toUpperCase()} showBackButton />,
    })

    componentWillMount() {
        const { addressToEdit, address } = this.props.navigation.state.params;
        if (addressToEdit) {
            this.props.preLoadScreenWithData(address);
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }

    componentDidUpdate() {
        if (this.props.addNewAddress.readyToSendQuery) {
            const { firstName, lastName, addressOne, addressTwo, phonePrefix, phonePostfix, province, city } = this.props.addNewAddress;
            if (!this.props.navigation.state.params.addressToEdit) {
                this.props.customerCreateMutation({
                    variables: { customerAccessToken: this.props.navigation.state.params.accessToken,
                        address: {
                            firstName: firstName,
                            lastName: lastName,
                            address1: addressOne,
                            address2: addressTwo,
                            phone: phonePrefix.concat(phonePostfix),
                            province: province,
                            city: city,
                            country: 'Pakistan'
                        }
                    }
                })
                .then(({ data }) => {
                    console.log(data);
                    if (data.customerAddressCreate.userErrors.length > 0) {
                        this.props.handleErrorMessages(data.customerAddressCreate.userErrors);
                    } else {
                        this.props.callSuccessful(data.customerAddressCreate.customerAddress);
                    }
                }).catch((error) => {
                    console.log('there was an error sending the query', error);
                });
            } else {
                console.log(this.props.navigation.state.params.address.id);
                this.props.customerUpdateMutation({
                    variables: { 
                        customerAccessToken: this.props.navigation.state.params.accessToken,
                        id: this.props.navigation.state.params.address.id,
                        address: {
                            firstName: firstName,
                            lastName: lastName,
                            address1: addressOne,
                            address2: addressTwo,
                            phone: phonePrefix.concat(phonePostfix),
                            province: province,
                            city: city,
                            country: 'Pakistan'
                        }
                    }
                })
                .then(({ data }) => {
                    if (data.customerAddressUpdate.userErrors.length > 0) {
                        this.props.handleErrorMessages(data.customerAddressUpdate.userErrors);
                    } else {
                        this.props.callSuccessful(data.customerAddressUpdate.customerAddress);
                    }
                }).catch((error) => {
                    console.log('there was an error sending the query', error);
                });
            }
        }
    }

    componentWillUnmount() {
        this.props.hideModel();
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

    onAddressOneChanged(addressOne) {
        this.props.addressOneChanged(addressOne);
    }

    onAddressTwoChanged(addressTwo) {
        this.props.addressTwoChanged(addressTwo);
    }

    onProvinceChnaged(province) {
        this.props.provinceChanged(province);
    }

    onCityChnaged(city) {
        this.props.cityChanged(city);
    }

    onPhonePrefixChanged(prefix) {
        this.props.phonePrefixChanged(prefix);
    }

    onPhonePostfixChanged(postfix) {
        this.props.phonePostfixChanged(postfix);
    }

    onSubmitButtonPress = () => {
        const { firstName, lastName, addressOne, phonePrefix, phonePostfix, readyToSendQuery, province, city } = this.props.addNewAddress;
        if (!readyToSendQuery) {
            this.props.submitButtonPressed({ firstName, lastName, addressOne, province, phonePrefix, phonePostfix, city });
        }
    }

    moveBack = () => {
        this.props.navigation.goBack(null);
    }

    render() {
        const Touchable = (Platform.OS === 'android') ? TouchableNativeFeedback : TouchableHighlight;
        const { addressToEdit } = this.props.navigation.state.params;
        return (
           <View style={Styles.containerStyle}>
                
                <View style={Styles.contentStyle}>
                    <KeyboardAvoidingView behavior='padding' style={Styles.formContainerStyle}>
                        
                        <Modal
                            animationType={Platform.OS === 'android' ? 'fade' : 'slide'}
                            transparent
                            visible={this.props.addNewAddress.modalVisibility}
                            onRequestClose={() => {
                                this.props.hideModel();
                            }}
                        >
                        <TouchableWithoutFeedback onPress={() => { this.props.hideModel(); }}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' }}>
                            <TouchableWithoutFeedback onPress={() => {}}>    
                                <View style={{ width: Dimensions.get('window').width * 0.70, backgroundColor: BACKGROUND_COLOR, borderRadius: 3, paddingLeft: 16, paddingRight: 16, paddingTop: 10, paddingBottom: 10, shadowColor: TINT_BLACK_COLOR, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, elevation: 2 }}>
                                    <View style={{ alignItems: 'center' }}>
                                        <Icon name='check-circle' size={60} color={PRIMARY_COLOR} />
                                        <Text style={{ fontFamily: 'Raleway-Bold', fontSize: 16, color: PRIMARY_COLOR, marginTop: 8, marginBottom: 10, textAlign: 'center' }}>{addressToEdit ? 'Address updated Successfully'.toUpperCase() : 'Address added Successfully'.toUpperCase()}</Text>
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

                        <TextInput 
                            style={Styles.emailStyle}
                            onChangeText={this.onFirstNameChanged.bind(this)}
                            value={this.props.addNewAddress.firstName}
                            placeholder='FIRST NAME'
                            placeholderTextColor={MEDIUM_GREY_COLOR}
                            underlineColorAndroid="transparent"
                            selectionColor={PRIMARY_COLOR}
                            maxLength={30}
                        />
                        <View style={[Styles.separatorStyle, this.props.addNewAddress.firstNameError.length > 0 && Styles.redSeparator]} />
                        <Text style={Styles.errorTextStyle}>{this.props.addNewAddress.firstNameError}</Text>
                        
                        <TextInput 
                            style={Styles.emailStyle}
                            onChangeText={this.onLastNameChanged.bind(this)}
                            value={this.props.addNewAddress.lastName}
                            placeholder='LAST NAME'
                            placeholderTextColor={MEDIUM_GREY_COLOR}
                            underlineColorAndroid="transparent"
                            selectionColor={PRIMARY_COLOR}
                            maxLength={30}
                        />
                        <View style={[Styles.separatorStyle, this.props.addNewAddress.lastNameError.length > 0 && Styles.redSeparator]} />
                        <Text style={Styles.errorTextStyle}>{this.props.addNewAddress.lastNameError}</Text>

                        <TextInput 
                            style={Styles.emailStyle}
                            onChangeText={this.onAddressOneChanged.bind(this)}
                            value={this.props.addNewAddress.addressOne}
                            placeholder='ADDRESS ONE'
                            placeholderTextColor={MEDIUM_GREY_COLOR}
                            underlineColorAndroid="transparent"
                            selectionColor={PRIMARY_COLOR}
                            maxLength={150}
                        />
                        <View style={[Styles.separatorStyle, this.props.addNewAddress.addressOneError.length > 0 && Styles.redSeparator]} />
                        <Text style={Styles.errorTextStyle}>{this.props.addNewAddress.addressOneError}</Text>

                        <TextInput 
                            style={Styles.emailStyle}
                            onChangeText={this.onAddressTwoChanged.bind(this)}
                            value={this.props.addNewAddress.addressTwo}
                            placeholder='ADDRESS TWO'
                            placeholderTextColor={MEDIUM_GREY_COLOR}
                            underlineColorAndroid="transparent"
                            selectionColor={PRIMARY_COLOR}
                            maxLength={150}
                        />
                        <View style={Styles.separatorStyle} />
                        <Text style={Styles.errorTextStyle} />

                        <TextInput 
                            style={Styles.emailStyle}
                            onChangeText={this.onProvinceChnaged.bind(this)}
                            value={this.props.addNewAddress.province}
                            placeholder='PROVINCE'
                            placeholderTextColor={MEDIUM_GREY_COLOR}
                            underlineColorAndroid="transparent"
                            selectionColor={PRIMARY_COLOR}
                            maxLength={150}
                        />
                        <View style={[Styles.separatorStyle, this.props.addNewAddress.provinceError.length > 0 && Styles.redSeparator]} />
                        <Text style={Styles.errorTextStyle}>{this.props.addNewAddress.provinceError}</Text>

                        <TextInput 
                            style={Styles.emailStyle}
                            onChangeText={this.onCityChnaged.bind(this)}
                            value={this.props.addNewAddress.city}
                            placeholder='CITY'
                            placeholderTextColor={MEDIUM_GREY_COLOR}
                            underlineColorAndroid="transparent"
                            selectionColor={PRIMARY_COLOR}
                            maxLength={150}
                        />
                        <View style={[Styles.separatorStyle, this.props.addNewAddress.cityError.length > 0 && Styles.redSeparator]} />
                        <Text style={Styles.errorTextStyle}>{this.props.addNewAddress.cityError}</Text>

                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 0.15, marginRight: 6 }}>
                                <TextInput 
                                    style={Styles.emailStyle}
                                    onChangeText={this.onPhonePrefixChanged.bind(this)}
                                    value={this.props.addNewAddress.phonePrefix}
                                    placeholder='+92'
                                    placeholderTextColor={MEDIUM_GREY_COLOR}
                                    keyboardType='phone-pad'
                                    underlineColorAndroid="transparent"
                                    selectionColor={PRIMARY_COLOR}
                                    maxLength={4}
                                />
                                <View style={Styles.separatorStyle} />
                            </View>
                            <View style={{ flex: 0.85 }}>
                                <TextInput 
                                    style={Styles.emailStyle}
                                    onChangeText={this.onPhonePostfixChanged.bind(this)}
                                    value={this.props.addNewAddress.phonePostfix}
                                    placeholder='3227676674' 
                                    placeholderTextColor={MEDIUM_GREY_COLOR}
                                    keyboardType='phone-pad'
                                    underlineColorAndroid="transparent"
                                    selectionColor={PRIMARY_COLOR}
                                    maxLength={15}
                                />
                                <View style={[Styles.separatorStyle, this.props.addNewAddress.phoneError.length > 0 && Styles.redSeparator]} />
                                <Text style={Styles.errorTextStyle}>{this.props.addNewAddress.phoneError}</Text>
                            </View>
                        </View>

                    </KeyboardAvoidingView>
                </View>

                <View style={Styles.footerStyle}>
                    <Touchable
                        onPress={this.onSubmitButtonPress.bind(this)}
                        background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}
                    >
                        <View style={Styles.buttonStyle}>
                            {
                                this.props.addNewAddress.loading ?
                                    <ActivityIndicator style={{ padding: 6 }} size='large' color={WHITE_COLOR} />
                                : //else show text
                                <Text style={Styles.buttonTextStyle}>{addressToEdit ? 'update'.toUpperCase() : 'submit'.toUpperCase()}</Text>
                                
                            }
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
        backgroundColor: BACKGROUND_COLOR
    },
    contentStyle: {
        flex: 0.9,
        paddingTop: 12,
        paddingBottom: 10
    },
    formContainerStyle: {
        paddingLeft: 16,
        paddingRight: 16
    },
    emailStyle: {
        fontSize: 18,
        fontFamily: 'Raleway-Regular',
        paddingLeft: 2,
        paddingBottom: 2
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
        flex: 0.1,
        backgroundColor: LIGHT_GREY_COLOR,
        padding: 16
    },
    buttonStyle: {
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: PRIMARY_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4
    },
    buttonTextStyle: {
        fontSize: 16,
        fontFamily: 'Raleway-Bold',
        color: WHITE_COLOR,
    }
};

const mapStateToProps = state => ({
    addNewAddress: state.addNewAddress
});

export default compose(
    graphql(createCustomerAddress, { name: 'customerCreateMutation' }),
    graphql(updateCustomerAddress, { name: 'customerUpdateMutation' }),
    connect(mapStateToProps, {
        firstNameChanged,
        lastNameChanged,
        addressOneChanged,
        addressTwoChanged,
        provinceChanged,
        cityChanged,
        phonePrefixChanged,
        phonePostfixChanged,
        submitButtonPressed,
        handleErrorMessages,
        callSuccessful,
        hideModel,
        preLoadScreenWithData
    })
)(Address);
