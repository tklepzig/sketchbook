import { CanvasContext } from "@services/CanvasContext";
import pageElementHelper from "@services/PageElementHelper";
import { Line, PageElement, Point, Text } from "@shared/models";

export class CanvasDrawing {
    private currentLine: Line;
    private startPoint: Point;

    public startLine(canvasContext: CanvasContext, tapDownPoint: Point) {
        this.startPoint = tapDownPoint;

        canvasContext.doCanvasAction((context) => {
            this.currentLine = {
                color: context.strokeStyle.toString(),
                globalCompositeOperation: context.globalCompositeOperation,
                kind: "line",
                lineWidth: context.lineWidth,
                segments: []
            };

            const segment = { start: tapDownPoint, end: tapDownPoint };
            this.drawSegment(context, segment);
            this.currentLine.segments.push(segment);
        });
    }

    public addSegmentToLine(canvasContext: CanvasContext, tapDownPoint: Point) {
        const segment = { start: this.startPoint, end: tapDownPoint };
        canvasContext.doCanvasAction((context) => {
            this.drawSegment(context, segment);
            this.currentLine.segments.push(segment);
            this.startPoint = tapDownPoint;
        });
    }

    public endLine() {
        return this.currentLine;
    }

    public addText(canvasContext: CanvasContext, text: string, position: Point, fontSize: number): Text {
        let measurement = { width: 0, height: 0 };
        canvasContext.doCanvasAction((context) => {
            measurement = this.drawText(context, position, text, fontSize);
        });

        return { kind: "text", fontSize, position, measurement, text };
    }

    public repaint(canvasContext: CanvasContext, elements: PageElement[], limitToVisibleArea: boolean = true) {

        canvasContext.doCanvasAction((context) => {

            const savedLineWidth = context.lineWidth;
            const savedStrokeStyle = context.strokeStyle;
            const savedGlobalCompositeOperation = context.globalCompositeOperation;

            canvasContext.save();
            canvasContext.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
            canvasContext.restore();

            // limit redrawing area to increase performance
            let left = -canvasContext.getTranslateX();
            let top = -canvasContext.getTranslateY();
            let right = left + context.canvas.width;
            let bottom = top + context.canvas.height;

            // offset
            left -= 40;
            top -= 40;
            right += 40;
            bottom += 40;

            if (limitToVisibleArea) {
                this.drawPageElements(context, elements, { left, top, right, bottom });
            } else {
                this.drawPageElements(context, elements);
            }

            context.lineWidth = savedLineWidth;
            context.strokeStyle = savedStrokeStyle;
            context.globalCompositeOperation = savedGlobalCompositeOperation;
        });
    }

    private drawSegment(
        context: CanvasRenderingContext2D,
        segment: {
            start: Point,
            end: Point
        }) {
        context.beginPath();
        context.moveTo(segment.start.x, segment.start.y);
        context.lineTo(segment.end.x, segment.end.y);
        context.stroke();
        context.closePath();
    }

    private drawPageElements(
        context: CanvasRenderingContext2D,
        elements: PageElement[],
        boundary?: {
            left: number,
            top: number,
            right: number,
            bottom: number
        }) {
        elements.forEach((element) => {
            if (pageElementHelper.elementIsLine(element)) {
                context.beginPath();
                context.strokeStyle = element.color;
                context.lineWidth = element.lineWidth;
                context.globalCompositeOperation = element.globalCompositeOperation;

                element.segments.forEach((segment) => {
                    if (this.isSegmentInBoundary(segment, boundary)) {
                        context.moveTo(segment.start.x, segment.start.y);
                        context.lineTo(segment.end.x, segment.end.y);
                    }
                });

                context.stroke();
                context.closePath();
            } else if (pageElementHelper.elementIsText(element)) {
                this.drawText(context, element.position, element.text, element.fontSize);
            }
        });
    }

    private isSegmentInBoundary(
        segment: { start: Point, end: Point },
        boundary?: {
            left: number,
            top: number,
            right: number,
            bottom: number
        }): boolean {

        if (!boundary) {
            return true;
        }

        if (this.isPointInBoundary(segment.start, boundary)
            || this.isPointInBoundary(segment.end, boundary)) {
            return true;
        }

        return false;
    }

    private isPointInBoundary(
        point: Point,
        boundary: {
            left: number,
            top: number,
            right: number,
            bottom: number
        }) {
        const { top, left, right, bottom } = boundary;
        return (point.x > left
            && point.x < right
            && point.y > top
            && point.y < bottom);
    }

    private drawText(context: CanvasRenderingContext2D, position: Point, text: string, fontSize: number) {
        context.globalCompositeOperation = "source-over";
        context.font = `bold ${fontSize}pt Handlee`;
        context.textBaseline = "top";
        let top = position.y;
        let height = 0;
        let width = 0;
        for (const line of text.split("\n")) {
            context.fillText(line, position.x, top);
            top += (fontSize + 6) * 1.2;
            height += (fontSize + 6) * 1.2;

            const { width: lineWidth } = context.measureText(line);
            if (lineWidth > width) {
                width = lineWidth;
            }
        }
        return { width, height };
    }
}
