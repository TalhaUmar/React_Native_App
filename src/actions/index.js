import { AsyncStorage } from 'react-native';
import { 
        RETAIN_FETCHED_PRODUCTS,
        JUMP_TO_PRODUCTS_SCREEN,
        MOVE_TO_PRODUCT_DETAIL_SCREEN,
        JUMP_TO_LOGIN_SCREEN,
        JUMP_TO_SIGNUP_SCREEN,
        JUMP_TO_MY_ACCOUNT_TAB,
        JUMP_TO_SHIPPING_ADDRESS_SCREEN,
        JUMP_TO_EDIT_PROFILE_SCREEN,
        JUMP_TO_CONTACT_US_SCREEN,
        JUMP_TO_MY_ORDERS_SCREEN,
        JUMP_TO_ADD_NEW_ADDRESS_SCREEN,
        SAVE_SEARCH_STRING,
        SEARCH_RESULT_LIST_VISIBILITY,
        ADD_PRODUCT_TO_SHOPPING_CART,
        CART_ITEM_DELETE_BUTTON_PRESSED,
        UPDATE_CART_ITEMS,
        FIRST_NAME_CHANGED,
        LAST_NAME_CHANGED,
        EMAIL_CHANGED,
        PASSWORD_CHANGED,
        PHONE_POSTFIX_CHANGED,
        PHONE_PREFIX_CHANGED,
        ACCEPTS_MARKETING_EMAIL_TOGGLED,
        SIGNUP_BUTTON_PRESSED,
        SIGNUP_SUCCESS,
        SIGNUP_ERROR_MESSAGES,
        SIGNIN_SUCCESS,
        SIGNIN_BUTTON_PRESSED,
        SIGNIN_ERROR_MESSAGES,
        SIGNEDIN_CUSTOMER,
        HIDE_MODEL,
        ADDRESS_ONE_CHANGED,
        ADDRESS_TWO_CHANGED,
        PROVINCE_CHANGED,
        CITY_CHANGED,
        SUBMIT_BUTTON_PRESSED,
        RELOAD_SHIPPING_ADDRESSES,
        HANDLE_ERROR_MESSAGES,
        CALL_SUCCESSFUL,
        BUTTON_PRESSED,
        PRELOAD_SCREEN_WITH_DATA,
        UPDATE_CUSTOMER_AND_RENEW_ACCESS_TOKEN
    } from './ActionTypes';
import { client } from '../config/ApolloClient';
import { getCustomerObject, createCustomerAccessToken } from '../myQueries';

export const retainFetechedProducts = (productsList) => {
    return {
        type: RETAIN_FETCHED_PRODUCTS,
        payload: productsList
    };
};

export const jumpToProductsScreen = (data) => ({
    type: JUMP_TO_PRODUCTS_SCREEN,
    payload: data
});

export const moveToProductDetailScreen = (product) => ({
    type: MOVE_TO_PRODUCT_DETAIL_SCREEN,
    payload: product
});

export const jumpToLoginScreen = () => ({
    type: JUMP_TO_LOGIN_SCREEN
});

export const jumpToSignupScreen = () => ({
    type: JUMP_TO_SIGNUP_SCREEN
});

export const jumpToMyAccountTab = () => ({
    type: JUMP_TO_MY_ACCOUNT_TAB
});

export const jumpToShippingAddressScreen = (data) => ({
    type: JUMP_TO_SHIPPING_ADDRESS_SCREEN,
    payload: data
});

export const jumpToEditProfileScreen = (data) => ({
    type: JUMP_TO_EDIT_PROFILE_SCREEN,
    payload: data
});

export const jumpToContactUsScreen = () => ({
    type: JUMP_TO_CONTACT_US_SCREEN
});

export const jumpToMyOrdersScreen = (data) => ({
    type: JUMP_TO_MY_ORDERS_SCREEN,
    payload: data
});

export const jumpToAddNewAddressScreen = (data) => ({
    type: JUMP_TO_ADD_NEW_ADDRESS_SCREEN,
    payload: data
});

export const saveSearchString = (searchString) => ({
    type: SAVE_SEARCH_STRING,
    payload: searchString
});

export const setSearchResultListVisibility = (flag) => ({
    type: SEARCH_RESULT_LIST_VISIBILITY,
    payload: flag
});

/* 
*    Shopping Cart actions starts here...
*/
export const addProductToShoppingCartList = (product) => ({
    type: ADD_PRODUCT_TO_SHOPPING_CART,
    payload: product
});

export const cartItemDeleteButtonPressed = (variantId) => ({
    type: CART_ITEM_DELETE_BUTTON_PRESSED,
    payload: variantId
});

export const updateCartItems = (list) => ({
    type: UPDATE_CART_ITEMS,
    payload: list
});

