import React, { Component } from 'react';
import { Image,
        Text, 
        View, 
        TouchableNativeFeedback, 
        Platform, 
        Dimensions, 
        TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { HEADER_COLOR, TINT_BLACK_COLOR } from '../../assets/colors';

class ProductHeader extends Component {

    // handleBackPress = () => this.props.goBack(null);

    jumpToSearchScreen = () => this.props.navigate('Search');

    render() {
        const Touchable = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableHighlight;
        return (
            <View style={Styles.headerContainer}>
                <Image source={require('../../assets/images/logo.png')} style={{ width: 30, height: 30, marginRight: 26 }} />
                <Text ellipsizeMode='tail' numberOfLines={1} style={Styles.titleStyle}>POPNOSH</Text>
                <View style={Styles.buttonsContainer}>
                    <Touchable
                        style={Styles.searchButtonStyle}
                        onPress={this.jumpToSearchScreen.bind(this)}
                        background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>
                        <Icon name='search' size={Platform.OS === 'android' ? 24 : 20} color={TINT_BLACK_COLOR} />
                    </Touchable>    
                    <Touchable
                        style={Styles.cartButtonStyle}
                        onPress={this.jumpToSearchScreen.bind(this)}
                        background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>
                        <Icon name='shopping-cart' size={Platform.OS === 'android' ? 24 : 20} color={TINT_BLACK_COLOR} />
                    </Touchable>
                </View>
            </View>
        );
    }
}

const Styles = {
    headerContainer: {
        marginTop: 20,
        width: Dimensions.get('window').width,
        height: 56,
        flexDirection: 'row',
        backgroundColor: HEADER_COLOR,
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 13,
        shadowColor: TINT_BLACK_COLOR,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 4,
        position: 'relative'
    },
    titleStyle: {
        width: Dimensions.get('window').width * 0.60,
        fontSize: 18,
        fontWeight: 'bold',
        color: TINT_BLACK_COLOR,
        paddingTop: 3
    },
    buttonsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 3
    },
    searchButtonStyle: {
        alignItems: 'flex-start'
    },
    cartButtonStyle: {
        alignItems: 'flex-end'
    }
};

export default ProductHeader;
