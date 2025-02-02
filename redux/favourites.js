import * as ActionTypes from "./ActionTypes";
import StateUtils from "react-navigation/src/StateUtils";

export const favourites = (state = [], action) => {
    switch(action.type) {
        case ActionTypes.ADD_FAVOURITE:
            if(state.some(el => el===action.payload))
                return state;
            else 
                return state.concat(action.payload);
        case ActionTypes.DELETE_FAVOURITE: 
            return state.filter((favourite) => favourite!=action.payload);
        default: 
            return state;
    }
}