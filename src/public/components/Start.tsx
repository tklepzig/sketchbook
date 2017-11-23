import * as React from "react";
import { connect } from "react-redux";
import { RootState } from "../models/RootState";
import { DrawingHandler } from "../services/DrawingHandler";
import Canvas, { DrawMode } from "./Canvas";
import { Menu } from "./Menu";
import Splash from "./Splash";

export interface StartProps {
    color: string;
    lineWidth: number;
    drawMode: DrawMode;
}

class Start extends React.Component<StartProps> {
    private drawingHandler: DrawingHandler;
    constructor() {
        super();
        this.tapDown = this.tapDown.bind(this);
        this.tapMove = this.tapMove.bind(this);
        this.tapUp = this.tapUp.bind(this);
        this.mouseOut = this.mouseOut.bind(this);
        this.mouseOut = this.mouseOut.bind(this);

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
                    color={this.props.color}
                    drawMode={this.props.drawMode}
                    lineWidth={this.props.lineWidth}
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

function mapStateToProps(state: RootState): StartProps {
    const { color, strokeWidth } = state.pen;
    let colorHexCode: string;
    let lineWidth: number;
    let drawMode = DrawMode.Above;

    switch (color) {
        case "black":
            colorHexCode = "#1d1d1d";
            break;
        case "grey":
            colorHexCode = "#b9afb0";
            drawMode = DrawMode.Below;
            break;
        case "blue":
            colorHexCode = "#4595d8";
            drawMode = DrawMode.Below;
            break;
        case "orange":
            colorHexCode = "#f9a765";
            drawMode = DrawMode.Below;
            break;
        // TODO: redundant defintion of default value for color
        default:
            colorHexCode = "#1d1d1d";
            break;
    }

    switch (strokeWidth) {
        case "s":
            lineWidth = 4;
            break;
        case "m":
            lineWidth = 10;
            break;
        case "l":
            lineWidth = 20;
            break;
        // TODO: redundant defintion of default value for lineWidth
        default:
            lineWidth = 4;
            break;
    }

    return { color: colorHexCode, lineWidth, drawMode };
}

export default connect<StartProps, {}, {}, RootState>(
    mapStateToProps
)(Start);
