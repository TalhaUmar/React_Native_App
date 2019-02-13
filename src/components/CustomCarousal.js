import React, { Component } from 'react';
import { View, ScrollView, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const height = Dimensions.get('window').height / 2;

const slideArray = [
    { id: 1, src: require('../../assets/images/imageone.jpg') },
    { id: 1, src: require('../../assets/images/flavor.jpg') },
    { id: 1, src: require('../../assets/images/classic.jpg') },
    { id: 1, src: require('../../assets/images/imagetwo.jpg') },
    { id: 1, src: require('../../assets/images/chocolate.jpg') },
    { id: 1, src: require('../../assets/images/event.jpg') }
];

class CustomCarousal extends Component {
    render() {
        return (
            <View
                style={styles.scrollContainer}
            >
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
            >
              {slideArray.map(item => (
                <Image key={item.id} style={styles.image} source={item.src} />
              ))}
            </ScrollView>
          </View>
        );
    }
}

const styles = StyleSheet.create({
    scrollContainer: {
      height,
    },
    image: {
      width,
      height,
    },
  });

export default CustomCarousal;
