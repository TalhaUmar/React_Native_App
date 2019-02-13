import React, { Component } from 'react';
import { View,
        Text,
        Platform,
        TouchableNativeFeedback,
        TouchableHighlight,
        Image,
        BackHandler,
        FlatList,
        AsyncStorage,
        ActivityIndicator,
        Dimensions,
        Alert,
        Linking
    } from 'react-native';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { debounce } from '../utilities/AppUtils';
import { cartItemDeleteButtonPressed, updateCartItems, jumpToLoginScreen, jumpToShippingAddressScreen } from '../actions';
import { checkoutCreate, checkoutAssociateCustomer, checkoutShippingAddressUpdate } from '../myQueries';
import { BACKGROUND_COLOR, HEADER_COLOR, PRIMARY_COLOR, TINT_BLACK_COLOR, PRIMARY_LIGHT_COLOR, LIGHT_GREY_COLOR, MEDIUM_GREY_COLOR, RED_COLOR, OVERLAY_BLACK_COLOR } from '../../assets/colors';

const Touchable = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableHighlight;

class ShoppingCart extends Component {
    
    static navigationOptions = ({ navigation }) => ({
        header: null
    })

    state = { 
        hideEditAndBackButton: false, 
        mutableShoppingCartState: JSON.parse(JSON.stringify(this.props.shoppingCart)),
        loading: false,
        submitButtonText: 'next'
    };
    
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
        // this.props.navigation.state.params.productTapStateCallback();
    }
    
    componentWillUnmount() {
        this.setState({ mutableShoppingCartState: JSON.parse(JSON.stringify(this.props.shoppingCart)) });
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress = () => {
        const { navigation } = this.props;
        navigation.goBack(null);
        return true;
    };

    onEditButtonPress = () => this.setState({ hideEditAndBackButton: true });

    onDeleteButtonPress = (index) => {
        const { shoppingCartList } = this.state.mutableShoppingCartState;
        if (shoppingCartList[index].toggleDeleteButton) {
            shoppingCartList[index].toggleDeleteButton = false;
        } else {
            shoppingCartList[index].toggleDeleteButton = true;
        }
        this.setState({ mutableShoppingCartState: this.state.mutableShoppingCartState });
    }

    onOkButtonPress = () => {
        let { totalShoppingAmount, shoppingCartList } = this.state.mutableShoppingCartState;
        let newUpdatedCartArray = shoppingCartList.filter((item) => item.toggleDeleteButton === false);
        console.log(newUpdatedCartArray);
        totalShoppingAmount = parseInt(0, 10);
        newUpdatedCartArray.forEach((item) => {
            totalShoppingAmount += parseInt(item.product.itemTotalPrice, 10);
        });
        this.state.mutableShoppingCartState.shoppingCartList = newUpdatedCartArray.slice(0, newUpdatedCartArray.length);
        this.state.mutableShoppingCartState.totalShoppingAmount = totalShoppingAmount;
        this.setState({ mutableShoppingCartState: this.state.mutableShoppingCartState, hideEditAndBackButton: false });
        this.props.updateCartItems(this.state.mutableShoppingCartState);
    }

    onCancelButtonPress = () => {
        this.setState({ mutableShoppingCartState: JSON.parse(JSON.stringify(this.props.shoppingCart)), hideEditAndBackButton: false });
    }

    onNextButtonPress = () => {
        console.log('updated list', this.props.shoppingCart.shoppingCartList);
        this.setState({ loading: true });
        AsyncStorage.getItem('@customerAccessToken')
        .then((token) => {
            if (!token) {
                this.setState({ loading: false });
                this.props.navigation.navigate('CheckoutLoginScreen');
            } else {
                this.isDefaultAddressExist();
            }
        })
        .catch((error) => {
            console.log('an error occurred', error);
        });
    }

    placeCustomerOrderNow() {
        let myOrderObj = {};
        let CheckoutLineItems = [];
        myOrderObj.allowPartialAddresses = false;
        AsyncStorage.getItem('@loginCredential')
            .then((credential) => {
                myOrderObj.email = JSON.parse(credential).userEmail;
            })
            .catch();
        AsyncStorage.getItem('@loggedInCustomer')
        .then((customer) => {
            myOrderObj.customer = JSON.parse(customer);
            console.log('loggedin customer', myOrderObj.customer);
        })
        .catch();
        this.props.shoppingCart.shoppingCartList.forEach((item) => {
            CheckoutLineItems.push(
                {
                    quantity: item.quantity,
                    variantId: item.product.variantId     
                }
            );
        });
        myOrderObj.lineItems = CheckoutLineItems;
        console.log('my final checkout object', myOrderObj);
        this.props.checkoutCreateMutation({
            variables: {
                input: myOrderObj
            }
        })
        .then((checkoutResult) => {
            AsyncStorage.getItem('@customerAccessToken')
            .then((token) => {
                    if (!token) {
                        this.setState({ loading: false });
                        console.log('successfully order placed', checkoutResult);
                        Linking.openURL(checkoutResult.data.checkoutCreate.checkout.webUrl);
                } else {
                    this.props.checkoutCustomerAssociateMutation({
                        variables: {
                            checkoutId: checkoutResult.data.checkoutCreate.checkout.id,
                            customerAccessToken: token
                        }
                    }).then((checkoutCustomerAssociateResult) => {
                        AsyncStorage.getItem('@customerDefaultShippingAddress')
                            .then((node) => {
                                const defaultAddress = JSON.parse(node);
                                this.props.checkoutShippingAddressUpdateMutation({
                                    variables: {
                                        shippingAddress: {
                                            address1: defaultAddress.address1,
                                            address2: defaultAddress.address2,
                                            city: defaultAddress.city,
                                            firstName: defaultAddress.firstName,
                                            lastName: defaultAddress.lastName,
                                            province: defaultAddress.province,
                                            phone: defaultAddress.phone,
                                            zip: '54000',
                                            country: 'Pakistan'
                                        },
                                        checkoutId: checkoutCustomerAssociateResult.data.checkoutCustomerAssociate.checkout.id
                                    }
                                }).then((addressUpdateResult) => {
                                    console.log('shipping address update success result', addressUpdateResult);
                                    this.setState({ loading: false });
                                    console.log('successfully order placed', addressUpdateResult);
                                    Linking.openURL(checkoutResult.data.checkoutCreate.checkout.webUrl);
                                }).catch((error) => {
                                    console.log('shipping address update failure result', error);
                                    this.setState({ loading: false });
                                    console.log('error while customer address update', error);
                                    Linking.openURL(checkoutResult.data.checkoutCreate.checkout.webUrl);
                                });
                            }).catch();
                    }).catch((error) => {
                        this.setState({ loading: false });
                        console.log('error while customer association', error);
                        Linking.openURL(checkoutResult.data.checkoutCreate.checkout.webUrl);
                    });
                }
            })
            .catch((error) => {
                console.log('an error occurred', error);
            });
        })
        .catch((error) => {
            this.setState({ loading: false });
            console.log('oops! error occured', error);
        });
    }

    jumpToShippingAddressScreen = () => {
        AsyncStorage.getItem('@customerAccessToken')
        .then((token) => {
            this.props.navigation.navigate('CheckoutShippingAdressScreen', { accessToken: token });
        })
        .catch((error) => {
            //error
        });
    }

    isDefaultAddressExist() {
        AsyncStorage.getItem('@customerDefaultShippingAddress')
        .then((address) => {
            if (!address) {
                this.setState({ loading: false });
                Alert.alert(
                    'Shipping Address!',
                    'Order will be delivered to your default address. So please add shipping address before order placement.',
                    [
                      { text: 'Add', onPress: () => { debounce(this.jumpToShippingAddressScreen(), 500); } },
                    ],
                    { cancelable: true }
                );
            } else {
                this.placeCustomerOrderNow();
            }
        })
        .catch();
    }

    incrementQuantity(index) {
        const { shoppingCartList } = this.state.mutableShoppingCartState;
        shoppingCartList[index].quantity += 1;
        shoppingCartList[index].product.itemTotalPrice += parseInt(shoppingCartList[index].product.price, 10);
        this.setState({ mutableShoppingCartState: this.state.mutableShoppingCartState });
    }

    decrementQuantity(index) {
        const { shoppingCartList } = this.state.mutableShoppingCartState;
        if (shoppingCartList[index].quantity === 1) {

        } else {
            shoppingCartList[index].quantity -= 1;
            shoppingCartList[index].product.itemTotalPrice -= parseInt(shoppingCartList[index].product.price, 10);
            this.setState({ mutableShoppingCartState: this.state.mutableShoppingCartState });
        }
    }

    handleBackPress = () => this.props.navigation.goBack(null);

    renderProgressbar() {
        return (
            <View style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height, justifyContent: 'center', position: 'absolute', backgroundColor: OVERLAY_BLACK_COLOR, zIndex: 1000 }}>
                <ActivityIndicator size='large' color={PRIMARY_COLOR} />
            </View>
        );
    }

    renderHeader() {
        return (
            <View style={Styles.headerContainer}>
                <Touchable
                    style={Styles.backButtonStyle}
                    onPress={debounce(this.handleBackPress.bind(this), 500)}
                    background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>
                    <View style={Styles.backIconContainer}>
                        <Icon 
                            name={Platform.OS === 'android' ? 'arrow-back' : 'keyboard-arrow-left'} 
                            size={24} 
                            color={Platform.OS === 'android' ? TINT_BLACK_COLOR : '#448AFF'}
                        />
                    </View>
                </Touchable>
                <Text style={Styles.headerTitle}>Shopping Cart</Text>
                <Touchable
                    onPress={debounce(this.onEditButtonPress.bind(this), 200)}
                    background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>
                    <View style={Styles.editIconContainer}>
                        <Icon 
                            name='mode-edit'
                            size={24} 
                            color={TINT_BLACK_COLOR}
                        />
                    </View>
                </Touchable>
            </View>
        );
    }

    renderEditModeHeader() {
        return (
            <View style={Styles.headerContainer}>
                <Touchable
                    style={Styles.backButtonStyle}
                    onPress={debounce(this.onCancelButtonPress.bind(this), 200)}
                    background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>
                    <View style={Styles.backIconContainer}>
                        <Icon 
                            name={'close'} 
                            size={24} 
                            color={TINT_BLACK_COLOR}
                        />
                    </View>
                </Touchable>
                <Text style={Styles.headerTitle}>Shopping Cart</Text>
                <Touchable
                    onPress={debounce(this.onOkButtonPress.bind(this), 200)}
                    background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>
                    <View style={Styles.editIconContainer}>
                        <Icon 
                            name='check'
                            size={24} 
                            color={TINT_BLACK_COLOR}
                        />
                    </View>
                </Touchable>
            </View>
        );
    }

    renderShoppingList() {
        return (
            <View style={Styles.shoppingListContainer}>
                <FlatList
                    extraData={this.state}
                    data={this.state.mutableShoppingCartState.shoppingCartList}
                    keyExtractor={(item) => item.key}
                    renderItem={({ item, index }) => (
                        <View style={Styles.itemCardContainer}>
                            <View style={Styles.itemCard}>
                                {
                                    this.state.hideEditAndBackButton &&
                                    <View style={{ justifyContent: 'center', alignItems: 'center', marginRight: 2 }}>
                                        <Touchable onPress={this.onDeleteButtonPress.bind(this, index)}>
                                            <View style={{ padding: 2 }}>
                                                {
                                                    (!item.toggleDeleteButton) ?
                                                        <Icon name='delete' size={18} color={MEDIUM_GREY_COLOR} />
                                                    :// else show grey delete icon
                                                        <Icon name='delete-forever' size={18} color={RED_COLOR} />
                                                }
                                            </View>
                                        </Touchable>
                                    </View>
                                }
                                <Image style={Styles.itemImageStyle} source={{ uri: item.product.imageSrc }} resizeMethod='resize' />
                                <View style={Styles.itemInfoContainerStyle}>    
                                    <Text style={Styles.itemTitleStyle} numberOfLines={1} ellipsizeMode='tail'>{item.product.title}</Text>
                                    <Text style={Styles.itemVariantStyle}>{item.product.variantTitle}</Text>
                                    <View style={Styles.itemVariantAndPriceContainerStyle}>
                                        {
                                            this.state.hideEditAndBackButton ?
                                            //show quantity edit view
                                            <View style={{ justifyContent: 'space-between' }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Touchable
                                                        onPress={this.decrementQuantity.bind(this, index)}
                                                    >
                                                        <View style={{ padding: 0 }}>
                                                            <Icon name='keyboard-arrow-left' size={20} color={TINT_BLACK_COLOR} />
                                                        </View>
                                                    </Touchable>
                                                        <View style={{ paddingLeft: 16, paddingRight: 16, borderWidth: 0.9, borderStyle: 'solid', borderRadius: 2, borderColor: LIGHT_GREY_COLOR }}>
                                                            <Text style={{ textAlign: 'center', fontSize: 12, fontFamily: 'Raleway-Regular' }}>{item.quantity}</Text>
                                                        </View>
                                                    <Touchable
                                                        onPress={this.incrementQuantity.bind(this, index)}
                                                    >
                                                        <View style={{ padding: 0 }}>
                                                            <Icon name='keyboard-arrow-right' size={20} color={TINT_BLACK_COLOR} />
                                                        </View>
                                                    </Touchable>
                                                </View>
                                            </View>
                                            :// else show total quantity view
                                            <Text style={Styles.itemQuantityStyle}>{'Qty: '}{item.quantity} * {item.product.price}</Text>
                                        }
                                    
                                        <Text style={Styles.itemPriceStyle}>{item.product.itemTotalPrice}PKR</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}
                />
            </View>
        );
    }

    renderFooter() {
        return (
            <View style={Styles.footerContainer}>
                <View style={Styles.checkoutContainer}>
                    <View style={Styles.productsNumberContainer}>
                        <Text style={Styles.prodNumTextStyle}>{this.state.mutableShoppingCartState.shoppingCartList.length} items</Text>
                    </View>
                    <View style={Styles.checkoutButtonAndPriceContainer}>
                        <Text style={Styles.totalPriceStyle}>{'Total: '}{this.state.mutableShoppingCartState.totalShoppingAmount}{'PKR'}</Text>
                        <Touchable
                            onPress={debounce(this.onNextButtonPress.bind(this), 500)}
                        >
                            <View style={Styles.buyButtonHolderStyle}>
                                <Text style={Styles.buyTextStyle}>{this.state.submitButtonText.toUpperCase()}</Text>
                            </View>
                        </Touchable>
                    </View>
                </View>
            </View>
        );
    }

    renderEmptyMessage() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Icon name='sentiment-very-dissatisfied' size={46} color={PRIMARY_COLOR} />
                <Text style={{ fontSize: 16, fontFamily: 'Raleway-Medium', color: TINT_BLACK_COLOR }}>Your shopping cart is empty!</Text>
            </View>
        );
    }

    render() {
        return (
            <View style={Styles.mainContainerStyle}>
            {/* Header container start here */}
            {
                this.state.loading && this.renderProgressbar()
            }
                {
                    (!this.state.hideEditAndBackButton) ?
                        this.renderHeader()
                    ://else show cancel and ok buttons
                        this.renderEditModeHeader()
                }

                { (this.state.mutableShoppingCartState.shoppingCartList.length > 0) ?
            // middle content container
                    <View style={{ flex: 1 }}>
                        {
                            this.renderShoppingList()
                        }
                            
                        {
                            this.renderFooter()
                        }
                                
                    </View>        
                    ://else statement for emtpy message
                        this.renderEmptyMessage()
                
                }
            </View>
        );
    }
}

