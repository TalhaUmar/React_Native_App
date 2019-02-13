import React, { Component } from 'react';
import { View, Text, Modal, Dimensions, Platform, TouchableHighlight, TouchableNativeFeedback } from 'react-native';
import { compose, graphql } from 'react-apollo';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getProductsWithCollectionFilter } from '../myQueries';
import { PRIMARY_COLOR, TINT_BLACK_COLOR, RED_COLOR, BACKGROUND_COLOR, LIGHT_GREY_COLOR, MEDIUM_GREY_COLOR, WHITE_COLOR } from '../../assets/colors';

class Stores extends Component {
    render() {
        const Touchable = (Platform.OS === 'android') ? TouchableNativeFeedback : TouchableHighlight;
        return (
            <View>
            <Modal
            animationType={Platform.OS === 'android' ? 'fade' : 'slide'}
            transparent
            visible={false}
            onRequestClose={() => {
            }}
            >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' }}>
                <View style={{ width: Dimensions.get('window').width * 0.70, backgroundColor: BACKGROUND_COLOR, borderRadius: 3, paddingLeft: 16, paddingRight: 16, paddingTop: 10, paddingBottom: 10, shadowColor: TINT_BLACK_COLOR, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, elevation: 2 }}>
                    <View style={{ alignItems: 'center' }}>
                        <Icon name='check-circle' size={60} color={PRIMARY_COLOR} />
                        <Text style={{ fontFamily: 'Raleway-Bold', fontSize: 16, color: PRIMARY_COLOR, marginTop: 8, marginBottom: 10, textAlign: 'center' }}>{'Address added Successfully'.toUpperCase()}</Text>
                    </View>
                    <View>
                        <Touchable
                            // onPress={this.moveBack.bind(this)}
                            background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}
                        >
                            <View style={{ backgroundColor: PRIMARY_COLOR, justifyContent: 'center', alignItems: 'center', borderRadius: 2 }}>
                                <Text style={{ fontFamily: 'Raleway-ExtraBold', fontSize: 16, color: WHITE_COLOR, paddingTop: 10, paddingBottom: 10 }}>{'ok'.toUpperCase()}</Text>
                            </View>
                        </Touchable>
                    </View>
                </View>
            </View>
        </Modal>
            </View>
        );
    }
}

export default Stores;
