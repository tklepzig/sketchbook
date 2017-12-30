import { Action, AnyAction, combineReducers, Reducer } from "redux";
import { Page, PageDetails } from "../shared/models";
import { Actions, AddElementAction, AddPageAction, PageDetailsLoadedAction, PageListLoadedAction } from "./actions";
import { RootState } from "./RootState";

const pageList: Reducer<Page[]> =
    (state = [], action: AnyAction): Page[] => {
        switch (action.type) {
            case Actions.AddPage:
                const { pageNumber, name } = action as AddPageAction;
                return [...state, { pageNumber, name }];
            case Actions.PageListLoaded:
                return (action as PageListLoadedAction).pageList;
            default:
                return state;
        }
    };

const pageDetails: Reducer<{ [pageNumber: number]: PageDetails; }> =
    (state = {}, action: AnyAction): { [pageNumber: number]: PageDetails; } => {
        switch (action.type) {
            case Actions.AddPage:
                {
                    const { pageNumber, name } = action as AddPageAction;
                    return { ...state, [pageNumber]: { name, pageNumber, elements: [] } };
                }
            case Actions.AddElement:
                {
                    const { pageNumber, element } = action as AddElementAction;
                    const page = state[pageNumber];
                    return { ...state, [pageNumber]: { ...page, elements: [...page.elements, element] } };
                }
            case Actions.PageDetailsLoaded:
                return (action as PageDetailsLoadedAction).pageDetails;
            default:
                return state;
        }
    };

export default combineReducers<RootState>({ pageList, pageDetails });
