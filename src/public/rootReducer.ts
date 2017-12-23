import { RootState } from "@shared/RootState";
import { fontSize, inputMode, pages, pen } from "reducers";
import { combineReducers } from "redux";

export const rootReducer = combineReducers<RootState>({ pen, pages, fontSize, inputMode });
