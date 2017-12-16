import * as React from "react";
import { CompositeOperation, FontSize, InputMode, Line, PageElement, Point } from "../models/RootState";
import { CanvasTransform } from "../services/CanvasTransform";
import { DrawingHandler } from "../services/DrawingHandler";
import { tapEvents } from "../services/TapEvents";

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
    textareaState: {
        position: Point,
        isVisible: boolean,
        text: string
    };
}

export default class Canvas2 extends React.Component<CanvasProps, CanvasState> {
    private canvas: HTMLCanvasElement | null;
    private textarea: HTMLTextAreaElement | null;

    private isTranslateMode = false;
    private tapIsDown: boolean;
    private drawingHandler: DrawingHandler;
    private canvasTransform: CanvasTransform;

    constructor(props: CanvasProps) {
        super(props);
        this.tapDown = this.tapDown.bind(this);
        this.tapUp = this.tapUp.bind(this);
        this.tapMove = this.tapMove.bind(this);
        this.resize = this.resize.bind(this);
        this.textAreaTextChanged = this.textAreaTextChanged.bind(this);

        this.state = { textareaState: { position: { x: 0, y: 0 }, isVisible: false, text: "" } };

        this.canvasTransform = new CanvasTransform();
        this.drawingHandler = new DrawingHandler();
    }

    public componentDidMount() {
        this.resize();
        window.addEventListener("resize", this.resize);
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", this.resize);
    }

    public componentWillReceiveProps(newProps: CanvasProps) {
        if (newProps.inputMode !== "text") {
            this.setState({ textareaState: { ...this.state.textareaState, isVisible: false, text: "" } });
        }
        this.doCanvasAction((context) => this.updateCanvasConfig(context, newProps));
    }

    public render() {
        const { x, y } = this.state.textareaState.position;
        const textarea = this.state.textareaState.isVisible
            ? (
                <textarea
                    style={{ left: x, top: y }}
                    ref={(ta) => { this.textarea = ta; }}
                    value={this.state.textareaState.text}
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
            </React.Fragment>);
    }

    private tapDown(e: any) {
        this.doCanvasAction((context) => {

            this.tapIsDown = true;
            const touchCount = tapEvents.getTouchCount(e);
            this.isTranslateMode = touchCount === 2 || e.ctrlKey;

            if (this.isTranslateMode) {
                // startTranslate();
            } else if (this.props.inputMode === "pen") {
                // startLine();
            } else if (this.props.inputMode === "text") {
                // showTextArea();
            }
        });
    }

    private tapMove() {
        if (!this.tapIsDown) {
            return;
        }

        if (this.isTranslateMode) {
            // translate();
        } else if (this.props.inputMode === "pen") {
            // addSegmentToLine();
        }
    }

    private tapUp() {
        this.tapIsDown = false;

        if (this.isTranslateMode) {
            // endTranslate();
        } else if (this.props.inputMode === "pen") {
            // endLine();
        } else if (this.props.inputMode === "text") {
            // addTextToPage();
        }
    }

    private resize() {
        this.doCanvasAction((context) => {
            this.drawingHandler.setCanvasSize(context, this.canvasTransform, window.innerWidth, window.innerHeight);
            this.updateCanvasConfig(context, this.props);
            this.drawingHandler.repaint(context, this.canvasTransform, this.props.elements);
        });
    }

    private textAreaTextChanged(e: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({ textareaState: { ...this.state.textareaState, text: e.target.value } });
    }

    private updateCanvasConfig(context: CanvasRenderingContext2D, props: CanvasProps) {
        context.font = "20pt Arial";
        context.textBaseline = "hanging";
        context.lineCap = "round";
        context.lineWidth = props.lineWidth;
        context.strokeStyle = props.color;
        context.globalCompositeOperation = props.compositeOperation;
    }

    private doCanvasAction(action: (context: CanvasRenderingContext2D) => void) {
        if (this.canvas == null) {
            return;
        }

        const context = this.canvas.getContext("2d");

        if (context == null) {
            return;
        }

        action(context);
    }
}
