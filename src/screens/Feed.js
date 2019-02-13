import React, { Component } from 'react';
import { View, Text, SectionList, FlatList, Image, Dimensions, Platform, TouchableNativeFeedback, TouchableHighlight, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TINT_BLACK_COLOR, BACKGROUND_COLOR, PRIMARY_COLOR } from '../../assets/colors';
import SnapCarousel from '../components/SnapCarousel';
import CustomHeader from '../components/CustomHeader';

const Touchable = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableHighlight;

class Feed extends Component {

    static navigationOptions = ({ navigation }) => ({
        header: <CustomHeader goBack={navigation.goBack} navigate={navigation.navigate} showLogo title='POPNOSH' showOneButton showEditButton={false} />
        // title: 'Popnosh',
        // headerLeft: <Image source={require('../assets/images/logo.png')} style={{ width: 30, height: 30 }} />,
        // headerRight: <Touchable onPress={() => navigation.navigate('Search')}>
        //                 <Icon name='shopping-cart' size={24} color={TINT_BLACK_COLOR} />
        //             </Touchable>
    })

    subListKeyExtractor = data => (data.key)

    renderSingleImage = data => (
        <Image 
            style={{ width: 300, height: 160 }}
            source={data.item.src}
        />
    )
    renderTwoImages = data => (
        <FlatList
        style={{ backgroundColor: 'red', width: 600, height: 50 }}
        data={data.item}
        renderItem={this.renderCatAvatar}
        keyExtractor={this.subListKeyExtractor}
        horizontal
        />
    )
 
    renderList = (item) => (
        console.log(item.data)
        //   <FlatList
        //     numColumns={2}
        //     data={item.data}
        //     renderItem={({ i }) => (  
        //         <Image source={i.src} style={{ width: 200, height: 200 }} />
        //     )}
        //   />
      );

    renderSectionHeader = ({ section }) => (
        section.key === 100 ? 
        <Text />
        :
        <Text style={{ flex: 1, backgroundColor: '#FFFFFF', paddingTop: 10, paddingBottom: 4, textAlign: 'center', fontSize: 18, fontFamily: 'Raleway-ExtraBoldItalic', color: PRIMARY_COLOR }}>
            {section.title}
        </Text>
    )

    // renderListItem = ({ item }) => ({
    //     if (item.key === 'flatlist')) {
    //         <FlatList
    //                 // style={{ width: Dimensions.get('window').width, alignItems: 'space-between', backgroundColor: 'lightgrey' }}
    //                 ItemSeparatorComponent={() => (
    //                     <View style={{ marginBottom: 6 }} />
    //                 )}
    //                 data={item.myData}
    //                 keyExtractor={(item) => item.key}
    //                 numColumns={2}
    //                 renderItem={({ item }) => (
    //                     <Image resizeMode='cover' resizeMethod='resize' source={item.src} style={{ borderRadius: 2, flex: 1, marginHorizontal: 2, height: 136 }} />
    //                 )}
    //             />
    //     } 
    //     if(item.key === 'slider'){
    //         <RNSwiper image={item.node} />
    //     }
    // });

    render() {
        const sectionData = [
            {
                key: 100,
                title: 'Popnosh',
                data: [{ 
                        key: 'slider',
                        sliderArray: [
                                { key: 1, src: require('../../assets/images/popnoshcover.jpg') },
                                { key: 2, src: require('../../assets/images/imageone.jpg') },
                                { key: 2, src: require('../../assets/images/imagetwo.jpg') },
                                { key: 2, src: require('../../assets/images/choco.jpg') }
                              ]
                     }],
            },
            {
                key: 200,
                title: 'New Flavors',
                data: [{ 
                        key: 'flatlist', 
                        myData: [
                                    { key: 6, src: require('../../assets/images/flavor.jpg') },
                                    { key: 7, src: require('../../assets/images/flavor2.jpg') },
                                    { key: 8, src: require('../../assets/images/choco.jpg') },
                                    { key: 9, src: require('../../assets/images/flavor3.jpg') }
                                ]
                     }],
            },
            {
                key: 300,
                title: 'Special Offer',
                data: [{ 
                        key: 'singleimage', src: require('../../assets/images/specialoffer.jpg')
                     }],
            },
            {
                key: 400,
                title: 'Upcoming Events',
                data: [{ 
                        key: 'flatlist', 
                        myData: [
                                    { key: 11, src: require('../../assets/images/event.jpg') },
                                    { key: 12, src: require('../../assets/images/event2.jpg') },
                                ]
                     }],
            },
            
        ];

        return (
            <View style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
                <SectionList
                    style={{ marginBottom: 6 }}
                    sections={sectionData}
                    renderSectionHeader={this.renderSectionHeader}
                    // renderItem={this.renderListItem}
                    renderItem={({ item }) => (
                        (item.key === 'singleimage') ? <Image resizeMode='cover' source={item.src} resizeMethod='resize' style={{ borderRadius: 2, width: Dimensions.get('window').width - 4, marginLeft: 2, marginRight: 2, height: 185 }} />
                        :
                            (item.key === 'slider') ?
                            <SnapCarousel images={item.sliderArray} />
                            :
                                <FlatList
                                    // style={{ width: Dimensions.get('window').width, alignItems: 'space-between', backgroundColor: 'lightgrey' }}
                                    ItemSeparatorComponent={() => (
                                        <View style={{ marginBottom: 6 }} />
                                    )}
                                    data={item.myData}
                                    keyExtractor={(item) => item.key}
                                    numColumns={2}
                                    renderItem={({ item }) => (
                                        <Image resizeMode='cover' resizeMethod='resize' source={item.src} style={{ borderRadius: 2, flex: 1, marginHorizontal: 2, height: 136 }} />
                                    )}
                                />
                    )}
                />
            </View>
        );
    }
}

export default Feed;
