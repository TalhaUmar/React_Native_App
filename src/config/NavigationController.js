import React from 'react';
import { Platform, AsyncStorage } from 'react-native';
import { 
        TabBarBottom,
        StackNavigator, 
        TabNavigator, } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Feed from '../screens/Feed';
import Products from '../screens/Products';
import Flavors from '../screens/Flavors';
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
import { 
    HEADER_COLOR, 
    TINT_BLACK_COLOR, 
    PRIMARY_COLOR 
} from '../../assets/colors';

const FeedScreenStack = StackNavigator(
    {
        FeedScreen: { screen: Feed }
    },
);

const FlavorsScreenStack = StackNavigator(
    {
        FlavorsScreen: { screen: Flavors },
        ProductsScreen: { screen: Products },
        ProductDetailScreen: { screen: ProductDetail },
        SearchScreen: { screen: Search },
        ShoppingCartScreen: { screen: ShoppingCart },
        CheckoutLoginScreen: { screen: Login },
        CheckoutShippingAddressScreen: { screen: ShippingAddress }
    }
);

const StoresScreenStack = StackNavigator(
    {
        StoresScreen: { screen: Stores }
    }
);

const LoginSignupStack = StackNavigator(
    {
        LoginScreen: { screen: Login },
        SignupScreen: { screen: Signup }
    }
);

const ProfileScreenStack = StackNavigator(
    {
        MyProfileScreen: { screen: MyProfile },
        LoginSignupScreenStack: { screen: LoginSignupStack },
        ShippingAddressScreen: { screen: ShippingAddress },
        AddressScreen: { screen: Address },
        EditProfileScreen: { screen: EditProfile },
        ContactUsScreen: { screen: ContactUs }
    },
    {
        navigationOptions: {
            header: null,
            mode: Platform.OS === 'ios' ? 'modal' : 'card',
            initialRouteName: 'MyProfileScreen'
        }
    }
);
    
export const MainScreenNavigator = TabNavigator({
        Feed: { screen: FeedScreenStack,
            navigationOptions: {
                headerTitle: 'Feed',
                tabBarLabel: 'Feed',
                tabBarIcon: ({ tintColor }) => <Icon name="dashboard" size={24} color={tintColor} />
            }
        },
        Flavors: { screen: FlavorsScreenStack,
            navigationOptions: {
                headerTitle: 'Flavors',
                tabBarLabel: 'Flavors',
                tabBarIcon: ({ tintColor }) => <Icon name="view-list" size={24} color={tintColor} />
            }
        },
        Stores: { screen: StoresScreenStack,
            navigationOptions: {
                headerTitle: 'Stores',
                tabBarLabel: 'Stores',
                tabBarIcon: ({ tintColor }) => <Icon name="map" size={24} color={tintColor} />
            }
        },
        MyProfile: { screen: ProfileScreenStack,
            navigationOptions: ({ navigation }) => ({
                headerTitle: 'My Account',
                tabBarLabel: 'My Account',
                tabBarIcon: ({ tintColor }) => <Icon name="account-circle" size={24} color={tintColor} />,
                tabBarOnPress: (scene, jumpToIndex) => {
                    console.log(scene, scene.index);
                  AsyncStorage.getItem('@customerAccessToken')
                  .then((token) => {
                        if (!token) {
                            navigation.popToTop();
                            navigation.navigate('LoginSignupScreenStack');
                        } else {
                            AsyncStorage.getItem('@accessTokenExpiry')
                            .then((expirydate) => {
                                const tokenExpiryDate = new Date(expirydate);
                                const currentDate = new Date();
                                if (currentDate >= tokenExpiryDate) {
                                    AsyncStorage.removeItem('@customerAccessToken');
                                    AsyncStorage.removeItem('@accessTokenExpiry');
                                    AsyncStorage.removeItem('@loggedInCustomer');
                                    navigation.popToTop();
                                    navigation.navigate('LoginSignupScreenStack');
                                } else {
                                    console.log('jumping to profile tab');
                                    jumpToIndex(scene.index);
                                }
                            })
                            .catch((error) => {
                                //error
                            });
                        }
                  })
                  .catch((error) => {
                      //error
                  });
                }
            })
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
        initialRoute: 'FirstRoute',
        tabBarComponent: TabBarBottom,
        tabBarPosition: 'bottom',
        swipeEnabled: false,
        animationEnabled: false,
        backBehavior: 'FirstRoute',
        lazy: false,
    }
);

const routeConfig = {
    FirstRoute: { screen: MainScreenNavigator },
};

const mainNavOptions = {
    navigationOptions: {
        header: null,
        mode: Platform.OS === 'ios' ? 'modal' : 'card',
        headerTitle: 'POPNOSH',
        initialRouteName: 'FirstRoute',
        // headerTintColor: '#000000',
        headerStyle: {
            backgroundColor: HEADER_COLOR,
            paddingLeft: 8,
            paddingRight: 8,
            marginTop: 20,
            marginBottom: 0
        }

        // headerLeft: <BackButton onPress={() => .goBack(null)} />
    }
};

const AppNavigator = StackNavigator(routeConfig, mainNavOptions);

export default AppNavigator;
