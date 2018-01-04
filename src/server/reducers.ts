import { combineReducers, Reducer } from "@shared/redux";
import { Page, PageDetails } from "../shared/models";
import { ActionTypes, AppAction } from "./actions";
import { RootState } from "./RootState";

type AppReducer<S> = Reducer<S, AppAction>;

const pageList: AppReducer<Page[]> =
    (state = [], action) => {
        switch (action.type) {
            case ActionTypes.AddPage:
                {
                    const { pageNumber, name } = action;
                    return [...state, { pageNumber, name }];
                }
            case ActionTypes.DeletePage:
                {
                    const { pageNumber } = action;
                    return state.filter((page) => page.pageNumber !== pageNumber);
                }
            case ActionTypes.PageListLoaded:
                return action.pageList;
            default:
                return state;
        }
    };

const pageDetails: AppReducer<{ [pageNumber: number]: PageDetails }> =
    (state = {}, action) => {
        switch (action.type) {
            case ActionTypes.AddPage:
                {
                    const { pageNumber, name } = action;
                    return { ...state, [pageNumber]: { name, pageNumber, elements: [] } };
                }
            case ActionTypes.DeletePage:
                {
                    const { pageNumber } = action;
                    const newState: { [pageNumber: number]: PageDetails } = {};
                    for (const key in state) {
                        if (state.hasOwnProperty(key)) {
                            const page = state[key];
                            if (page.pageNumber !== pageNumber) {
                                newState[key] = page;
                            }
                        }
                    }
                    return newState;
                }
            case ActionTypes.AddElement:
                {
                    const { pageNumber, element } = action;
                    const page = state[pageNumber];
                    return { ...state, [pageNumber]: { ...page, elements: [...page.elements, element] } };
                }
            case ActionTypes.PageDetailsLoaded:
                return action.pageDetails;
            default:
                return state;
        }
    };

export default combineReducers<RootState>({ pageList, pageDetails });
