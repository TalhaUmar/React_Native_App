import { SAVE_SEARCH_STRING, SEARCH_RESULT_LIST_VISIBILITY } from '../actions/ActionTypes';

const INITIAL_STATE = {
    searchString: '',
    searchResultListVisibility: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SAVE_SEARCH_STRING:
            return { ...state, searchString: action.payload };
        case SEARCH_RESULT_LIST_VISIBILITY:
            return { ...state, searchResultListVisibility: action.payload,  };
        default:
            return state;
    }
};
