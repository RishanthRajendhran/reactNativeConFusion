import {createStore,combineReducers,applyMiddleware } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import {dishes} from "./dishes";
import {leaders} from "./leaders";
import {comments} from "./comments";
import {promotions} from "./promotions";

export default configureStore = () => {
    const store = createStore(
        combineReducers({
            dishes,
            comments,
            promotions,
            leaders
        }),
        applyMiddleware(thunk,logger)
    );
    return store;
}