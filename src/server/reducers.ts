import { Action, AnyAction, combineReducers, Reducer } from "redux";
import { Page } from "../shared/models";
import { Actions, AddElementAction } from "./actions";
import { RootState } from "./RootState";

const pages: Reducer<Page[]> =
    (state = [{ id: "1", elements: [] }], action: AnyAction): Page[] => {
        switch (action.type) {
            case Actions.AddElement:
                {
                    const { pageId, element } = action as AddElementAction;
                    return state.map((page) => (page.id === pageId)
                        ? { ...page, elements: [...page.elements, element] }
                        : page
                    );
                }
            case Actions.AddPage:
                return state;
            default:
                return state;
        }
    };

export default combineReducers<RootState>({ pages });
