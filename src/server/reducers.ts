import { Action, AnyAction, combineReducers, Reducer } from "redux";
import { Page } from "../shared/models";
import { Actions, AddElementAction, AddPageAction } from "./actions";
import { RootState } from "./RootState";

const pageList: Reducer<Array<{ id: string }>> =
    (state = [], action: AnyAction): Array<{ id: string }> => {
        switch (action.type) {
            case Actions.AddPage:
                const { pageId } = action as AddPageAction;
                return [...state, { id: pageId }];
            default:
                return state;
        }
    };

const pageDetails: Reducer<{ [id: string]: Page; }> =
    (state = {}, action: AnyAction): { [id: string]: Page; } => {
        switch (action.type) {
            case Actions.AddPage:
                {
                    const { pageId } = action as AddElementAction;
                    return { ...state, [pageId]: { id: pageId, elements: [] } };
                }
            case Actions.AddElement:
                {
                    const { pageId, element } = action as AddElementAction;
                    const page = state[pageId];
                    return { ...state, [pageId]: { ...page, elements: [...page.elements, element] } };
                }
            default:
                return state;
        }
    };

export default combineReducers<RootState>({ pageList, pageDetails });
