import { FontSize, InputMode, Page, Pen } from "@shared/models";
export interface RootState {
    pen: Pen;
    fontSize: FontSize;
    inputMode: InputMode;
    error: string;
    // pageList: Array<{ id: string, name: string }>;
    // currentPage: Page;
    pages: Page[];
}
