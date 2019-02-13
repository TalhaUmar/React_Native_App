import Carousel from 'react-native-snap-carousel';
import React, { Component } from 'react';
import { View, Image, Dimensions } from 'react-native';

class SnapCarousel extends Component {

    render() {
        return (
            <Carousel
              ref={(c) => { this.carousel = c; }}
              data={this.props.images}
              renderItem={({ item, index }) => (
                <View key={index}>
                    { 
                      (!item.node) ? 
                        <Image
                          style={{ width: Dimensions.get('window').width, height: 240 }}
                          source={item.src}
                          resizeMethod='resize'
                        />
                      :
                        <Image
                          style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height / 2 }}
                          source={{ uri: item.node.src }}
                          resizeMethod='resize'
                        />
                    }
                </View>
              )}
              sliderWidth={Dimensions.get('window').width}
              itemWidth={Dimensions.get('window').width}
              autoplayDelay={500}
              autoplay
              autoplayInterval={3000}
            />
        );
    }
}

export default SnapCarousel;
