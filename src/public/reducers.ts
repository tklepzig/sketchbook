import { AnyAction, Reducer } from "redux";
import { AddLineAction, SetColorAction } from "./actions";
import { PenChooserProps } from "./components/PenChooser";
import { Actions } from "./models/Actions";
import { Line } from "./models/Line";

export const pen: Reducer<PenChooserProps> =
    (state = { color: "black", strokeWidth: "s" }, action: AnyAction): PenChooserProps => {
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

export const lines: Reducer<Line[]> =
    (state = [], action: AnyAction): Line[] => {
        switch (action.type) {
            case Actions.AddLine:
                const { line } = action as AddLineAction;
                return [...state, line];
            default:
                return state;
        }
    };
