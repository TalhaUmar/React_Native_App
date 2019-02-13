import React, { Component } from 'react';
import { View, Dimensions, Image, ImageBackground, FlatList, TouchableOpacity } from 'react-native';
import { OVERLAY_BLACK_COLOR, PRIMARY_COLOR, HEADER_COLOR } from '../../assets/colors';

const imagesArray = [
    { id: '1', src: require('../../assets/images/choco.jpg') },
    { id: '2', src: require('../../assets/images/chocolate.jpg') },
    { id: '3', src: require('../../assets/images/classic.jpg') },
    { id: '4', src: require('../../assets/images/event.jpg') },
    { id: '5', src: require('../../assets/images/flavor.jpg') },
];

class ProductDetailImagesView extends Component {

    state = {
        selectedImageIndex: 0
    }

    componentWillMount() {
        
    }

    componentDidMount() {
        console.log('images', this.props.productImages);
    }

    changeMainImage = (index) => {
        this.setState({ selectedImageIndex: index });
    }

    render() {
        const { images } = this.props;
        return (
            <View style={Styles.mainContainerStyle}>
                <Image
                    style={{ width: Dimensions.get('window').width, height: ((Dimensions.get('window').height / 2) + 48) }}
                    source={{ uri: images.edges[this.state.selectedImageIndex].node.src }}
                    resizeMethod='scale'
                    resizeMode='cover'
                />
                {
                    images.edges.length > 1 ? 
                    <FlatList 
                        style={Styles.listContainerStyle}
                        extraData={this.state.selectedImageIndex}
                        data={images.edges}
                        horizontal
                        keyExtractor={(item) => item.node.id}
                        renderItem={({ item, index }) => (
                            <View>
                                <TouchableOpacity 
                                    style={[Styles.buttonStyle, this.state.selectedImageIndex === index && Styles.borderStyle]}
                                    onPressIn={this.changeMainImage.bind(this, index)}
                                >
                                    <ImageBackground
                                        style={Styles.itemImageStyle}
                                        source={{ uri: item.node.src }}
                                        resizeMethod='scale'
                                        resizeMode='cover'
                                    >
                                        <View style={[Styles.transparentBackDrop, this.state.selectedImageIndex !== index && Styles.backDropView]} />
                                    </ImageBackground>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                    :
                    <View />
                }
            </View>
        );
    }
}

const Styles = {
    mainContainerStyle: {
        width: Dimensions.get('window').width,
        height: ((Dimensions.get('window').height / 2) + 48),
    },
    listContainerStyle: {
        width: Dimensions.get('window').widths,
        height: 54,
        position: 'absolute',
        top: ((Dimensions.get('window').height / 2) + 48) - 54,
        left: 0, 
        right: 0
    },
    itemImageStyle: {
        width: 54,
        height: 54,
    },
    buttonStyle: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'transparent',
      },
    borderStyle: {
          borderColor: PRIMARY_COLOR
    },
    backDropView: {
        flex: 1,
        backgroundColor: OVERLAY_BLACK_COLOR
    },
    transparentBackDrop: {
        flex: 1,
        backgroundColor: 'transparent'
    }
};

export default ProductDetailImagesView;

