import { FontSize, InputMode, Page, PageDetails, Pen } from "@shared/models";
export interface RootState {
    pen: Pen;
    fontSize: FontSize;
    inputMode: InputMode;
    error: string;
    ready: boolean;
    pageList: Page[];
    currentPage: PageDetails | null;
}
