import { AnyAction, Reducer } from "redux";
import { Actions } from "../../models/Actions";
import { SetColorAction } from "./actions";
import { PenChooserProps } from "./PenChooser";

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
