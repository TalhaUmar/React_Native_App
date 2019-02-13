import { AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation';
import {
    EMAIL_CHANGED,
    PASSWORD_CHANGED,
    SIGNIN_BUTTON_PRESSED,
    SIGNIN_SUCCESS,
    SIGNIN_ERROR_MESSAGES,
    SIGNEDIN_CUSTOMER,
    HIDE_MODEL
} from '../actions/ActionTypes';
import { client } from '../config/ApolloClient';
import { getCustomerObject } from '../myQueries';

const INITIAL_STATE = {
    signinEmail: '',
    signinPassword: '',
    loading: false,
    emailError: '',
    passwordError: '',
    readyToSendQuery: false,
    customerAccessToken: '',
    accessTokenExpiry: '',
    isLoggedIn: false,
    loggedInCustomer: {},
    signupModelVisibility: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case EMAIL_CHANGED:
            return { ...state, signinEmail: action.payload, emailError: '' };
        case PASSWORD_CHANGED:
            return { ...state, signinPassword: action.payload, passwordError: '' };
        case SIGNIN_BUTTON_PRESSED: 
            return { ...state, loading: true, readyToSendQuery: true };
        case SIGNIN_ERROR_MESSAGES:
            return { ...state, passwordError: 'Invalid credentials', loading: false, readyToSendQuery: false };
        case SIGNIN_SUCCESS: {
            const token = AsyncStorage.getItem('@customerAccessToken');
            const expiry = AsyncStorage.getItem('@accessTokenExpiry');
            const loginDetails = AsyncStorage.getItem('@loginCredential');
            const loginCredential = {
                userEmail: action.payload.userEmail,
                userPassword: action.payload.userPassword
            };
            if (token === null && expiry === null && loginDetails === null) {
                AsyncStorage.setItem('@customerAccessToken', action.payload.accessToken);
                AsyncStorage.setItem('@accessTokenExpiry', action.payload.expiresAt);
                AsyncStorage.setItem('@loginCredential', JSON.stringify(loginCredential));
            } else {
                AsyncStorage.removeItem('@customerAccessToken');
                AsyncStorage.removeItem('@accessTokenExpiry');
                AsyncStorage.removeItem('@loginCredential');
                AsyncStorage.setItem('@customerAccessToken', action.payload.accessToken);
                AsyncStorage.setItem('@accessTokenExpiry', action.payload.expiresAt);
                AsyncStorage.setItem('@loginCredential', JSON.stringify(loginCredential));
            }
            
            return { ...state, customerAccessToken: action.payload.accessToken, accessTokenExpiry: action.payload.expiresAt, readyToSendQuery: false };
        }
        case SIGNEDIN_CUSTOMER: {
            const customer = AsyncStorage.getItem('@loggedInCustomer');
            if (customer === null) {
                AsyncStorage.setItem('@loggedInCustomer', JSON.stringify(action.payload.data.customer));
            } else {
                AsyncStorage.removeItem('@loggedInCustomer');
                AsyncStorage.setItem('@loggedInCustomer', JSON.stringify(action.payload.data.customer));
            }
            
            return { ...state, signinEmail: '', signinPassword: '', passwordError: '', isLoggedIn: true, loggedInCustomer: action.payload.data, loading: false, readyToSendQuery: false, signupModelVisibility: true };
        }
        case HIDE_MODEL: 
            return { ...state, signupModelVisibility: false };
        default:
            return state;
    }
};
