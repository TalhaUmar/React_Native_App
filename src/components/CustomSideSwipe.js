import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import SideSwipe from 'react-native-sideswipe';

import ProdCustomImageView from './ProdCustomImageView';

const data = [
    { id: 1, src: require('../../assets/images/imageone.jpg') },
    { id: 1, src: require('../../assets/images/imageone.jpg') },
    { id: 1, src: require('../../assets/images/imageone.jpg') },
    { id: 1, src: require('../../assets/images/imageone.jpg') },
    { id: 1, src: require('../../assets/images/imageone.jpg') },
    { id: 1, src: require('../../assets/images/imageone.jpg') }
];

export default class SweetCarousel extends Component {
  state = {
    currentIndex: 0,
  };

  render = () => {
    // center items on screen
    const { width } = Dimensions.get('window').width;
    const contentOffset = (width - 40) / 2;

    return (
      <SideSwipe
        index={this.state.currentIndex}
        itemWidth={Dimensions.get('window').width}
        style={{ width }}
        data={data}
        contentOffset={contentOffset}
        onIndexChange={index =>
          this.setState(() => ({ currentIndex: index }))
        }
        renderItem={({ itemIndex, currentIndex, item, animatedValue }) => (
            <ProdCustomImageView
                {...item}
                index={itemIndex}
                currentIndex={currentIndex}
                animatedValue={animatedValue}
            />
        )}
      />
    );
  };
}
