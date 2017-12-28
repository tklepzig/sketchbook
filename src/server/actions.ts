import { Line, Page, PageElement, Text } from "@shared/models";
import { pageDirectory, pageListFile } from "config";
import * as fs from "fs-extra";
import * as path from "path";
import { Action, Dispatch } from "redux";
import { RootState } from "RootState";

export enum Actions {
    AddElement,
    AddPage,
    LoadPageList,
    LoadPageDetails,
    PageListLoaded,
    PageDetailsLoaded
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

export const loadPageList = () =>
    async (dispatch: Dispatch<RootState>) => {
        const pathExists = await fs.pathExists(pageListFile);
        if (!pathExists) {
            return;
        }

        const content = await fs.readFile(path.resolve(pageListFile));
        const pageList = JSON.parse(content.toString());
        dispatch(pageListLoaded(pageList));
    };

export interface PageListLoadedAction extends Action {
    pageList: Array<{ id: string }>;
}
export const pageListLoaded =
    (pageList: Array<{ id: string }>): PageListLoadedAction => ({
        type: Actions.PageListLoaded,
        pageList
    });

export const loadPageDetails = () =>
    async (dispatch: Dispatch<RootState>) => {
        const pathExists = await fs.pathExists(pageDirectory);
        if (!pathExists) {
            return;
        }

        const files = await fs.readdir(pageDirectory);
        const pageDetails: { [id: string]: Page; } = {};

        for (const file of files) {
            const content = await fs.readFile(path.resolve(pageDirectory, file));
            pageDetails[file] = JSON.parse(content.toString());
        }
        dispatch(pageDetailsLoaded(pageDetails));
    };

export interface PageDetailsLoadedAction extends Action {
    pageDetails: { [id: string]: Page; };
}
export const pageDetailsLoaded =
    (pageDetails: { [id: string]: Page; }): PageDetailsLoadedAction => ({
        type: Actions.PageDetailsLoaded,
        pageDetails
    });

export const loadState = () =>
    async (dispatch: Dispatch<RootState>) => {
        await dispatch(loadPageList());
        await dispatch(loadPageDetails());
    };
