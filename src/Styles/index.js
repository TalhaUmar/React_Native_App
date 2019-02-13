import { Dimensions } from 'react-native';
import { TINT_BLACK_COLOR, BACKGROUND_COLOR, LIGHT_GREY_COLOR, PRIMARY_COLOR, HEADER_COLOR } from '../../assets/colors';

export const Styles = {
    containerStyle: {
        flex: 1,
        padding: 8,
        backgroundColor: LIGHT_GREY_COLOR
    },
    spinnerStyle: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: BACKGROUND_COLOR
    },
    productHolder: {
        // width: (Dimensions.get('window').width - 24) / 2,
        flex: 1,
        margin: 4
    },
    productsImageStyle: {
        flex: 1,
        height: 180,
        width: undefined,
        marginBottom: 4,
        // marginRight: 8,
        borderRadius: 2,
        borderColor: '#cb9ca1',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2
    },
    productsTitleStyle: {
        marginBottom: 4,
        fontSize: 12,
        fontFamily: 'Raleway-Medium',
        color: TINT_BLACK_COLOR,
        textAlign: 'center'
    },
    productsVarPriceStyle: {
        fontSize: 12,
        fontFamily: 'Raleway-Regular',
        color: PRIMARY_COLOR,
    },
    productDescriptionStyle: {
        fontSize: 14,
        marginBottom: 8
    },
    searchResultContainer: {
        flex: 1,
        paddingLeft: 8,
        paddingRight: 8,
        backgroundColor: BACKGROUND_COLOR
    },
    pickerStyle: {
        height: 34, 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: HEADER_COLOR,
        elevation: 2,
        shadowColor: TINT_BLACK_COLOR,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        borderRadius: 2,
        padding: 4
    }
};
