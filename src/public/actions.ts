import { RootState } from "@models/RootState";
import { FontSize, InputMode, Page, PageDetails, PageElement } from "@shared/models";
import { Action, Dispatch } from "redux";

export enum ActionTypes {
    SetColor,
    SetStrokeWidth,
    SetFontSize,
    SetInputMode,
    AddElement,
    AddPage,
    DeletePage,
    FetchPageList,
    ReceivedPageList,
    FetchPage,
    ReceivedPage,
    ClearCurrentPage,
    SetError,
    ClearError,
    SetReady
}

export type AppAction = SetColorAction
    | SetStrokeWidthAction
    | SetFontSizeAction
    | SetInputModeAction
    | AddElementAction
    | AddPageAction
    | DeletePageAction
    | ReceivedPageListAction
    | ReceivedPageAction
    | ClearCurrentPageAction
    | SetErrorAction
    | ClearErrorAction
    | SetReadyAction;

export interface SetColorAction {
    type: ActionTypes.SetColor;
    color: string;
}
export const setColor = (color: string): SetColorAction => ({
    type: ActionTypes.SetColor,
    color
});

export interface SetStrokeWidthAction {
    type: ActionTypes.SetStrokeWidth;
    strokeWidth: string;
}
export const setStrokeWidth = (strokeWidth: string): SetStrokeWidthAction => ({
    type: ActionTypes.SetStrokeWidth,
    strokeWidth
});

export interface SetFontSizeAction {
    type: ActionTypes.SetFontSize;
    fontSize: FontSize;
}
export const setFontSize = (fontSize: FontSize): SetFontSizeAction => ({
    type: ActionTypes.SetFontSize,
    fontSize
});

export interface SetInputModeAction {
    type: ActionTypes.SetInputMode;
    inputMode: InputMode;
}
export const setInputMode = (inputMode: InputMode): SetInputModeAction => ({
    type: ActionTypes.SetInputMode,
    inputMode
});

export interface AddElementAction {
    type: ActionTypes.AddElement;
    element: PageElement;
    pageNumber: number;
}
export const addElement = (pageNumber: number, element: PageElement) => (dispatch: Dispatch<RootState>) => {

    dispatch({
        type: ActionTypes.AddElement,
        element,
        pageNumber
    });

    fetch("api/element", {
        method: "post",
        credentials: "include",
        cache: "no-cache",
        mode: "cors",
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
            if (response.status < 200 || response.status >= 300) {
                dispatch(setError(response.statusText));
            }
        })
        .catch((error) => { dispatch(setError(error.message)); });
};

export interface AddPageAction {
    type: ActionTypes.AddPage;
    pageNumber: number;
    name: string;
}
export const addPage = (pageNumber: number, name: string) => (dispatch: Dispatch<RootState>) => {

    dispatch({
        type: ActionTypes.AddPage,
        pageNumber,
        name
    });

    fetch("api/page", {
        method: "post",
        credentials: "include",
        cache: "no-cache",
        mode: "cors",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ pageNumber, name }),
    })
        .then((response) => {
            if (response.status < 200 || response.status >= 300) {
                dispatch(setError(response.statusText));
            }
        })
        .catch((error) => { dispatch(setError(error.message)); });
};

export interface DeletePageAction {
    type: ActionTypes.DeletePage;
    pageNumber: number;
}
export const deletePage = (pageNumber: number) => (dispatch: Dispatch<RootState>) => {

    dispatch({
        type: ActionTypes.DeletePage,
        pageNumber
    });

    fetch("api/page", {
        method: "delete",
        credentials: "include",
        cache: "no-cache",
        mode: "cors",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ pageNumber }),
    })
        .then((response) => {
            if (response.status < 200 || response.status >= 300) {
                dispatch(setError(response.statusText));
            }
        })
        .catch((error) => { dispatch(setError(error.message)); });
};

export const fetchPageList = () => async (dispatch: Dispatch<RootState>) => {

    try {
        const response = await fetch("api/pages", {
            method: "get",
            credentials: "include",
            cache: "no-cache",
            mode: "cors",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
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

export interface ReceivedPageListAction {
    type: ActionTypes.ReceivedPageList;
    pageList: Page[];
}
export const receivedPageList = (pageList: Page[]): ReceivedPageListAction => ({
    type: ActionTypes.ReceivedPageList,
    pageList
});

export const fetchPage = (pageNumber: number) => async (dispatch: Dispatch<RootState>) => {

    try {
        const response = await fetch("api/page/" + pageNumber, {
            method: "get",
            credentials: "include",
            cache: "no-cache",
            mode: "cors",
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

export interface ReceivedPageAction {
    type: ActionTypes.ReceivedPage;
    page: PageDetails;
}
export const receivedPage = (page: PageDetails): ReceivedPageAction => ({
    type: ActionTypes.ReceivedPage,
    page
});

export interface ClearCurrentPageAction {
    type: ActionTypes.ClearCurrentPage;
}
export const clearCurrentPage = (): ClearCurrentPageAction => ({
    type: ActionTypes.ClearCurrentPage
});

export interface SetErrorAction {
    type: ActionTypes.SetError;
    error: string;
}
export const setError = (error: string): SetErrorAction => ({
    type: ActionTypes.SetError,
    error
});

export interface ClearErrorAction {
    type: ActionTypes.ClearError;
}
export const clearError = (): ClearErrorAction => ({
    type: ActionTypes.ClearError
});

export interface SetReadyAction {
    type: ActionTypes.SetReady;
    ready: boolean;
}
export const setReady = (ready: boolean): SetReadyAction => ({
    type: ActionTypes.SetReady,
    ready
});
