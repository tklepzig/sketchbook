export interface Line {
    segments: Array<{ start: Point, end: Point }>;
    color: string;
    globalCompositeOperation: string;
    lineWidth: number;
}

export interface Page {
    id: string;
    lines: Line[];
}

export interface Point {
    x: number;
    y: number;
}

export type CompositeOperation = "source-over" | "destination-over";
export type InputMode = "pen" | "text";
export type FontSize = "small" | "medium" | "large";

export interface RootState {
    pen: {
        color: string,
        strokeWidth: string
    };
    fontSize: FontSize;
    inputMode: InputMode;
    pages: Page[];
}
