import { Page, PageDetails } from "@shared/models";
export interface RootState {
    pageList: Page[];
    pageDetails: { [pageNumber: number]: PageDetails; };
}
