import { Line, PageElement, PageElementKind, Point } from "../models/RootState";
import pageElementHelper from "./PageElementHelper";
import { CanvasTransform } from "./CanvasTransform";

export class DrawingHandler {
    public drawSegment(
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

    public drawPageElements(
        canvasContext: CanvasRenderingContext2D,
        elements: PageElement[],
        boundary?: {
            left: number,
            top: number,
            right: number,
            bottom: number
        }) {
        elements.forEach((element) => {
            if (pageElementHelper.elementIsLine(element)) {
                canvasContext.beginPath();
                canvasContext.strokeStyle = element.color;
                canvasContext.lineWidth = element.lineWidth;
                canvasContext.globalCompositeOperation = element.globalCompositeOperation;

                element.segments.forEach((segment) => {
                    if (this.isSegmentInBoundary(segment, boundary)) {
                        canvasContext.moveTo(segment.start.x, segment.start.y);
                        canvasContext.lineTo(segment.end.x, segment.end.y);
                    }
                });

                canvasContext.stroke();
                canvasContext.closePath();
            }
        });
    }

    public repaint(context: CanvasRenderingContext2D, canvasTransform: CanvasTransform, elements: PageElement[]) {
        const savedLineWidth = context.lineWidth;
        const savedStrokeStyle = context.strokeStyle;
        const savedGlobalCompositeOperation = context.globalCompositeOperation;

        canvasTransform.save(context);
        canvasTransform.setTransform(context, 1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        canvasTransform.restore(context);

        // limit redrawing area to increase performance
        let left = -canvasTransform.getTranslateX();
        let top = -canvasTransform.getTranslateY();
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
    }

    public setCanvasSize(
        context: CanvasRenderingContext2D,
        canvasTransform: CanvasTransform,
        width: number,
        height: number) {
        const currentTransform = canvasTransform.getTransform();

        context.canvas.width = window.innerWidth;
        context.canvas.height = window.innerHeight;

        const { a, b, c, d, e, f } = currentTransform;
        canvasTransform.setTransform(context, a, b, c, d, e, f);
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
