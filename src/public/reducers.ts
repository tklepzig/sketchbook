import { AnyAction, Reducer } from "redux";
import { AddLineAction, SetColorAction } from "./actions";
import { PenChooserProps } from "./components/PenChooser";
import { Actions } from "./models/Actions";
import { Line } from "./models/Line";
import { Page } from "./models/Page";

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

// TODO: empty page list as default
export const pages: Reducer<Page[]> =
    (state = [{ id: "0", lines: [] }], action: AnyAction): Page[] => {
        switch (action.type) {
            case Actions.AddLine:
                const { line } = action as AddLineAction;
                return [...state, { id: (state.length + 1).toString(), lines: [] }];
            default:
                return state;
        }
    };
