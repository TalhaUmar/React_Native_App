import React, { Component } from 'react';
import { View,
    Text,
    FlatList,
    TouchableNativeFeedback,
    BackHandler,
    TouchableOpacity,
    Dimensions, Platform,
    TouchableHighlight,
    Alert,
    ScrollView,
    StatusBar } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NavigationActions } from 'react-navigation';
import ProductDetailCarousel from '../components/ProductDetailCarousel';
import ProductDetailHeader from '../components/ProductDetailHeader';
import { incrementShoppingBagCount, addProductToShoppingCartList } from '../actions';
import { BACKGROUND_COLOR, TINT_BLACK_COLOR, PRIMARY_COLOR, WHITE_COLOR } from '../../assets/colors';
import ProductDetailImagesView from '../components/ProductDetailImagesView';

class ProductDetail extends Component {

    // static navigationOptions = ({ navigation }) => ({
    //     headerTitle: `${navigation.state.params.product.title}`,
    //     headerLeft: <BackButton onPress={() => navigation.goBack(null)} />
    // });
    static navigationOptions = ({ navigation }) => ({
        header: <ProductDetailHeader goBack={navigation.goBack} navigate={navigation.navigate} showLogo={false} title={navigation.state.params.product.title} showOneButton />,
    })

    state = { 
        selectedVariant: 0,
        quantity: 1,
        selectedVariantPrice: parseInt(this.props.navigation.state.params.product.variants.edges[0].node.price, 10),
        addButtonClick: false
    };

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
        // this.props.navigation.state.params.productTapStateCallback();
      }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
      }

    onBackPress = () => {
        const { navigation } = this.props;
        navigation.goBack(null);
        return true;
    };

    changeVariantIndexState(index) {
        const { variants } = this.props.navigation.state.params.product;
        this.setState({ selectedVariant: index });
        this.setState({ selectedVariantPrice: parseInt(variants.edges[index].node.price, 10) * this.state.quantity });
    }

    incrementQuantity() {
        const { variants } = this.props.navigation.state.params.product;
        this.setState({ quantity: this.state.quantity + 1 });
        this.setState({ selectedVariantPrice: this.state.selectedVariantPrice += parseInt(variants.edges[this.state.selectedVariant].node.price, 10) });
    }

    decrementQuantity() {
        const { variants } = this.props.navigation.state.params.product;
        if (this.state.quantity === 1) {
            this.setState({ quantity: 1 });
        } else {
            this.setState({ quantity: this.state.quantity - 1 });
            this.setState({ selectedVariantPrice: this.state.selectedVariantPrice -= parseInt(variants.edges[this.state.selectedVariant].node.price, 10) });
        }
    }

    incrementBagCount() {
        const { product } = this.props.navigation.state.params;
        if (!this.state.addButtonClick) {
            this.setState({ addButtonClick: true });
            // Alert.alert(
            //     'Item added',
            //     'Open your cart to complete checkout',
            //     [
            //       { text: 'OK', onPress: () => {} },
            //     ],
            //     { cancelable: true }
            // );
            this.props.addProductToShoppingCartList({ 
                product: {
                    id: product.id,
                    title: product.title,
                    imageSrc: product.images.edges[0].node.src,
                    variantTitle: product.variants.edges[this.state.selectedVariant].node.title,
                    variantId: product.variants.edges[this.state.selectedVariant].node.id,
                    price: parseInt(product.variants.edges[this.state.selectedVariant].node.price, 10),
                    itemTotalPrice: parseInt(product.variants.edges[this.state.selectedVariant].node.price, 10)
                }, 
                quantity: 1,
                key: 1,
                toggleDeleteButton: false
            });
        }
    }
      
    render() {
        const Touchable = (Platform.OS === 'android') ? TouchableNativeFeedback : TouchableHighlight;
        const { description, images, variants } = this.props.navigation.state.params.product;
        return (
                <ScrollView style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
                    <View style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
                        <ProductDetailImagesView images={images} />
                        <View style={Styles.detailContainer}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
                                <Text numberOfLines={4} style={Styles.productDescriptionStyle}>{description}</Text>
                                <View style={{ height: 60, marginTop: 2, width: 1, backgroundColor: PRIMARY_COLOR }} />
                                <Text numberOfLines={1} style={Styles.productPriceStyle}>{this.props.navigation.state.params.currencyCode}: {this.state.selectedVariantPrice}</Text>
                            </View>
                            
                                <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                                    {
                                        variants.edges.map((item, index) => (
                                            <TouchableOpacity 
                                                key={item.node.id}
                                                style={[Styles.buttonStyle, this.state.selectedVariant === index && Styles.borderStyle]}
                                                onPressIn={this.changeVariantIndexState.bind(this, index)}
                                            >
                                                <Text style={Styles.textStyle}>{item.node.title}</Text>
                                            </TouchableOpacity>
                                        ))
                                    }
                                </View>
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <Touchable 
                                    onPress={this.incrementBagCount.bind(this)}
                                    background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>
                                    <View style={Styles.addToBagViewHolder}>
                                        <Text style={Styles.addToBagTextStyle}>{'add to cart'.toUpperCase()}</Text>
                                    </View>
                                </Touchable>
                            </View>
                        </View>
                    </View>
                </ScrollView>
        );
    }
}

const Styles = {
    textStyle: {
      alignSelf: 'center',
      color: TINT_BLACK_COLOR,
      fontSize: 12,
      fontFamily: 'Raleway-Medium',
      padding: 6
    },
    buttonStyle: {
      flex: 1,
      alignSelf: 'stretch',
      backgroundColor: '#eeeeee',
      borderRadius: 2,
      borderWidth: 1,
      borderColor: BACKGROUND_COLOR,
      marginLeft: 4,
      marginRight: 4
    },
    borderStyle: {
        borderColor: PRIMARY_COLOR
    },
    priceAndQuantityContainer: {
        width: Dimensions.get('window').width * 0.80,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 4,
    },
    productPriceStyle: {
        color: PRIMARY_COLOR,
        fontSize: 14,
        fontFamily: 'Raleway-Regular',
        flex: 0.2,
        marginLeft: 6
    },
    detailContainer: {
        marginLeft: 12,
        marginRight: 12,
        marginTop: 10
    },
    productDescriptionStyle: {
        fontSize: 12,
        lineHeight: 22,
        fontFamily: 'Raleway-Regular',
        color: TINT_BLACK_COLOR,
        marginRight: 8,
        flex: 0.8
    },
    bagButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    addToBagViewHolder: {
        borderRadius: 4,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
        width: 200,
        height: 46,
        justifyContent: 'center',
        backgroundColor: PRIMARY_COLOR,
        marginTop: 8,
        marginBottom: 8
    },
    addToBagTextStyle: {
        alignSelf: 'center',
        fontSize: 18,
        fontFamily: 'Raleway-ExtraBold',
        color: WHITE_COLOR,
    }
  };
  
const mapStateToProps = state => ({
    shoppingCart: state.shoppingCart
});

export default connect(
    mapStateToProps, { incrementShoppingBagCount, addProductToShoppingCartList }
)(ProductDetail);
