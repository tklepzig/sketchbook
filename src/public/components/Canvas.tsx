import * as React from "react";

export interface CanvasProps {
}

export default class Canvas extends React.Component<CanvasProps, any> {
    private getTouchCount: (e: any) => any;
    private getTapPosition: (e: any) => { x: any; y: any; };
    private moveEvent: string;
    private upEvent: string;
    private downEvent: string;
    private canvas: HTMLCanvasElement | null;
    private canvasContext: CanvasRenderingContext2D | null;

    constructor() {
        super();

        this.tapDown = this.tapDown.bind(this);
        this.tapUp = this.tapUp.bind(this);
        this.tapMove = this.tapMove.bind(this);
        this.resize = this.resize.bind(this);

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
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", this.resize);
    }

    private getCanvasContext() {
        if (this.canvas == null) {
            return null;
        }
        const context = this.canvas.getContext("2d");
        return context;
    }

    private initializeCanvas() {
        const context = this.getCanvasContext();
        if (context == null) {
            return;
        }

        context.lineCap = "round";
        context.lineWidth = 20;
        context.strokeStyle = "#1d1d1d";
    }

    private tapDown(e: any) {

        const { x, y } = this.getTapPosition(e);
        this.drawLine(x, y, x + 0.1, y + 0.1);
    }
    private tapMove(e: any) {
    }
    private tapUp(e: any) {
    }

    private resize() {
        if (this.canvas == null) {
            return;
        }
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.initializeCanvas();
    }

    private drawLine(x1: number, y1: number, x2: number, y2: number) {
        const context = this.getCanvasContext();
        if (context == null) {
            return;
        }

        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
        context.closePath();

        // const segment = {
        //     end: { x: x2, y: y2 },
        //     start: { x: x1, y: y1 }
        // };
        // this.currentLine.segments.push(segment);
    }

    private deviceSupportsTouchEvents() {
        return "ontouchstart" in window;
    }
}
