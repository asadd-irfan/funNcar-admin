import {UPDATE_LOADING} from '../actions/types';

const initialState = {
    isLoading: false,
};

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case UPDATE_LOADING:
            return {
                ...state,
                isLoading: payload,
            };

        default:
            return state;
    }
}