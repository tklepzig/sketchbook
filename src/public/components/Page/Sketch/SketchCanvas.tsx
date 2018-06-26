import Canvas from "@components/Canvas";
import { Textarea } from "@components/Page/Sketch/Textarea";
import { CanvasContext } from "@services/CanvasContext";
import { CanvasDrawing } from "@services/CanvasDrawing";
import canvasHelper from "@services/CanvasHelper";
import { tapEvents } from "@services/TapEvents";
import { CompositeOperation, InputMode, Line, PageElement, Point, Text } from "@shared/models";
import * as React from "react";
import { bind } from "react.ex";

interface SketchCanvasProps {
    inputMode: InputMode;
    fontSize: number;
    color: string;
    lineWidth: number;
    compositeOperation: CompositeOperation;
    elements: PageElement[];
    center: Point;
    onLineAdded: (line: Line) => void;
    onTextAdded: (text: Text) => void;
}

interface SketchCanvasState {
    textareaState: {
        position: Point,
        isVisible: boolean,
        text: string
    };
    center: Point;
}

export default class SketchCanvas extends React.Component<SketchCanvasProps, SketchCanvasState> {
    private userAddedElement = false;
    private canvas: Canvas | null = null;
    private textarea: Textarea | null = null;
    private tapIsDown: boolean = false;
    private canvasDrawing: CanvasDrawing;

    constructor(props: SketchCanvasProps) {
        super(props);

        this.state = {
            textareaState: {
                position: { x: 0, y: 0 },
                isVisible: false,
                text: ""
            },
            center: { x: 0, y: 0 }
        };

        this.canvasDrawing = new CanvasDrawing();
    }

    public componentWillReceiveProps(newProps: SketchCanvasProps) {
        if (newProps.inputMode !== "text") {
            this.setState({ textareaState: { ...this.state.textareaState, isVisible: false, text: "" } });
        }

        if (this.canvas) {
            this.updateCanvasConfig(this.canvas.getContext(), newProps);
        }

        if (!this.userAddedElement && this.canvas) {
            // only repaint if the change was NOT triggered by the user
            this.canvasDrawing.repaint(this.canvas.getContext(), newProps.elements);
        } else {
            this.userAddedElement = false;
        }
    }

    public render() {
        const { x, y } = this.state.textareaState.position;
        const textarea = this.state.textareaState.isVisible
            ? (
                <Textarea
                    ref={(ta) => { this.textarea = ta; }}
                    position={{ x, y }}
                    fontSize={this.props.fontSize}
                    text={this.state.textareaState.text}
                    onTextChanged={this.textAreaTextChanged}
                    onRequestClose={this.textAreaRequestClose}
                />)
            : null;

        return (
            <>
                <Canvas
                    className="sketch"
                    translate={true}
                    zoom={true}
                    ref={(canvas) => { this.canvas = canvas; }}
                    onRepaint={this.repaint}
                    onResize={this.resize}
                    onTapDown={this.tapDown}
                    onTapMove={this.tapMove}
                    onTapUp={this.tapUp}
                />
                {textarea}
            </>);
    }

    @bind
    private tapDown(canvasContext: CanvasContext, e: any) {
        this.tapIsDown = true;
        const originalTapDownPoint = tapEvents.getTapPosition(e);
        const tapDownPoint = canvasContext.getTransformedPoint(originalTapDownPoint);

        if (this.props.inputMode === "pen") {
            this.canvasDrawing.startLine(canvasContext, tapDownPoint);
        } else if (this.props.inputMode === "text") {
            if (this.state.textareaState.text.length > 0) {
                this.addCurrentTextToCanvas(canvasContext);
            } else {
                this.showTextarea(originalTapDownPoint);
            }
        }
    }

    @bind
    private tapMove(canvasContext: CanvasContext, e: any) {
        if (!this.tapIsDown) {
            return;
        }

        const tapDownPoint = canvasContext.getTransformedPoint(tapEvents.getTapPosition(e));

        if (this.props.inputMode === "pen") {
            this.canvasDrawing.addSegmentToLine(canvasContext, tapDownPoint);
        }
    }

    @bind
    private tapUp() {
        if (!this.tapIsDown) {
            return;
        }
        this.tapIsDown = false;

        if (this.props.inputMode === "pen") {
            this.userAddedElement = true;
            this.props.onLineAdded(this.canvasDrawing.endLine());
        }
    }

    @bind
    private resize(canvasContext: CanvasContext) {
        canvasHelper.setCanvasSize(canvasContext, window.innerWidth, window.innerHeight);
        this.updateCanvasConfig(canvasContext, this.props);
        this.canvasDrawing.repaint(canvasContext, this.props.elements);
    }

    @bind
    private repaint(canvasContext: CanvasContext) {
        this.canvasDrawing.repaint(canvasContext, this.props.elements);
    }

    @bind
    private textAreaTextChanged(text: string) {
        this.setState({ textareaState: { ...this.state.textareaState, text } });
    }

    @bind
    private textAreaRequestClose() {
        if (!this.canvas) {
            return;
        }

        if (this.state.textareaState.text.length > 0) {
            this.addCurrentTextToCanvas(this.canvas.getContext());
        } else {
            this.setState({ textareaState: { ...this.state.textareaState, text: "", isVisible: false } });
        }
    }

    private updateCanvasConfig(canvasContext: CanvasContext, props: SketchCanvasProps) {
        canvasContext.doCanvasAction((context) => {
            context.lineCap = "round";
            context.lineWidth = props.lineWidth;
            context.strokeStyle = props.color;
            context.globalCompositeOperation = props.compositeOperation;
        });

        if (props.center !== this.state.center) {
            this.setState({ center: props.center }, () => {
                this.setCenter(canvasContext);
            });
        }
    }

    private addCurrentTextToCanvas(canvasContext: CanvasContext) {
        const text = this.canvasDrawing.addText(
            canvasContext,
            this.state.textareaState.text,
            canvasContext.getTransformedPoint(this.state.textareaState.position),
            this.props.fontSize);

        this.userAddedElement = true;
        this.props.onTextAdded(text);
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
            if (this.textarea !== null) {
                this.textarea.focus();
            }
        });
    }

    private setCenter(canvasContext: CanvasContext) {
        canvasContext.doCanvasAction((context) => {
            let { x, y } = this.state.center;
            x -= context.canvas.width / 2;
            y -= context.canvas.height / 2;

            canvasContext.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
            canvasContext.translate(-x, -y);
            this.canvasDrawing.repaint(canvasContext, this.props.elements);
        });
    }
}
