import { RELOAD_SHIPPING_ADDRESSES } from '../actions/ActionTypes';

const INITIAL_STATE = {
    reloadShippingAddresses: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case RELOAD_SHIPPING_ADDRESSES:
            if (state.reloadShippingAddresses) {
                return { ...state, reloadShippingAddresses: false };
            }
            return { ...state, reloadShippingAddresses: true };
        default:
        return state;
    }
};
