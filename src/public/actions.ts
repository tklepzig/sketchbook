import { RootState } from "@models/RootState";
import { FontSize, InputMode, Page, PageDetails, PageElement } from "@shared/models";
import { Action, Dispatch } from "redux";

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
    type: "SetColor";
    color: string;
}
export const setColor = (color: string): SetColorAction => ({
    type: "SetColor",
    color
});

export interface SetStrokeWidthAction {
    type: "SetStrokeWidth";
    strokeWidth: string;
}
export const setStrokeWidth = (strokeWidth: string): SetStrokeWidthAction => ({
    type: "SetStrokeWidth",
    strokeWidth
});

export interface SetFontSizeAction {
    type: "SetFontSize";
    fontSize: FontSize;
}
export const setFontSize = (fontSize: FontSize): SetFontSizeAction => ({
    type: "SetFontSize",
    fontSize
});

export interface SetInputModeAction {
    type: "SetInputMode";
    inputMode: InputMode;
}
export const setInputMode = (inputMode: InputMode): SetInputModeAction => ({
    type: "SetInputMode",
    inputMode
});

export interface AddElementAction {
    type: "AddElement";
    element: PageElement;
    pageNumber: number;
}
export const addElement = (pageNumber: number, element: PageElement) => (dispatch: Dispatch<RootState>) => {

    dispatch({
        type: "AddElement",
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
    type: "AddPage";
    pageNumber: number;
    name: string;
}
export const addPage = (pageNumber: number, name: string) => (dispatch: Dispatch<RootState>) => {

    dispatch({
        type: "AddPage",
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
    type: "DeletePage";
    pageNumber: number;
}
export const deletePage = (pageNumber: number) => (dispatch: Dispatch<RootState>) => {

    dispatch({
        type: "DeletePage",
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
    type: "ReceivedPageList";
    pageList: Page[];
}
export const receivedPageList = (pageList: Page[]): ReceivedPageListAction => ({
    type: "ReceivedPageList",
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
    type: "ReceivedPage";
    page: PageDetails;
}
export const receivedPage = (page: PageDetails): ReceivedPageAction => ({
    type: "ReceivedPage",
    page
});

export interface ClearCurrentPageAction {
    type: "ClearCurrentPage";
}
export const clearCurrentPage = (): ClearCurrentPageAction => ({
    type: "ClearCurrentPage"
});

export interface SetErrorAction {
    type: "SetError";
    error: string;
}
export const setError = (error: string): SetErrorAction => ({
    type: "SetError",
    error
});

export interface ClearErrorAction {
    type: "ClearError";
}
export const clearError = (): ClearErrorAction => ({
    type: "ClearError"
});

export interface SetReadyAction {
    type: "SetReady";
    ready: boolean;
}
export const setReady = (ready: boolean): SetReadyAction => ({
    type: "SetReady",
    ready
});
