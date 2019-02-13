import { 
    ADD_PRODUCT_TO_SHOPPING_CART,
    CART_ITEM_DELETE_BUTTON_PRESSED,
    UPDATE_CART_ITEMS,
    BUTTON_PRESSED
} from '../actions/ActionTypes';

const INITIAL_STATE = {
    cartCount: parseInt(0, 10),
    shoppingCartList: [],
    totalShoppingAmount: parseInt(0, 10)
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ADD_PRODUCT_TO_SHOPPING_CART: {
            const oldList = state.shoppingCartList.slice(0, state.shoppingCartList.length);
            let totalBill = state.totalShoppingAmount;
            if (oldList.length === 0) {
                return { 
                    ...state,
                    cartCount: state.cartCount + 1,
                    shoppingCartList: [...state.shoppingCartList, action.payload],
                    totalShoppingAmount: action.payload.product.itemTotalPrice 
                };
            }
                let quantityUpdatedFlag = false;
                let sameProductButDifferentVariant = false;
                console.log(oldList.length);
                oldList.forEach((item, index) => {
                    item.product.itemTotalPrice = item.quantity * item.product.price;
                    item.key += 1;
                    if (item.product.id === action.payload.product.id) {
                        if (item.product.variant === action.payload.product.variant) {
                            quantityUpdatedFlag = true;
                            item.quantity += 1;
                            item.product.itemTotalPrice = item.quantity * item.product.price;
                            totalBill = item.product.price + totalBill;
                        }
                    } else {
                        sameProductButDifferentVariant = true;
                    }
                });

                if (quantityUpdatedFlag) {
                    return {
                        ...state,
                        cartCount: state.cartCount,
                        shoppingCartList: oldList,
                        totalShoppingAmount: totalBill 
                    };
                }

                if (sameProductButDifferentVariant) {
                    return { 
                        ...state,
                        cartCount: state.cartCount + 1,
                        shoppingCartList: [...oldList, action.payload],
                        totalShoppingAmount: totalBill + action.payload.product.itemTotalPrice
                    };
                }
        }
        break;
        case CART_ITEM_DELETE_BUTTON_PRESSED: {
            let shoppingCartListCopyArray = state.shoppingCartList.slice(0, state.shoppingCartList.length);
            shoppingCartListCopyArray.forEach((item, index) => {
                if (item.product.variantId === action.payload) {
                    if (item.toggleDeleteButton) {
                        item.toggleDeleteButton = false;
                    } else {
                        item.toggleDeleteButton = true;
                    }
                }
            });
            return { ...state, shoppingCartList: shoppingCartListCopyArray };
        }
        case UPDATE_CART_ITEMS:
            return { 
                ...state,
                shoppingCartList: action.payload.shoppingCartList,
                totalShoppingAmount: action.payload.totalShoppingAmount
            };
        default:
            return state;
    }
};
