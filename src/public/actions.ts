import { RootState } from "@models/RootState";
import { FontSize, InputMode, PageElement } from "@shared/models";
import { Action, Dispatch } from "redux";

export enum Actions {
    SetColor,
    SetStrokeWidth,
    SetFontSize,
    SetInputMode,
    AddElement,
    AddPage,
    SetError,
    ClearError
}

export interface SetColorAction extends Action {
    color: string;
}
export const setColor = (color: string): SetColorAction => ({
    type: Actions.SetColor,
    color
});

export interface SetStrokeWidthAction extends Action {
    strokeWidth: string;
}
export const setStrokeWidth = (strokeWidth: string): SetStrokeWidthAction => ({
    type: Actions.SetStrokeWidth,
    strokeWidth
});

export interface SetFontSizeAction extends Action {
    fontSize: FontSize;
}
export const setFontSize = (fontSize: FontSize): SetFontSizeAction => ({
    type: Actions.SetFontSize,
    fontSize
});

export interface SetInputModeAction extends Action {
    inputMode: InputMode;
}
export const setInputMode = (inputMode: InputMode): SetInputModeAction => ({
    type: Actions.SetInputMode,
    inputMode
});

export interface AddElementAction extends Action {
    element: PageElement;
    pageId: string;
}
export const addElement = (pageId: string, element: PageElement) => (dispatch: Dispatch<RootState>) => {

    dispatch({
        type: Actions.AddElement,
        element,
        pageId
    });

    fetch("addElement", {
        method: "post",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            element,
            pageId
        }),
    })
        .then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.dir("post succeeded");
            } else {
                dispatch(setError(response.statusText));
            }
        })
        .catch((error) => { dispatch(setError(error.message)); });
};

export interface SetErrorAction extends Action {
    error: string;
}
export const setError = (error: string): SetErrorAction => ({
    type: Actions.SetError,
    error
});

export const clearError = (): Action => ({
    type: Actions.ClearError
});
