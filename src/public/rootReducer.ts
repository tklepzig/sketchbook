import { combineReducers } from "redux";
import { RootState } from "./models/RootState";
import { fontSize, inputMode, pages, pen } from "./reducers";

export const rootReducer = combineReducers<RootState>({ pen, pages, fontSize, inputMode });
