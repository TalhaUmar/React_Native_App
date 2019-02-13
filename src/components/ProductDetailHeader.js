import React, { Component } from 'react';
import { 
    Image,
    Text,
    View,
    TouchableNativeFeedback,
    Platform,
    Dimensions,
    Animated,
    Easing,
    TouchableHighlight 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { debounce } from '../utilities/AppUtils';
import { HEADER_COLOR, TINT_BLACK_COLOR, PRIMARY_COLOR, WHITE_COLOR } from '../../assets/colors';

class ProductDetailHeader extends Component {

    constructor() {
        super();
        this.animatedValue = new Animated.Value(0);
    }

    componentDidUpdate() {
        this.animate();    
    }

    animate() {
        this.animatedValue.setValue(0);
        Animated.timing(
          this.animatedValue,
          {
            toValue: 1,
            duration: 1500,
            easing: Easing.linear,
            useNativeDriver: true
          }
        ).start(() => {});
      }

    handleBackPress = () => this.props.goBack(null);

    jumpToSearchScreen = () => this.props.navigate('SearchScreen');

    jumpToCartScreen = () => this.props.navigate('ShoppingCartScreen');

    render() {
        const rotateX = this.animatedValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: ['0deg', '180deg', '0deg']
        });
        const rotateStyle = {
            transform: [{ rotateX }]
        };
        const Touchable = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableHighlight;
        const { cartCount } = this.props.shoppingCart;
        return (
            <View style={Styles.headerContainer}>
                
                {this.props.showLogo ? 
                    <Image source={require('../../assets/images/logo.png')} style={{ width: 30, height: 30, marginLeft: 16, marginRight: 26 }} />
                ://else statement
                    <Touchable
                        onPress={debounce(this.handleBackPress.bind(this), 500)}
                        background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>
                        <View style={Styles.backIconContainer}>
                            <Icon 
                                name={Platform.OS === 'android' ? 'arrow-back' : 'keyboard-arrow-left'} 
                                size={24} 
                                color={TINT_BLACK_COLOR}
                            />
                        </View>                
                    </Touchable>
                }
                <Text ellipsizeMode='tail' numberOfLines={1} style={Styles.titleStyle}>{this.props.title}</Text>
                    {this.props.showOneButton ? 
                            <View style={Styles.singleButtonContainer}>
                                {
                                    (!this.props.showEditButton) ?
                                        <Touchable
                                            onPress={debounce(this.jumpToCartScreen.bind(this), 500)}
                                            background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>
                                            <View style={{ paddingTop: 16, paddingLeft: 8, paddingRight: 8, paddingBottom: 8 }}>
                                                <Animated.View style={[Styles.badgeContainerStyle, (cartCount) && rotateStyle]}>
                                                    <Text style={{ fontSize: 12, color: WHITE_COLOR, fontFamily: 'Raleway-Regular', padding: 1 }}>{cartCount}</Text>
                                                </Animated.View>
                                                <Icon name='shopping-cart' size={24} color={TINT_BLACK_COLOR} />
                                            </View>
                                        </Touchable>
                                    ://else statement here
                                        <Touchable
                                            style={Styles.cartButtonStyle}
                                            onPress={debounce(this.jumpToCartScreen.bind(this), 500)}
                                            background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>
                                            <View style={{ padding: 8 }}>
                                                <Icon name='mode-edit' size={24} color={TINT_BLACK_COLOR} />
                                            </View>
                                        </Touchable>
                                }
                                
                            </View>
                        ://else statement
                            <View style={Styles.buttonsContainer}>
                                <Touchable
                                    style={Styles.searchButtonStyle}
                                    onPress={debounce(this.jumpToSearchScreen.bind(this), 500)}
                                    background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>
                                    <View style={{ padding: 8, justifyContent: 'center' }}>
                                        <Icon name='search' size={24} color={TINT_BLACK_COLOR} />
                                    </View>
                                </Touchable>    
                                <Touchable
                                    style={Styles.cartButtonStyle}
                                    onPress={debounce(this.jumpToCartScreen.bind(this), 500)}
                                    background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>
                                    <View style={{ paddingTop: 16, paddingLeft: 8, paddingRight: 8, paddingBottom: 8 }}>
                                    <View style={Styles.badgeContainerStyle}>
                                        <Text style={{ fontSize: 12, color: WHITE_COLOR, fontFamily: 'Raleway-Regular', padding: 1 }}>{this.props.shoppingCart.cartCount}</Text>
                                    </View>
                                        <Icon name='shopping-cart' size={24} color={TINT_BLACK_COLOR} />
                                    </View>
                                </Touchable>
                            </View>
                    }
            </View>
        );
    }
}

const Styles = {
    headerContainer: {
        marginTop: 20, // only for IOS to give StatusBar Space
        width: Dimensions.get('window').width,
        height: 56,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        position: 'absolute',
        alignItems: 'center',
        top: 0,
        left: 0, 
        right: 0
    },
    backIconContainer: {
        paddingLeft: 16,
        paddingTop: 12,
        paddingRight: 16,
        paddingBottom: 12,
    },
    titleStyle: {
        width: Dimensions.get('window').width * 0.56,
        fontSize: 18,
        fontFamily: 'Raleway-ExtraBold',
        color: TINT_BLACK_COLOR,
    },
    backButtonStyle: {
        // marginTop: 8
    },
    cartButtonStyle: {
        // alignItems: 'flex-end',
        // padding: 12
    },
    singleButtonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        position: 'relative',
        paddingRight: 8
    },
    buttonsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 8
    },
    searchButtonStyle: {
        alignItems: 'flex-start',
        padding: 12
    },
    badgeContainerStyle: {
        position: 'absolute',
        left: 12, 
        top: 2, 
        backgroundColor: PRIMARY_COLOR, 
        borderRadius: 600, 
        paddingLeft: 4, 
        paddingRight: 4, 
        paddingBottom: 1,
        paddingTop: 1
    }
};

const mapStateToProps = state => ({
    shoppingCart: state.shoppingCart
});

export default connect(mapStateToProps)(ProductDetailHeader);
