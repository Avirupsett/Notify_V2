import {  GET_CITIES,UPGRADE_CITIES,DELETE_CITIES,GET_COLLEGE,DEL_COLLEGE } from './actions';

const initialState = {
    cities: [],
    notices:[],
}

function userReducer(state = initialState, action) {
    switch (action.type) {
        
        case GET_CITIES:
            return { ...state, cities: action.payload };
        case UPGRADE_CITIES:
            return { ...state, cities: action.payload };
        case DELETE_CITIES:
            return { ...state, cities: action.payload };
        case GET_COLLEGE:
            return { ...state, notices: action.payload };
        case DEL_COLLEGE:
            return { ...state, notices: action.payload };
        
        default:
            return state;
    }
}

export default userReducer;