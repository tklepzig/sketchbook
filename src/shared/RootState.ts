export type CompositeOperation = "source-over" | "destination-over";
export type PageElementKind = "line" | "text";
export type InputMode = "pen" | "text";
export type FontSize = "small" | "medium" | "large";

export interface Text {
    kind: PageElementKind;
    text: string;
    position: Point;
    measurement: Size;
    fontSize: number;

}
export interface Line {
    kind: PageElementKind;
    segments: Array<{ start: Point, end: Point }>;
    color: string;
    globalCompositeOperation: string;
    lineWidth: number;
}

export type PageElement = Line | Text;

export interface Page {
    id: string;
    elements: PageElement[];
}

export interface Point {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
}

export interface Pen {
    color: string;
    strokeWidth: string;
}

export interface UiState {
    pen: Pen;
    fontSize: FontSize;
    inputMode: InputMode;
}

export interface PersistentState {
    pages: Page[];
}

export type RootState = UiState & PersistentState;
