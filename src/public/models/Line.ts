export interface Line {
    segments: Array<{ start: { x: number; y: number; }; end: { x: number; y: number; }; }>;
    color: string;
    globalCompositeOperation: string;
    lineWidth: number;
}
