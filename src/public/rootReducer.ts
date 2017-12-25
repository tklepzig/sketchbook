import { RootState } from "@models/RootState";
import * as reducers from "reducers";
import { combineReducers } from "redux";

export const rootReducer = combineReducers<RootState>(reducers);
