import { RootState } from "@models/RootState";
import {
    error,
    fontSize,
    inputMode,
    pageList,
    pages,
    pen,
    ready
} from "reducers";
import { combineReducers } from "redux";

export const rootReducer = combineReducers<RootState>({
    pen,
    fontSize,
    inputMode,
    pages,
    pageList,
    error,
    ready
});
