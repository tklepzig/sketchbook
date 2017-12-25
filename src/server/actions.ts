import { Action } from "redux";
import { Line, PageElement, Text } from "../shared/models";

export enum Actions {
    AddElement,
    AddPage
}

export interface AddElementAction extends Action {
    element: PageElement;
    pageId: string;
}
export const addElement =
    (pageId: string, element: PageElement): AddElementAction => ({ type: Actions.AddElement, element, pageId });
