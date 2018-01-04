import { FontSize, InputMode, Page, PageDetails, Pen } from "@shared/models";
import { Reducer } from "@shared/redux";
import { ActionTypes, AppAction } from "actions";

type AppReducer<S> = Reducer<S, AppAction>;

export const pen: AppReducer<Pen> =
    (state = { color: "black", strokeWidth: "s" }, action) => {
        switch (action.type) {
            case ActionTypes.SetColor:
                const { color } = action;

                if (color === "black") {
                    return { ...state, color, strokeWidth: "s" };
                }
                return { ...state, color, strokeWidth: "m" };

            case ActionTypes.SetStrokeWidth:
                const { strokeWidth } = action;
                return { ...state, strokeWidth };
            default:
                return state;
        }
    };

export const fontSize: AppReducer<FontSize> =
    (state = "medium", action) => {
        switch (action.type) {
            case ActionTypes.SetFontSize:
                return action.fontSize;
            default:
                return state;
        }
    };

export const inputMode: AppReducer<InputMode> =
    (state = "pen", action) => {
        switch (action.type) {
            case ActionTypes.SetInputMode:
                return action.inputMode;
            default:
                return state;
        }
    };

export const pageList: AppReducer<Page[]> =
    (state = [], action) => {
        switch (action.type) {
            case ActionTypes.ReceivedPageList:
                return action.pageList;
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
            default:
                return state;
        }
    };

export const currentPage: AppReducer<PageDetails | null> = (state = null, action) => {
    switch (action.type) {
        case ActionTypes.ReceivedPage:
            return action.page;
        case ActionTypes.AddElement:
            const { pageNumber, element } = action;
            if (!state || state.pageNumber !== pageNumber) {
                return state;
            }
            return { ...state, elements: [...state.elements, element] };
        case ActionTypes.ClearCurrentPage:
            return null;
        default:
            return state;
    }
};

export const error: AppReducer<string> = (state = "", action) => {
    switch (action.type) {
        case ActionTypes.SetError:
            return action.error;
        case ActionTypes.ClearError:
            return "";
        default:
            return state;
    }
};

export const ready: AppReducer<boolean> = (state = false, action) => {
    switch (action.type) {
        case ActionTypes.SetReady:
            return action.ready;
        default:
            return state;
    }
};
