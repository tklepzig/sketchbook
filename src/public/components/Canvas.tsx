import * as React from "react";
import { CompositeOperation, FontSize, InputMode, Line, PageElement, Point } from "../models/RootState";
import { CanvasTransform } from "../services/CanvasTransform";
import { DrawingHandler } from "../services/DrawingHandler";
import { tapEvents } from "../services/TapEvents";

export enum PenMode {
    Draw,
    Translate
}

export interface CanvasProps {
    inputMode: InputMode;
    fontSize: FontSize;
    color: string;
    lineWidth: number;
    compositeOperation: CompositeOperation;
    elements: PageElement[];
    onLineAdded: (line: Line) => void;
}

export default class Canvas extends React.Component<CanvasProps> {
    private drawingHandler: DrawingHandler;
    private linesGroupedByColorAndWidth: Line[][];
    private canvas: HTMLCanvasElement | null;
    private canvasTransform: CanvasTransform;

    private mouseIsDown: boolean;
    private currentPenMode: PenMode = PenMode.Draw;
    private tapDownPoint: Point;
    private currentLine: Line;

    constructor(props: CanvasProps) {
        super(props);
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
        this.tapDownPoint = pt;

        switch (this.currentPenMode) {
            case PenMode.Draw:

                this.currentLine = {
                    color: canvasContext.strokeStyle.toString(),
                    globalCompositeOperation: canvasContext.globalCompositeOperation,
                    kind: "line",
                    lineWidth: canvasContext.lineWidth,
                    segments: []
                };

                const segment = { start: pt, end: pt };
                this.drawingHandler.drawSegment(canvasContext, segment);
                this.currentLine.segments.push(segment);
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
                const segment = { start: this.tapDownPoint, end: pt };
                this.drawingHandler.drawSegment(canvasContext, segment);
                this.currentLine.segments.push(segment);
                this.tapDownPoint = pt;
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
        context.globalCompositeOperation = props.compositeOperation;
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
        this.drawingHandler.drawPageElements(
            context,
            this.props.elements,
            { left, top, right, bottom });
        // }

        context.lineWidth = this.props.lineWidth;
        context.strokeStyle = this.props.color;
        context.globalCompositeOperation = this.props.compositeOperation;
    }
}
