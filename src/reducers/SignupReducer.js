import {
    FIRST_NAME_CHANGED,
    LAST_NAME_CHANGED,
    EMAIL_CHANGED,
    PASSWORD_CHANGED,
    PHONE_PREFIX_CHANGED,
    PHONE_POSTFIX_CHANGED,
    ACCEPTS_MARKETING_EMAIL_TOGGLED,
    SIGNUP_BUTTON_PRESSED,
    SIGNUP_SUCCESS,
    SIGNUP_ERROR_MESSAGES,
    HIDE_MODEL
} from '../actions/ActionTypes';

const INITIAL_STATE = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    phonePrefix: '',
    phonePostfix: '',
    acceptsMarketingEmail: false,
    loading: false,
    firstNameError: '',
    lastNameError: '',
    emailError: '',
    passwordError: '',
    phoneError: '',
    readyToSendQuery: false,
    createdCustomer: {},
    isSignupSuccessful: false,
    signupModelVisibility: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FIRST_NAME_CHANGED:
            return { ...state, firstName: action.payload, firstNameError: '' };
        case LAST_NAME_CHANGED:
            return { ...state, lastName: action.payload, lastNameError: '' };
        case EMAIL_CHANGED:
            return { ...state, email: action.payload, emailError: '' };
        case PASSWORD_CHANGED:
            return { ...state, password: action.payload, passwordError: '' };
        case PHONE_PREFIX_CHANGED:
            return { ...state, phonePrefix: action.payload, phoneError: '' };
        case PHONE_POSTFIX_CHANGED:
            return { ...state, phonePostfix: action.payload, phoneError: '' };
        case ACCEPTS_MARKETING_EMAIL_TOGGLED:
            return { ...state, acceptsMarketingEmail: action.payload };
        case SIGNUP_BUTTON_PRESSED: {
            const { firstName, lastName, email, password, phonePrefix, phonePostfix } = action.payload;
            if (firstName.length === 0) {
                return { ...state, loading: false, firstNameError: 'First name is required' };
            }
            if (lastName.length === 0) {
                return { ...state, loading: false, lastNameError: 'Last name is required' };
            }
            if (email.length === 0) {
                return { ...state, loading: false, emailError: 'Email is required' };
            }
            if (password.length === 0) {
                return { ...state, loading: false, passwordError: 'Password is required' };
            }
            if (phonePrefix.length === 0) {
                return { ...state, loading: false, phoneError: 'Country code is required' };
            }
            if (phonePostfix.length === 0) {
                return { ...state, loading: false, phoneError: 'Phone number is required' };
            }
            if (firstName.length < 2) {
                return { ...state, loading: false, firstNameError: 'First name is not valid' };
            }
            if (lastName.length < 2) {
                return { ...state, loading: false, lastNameError: 'Last name is not valid' };
            }
            if (password.length < 5) {
                return { ...state, loading: false, passwordError: 'Password should be 5 characters long' };
            }
            if (phonePrefix.length < 2) {
                return { ...state, loading: false, phoneError: 'Country code is not valid' };
            }
            if (phonePostfix.length < 10) {
                return { ...state, loading: false, phoneError: 'Phone is not valid' };
            }
             
            return { ...state, loading: true, firstNameError: '', lastNameError: '', phoneError: '', passwordError: '', emailError: '', readyToSendQuery: true };
        }
        case SIGNUP_ERROR_MESSAGES:
            action.payload.forEach((item) => {
                if (item.field[0] === 'input' && item.field[1] === 'email') {
                    state.emailError = item.message;
                }
                if (item.field[0] === 'input' && item.field[1] === 'password') {
                    state.passwordError = item.message;
                }
                if (item.field[0] === 'input' && item.field[1] === 'phone') {
                    state.phoneError = item.message;
                }
            });
            return { ...state, loading: false, readyToSendQuery: false };
        case SIGNUP_SUCCESS: {
            return { ...state,
                isSignupSuccessful: true,
                signupModelVisibility: true,
                createdCustomer: action.payload,
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                phone: '',
                phonePrefix: '',
                phonePostfix: '',
                acceptsMarketingEmail: false,
                loading: false,
                firstNameError: '',
                lastNameError: '',
                emailError: '',
                passwordError: '',
                phoneError: '',
                readyToSendQuery: false,
                 };
        }
        case HIDE_MODEL: 
            return { ...state, signupModelVisibility: false };
        default:
            return state;
    }
};

