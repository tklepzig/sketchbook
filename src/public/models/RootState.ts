
export enum DrawMode {
    Above,
    Below
}

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

export interface RootState {
    pen: {
        color: string,
        strokeWidth: string
    };
    pages: Page[];
}
