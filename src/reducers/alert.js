import {SHOW_ALERT} from '../actions/types';

const initialState = {
    type: 1,
    message:""
};

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SHOW_ALERT:
            return {
                ...state,
                type: payload.type,
                message:payload.message
            };

        default:
            return state;
    }
}