const mapStateToProps = state => ({
    shoppingCart: state.shoppingCart
});

const Styles = {
    mainContainerStyle: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
    },
    headerContainer: {
        marginTop: 20,
        flexDirection: 'row', 
        borderBottomWidth: 1, 
        marginBottom: 8, 
        borderBottomColor: LIGHT_GREY_COLOR, 
        height: 48,
        justifyContent: 'space-between',
        backgroundColor: HEADER_COLOR
    },
    backButtonStyle: {

    },
    backIconContainer: {
        paddingLeft: 16,
        paddingTop: 12,
        paddingRight: 12,
        paddingBottom: 12
    },
    headerTitle: {
        fontSize: 16,
        fontFamily: 'Raleway-Bold',
        color: TINT_BLACK_COLOR,
        paddingTop: 14
    },
    editIconContainer: {
        paddingRight: 16,
        paddingTop: 12,
        paddingLeft: 12,
        paddingBottom: 12
    },
    shoppingListContainer: {
        flex: 0.8,
        // backgroundColor: 'red',
        // alignItems: 'flex-start',
        paddingLeft: 12,
        paddingRight: 12,
    },
    footerContainer: {
        flex: 0.2,
        alignItems: 'flex-end',
        backgroundColor: LIGHT_GREY_COLOR
    },
    checkoutContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    productsNumberContainer: {
        flex: 0.5,
        alignItems: 'flex-start',
    },
    checkoutButtonAndPriceContainer: {
        flex: 0.5,
        alignItems: 'flex-end',
        paddingTop: 12,
        paddingRight: 20,
    },
    prodNumTextStyle: {
        fontSize: 16,
        fontFamily: 'Raleway-Regular',
        marginTop: 16,
        marginLeft: 16,
        color: PRIMARY_COLOR
    },
    totalPriceStyle: {
        fontSize: 18,
        fontFamily: 'Raleway-Bold',
        textAlign: 'center',
        color: PRIMARY_COLOR,
        marginBottom: 6
    },
    buyTextStyle: {
        fontSize: 18,
        fontFamily: 'Raleway-Bold',
        textAlign: 'center',
        color: PRIMARY_LIGHT_COLOR,
    },
    buyButtonHolderStyle: {
        width: 100, 
        height: 40, 
        paddingLeft: 6, 
        paddingRight: 6, 
        backgroundColor: PRIMARY_COLOR, 
        justifyContent: 'center'
    },
    itemCardContainer: {
        paddingBottom: 6, 
        paddingLeft: 10, 
        paddingRight: 10, 
        paddingTop: 10, 
        borderBottomColor: LIGHT_GREY_COLOR, 
        borderBottomWidth: 1, 
        marginBottom: 4
    },
    itemCard: {
        flexDirection: 'row',
    },
    itemImageStyle: {
        width: 50,
        height: 60,
    },
    itemInfoContainerStyle: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 4
    },
    itemTitleStyle: {
        fontSize: 16,
        fontFamily: 'Raleway-Regular',
        color: TINT_BLACK_COLOR,
        marginBottom: 2
    },
    itemVariantStyle: {
        fontSize: 11,
        fontFamily: 'Raleway-Regular',
        color: PRIMARY_COLOR,
        marginBottom: 4
    },
    itemQuantityStyle: {
        fontSize: 12,
        fontFamily: 'Raleway-Regular',
        color: TINT_BLACK_COLOR
    },
    itemVariantAndPriceContainerStyle: {
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    itemPriceStyle: {
        fontSize: 14,
        fontFamily: 'Raleway-Regular',
        color: PRIMARY_COLOR
    }
};

