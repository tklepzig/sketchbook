import { combineReducers } from "redux";
import { RootState } from "./models/RootState";
import { pen } from "./reducers";

export const rootReducer = combineReducers<RootState>({ pen });
