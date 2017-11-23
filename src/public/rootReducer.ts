import { combineReducers } from "redux";
import { pen } from "./components/PenChooser/reducers";
import { RootState } from "./models/RootState";

export const rootReducer = combineReducers<RootState>({ pen });
