import { FontSize, InputMode, Page, Pen } from "@shared/models";
export interface RootState {
    pen: Pen;
    fontSize: FontSize;
    inputMode: InputMode;
    error: string;
    ready: boolean;
    pageList: Array<{ id: string }>;
    currentPage: Page | null;
}
