import { 
    FIRST_NAME_CHANGED,
    LAST_NAME_CHANGED,
    ADDRESS_ONE_CHANGED,
    ADDRESS_TWO_CHANGED,
    PROVINCE_CHANGED,
    CITY_CHANGED,
    PHONE_PREFIX_CHANGED,
    PHONE_POSTFIX_CHANGED,
    SUBMIT_BUTTON_PRESSED,
    HANDLE_ERROR_MESSAGES,
    CALL_SUCCESSFUL,
    HIDE_MODEL,
    PRELOAD_SCREEN_WITH_DATA
 } from '../actions/ActionTypes';

const INITIAL_STATE = {
    firstName: '',
    lastName: '',
    addressOne: '',
    addressTwo: '',
    province: '',
    city: '',
    phonePrefix: '',
    phonePostfix: '',
    loading: false,
    firstNameError: '',
    lastNameError: '',
    addressOneError: '',
    provinceError: '',
    cityError: '',
    phoneError: '',
    readyToSendQuery: false,
    modalVisibility: false,
    isCallSuccessful: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case PRELOAD_SCREEN_WITH_DATA:
            const { id, address1, address2, firstName, lastName, city, phone, province } = action.payload;
            return { 
                ...state, 
                firstName: firstName, 
                lastName: lastName, 
                addressOne: address1, 
                addressTwo: address2, 
                province: province, 
                city: city, 
                phonePrefix: phone.substr(0, 3),
                phonePostfix: phone.substr(3, phone.length), 
            };
        case FIRST_NAME_CHANGED:
            return { ...state, firstName: action.payload, firstNameError: '' };
        case LAST_NAME_CHANGED:
            return { ...state, lastName: action.payload, lastNameError: '' };
        case ADDRESS_ONE_CHANGED:
            return { ...state, addressOne: action.payload, addressOneError: '' };
        case ADDRESS_TWO_CHANGED:
            return { ...state, addressTwo: action.payload };
        case PROVINCE_CHANGED:
            return { ...state, province: action.payload, provinceError: '' };
        case CITY_CHANGED:
            return { ...state, city: action.payload, cityError: '' };
        case PHONE_PREFIX_CHANGED:
            return { ...state, phonePrefix: action.payload, phoneError: '' };
        case PHONE_POSTFIX_CHANGED:
            return { ...state, phonePostfix: action.payload, phoneError: '' };
        case SUBMIT_BUTTON_PRESSED: {
            const { firstName, lastName, addressOne, province, city, phonePrefix, phonePostfix } = action.payload;
            if (firstName.length === 0) {
                return { ...state, loading: false, firstNameError: 'First name is required' };
            }
            if (firstName.length < 2) {
                return { ...state, loading: false, firstNameError: 'First name is not valid' };
            }
            if (lastName.length === 0) {
                return { ...state, loading: false, lastNameError: 'Last name is required' };
            }
            if (lastName.length < 2) {
                return { ...state, loading: false, lastNameError: 'Last name is not valid' };
            }
            if (addressOne.length === 0) {
                return { ...state, loading: false, addressOneError: 'Address one is required' };
            }
            if (province.length === 0) {
                return { ...state, loading: false, provinceError: 'Province is required' };
            }
            if (province.length < 2) {
                return { ...state, loading: false, provinceError: 'Province is not valid' };
            }
            if (city.length === 0) {
                return { ...state, loading: false, cityError: 'City is requuired' };
            }
            if (city.length < 2) {
                return { ...state, loading: false, cityError: 'City is not valid' };
            }
            if (phonePrefix.length === 0) {
                return { ...state, loading: false, phoneError: 'Country code is required' };
            }
            if (phonePostfix.length === 0) {
                return { ...state, loading: false, phoneError: 'Phone number is required' };
            }

            return { ...state, loading: true, readyToSendQuery: true, firstNameError: '', lastNameError: '', addressOneError: '', provinceError: '', cityError: '' };
        }
        case HANDLE_ERROR_MESSAGES:
            action.payload.forEach((item) => {
                if (item.field[0] === 'input' && item.field[1] === 'address1') {
                    state.addressOneError = item.message;
                }
                if (item.field[0] === 'input' && item.field[1] === 'province') {
                    state.provinceError = item.message;
                }
                if (item.field[0] === 'input' && item.field[1] === 'city') {
                    state.cityError = item.message;
                }
                if (item.field[0] === 'input' && item.field[1] === 'phone') {
                    state.phoneError = item.message;
                }
                if (item.field[0] === 'address') {
                    state.addressOneError = item.message;
                }
            });
            
            return { ...state, loading: false, readyToSendQuery: false };
        case CALL_SUCCESSFUL: {
            return { ...state,
                isCallSuccessful: true,
                modalVisibility: true,
                firstName: '',
                lastName: '',
                addressOne: '',
                addressTwo: '',
                province: '',
                city: '',
                phonePrefix: '',
                phonePostfix: '',
                loading: false,
                firstNameError: '',
                lastNameError: '',
                addressOneError: '',
                provinceError: '',
                cityError: '',
                phoneError: '',
                readyToSendQuery: false,
            };
        }
        case HIDE_MODEL: 
            return { ...state, modalVisibility: false };
        default:
                return state;
        }
};
