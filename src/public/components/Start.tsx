import * as React from "react";
import { connect } from "react-redux";
import { RootState } from "../models/RootState";
import { DrawingHandler } from "../services/DrawingHandler";
import Canvas, { DrawMode } from "./Canvas";
import { Menu } from "./Menu";
import Splash from "./Splash";

export interface StartProps {
    color: string;
    strokeWidth: string;
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
                    drawMode={DrawMode.Above}
                    lineWidth={4}
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

function mapStateToProps(state: RootState) {
    const { color, strokeWidth } = state.pen;
    return { color, strokeWidth };
}

export default connect<StartProps, {}, {}, RootState>(
    mapStateToProps
)(Start);
