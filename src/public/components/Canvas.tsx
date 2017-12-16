import * as React from "react";
import { CompositeOperation, FontSize, InputMode, Line, PageElement, Point } from "../models/RootState";
import { CanvasTransform } from "../services/CanvasTransform";
import { DrawingHandler } from "../services/DrawingHandler";
import { tapEvents } from "../services/TapEvents";

enum PenMode {
    Draw,
    Translate
}

interface CanvasProps {
    inputMode: InputMode;
    fontSize: FontSize;
    color: string;
    lineWidth: number;
    compositeOperation: CompositeOperation;
    elements: PageElement[];
    onLineAdded: (line: Line) => void;
}

interface CanvasState {
    textareaPosition: Point;
    textareaVisible: boolean;
    textAreaText: string;
}

export default class Canvas extends React.Component<CanvasProps, CanvasState> {
    private drawingHandler: DrawingHandler;
    private linesGroupedByColorAndWidth: Line[][];
    private canvas: HTMLCanvasElement | null;
    private textarea: HTMLTextAreaElement | null;
    private canvasTransform: CanvasTransform;

    private mouseIsDown: boolean;
    private currentPenMode: PenMode = PenMode.Draw;
    private tapDownPoint: Point;
    private currentLine: Line;

    constructor(props: CanvasProps) {
        super(props);
        this.state = { textareaPosition: { x: 0, y: 0 }, textareaVisible: false, textAreaText: "" };

        this.canvasTransform = new CanvasTransform();
        this.drawingHandler = new DrawingHandler();

        this.tapDown = this.tapDown.bind(this);
        this.tapUp = this.tapUp.bind(this);
        this.tapMove = this.tapMove.bind(this);
        this.textAreaTextChanged = this.textAreaTextChanged.bind(this);
        this.resize = this.resize.bind(this);
        this.mouseOut = this.mouseOut.bind(this);
    }

    public render() {
        const textareaStyle: React.CSSProperties = {
            position: "absolute",
            background: "transparent",
            fontFamily: "Arial",
            fontSize: "20pt",
            padding: 0,
            margin: 0,
            border: "1px solid #aaa",
            outline: "none",
            lineHeight: 1.2,
            left: this.state.textareaPosition.x,
            top: this.state.textareaPosition.y
        };

        const textarea = this.state.textareaVisible
            ? (
                <textarea
                    style={textareaStyle}
                    ref={(ta) => { this.textarea = ta; }}
                    value={this.state.textAreaText}
                    onChange={this.textAreaTextChanged}
                />)
            : null;

        return (
            <React.Fragment>
                <canvas
                    ref={(canvas) => { this.canvas = canvas; }}
                    {...{ [tapEvents.tapDown]: this.tapDown }}
                    {...{ [tapEvents.tapUp]: this.tapUp }}
                    {...{ [tapEvents.tapMove]: this.tapMove }}
                />
                {textarea}
            </React.Fragment>);
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
        if (newProps.inputMode !== "text") {
            this.setState({ textareaVisible: false, textAreaText: "" });
        }
        this.updateCanvasConfig(newProps);
    }

    private textAreaTextChanged(e: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({ textAreaText: e.target.value });
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
        const pt = this.canvasTransform.getTransformedPoint(canvasContext, x, y);
        this.tapDownPoint = pt;

        if (this.props.inputMode === "text") {
            if (this.state.textAreaText.length > 0) {
                let top = this.state.textareaPosition.y;
                for (const line of this.state.textAreaText.split("\n")) {
                    canvasContext.fillText(line,
                        this.state.textareaPosition.x,
                        top);
                    top += (20 + 6) * 1.2;
                }
                this.setState({ textAreaText: "", textareaVisible: false });
            } else {
                this.setState({ textAreaText: "", textareaPosition: pt, textareaVisible: true }, () => {
                    setTimeout(() => {
                        if (this.textarea !== null) {
                            this.textarea.focus();
                        }
                    });
                });
            }
            return;
        }

        this.mouseIsDown = true;
        this.currentPenMode = (touchCount === 2 || e.ctrlKey) ? PenMode.Translate : PenMode.Draw;

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
        if (this.props.inputMode === "text") {
            return;
        }

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
        if (this.props.inputMode === "text") {
            return;
        }
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

        context.font = "20pt Arial";
        context.textBaseline = "hanging";
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
