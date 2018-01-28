import { FontSize, InputMode, Page, PageDetails, Pen } from "@shared/models";
import { StateWithHistory } from "redux-undo";
export interface RootState {
    pen: Pen;
    fontSize: FontSize;
    inputMode: InputMode;
    error: string;
    ready: boolean;
    pageList: Page[];
    currentPage: StateWithHistory<PageDetails | null>;
}
