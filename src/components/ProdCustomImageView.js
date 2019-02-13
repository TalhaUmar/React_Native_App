import React, { PureComponent } from 'react';
import { Dimensions, Animated } from 'react-native';

export class ProdCustomImageView extends PureComponent {
    static WIDTH = 200;
  
    render = () => {
      const { animatedValue, images, index } = this.props;
    
      return (
        <Animated.View style={{ flex: 1 }}>
          <Animated.Image
            style={[
              styles.imageStyle,
              {
                transform: [
                  {
                    scale: animatedValue.interpolate({
                      inputRange: [index - 1, index, index + 1],
                      outputRange: [1, 1.6, 1],
                      extrapolate: 'clamp',
                    }),
                  },
                  {
                    rotate: animatedValue.interpolate({
                      inputRange: [index - 1, index, index + 1],
                      outputRange: ['-90deg', '0deg', '90deg'],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
            ]}
            source={images[index].src}
          />
        </Animated.View>
      );
    };
  }

const styles = {
    imageStyle: {
        width: Dimensions.get('window').width,
        height: 250
    }
};
