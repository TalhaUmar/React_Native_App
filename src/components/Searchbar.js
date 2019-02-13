import React, { Component } from 'react';
import { View, TextInput, Platform, Dimensions, TouchableNativeFeedback, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TINT_BLACK_COLOR, HEADER_COLOR, BACKGROUND_COLOR, PRIMARY_COLOR, MEDIUM_GREY_COLOR } from '../../assets/colors';
import { saveSearchString, setSearchResultListVisibility } from '../actions';

class Searchbar extends Component {

    state = { textTyped: false }

    handleTextChange = (value) => {
        this.props.saveSearchString(value);
        (!value) ? this.setState({ textTyped: false }) : this.setState({ textTyped: true });
    }

    handleSearchListVisibility = () => {
        const { searchResultListVisibility } = this.props.search;
        if (searchResultListVisibility) {
            this.props.setSearchResultListVisibility(false);
        }
        this.setState({ textTyped: false });
        this.props.saveSearchString('');
    }

    handleBackPress = () => this.props.goBack(null);

    render() {
        const Touchable = (Platform.OS === 'android') ? TouchableNativeFeedback : TouchableHighlight;
        const { searchString } = this.props.search;
        return (
            <View style={Styles.searchSection}>
                
                    <Touchable
                        onPress={this.handleBackPress.bind(this)}
                        background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}
                    >
                        <View style={Styles.backIconContainer}>
                            <Icon 
                                name={Platform.OS === 'android' ? 'arrow-back' : 'keyboard-arrow-left'} 
                                size={Platform.OS === 'android' ? 24 : 20} 
                                color={Platform.OS === 'android' ? TINT_BLACK_COLOR : '#448AFF'}
                            />
                        </View>                
                    </Touchable>
                    <View style={{ flex: 0.85, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <TextInput
                            style={Styles.input}
                            placeholder="SEARCH"
                            onChangeText={searchItem => this.handleTextChange(searchItem)}
                            underlineColorAndroid="transparent"
                            selectionColor={PRIMARY_COLOR}
                            autoFocus
                            returnKeyType='search'
                            onSubmitEditing={this.props.onSearch}
                            maxLength={40}
                            value={searchString}
                        />
                        {this.state.textTyped &&
                            <Touchable
                                onPress={this.handleSearchListVisibility.bind(this)}
                                background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}
                            >
                            <View style={Styles.cancelButtonStyle}>
                                <Icon 
                                    name='cancel' 
                                    size={18}
                                    color={MEDIUM_GREY_COLOR}
                                />
                            </View>
                            </Touchable>
                        }
                    </View>
                        <Touchable
                            onPress={this.props.onSearch}
                            background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}
                        >
                            <View style={Styles.searchButtonStyle}>
                                <Icon 
                                    name='search'
                                    size={24}
                                    color={TINT_BLACK_COLOR}
                                />
                            </View>
                        </Touchable>
                    
            </View>
        );
    }
}

const Styles = {
    searchSection: {
        marginTop: 20,
        // width: Dimensions.get('window').width,
        height: 50,
        flexDirection: 'row',
        backgroundColor: HEADER_COLOR,
        shadowColor: TINT_BLACK_COLOR,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 4,
        position: 'relative'
    },
    backIconContainer: {
        flex: 0.075,
        paddingLeft: 18,
        paddingTop: 12,
        paddingRight: 18,
        paddingBottom: 12,
    },
    backButtonStyle: {
        // marginTop: 8
        
    },
    input: {
        flex: 0.85,
        fontSize: 16,
        // width: Dimensions.get('window').width * 0.65,
        // paddingTop: 10,
        // paddingRight: 10,
        // paddingBottom: 10,
        // paddingLeft: 0,
        // backgroundColor: '#fff',
        color: TINT_BLACK_COLOR,
    },
    buttonsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    cancelButtonStyle: {
        padding: 2,
    },
    searchButtonStyle: {
        flex: 0.075,
        paddingRight: 16,
        paddingLeft: 12,
        paddingTop: 12,
        paddingBottom: 12,
    }
};

const mapStateToProps = state => ({
    search: state.search
});

export default connect(
    mapStateToProps,
    { saveSearchString, setSearchResultListVisibility }
)(Searchbar);
