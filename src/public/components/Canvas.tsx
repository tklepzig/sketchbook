import * as React from "react";
import { CompositeOperation, FontSize, InputMode, Line, PageElement, Point } from "../models/RootState";
import { CanvasContext } from "../services/CanvasContext";
import { CanvasDrawing } from "../services/CanvasDrawing";
import canvasHelper from "../services/CanvasHelper";
import { CanvasTexting } from "../services/CanvasTexting";
import { CanvasTranslate } from "../services/CanvasTranslate";
import { tapEvents } from "../services/TapEvents";

interface CanvasProps {
    inputMode: InputMode;
    fontSize: number;
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

export default class Canvas extends React.Component<CanvasProps, CanvasState> {
    private canvas: HTMLCanvasElement | null = null;
    private textarea: HTMLTextAreaElement | null = null;
    private isTranslateMode = false;
    private tapIsDown: boolean = false;
    private canvasContext: CanvasContext;
    private canvasTranslate: CanvasTranslate;
    private canvasDrawing: CanvasDrawing;
    private canvasTexting: CanvasTexting;

    constructor(props: CanvasProps) {
        super(props);
        this.tapDown = this.tapDown.bind(this);
        this.tapUp = this.tapUp.bind(this);
        this.tapMove = this.tapMove.bind(this);
        this.resize = this.resize.bind(this);
        this.textAreaTextChanged = this.textAreaTextChanged.bind(this);

        this.state = { textareaState: { position: { x: 0, y: 0 }, isVisible: false, text: "" } };

        this.canvasContext = new CanvasContext(() => this.canvas == null ? null : this.canvas.getContext("2d"));

        // TODO: maybe singletons (so use export default new ...())
        this.canvasTranslate = new CanvasTranslate();
        this.canvasDrawing = new CanvasDrawing();
        this.canvasTexting = new CanvasTexting();
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
        this.updateCanvasConfig(newProps);
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
                    cols={30}
                    rows={4}
                    className={`fs-${this.props.fontSize.toString()}`}
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

    private tapDown(e: any) {
        this.tapIsDown = true;
        const touchCount = tapEvents.getTouchCount(e);
        this.isTranslateMode = touchCount === 2 || e.ctrlKey;
        const tapDownPoint = this.canvasContext.getTransformedPoint(tapEvents.getTapPosition(e));

        if (this.isTranslateMode) {
            this.canvasTranslate.startTranslate(tapDownPoint);
            this.canvasDrawing.repaint(this.canvasContext, this.props.elements);
        } else if (this.props.inputMode === "pen") {
            this.canvasDrawing.startLine(this.canvasContext, tapDownPoint);
        } else if (this.props.inputMode === "text") {

            if (this.state.textareaState.text.length > 0) {
                this.addCurrentTextToCanvas();
            } else {
                this.showTextarea(tapDownPoint);
            }
        }
    }

    private tapMove(e: any) {
        if (!this.tapIsDown) {
            return;
        }

        const tapDownPoint = this.canvasContext.getTransformedPoint(tapEvents.getTapPosition(e));

        if (this.isTranslateMode) {
            this.canvasTranslate.translate(this.canvasContext, tapDownPoint);
            this.canvasDrawing.repaint(this.canvasContext, this.props.elements);
        } else if (this.props.inputMode === "pen") {
            this.canvasDrawing.addSegmentToLine(this.canvasContext, tapDownPoint);
        }
    }

    private tapUp() {
        if (!this.tapIsDown) {
            return;
        }
        this.tapIsDown = false;

        if (this.props.inputMode === "pen") {
            this.props.onLineAdded(this.canvasDrawing.endLine());
        }
    }

    private resize() {
        canvasHelper.setCanvasSize(this.canvasContext, window.innerWidth, window.innerHeight);
        this.updateCanvasConfig(this.props);
        this.canvasDrawing.repaint(this.canvasContext, this.props.elements);
    }

    private textAreaTextChanged(e: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({ textareaState: { ...this.state.textareaState, text: e.target.value } });
    }

    private updateCanvasConfig(props: CanvasProps) {
        this.canvasContext.doCanvasAction((context) => {
            context.font = `${props.fontSize}pt Handlee`;
            context.textBaseline = "hanging";
            context.lineCap = "round";
            context.lineWidth = props.lineWidth;
            context.strokeStyle = props.color;
            context.globalCompositeOperation = props.compositeOperation;
        });
    }
    private addCurrentTextToCanvas() {
        this.canvasTexting.addText(
            this.canvasContext,
            this.state.textareaState.text,
            this.state.textareaState.position);

        this.setState({ textareaState: { ...this.state.textareaState, text: "", isVisible: false } });
    }
    private showTextarea(position: Point) {
        this.setState({
            textareaState: {
                ...this.state.textareaState,
                position,
                isVisible: true
            }
        }, () => {
            setTimeout(() => {
                if (this.textarea !== null) {
                    this.textarea.focus();
                }
            });
        });
    }
}
