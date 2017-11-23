import { AnyAction, Reducer } from "redux";
import { Actions } from "../../models/Actions";
import { PenChooserProps } from "./PenChooser";

export const pen: Reducer<PenChooserProps> =
    (state = { color: "black", strokeWidth: "s" }, action: AnyAction): PenChooserProps => {
        switch (action.type) {
            case Actions.SetColor:
                const { color } = action;
                return { ...state, color };
            case Actions.SetStrokeWidth:
                const { strokeWidth } = action;
                return { ...state, strokeWidth };
            default:
                return state;
        }
    };
