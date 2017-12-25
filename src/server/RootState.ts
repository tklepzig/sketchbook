import { Page } from "@shared/models";
export interface RootState {
    pageList: Array<{ id: string, name: string }>;
    pageDetails: Map<string, Page>;
}
