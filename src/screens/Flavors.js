import React, { Component } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    ImageBackground,
    Dimensions,
    Platform,
    TouchableOpacity
} from 'react-native';
import CustomHeader from '../components/CustomHeader';
import { flavorsArray } from '../Constants/FlavorsArray';
import { debounce, debounceWait } from '../utilities/AppUtils';
import { BACKGROUND_COLOR, TINT_BLACK_COLOR, OVERLAY_BLACK_COLOR, PRIMARY_COLOR, WHITE_COLOR } from '../../assets/colors';

class Flavors extends Component {

    static navigationOptions = ({ navigation }) => ({
        header: <CustomHeader goBack={navigation.goBack} navigate={navigation.navigate} showLogo title='FLAVORS' showOneButton={false} />
    })

    onFlavorButtonPress = (title) => {
        this.props.navigation.navigate('ProductsScreen', { selectedFlavor: title });
    }

    render() {
        return (
            <View style={Styles.containerStyle}>
                        <FlatList
                            data={flavorsArray}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={debounce(this.onFlavorButtonPress.bind(this, item.title), debounceWait)}
                                >
                                        <ImageBackground
                                            borderRadius={2}
                                            style={Styles.imageStyle}
                                            source={item.imageSrc}
                                        >
                                            <View style={Styles.backDropView}>
                                                <Text style={Styles.headline}>{`${item.title.charAt(0).toUpperCase() + item.title.slice(1)}`}</Text>
                                            </View>
                                        </ImageBackground>
                                </TouchableOpacity>
                            )}
                        />
            </View>
        );
    }
}

const Styles = {
    containerStyle: {
        flex: 1,
        paddingTop: 4,
        paddingBottom: 2,
        backgroundColor: BACKGROUND_COLOR
    },
    imageStyle: {
        width: Dimensions.get('window').width,
        height: 140,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4
    },
    backDropView: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: OVERLAY_BLACK_COLOR
    },
    headline: {
        fontSize: 36,
        fontFamily: 'Raleway-Regular',
        backgroundColor: 'transparent',
        color: WHITE_COLOR
    }
};

export default Flavors;
