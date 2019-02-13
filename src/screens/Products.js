import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import { NavigationActions } from 'react-navigation';
import { debounce } from '../utilities/AppUtils';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { 
        View,
        Text,
        FlatList,
        ActivityIndicator,
        TouchableNativeFeedback,
        Image,
        ImageBackground,
        Dimensions,
        Platform,
        Picker,
        TouchableHighlight,
        BackHandler,
        RefreshControl } from 'react-native';
import { getProductsWithCollectionFilter, loadMoreProductsWithCollectionFilter, getShopCurrencyCode, getShopCollections } from '../myQueries';
import { Styles } from '../Styles';
import CustomHeader from '../components/CustomHeader';
import { client } from '../config/ApolloClient';
import { BACKGROUND_COLOR, TINT_BLACK_COLOR, HEADER_COLOR, PRIMARY_COLOR, MEDIUM_GREY_COLOR, DARK_GREY_COLOR } from '../../assets/colors';

class Products extends Component {
      
    static navigationOptions = ({ navigation }) => ({
        header: <CustomHeader goBack={navigation.goBack} navigate={navigation.navigate} showLogo={false} title={navigation.state.params.selectedFlavor} showOneButton={false} />
    })

    state = { selectedPickerVal: 'all' };

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.data.hasOwnProperty('shop')) {
            if (nextProps.data.networkStatus === 3) {
                if (this.props.data.shop.products.edges[this.props.data.shop.products.edges.length - 1].cursor === nextProps.data.shop.products.edges[nextProps.data.shop.products.edges.length - 1].cursor) {
                    return false;
                } else {
                    return true;
                }
            }
            
            return true;
        }
        
        return true;
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress = () => {
        const { navigation } = this.props;
        navigation.goBack(null);
        return true;
    };

    manageDropdownChange(itemValue) {
        this.setState({ selectedPickerVal: itemValue });
        this.props.data.refetch({ filterQuery: `products_type:'${itemValue}'` });
    }

    jumpToDetailScreen = (prod, currency) => {
        const { navigate } = this.props.navigation;
        navigate('ProductDetailScreen', { product: prod, currencyCode: currency });
    }

    renderFooter = () => {
        if (this.props.data.networkStatus === 3) {
            return (
                  <ActivityIndicator color={PRIMARY_COLOR} size="small" />
              );
        } 
        return null;
    };
            
    render() {
        const Touchable = (Platform.OS === 'android') ? TouchableNativeFeedback : TouchableHighlight;
        const { data } = this.props;
        return (
                    
                    ((data.loading || this.props.shopCurrencyCode.loading) && data.networkStatus !== 4 && data.networkStatus !== 3) ?
                    <View style={Styles.spinnerStyle}>
                        <ActivityIndicator size='large' color={PRIMARY_COLOR} />
                    </View>
                    :
                    <View style={Styles.containerStyle}>
                    {/* {console.log(data.shop.products.edges)} */}
                        <FlatList 
                            style={{ paddingBottom: 20 }}
                            extraData={[this.state.selectedPickerVal, this.state.imageLoading]}
                            data={data.shop.products.edges}
                            ListFooterComponent={this.renderFooter}
                            refreshControl={<RefreshControl refreshing={data.networkStatus === 4} onRefresh={() => data.refetch()} colors={[PRIMARY_COLOR]} />}
                            onEndReachedThreshold={0.5}
                            onEndReached={
                                () => {
                                    if (data.shop.products.pageInfo.hasNextPage) {
                                        data.fetchMore({
                                            query: loadMoreProductsWithCollectionFilter,
                                            variables: { cursor: data.shop.products.edges[data.shop.products.edges.length - 1].cursor, filterQuery: `tag:'${this.state.selectedPickerVal}'` },
                                            updateQuery: (previousResult, { fetchMoreResult }) => {
                                                if (!fetchMoreResult.shop.products || fetchMoreResult.shop.products.edges.length === 0) {
                                                    return previousResult;
                                                }
                                                return {
                                                    shop: {
                                                        __typename: fetchMoreResult.shop.__typename,
                                                        products: {
                                                            __typename: fetchMoreResult.shop.products.__typename,
                                                            edges: [...previousResult.shop.products.edges, ...fetchMoreResult.shop.products.edges],
                                                            pageInfo: {
                                                                __typename: fetchMoreResult.shop.products.pageInfo.__typename,
                                                                hasNextPage: fetchMoreResult.shop.products.pageInfo.hasNextPage
                                                            },
                                                        }
                                                    }
                                                };
                                            },
                                        });
                                    }
                                }
                            }
                            numColumns={2}
                            // viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
                            keyExtractor={(item) => item.node.id}
                            renderItem={({ item }) => (
                                <View style={Styles.productHolder}>
                                    <Touchable
                                        onPress={
                                            debounce(this.jumpToDetailScreen.bind(this, item.node, this.props.shopCurrencyCode.shop.paymentSettings.currencyCode), 1000)
                                        }
                                        background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}
                                    >
                                        <View>
                                            <ImageBackground
                                                key={item.node.images.edges[0].node.id}
                                                resizeMethod='scale'
                                                resizeMode='cover'
                                                style={Styles.productsImageStyle}
                                                source={{ uri: item.node.images.edges[0].node.src }}
                                                // onLoadStart={() => this.onImageLoadStart()}
                                            >
                                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', zIndex: -1000 }}>
                                                        <Icon name='photo-size-select-actual' size={60} color={DARK_GREY_COLOR} />
                                                    </View>
                                            </ImageBackground>
                                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
                                                <Text ellipsizeMode='tail' numberOfLines={2} style={Styles.productsTitleStyle}>
                                                    {item.node.title}
                                                </Text>
                                                <Text numberOfLines={1} style={Styles.productsVarPriceStyle}>
                                                    {this.props.shopCurrencyCode.shop.paymentSettings.currencyCode}: {item.node.variants.edges[0].node.price}
                                                </Text>
                                            </View> 
                                            
                                        </View>
                                    </Touchable>
                                </View>
                            )}
                        />
                    </View>
        );
    }
}

export default compose(
    graphql(getProductsWithCollectionFilter, {
        options: (ownProps) => ({
            notifyOnNetworkStatusChange: true,
            variables: { filterQuery: `product_type:'${ownProps.navigation.state.params.selectedFlavor}'` }
        })
    }),
    graphql(getShopCurrencyCode, {
        name: 'shopCurrencyCode'
    })
)(Products);

// <View style={Styles.pickerStyle}>
// {
//     <View style={{ flex: 1 }}>
//     <Picker
//         selectedValue={this.state.selectedPickerVal}
//         mode='dropdown'
//         onValueChange={(itemValue) => this.manageDropdownChange(itemValue)}
//     >
//         {this.props.shopCollections.shop.collections.edges.map((collectionItem) => (
//             <Picker.Item key={collectionItem.node.id} color={PRIMARY_COLOR} itemStyle={{ color: PRIMARY_COLOR }} label={collectionItem.node.title} value={collectionItem.node.handle} />
//         ))}
//     </Picker>
//     </View>
// }  
// </View>
