import { Page } from "./Page";

export interface RootState {
    pen: {
        color: string,
        strokeWidth: string
    };
    pages: Page[];
}
