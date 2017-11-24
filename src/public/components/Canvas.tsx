import * as React from "react";
import { Line } from "../models/Line";
import { CanvasTransform } from "../services/CanvasTransform";

export enum DrawMode {
    Above,
    Below
}

export interface CanvasProps {
    color: string;
    lineWidth: number;
    drawMode: DrawMode;
    lines: Line[];
    onLineAdded: (line: Line) => void;
}

export default class Canvas extends React.Component<CanvasProps> {
    private linesGroupedByColorAndWidth: Line[][];
    private getTouchCount: (e: any) => any;
    private getTapPosition: (e: any) => { x: any; y: any; };
    private moveEvent: string;
    private upEvent: string;
    private downEvent: string;
    private canvas: HTMLCanvasElement | null;
    private canvasTransform: CanvasTransform;
    private mouseIsDown: boolean;
    private tapDownPoint: { x: number; y: number; };
    private currentLine: Line;

    constructor() {
        super();
        this.canvasTransform = new CanvasTransform();

        this.tapDown = this.tapDown.bind(this);
        this.tapUp = this.tapUp.bind(this);
        this.tapMove = this.tapMove.bind(this);
        this.resize = this.resize.bind(this);
        this.mouseOut = this.mouseOut.bind(this);

        this.downEvent = this.deviceSupportsTouchEvents() ? "onTouchStart" : "onMouseDown";
        this.upEvent = this.deviceSupportsTouchEvents() ? "onTouchEnd" : "onMouseUp";
        this.moveEvent = this.deviceSupportsTouchEvents() ? "onTouchMove" : "onMouseMove";

        if (this.deviceSupportsTouchEvents()) {
            this.getTapPosition = (e: any) => ({
                x: e.targetTouches[0].pageX,
                y: e.targetTouches[0].pageY
            });
            this.getTouchCount = (e: any) => e.touches.length;
        } else {
            this.getTapPosition = (e: any) => ({
                x: e.pageX, y: e.pageY
            });
            this.getTouchCount = (e: any) => 1;
        }
    }

    public render() {

        const downEventAttribute = { [this.downEvent]: this.tapDown };
        const upEventAttribute = { [this.upEvent]: this.tapUp };
        const moveEventAttribute = { [this.moveEvent]: this.tapMove };

        return (
            <canvas
                ref={(canvas) => { this.canvas = canvas; }}
                {...downEventAttribute}
                {...upEventAttribute}
                {...moveEventAttribute}
            />);
    }

    public componentDidMount() {
        this.resize();
        window.addEventListener("resize", this.resize);
        window.addEventListener("mouseout", this.mouseOut);
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", this.resize);
        window.removeEventListener("mouseout", this.mouseOut);
    }

    public componentWillReceiveProps(newProps: CanvasProps) {
        this.update(newProps, false);
    }

    public repaint() {
        if (this.canvas == null) {
            return null;
        }

        const context = this.getCanvasContext();
        if (context == null) {
            return;
        }

        this.canvasTransform.save(context);
        this.canvasTransform.setTransform(context, 1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvasTransform.restore(context);

        // limit redrawing area to increase performance
        let left = -this.canvasTransform.getTranslateX();
        let top = -this.canvasTransform.getTranslateY();
        let right = left + this.canvas.width;
        let bottom = top + this.canvas.height;

        // offset
        left -= 40;
        top -= 40;
        right += 40;
        bottom += 40;

        // if (this.props.lines.length > 4) {
        // faster, bot wrong detail (lines are not in the right order)
        // this.drawLinesSortedAndGrouped(context, { left, top, right, bottom });
        // } else {
        this.drawLines(context, { left, top, right, bottom });
        // }

        context.lineWidth = this.props.lineWidth;
        context.strokeStyle = this.props.color;
        context.globalCompositeOperation = this.props.drawMode === DrawMode.Above ? "source-over" : "destination-over";
    }

    private mouseOut() {
        this.completeLine();
    }

    private getCanvasContext() {
        if (this.canvas == null) {
            return null;
        }
        const context = this.canvas.getContext("2d");
        return context;
    }

    private update(props: CanvasProps, repaint: boolean) {
        const context = this.getCanvasContext();
        if (context == null) {
            return;
        }

        context.lineCap = "round";

        if (repaint) {
            this.repaint();
        }

        context.lineWidth = props.lineWidth;
        context.strokeStyle = props.color;
        context.globalCompositeOperation = props.drawMode === DrawMode.Above ? "source-over" : "destination-over";
    }

    private tapDown(e: any) {
        const canvasContext = this.getCanvasContext();

        if (canvasContext === null) {
            return;
        }

        const tapPosition = this.getTapPosition(e);
        const touchCount = this.getTouchCount(e);
        const { x, y } = tapPosition;

        this.startLine(canvasContext, x, y);
    }
    private tapMove(e: any) {
        const canvasContext = this.getCanvasContext();

        if (canvasContext === null) {
            return;
        }

        const tapPosition = this.getTapPosition(e);
        const touchCount = this.getTouchCount(e);
        const { x, y } = tapPosition;

        this.addSegmentToLine(canvasContext, x, y);
    }
    private tapUp() {
        this.completeLine();
    }

    private resize() {
        if (this.canvas == null) {
            return;
        }
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.update(this.props, true);
    }

    private deviceSupportsTouchEvents() {
        return "ontouchstart" in window;
    }

    private startLine(canvasContext: CanvasRenderingContext2D, x: number, y: number) {
        const pt = this.canvasTransform.getTransformedPoint(canvasContext, x, y);

        this.currentLine = {
            color: canvasContext.strokeStyle.toString(),
            globalCompositeOperation: canvasContext.globalCompositeOperation,
            lineWidth: canvasContext.lineWidth,
            segments: []
        };
        this.drawLine(canvasContext, pt.x, pt.y, pt.x + 0.1, pt.y + 0.1);

        this.mouseIsDown = true;
        this.tapDownPoint = {
            x: pt.x,
            y: pt.y
        };
    }

    private addSegmentToLine(canvasContext: CanvasRenderingContext2D, x: number, y: number) {
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

    private completeLine() {
        if (!this.mouseIsDown) {
            return;
        }

        this.mouseIsDown = false;

        // this.refreshLinesGroupedByColorAndWidth();
        this.props.onLineAdded(this.currentLine);
    }

    private drawLine(canvasContext: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
        canvasContext.beginPath();
        canvasContext.moveTo(x1, y1);
        canvasContext.lineTo(x2, y2);
        canvasContext.stroke();
        canvasContext.closePath();
    }

    private drawLines(
        canvasContext: CanvasRenderingContext2D,
        boundary: {
            left: number,
            top: number,
            right: number,
            bottom: number
        }) {

        const { top, left, right, bottom } = boundary;

        this.props.lines.forEach((line) => {
            canvasContext.beginPath();
            canvasContext.strokeStyle = line.color;
            canvasContext.lineWidth = line.lineWidth;
            canvasContext.globalCompositeOperation = line.globalCompositeOperation;

            line.segments.forEach((segment) => {
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
                    canvasContext.moveTo(segment.start.x, segment.start.y);
                    canvasContext.lineTo(segment.end.x, segment.end.y);
                }
            });

            canvasContext.stroke();
            canvasContext.closePath();
        });
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
