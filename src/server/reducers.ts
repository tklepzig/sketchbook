import { Page, PageDetails } from "../shared/models";
import { combineReducers, Reducer, ReducersMapObject } from "../shared/redux";
import { AppAction } from "./actions";
import { RootState } from "./RootState";

type AppReducer<S> = Reducer<S, AppAction>;

const pageList: AppReducer<Page[]> =
    (state = [], action) => {
        switch (action.type) {
            case "AddPage":
                {
                    const { pageNumber, name } = action;
                    return [...state, { pageNumber, name }];
                }
            case "SetPageName":
                {
                    const { pageNumber, name } = action;
                    return state.map((s) => s.pageNumber === pageNumber ? { pageNumber, name } : { ...s });
                }
            case "DeletePage":
                {
                    const { pageNumber } = action;
                    return state.filter((page) => page.pageNumber !== pageNumber);
                }
            case "PageListLoaded":
                return action.pageList;
            default:
                return state;
        }
    };

const pageDetails: AppReducer<{ [pageNumber: number]: PageDetails }> =
    (state = {}, action) => {
        switch (action.type) {
            case "AddPage":
                {
                    const { pageNumber, name } = action;
                    return { ...state, [pageNumber]: { name, pageNumber, elements: [] } };
                }
            case "SetPageName":
                {
                    const { pageNumber, name } = action;
                    const page = state[pageNumber];
                    return { ...state, [pageNumber]: { ...page, name } };
                }
            case "DeletePage":
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
            case "AddElement":
                {
                    const { pageNumber, element } = action;
                    const page = state[pageNumber];
                    return { ...state, [pageNumber]: { ...page, elements: [...page.elements, element] } };
                }
            case "DeleteLastElement":
                {
                    const { pageNumber } = action;
                    const page = state[pageNumber];
                    return {
                        ...state, [pageNumber]: {
                            ...page,
                            elements: page.elements.slice(0, page.elements.length - 1)
                        }
                    };
                }
            case "PageDetailsLoaded":
                return action.pageDetails;
            default:
                return state;
        }
    };

export default combineReducers<RootState>({ pageList, pageDetails });
