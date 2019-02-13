import React from 'react';
import { Platform, Image, View, Text, TouchableNativeFeedback, TouchableOpacity } from 'react-native';
import { Styles } from '../Styles';

class ProductCard extends React.PureComponent {
    render() {
        const { imageSrc, productTitle, productVariantPrice } = this.props;
        return (
                <View style={Styles.productHolder}>
                    <Image
                        resizeMethod='resize'
                        resizeMode='cover'
                        style={Styles.productsImageStyle}
                        source={{ uri: imageSrc }} 
                    />
                    <View style={{ flex: 1, marginBottom: 16 }}>
                        <Text ellipsizeMode='tail' numberOfLines={1} style={Styles.productsTitleStyle}>
                            {productTitle}
                        </Text>
                        <Text numberOfLines={1} style={Styles.productsVarPriceStyle}>
                            Rs:{productVariantPrice}
                        </Text>
                    </View> 
                    
                </View>
        );
    }
}

export default ProductCard;
