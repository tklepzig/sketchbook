import { Line } from "./Line";

export interface RootState {
    pen: {
        color: string,
        strokeWidth: string
    };
    lines: Line[];
}
