import { CanvasTransform } from "./CanvasTransform";

export class DrawingHandler {
    private canvasTransform: CanvasTransform;
    private mouseIsDown: boolean;
    private tapDownPoint: { x: number; y: number; };
    private currentLine: {
        id: number;
        segments: Array<{ start: { x: number; y: number; }; end: { x: number; y: number; }; }>
        color: string;
        globalCompositeOperation: string,
        width: number;
        visible: boolean;
    };

    constructor() {
        this.canvasTransform = new CanvasTransform();
    }

    public tapDown(canvasContext: CanvasRenderingContext2D, x: number, y: number) {
        this.mouseIsDown = true;

        const pt = this.canvasTransform.getTransformedPoint(canvasContext, x, y);

        this.currentLine = {
            color: canvasContext.strokeStyle.toString(),
            globalCompositeOperation: canvasContext.globalCompositeOperation,
            id: -1,
            segments: [],
            visible: true,
            width: canvasContext.lineWidth
        };
        this.drawLine(canvasContext, pt.x, pt.y, pt.x + 0.1, pt.y + 0.1);

        this.tapDownPoint = {
            x: pt.x,
            y: pt.y
        };
    }

    public tapMove(canvasContext: CanvasRenderingContext2D, x: number, y: number) {
        if (!this.mouseIsDown) {
            return;
        }

        const pt = this.canvasTransform.getTransformedPoint(canvasContext, x, y);

        this.drawLine(canvasContext, this.tapDownPoint.x, this.tapDownPoint.y, pt.x, pt.y);

        const segment = {
            end: { x: pt.x, y: pt.y },
            start: { x: this.tapDownPoint.x, y: this.tapDownPoint.y }
        };
        this.currentLine.segments.push(segment);

        this.tapDownPoint = {
            x: pt.x,
            y: pt.y
        };
    }

    public tapUp() {
        if (!this.mouseIsDown) {
            return;
        }

        this.mouseIsDown = false;
        // add currentLine to lines[]
    }

    private drawLine(canvasContext: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
        canvasContext.beginPath();
        canvasContext.moveTo(x1, y1);
        canvasContext.lineTo(x2, y2);
        canvasContext.stroke();
        canvasContext.closePath();
    }
}
