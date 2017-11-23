import { Action } from "redux";
import { Actions } from "./models/Actions";

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
