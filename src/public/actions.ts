import { Action } from "redux";
import { Actions } from "./models/Actions";
import { Line } from "./models/RootState";

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

export interface AddLineAction extends Action {
    line: Line;
    pageId: string;
}
export const addLine =
    (pageId: string, line: Line): AddLineAction => ({ type: Actions.AddLine, line, pageId });
