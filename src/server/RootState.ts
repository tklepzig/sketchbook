import { Page } from "@shared/models";
export interface RootState {
    pageList: Array<{ id: string }>;
    pageDetails: { [id: string]: Page; };
}
