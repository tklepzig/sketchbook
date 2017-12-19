import { Line, PageElement, Point } from "../models/RootState";
import { CanvasContext } from "./CanvasContext";
import pageElementHelper from "./PageElementHelper";

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

    public repaint(canvasContext: CanvasContext, elements: PageElement[]) {

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

            // if (props.lines.length > 4) {
            // faster, bot wrong detail (lines are not in the right order)
            // drawLinesSortedAndGrouped(context, { left, top, right, bottom });
            // } else {
            this.drawPageElements(
                context,
                elements,
                { left, top, right, bottom });
            // }

            context.lineWidth = savedLineWidth;
            context.strokeStyle = savedStrokeStyle;
            context.globalCompositeOperation = savedGlobalCompositeOperation;
        });
    }

    private drawSegment(
        canvasContext: CanvasRenderingContext2D,
        segment: {
            start: Point,
            end: Point
        }) {
        canvasContext.beginPath();
        canvasContext.moveTo(segment.start.x, segment.start.y);
        canvasContext.lineTo(segment.end.x, segment.end.y);
        canvasContext.stroke();
        canvasContext.closePath();
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
                context.font = `${element.fontSize}pt Handlee`;
                // TODO: draw text, is currently in CanvasTexting
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
        if (boundary) {
            const { top, left, right, bottom } = boundary;

            if (
                (segment.start.x > left
                    && segment.start.x < right
                    && segment.start.y > top
                    && segment.start.y < bottom)
                ||
                (segment.end.x > left
                    && segment.end.x < right
                    && segment.end.y > top
                    && segment.end.y < bottom)) {
                return true;
            }
        } else {
            return true;
        }

        return false;
    }

    // private refreshLinesGroupedByColorAndWidth() {
    //     this.linesGroupedByColorAndWidth =
    //         groupBy(
    //             this.props.lines.sort((l1: Line, l2: Line) => l1.color > l2.color ? 1 : -1),
    //             (line) => `${line.color}|${line.lineWidth}|${line.globalCompositeOperation}`);
    // }

    // private drawLinesSortedAndGrouped(
    //     canvasContext: CanvasRenderingContext2D,
    //     boundary: {
    //         left: number,
    //         top: number,
    //         right: number,
    //         bottom: number
    //     }) {

    //     const { top, left, right, bottom } = boundary;

    //     for (const key in this.linesGroupedByColorAndWidth) {
    //         if (!this.linesGroupedByColorAndWidth.hasOwnProperty(key)) {
    //             continue;
    //         }

    //         const lines = this.linesGroupedByColorAndWidth[key];

    //         canvasContext.beginPath();
    //         const [color, lineWidth, globalCompositeOperation] = key.split("|");
    //         canvasContext.strokeStyle = color;
    //         canvasContext.lineWidth = +lineWidth;
    //         canvasContext.globalCompositeOperation = globalCompositeOperation;

    //         lines.forEach((line: Line) => {
    //             line.segments.forEach((segment) => {
    //                 if (
    //                     (segment.start.x > left
    //                         && segment.start.x < right
    //                         && segment.start.y > top
    //                         && segment.start.y < bottom)
    //                     ||
    //                     (segment.end.x > left
    //                         && segment.end.x < right
    //                         && segment.end.y > top
    //                         && segment.end.y < bottom)) {
    //                     canvasContext.moveTo(segment.start.x, segment.start.y);
    //                     canvasContext.lineTo(segment.end.x, segment.end.y);
    //                 }
    //             });
    //         });

    //         canvasContext.stroke();
    //         canvasContext.closePath();
    //     }
    // }
}

// from https://gist.github.com/bryandh/c0cd25df7ccfdf891bf782174535f4ca
// function groupBy<T>(collection: T[], property: (item: T) => any): any {
//     return collection.reduce(
//         (prev: any, next: any) => {
//             // Get the group name from the property function, this will be the index of the group in the array
//             const groupName = property(next);
//             // Set the group in the array to either its previous value (prev[groupName])
//             // if that exists, otherwise fill it with an empty array
//             prev[groupName] = prev[groupName] || [];
//             // Add the next item to the group's array
//             prev[groupName].push(next);
//             return prev;
//         },
//         Object.create([])
//     );
// }
