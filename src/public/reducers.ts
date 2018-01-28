import { FontSize, InputMode, Page, PageDetails, Pen } from "@shared/models";
import { Reducer } from "@shared/redux";
import { AppAction } from "actions";
import undoable from "redux-undo";

type AppReducer<S> = Reducer<S, AppAction>;

export const pen: AppReducer<Pen> =
    (state = { color: "black", strokeWidth: "s" }, action) => {
        switch (action.type) {
            case "SetColor":
                const { color } = action;

                // switch to black
                if (color === "black") {
                    return { ...state, color, strokeWidth: "s" };
                }

                // switch from black to color
                if (state.color === "black") {
                    return { ...state, color, strokeWidth: "m" };
                }

                // switch from color to color
                return { ...state, color };

            case "SetStrokeWidth":
                const { strokeWidth } = action;
                return { ...state, strokeWidth };
            default:
                return state;
        }
    };

export const fontSize: AppReducer<FontSize> =
    (state = "medium", action) => {
        switch (action.type) {
            case "SetFontSize":
                return action.fontSize;
            default:
                return state;
        }
    };

export const inputMode: AppReducer<InputMode> =
    (state = "pen", action) => {
        switch (action.type) {
            case "SetInputMode":
                return action.inputMode;
            default:
                return state;
        }
    };

export const pageList: AppReducer<Page[]> =
    (state = [], action) => {
        switch (action.type) {
            case "ReceivedPageList":
                return action.pageList;
            case "AddPage":
                {
                    const { pageNumber, name } = action;
                    return [...state, { pageNumber, name }];
                }
            case "DeletePage":
                {
                    const { pageNumber } = action;
                    return state.filter((page) => page.pageNumber !== pageNumber);
                }
            case "SetPageName":
                {
                    const { pageNumber, name } = action;
                    return state.map((s) => s.pageNumber === pageNumber ? { pageNumber, name } : { ...s });
                }
            default:
                return state;
        }
    };

const currentPageInner: AppReducer<PageDetails | null> = (state = null, action) => {
    switch (action.type) {
        case "ReceivedPage":
            return action.page;
        case "AddElement":
            const { pageNumber, element } = action;
            if (!state || state.pageNumber !== pageNumber) {
                return state;
            }
            return { ...state, elements: [...state.elements, element] };
        case "ClearCurrentPage":
            return null;
        default:
            return state;
    }
};

export const currentPage = undoable(currentPageInner);

export const error: AppReducer<string> = (state = "", action) => {
    switch (action.type) {
        case "SetError":
            return action.error;
        case "ClearError":
            return "";
        default:
            return state;
    }
};

export const ready: AppReducer<boolean> = (state = false, action) => {
    switch (action.type) {
        case "SetReady":
            return action.ready;
        default:
            return state;
    }
};
