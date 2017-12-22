import { Actions } from "@models/Actions";
import { FontSize, InputMode, Line, Text } from "@models/RootState";
import { Action } from "redux";

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

export interface AddLineAction extends Action {
    line: Line;
    pageId: string;
}
export const addLine =
    (pageId: string, line: Line): AddLineAction => ({ type: Actions.AddLine, line, pageId });

export interface AddTextAction extends Action {
    text: Text;
    pageId: string;
}
export const addText =
    (pageId: string, text: Text): AddTextAction => ({ type: Actions.AddText, text, pageId });
