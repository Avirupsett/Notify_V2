import {  GET_CITIES,UPGRADE_CITIES,DELETE_CITIES,GET_COLLEGE,DEL_COLLEGE,REFRESH_CITIES,REFRESH_COLLEGE,GET_WBUNIVE,DEL_WBUNIVE,REFRESH_WBUNIVE } from './actions';

const initialState = {
    cities: [],
    notices:[],
    wbunive:[],
    recities:false,
    renotice:false,
    rewbunive:false
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
        case GET_WBUNIVE:
            return { ...state, wbunive: action.payload };
        case DEL_WBUNIVE:
            return { ...state, wbunive: action.payload };
        case REFRESH_CITIES:
            return { ...state, recities: action.payload };
        case REFRESH_COLLEGE:
            return { ...state, renotice: action.payload };
        case REFRESH_WBUNIVE:
            return { ...state, rewbunive: action.payload };
        
        default:
            return state;
    }
}

export default userReducer;