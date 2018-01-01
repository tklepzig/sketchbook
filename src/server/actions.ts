import { Line, Page, PageDetails, PageElement, Text } from "@shared/models";
import { pageDirectory, pageListFile } from "config";
import * as fs from "fs-extra";
import * as path from "path";
import { Action, Dispatch } from "redux";
import { RootState } from "RootState";

export enum Actions {
    AddElement,
    AddPage,
    DeletePage,
    LoadPageList,
    LoadPageDetails,
    PageListLoaded,
    PageDetailsLoaded
}

export interface AddElementAction extends Action {
    element: PageElement;
    pageNumber: number;
}
export const addElement = (pageNumber: number, element: PageElement) =>
    async (dispatch: Dispatch<RootState>, getState: () => RootState) => {

        dispatch({
            type: Actions.AddElement,
            element,
            pageNumber
        });

        const state = getState();
        const page = state.pageDetails[pageNumber];
        await fs.writeFile(path.resolve(pageDirectory, pageNumber.toString()), JSON.stringify(page));
    };

export interface AddPageAction extends Action {
    pageNumber: number;
    name: string;
}
export const addPage = (pageNumber: number, name: string) =>
    async (dispatch: Dispatch<RootState>, getState: () => RootState) => {
        dispatch({
            type: Actions.AddPage,
            pageNumber,
            name
        });

        const emptyPage: PageDetails = { name, pageNumber, elements: [] };
        const state = getState();
        await fs.writeFile(path.resolve(pageListFile), JSON.stringify(state.pageList));
        await fs.ensureDir(pageDirectory);
        await fs.writeFile(path.resolve(pageDirectory, pageNumber.toString()), JSON.stringify(emptyPage));
    };

export interface DeletePageAction extends Action {
    pageNumber: number;
}
export const deletePage = (pageNumber: number) =>
    async (dispatch: Dispatch<RootState>, getState: () => RootState) => {
        dispatch({
            type: Actions.DeletePage,
            pageNumber
        });

        const state = getState();
        await fs.writeFile(path.resolve(pageListFile), JSON.stringify(state.pageList));
        await fs.remove(path.resolve(pageDirectory, pageNumber.toString()));
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
    pageList: Page[];
}
export const pageListLoaded =
    (pageList: Page[]): PageListLoadedAction => ({
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
        const pageDetails: { [pageNumber: number]: PageDetails; } = {};

        for (const file of files) {
            const pageNumber = +file;
            const content = await fs.readFile(path.resolve(pageDirectory, file));
            pageDetails[pageNumber] = JSON.parse(content.toString());
        }
        dispatch(pageDetailsLoaded(pageDetails));
    };

export interface PageDetailsLoadedAction extends Action {
    pageDetails: { [pageNumber: number]: PageDetails; };
}
export const pageDetailsLoaded =
    (pageDetails: { [pageNumber: number]: PageDetails; }): PageDetailsLoadedAction => ({
        type: Actions.PageDetailsLoaded,
        pageDetails
    });

export const loadState = () =>
    async (dispatch: Dispatch<RootState>) => {
        await dispatch(loadPageList());
        await dispatch(loadPageDetails());
    };
