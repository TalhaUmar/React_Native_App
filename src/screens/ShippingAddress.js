import React, { Component } from 'react';
import { 
    View,
    Text,
    AsyncStorage,
    Platform,
    TouchableNativeFeedback,
    TouchableHighlight,
    Dimensions,
    BackHandler,
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Alert
} from 'react-native';
import { compose, graphql } from 'react-apollo';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { BACKGROUND_COLOR, PRIMARY_COLOR, TINT_BLACK_COLOR, LIGHT_GREY_COLOR, MEDIUM_GREY_COLOR, WHITE_COLOR, HEADER_COLOR, DARK_GREY_COLOR } from '../../assets/colors';
import MyAccountHeader from '../components/MyAccountHeader';
import { getCustomerAddresses, deleteCustomerAddress } from '../myQueries';
import { jumpToAddNewAddressScreen, changeReloadShippingAddressFlag } from '../actions';

class ShippingAddress extends Component {

    static navigationOptions = ({ navigation }) => ({
        header: <MyAccountHeader goBack={navigation.goBack} title={'Shipping Address'.toUpperCase()} showBackButton />,
    })

    state = { deleteAndRefetchQueryRunning: false };

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }

    componentWillReceiveProps(nextProps) {
        console.log('recieved props', nextProps);
        if (nextProps.shippingAddress.reloadShippingAddresses) {
            this.props.getAddressesQuery.refetch();
            this.props.changeReloadShippingAddressFlag();
        }
    }

    componentWillUpdate(nextProps) {
        if (nextProps.getAddressesQuery.customer.addresses.edges.length > 0) {
            const { node } = nextProps.getAddressesQuery.customer.addresses.edges[0];
            const defaultAddress = AsyncStorage.getItem('@customerDefaultShippingAddress');
            if (defaultAddress === null) {
                AsyncStorage.setItem('@customerDefaultShippingAddress', JSON.stringify(node));
            } else {
                AsyncStorage.removeItem('@customerDefaultShippingAddress');
                AsyncStorage.setItem('@customerDefaultShippingAddress', JSON.stringify(node));
            }
        } else {
            AsyncStorage.removeItem('@customerDefaultShippingAddress');
        }
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress = () => {
        const { navigation } = this.props;
        navigation.goBack(null);
        return true;
    };

    onAddNewAddressPress = () => {
        this.props.navigation.navigate('AddressScreen', { accessToken: this.props.navigation.state.params.accessToken, addressToEdit: false });
    }

    onEditButtonPress = (node) => {
        this.props.navigation.navigate('AddressScreen', { accessToken: this.props.navigation.state.params.accessToken, addressToEdit: true, address: node });
    }

    onDeleteButtonPress = (node) => {
        // this.deleteAddressMutation({
        //     variables: { customerAccessToken: this.props.navigation.state.params.accessToken }
        // }).then((result) => { console.log(result); }).catch((error) => {});
        Alert.alert(
            'Delete Shipping Address!',
            'Are you sure you want to delete selected address.',
            [
              { text: 'Yes', onPress: () => { this.removeAddressFromArray(node); } },
              { text: 'No', onPress: () => {} },
            ],
            { cancelable: true }
          );
    }

    removeAddressFromArray(node) {
        // console.log('id to delete', node.id);
        // const { edges } = this.props.getAddressesQuery.customer.addresses;
        // console.log(edges);
        // let index = -1;
        // for (let i = 0; i < edges.length; i++) {
        //     if (edges[i].node.id === node.id) {
        //         index = i;
        //         break;
        //     }
        // }
        // console.log('here is index', index);
        // const updatedArray = edges.filter((item) => item.node.id === node.id);
        // console.log(updatedArray);
        this.props.deleteAddressMutation({
            variables: { 
                id: node.id,
                customerAccessToken: this.props.navigation.state.params.accessToken
            }
        })
        .then((data) => {
            this.props.getAddressesQuery.refetch();
        }).catch((error) => {
            console.log('there was an error sending the query', error);
        });
    }

    render() {
        const Touchable = (Platform.OS === 'android') ? TouchableNativeFeedback : TouchableHighlight;
        const { getAddressesQuery, deleteAddressMutation } = this.props;
        return (
            <View style={Styles.containerStyle}>
                
                <View style={Styles.contentStyle}>
                {
                    (deleteAddressMutation.loading || getAddressesQuery.loading) ?
                        <View style={Styles.noShippingAddressContainerStyle}>
                            <ActivityIndicator size='large' color={PRIMARY_COLOR} />
                        </View>
                    : // else
                        (getAddressesQuery.customer.addresses.edges.length === 0) ?
                            <View style={Styles.noShippingAddressContainerStyle}>
                                <Icon name='local-shipping' size={36} color={PRIMARY_COLOR} />
                                <Text style={Styles.infoTextStyle}>{'You have not added any shipping addresses'}</Text>
                            </View>
                        :// else show flatlist
                        <FlatList 
                            data={getAddressesQuery.customer.addresses.edges}
                            keyExtractor={(item) => item.node.id}
                            refreshControl={<RefreshControl refreshing={getAddressesQuery.networkStatus === 4} onRefresh={() => getAddressesQuery.refetch()} colors={[PRIMARY_COLOR]} />}
                            renderItem={({ item, index }) => (
                                <View style={Styles.addressCardStyle}>
                                    <View style={{ flex: 1, flexDirection: 'row', padding: 16 }}>
                                        <View style={{ flex: 0.9 }}>
                                            <Text style={Styles.nameTextStyle}>{`${item.node.firstName}`.toUpperCase()}{' '}{`${item.node.lastName}`.toUpperCase()}</Text>
                                            <Text style={Styles.cardTextStyle}>{'house number abc street number xyz johar town lahore pakistan'}</Text>
                                            <Text style={Styles.cardTextStyle}>{item.node.city}</Text>
                                            <Text style={Styles.cardTextStyle}>{item.node.phone}</Text>
                                            {index === 0 && <Text style={Styles.defaultAddressTextStyle}>{'(This is your default address.)'}</Text>}
                                        </View>
                                        
                                        <View style={{ flex: 0.1 }}>
                                            <Touchable
                                                onPress={this.onEditButtonPress.bind(this, item.node)}
                                            >
                                                <View style={{ padding: 4, marginBottom: 6, alignItems: 'center' }}> 
                                                    <Icon name='edit' size={18} color={TINT_BLACK_COLOR} />
                                                </View>
                                            </Touchable>
                                            <Touchable
                                                onPress={this.onDeleteButtonPress.bind(this, item.node)}
                                            >
                                                <View style={{ padding: 4, alignItems: 'center' }}> 
                                                    <Icon name='delete' size={18} color={DARK_GREY_COLOR} />
                                                </View>
                                            </Touchable>
                                        </View>

                                    </View>
                                    <View style={Styles.separatorStyle} />
                                </View>
                            )}
                        />
                }
                
            </View>

                <View style={Styles.footerStyle}>
                    <Touchable
                        onPress={this.onAddNewAddressPress.bind(this)}
                        background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}
                    >
                        <View style={Styles.buttonStyle}>
                            <Text style={Styles.buttonTextStyle}>{'add new address'.toUpperCase()}</Text>
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
        marginBottom: 1,
    },
    noShippingAddressContainerStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16
    },
    addressCardStyle: {
    },
    infoTextStyle: {
        fontSize: 16,
        fontFamily: 'Raleway-Regular',
        color: PRIMARY_COLOR,
        width: Dimensions.get('window').width * 0.60,
        textAlign: 'center'

    },
    nameTextStyle: {
        fontSize: 14,
        fontFamily: 'Raleway-Regular',
        color: PRIMARY_COLOR,
        marginBottom: 3
    },
    footerStyle: {
        flex: 0.1,
        backgroundColor: LIGHT_GREY_COLOR,
        padding: 16
    },
    buttonStyle: {
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: PRIMARY_COLOR,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonTextStyle: {
        fontSize: 16,
        fontFamily: 'Raleway-Bold',
        color: WHITE_COLOR,
    },
    cardTextStyle: {
        fontSize: 14,
        fontFamily: 'Raleway-Regular',
        color: TINT_BLACK_COLOR,
        marginBottom: 3
    },
    defaultAddressTextStyle: {
        fontSize: 10,
        fontFamily: 'Raleway-Regular',
        color: PRIMARY_COLOR,
        textAlign: 'center'
    },
    separatorStyle: {
        height: 1, 
        backgroundColor: MEDIUM_GREY_COLOR,
        marginTop: 2,
    },
};

const mapStateToProps = state => ({
    shippingAddress: state.shippingAddress
});

export default compose(
    graphql(getCustomerAddresses, {
        name: 'getAddressesQuery',
        options: (ownProps) => ({ 
            notifyOnNetworkStatusChange: true,
            variables: { customerAccessToken: ownProps.navigation.state.params.accessToken } 
        }),
    }),
    graphql(deleteCustomerAddress, {
        name: 'deleteAddressMutation',
        options: { notifyOnNetworkStatusChange: true }
    }),
    connect(mapStateToProps, { changeReloadShippingAddressFlag })
)(ShippingAddress);
