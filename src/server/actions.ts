import { Line, Page, PageElement, Text } from "@shared/models";
import * as fs from "fs-extra";
import * as path from "path";
import { Action, Dispatch } from "redux";
import { RootState } from "RootState";

const dataPath = "../../../data";
const pageDirectory = path.resolve(__dirname, dataPath, "pages");

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
export const addPage = (pageId: string): AddPageAction => ({
    type: Actions.AddPage,
    pageId
});
