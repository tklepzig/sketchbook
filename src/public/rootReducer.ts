import { combineReducers } from "redux";
import { RootState } from "./models/RootState";
import { pages, pen } from "./reducers";

export const rootReducer = combineReducers<RootState>({ pen, pages });