export const onNextButtonPress = () => ({
    type: BUTTON_PRESSED
});

/* 
    Signup actions starts here...
*/
export const firstNameChanged = (firstName) => ({
    type: FIRST_NAME_CHANGED,
    payload: firstName
});

export const lastNameChanged = (lastName) => ({
    type: LAST_NAME_CHANGED,
    payload: lastName
});

export const emailChanged = (email) => ({
    type: EMAIL_CHANGED,
    payload: email
});

export const passwordChanged = (password) => ({
    type: PASSWORD_CHANGED,
    payload: password
});

export const phonePrefixChanged = (phone) => ({
    type: PHONE_PREFIX_CHANGED,
    payload: phone
});

export const phonePostfixChanged = (phone) => ({
    type: PHONE_POSTFIX_CHANGED,
    payload: phone
});

export const marketingEmailToggleButton = (flag) => ({
    type: ACCEPTS_MARKETING_EMAIL_TOGGLED,
    payload: flag
});

export const signupButtonPressed = (customer) => ({
    type: SIGNUP_BUTTON_PRESSED,
    payload: customer  
});

export const handleCustomerCreateResponse = (userErrorsArray) => ({
    type: SIGNUP_ERROR_MESSAGES,
    payload: userErrorsArray
});

export const signupSuccessful = (createdCustomer) => ({
    type: SIGNUP_SUCCESS,
    payload: createdCustomer
});

export const hideModel = () => ({
    type: HIDE_MODEL
});

/*
    Signin Actions starts here...
*/
export const signinButtonPressed = () => ({
    type: SIGNIN_BUTTON_PRESSED,
});

export const handleSignInErrors = () => ({
    type: SIGNIN_ERROR_MESSAGES
});

export const handleSignInSuccess = (response) => {
    return (dispatch) => {
        dispatch({
            type: SIGNIN_SUCCESS,
            payload: response
        });
        client.query({
            query: getCustomerObject,
            variables: { 
                customerAccessToken: `${response.accessToken}`
        }
        }).then((result) => {
            // console.log('here is my result', result);
            dispatch({
                type: SIGNEDIN_CUSTOMER,
                payload: result
            });
        }).catch((error) => {
            console.log('there was an error sending the query: ', error);
        });
    };
};

/*
    Add Address Actions starts here...
*/
export const addressOneChanged = (addressOne) => ({
    type: ADDRESS_ONE_CHANGED,
    payload: addressOne
});

export const addressTwoChanged = (addressTwo) => ({
    type: ADDRESS_TWO_CHANGED,
    payload: addressTwo
});

export const provinceChanged = (province) => ({
    type: PROVINCE_CHANGED,
    payload: province
});

export const cityChanged = (city) => ({
    type: CITY_CHANGED,
    payload: city
});

export const submitButtonPressed = (addressInput) => ({
    type: SUBMIT_BUTTON_PRESSED,
    payload: addressInput
});

export const handleErrorMessages = (errorsArray) => ({
    type: HANDLE_ERROR_MESSAGES,
    payload: errorsArray
});

export const callSuccessful = (responseResult) => {
    return (dispatch) => {
        dispatch({
            type: CALL_SUCCESSFUL,
            payload: responseResult
        });
        dispatch({
            type: RELOAD_SHIPPING_ADDRESSES
        });
    };
};

/*
*   Shipping Address Actions here...
*/
export const changeReloadShippingAddressFlag = () => ({
    type: RELOAD_SHIPPING_ADDRESSES
});

/*
*   EditProfile Actions here...
*/
export const buttonPressed = (data) => ({
    type: BUTTON_PRESSED,
    payload: data
});

export const preLoadScreenWithData = (data) => ({
    type: PRELOAD_SCREEN_WITH_DATA,
    payload: data
});

export const profileUpdatedSuccessfully = (responseResult) => {
    return (dispatch) => {
        dispatch({
            type: UPDATE_CUSTOMER_AND_RENEW_ACCESS_TOKEN,
            payload: responseResult
        });
        client.mutate({
            mutation: createCustomerAccessToken,
            variables: { input: {
                email: responseResult.customer.email,
                password: responseResult.newPassword
                }
            }
        })
        .then((response) => {
            dispatch({
                type: CALL_SUCCESSFUL,
                payload: {
                    accessToken: response.data.customerAccessTokenCreate.customerAccessToken.accessToken,
                    expiresAt: response.data.customerAccessTokenCreate.customerAccessToken.expiresAt,
                    userEmail: responseResult.customer.email,
                    userPassword: responseResult.newPassword
                }
            });
        }).catch((error) => {
            console.log('there was an error sending the query', JSON.parse(JSON.stringify(error)));
        });
    };
};
