import { RootState } from "@models/RootState";
import { FontSize, InputMode, Page, PageDetails, PageElement } from "@shared/models";
import { Action, Dispatch } from "redux";

export enum Actions {
    SetColor,
    SetStrokeWidth,
    SetFontSize,
    SetInputMode,
    AddElement,
    AddPage,
    FetchPageList,
    ReceivedPageList,
    FetchPage,
    ReceivedPage,
    SetError,
    ClearError,
    SetReady
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
    pageNumber: number;
}
export const addElement = (pageNumber: number, element: PageElement) => (dispatch: Dispatch<RootState>) => {

    dispatch({
        type: Actions.AddElement,
        element,
        pageNumber
    });

    fetch("api/element", {
        method: "post",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            element,
            pageNumber
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

export interface AddPageAction extends Action {
    pageNumber: number;
    name: string;
}
export const addPage = (pageNumber: number, name: string) => (dispatch: Dispatch<RootState>) => {

    dispatch({
        type: Actions.AddPage,
        pageNumber,
        name
    });

    fetch("api/page", {
        method: "post",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ pageNumber, name }),
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

export const fetchPageList = () => async (dispatch: Dispatch<RootState>) => {

    try {
        const response = await fetch("api/pages", {
            method: "get",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        });

        if (response.status >= 200 && response.status < 300) {
            const json = await response.json();
            dispatch(receivedPageList(json));
        } else {
            dispatch(setError(response.statusText));
        }
    } catch (error) {
        dispatch(setError(error.message));
    } finally {
        dispatch(setReady(true));
    }
};

export interface ReceivedPageListAction extends Action {
    pageList: Page[];
}
export const receivedPageList = (pageList: Page[]): ReceivedPageListAction => ({
    type: Actions.ReceivedPageList,
    pageList
});

export interface FetchPageAction extends Action {
    pageNumber: number;
}
export const fetchPage = (pageNumber: number) => async (dispatch: Dispatch<RootState>) => {

    try {
        const response = await fetch("api/page/" + pageNumber, {
            method: "get",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        });

        if (response.status >= 200 && response.status < 300) {
            const json = await response.json();
            dispatch(receivedPage(json));
        } else {
            dispatch(setError(response.statusText));
        }
    } catch (error) {
        dispatch(setError(error.message));
    } finally {
        dispatch(setReady(true));
    }
};

export interface ReceivedPageAction extends Action {
    page: PageDetails;
}
export const receivedPage = (page: PageDetails): ReceivedPageAction => ({
    type: Actions.ReceivedPage,
    page
});

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

export interface SetReadyAction extends Action {
    ready: boolean;
}
export const setReady = (ready: boolean): SetReadyAction => ({
    type: Actions.SetReady,
    ready
});
