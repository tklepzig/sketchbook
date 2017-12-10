import { AnyAction, Reducer } from "redux";
import { AddLineAction, SetColorAction } from "./actions";
import { PenChooserProps } from "./components/PenChooser";
import { Actions } from "./models/Actions";
import { Page } from "./models/RootState";

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
                const { pageId, line } = action as AddLineAction;
                return state.map((page) => (page.id === pageId)
                    ? { ...page, lines: [...page.lines, line] }
                    : page
                );
            case Actions.AddPage:
                return state;
            default:
                return state;
        }
    };
