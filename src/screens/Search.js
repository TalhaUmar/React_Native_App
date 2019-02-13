import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import { client } from '../config/ApolloClient';
import { View,
    Text,
    Image,
    ImageBackground,
    BackHandler,
    FlatList,
    Platform,
    TouchableNativeFeedback,
    TouchableHighlight,
    ActivityIndicator } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Searchbar from '../components/Searchbar';
import { debounce } from '../utilities/AppUtils';
import { TINT_BLACK_COLOR, BACKGROUND_COLOR, PRIMARY_COLOR, HEADER_COLOR, DARK_GREY_COLOR } from '../../assets/colors';
import { setSearchResultListVisibility } from '../actions';
import { searchProductsQuery } from '../myQueries';
import { Styles } from '../Styles';

class Search extends Component {

    static navigationOptions = ({ navigation }) => ({
        header: <Searchbar goBack={navigation.goBack} onSearch={() => navigation.state.params.handleSearchChange()} />
    })

    state = { searchData: [], loading: false }

    componentWillMount() {
        this.props.navigation.setParams({ handleSearchChange: this.handleSearchChange });
    }
    
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
      }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
        this.props.setSearchResultListVisibility(false);
        this.setState({ searchData: [], loading: false });
      }
    onBackPress = () => {
        const { navigation } = this.props;
        navigation.goBack(null);
        return true;
    };

    handleSearchChange = () => {
        const { searchString } = this.props.search;
        searchString === '' ? 
        this.props.setSearchResultListVisibility(false) : this.props.setSearchResultListVisibility(true);
        this.setState({ loading: true });
        client.query({
            query: searchProductsQuery,
            variables: { 
                filterQuery: `title:'${searchString}' OR tag:'${searchString}' OR product_type:'${searchString}'`
            }
          }).then((result) => {
            this.setState({ searchData: result, loading: false });
          }).catch((error) => {
            console.log('there was an error sending the query: ', error);
          });
    }

    renderSearchResult() {
        const Touchable = (Platform.OS === 'android') ? TouchableNativeFeedback : TouchableHighlight;
        if (this.state.loading) {
            return <ActivityIndicator color={PRIMARY_COLOR} size='large' style={{ flex: 1, justifyContent: 'center' }} />;
        }
        if (this.state.searchData.data.shop.products.edges.length > 0) {
            const { products } = this.state.searchData.data.shop;
            return (
                <FlatList 
                    style={{ paddingBottom: 20 }}
                    data={products.edges}
                    numColumns={2}
                    removeClippedSubviews={false}
                    keyExtractor={(item) => item.node.id}
                    renderItem={({ item }) => (
                        <View style={Styles.productHolder}>
                            <Touchable
                                onPress={debounce(() => this.props.navigation.navigate('ProductDetailScreen', { product: item.node, currencyCode: 'PKR' }), 500)}
                                background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}
                            >
                                <View style={{ flex: 1 }}>
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
                                            Rs:{item.node.variants.edges[0].node.price}
                                        </Text>
                                    </View> 
                                    
                                </View>
                            </Touchable>    
                        </View>
                    )}
                />
            );
        }
        if (this.state.searchData.data.shop.products.edges.length === 0) {
            return (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>oops no result found!!!</Text>
                    </View>
                );
        }
    }

    render() {
        // const Touchable = (Platform.OS === 'android') ? TouchableNativeFeedback : TouchableHighlight;
        const { searchResultListVisibility } = this.props.search;
        return (
            <View style={Styles.searchResultContainer}>
                { 
                    searchResultListVisibility && this.renderSearchResult()
                }
            </View>
        );
    }
}

const CustomStyles = {
    itemViewHolder: {
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        marginLeft: 8,
        marginRight: 8,
        borderBottomColor: 'grey',
        alignItems: 'flex-start',
        marginBottom: 3,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 12,
        paddingBottom: 6,
        // backgroundColor: HEADER_COLOR
    }
};

const mapStateToProps = state => ({
    search: state.search
});

export default connect(mapStateToProps, { setSearchResultListVisibility })(Search);
// export default compose(
//     graphql(searchProductsQuery, {
//         skip: ({ searchResultListVisibility }) => searchResultListVisibility !== true,
//         options: ({ filterQuery }) => ({ 
//                                         fetchPolicy: !filterQuery ? 'cache-only' : 'network-only',    
//                                         variables: { filterQuery } 
//                                         })
//     }),
//     connect(mapStateToProps, { setSearchResultListVisibility })
// )(Search);
