import { AnyAction } from "redux";

export interface TAction<TActionType> extends AnyAction {
    type: TActionType;
}
