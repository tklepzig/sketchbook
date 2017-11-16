import * as React from "react";
import { DrawingHandler } from "../services/DrawingHandler";

export interface CanvasProps {
}

export default class Canvas extends React.Component<CanvasProps, any> {
    private drawingHandler: DrawingHandler;
    private getTouchCount: (e: any) => any;
    private getTapPosition: (e: any) => { x: any; y: any; };
    private moveEvent: string;
    private upEvent: string;
    private downEvent: string;
    private canvas: HTMLCanvasElement | null;

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

        this.drawingHandler = new DrawingHandler();
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

        // for black lines
        context.strokeStyle = "#1d1d1d";
        context.globalCompositeOperation = "source-over";


        setTimeout(() => {
            // for colored lines
            context.strokeStyle = "rgb(0,120,0)";
            context.globalCompositeOperation = "destination-over";
        }, 10000);
    }

    private tapDown(e: any) {

        const { x, y } = this.getTapPosition(e);
        this.drawingHandler.tapDown(this.getCanvasContext(), x, y);
    }
    private tapMove(e: any) {
        const { x, y } = this.getTapPosition(e);
        this.drawingHandler.tapMove(this.getCanvasContext(), x, y);
    }
    private tapUp() {
        this.drawingHandler.tapUp();
    }

    private resize() {
        if (this.canvas == null) {
            return;
        }
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.initializeCanvas();
    }



    private deviceSupportsTouchEvents() {
        return "ontouchstart" in window;
    }
}
