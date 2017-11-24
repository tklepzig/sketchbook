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
}

export default class Canvas extends React.Component<CanvasProps> {
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
        this.updateCanvasConfig(newProps);
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

    private updateCanvasConfig(props: CanvasProps) {
        const context = this.getCanvasContext();
        if (context == null) {
            return;
        }

        context.lineCap = "round";
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
        this.updateCanvasConfig(this.props);
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
