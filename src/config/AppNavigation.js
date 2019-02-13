import React from 'react';
import { Platform } from 'react-native';
import { 
        TabBarBottom,
        StackNavigator, 
        TabNavigator, 
        addNavigationHelpers,
    } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import Feed from '../screens/Feed';
import Products from '../screens/Products';
import Flavors from '../screens/Flavors';
// import Wallet from '../screens/Wallet';
import Stores from '../screens/Stores';
import MyProfile from '../screens/MyProfile';
import ProductDetail from '../screens/ProductDetail';
import Search from '../screens/Search';
import ShoppingCart from '../screens/ShoppingCart';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import ShippingAddress from '../screens/ShippingAddress';
import Address from '../screens/Address';
import EditProfile from '../screens/EditProfile';
import ContactUs from '../screens/ContactUs';
import { HEADER_COLOR, TINT_BLACK_COLOR, PRIMARY_COLOR } from '../../assets/colors';

export const MainScreenNavigator = TabNavigator({
    Feed: { screen: Feed,
        navigationOptions: {
            headerTitle: 'Feed',
            tabBarLabel: 'Feed',
            tabBarIcon: ({ tintColor }) => <Icon name="dashboard" size={24} color={tintColor} />
        }
    },
    Flavors: { screen: Flavors,
        navigationOptions: {
            headerTitle: 'Flavors',
            tabBarLabel: 'Flavors',
            tabBarIcon: ({ tintColor }) => <Icon name="view-list" size={24} color={tintColor} />
        }
    },
    Stores: { screen: Stores,
        navigationOptions: {
            headerTitle: 'Stores',
            tabBarLabel: 'Stores',
            tabBarIcon: ({ tintColor }) => <Icon name="map" size={24} color={tintColor} />
        }
    },
    MyProfile: { screen: MyProfile,
        navigationOptions: {
            headerTitle: 'My Account',
            tabBarLabel: 'My Account',
            tabBarIcon: ({ tintColor }) => <Icon name="account-circle" size={24} color={tintColor} />,
            // tabBarOnPress: ({ scene }) => navigation.navigate('Search')
        }
    }
},
{
    tabBarOptions: {
        activeTintColor: PRIMARY_COLOR,
        inactiveTintColor: TINT_BLACK_COLOR,
        showIcon: true, // android 
        // indicatorStyle: { height: 0 }, // android
        style: {
            backgroundColor: HEADER_COLOR,
            height: (Platform.OS === 'ios') ? 48 : 50 // TabBar
        },
        labelStyle: {
            fontSize: 12, //
        },
    },
    // initialRoute: 'Feed',
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    animationEnabled: false,
    backBehavior: 'none',
    lazy: false,
}
);

const routeConfig = {
    FirstRoute: { screen: MainScreenNavigator },
    Products: { screen: Products },
    ProductDetail: { screen: ProductDetail },
    Search: { screen: Search },
    ShoppingCart: { screen: ShoppingCart },
    Login: { screen: Login },
    Signup: { screen: Signup },
    ShippingAddress: { screen: ShippingAddress },
    Address: { screen: Address },
    EditProfile: { screen: EditProfile },
    ContactUs: { screen: ContactUs }
};

const navOptions = {
    navigationOptions: {
        headerMode: 'screen',
        mode: Platform.OS === 'ios' ? 'modal' : 'card',
        headerTitle: 'POPNOSH',
        initialRouteName: 'FirstRoute',
        // headerTintColor: '#000000',
        headerStyle: {
            backgroundColor: HEADER_COLOR,
            paddingLeft: 8,
            paddingRight: 8,
            marginTop: Platform.OS === 'ios' ? 20 : 0,
            marginBottom: 0
        }

        // headerLeft: <BackButton onPress={() => .goBack(null)} />
    }
};
export const AppNavigator = StackNavigator(routeConfig, navOptions);
const AppWithNavigationState = ({ dispatch, nav }) => (
    <AppNavigator 
        navigation={addNavigationHelpers({ dispatch, state: nav })} 
    />
);

const mapStateToProps = state => ({
    nav: state.nav
});

export default connect(mapStateToProps)(AppWithNavigationState);
