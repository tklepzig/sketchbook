import * as React from "react";
import { DrawingHandler } from "../services/DrawingHandler";
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

        this.state = { color: "black", drawMode: DrawMode.Above, lineWidth: 4 };

        this.drawingHandler = new DrawingHandler();
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
            ), <Menu key="menu" />,
            // <div key="overlay" className="overlay">
            // <div className="content"></div>
            // </div>
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
