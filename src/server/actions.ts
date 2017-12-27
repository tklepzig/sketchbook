import { Line, Page, PageElement, Text } from "@shared/models";
import { pageDirectory, pageListFile } from "config";
import * as fs from "fs-extra";
import * as path from "path";
import { Action, Dispatch } from "redux";
import { RootState } from "RootState";

export enum Actions {
    AddElement,
    AddPage
}

export interface AddElementAction extends Action {
    element: PageElement;
    pageId: string;
}
export const addElement = (pageId: string, element: PageElement) =>
    async (dispatch: Dispatch<RootState>, getState: () => RootState) => {

        dispatch({
            type: Actions.AddElement,
            element,
            pageId
        });

        const state = getState();
        const page = state.pageDetails[pageId];
        await fs.writeFile(path.resolve(pageDirectory, pageId), JSON.stringify(page));
    };

export interface AddPageAction extends Action {
    pageId: string;
}
export const addPage = (pageId: string) =>
    async (dispatch: Dispatch<RootState>, getState: () => RootState) => {
        dispatch({
            type: Actions.AddPage,
            pageId
        });

        const state = getState();
        await fs.writeFile(path.resolve(pageListFile), JSON.stringify(state.pageList));
    };
