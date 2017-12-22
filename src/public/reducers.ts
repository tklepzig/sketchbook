import { FontSize, InputMode, Page, Pen } from "@models/RootState";
import { AddLineAction, AddTextAction, SetColorAction, SetFontSizeAction, SetInputModeAction } from "actions";
import { AnyAction, Reducer } from "redux";
import { Actions } from "./actions";

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

// TODO: empty page list as default
export const pages: Reducer<Page[]> =
    (state = [{ id: "1", elements: [] }], action: AnyAction): Page[] => {
        switch (action.type) {
            case Actions.AddLine:
                {
                    const { pageId, line } = action as AddLineAction;
                    return state.map((page) => (page.id === pageId)
                        ? { ...page, elements: [...page.elements, line] }
                        : page
                    );
                }
            case Actions.AddText:
                {
                    const { pageId, text } = action as AddTextAction;
                    return state.map((page) => (page.id === pageId)
                        ? { ...page, elements: [...page.elements, text] }
                        : page
                    );
                }
            case Actions.AddPage:
                return state;
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
