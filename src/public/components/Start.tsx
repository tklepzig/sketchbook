import * as React from "react";
import { DrawingHandler } from "../services/DrawingHandler";
import observer from "../services/Observer";
import Canvas, { DrawMode } from "./Canvas";
import Menu from "./Menu";
import Splash from "./Splash";

export interface StartState {
    color: string;
    drawMode: DrawMode;
    lineWidth: number;
}

export default class Start extends React.Component<any, StartState> {
    private drawingHandler: DrawingHandler;
    constructor() {
        super();
        this.tapDown = this.tapDown.bind(this);
        this.tapMove = this.tapMove.bind(this);
        this.tapUp = this.tapUp.bind(this);
        this.mouseOut = this.mouseOut.bind(this);
        this.mouseOut = this.mouseOut.bind(this);

        this.state = { color: "#1d1d1d", drawMode: DrawMode.Above, lineWidth: 4 };

        this.drawingHandler = new DrawingHandler();

        observer.subscribe("color", (color) => {
            switch (color) {
                case "black":
                    this.setState({ color: "#1d1d1d" });
                    break;
                case "grey":
                    this.setState({ color: "#b9afb0" });
                    break;
                case "blue":
                    this.setState({ color: "#4595d8" });
                    break;
                case "orange":
                    this.setState({ color: "#f9a765" });
                    break;
            }
        });

        observer.subscribe("strokeWidth", (strokeWidth) => {
            switch (strokeWidth) {
                case "s":
                    this.setState({ lineWidth: 4 });
                    break;
                case "m":
                    this.setState({ lineWidth: 10 });
                    break;
                case "l":
                    this.setState({ lineWidth: 20 });
                    break;
            }
        });
        observer.subscribe("drawMode", (drawMode) => {
            switch (drawMode) {
                case "above":
                    this.setState({ drawMode: DrawMode.Above });
                    break;
                case "below":
                    this.setState({ drawMode: DrawMode.Below });
                    break;
            }
        });
    }

    public componentDidMount() {
        window.addEventListener("mouseout", this.mouseOut);
    }

    public componentWillUnmount() {
        window.removeEventListener("mouseout", this.mouseOut);
    }

    public render() {
        return [
            <Splash key="splash" />,
            (
                <Canvas
                    onTapDown={this.tapDown}
                    onTapMove={this.tapMove}
                    onTapUp={this.tapUp}
                    drawMode={this.state.drawMode}
                    color={this.state.color}
                    lineWidth={this.state.lineWidth}
                    key="canvas"
                />
            ), <Menu key="menu" />
        ];
    }

    private mouseOut() {
        this.drawingHandler.tapUp();
    }

    private tapDown(
        canvasContext: CanvasRenderingContext2D,
        tapPosition: { x: number, y: number },
        touchCount: number) {
        const { x, y } = tapPosition;
        this.drawingHandler.tapDown(canvasContext, x, y);
    }
    private tapMove(
        canvasContext: CanvasRenderingContext2D,
        tapPosition: { x: number, y: number },
        touchCount: number) {
        const { x, y } = tapPosition;
        this.drawingHandler.tapMove(canvasContext, x, y);
    }
    private tapUp() {
        this.drawingHandler.tapUp();
    }
}