export default compose(
 graphql(checkoutCreate, { name: 'checkoutCreateMutation' }),
 graphql(checkoutAssociateCustomer, { name: 'checkoutCustomerAssociateMutation' }),
 graphql(checkoutShippingAddressUpdate, { name: 'checkoutShippingAddressUpdateMutation' }),
 connect(mapStateToProps, { 
        cartItemDeleteButtonPressed,
        updateCartItems,
        jumpToLoginScreen
    })
)(ShoppingCart);

                                            // <View style={{ justifyContent: 'space-between' }}>
                                            //     <View style={{ flexDirection: 'row' }}>
                                            //         <Touchable>
                                            //             <View style={{ padding: 0 }}>
                                            //                 <Icon name='keyboard-arrow-left' size={20} color={TINT_BLACK_COLOR} />
                                            //             </View>
                                            //         </Touchable>
                                            //             <View style={{ paddingLeft: 16, paddingRight: 16, borderWidth: 0.9, borderStyle: 'solid', borderRadius: 2, borderColor: LIGHT_GREY_COLOR }}>
                                            //                 <Text style={{ textAlign: 'center', fontSize: 12, fontFamily: 'Raleway-Regular' }}>1</Text>
                                            //             </View>
                                            //         <Touchable>
                                            //             <View style={{ padding: 0 }}>
                                            //                 <Icon name='keyboard-arrow-right' size={20} color={TINT_BLACK_COLOR} />
                                            //             </View>
                                            //         </Touchable>
                                            //     </View>
                                            // </View>