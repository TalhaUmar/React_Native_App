import { combineReducers } from 'redux';
import { client } from '../config/ApolloClient';
import SearchReducer from './SearchReducer';
import ShoppingCartReducer from './ShoppingCartReducer';
import SignupReducer from './SignupReducer';
import SigninReducer from './SigninReducer';
import AddNewAddressReducer from './AddNewAddressReducer';
import EditProfileReducer from './EditProfileReducer';
import ShippingAddressReducer from './ShippingAddressReducer';

export default combineReducers({
    apollo: client.reducer(),
    search: SearchReducer,
    shoppingCart: ShoppingCartReducer,
    signup: SignupReducer,
    auth: SigninReducer,
    shippingAddress: ShippingAddressReducer,
    addNewAddress: AddNewAddressReducer,
    editProfile: EditProfileReducer
});
