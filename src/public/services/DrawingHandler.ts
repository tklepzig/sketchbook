import { Line, PageElement, PageElementKind, Point } from "../models/RootState";
import { CanvasContext } from "./CanvasContext";
import pageElementHelper from "./PageElementHelper";

export class DrawingHandler {

    public setCanvasSize(
        canvasContext: CanvasContext,
        width: number,
        height: number) {
        const currentTransform = canvasContext.getTransform();
        canvasContext.doCanvasAction((context) => {
            context.canvas.width = window.innerWidth;
            context.canvas.height = window.innerHeight;
        });

        const { a, b, c, d, e, f } = currentTransform;
        canvasContext.setTransform(a, b, c, d, e, f);
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
