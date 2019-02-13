import Carousel, { Pagination } from 'react-native-snap-carousel';
import React, { Component } from 'react';
import { View, Image, Dimensions } from 'react-native';
import { TINT_BLACK_COLOR, PRIMARY_COLOR } from '../../assets/colors';

const slideArray = [
    { id: 1, src: require('../../assets/images/imageone.jpg') },
    { id: 2, src: require('../../assets/images/imageone.jpg') },
    { id: 3, src: require('../../assets/images/imageone.jpg') },
    { id: 4, src: require('../../assets/images/imageone.jpg') },
    { id: 5, src: require('../../assets/images/imageone.jpg') },
    { id: 6, src: require('../../assets/images/imageone.jpg') }
];

class ProductDetailCarousel extends Component {

    state = { entries: slideArray, activeSlide: 0 }

    get pagination() {
        const { entries, activeSlide } = this.state;
        return (
            <Pagination
                dotsLength={entries.length}
                activeDotIndex={activeSlide}
                containerStyle={{ position: 'absolute', backgroundColor: 'transparent', bottom: -12 }}
                dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginHorizontal: 8,
                    backgroundColor: PRIMARY_COLOR
                }}
                inactiveDotStyle={{
                  // Define styles for inactive dots here
                  backgroundColor: TINT_BLACK_COLOR
                }}
                inactiveDotOpacity={0.6}
                inactiveDotScale={0.8}
            />
        );
    }

    render() {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Carousel
                    containerCustomStyle={{ flexGrow: 0, flexShrink: 0, position: 'relative' }}
                    ref={(c) => { this.carousel = c; }}
                    data={slideArray}
                    renderItem={({ item, index }) => (
                        <View key={index}>
                            <Image
                                style={{ width: Dimensions.get('window').width, height: (Dimensions.get('window').height / 2) - 36 }}
                                source={ item.src }
                                resizeMethod='resize'
                            />
                        </View>
                    )}
                    onSnapToItem={(index) => this.setState({ activeSlide: index })}
                    sliderWidth={Dimensions.get('window').width}
                    itemWidth={Dimensions.get('window').width}
                    sliderHeight={(Dimensions.get('window').height / 2) - 36}
                    itemHeight={(Dimensions.get('window').height / 2) - 36}
                />
                {this.pagination}
            </View>
        );
    }
}

export default ProductDetailCarousel;
