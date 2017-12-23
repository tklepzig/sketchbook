import { FontSize, InputMode, PageElement } from "@models/RootState";
import { Action } from "redux";

export enum Actions {
    SetColor,
    SetStrokeWidth,
    SetFontSize,
    SetInputMode,
    AddElement,
    AddPage
}

export interface SetColorAction extends Action {
    color: string;
}
export const setColor =
    (color: string): SetColorAction => ({ type: Actions.SetColor, color });

export interface SetStrokeWidthAction extends Action {
    strokeWidth: string;
}
export const setStrokeWidth =
    (strokeWidth: string): SetStrokeWidthAction => ({ type: Actions.SetStrokeWidth, strokeWidth });

export interface SetFontSizeAction extends Action {
    fontSize: FontSize;
}
export const setFontSize =
    (fontSize: FontSize): SetFontSizeAction => ({ type: Actions.SetFontSize, fontSize });

export interface SetInputModeAction extends Action {
    inputMode: InputMode;
}
export const setInputMode =
    (inputMode: InputMode): SetInputModeAction => ({ type: Actions.SetInputMode, inputMode });

export interface AddElementAction extends Action {
    element: PageElement;
    pageId: string;
}
export const addElement =
    (pageId: string, element: PageElement): AddElementAction => ({ type: Actions.AddElement, element, pageId });
