import { RootState } from "@models/RootState";
import { FontSize, InputMode, Page, PageDetails, PageElement } from "@shared/models";
import { Action, Dispatch } from "redux";
import { ActionCreators } from "redux-undo";

export type AppAction = SetColorAction
    | SetStrokeWidthAction
    | SetFontSizeAction
    | SetInputModeAction
    | AddElementAction
    | AddPageAction
    | SetPageNameAction
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
export const addElement = (pageNumber: number, element: PageElement) => async (dispatch: Dispatch<RootState>) => {

    dispatch({
        type: "AddElement",
        element,
        pageNumber
    });

    await sendRequest(dispatch, "api/element", "post", JSON.stringify({ element, pageNumber }));
};

export const undo = () => async (dispatch: Dispatch<RootState>, getState: () => RootState) => {
    dispatch(ActionCreators.undo());

    const state = getState();
    if (!state.currentPage.present) {
        return;
    }
    const { pageNumber } = state.currentPage.present;
    await sendRequest(dispatch, "api/lastElement", "delete", JSON.stringify({ pageNumber }));
};

export const redo = () => async (dispatch: Dispatch<RootState>, getState: () => RootState) => {
    dispatch(ActionCreators.redo());

    const state = getState();
    const page = state.currentPage.present;
    if (!page) {
        return;
    }
    const element = page.elements[page.elements.length - 1];
    const pageNumber = page.pageNumber;

    await sendRequest(dispatch, "api/element", "post", JSON.stringify({ element, pageNumber }));
};

export interface AddPageAction {
    type: "AddPage";
    pageNumber: number;
    name: string;
}
export const addPage = (pageNumber: number, name: string) => async (dispatch: Dispatch<RootState>) => {

    dispatch({
        type: "AddPage",
        pageNumber,
        name
    });

    await sendRequest(dispatch, "api/page", "post", JSON.stringify({ pageNumber, name }));
};

export interface SetPageNameAction {
    type: "SetPageName";
    pageNumber: number;
    name: string;
}
export const setPageName = (pageNumber: number, name: string) => async (dispatch: Dispatch<RootState>) => {

    dispatch({
        type: "SetPageName",
        pageNumber,
        name
    });

    await sendRequest(dispatch, "api/page", "put", JSON.stringify({ pageNumber, name }));
};

export interface DeletePageAction {
    type: "DeletePage";
    pageNumber: number;
}
export const deletePage = (pageNumber: number) => async (dispatch: Dispatch<RootState>) => {

    dispatch({
        type: "DeletePage",
        pageNumber
    });

    await sendRequest(dispatch, "api/page", "delete", JSON.stringify({ pageNumber }));
};

export const fetchPageList = () => async (dispatch: Dispatch<RootState>) => {

    const response = await sendRequest(dispatch, "api/pages", "get");
    const pageList = await response.json();
    dispatch(receivedPageList(pageList));
    dispatch(setReady(true));
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

    const response = await sendRequest(dispatch, `api/page/${pageNumber}`, "get");
    const page = await response.json();
    dispatch(ActionCreators.clearHistory());
    dispatch(receivedPage(page));
    dispatch(setReady(true));
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

const sendRequest = async (
    dispatch: Dispatch<RootState>, url: string,
    method: string, body?: string): Promise<Response> => {
    return new Promise<Response>(async (resolve, reject) => {
        try {
            const options: RequestInit = {
                method,
                credentials: "include",
                cache: "no-cache",
                mode: "cors",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            };

            if (body) {
                options.body = body;
            }

            const response = await fetch(url, options);

            if (response.status >= 200 && response.status < 300) {
                resolve(response);
            } else {
                dispatch(setError(response.statusText));
            }
        } catch (error) {
            dispatch(setError(error.message));
        }
    });
};
