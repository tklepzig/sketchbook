import { FontSize, InputMode, Page, Pen } from "@shared/models";
import { AddElementAction, SetColorAction, SetFontSizeAction, SetInputModeAction, SetReadyAction, ReceivedPageListAction } from "actions";
import { AnyAction, Reducer } from "redux";
import { Actions, SetErrorAction } from "./actions";

export const pen: Reducer<Pen> =
    (state = { color: "black", strokeWidth: "s" }, action: AnyAction): Pen => {
        switch (action.type) {
            case Actions.SetColor:
                const { color } = action as SetColorAction;

                if (color === "black") {
                    return { ...state, color, strokeWidth: "s" };
                }
                return { ...state, color, strokeWidth: "m" };

            case Actions.SetStrokeWidth:
                const { strokeWidth } = action;
                return { ...state, strokeWidth };
            default:
                return state;
        }
    };

export const fontSize: Reducer<FontSize> =
    (state = "medium", action: AnyAction): FontSize => {
        switch (action.type) {
            case Actions.SetFontSize:
                return (action as SetFontSizeAction).fontSize;
            default:
                return state;
        }
    };

export const inputMode: Reducer<InputMode> =
    (state = "pen", action: AnyAction): InputMode => {
        switch (action.type) {
            case Actions.SetInputMode:
                return (action as SetInputModeAction).inputMode;
            default:
                return state;
        }
    };

// TODO: empty page list as default
export const pages: Reducer<Page[]> =
    (state = [{ id: "1", elements: [] }], action: AnyAction): Page[] => {
        switch (action.type) {
            case Actions.AddElement:
                const { pageId, element } = action as AddElementAction;
                return state.map((page) => (page.id === pageId)
                    ? { ...page, elements: [...page.elements, element] }
                    : page
                );
            case Actions.AddPage:
                return state;
            default:
                return state;
        }
    };

export const pageList: Reducer<Array<{ id: string }>> =
    (state = [], action: AnyAction): Array<{ id: string }> => {
        switch (action.type) {
            case Actions.ReceivedPageList:
                return (action as ReceivedPageListAction).pageList;
            case Actions.AddPage:
                return state;
            default:
                return state;
        }
    };


export const error: Reducer<string> = (state = "", action: AnyAction) => {
    switch (action.type) {
        case Actions.SetError:
            return (action as SetErrorAction).error;
        case Actions.ClearError:
            return "";
        default:
            return state;
    }
};

export const ready: Reducer<boolean> = (state = false, action: AnyAction) => {
    switch (action.type) {
        case Actions.SetReady:
            return (action as SetReadyAction).ready;
        default:
            return state;
    }
};