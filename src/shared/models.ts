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

export interface PageDetails {
    pageNumber: number;
    name: string;
    elements: PageElement[];
}

export interface Page {
    pageNumber: number;
    name: string;
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
