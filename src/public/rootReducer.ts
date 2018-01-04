import { RootState } from "@models/RootState";
import * as reducers from "reducers";
import { combineReducers, Reducer, ReducersMapObject } from "../shared/redux";

export const rootReducer = combineReducers<RootState>(reducers);
