import { RootState } from "@shared/RootState";
import { error, fontSize, inputMode, pages, pen } from "reducers";
import { combineReducers } from "redux";

export const rootReducer = combineReducers<RootState>({ pen, pages, fontSize, inputMode, error });
