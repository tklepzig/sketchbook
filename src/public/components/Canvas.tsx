import * as React from "react";
import { Line } from "../models/Line";
import { CanvasTransform } from "../services/CanvasTransform";
import { DrawingHandler } from "../services/DrawingHandler";
import { tapEvents } from "../services/TapEvents";

export enum DrawMode {
    Above,
    Below
}

export enum PenMode {
    Draw,
    Translate
}

export interface CanvasProps {
    color: string;
    lineWidth: number;
    drawMode: DrawMode;
    lines: Line[];
    onLineAdded: (line: Line) => void;
}

export default class Canvas extends React.Component<CanvasProps> {
    private drawingHandler: DrawingHandler;
    private linesGroupedByColorAndWidth: Line[][];
    private canvas: HTMLCanvasElement | null;
    private canvasTransform: CanvasTransform;

    private mouseIsDown: boolean;
    private currentPenMode: PenMode = PenMode.Draw;
    private tapDownPoint: { x: number; y: number; };
    private currentLine: Line;

    constructor() {
        super();
        this.canvasTransform = new CanvasTransform();
        this.drawingHandler = new DrawingHandler();

        this.tapDown = this.tapDown.bind(this);
        this.tapUp = this.tapUp.bind(this);
        this.tapMove = this.tapMove.bind(this);
        this.resize = this.resize.bind(this);
        this.mouseOut = this.mouseOut.bind(this);
    }

    public render() {
        return (
            <canvas
                ref={(canvas) => { this.canvas = canvas; }}
                {...{ [tapEvents.tapDown]: this.tapDown }}
                {...{ [tapEvents.tapUp]: this.tapUp }}
                {...{ [tapEvents.tapMove]: this.tapMove }}
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

    private getCanvasContext() {
        if (this.canvas == null) {
            return null;
        }
        const context = this.canvas.getContext("2d");
        return context;
    }

    private tapDown(e: any) {
        const canvasContext = this.getCanvasContext();

        if (canvasContext === null) {
            return;
        }

        const { x, y } = tapEvents.getTapPosition(e);
        const touchCount = tapEvents.getTouchCount(e);
        this.mouseIsDown = true;
        this.currentPenMode = (touchCount === 2 || e.ctrlKey) ? PenMode.Translate : PenMode.Draw;

        const pt = this.canvasTransform.getTransformedPoint(canvasContext, x, y);
        this.tapDownPoint = {
            x: pt.x,
            y: pt.y
        };

        switch (this.currentPenMode) {
            case PenMode.Draw:

                this.currentLine = {
                    color: canvasContext.strokeStyle.toString(),
                    globalCompositeOperation: canvasContext.globalCompositeOperation,
                    lineWidth: canvasContext.lineWidth,
                    segments: []
                };
                this.drawingHandler.drawSegment(
                    canvasContext,
                    { x: pt.x, y: pt.y },
                    { x: pt.x + 0.1, y: pt.y + 0.1 });

                break;
            case PenMode.Translate:
                this.repaint();
                break;
        }
    }
    private tapMove(e: any) {
        const canvasContext = this.getCanvasContext();

        if (canvasContext === null) {
            return;
        }

        if (!this.mouseIsDown) {
            return;
        }

        const { x, y } = tapEvents.getTapPosition(e);
        const touchCount = tapEvents.getTouchCount(e);

        const pt = this.canvasTransform.getTransformedPoint(canvasContext, x, y);

        switch (this.currentPenMode) {
            case PenMode.Draw:
                this.drawingHandler.drawSegment(
                    canvasContext,
                    this.tapDownPoint,
                    pt);

                const segment = {
                    end: { x: pt.x, y: pt.y },
                    start: { x: this.tapDownPoint.x, y: this.tapDownPoint.y }
                };
                this.currentLine.segments.push(segment);

                this.tapDownPoint = {
                    x: pt.x,
                    y: pt.y
                };

                break;
            case PenMode.Translate:
                this.canvasTransform.translate(canvasContext, pt.x - this.tapDownPoint.x, pt.y - this.tapDownPoint.y);
                this.repaint();
                break;
        }
    }
    private tapUp() {
        if (!this.mouseIsDown) {
            return;
        }

        this.mouseIsDown = false;

        if (this.currentPenMode === PenMode.Draw) {
            // this.refreshLinesGroupedByColorAndWidth();
            this.props.onLineAdded(this.currentLine);
        }
    }
    private mouseOut() {
        this.tapUp();
    }
    private resize() {
        if (this.canvas == null) {
            return;
        }

        const canvasContext = this.getCanvasContext();

        if (canvasContext === null) {
            return;
        }

        this.setCanvasSize(window.innerWidth, window.innerHeight);
        this.updateCanvasConfig(this.props);
        this.repaint();
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
    private setCanvasSize(width: number, height: number) {
        if (this.canvas == null) {
            return;
        }

        const context = this.getCanvasContext();
        if (context == null) {
            return;
        }

        const currentTransform = this.canvasTransform.getTransform();

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        const { a, b, c, d, e, f } = currentTransform;
        this.canvasTransform.setTransform(context, a, b, c, d, e, f);
    }
    private repaint() {
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
        this.drawingHandler.drawLines(
            context,
            this.props.lines,
            { left, top, right, bottom });
        // }

        context.lineWidth = this.props.lineWidth;
        context.strokeStyle = this.props.color;
        context.globalCompositeOperation = this.props.drawMode === DrawMode.Above ? "source-over" : "destination-over";
    }
}
